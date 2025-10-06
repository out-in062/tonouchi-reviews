# 授業レビューシステム (Class Review System)

大学の授業レビューシステムを構築するためのRuby on Railsアプリケーションです。
学生に授業のレビューを投稿・閲覧できるシステムです。履修登録の参考として、他の学生の意見を活用できます。

## 変更履歴 (Change Log)

### 2025-10-06
- READMEを標準的なRails形式に更新
- プロジェクト構造をRails標準に変更
- 授業レビューシステムからRailsアプリケーションへの移行
- マージコンフリクトを解決し、日本語説明を統合

## 主な機能 (Main Features)

- 授業の検索機能
- 授業レビューの投稿（5段階評価・コメント）
- レビューの閲覧機能

## 技術仕様 (Technical Specifications)

**Ruby version**: 3.4.6

**System dependencies**:
- Rails 7.x
- PostgreSQL (Database)
- Redis (Cache/Session Store)

**Configuration**:
- Environment variables via Rails credentials
- Database configuration in `config/database.yml`

**Database**:
```bash
rails db:create
rails db:migrate
rails db:seed
```

**How to run the test suite**:
```bash
rails test
```

**Services**: 
- Job queues: Sidekiq
- Cache servers: Redis
- Search engines: Elasticsearch (optional)

**Deployment**: 
- Docker support included
- Heroku compatible

## 開発環境セットアップ (Development Setup)

```bash
# 1. プロジェクトクローン
git clone https://github.com/morijyobi-2025-test-e2e/tonouchi-class-reviews.git
cd tonouchi-class-reviews

# 2. Ruby & Node.js バージョン確認
ruby -v  # 3.4.6
node -v  # 推奨: 18.x以上

# 3. 依存関係インストール
bundle install
npm install  # または yarn install

# 4. データベース作成・初期化
rails db:create
rails db:migrate
rails db:seed

# 5. サーバー起動
rails server
# または
bin/dev  # Procfile.devを使用
```

## 使用方法 (Usage)

1. **ユーザー登録・ログイン**
2. **授業を検索**
3. **レビューを投稿（5段階評価とコメント）**
4. **他の学生のレビューを閲覧**

## 貢献方法 (Contributing)

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/新機能`)
3. 変更をコミット (`git commit -am '新機能を追加'`)
4. ブランチをプッシュ (`git push origin feature/新機能`)
5. プルリクエストを作成
