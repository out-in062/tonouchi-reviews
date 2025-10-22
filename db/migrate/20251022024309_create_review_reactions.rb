class CreateReviewReactions < ActiveRecord::Migration[8.0]
  def change
    create_table :review_reactions do |t|
      t.string :reaction_type, null: false
      t.references :user, null: false, foreign_key: true
      t.references :review, null: false, foreign_key: true

      t.timestamps
    end
    add_index :review_reactions, [:user_id, :review_id], unique: true
  end
end
