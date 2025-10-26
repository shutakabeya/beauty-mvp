'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStates, getCategories, getStatesByCategoryId } from '@/lib/database'
import { State, Category } from '@/lib/supabase'
import { trackViewHome, trackSwitchMode, trackSelectCategoryTab, trackViewEffectList, trackSelectEffect } from '@/lib/analytics'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export default function HomePage() {
  const [states, setStates] = useState<State[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryStates, setCategoryStates] = useState<State[]>([])
  const [activeTab, setActiveTab] = useState<'effects' | 'categories'>('effects')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // ページビューをトラッキング
    trackViewHome()

    // データを取得
    const fetchData = async () => {
      try {
        setError(null)
        const [statesData, categoriesData] = await Promise.all([
          getStates(),
          getCategories()
        ])
        setStates(statesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('データの取得に失敗しました。しばらく時間をおいてから再度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [mounted])

  // カテゴリ選択時の処理
  const handleCategorySelect = async (category: Category) => {
    try {
      setSelectedCategory(category)
      trackSelectCategoryTab(category.name, category.sort_order)
      
      const statesData = await getStatesByCategoryId(category.id)
      setCategoryStates(statesData)
      trackViewEffectList('category', category.name)
    } catch (error) {
      console.error('Error fetching category states:', error)
    }
  }

  // タブ切り替え
  const handleTabChange = (tab: 'effects' | 'categories') => {
    setActiveTab(tab)
    trackSwitchMode(tab)
    if (tab === 'effects') {
      trackViewEffectList('effects')
    }
  }

  const handleStateSelect = (stateId: number, stateName: string, mode: 'effects' | 'category' = 'effects', categoryName?: string, rank?: number) => {
    // GA4イベント送信
    trackSelectEffect(stateId, stateName, mode, categoryName, rank)
    
    // 提案ページに遷移
    router.push(`/suggestion/${stateId}`)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
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
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            どうなりたいですか？
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            選ぶだけで、あなたに合った解決策を提案します。
          </p>
        </div>

        {/* タブ切り替え */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg" role="tablist">
            <button
              onClick={() => handleTabChange('effects')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'effects'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              role="tab"
              aria-selected={activeTab === 'effects'}
            >
              効果でえらぶ
            </button>
            <button
              onClick={() => handleTabChange('categories')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'categories'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              role="tab"
              aria-selected={activeTab === 'categories'}
            >
              カテゴリからえらぶ
            </button>
          </div>
        </div>

        {/* タブ内容 */}
        {activeTab === 'effects' && (
          <div className="max-w-4xl mx-auto">
            {/* 効果タブ - グリッドレイアウト */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {states.map((state, index) => (
                <button
                  key={state.id}
                  onClick={() => handleStateSelect(state.id, state.name, 'effects', undefined, index + 1)}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-3 text-left border border-gray-200 hover:scale-105 min-h-[88px]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="shrink-0">
                      <ImagePlaceholder
                        src={state.image_url || '/images/placeholder.svg'}
                        alt={state.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 transition-colors line-clamp-2 leading-tight">
                        {state.name}
                      </h3>
                    </div>
                    <div className="shrink-0">
                      <svg 
                        className="w-4 h-4 text-gray-400 transition-colors" 
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
        )}

        {activeTab === 'categories' && (
          <div className="max-w-4xl mx-auto">
            {/* カテゴリタブ - Apple Music風 */}
            {!selectedCategory ? (
              <div>
                {/* カテゴリ選択 */}
                <div className="grid grid-cols-2 gap-2 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-left transition-colors min-h-[56px] cursor-pointer shadow-sm hover:shadow-md hover:scale-105"
                    >
                      <div className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                        {category.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* 選択されたカテゴリの効果一覧 */}
                <div className="mb-6">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
                  >
                    ← {selectedCategory.name} に戻る
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {selectedCategory.name}
                  </h2>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {categoryStates.map((state, index) => (
                    <button
                      key={state.id}
                      onClick={() => handleStateSelect(state.id, state.name, 'category', selectedCategory.name, index + 1)}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-3 text-left border border-gray-200 hover:border-blue-300 hover:scale-105 min-h-[88px] cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          <ImagePlaceholder
                            src={state.image_url || '/images/placeholder.svg'}
                            alt={state.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                            {state.name}
                          </h3>
                        </div>
                        <div className="shrink-0">
                          <svg 
                            className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" 
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
                
                {categoryStates.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">このカテゴリには効果がありません</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* フッター */}
        <div className="text-center mt-16 text-sm text-gray-500">
          <p>※ このサービスはAmazonアソシエイトプログラムを利用しています</p>
        </div>
      </div>
    </div>
  )
}

