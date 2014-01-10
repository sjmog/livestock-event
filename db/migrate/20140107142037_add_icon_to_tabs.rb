class AddIconToTabs < ActiveRecord::Migration
  def change
    add_column :tabs, :icon, :string
  end
end
