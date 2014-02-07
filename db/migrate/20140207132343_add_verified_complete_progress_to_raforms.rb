class AddVerifiedCompleteProgressToRaforms < ActiveRecord::Migration
  def change
    add_column :raforms, :verified, :boolean
    add_column :raforms, :complete, :boolean
    add_column :raforms, :progress, :integer
  end
end
