import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN

  return NextResponse.json({
    supabaseUrl: supabaseUrl ? '設定済み' : '未設定',
    supabaseAnonKey: supabaseAnonKey ? '設定済み' : '未設定',
    blobToken: blobToken ? '設定済み' : '未設定',
    supabaseUrlValue: supabaseUrl,
    supabaseAnonKeyValue: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : '未設定',
    blobTokenValue: blobToken ? blobToken.substring(0, 20) + '...' : '未設定'
  })
}