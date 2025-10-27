# app/models/user.rb
class User < ApplicationRecord
  # この一行があるか確認し、なければ追加してください
  has_secure_password

  # Eメールのフォーマットを検証
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  # student_idも必須でユニークにする
  validates :student_id, presence: true, uniqueness: true
  # 名前の検証
  validates :name, presence: true
  # パスワードの最小文字数
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  # 他のリレーションやメソッド...
end
