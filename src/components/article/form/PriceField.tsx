'use client'

type Props = {
  value: number
  onChange: (v: number) => void
}

export default function PriceField({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--text)] mb-2 flex items-center">
        <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        価格（円）
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">¥</span>
        <input
          type="number"
          min={50}
          max={99999}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full pl-8 pr-4 py-3 border rounded-xl shadow-sm transition-all duration-300 bg-[var(--card)] text-[var(--text)] border-[var(--border)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)]"
          placeholder="100"
        />
      </div>
      <p className="text-xs text-[var(--muted)]">50円以上、99,999円以下で設定してください</p>
    </div>
  )
}


