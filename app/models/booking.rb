class Booking < ActiveRecord::Base
  resourcify
  belongs_to :user, inverse_of: :bookings
  has_many :orders, inverse_of: :booking
  has_one :stand, inverse_of: :booking
end