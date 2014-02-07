class RaformSerializer < BaseSerializer
  has_many :hazards
  attributes :id
  attribute :booking_id
  attribute :verified
  attributes :booking_id, :particulars, :equipment, :complex, :company_name, :conducted_by, :signature, :date
end