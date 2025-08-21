type SpinnerProps = {
  fullscreen?: boolean;
  size?: number; // オプションでサイズ変更
};

export default function Spinner({ fullscreen = false, size = 8 }: SpinnerProps) {
  const sizeClass = `h-${size} w-${size}`;
  const svg = (
    <svg
      className={`animate-spin ${sizeClass} text-[var(--primary)]`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );

  if (fullscreen) {
    return (
      <div className="flex items-center justify-center backdrop-blur-sm w-full h-full fixed inset-0 z-50 bg-[color:var(--bg)]/80">
        {svg}
      </div>
    );
  }

  return svg;
}
