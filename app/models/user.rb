class User < ActiveRecord::Base
  has_secure_password
  resourcify
  include PublicActivity::Model
    tracked
  ROLES = %w[admin standard banned]
  has_many :api_keys
  has_many :bookings, inverse_of: :user
  has_many :orders

  searchable do
    text :name, :email
  end

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  def session_api_key
    api_keys.active.session.first_or_create
  end

end