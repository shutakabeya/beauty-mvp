import { getStates } from '@/lib/database'
import { getProductsByStateId } from '@/lib/database'
import ProductsTable from './(components)/ProductsTable'
import ProductForm from './(components)/ProductForm'

// 管理画面は常に動的レンダリング
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductsPage() {
  const states = await getStates()
  
  // 全商品を取得（各状態の商品を結合）
  const allProducts = []
  for (const state of states) {
    const products = await getProductsByStateId(state.id)
    allProducts.push(...products.map(product => ({
      ...product,
      state_name: state.name
    })))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            Amazonアフィリエイト商品を管理します
          </p>
        </div>
        <div id="product-form-placeholder" />
      </div>

      <ProductsTable products={allProducts} states={states} />
    </div>
  )
}
