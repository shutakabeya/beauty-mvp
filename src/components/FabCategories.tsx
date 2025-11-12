'use client'

import Link from 'next/link'

export default function FabCategories() {
  return (
    <Link
      href="/categories"
      aria-label="カテゴリへ移動"
      className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-sm font-semibold transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
    >
      カテゴリ
    </Link>
  )
}

