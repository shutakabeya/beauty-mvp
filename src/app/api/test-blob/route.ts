// テスト用のAPIエンドポイント
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // 環境変数の確認
    const token = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!token) {
      return NextResponse.json({ 
        error: 'BLOB_READ_WRITE_TOKEN が設定されていません',
        hasToken: false 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      hasToken: true,
      tokenLength: token.length,
      message: 'Vercel Blob トークンが正しく設定されています'
    })

  } catch (error) {
    return NextResponse.json({ 
      error: '設定確認中にエラーが発生しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
