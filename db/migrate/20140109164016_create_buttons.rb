class CreateButtons < ActiveRecord::Migration
  def change
    create_table :buttons do |t|
      t.references :tile, index: true
      t.string :icon
      t.string :button_link
      t.string :title

      t.timestamps
    end
  end
end
