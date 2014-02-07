class AddVerifiedToHsforms < ActiveRecord::Migration
  def change
    add_column :hsforms, :verified, :boolean
  end
end
