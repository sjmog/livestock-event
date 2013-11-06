class AddForeignKeyToBooking < ActiveRecord::Migration
  def up
  	add_column :bookings, :user_id, :integer
  end

  def down
  	remove_column :bookings, :user_id
  end
end
