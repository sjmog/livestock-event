class AddDepositAndTotalToBookings < ActiveRecord::Migration
  def up
  	add_column :orders, :the_deposit, :decimal
  	add_column :orders, :the_total, :decimal
  end

  def down
  	remove_column :orders, :the_deposit
  	remove_column :orders, :the_total
  end
end