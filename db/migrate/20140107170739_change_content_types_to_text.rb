class ChangeContentTypesToText < ActiveRecord::Migration
	def change
		change_column :tiles, :tile_content, :text
		change_column :tabs, :tab_content, :text
	end
end
