# プロジェクト概要

## 「どうなりたいかドリブン」美容MVP Webアプリ

### プロジェクトの目的
ユーザーが「なりたい状態」を選択することで、その状態に対応するAmazonアフィリエイトリンク付き商品を提案するプラットフォーム。MVPの目的は「どの"なりたい状態"が最もクリックされるか」を分析することです。

### 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16.0.0 (App Router) |
| UI/スタイリング | Tailwind CSS |
| フォント | Noto Sans JP |
| データベース | Supabase (PostgreSQL) |
| 分析 | Google Analytics 4 |
| ホスティング | Vercel推奨 |

### プロジェクト構造

```
beauty-mvp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # ルートレイアウト
│   │   ├── page.tsx           # トップページ（状態選択）
│   │   └── suggestion/
│   │       └── [state_id]/
│   │           └── page.tsx   # 提案ページ
│   ├── components/
│   │   └── GoogleAnalytics.tsx # GA4コンポーネント
│   └── lib/
│       ├── supabase.ts        # Supabase クライアント
│       ├── database.ts        # データベース操作
│       └── analytics.ts       # GA4 イベント送信
├── supabase-schema.sql        # データベーススキーマ
├── tailwind.config.js         # Tailwind設定
├── SETUP.md                   # セットアップガイド
└── README.md                  # プロジェクト説明
```

### 主要機能

#### 1. トップページ（状態選択画面）
- **パス**: `/`
- **機能**:
  - 5つの「なりたい状態」を表示
  - クリックで提案ページへ遷移
  - GA4イベント `select_state` を送信

#### 2. 提案ページ
- **パス**: `/suggestion/[state_id]`
- **機能**:
  - 選択された状態に応じた商品を表示
  - 各商品にAmazonアフィリエイトリンク
  - GA4イベント `click_affiliate` を送信

### データベース設計

#### `states` テーブル
```sql
id          | integer  | 主キー
name        | text     | 状態名（例：清潔感を出したい）
description | text     | 説明文
image_url   | text     | 画像URL
```

#### `products` テーブル
```sql
id            | integer  | 主キー
name          | text     | 商品名
brand         | text     | ブランド名
affiliate_url | text     | Amazonアフィリエイトリンク
image_url     | text     | 商品画像URL
state_id      | integer  | 外部キー → states.id
description   | text     | 商品説明
```

#### `click_logs` テーブル
```sql
id         | uuid         | 主キー
timestamp  | timestamptz  | クリック時刻
state_id   | integer      | 外部キー → states.id
product_id | integer      | 外部キー → products.id
session_id | text         | セッションID
```

### GA4イベント設計

| イベント名 | パラメータ | 説明 |
|-----------|----------|------|
| `view_home` | なし | トップページ閲覧 |
| `select_state` | `state_name` | 状態選択 |
| `view_suggestion` | `state_name` | 提案ページ閲覧 |
| `click_affiliate` | `state_name`, `product_name`, `product_id` | アフィリエイトリンククリック |

### KPI（分析指標）

1. **CTR（状態選択率）** = `select_state` / `view_home`
   - 目標: 70%以上

2. **各状態のクリック分布**
   - どの"なりたい状態"が最も人気か

3. **商品クリック率** = `click_affiliate` / `view_suggestion`
   - 各状態ごとのコンバージョン率

4. **平均滞在時間／離脱率**
   - ユーザーエンゲージメント分析

### UIデザイン方針

- **モバイルファースト**: スマホ最適化優先
- **カラー**: 白ベース + 青グレーアクセント（メンズ美容を意識）
- **フォント**: Noto Sans JP（日本語最適化）
- **アニメーション**: ホバー時の軽いトランジション
- **レスポンシブ**: タブレット・デスクトップにも対応

### セキュリティと外部リンク

- 全ての外部リンクに `rel="noopener noreferrer"` を設定
- 新規タブで開く仕様
- 環境変数は`.env.local`で管理（Gitにコミットしない）

### 次のステップ（Phase 2想定）

1. **Stripe決済統合**
   - 直接購入機能の追加

2. **ブランド提携**
   - 公式ブランドとの連携

3. **レコメンデーション機能**
   - AIによる商品提案の最適化

4. **ユーザーアカウント**
   - お気に入り機能
   - 購入履歴

### 開発期間
- 初期開発: 完了
- テスト: Supabase設定後に可能
- デプロイ: Vercelで即座に可能

### 注意事項

1. **Amazonアソシエイト**: 
   - 実運用前にAmazonアソシエイトプログラムに参加必須
   - ダミータグ `YOURTAG-22` を自分のタグに置き換える

2. **データベース**: 
   - `supabase-schema.sql` をSupabaseで実行する必要あり
   - サンプルデータも含まれています

3. **環境変数**: 
   - `.env.local` ファイルを作成して設定
   - Vercelデプロイ時にも設定が必要

### サポートドキュメント

- `README.md`: プロジェクト概要とクイックスタート
- `SETUP.md`: 詳細なセットアップ手順
- `supabase-schema.sql`: データベーススキーマとサンプルデータ
- `env.example`: 環境変数のテンプレート
