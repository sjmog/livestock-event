class UserSerializer < BaseSerializer
  attributes :id, :name, :email, :role
  has_many :bookings
  has_many :orders
end
