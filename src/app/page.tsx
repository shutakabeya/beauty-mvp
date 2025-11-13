'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getStates, getProductsByStateId, logClick } from '@/lib/database'
import { State, Product } from '@/lib/supabase'
import { trackViewHome, trackViewEffectList, trackSelectEffect, trackClickAffiliate } from '@/lib/analytics'
import ProductCard from '@/components/ProductCard'
import FabCategories from '@/components/FabCategories'
import HeroStatesCarousel from '@/components/HeroStatesCarousel'

function HomePageContent() {
  const [states, setStates] = useState<State[]>([])
  const [productsByState, setProductsByState] = useState<Record<number, Product[]>>({})
  const [heroCarouselItems, setHeroCarouselItems] = useState<Array<{ state: State; backgroundImageUrl: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15))
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const mode = searchParams.get('mode')
    const categoryId = searchParams.get('category_id')

    if (mode === 'categories') {
      setIsRedirecting(true)
      router.replace(categoryId ? `/categories?category_id=${categoryId}` : '/categories')
    } else {
      setIsRedirecting(false)
    }
  }, [mounted, router, searchParams])

  useEffect(() => {
    if (!mounted || isRedirecting) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        trackViewHome()

        const statesData = await getStates()
        const productEntries = await Promise.all(
          statesData.map(async (state) => {
            const products = await getProductsByStateId(state.id)
            return [state.id, products] as [number, Product[]]
          })
        )

        const productsMap = productEntries.reduce<Record<number, Product[]>>((acc, [stateId, products]) => {
          if (products.length > 0) {
            acc[stateId] = products
          }
          return acc
        }, {})

        const filteredStates = statesData.filter((state) => (productsMap[state.id] ?? []).length > 0)

        setStates(filteredStates)
        setProductsByState(productsMap)

        // ヒーローカルーセル用のデータを準備
        // 少なくとも1件は表示するようにする
        if (filteredStates.length > 0) {
          // 状態の画像がある効果を優先的に選択
          const statesWithImages = filteredStates.filter((state) => 
            state.image_url && state.image_url.trim() !== ''
          )

          // 画像がある効果がない場合は、すべての効果を使用
          const candidateStates = statesWithImages.length > 0 ? statesWithImages : filteredStates

          // ランダムに3〜5件を選ぶ（ただし、利用可能な件数まで）
          const availableCount = candidateStates.length
          const minCount = Math.min(3, availableCount)
          const maxCount = Math.min(5, availableCount)
          const randomCount = minCount === maxCount 
            ? minCount 
            : Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount
          
          const shuffled = [...candidateStates].sort(() => Math.random() - 0.5)
          const selectedStates = shuffled.slice(0, randomCount)

          // 状態の画像URLを直接使用
          const heroItems = selectedStates.map((state) => {
            // 状態の画像URLを使用（画像URLがない場合はplaceholderを使用）
            const imageUrl = state.image_url?.trim() || '/images/placeholder.svg'
            
            console.log(`[page.tsx] State: ${state.name}, Image URL: ${imageUrl}`)
            
            return {
              state,
              backgroundImageUrl: imageUrl,
            }
          })

          console.log(`[page.tsx] Hero carousel items created:`, heroItems.length)
          setHeroCarouselItems(heroItems)
        }

        if (filteredStates.length > 0) {
          trackViewEffectList('effects')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('データの取得に失敗しました。しばらく時間をおいてから再度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [mounted, isRedirecting])

  const handleProductClick = (state: State, product: Product) => {
    trackClickAffiliate(state.name, product.name, product.id)
    void logClick(state.id, product.id, sessionId)
    if (product.affiliate_url) {
      window.open(product.affiliate_url, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSeeAllClick = (state: State, index: number) => {
    trackSelectEffect(state.id, state.name, 'effects', undefined, index + 1)
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
      {/* ヒーローカルーセル（ヘッダー直下） */}
      {heroCarouselItems.length > 0 && (
        <div className="w-full" style={{ marginTop: '64px' }}>
          <HeroStatesCarousel items={heroCarouselItems} />
        </div>
      )}

      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="space-y-2 md:space-y-3">
          {states.map((state, index) => {
            const products = productsByState[state.id] ?? []
            return (
            <section
              key={state.id}
              aria-labelledby={`effect-${state.id}`}
              className="pt-4 pb-2 md:pt-5 md:pb-2 first:pt-0 first:md:pt-0 last:pb-0 last:md:pb-0"
            >
              <div className="flex items-center justify-between gap-4">
                <h2
                  id={`effect-${state.id}`}
                  className="text-2xl md:text-3xl font-semibold text-gray-900"
                >
                  {state.name}
                </h2>
                <Link
                  href={`/suggestion/${state.id}?mode=effects`}
                  onClick={() => handleSeeAllClick(state, index)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  すべて見る
                </Link>
              </div>

              <div className="mt-4">
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="snap-start shrink-0 w-64 sm:w-72 md:w-80"
                    >
                      <ProductCard
                        product={product}
                        onProductClick={() => handleProductClick(state, product)}
                        className="h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
            )
          })}
        </div>

        <div className="text-center mt-16 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dai5. All rights reserved.</p>
        </div>
      </div>
      <FabCategories />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}

