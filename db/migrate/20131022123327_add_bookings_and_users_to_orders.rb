class AddBookingsAndUsersToOrders < ActiveRecord::Migration
	def up
		add_column :orders, :user_id, :integer
		add_column :orders, :booking_id, :integer
	end

	def down
		remove_column :orders, :user_id
		remove_column :orders, :booking_id
	end
end
