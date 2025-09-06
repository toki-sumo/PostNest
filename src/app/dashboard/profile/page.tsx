// src/app/dashboard/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import DashboardHeader from "../../../components/dashboard/DashboardHeader";
import Section from "../../../components/ui/Section";
import Notice from "../../../components/ui/Notice";
import Image from "next/image";

const ProfilePage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [processingDerived, setProcessingDerived] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [pendingAvatarUrl, setPendingAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarRetry, setAvatarRetry] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    if (session?.user) {
      setName(session.user.name || "");
      setBio(session.user.bio || "");
      setAvatarUrl((session.user.image as string | undefined) || "/guest_icon.png");
      setAvatarRetry(0);
    }
  }, [status, router, session]);

  const handleAvatarImgError = () => {
    if (!avatarUrl || avatarUrl.includes("/guest_icon.png")) return;
    if (avatarRetry < 2) {
      setAvatarRetry(avatarRetry + 1);
      const sep = avatarUrl.includes("?") ? "&" : "?";
      setAvatarUrl(`${avatarUrl}${sep}v=${Date.now()}`);
    } else {
      setAvatarUrl("/guest_icon.png");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const finalImage = pendingAvatarUrl ?? avatarUrl;
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, image: finalImage }),
      });
      if (res.ok) {
        await update({ name, bio, image: finalImage });
        // 保存確定: 表示URLに反映し、保留URLはクリア
        setAvatarUrl(finalImage);
        setPendingAvatarUrl(undefined);
        setMessage("保存しました。");
      } else {
        const error = await res.json();
        setMessage(`エラー: ${error.message}`);
      }
    } catch {
      setMessage("予期せぬエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    try {
      const contentType = file.type || "application/octet-stream";
      const pres = await fetch("/api/user/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType }),
      });
      if (!pres.ok) throw new Error("Failed to get presigned URL");
      const presJson: { url: string; fields: Record<string, string>; publicUrl: string } =
        await pres.json();
      const { url, fields, publicUrl } = presJson;

      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, String(v)));
      if (fields["Content-Type"]) {
        formData.append("Content-Type", contentType);
      }
      formData.append("file", file);

      const up = await fetch(url, { method: "POST", body: formData });
      if (!up.ok) {
        const errText = await up.text().catch(() => "");
        throw new Error(`Upload failed: ${up.status} ${errText?.slice(0, 200)}`);
      }

      setPendingAvatarUrl(publicUrl);
      setMessage(
        "アイコンをアップロードしました。最適化版が生成されるとプレビューに切替わります。保存すると確定します。",
      );
      // アップロードは完了したので、ここでアップロード中状態を解除
      setAvatarUploading(false);

      // 派生画像の自動検知と切替え（128px）
      try {
        const rawKey = fields["key"];
        const key: string | undefined = typeof rawKey === "string" ? rawKey : undefined;
        if (key && typeof key === "string" && publicUrl) {
          const origin = new URL(publicUrl).origin;
          const base = key.replace(/^avatars\/original\//, "").replace(/\.[^.]+$/, "");
          const derivedKey = `avatars/derived/${base}.128.jpeg`;
          const derivedUrl = `${origin}/${derivedKey}`;

          setProcessingDerived(true);
          const start = Date.now();
          const timeoutMs = 60_000;
          const intervalMs = 3_000;
          let switched = false;
          while (Date.now() - start < timeoutMs) {
            const resp = await fetch(derivedUrl, { method: "HEAD", cache: "no-store" });
            if (resp.ok) {
              setPendingAvatarUrl(derivedUrl);
              setMessage("最適化画像のプレビューに切替えました。保存すると確定します。");
              switched = true;
              break;
            }
            await new Promise((r) => setTimeout(r, intervalMs));
          }
          if (!switched) {
            setMessage(
              "最適化画像の生成を待機しましたが見つかりませんでした。時間をおいて再度お試しください。",
            );
          }
        }
      } finally {
        setProcessingDerived(false);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : typeof e === "string" ? e : "";
      setMessage(`アイコンのアップロードに失敗しました: ${message}`);
    } finally {
      setAvatarUploading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-400"></div>
            <p className="text-slate-300">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <DashboardHeader
        title="プロフィール編集"
        subtitle={`${session?.user?.name ?? ""} さんのプロフィール情報`}
      />

      <div className="space-y-8">
        <Section title="現在の情報">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full border">
                <Image
                  src={(pendingAvatarUrl ?? avatarUrl) || "/guest_icon.png"}
                  alt="avatar"
                  fill
                  className="object-cover"
                  onError={handleAvatarImgError}
                  sizes="64px"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAvatarUpload(f);
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading || processingDerived}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 hover:bg-[var(--card-hover)] disabled:opacity-50"
                >
                  {avatarUploading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent"></span>
                      アップロード中...
                    </span>
                  ) : processingDerived ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent"></span>
                      最適化中...
                    </span>
                  ) : (
                    "アイコンを選択"
                  )}
                </button>
                {processingDerived && (
                  <span className="text-xs text-[var(--muted)]">最適化中です...</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-[var(--muted)]">ユーザー名:</span>
              <span className="font-semibold text-[var(--text)]">
                {session?.user?.name || "未設定"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-[var(--muted)]">メールアドレス:</span>
              <span className="text-[var(--text)]/85">{session?.user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-[var(--muted)]">プロフィール:</span>
              <span className="text-[var(--text)]/85">{session?.user?.bio || "未設定"}</span>
            </div>
          </div>
        </Section>

        {/* 編集フォーム */}
        <Section title="プロフィールを編集">
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-[var(--text)]">
                ユーザー名
              </label>
              <input
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[var(--text)] placeholder-[color:var(--muted)] shadow-sm transition-all duration-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ユーザー名を入力してください"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-[var(--text)]">
                プロフィール
              </label>
              <textarea
                className="resize-vertical w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[var(--text)] placeholder-[color:var(--muted)] shadow-sm transition-all duration-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:outline-none"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="自己紹介やプロフィールを入力してください"
              />
              <p className="mt-2 flex items-center text-xs text-[var(--muted)]">
                <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                あなたの興味や専門分野について書いてみましょう
              </p>
            </div>

            {/* 保存ボタン */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex transform items-center rounded-xl bg-[var(--primary)] px-6 py-3 text-[var(--primary-contrast)] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    保存中...
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    保存
                  </>
                )}
              </button>
            </div>

            {/* メッセージ表示 */}
            {message && (
              <Notice variant={message.includes("エラー") ? "danger" : "success"}>{message}</Notice>
            )}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default ProfilePage;
