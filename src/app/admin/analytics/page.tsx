import { getAnalyticsData } from '@/lib/admin-actions'
import AnalyticsTable from './(components)/AnalyticsTable'

export default async function AnalyticsPage() {
  const analyticsResult = await getAnalyticsData(7)
  const analytics = analyticsResult.success ? analyticsResult.data : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">分析</h1>
        <p className="mt-1 text-sm text-gray-500">
          クリックデータの分析とレポートを確認できます
        </p>
      </div>

      {analytics ? (
        <div className="space-y-6">
          {/* 状態別クリック分析 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                状態別クリック数（過去7日）
              </h3>
              <div className="mt-5">
                <AnalyticsTable
                  data={analytics.stateClicks}
                  columns={[
                    { key: 'states.name', label: '状態名' },
                    { key: 'count', label: 'クリック数' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* 商品別クリック分析 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                商品別クリック数（過去7日）
              </h3>
              <div className="mt-5">
                <AnalyticsTable
                  data={analytics.productClicks}
                  columns={[
                    { key: 'products.name', label: '商品名' },
                    { key: 'products.brand', label: 'ブランド' },
                    { key: 'count', label: 'クリック数' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                分析データを取得できませんでした
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

