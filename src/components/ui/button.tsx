import { ReactNode } from "react";

// buttonの色を柔軟に指定できるようにvariantを追加
type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ children, onClick, type = "button", className = "", variant = "primary" }: ButtonProps) {
  const baseStyle = "w-full py-2 rounded text-white";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-600 hover:bg-gray-700",
    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
