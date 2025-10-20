class CreateSyllabuses < ActiveRecord::Migration[8.0]
  def change
    create_table :syllabuses do |t|
      t.integer :code
      t.string :name

      t.timestamps
    end
  end
end
