'use client'

import TagInput from '../TagInput'
import Spinner from '../../ui/Spinner'

type Props = {
  value: string[]
  onChange: (tags: string[]) => void
  isGenerating: boolean
  onGenerate: () => void
}

export default function TagField({ value, onChange, isGenerating, onGenerate }: Props) {
  return (
    <div>
      <div className="flex items-center mb-3">
        <label className="text-sm font-medium text-[var(--text)] mr-4 flex items-center">
          <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          タグ
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
          >
            {isGenerating ? (
              <>
                <Spinner size={3} />
                <span className="ml-2">生成中...</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI生成
              </>
            )}
          </button>
        </div>
      </div>
      <TagInput value={value} onChange={onChange} disabled={isGenerating} />
    </div>
  )
}


