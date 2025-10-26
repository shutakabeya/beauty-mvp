import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベース型定義
export interface Category {
  id: number
  name: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface State {
  id: number
  name: string
  description: string
  image_url: string
  category_id: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  name: string
  brand: string
  affiliate_url: string
  image_url: string
  state_id: number
  description: string
  status: 'active' | 'hidden'
}

export interface ClickLog {
  id: string
  timestamp: string
  state_id: number
  product_id: number
  session_id: string
}
