'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStates } from '@/lib/database'
import { State } from '@/lib/supabase'
import { trackViewHome, trackSelectState } from '@/lib/analytics'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export default function HomePage() {
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // ページビューをトラッキング
    trackViewHome()

    // 状態データを取得
    const fetchStates = async () => {
      try {
        setError(null)
        const statesData = await getStates()
        setStates(statesData)
      } catch (error) {
        console.error('Error fetching states:', error)
        setError('データの取得に失敗しました。しばらく時間をおいてから再度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    fetchStates()
  }, [])

  const handleStateSelect = (stateId: number, stateName: string) => {
    // GA4イベント送信
    trackSelectState(stateName)
    
    // 提案ページに遷移
    router.push(`/suggestion/${stateId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            どうなりたいですか？
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            選ぶだけで、あなたに合った解決策を提案します。
          </p>
        </div>

        {/* 状態選択ボタン */}
        <div className="max-w-2xl mx-auto">
          <div className="grid gap-4">
            {states.map((state) => (
              <button
                key={state.id}
                onClick={() => handleStateSelect(state.id, state.name)}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 text-left border border-gray-200 hover:border-blue-300 hover:scale-105 cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                    <ImagePlaceholder
                      src={state.image_url || '/images/placeholder.svg'}
                      alt={state.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {state.name}
                    </h3>
                    {state.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {state.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <svg 
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-16 text-sm text-gray-500">
          <p>※ このサービスはAmazonアソシエイトプログラムを利用しています</p>
        </div>
      </div>
    </div>
  )
}
