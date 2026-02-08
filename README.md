This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# lgtlatte

LGTM画像を簡単に取得・共有できるWebアプリケーションです。GitHub Appとしても機能し、Pull Requestの承認時に自動的にLGTM画像を投稿できます。

## 機能

### Webアプリケーション
- ランダムなLGTM画像の表示
- 画像の無限スクロール
- ページネーション機能

### GitHub App
- Pull Request承認時に自動的にLGTM画像をコメント投稿
- Contentful CMSから画像をランダムに取得
- Webhook経由でリアルタイム処理

## GitHub App セットアップ

GitHub AppとしてLGTM画像を自動投稿する機能を使用するには、[GITHUB_APP_SETUP.md](./GITHUB_APP_SETUP.md) を参照してください。

### 必要な環境変数

```env
# Contentful CMS
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_OGP_ENTRY_ID=your_entry_id

# API Token
API_TOKEN=your_api_token

# GitHub App（オプション）
GITHUB_APP_ID=your_github_app_id
GITHUB_APP_PRIVATE_KEY=your_private_key
GITHUB_WEBHOOK_SECRET=your_webhook_secret
```

`.env.example` ファイルを参考に `.env` ファイルを作成してください。
