# GitHub App セットアップガイド

このガイドでは、LGTM画像を自動投稿するGitHub Appの設定方法を説明します。

## 前提条件

- GitHub アカウント
- デプロイ済みのアプリケーション（Vercel、Cloudflare Pages など）

## 1. GitHub App の作成

1. https://github.com/settings/apps/new にアクセス

2. **基本情報**を入力:
   - **GitHub App name**: `LGTM Bot` （任意の名前）
   - **Homepage URL**: `https://your-domain.com`
   - **Webhook URL**: `https://your-domain.com/api/github/webhook`
   - **Webhook secret**: ランダムな文字列を生成（後で使用）
     ```bash
     # 生成例
     openssl rand -hex 32
     ```

3. **Repository permissions** を設定:
   - **Pull requests**: `Read & write`（コメント投稿用）

4. **Subscribe to events** を設定:
   - ✅ **Pull request reviews** にチェック

5. **Where can this GitHub App be installed?**
   - 用途に応じて選択:
     - `Only on this account`: 自分のアカウントのみ
     - `Any account`: 公開アプリとして他のユーザーも利用可能

6. **Create GitHub App** をクリック

## 2. Private Key の生成

1. 作成したGitHub Appの設定ページに移動
2. **General** タブの下部にある **Private keys** セクションへ
3. **Generate a private key** をクリック
4. `.pem` ファイルがダウンロードされます（大切に保管）

## 3. App ID の確認

GitHub Appの設定ページの上部に **App ID** が表示されています。メモしておきます。

## 4. 環境変数の設定

デプロイ環境（Vercel、Cloudflare Pages など）に以下の環境変数を追加します。

### 必要な環境変数

```env
# 既存の環境変数
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_OGP_ENTRY_ID=your_entry_id
API_TOKEN=your_api_token

# 新規追加（GitHub App用）
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKC...\n-----END RSA PRIVATE KEY-----"
GITHUB_WEBHOOK_SECRET=your_generated_secret
```

### Private Key の設定方法

`.pem` ファイルの内容をそのままコピーして、改行を `\n` に置き換えます。

```bash
# macOS/Linux の場合
cat your-app.2024-01-01.private-key.pem | awk '{printf "%s\\n", $0}'
```

または、以下のようにダブルクォートで囲んで複数行として設定:
```
"-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
...
-----END RSA PRIVATE KEY-----"
```

## 5. GitHub App のインストール

1. GitHub Appの設定ページで **Install App** タブを選択
2. インストール先のアカウント/Organizationを選択
3. リポジトリのアクセス権限を設定:
   - **All repositories**: すべてのリポジトリで有効
   - **Only select repositories**: 特定のリポジトリのみ
4. **Install** をクリック

## 6. 動作確認

1. インストールしたリポジトリでPull Requestを作成
2. レビューを承認（Approve）
3. 自動的にランダムなLGTM画像がコメントとして投稿される

## トラブルシューティング

### Webhookが届かない場合

1. GitHub Appの設定ページで **Advanced** タブを確認
2. **Recent Deliveries** でWebhookの配信状況を確認
3. ステータスコードが `200` 以外の場合、エラーログを確認

### 環境変数の確認

デプロイ環境で環境変数が正しく設定されているか確認:
- `GITHUB_APP_ID`: 数字のみ
- `GITHUB_APP_PRIVATE_KEY`: PEM形式の秘密鍵
- `GITHUB_WEBHOOK_SECRET`: Webhook設定時に生成した文字列

### ログの確認

デプロイ環境のログで以下を確認:
```
Processing approved review from [user] on PR #[number]
Successfully posted LGTM image to [repo]#[number]
```

## セキュリティ上の注意

- **Private Key** は絶対に公開リポジトリにコミットしない
- `.env` ファイルは `.gitignore` に含まれていることを確認
- Webhook Secretは強力なランダム文字列を使用
- 定期的にPrivate Keyをローテーション

## 参考リンク

- [GitHub Apps Documentation](https://docs.github.com/en/apps)
- [Octokit Documentation](https://octokit.github.io/rest.js/)
- [GitHub Webhooks](https://docs.github.com/en/webhooks)
