"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// --- TagInput Component ---
type TagInputProps = {
  onTagsChange: (tags: string[]) => void;
  initialTags: string[];
};

export default function TagInput({ onTagsChange, initialTags }: TagInputProps) {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState<string>("");

  // tagsの状態が変更されたときに、親コンポーネントに通知する
  useEffect(() => {
    onTagsChange(tags);
  }, [tags, onTagsChange]);

  const addTag = () => {
    const newTag = input.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: { key: string; preventDefault: () => void; }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center bg-slate-100 text-sm px-2 py-1 rounded-full"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 text-gray-500 hover:text-red-500"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        className="bg-slate-100 border border-gray-300 rounded px-2 py-1 w-full mb-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="タグを入力してEnterを押してください"
      />
    </div>
  );
}