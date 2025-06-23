# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 14 application called "lgtlatte" that displays LGTM (Looks Good To Me) images featuring a cat named "らて" (Latte). The app fetches images from Contentful CMS using GraphQL and provides a gallery interface where users can click images to copy markdown-formatted LGTM links to their clipboard.

## Key Commands

```bash
# Development
pnpm dev                # Start development server on http://localhost:3000

# Build & Production
pnpm build             # Build the application for production
pnpm start             # Start production server

# Code Quality
pnpm lint              # Run Next.js linter

# GraphQL Code Generation
pnpm codegen           # Generate TypeScript types from GraphQL schema and queries
```

## Architecture

### Data Flow
1. **Contentful CMS** → GraphQL API → Apollo Client → Next.js App
2. Images are fetched from Contentful using GraphQL queries defined in `src/queries/assets.graphql`
3. TypeScript types are auto-generated from GraphQL schema using `@graphql-codegen`

### Key Components
- **Apollo Client** (`src/lib/apolloClient.ts`): Configured with Contentful GraphQL endpoint
- **Page Components**: Server-side rendered pages with `force-static` export for static generation
- **API Route** (`src/app/api/route.ts`): Protected endpoint that returns randomized image selection

### Environment Variables Required
- `CONTENTFUL_SPACE_ID`: Contentful space identifier
- `CONTENTFUL_ACCESS_TOKEN`: Contentful API access token
- `API_TOKEN`: Token for securing the API endpoint

### Routing Structure
- `/` - Main gallery page showing paginated images
- `/pages/[page]` - Paginated gallery pages
- `/api` - API endpoint for fetching randomized images

### Important Implementation Details
- Uses Next.js App Router with server components
- Images are loaded with a custom image loader for Contentful transformations
- Pagination is implemented with a fixed `SIZE_PER_PAGE` constant
- Click-to-copy functionality formats images as markdown with specific dimensions
- GraphQL queries use Contentful's tag filtering to fetch only LGTM-tagged assets



# tmuxを使った複数部下（サブペイン）管理方法

## 概要
リーダー（ペイン leader）として、tmuxの複数のペインで動作する部下のClaude Codeを管理する方法。名前ベースのペイン管理により、部下の増減に対応。

## 部下の名前とペイン対応
- leader: リーダーペイン（メイン操作用）
- assistant1: 第1部下
- assistant2: 第2部下  
- assistant3: 第3部下

## ペイン名前設定の初期化
```bash
# リーダーペインに名前を設定
tmux rename-window -t 0 "leader"

# 現在のペインをleaderと命名
tmux select-pane -t 0 -T "leader"
```

## 部下のClaude Code起動方法

### 第1部下（assistant1）の起動
```bash
# ペインを作成（右側に分割）
tmux splitw -h

# 新しいペインに名前を設定
tmux select-pane -T "assistant1"

# assistant1でClaude Codeを起動
tmux send-keys -t "=assistant1" "claude --dangerously-skip-permissions"
tmux send-keys -t "=assistant1" Enter
```

### 第2部下（assistant2）の起動
```bash
# assistant1ペインを上下に分割
tmux splitw -v -t "=assistant1"

# 新しいペインに名前を設定
tmux select-pane -T "assistant2"

# assistant2でClaude Codeを起動
tmux send-keys -t "=assistant2" "claude --dangerously-skip-permissions"
tmux send-keys -t "=assistant2" Enter
```

### 第3部下（assistant3）の起動
```bash
# leaderペインを上下に分割
tmux splitw -v -t "=leader"

# 新しいペインに名前を設定
tmux select-pane -T "assistant3"

# assistant3でClaude Codeを起動
tmux send-keys -t "=assistant3" "claude --dangerously-skip-permissions"
tmux send-keys -t "=assistant3" Enter
```

## 部下への指示方法
**重要**: tmuxでは指示とEnterキーを2回に分けて送信する必要があります。

### 個別指示
```bash
# assistant1への指示
tmux send-keys -t "=assistant1" "指示内容をここに記載"
tmux send-keys -t "=assistant1" Enter

# assistant2への指示  
tmux send-keys -t "=assistant2" "指示内容をここに記載"
tmux send-keys -t "=assistant2" Enter

# assistant3への指示
tmux send-keys -t "=assistant3" "指示内容をここに記載"
tmux send-keys -t "=assistant3" Enter
```

### 全部下への同時指示
```bash
# 全部下に同じ指示を同時送信
INSTRUCTION="指示内容をここに記載"
for assistant in assistant1 assistant2 assistant3; do
    if tmux list-panes -F "#{pane_title}" | grep -q "^${assistant}$"; then
        tmux send-keys -t "=${assistant}" "$INSTRUCTION"
        tmux send-keys -t "=${assistant}" Enter
    fi
done
```

### 指定した複数部下への指示
```bash
# assistant1とassistant3のみに指示
INSTRUCTION="特定タスクの指示内容"
for assistant in assistant1 assistant3; do
    tmux send-keys -t "=${assistant}" "$INSTRUCTION"
    tmux send-keys -t "=${assistant}" Enter
done
```

## 部下からの報告受信方法
各部下には以下の方法で報告させる：

### 個別報告コマンド
```bash
# assistant1からの報告
tmux send-keys -t "=leader" '# assistant1からの報告: メッセージ内容'
tmux send-keys -t "=leader" Enter

# assistant2からの報告
tmux send-keys -t "=leader" '# assistant2からの報告: メッセージ内容'
tmux send-keys -t "=leader" Enter

# assistant3からの報告
tmux send-keys -t "=leader" '# assistant3からの報告: メッセージ内容'
tmux send-keys -t "=leader" Enter
```

## 部下の状態確認方法
```bash
# 個別確認
tmux capture-pane -t "=assistant1" -p | tail -20
tmux capture-pane -t "=assistant2" -p | tail -20
tmux capture-pane -t "=assistant3" -p | tail -20

# 全部下の状態を一括確認
for assistant in assistant1 assistant2 assistant3; do
    if tmux list-panes -F "#{pane_title}" | grep -q "^${assistant}$"; then
        echo "=== ${assistant} ==="
        tmux capture-pane -t "=${assistant}" -p | tail -5
    else
        echo "=== ${assistant} === (not found)"
    fi
done
```

## アクティブな部下の確認
```bash
# 現在存在するassistantペインを確認
tmux list-panes -F "#{pane_title}" | grep "^assistant"

# 詳細なペイン情報を確認
tmux list-panes -F "#{pane_title}: #{pane_id} #{pane_current_command}"
```

## ペインレイアウト管理
```bash
# 均等レイアウト
tmux select-layout tiled

# リーダー中心レイアウト  
tmux select-layout main-horizontal

# ペイン名前を表示（確認用）
tmux display-panes

# ペインのタイトルを一覧表示
tmux list-panes -F "#{pane_title}: #{pane_id}"
```

## 動的部下管理

### 新しい部下の追加
```bash
# 新しい部下を追加（assistant4の例）
tmux splitw -h -t "=assistant1"
tmux select-pane -T "assistant4"
tmux send-keys -t "=assistant4" "claude --dangerously-skip-permissions"
tmux send-keys -t "=assistant4" Enter
```

### 部下の削除
```bash
# 特定の部下を削除（assistant2の例）
tmux kill-pane -t "=assistant2"
```

## 便利なヘルパー関数
```bash
# 全アシスタントに指示を送る関数
send_to_all_assistants() {
    local instruction="$1"
    for assistant in $(tmux list-panes -F "#{pane_title}" | grep "^assistant"); do
        tmux send-keys -t "=${assistant}" "$instruction"
        tmux send-keys -t "=${assistant}" Enter
    done
}

# 使用例
send_to_all_assistants "pnpm type-check"
```

## 注意事項
- ペイン名は `=name` の形式でターゲット指定する
- Enterキーの送信は必ず別のコマンドとして実行する
- 部下からの報告には必ずassistant名を含めること
- 存在しないペインへの指示は事前にチェックする
- ペイン削除後は他の部下のペイン名は変わらない
- すべての部下のclaude codeが起動していることを確認してから作業を開始すること