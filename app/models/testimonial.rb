class Testimonial < ActiveRecord::Base
  resourcify
  searchable do
  	text :attribution, :quote
  end
end
