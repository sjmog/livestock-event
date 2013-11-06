class OrderSerializer < ActiveModel::Serializer
  attributes :id, :status, :amount, :date
  attribute :user_id
  has_one :booking
  has_one :user
  attribute :crypt
  attributes :billing_surname, :billing_firstnames, :billing_address, :billing_city, :billing_postcode, :billing_country, :delivery_surname, :delivery_firstnames, :delivery_address, :delivery_city, :delivery_postcode, :delivery_country
end
