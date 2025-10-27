'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product, State } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import ProductForm from './ProductForm'
import { deleteProduct } from '@/lib/admin-actions'
import Toast from '@/components/admin/Toast'

interface ProductsTableProps {
  products: (Product & { state_name: string })[]
  states: State[]
}

export default function ProductsTable({ products: initialProducts, states }: ProductsTableProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // 親から受け取ったproductsが変更されたら更新
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: '商品名', sortable: true },
    { key: 'brand', label: 'ブランド', sortable: true },
    { key: 'state_name', label: '状態', sortable: true },
    { key: 'status', label: 'ステータス', sortable: true },
    { key: 'affiliate_url', label: 'アフィリエイトURL', sortable: false },
  ]

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`「${product.name}」を削除しますか？`)) return

    try {
      const result = await deleteProduct(product.id)
      if (result.success) {
        setProducts(products.filter(p => p.id !== product.id))
        setToast({ message: '商品を削除しました', type: 'success' })
        router.refresh()
      } else {
        setToast({ message: result.error || '削除に失敗しました', type: 'error' })
      }
    } catch (error) {
      setToast({ message: '削除に失敗しました', type: 'error' })
    }
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingProduct(null)
  }

  const handleFormClose = () => {
    setEditingProduct(null)
    setIsCreating(false)
  }

  const handleFormSuccess = async () => {
    // サーバーから最新データを再取得
    await router.refresh()
    // ページを再読み込みして確実に最新データを反映
    window.location.reload()
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        searchFields={['name', 'brand', 'state_name']}
        createButtonText="商品を追加"
      />

      {(editingProduct || isCreating) && (
        <ProductForm
          product={editingProduct || undefined}
          states={states}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
