import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, FC } from "react";

type Variant = "default" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button: FC<ButtonProps> = ({ variant = "default", className, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants: Record<Variant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
};
