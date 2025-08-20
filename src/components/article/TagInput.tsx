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
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-slate-200 text-slate-700 text-sm px-3 py-1 rounded-full font-medium"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              disabled={disabled}
              className={`ml-2 text-slate-500 hover:text-red-500 transition-colors duration-200 ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors duration-200 disabled:opacity-50 disabled:bg-slate-100"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="タグを入力してEnterを押してください"
        disabled={disabled}
      />
    </div>
  );
}
