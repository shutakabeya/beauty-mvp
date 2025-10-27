import { getCategories } from '@/lib/database'
import { Category } from '@/lib/supabase'
import CategoriesTable from './(components)/CategoriesTable'

// 管理画面は常に動的レンダリング
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">カテゴリ管理</h1>
        <p className="mt-1 text-sm text-gray-500">
          効果のカテゴリを管理できます
        </p>
      </div>

      <CategoriesTable categories={categories} />
    </div>
  )
}
