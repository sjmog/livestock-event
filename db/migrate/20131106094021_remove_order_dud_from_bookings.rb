class RemoveOrderDudFromBookings < ActiveRecord::Migration

  	def up
  		remove_column :bookings, :order
  	end

  	def down
  		add_column :bookings, :order, :string
  	end


end
