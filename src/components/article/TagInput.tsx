"use client";
import { useState } from "react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean; // ← 追加
};

export default function TagInput({ value, onChange, disabled = false }: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const newTag = input.trim();
    if (newTag && !value.includes(newTag)) {
      onChange([...value, newTag]);
    }
    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    if (disabled) return; // 無効状態では削除も不可
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!disabled) addTag();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-slate-100 text-sm px-2 py-1 rounded-full"
          >
            {tag}
            {!disabled && (
              <button
                onClick={() => removeTag(tag)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>
      <input
        type="text"
        className={`bg-slate-100 border border-gray-300 rounded px-2 py-1 w-full mb-2 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="タグを入力してEnterを押してください"
        disabled={disabled}
      />
    </div>
  );
}
