class Raform < ActiveRecord::Base
  resourcify
  belongs_to :booking
  has_many :hazards, inverse_of: :raform
end
