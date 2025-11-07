# 授業口コミサイト 設計書

## 1. プロジェクト概要

### 1.1 目的
学生が授業に対する口コミ（レビュー）を投稿・閲覧できるWebアプリケーション

### 1.2 主な機能
- 授業の検索・閲覧
- 授業に対する口コミの投稿
- 口コミの閲覧・評価
- ユーザー登録・ログイン

---

## 2. データモデル設計

### 2.1 主要エンティティ

#### User（ユーザー）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | bigint | PK | ユーザーID |
| email | string | NOT NULL, UNIQUE | メールアドレス |
| password_digest | string | NOT NULL | 暗号化されたパスワード |
| name | string | NOT NULL | 表示名 |
| student_id | string | UNIQUE | 学籍番号（任意） |
| created_at | datetime | NOT NULL | 作成日時 |
| updated_at | datetime | NOT NULL | 更新日時 |

#### Course（授業）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | bigint | PK | 授業ID |
| code | string | UNIQUE | 授業コード |
| name | string | NOT NULL | 授業名 |
| instructor | string | NOT NULL | 担当教員名 |
| department | string | | 学部・学科 |
| semester | string | | 開講学期（例：前期、後期） |
| year | integer | | 開講年度 |
| credits | integer | | 単位数 |
| description | text | | 授業概要 |
| created_at | datetime | NOT NULL | 作成日時 |
| updated_at | datetime | NOT NULL | 更新日時 |

#### Review（口コミ）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | bigint | PK | 口コミID |
| user_id | bigint | NOT NULL, FK | 投稿者ID |
| course_id | bigint | NOT NULL, FK | 授業ID |
| rating | integer | NOT NULL | 総合評価（1-5） |
| difficulty | integer | | 難易度（1-5） |
| workload | integer | | 課題量（1-5） |
| title | string | NOT NULL | タイトル |
| content | text | NOT NULL | 口コミ本文 |
| attendance_required | boolean | | 出席必須か |
| exam_info | text | | 試験情報 |
| tips | text | | アドバイス・コツ |
| semester_taken | string | | 受講学期 |
| year_taken | integer | | 受講年度 |
| published | boolean | DEFAULT true | 公開フラグ |
| created_at | datetime | NOT NULL | 作成日時 |
| updated_at | datetime | NOT NULL | 更新日時 |

#### ReviewReaction（口コミへの反応）
| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | bigint | PK | 反応ID |
| user_id | bigint | NOT NULL, FK | ユーザーID |
| review_id | bigint | NOT NULL, FK | 口コミID |
| reaction_type | string | NOT NULL | 反応タイプ（helpful, not_helpful） |
| created_at | datetime | NOT NULL | 作成日時 |
| updated_at | datetime | NOT NULL | 更新日時 |

**制約**: user_id と review_id の複合ユニーク制約

### 2.2 リレーションシップ

```
User (1) ─── (N) Review
Course (1) ─── (N) Review
User (1) ─── (N) ReviewReaction
Review (1) ─── (N) ReviewReaction
```

---

## 3. 画面設計

### 3.1 主要画面一覧

#### トップページ（/）
- 検索フォーム（授業名、教員名、授業コード）
- 人気の授業一覧
- 最新の口コミ一覧

#### 授業一覧ページ（/courses）
- 授業リスト（ページネーション付き）
- フィルター機能（学部、学期、教員名）
- ソート機能（評価順、新着順、授業コード順）

#### 授業詳細ページ（/courses/:id）
- 授業の基本情報
- 平均評価（総合、難易度、課題量）
- 口コミ一覧
- 口コミ投稿ボタン

#### 口コミ投稿ページ（/courses/:course_id/reviews/new）
- 評価入力フォーム
- 本文入力フォーム
- プレビュー機能

#### 口コミ詳細ページ（/reviews/:id）
- 口コミの詳細内容
- 役立った/役立たなかったボタン
- 編集・削除ボタン（投稿者のみ）

#### ユーザー登録ページ（/signup）
- メールアドレス、パスワード、表示名入力

#### ログインページ（/login）
- メールアドレス、パスワード入力

#### マイページ（/mypage）
- 自分が投稿した口コミ一覧
- プロフィール編集

---

## 4. 機能要件

### 4.1 認証・認可
- ユーザー登録（メール認証なし／シンプル版）
- ログイン・ログアウト
- 口コミ投稿にはログインが必要
- 自分の口コミのみ編集・削除可能

### 4.2 授業機能
- 授業の一覧表示
- 授業の検索（名前、教員、コード）
- 授業の詳細表示
- 授業の登録（管理者のみ / または初回は手動登録）

### 4.3 口コミ機能
- 口コミの投稿
- 口コミの一覧表示
- 口コミの詳細表示
- 口コミの編集・削除（投稿者のみ）
- 口コミへの反応（役立った/役立たなかった）
- 同一ユーザーは同じ授業に1つの口コミのみ投稿可能（ビジネスルール）

### 4.4 検索・フィルタリング
- 授業名での検索
- 教員名での検索
- 授業コードでの検索
- 学部・学科でのフィルタリング
- 評価でのソート

---

## 5. 技術スタック

### 5.1 バックエンド
- Ruby on Rails 8.0
- Ruby 3.3
- データベース: SQLite（開発）/ PostgreSQL（本番推奨）

### 5.2 フロントエンド
- Hotwire (Turbo + Stimulus)
- Importmap
- CSS: TailwindCSS

### 5.3 認証
- has_secure_password（BCrypt）

---

## 6. 非機能要件

### 6.1 セキュリティ
- パスワードの暗号化
- CSRF対策（Rails標準）
- XSS対策（Rails標準のエスケープ）
- SQL injection対策（ActiveRecordの利用）

### 6.2 パフォーマンス
- N+1クエリの回避（includes, eager_loadの活用）
- ページネーション実装
- キャッシング（必要に応じて）

### 6.3 ユーザビリティ
- レスポンシブデザイン
- 直感的なUI/UX
- エラーメッセージの適切な表示

---

## 7. 今後の拡張案

### Phase 2
- コメント機能（口コミへのコメント）
- タグ機能
- お気に入り機能
- メール通知機能

### Phase 3
- 管理者画面
- レポート機能（不適切な投稿の報告）
- AI による口コミの要約機能
- ソーシャルログイン

---

## 8. 実装の進め方

### Step 1: 基本設定
- [x] Railsプロジェクト作成
- [ ] データベース設計
- [ ] モデル作成

### Step 2: 認証機能
- [ ] Userモデル作成
- [ ] ユーザー登録・ログイン機能

### Step 3: 授業機能
- [ ] Courseモデル作成
- [ ] 授業一覧・詳細画面

### Step 4: 口コミ機能
- [ ] Reviewモデル作成
- [ ] 口コミ投稿・表示機能

### Step 5: 付加機能
- [ ] 検索機能
- [ ] 反応機能
- [ ] UI/UX改善

---

## 9. データベースER図（テキスト版）

```
┌─────────────────┐
│     User        │
├─────────────────┤
│ id (PK)         │
│ email           │
│ password_digest │
│ name            │
│ student_id      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐        ┌──────────────────┐
│    Review       │ N:1    │     Course       │
├─────────────────┤───────▶├──────────────────┤
│ id (PK)         │        │ id (PK)          │
│ user_id (FK)    │        │ code             │
│ course_id (FK)  │        │ name             │
│ instructor      │        │ department       │
│ semester        │        │ year             │
│ credits         │        │ credits          │
│ description     │        │ description      │
└────────┬────────┘        └──────────────────┘
         │
         │ 1:N
         │
┌────────▼────────────┐
│  ReviewReaction     │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ review_id (FK)      │
│ reaction_type       │
└─────────────────────┘
```

---

## 10. 画面遷移図

```
[トップページ] → [授業一覧] → [授業詳細] → [口コミ投稿]
      ↓              ↓             ↓
  [検索結果]    [ユーザー登録]  [口コミ詳細]
                     ↓
                 [ログイン] → [マイページ]
```

---

この設計書は初期バージョンです。実装を進めながら必要に応じて更新していきます
