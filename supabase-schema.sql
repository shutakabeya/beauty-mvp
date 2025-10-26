-- データベーススキーマ定義
-- SupabaseのSQL Editorで実行してください

-- profiles テーブル（認証・認可用）
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- categories テーブル（新規追加）
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- states テーブル（効果テーブル）
CREATE TABLE states (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- products テーブル（管理者機能拡張）
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  affiliate_url TEXT NOT NULL,
  image_url TEXT,
  state_id INTEGER REFERENCES states(id) ON DELETE CASCADE,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
  -- 将来の拡張: state_ids INTEGER[] への移行を想定（現在は単一state_id維持）
);

-- click_logs テーブル
CREATE TABLE click_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  state_id INTEGER REFERENCES states(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  session_id TEXT
);

-- インデックス作成
CREATE INDEX idx_products_state_id ON products(state_id);
CREATE INDEX idx_click_logs_timestamp ON click_logs(timestamp);
CREATE INDEX idx_click_logs_state_id ON click_logs(state_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
CREATE INDEX idx_states_category_id ON states(category_id);
CREATE INDEX idx_states_sort_order ON states(sort_order);

-- サンプルデータ挿入
-- カテゴリデータ
INSERT INTO categories (id, name, sort_order) VALUES
(1, '肌', 1),
(2, '印象', 2),
(3, '朝の準備', 3),
(4, '清潔感', 4),
(5, '口元', 5),
(6, '手元', 6);

-- 効果データ（states）
INSERT INTO states (id, name, description, image_url, category_id, sort_order) VALUES
(1, '清潔感を出したい', '清潔感のある印象を与えたい人向け', '/images/clean.jpg', 4, 1),
(2, '赤みをなくしたい', '肌の赤みを自然に抑えたい人向け', '/images/redness.jpg', 1, 2),
(3, '青ヒゲを目立たなくしたい', '青ヒゲを目立たなくしたい人向け', '/images/beard.jpg', 1, 3),
(4, '肌を明るくしたい', '肌を明るく見せたい人向け', '/images/bright.jpg', 1, 4),
(5, '毛穴を目立たなくしたい', '毛穴を目立たなくしたい人向け', '/images/pores.jpg', 1, 5);

-- サンプル商品データ
INSERT INTO products (name, brand, affiliate_url, image_url, state_id, description) VALUES
-- 清潔感を出したい
('クレンジングフォーム', '資生堂', 'https://www.amazon.co.jp/dp/B08XXXXXXX?tag=YOURTAG-22', '/images/cleansing.jpg', 1, '毛穴の汚れをしっかり落とす洗顔料'),
('化粧水', 'SK-II', 'https://www.amazon.co.jp/dp/B09XXXXXXX?tag=YOURTAG-22', '/images/toner.jpg', 1, '肌を清潔に保つ化粧水'),

-- 赤みをなくしたい
('CICA鎮静ローション', 'VT Cosmetics', 'https://www.amazon.co.jp/dp/B10XXXXXXX?tag=YOURTAG-22', '/images/cica.jpg', 2, '肌の赤みを抑える韓国コスメ定番ローション'),
('アロエジェル', 'ナチュラルハウス', 'https://www.amazon.co.jp/dp/B11XXXXXXX?tag=YOURTAG-22', '/images/aloe.jpg', 2, '敏感肌にも優しいアロエジェル'),

-- 青ヒゲを目立たなくしたい
('カラーコレクティングプライマー', 'NYX', 'https://www.amazon.co.jp/dp/B12XXXXXXX?tag=YOURTAG-22', '/images/orange-primer.jpg', 3, '青ヒゲを隠すオレンジ系プライマー'),
('コンシーラー', 'NARS', 'https://www.amazon.co.jp/dp/B13XXXXXXX?tag=YOURTAG-22', '/images/concealer.jpg', 3, '青ヒゲをカバーする高カバーコンシーラー'),

-- 肌を明るくしたい
('ビタミンCセラム', 'The Ordinary', 'https://www.amazon.co.jp/dp/B14XXXXXXX?tag=YOURTAG-22', '/images/vitamin-c.jpg', 4, '肌を明るくするビタミンCセラム'),
('ハイライター', 'Fenty Beauty', 'https://www.amazon.co.jp/dp/B15XXXXXXX?tag=YOURTAG-22', '/images/highlighter.jpg', 4, '肌に自然な光を与えるハイライター'),

-- 毛穴を目立たなくしたい
('毛穴パック', 'パック・オブ・ペパー', 'https://www.amazon.co.jp/dp/B16XXXXXXX?tag=YOURTAG-22', '/images/pore-pack.jpg', 5, '毛穴の汚れを吸着するパック'),
('毛穴プライマー', 'ベネフィット', 'https://www.amazon.co.jp/dp/B17XXXXXXX?tag=YOURTAG-22', '/images/pore-primer.jpg', 5, '毛穴を目立たなくするプライマー');
