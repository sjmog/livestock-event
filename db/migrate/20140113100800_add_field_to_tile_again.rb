class AddFieldToTileAgain < ActiveRecord::Migration
  def change
  	add_column :tiles, :tile_variety, :string
  	add_column :tiles, :has_sidebar, :boolean
  	add_column :tiles, :tile_route, :string
  end
end
