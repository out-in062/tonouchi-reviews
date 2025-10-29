class CreateCourses < ActiveRecord::Migration[8.0]
  def change
    create_table :courses do |t|
      t.string :code
      t.string :name, null: false
      t.string :instructor, null: false
      t.string :department
      t.string :semester
      t.integer :year
      t.integer :credits
      t.text :description

      t.timestamps
    end
    add_index :courses, :code, unique: true
  end
end
