import React from 'react'

function Footer() {
  return (
    <footer className='py-8 px-5 text-center border-t bg-[var(--card)] border-[var(--border)]'>
      <div className="max-w-6xl mx-auto">
        <div className="text-[var(--muted)] text-sm">
          © 2025 PostNest. All rights reserved.
        </div>
        <div className="mt-2 text-[color:var(--muted)] text-xs">
          資産形成のための知識プラットフォーム
        </div>
      </div>
    </footer>
  )
};

export default Footer