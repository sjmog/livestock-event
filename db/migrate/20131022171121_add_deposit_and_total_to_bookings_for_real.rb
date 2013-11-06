class AddDepositAndTotalToBookingsForReal < ActiveRecord::Migration
	def up
		add_column :bookings, :the_deposit, :decimal
		add_column :bookings, :the_total, :decimal
	end

	def down
		remove_column :bookings, :the_deposit
		remove_column :bookings, :the_total
	end
end
