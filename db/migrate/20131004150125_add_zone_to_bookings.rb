class AddZoneToBookings < ActiveRecord::Migration
  def change
  	  	change_table :bookings do |t|
  		  	t.string :zone
  	  	end
  end
end
