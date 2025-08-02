import { ChangeEvent, InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  const baseStyle = "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <input
      className={`${baseStyle} ${className}`}
      {...props}
    />
  );
}