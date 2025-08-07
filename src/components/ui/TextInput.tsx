type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const TextInput = ({ label, error, ...props }: TextInputProps) => {
  return (
    <label className="block mb-4">
      {label && <span className="block mb-1 font-medium text-gray-700">{label}</span>}
      <input
        className={`bg-slate-100 w-full rounded px-3 py-2 focus:outline-none focus:ring ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </label>
  );
};
