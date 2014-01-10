class AddAnotherFieldToTile < ActiveRecord::Migration
  def change
    add_column :tiles, :flips, :boolean
    add_column :tiles, :flip_title, :string
    add_column :tiles, :flip_content, :text
    add_column :tiles, :flip_buttons, :boolean
  end
end
