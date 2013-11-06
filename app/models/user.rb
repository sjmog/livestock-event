class User < ActiveRecord::Base
  has_secure_password
  ROLES = %w[admin standard banned]
  has_many :api_keys
  has_many :bookings, inverse_of: :user
  has_many :orders

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  def session_api_key
    api_keys.active.session.first_or_create
  end

end