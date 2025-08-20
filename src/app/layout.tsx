// /src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import { Suspense } from "react";
import Loading from "./loading";
import { SessionProvider } from "next-auth/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PostNest - Web開発者の知識共有プラットフォーム",
  description: "Web開発者のための記事投稿・共有プラットフォーム。React、Next.js、TypeScriptなどの最新技術情報をお届けします。",
  keywords: ["Web開発", "React", "Next.js", "TypeScript", "プログラミング", "技術記事"],
  authors: [{ name: "PostNest Team" }],
  creator: "PostNest",
  publisher: "PostNest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "PostNest - Web開発者の知識共有プラットフォーム",
    description: "Web開発者のための記事投稿・共有プラットフォーム",
    url: "/",
    siteName: "PostNest",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostNest - Web開発者の知識共有プラットフォーム",
    description: "Web開発者のための記事投稿・共有プラットフォーム",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <SessionProvider>
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
