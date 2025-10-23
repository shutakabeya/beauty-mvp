import { supabase } from './supabase'
import { redirect } from 'next/navigation'

export interface Profile {
  user_id: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

// 現在のユーザーのプロファイルを取得
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

// 管理者権限チェック
export async function requireAdmin(): Promise<Profile> {
  // 環境変数が設定されていない場合は開発モードとして許可
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return {
      user_id: 'dev-user',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  const profile = await getCurrentUserProfile()
  
  if (!profile || profile.role !== 'admin') {
    redirect('/admin/login')
  }
  
  return profile
}

// ログイン状態チェック
export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentUserProfile()
  
  if (!profile) {
    redirect('/admin/login')
  }
  
  return profile
}

// ログイン処理
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// ログアウト処理
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

// プロファイル作成（新規ユーザー用）
export async function createProfile(userId: string, role: 'admin' | 'user' = 'user') {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userId,
      role: role
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}
