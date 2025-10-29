class ReviewReaction < ApplicationRecord
  belongs_to :user
  belongs_to :review

  validates :reaction_type, presence: true, inclusion: { in: %w[helpful not_helpful] }
  validates :user_id, uniqueness: { scope: :review_id, message: "has already reacted to this review" }
end
