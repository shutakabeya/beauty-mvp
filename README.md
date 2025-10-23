# どうなりたいかドリブン - 美容MVP Webアプリ

「どうなりたいかドリブン」の美容MVP Webアプリです。ユーザーが「なりたい状態」を選ぶと、その状態に対応するAmazonアフィリエイトリンク付き商品を提案するプラットフォームです。

## 技術スタック

- **フレームワーク**: Next.js (App Router)
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **分析**: Google Analytics 4 (GA4)
- **状態管理**: useState / useRouter
- **ホスティング**: Vercel想定

## 機能

### ① トップページ（状態選択画面）
- 5つの「なりたい状態」から選択
- GA4イベント `select_state` でトラッキング
- 各状態ページへの遷移

### ② 提案ページ（/suggestion/[state_id]）
- 選択された状態に対応する商品提案
- Amazonアフィリエイトリンク付き商品カード
- GA4イベント `click_affiliate` でトラッキング

### ③ データベース構造
- `states`: 状態データ（清潔感、赤み、青ヒゲなど）
- `products`: 商品データ（Amazonリンク付き）
- `click_logs`: クリックログ（分析用）

## セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_measurement_id
```

### 3. Supabaseデータベースの設定

1. [Supabase](https://supabase.com)でプロジェクトを作成
2. SQL Editorで `supabase-schema.sql` の内容を実行
3. 環境変数にSupabaseのURLとキーを設定

### 4. Google Analytics 4の設定

1. [Google Analytics](https://analytics.google.com)でGA4プロパティを作成
2. 測定IDを取得して環境変数に設定

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## データベーススキーマ

### states テーブル
| column | type | example |
|---------|------|----------|
| id | integer | 1 |
| name | text | 赤みをなくしたい |
| description | text | 肌の赤みを自然に抑えたい人向け |
| image_url | text | (状態ごとの画像URL) |

### products テーブル
| column | type | example |
|---------|------|----------|
| id | integer | 1 |
| name | text | CICA鎮静ローション |
| brand | text | VT Cosmetics |
| affiliate_url | text | https://www.amazon.co.jp/dp/XXXX?tag=YOURTAG-22 |
| image_url | text | /img/cica.png |
| state_id | integer | 2（赤みをなくしたい） |
| description | text | 肌の赤みを抑える韓国コスメ定番ローション |

### click_logs テーブル
| column | type | example |
|---------|------|----------|
| id | uuid |  |
| timestamp | timestamptz | now() |
| state_id | integer | 2 |
| product_id | integer | 1 |
| session_id | text | (cookie/sessionから) |

## GA4イベント設計

| event_name | parameters |
|-------------|-------------|
| view_home | なし |
| select_state | state_name |
| view_suggestion | state_name |
| click_affiliate | state_name, product_name, product_id |

## デプロイ

### Vercelでのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

## MVPのKPI（分析想定）

- **CTR（状態選択率）** = select_state / view_home（目標70%以上）
- **各状態のクリック分布**（どの"なりたい"が刺さるか）
- **商品クリック率** = click_affiliate / view_suggestion
- **平均滞在時間／離脱率**

## 注意事項

- Amazonアフィリエイトリンクはダミータグ（`YOURTAG-22`）を使用
- 実際の運用時は適切なアフィリエイトタグに変更してください
- 外部リンクは `rel="noopener noreferrer"` 付きで新規タブで開きます

## ライセンス

MIT License