class AddStandNumberToBookings < ActiveRecord::Migration
	def up
		add_column :bookings, :stand_number, :string
	end

	def down
		remove_column :bookings, :stand_number
	end
end
