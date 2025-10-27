import { getStates } from '@/lib/database'
import { createState, updateState, deleteState } from '@/lib/admin-actions'
import StatesTable from './(components)/StatesTable'
import StateForm from './(components)/StateForm'

// 管理画面は常に動的レンダリング
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StatesPage() {
  const states = await getStates()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">状態管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            ユーザーが選択できる「なりたい状態」を管理します
          </p>
        </div>
        <div id="state-form-placeholder" />
      </div>

      <StatesTable states={states} />
    </div>
  )
}
