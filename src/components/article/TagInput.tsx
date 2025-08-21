"use client";
import { useState } from "react";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
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
    if (disabled) return;
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
      <div className="flex flex-wrap gap-2 mb-3">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center text-sm px-3 py-1.5 rounded-full font-medium border shadow-sm transition-all duration-300 bg-[var(--card)] text-[var(--text)] border-[var(--border)] hover:border-[var(--card-hover-border)]"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              disabled={disabled}
              className={`ml-2 text-[var(--muted)] hover:text-red-400 transition-colors duration-300 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="w-full px-4 py-3 rounded-xl border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--card)] text-[var(--text)] border-[var(--border)] placeholder-[color:var(--muted)] focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="タグを入力してEnterを押してください"
        disabled={disabled}
      />
    </div>
  );
}
