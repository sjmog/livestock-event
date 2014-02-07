class AddNeedsAttentionToBooking < ActiveRecord::Migration
  def change
  	add_column :bookings, :needs_attention, :boolean
  end
end
