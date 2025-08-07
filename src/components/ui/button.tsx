import Spinner from "./Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export const Button = ({ loading, children, disabled, ...props }: ButtonProps) => {
  return (
    <button
      className={`px-4 py-2 rounded text-white transition ${disabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner size={4} />
      ) : (
        children
      )}
    </button>
  );
};
