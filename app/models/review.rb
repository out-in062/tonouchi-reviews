class Review < ApplicationRecord
  belongs_to :user
  belongs_to :course
  has_many :review_reactions, dependent: :destroy

  validates :rating, presence: true
  validates :title, presence: true
  validates :content, presence: true

  validates :user_id, uniqueness: { scope: :course_id, message: 'has already reviewed this course' }
end
