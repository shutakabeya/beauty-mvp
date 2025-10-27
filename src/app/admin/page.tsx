import { getAnalyticsData } from '@/lib/admin-actions'
import { getStates } from '@/lib/database'
import { getProductsByStateId } from '@/lib/database'
import { BarChart3, TrendingUp, Users, Package } from 'lucide-react'

// 管理画面は常に動的レンダリング
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboard() {
  // 分析データを取得（過去7日）
  const analyticsResult = await getAnalyticsData(7)
  const states = await getStates()
  
  // 各状態の商品数を取得
  const stateStats = await Promise.all(
    states.map(async (state) => {
      const products = await getProductsByStateId(state.id)
      return {
        stateName: state.name,
        productCount: products.length
      }
    })
  )

  const analytics = analyticsResult.success ? analyticsResult.data : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-500">
          システムの概要と主要指標を確認できます
        </p>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    状態数
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {states.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    総商品数
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stateStats.reduce((sum, stat) => sum + stat.productCount, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    今週のクリック数
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {analytics ? 
                      analytics.stateClicks.reduce((sum: number, item: any) => sum + (item.count || 0), 0) 
                      : 0
                    }
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    アクティブ状態
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {states.filter(state => state.name).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 状態別統計 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            状態別商品数
          </h3>
          <div className="mt-5">
            <div className="space-y-3">
              {stateStats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {stat.stateName}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.productCount} 商品
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* クリック分析 */}
      {analytics && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              今週のクリック分析
            </h3>
            <div className="mt-5">
              {analytics.stateClicks.length > 0 ? (
                <div className="space-y-3">
                  {analytics.stateClicks.slice(0, 5).map((click: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {click.states?.name || '不明'}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {click.count || 0} クリック
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">今週のクリックデータはありません</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

