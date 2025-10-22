class User < ApplicationRecord
  has_many :reviews, dependent: :destroy
  has_many :review_reactions, dependent: :destroy

  has_secure_password

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :student_id, uniqueness: true, allow_blank: true
end
