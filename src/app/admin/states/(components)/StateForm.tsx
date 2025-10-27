'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { State, Category } from '@/lib/supabase'
import { createState, updateState } from '@/lib/admin-actions'
import { getCategories } from '@/lib/database'
import { X } from 'lucide-react'
import Toast from '@/components/admin/Toast'

interface StateFormProps {
  state?: State
  onClose: () => void
}

export default function StateForm({ state, onClose }: StateFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: state?.name || '',
    description: state?.description || '',
    image_url: state?.image_url || '',
    category_id: state?.category_id || '',
    sort_order: state?.sort_order || 0,
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('カテゴリの取得に失敗しました:', error)
      }
    }
    fetchCategories()
  }, [])

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

      if (result.success) {
        setFormData(prev => ({ ...prev, image_url: result.url }))
        setToast({ message: '画像をアップロードしました', type: 'success' })
      } else {
        setToast({ message: result.error || 'アップロードに失敗しました', type: 'error' })
      }
    } catch (error) {
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
      form.append('description', formData.description)
      form.append('image_url', formData.image_url)
      if (formData.category_id) {
        form.append('category_id', formData.category_id.toString())
      }
      form.append('sort_order', formData.sort_order.toString())

      const result = state 
        ? await updateState(state.id, form)
        : await createState(form)

      if (result.success) {
        setToast({ 
          message: state ? '状態を更新しました' : '状態を作成しました', 
          type: 'success' 
        })
        onClose()
        router.refresh()
      } else {
        setToast({ message: result.error || 'エラーが発生しました', type: 'error' })
      }
    } catch (error) {
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
            {state ? '状態を編集' : '新しい状態を作成'}
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
              名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="例: 清潔感を出したい"
              required
            />
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
              placeholder="状態の詳細説明"
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
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
              カテゴリ
            </label>
            <select
              id="category_id"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value ? parseInt(e.target.value) : '' })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">カテゴリを選択してください</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
              並び順
            </label>
            <input
              type="number"
              id="sort_order"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
              placeholder="0"
            />
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
              {loading ? '保存中...' : (state ? '更新' : '作成')}
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
