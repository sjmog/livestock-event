class AddFieldsToTab < ActiveRecord::Migration
  def change
    add_column :tabs, :tab_type, :string
    add_column :tabs, :split_left, :text
    add_column :tabs, :split_right, :text
    add_column :tabs, :split_title, :string
  end
end
