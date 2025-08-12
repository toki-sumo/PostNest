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
      className={`bg-gray-100 hover:bg-gray-500 hover:text-gray-100 text-gray-600 font-medium py-2 px-4 rounded-md transition duration-200 shadow-md 
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
