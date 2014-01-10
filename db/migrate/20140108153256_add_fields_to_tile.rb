class AddFieldsToTile < ActiveRecord::Migration
  def change
    add_column :tiles, :name, :string
    add_column :tiles, :exhibitor, :boolean
    add_column :tiles, :visitor, :boolean
    add_column :tiles, :general, :boolean
  end
end
