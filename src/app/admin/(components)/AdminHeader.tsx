'use client'

import { Menu, Bell } from 'lucide-react'

interface AdminHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  return (
    <div className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8">
      <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">サイドバーを開く</span>
          <Menu className="h-6 w-6" />
        </button>

        {/* 区切り線 */}
        <div className="h-6 w-px bg-gray-200 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1"></div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* 通知ベル */}
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 cursor-pointer"
            >
              <span className="sr-only">通知を表示</span>
              <Bell className="h-6 w-6" />
            </button>

            {/* 区切り線 */}
            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

            {/* ユーザーメニュー */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div className="flex items-center gap-x-4">
                <div className="relative">
                  <div className="flex items-center gap-x-3">
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">管</span>
                    </div>
                    <div className="hidden lg:block">
                      <p className="text-sm font-semibold leading-6 text-gray-900">
                        管理者
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

