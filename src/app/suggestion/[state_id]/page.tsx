'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { getStateById, getProductsByStateId, logClick } from '@/lib/database'
import { State, Product } from '@/lib/supabase'
import { trackViewSuggestion, trackClickAffiliate } from '@/lib/analytics'
import ImagePlaceholder from '@/components/ImagePlaceholder'

export default function SuggestionPage() {
  const [state, setState] = useState<State | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15))
  
  const params = useParams()
  const router = useRouter()
  const stateId = parseInt(params.state_id as string)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        const [stateData, productsData] = await Promise.all([
          getStateById(stateId),
          getProductsByStateId(stateId)
        ])

        if (stateData) {
          setState(stateData)
          // 提案ページビューをトラッキング
          trackViewSuggestion(stateData.name)
        } else {
          setError('選択された状態が見つかりません。')
          return
        }
        
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('データの取得に失敗しました。しばらく時間をおいてから再度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [stateId])

  const handleProductClick = async (product: Product) => {
    // GA4イベント送信
    trackClickAffiliate(state?.name || '', product.name, product.id)
    
    // クリックログを記録
    if (state) {
      await logClick(state.id, product.id, sessionId)
    }
    
    // Amazonページを新規タブで開く
    window.open(product.affiliate_url, '_blank', 'noopener,noreferrer')
  }

  const handleBackToHome = () => {
    router.push('/')
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
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              再読み込み
            </button>
            <button
              onClick={handleBackToHome}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ページが見つかりません</h1>
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ホームに戻る
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
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ホームに戻る
          </button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {state.name}あなたへ
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            この2〜3アイテムで即印象アップ
          </p>
        </div>

        {/* 商品カード */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 hover:border-blue-300 cursor-pointer"
              >
                {/* 商品画像 */}
                <div className="aspect-square">
                  <ImagePlaceholder
                    src={product.image_url || '/images/placeholder.svg'}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 商品情報 */}
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-sm text-blue-600 font-medium">
                      {product.brand}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  {/* CTAボタン */}
                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  >
                    Amazonで見る
                  </button>
                </div>
              </div>
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
