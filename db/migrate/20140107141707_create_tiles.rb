class CreateTiles < ActiveRecord::Migration
  def change
    create_table :tiles do |t|
      t.string :type
      t.string :height
      t.string :width
      t.string :group
      t.string :content

      t.timestamps
    end
  end
end
