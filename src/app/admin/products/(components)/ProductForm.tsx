'use client'

import { useState } from 'react'
import { Product, State } from '@/lib/supabase'
import { createProduct, updateProduct } from '@/lib/admin-actions'
import { X } from 'lucide-react'
import Toast from '@/components/admin/Toast'

interface ProductFormProps {
  product?: Product
  states: State[]
  onClose: () => void
}

export default function ProductForm({ product, states, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    affiliate_url: product?.affiliate_url || '',
    image_url: product?.image_url || '',
    state_id: product?.state_id || states[0]?.id || 1,
    description: product?.description || '',
    status: product?.status || 'active',
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // 画像アップロード処理
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: result.error,
          details: result.details
        })
        setToast({ 
          message: result.error || 'アップロードに失敗しました', 
          type: 'error' 
        })
        return
      }

      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.url }))
        setToast({ message: '画像をアップロードしました', type: 'success' })
      } else {
        setToast({ message: result.error || 'アップロードに失敗しました', type: 'error' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setToast({ message: 'アップロードに失敗しました', type: 'error' })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const form = new FormData()
      form.append('name', formData.name)
      form.append('brand', formData.brand)
      form.append('affiliate_url', formData.affiliate_url)
      form.append('image_url', formData.image_url)
      form.append('state_id', formData.state_id.toString())
      form.append('description', formData.description)
      form.append('status', formData.status)

      console.log('Submitting product form:', {
        name: formData.name,
        brand: formData.brand,
        affiliate_url: formData.affiliate_url,
        image_url: formData.image_url,
        state_id: formData.state_id,
        description: formData.description,
        status: formData.status
      })

      const result = product 
        ? await updateProduct(product.id, form)
        : await createProduct(form)

      console.log('Submit result:', result)

      if (result.success) {
        setToast({ 
          message: product ? '商品を更新しました' : '商品を作成しました', 
          type: 'success' 
        })
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 1000)
      } else {
        console.error('Submit failed:', result.error)
        setToast({ message: result.error || 'エラーが発生しました', type: 'error' })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setToast({ message: 'エラーが発生しました', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {product ? '商品を編集' : '新しい商品を作成'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              商品名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="例: CICA鎮静ローション"
              required
            />
          </div>

          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              ブランド
            </label>
            <input
              type="text"
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="例: VT Cosmetics"
            />
          </div>

          <div>
            <label htmlFor="state_id" className="block text-sm font-medium text-gray-700">
              状態 <span className="text-red-500">*</span>
            </label>
            <select
              id="state_id"
              value={formData.state_id}
              onChange={(e) => setFormData({ ...formData, state_id: parseInt(e.target.value) })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {states.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="affiliate_url" className="block text-sm font-medium text-gray-700">
              アフィリエイトURL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="affiliate_url"
              value={formData.affiliate_url}
              onChange={(e) => setFormData({ ...formData, affiliate_url: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.amazon.co.jp/dp/XXXX?tag=YOURTAG-22"
              required
            />
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              画像
            </label>
            
            {/* 画像アップロード */}
            <div className="mt-1">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                }}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />
              {uploading && (
                <p className="mt-2 text-sm text-blue-600">アップロード中...</p>
              )}
            </div>

            {/* 現在の画像URL（手動入力も可能） */}
            <div className="mt-2">
              <input
                type="url"
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="画像URL（手動入力も可能）"
              />
            </div>

            {/* 画像プレビュー */}
            {formData.image_url && (
              <div className="mt-2">
                <img
                  src={formData.image_url}
                  alt="プレビュー"
                  className="w-20 h-20 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              説明
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="商品の詳細説明"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              ステータス
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'hidden' })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">アクティブ</option>
              <option value="hidden">非表示</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '保存中...' : (product ? '更新' : '作成')}
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
