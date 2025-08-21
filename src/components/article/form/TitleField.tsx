'use client'

import { Input } from '@/components/ui/Input'

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function TitleField({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text)] mb-3 flex items-center">
        <svg className="w-5 h-5 text-[var(--primary)] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        タイトル
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="記事のタイトルを入力してください"
        className="w-full px-4 py-3 rounded-xl shadow-sm transition-all duration-300"
      />
    </div>
  )
}


