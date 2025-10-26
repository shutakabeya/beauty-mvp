'use client'

import { useState } from 'react'
import { Category } from '@/lib/supabase'
import { createCategory, updateCategory, deleteCategory } from '@/lib/admin-actions'
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react'

interface CategoriesTableProps {
  categories: Category[]
}

export default function CategoriesTable({ categories: initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreate = async (formData: FormData) => {
    try {
      setError(null)
      const result = await createCategory(formData)
      
      if (result.success) {
        setCategories(prev => [...prev, result.data])
        setIsCreating(false)
      } else {
        setError(result.error || 'エラーが発生しました')
      }
    } catch (error) {
      setError('エラーが発生しました')
    }
  }

  const handleUpdate = async (id: number, formData: FormData) => {
    try {
      setError(null)
      const result = await updateCategory(id, formData)
      
      if (result.success) {
        setCategories(prev => 
          prev.map(cat => cat.id === id ? result.data : cat)
        )
        setEditingId(null)
      } else {
        setError(result.error || 'エラーが発生しました')
      }
    } catch (error) {
      setError('エラーが発生しました')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('このカテゴリを削除しますか？')) return
    
    try {
      setError(null)
      setIsDeleting(id)
      const result = await deleteCategory(id)
      
      if (result.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id))
      } else {
        setError(result.error || 'エラーが発生しました')
      }
    } catch (error) {
      setError('エラーが発生しました')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            カテゴリ一覧
          </h3>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規追加
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {/* 新規作成フォーム */}
        {isCreating && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-md font-medium text-gray-900 mb-4">新規カテゴリ追加</h4>
            <form action={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  カテゴリ名
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
                  並び順
                </label>
                <input
                  type="number"
                  name="sort_order"
                  id="sort_order"
                  defaultValue={categories.length + 1}
                  min="0"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  追加
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        )}

        {/* カテゴリテーブル */}
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  並び順
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <GripVertical className="h-4 w-4 text-gray-400 mr-2" />
                      {category.sort_order}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === category.id ? (
                      <form action={(formData) => handleUpdate(category.id, formData)} className="flex items-center space-x-2">
                        <input
                          type="text"
                          name="name"
                          defaultValue={category.name}
                          required
                          className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <input
                          type="number"
                          name="sort_order"
                          defaultValue={category.sort_order}
                          min="0"
                          className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                          type="submit"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          保存
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          キャンセル
                        </button>
                      </form>
                    ) : (
                      <div className="font-medium">{category.name}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.created_at).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {editingId !== category.id && (
                        <button
                          onClick={() => setEditingId(category.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {isDeleting === category.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">カテゴリがありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
