# 授業レビューシステム (Class Review System)

This README would normally document whatever steps are necessary to get the
application up and running.

## 変更履歴 (Change Log)

### 2025-10-06
- READMEを標準的なRails形式に更新
- プロジェクト構造をRails標準に変更
- 授業レビューシステムからRailsアプリケーションへの移行

## 技術仕様 (Technical Specifications)

Things you may want to cover:

* Ruby version: 3.4.6

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

## 開発環境セットアップ (Development Setup)

```bash
# プロジェクトクローン
git clone [repository-url]
cd tonouchi-class-reviews

# 依存関係インストール
bundle install

# データベース作成・初期化
rails db:create
rails db:migrate

# サーバー起動
rails server
```

## プロジェクト概要 (Project Overview)

大学の授業レビューシステムを構築するためのRuby on Railsアプリケーションです。

### 主な機能予定 (Planned Features)
- 授業の検索機能
- 授業レビューの投稿（5段階評価・コメント）
- レビューの閲覧機能

...
