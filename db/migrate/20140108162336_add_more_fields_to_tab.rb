class AddMoreFieldsToTab < ActiveRecord::Migration
  def change
    add_column :tabs, :tab_link, :string
    add_column :tabs, :tab_large_icon, :string
    add_column :tabs, :split_text, :text
  end
end
