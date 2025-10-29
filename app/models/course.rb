class Course < ApplicationRecord
  has_many :reviews, dependent: :destroy

  validates :code, presence: true, uniqueness: true
  validates :name, presence: true
  validates :instructor, presence: true
end
