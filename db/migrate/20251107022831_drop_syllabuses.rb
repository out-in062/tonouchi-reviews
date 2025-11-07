class DropSyllabuses < ActiveRecord::Migration[8.0]
  def change
    drop_table :syllabuses do |t|
      t.integer "code"
      t.string "name"
      t.datetime "created_at", null: false
      t.datetime "updated_at", null: false
    end
  end
end