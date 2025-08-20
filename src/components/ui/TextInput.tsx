type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const TextInput = ({ label, error, ...props }: TextInputProps) => {
  return (
    <div className="mb-4">
      {label && <span className="block mb-2 text-sm font-medium text-slate-300">{label}</span>}
      <input
        className={`w-full px-3 py-2 rounded-lg border border-slate-600/30 bg-slate-700/50 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};
