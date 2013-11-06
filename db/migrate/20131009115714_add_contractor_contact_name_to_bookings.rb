class AddContractorContactNameToBookings < ActiveRecord::Migration
	def up
		add_column :bookings, :contractor_contact_name, :string
	end

	def down
		remove_column :bookings, :contractor_contact_name
	end
end
