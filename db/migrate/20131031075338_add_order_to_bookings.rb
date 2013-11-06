class AddOrderToBookings < ActiveRecord::Migration
	def up
		add_column :bookings, :order_id, :integer
	end

	def down
		remove_column :bookings, :order_id
	end
end
