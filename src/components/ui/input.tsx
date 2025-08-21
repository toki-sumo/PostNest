import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  const baseStyle = "w-full p-2 rounded focus:outline-none focus:ring-2";

  return (
    <input
      className={`${baseStyle} bg-[var(--card)] text-[var(--text)] border border-[var(--border)] focus:ring-[var(--primary)] placeholder-[color:var(--muted)] ${className}`}
      {...props}
    />
  );
}