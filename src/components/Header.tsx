'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SideMenu from './SideMenu'
import ProfileModal from './ProfileModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const lastScrollY = useRef(0)

  const handleCloseSideMenu = useCallback(() => {
    setIsSideMenuOpen(false)
  }, [])

  const handleCloseProfileModal = useCallback(() => {
    setIsProfileModalOpen(false)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // スクロールが下方向で、一定量以上スクロールしたらヘッダーを隠す
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40 
          bg-white border-b border-gray-200 shadow-sm
          transition-transform duration-300 ease-in-out
          ${isScrolled ? '-translate-y-full' : 'translate-y-0'}
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* 左: サイドメニューボタン */}
            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              aria-label="メニューを開く"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* 中央: タイトル（画像またはテキスト） */}
            <Link href="/" className="flex items-center">
              {/* 画像を使用する場合：publicフォルダに画像を配置し、以下のコメントを外してください */}
              {/* 
              <Image
                src="/logo.png"
                alt="ESSECE"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
              */}
              {/* テキストを使用する場合：以下を使用 */}
              <h1 className="text-xl font-bold text-gray-900">
                ESSECE
              </h1>
            </Link>

            {/* 右: プロフィールアイコン */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="プロフィール"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* サイドメニュー */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleCloseSideMenu}
      />

      {/* プロフィールモーダル */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
      />
    </>
  )
}

