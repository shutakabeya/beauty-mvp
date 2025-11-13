'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCategories, getStatesByCategoryId, getCategoryById } from '@/lib/database'
import { Category, State } from '@/lib/supabase'
import { trackViewEffectList, trackSelectCategoryTab, trackSelectEffect } from '@/lib/analytics'
import ImagePlaceholder from '@/components/ImagePlaceholder'

function CategoriesPageContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categoryStates, setCategoryStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)
  const [statesLoading, setStatesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  const loadCategoryStates = useCallback(async (category: Category, trackView: boolean = true) => {
    try {
      setStatesLoading(true)
      const statesData = await getStatesByCategoryId(category.id)
      setCategoryStates(statesData)
      if (trackView) {
        trackViewEffectList('category', category.name)
      }
    } catch (error) {
      console.error('Error fetching category states:', error)
      setError('効果の取得に失敗しました。しばらく時間をおいてから再度お試しください。')
      setCategoryStates([])
    } finally {
      setStatesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initialize = async () => {
      try {
        setLoading(true)
        setError(null)

        const categoriesData = await getCategories()
        setCategories(categoriesData)

        const categoryId = searchParams.get('category_id')
        if (categoryId) {
          const parsedId = parseInt(categoryId)
          const categoryFromList = categoriesData.find((category) => category.id === parsedId)
          const categoryData = categoryFromList ?? (await getCategoryById(parsedId))

          if (categoryData) {
            setSelectedCategory(categoryData)
            await loadCategoryStates(categoryData, false)
          } else {
            setSelectedCategory(null)
            setCategoryStates([])
          }
        } else {
          setSelectedCategory(null)
          setCategoryStates([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setError('データの取得に失敗しました。しばらく時間をおいてから再度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [mounted, searchParams, loadCategoryStates])

  const handleCategorySelect = async (category: Category) => {
    setSelectedCategory(category)
    trackSelectCategoryTab(category.name, category.sort_order)
    await loadCategoryStates(category)
    router.replace(`/categories?category_id=${category.id}`)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setCategoryStates([])
    router.replace('/categories')
  }

  const handleStateSelect = (state: State, index: number) => {
    if (!selectedCategory) return
    trackSelectEffect(state.id, state.name, 'category', selectedCategory.name, index + 1)
    router.push(`/suggestion/${state.id}?mode=category&category_id=${selectedCategory.id}`)
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
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-4 cursor-pointer transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            トップページに戻る
          </Link>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">カテゴリ</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            気になるカテゴリから、あなたにぴったりの効果を見つけましょう。
          </p>
        </div>

        {!selectedCategory ? (
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-left transition-all duration-200 min-h-[56px] cursor-pointer shadow-sm hover:shadow-md hover:scale-105"
                >
                  <div className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex flex-col gap-2 mb-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  トップページに戻る
                </Link>
                <button
                  onClick={handleBackToCategories}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer inline-flex items-center transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  カテゴリ一覧に戻る
                </button>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                {selectedCategory.name}
              </h2>
            </div>

            {statesLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : categoryStates.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {categoryStates.map((state, index) => (
                  <button
                    key={state.id}
                    onClick={() => handleStateSelect(state, index)}
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
            ) : (
              <div className="text-center py-8 text-gray-500">
                このカテゴリには効果がありません
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-16 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dai5. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
      }
    >
      <CategoriesPageContent />
    </Suspense>
  )
}

