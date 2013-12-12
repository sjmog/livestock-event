class Booking < ActiveRecord::Base
  resourcify
  include PublicActivity::Model
    tracked
  belongs_to :user, inverse_of: :bookings
  has_many :orders, inverse_of: :booking
  has_one :stand, inverse_of: :booking
  searchable do
  	text :company_name, :correspondence_address, :invoice_address, :show_area, :stand_type, :breed_society, :zone, :website, :contact_name, :telephone, :email, :notes, :exhibiting_name, :po_number, :finance_contact, :finance_telephone, :requirements
  end
end