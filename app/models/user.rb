class User < ApplicationRecord
  has_many :reviews, dependent: :destroy
  has_many :review_reactions, dependent: :destroy

  has_secure_password

  validates :name, presence: true, length: { maximum: 50 }
  validates :email, presence: true, uniqueness: true, length: { maximum: 255 }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :student_id, uniqueness: true, allow_blank: true
end
