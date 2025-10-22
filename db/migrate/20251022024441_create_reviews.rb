class CreateReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :reviews do |t|
      t.integer :rating, null: false
      t.integer :difficulty
      t.integer :workload
      t.string :title, null: false
      t.text :content, null: false
      t.boolean :attendance_required
      t.text :exam_info
      t.text :tips
      t.string :semester_taken
      t.integer :year_taken
      t.boolean :published, default: true, null: false
      t.references :user, null: false, foreign_key: true
      t.references :course, null: false, foreign_key: true

      t.timestamps
    end
  end
end
