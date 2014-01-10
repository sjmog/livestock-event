class AddTitleToTiles < ActiveRecord::Migration
  def change
    add_column :tiles, :title, :string
  end
end
