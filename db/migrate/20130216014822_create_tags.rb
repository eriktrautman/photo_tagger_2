class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name
      t.integer :image_id
      t.integer :x
      t.integer :y
      t.timestamps
    end
  end
end
