import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 環境変数のチェック
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN が設定されていません')
      return NextResponse.json({ 
        error: 'ファイルアップロード機能が設定されていません。環境変数を確認してください。' 
      }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 })
    }

    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'ファイルサイズは5MB以下にしてください' }, { status: 400 })
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'JPEG、PNG、WebP、GIFファイルのみアップロード可能です' }, { status: 400 })
    }

    // ユニークなファイル名を生成
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(7)
    const uniqueFileName = `${timestamp}-${randomSuffix}-${file.name}`

    // Vercel Blobにアップロード
    const blob = await put(uniqueFileName, file, {
      access: 'public',
    })

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      filename: file.name 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'アップロードに失敗しました',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
