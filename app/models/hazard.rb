class Hazard < ActiveRecord::Base
  resourcify
  belongs_to :raform, inverse_of: :hazards
end
