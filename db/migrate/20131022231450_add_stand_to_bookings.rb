class AddStandToBookings < ActiveRecord::Migration
  def up
  	add_column :bookings, :stand_id, :integer
  	add_column :stands, :booking_id, :integer
  end

  def down
  	remove_column :bookings, :stand_id
  	remove_column :stands, :booking_id
  end
end
