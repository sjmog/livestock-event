class AddRequirementsToBooking < ActiveRecord::Migration
	def up
		add_column :bookings, :requirements, :text
	end

	def down
		remove_column :bookings, :requirements
	end
end
