class AddOrderDudToBookings < ActiveRecord::Migration
	def up
		add_column :bookings, :order, :string
	end

	def down
		remove_column :bookings, :order
	end
end
