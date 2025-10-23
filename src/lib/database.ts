import { supabase, State, Product, ClickLog } from './supabase'

// 全ての状態を取得
export async function getStates(): Promise<State[]> {
  // 環境変数が設定されていない場合はダミーデータを返す
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return [
      { id: 1, name: '清潔感を出したい', description: '清潔感のある印象を与えたい人向け', image_url: '/images/clean.jpg' },
      { id: 2, name: '赤みをなくしたい', description: '肌の赤みを自然に抑えたい人向け', image_url: '/images/redness.jpg' },
      { id: 3, name: '青ヒゲを目立たなくしたい', description: '青ヒゲを目立たなくしたい人向け', image_url: '/images/beard.jpg' },
      { id: 4, name: '肌を明るくしたい', description: '肌を明るく見せたい人向け', image_url: '/images/bright.jpg' },
      { id: 5, name: '毛穴を目立たなくしたい', description: '毛穴を目立たなくしたい人向け', image_url: '/images/pores.jpg' }
    ]
  }

  const { data, error } = await supabase
    .from('states')
    .select('*')
    .order('id')

  if (error) {
    console.error('Error fetching states:', error)
    return []
  }

  return data || []
}

// 特定の状態の商品を取得（アクティブのみ）
export async function getProductsByStateId(stateId: number): Promise<Product[]> {
  // 環境変数が設定されていない場合はダミーデータを返す
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    const dummyProducts: Product[] = [
      // 清潔感を出したい
      { id: 1, name: 'クレンジングフォーム', brand: '資生堂', affiliate_url: 'https://www.amazon.co.jp/dp/B08XXXXXXX?tag=YOURTAG-22', image_url: '/images/cleansing.jpg', state_id: 1, description: '毛穴の汚れをしっかり落とす洗顔料', status: 'active' },
      { id: 2, name: '化粧水', brand: 'SK-II', affiliate_url: 'https://www.amazon.co.jp/dp/B09XXXXXXX?tag=YOURTAG-22', image_url: '/images/toner.jpg', state_id: 1, description: '肌を清潔に保つ化粧水', status: 'active' },
      
      // 赤みをなくしたい
      { id: 3, name: 'CICA鎮静ローション', brand: 'VT Cosmetics', affiliate_url: 'https://www.amazon.co.jp/dp/B10XXXXXXX?tag=YOURTAG-22', image_url: '/images/cica.jpg', state_id: 2, description: '肌の赤みを抑える韓国コスメ定番ローション', status: 'active' },
      { id: 4, name: 'アロエジェル', brand: 'ナチュラルハウス', affiliate_url: 'https://www.amazon.co.jp/dp/B11XXXXXXX?tag=YOURTAG-22', image_url: '/images/aloe.jpg', state_id: 2, description: '敏感肌にも優しいアロエジェル', status: 'active' },
      
      // 青ヒゲを目立たなくしたい
      { id: 5, name: 'カラーコレクティングプライマー', brand: 'NYX', affiliate_url: 'https://www.amazon.co.jp/dp/B12XXXXXXX?tag=YOURTAG-22', image_url: '/images/orange-primer.jpg', state_id: 3, description: '青ヒゲを隠すオレンジ系プライマー', status: 'active' },
      { id: 6, name: 'コンシーラー', brand: 'NARS', affiliate_url: 'https://www.amazon.co.jp/dp/B13XXXXXXX?tag=YOURTAG-22', image_url: '/images/concealer.jpg', state_id: 3, description: '青ヒゲをカバーする高カバーコンシーラー', status: 'active' },
      
      // 肌を明るくしたい
      { id: 7, name: 'ビタミンCセラム', brand: 'The Ordinary', affiliate_url: 'https://www.amazon.co.jp/dp/B14XXXXXXX?tag=YOURTAG-22', image_url: '/images/vitamin-c.jpg', state_id: 4, description: '肌を明るくするビタミンCセラム', status: 'active' },
      { id: 8, name: 'ハイライター', brand: 'Fenty Beauty', affiliate_url: 'https://www.amazon.co.jp/dp/B15XXXXXXX?tag=YOURTAG-22', image_url: '/images/highlighter.jpg', state_id: 4, description: '肌に自然な光を与えるハイライター', status: 'active' },
      
      // 毛穴を目立たなくしたい
      { id: 9, name: '毛穴パック', brand: 'パック・オブ・ペパー', affiliate_url: 'https://www.amazon.co.jp/dp/B16XXXXXXX?tag=YOURTAG-22', image_url: '/images/pore-pack.jpg', state_id: 5, description: '毛穴の汚れを吸着するパック', status: 'active' },
      { id: 10, name: '毛穴プライマー', brand: 'ベネフィット', affiliate_url: 'https://www.amazon.co.jp/dp/B17XXXXXXX?tag=YOURTAG-22', image_url: '/images/pore-primer.jpg', state_id: 5, description: '毛穴を目立たなくするプライマー', status: 'active' }
    ]
    
    return dummyProducts.filter(product => product.state_id === stateId && product.status === 'active')
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('state_id', stateId)
    .eq('status', 'active')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

// 特定の状態を取得
export async function getStateById(stateId: number): Promise<State | null> {
  // 環境変数が設定されていない場合はダミーデータを返す
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    const dummyStates: State[] = [
      { id: 1, name: '清潔感を出したい', description: '清潔感のある印象を与えたい人向け', image_url: '/images/clean.jpg' },
      { id: 2, name: '赤みをなくしたい', description: '肌の赤みを自然に抑えたい人向け', image_url: '/images/redness.jpg' },
      { id: 3, name: '青ヒゲを目立たなくしたい', description: '青ヒゲを目立たなくしたい人向け', image_url: '/images/beard.jpg' },
      { id: 4, name: '肌を明るくしたい', description: '肌を明るく見せたい人向け', image_url: '/images/bright.jpg' },
      { id: 5, name: '毛穴を目立たなくしたい', description: '毛穴を目立たなくしたい人向け', image_url: '/images/pores.jpg' }
    ]
    
    return dummyStates.find(state => state.id === stateId) || null
  }

  const { data, error } = await supabase
    .from('states')
    .select('*')
    .eq('id', stateId)
    .single()

  if (error) {
    console.error('Error fetching state:', error)
    return null
  }

  return data
}

// クリックログを記録
export async function logClick(stateId: number, productId: number, sessionId: string): Promise<void> {
  // 環境変数が設定されていない場合は何もしない
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    console.log('Click logged (demo mode):', { stateId, productId, sessionId })
    return
  }

  const { error } = await supabase
    .from('click_logs')
    .insert({
      state_id: stateId,
      product_id: productId,
      session_id: sessionId,
      timestamp: new Date().toISOString()
    })

  if (error) {
    console.error('Error logging click:', error)
  }
}
