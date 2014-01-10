class AddFieldToButton < ActiveRecord::Migration
  def change
    add_column :buttons, :flip_button, :boolean
  end
end
