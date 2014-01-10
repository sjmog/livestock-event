class FixColumnNames < ActiveRecord::Migration
  def self.up
      rename_column :tiles, :content, :tile_content
      rename_column :tabs, :content, :tab_content
    end

    def self.down
      # rename back if you need or do something else or do nothing
      rename_column :tiles, :tile_content, :content
      rename_column :tabs, :tab_content, :content
    end
end
