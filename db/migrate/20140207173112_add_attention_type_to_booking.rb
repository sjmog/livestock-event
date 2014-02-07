class AddAttentionTypeToBooking < ActiveRecord::Migration
  def change
    add_column :bookings, :attention_type, :string
  end
end
