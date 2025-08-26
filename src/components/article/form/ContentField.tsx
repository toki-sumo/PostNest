'use client'

import dynamic from 'next/dynamic'
const RichTextEditor = dynamic(() => import('../RichTextEditor'), { ssr: false, loading: () => null })

type Props = {
  value: string
  onChange: (v: string) => void
}

export default function ContentField({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text)] mb-3 flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        コンテンツ
      </label>
      <RichTextEditor content={value} onChange={onChange} placeholder="ここに記事の内容を入力してください。H1、H2、H3ボタンで見出しを設定できます。" />
    </div>
  )
}


