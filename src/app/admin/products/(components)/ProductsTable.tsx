'use client'

import { useState } from 'react'
import { Product, State } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import ProductForm from './ProductForm'
import { deleteProduct } from '@/lib/admin-actions'
import Toast from '@/components/admin/Toast'

interface ProductsTableProps {
  products: (Product & { state_name: string })[]
  states: State[]
}

export default function ProductsTable({ products, states }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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
        setToast({ message: '商品を削除しました', type: 'success' })
        window.location.reload()
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
          product={editingProduct}
          states={states}
          onClose={handleFormClose}
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
