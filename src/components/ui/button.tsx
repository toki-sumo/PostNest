import Spinner from "./Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const Button = ({
  loading = false,
  children,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`bg-[var(--primary)] text-[var(--primary-contrast)] font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-[var(--border)]
        ${loading ? "cursor-wait opacity-70" : "cursor-pointer"} 
        ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size={4} /> : children}
    </button>
  );
};
