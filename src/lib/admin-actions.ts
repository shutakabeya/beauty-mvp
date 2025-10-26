'use server'

import { supabase } from './supabase'
import { requireAdmin } from './admin-auth'
import { z } from 'zod'

// バリデーションスキーマ
const CategorySchema = z.object({
  name: z.string().min(1, 'カテゴリ名は必須です').max(50, 'カテゴリ名は50文字以内で入力してください'),
  sort_order: z.number().min(0, '並び順は0以上で入力してください')
})

const StateSchema = z.object({
  name: z.string().min(1, '名前は必須です').max(50, '名前は50文字以内で入力してください'),
  description: z.string().optional(),
  image_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  category_id: z.number().optional(),
  sort_order: z.number().min(0, '並び順は0以上で入力してください')
})

const ProductSchema = z.object({
  name: z.string().min(1, '商品名は必須です').max(100, '商品名は100文字以内で入力してください'),
  brand: z.string().optional(),
  affiliate_url: z.string().min(1, 'アフィリエイトURLは必須です').refine(
    (url) => url.includes('amazon.co.jp'),
    'Amazon.co.jpのURLを入力してください'
  ),
  image_url: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  state_id: z.number().min(1, '状態を選択してください'),
  description: z.string().optional(),
  status: z.enum(['active', 'hidden']).default('active')
})

// Categories CRUD
export async function createCategory(formData: FormData) {
  try {
    await requireAdmin()

    const data = {
      name: formData.get('name') as string,
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    }

    const validatedData = CategorySchema.parse(data)

    const { data: result, error } = await supabase
      .from('categories')
      .insert(validatedData)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

export async function updateCategory(id: number, formData: FormData) {
  try {
    await requireAdmin()

    const data = {
      name: formData.get('name') as string,
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    }

    const validatedData = CategorySchema.parse(data)

    const { data: result, error } = await supabase
      .from('categories')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

export async function deleteCategory(id: number) {
  try {
    await requireAdmin()

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

// States CRUD
export async function createState(formData: FormData) {
  try {
    await requireAdmin() // 管理者権限チェック

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      image_url: formData.get('image_url') as string,
      category_id: formData.get('category_id') ? parseInt(formData.get('category_id') as string) : undefined,
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    }

    const validatedData = StateSchema.parse(data)

    const { data: result, error } = await supabase
      .from('states')
      .insert(validatedData)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

export async function updateState(id: number, formData: FormData) {
  try {
    await requireAdmin()

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      image_url: formData.get('image_url') as string,
      category_id: formData.get('category_id') ? parseInt(formData.get('category_id') as string) : undefined,
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
    }

    const validatedData = StateSchema.parse(data)

    const { data: result, error } = await supabase
      .from('states')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

export async function deleteState(id: number) {
  try {
    await requireAdmin()

    const { error } = await supabase
      .from('states')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

// Products CRUD
export async function createProduct(formData: FormData) {
  try {
    await requireAdmin()

    const data = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      affiliate_url: formData.get('affiliate_url') as string,
      image_url: formData.get('image_url') as string,
      state_id: parseInt(formData.get('state_id') as string),
      description: formData.get('description') as string,
      status: formData.get('status') as string || 'active',
    }

    const validatedData = ProductSchema.parse(data)

    const { data: result, error } = await supabase
      .from('products')
      .insert(validatedData)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

export async function updateProduct(id: number, formData: FormData) {
  try {
    await requireAdmin()

    const data = {
      name: formData.get('name') as string,
      brand: formData.get('brand') as string,
      affiliate_url: formData.get('affiliate_url') as string,
      image_url: formData.get('image_url') as string,
      state_id: parseInt(formData.get('state_id') as string),
      description: formData.get('description') as string,
      status: formData.get('status') as string || 'active',
    }

    const validatedData = ProductSchema.parse(data)

    const { data: result, error } = await supabase
      .from('products')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: result }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

export async function deleteProduct(id: number) {
  try {
    await requireAdmin()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}

// 分析データ取得
export async function getAnalyticsData(days: number = 7) {
  try {
    await requireAdmin()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // 状態別クリック数（簡易版）
    const { data: stateClicks, error: stateError } = await supabase
      .from('click_logs')
      .select(`
        state_id,
        states!inner(name)
      `)
      .gte('timestamp', startDate.toISOString())

    if (stateError) throw stateError

    // 商品別クリック数（簡易版）
    const { data: productClicks, error: productError } = await supabase
      .from('click_logs')
      .select(`
        product_id,
        products!inner(name, brand)
      `)
      .gte('timestamp', startDate.toISOString())

    if (productError) throw productError

    // 集計処理（クライアント側）
    const stateCounts = stateClicks?.reduce((acc: any, item: any) => {
      const key = `${item.state_id}-${item.states?.name}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {}) || {}

    const productCounts = productClicks?.reduce((acc: any, item: any) => {
      const key = `${item.product_id}-${item.products?.name}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {}) || {}

    const processedStateClicks = Object.entries(stateCounts).map(([key, count]) => {
      const [state_id, state_name] = key.split('-')
      return { state_id: parseInt(state_id), 'states.name': state_name, count }
    })

    const processedProductClicks = Object.entries(productCounts).map(([key, count]) => {
      const [product_id, product_name] = key.split('-')
      return { product_id: parseInt(product_id), 'products.name': product_name, count }
    })

    return {
      success: true,
      data: {
        stateClicks: processedStateClicks,
        productClicks: processedProductClicks
      }
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'エラーが発生しました' 
    }
  }
}
