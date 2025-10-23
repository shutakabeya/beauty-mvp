# セットアップガイド

## 前提条件

- Node.js 18以上がインストールされていること
- Supabaseアカウント（無料プランでOK）
- Google Analyticsアカウント（GA4）

## 1. プロジェクトのセットアップ

```bash
cd beauty-mvp
npm install
```

## 2. Supabaseの設定

### 2.1 Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセス
2. 「New Project」をクリック
3. プロジェクト名を入力して作成

### 2.2 データベーステーブルの作成

1. Supabaseダッシュボードで「SQL Editor」を開く
2. `supabase-schema.sql`の内容をコピー＆ペースト
3. 「Run」をクリックして実行

### 2.3 APIキーの取得

1. Supabaseダッシュボードで「Settings」→「API」を開く
2. 以下の情報をコピー：
   - Project URL
   - anon public key

## 3. Google Analytics 4の設定

### 3.1 GA4プロパティの作成

1. [Google Analytics](https://analytics.google.com)にアクセス
2. 「管理」→「プロパティを作成」
3. GA4プロパティを作成
4. 測定IDをコピー（G-XXXXXXXXXX形式）

## 4. 環境変数の設定

プロジェクトルートに`.env.local`ファイルを作成：

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**注意**: `.env.local`はGitにコミットしないでください（.gitignoreに含まれています）

### 4.1 環境変数ファイルの作成手順

1. プロジェクトルートで以下のコマンドを実行：
```bash
cp env.example .env.local
```

2. `.env.local`ファイルを編集して実際の値を設定：
   - SupabaseのURLとキーを設定
   - Google Analyticsの測定IDを設定

3. 設定が完了したら開発サーバーを再起動：
```bash
npm run dev
```

## 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて確認してください。

## 6. 動作確認

### トップページ
- 5つの「なりたい状態」が表示されること
- ボタンをクリックすると提案ページに遷移すること

### 提案ページ
- 商品カードが表示されること
- 「Amazonで見る」ボタンをクリックすると新規タブで開くこと

### GA4イベント
- ブラウザのデベロッパーツールで「Network」タブを開く
- GA4イベントが送信されていることを確認

## 7. デプロイ（Vercel）

### 7.1 GitHubリポジトリにプッシュ

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 7.2 Vercelでデプロイ

1. [Vercel](https://vercel.com)にアクセス
2. 「Import Project」をクリック
3. GitHubリポジトリを選択
4. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
5. 「Deploy」をクリック

## トラブルシューティング

### ビルドエラーが発生する場合

```bash
# node_modulesと.nextを削除して再インストール
rm -rf node_modules .next
npm install
npm run build
```

### Supabaseに接続できない場合

- `.env.local`ファイルが正しく設定されているか確認
- Supabaseプロジェクトが有効になっているか確認
- URLとキーが正しいか確認

### GA4イベントが送信されない場合

- 測定IDが正しく設定されているか確認
- ブラウザのアドブロッカーを無効にする
- GA4リアルタイムレポートで確認（反映に数分かかる場合があります）

## Amazonアフィリエイトタグの設定

実際の運用時は、`supabase-schema.sql`内の`YOURTAG-22`を自分のAmazonアソシエイトタグに置き換えてください。

```sql
-- 例：
'https://www.amazon.co.jp/dp/B08XXXXXXX?tag=your-associate-tag-22'
```

## サポート

問題が解決しない場合は、以下を確認してください：
- Next.jsドキュメント: https://nextjs.org/docs
- Supabaseドキュメント: https://supabase.com/docs
- Vercelドキュメント: https://vercel.com/docs
