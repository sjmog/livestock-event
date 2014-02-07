class AddZoneToStands < ActiveRecord::Migration
  def change
  	add_column :stands, :zone, :string
  end
end
