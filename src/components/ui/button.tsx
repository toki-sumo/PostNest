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
      className={`bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/25 transform hover:scale-105 border border-slate-600/30 hover:border-slate-500/50
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
