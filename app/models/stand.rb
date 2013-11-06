class Stand < ActiveRecord::Base
	resourcify
	belongs_to :booking, inverse_of: :stands
end
