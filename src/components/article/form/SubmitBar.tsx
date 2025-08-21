'use client'

import Spinner from '../../ui/Spinner'

type Props = {
  isSubmitting: boolean
  disabled?: boolean
  isEdit?: boolean
}

export default function SubmitBar({ isSubmitting, disabled, isEdit }: Props) {
  return (
    <div className="pt-6">
      <button
        type="submit"
        disabled={disabled || isSubmitting}
        className="w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 bg-[var(--primary)] text-[var(--primary-contrast)]"
      >
        {isSubmitting ? (
          <>
            <Spinner size={5} />
            <span className="ml-3">送信中...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {isEdit ? '更新する' : '記事を投稿'}
          </>
        )}
      </button>
    </div>
  )
}


