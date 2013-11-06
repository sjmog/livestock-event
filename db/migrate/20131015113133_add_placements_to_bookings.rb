class AddPlacementsToBookings < ActiveRecord::Migration
  def up
  	add_column :bookings, :placements, :boolean
  end

  def down
  	remove_column :bookings, :placements
  end
end
