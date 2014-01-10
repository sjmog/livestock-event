class FixColumnNamesAgain < ActiveRecord::Migration
	def self.up
	    rename_column :tiles, :type, :tile_type
	  end

	  def self.down
	    # rename back if you need or do something else or do nothing
	    rename_column :tiles, :tile_type, :type
	  end
end
