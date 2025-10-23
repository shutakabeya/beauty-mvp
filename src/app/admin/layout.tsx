import { requireAdmin } from '@/lib/admin-auth'
import AdminSidebar from './(components)/AdminSidebar'
import AdminHeader from './(components)/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 管理者権限チェック（開発モード対応）
  await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminHeader />
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
