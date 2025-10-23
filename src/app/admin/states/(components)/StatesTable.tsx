'use client'

import { useState } from 'react'
import { State } from '@/lib/supabase'
import DataTable from '@/components/admin/DataTable'
import StateForm from './StateForm'
import { deleteState } from '@/lib/admin-actions'
import Toast from '@/components/admin/Toast'

interface StatesTableProps {
  states: State[]
}

export default function StatesTable({ states }: StatesTableProps) {
  const [editingState, setEditingState] = useState<State | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: '名前', sortable: true },
    { key: 'description', label: '説明', sortable: false },
    { key: 'image_url', label: '画像URL', sortable: false },
  ]

  const handleEdit = (state: State) => {
    setEditingState(state)
  }

  const handleDelete = async (state: State) => {
    if (!confirm(`「${state.name}」を削除しますか？`)) return

    try {
      const result = await deleteState(state.id)
      if (result.success) {
        setToast({ message: '状態を削除しました', type: 'success' })
        window.location.reload()
      } else {
        setToast({ message: result.error || '削除に失敗しました', type: 'error' })
      }
    } catch (error) {
      setToast({ message: '削除に失敗しました', type: 'error' })
    }
  }

  const handleFormClose = () => {
    setEditingState(null)
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={states}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchFields={['name', 'description']}
      />

      {editingState && (
        <StateForm
          state={editingState}
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
