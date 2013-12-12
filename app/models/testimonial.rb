class Testimonial < ActiveRecord::Base
  resourcify
  include PublicActivity::Model
    tracked owner: Proc.new{ |controller, model| controller.current_user }
  searchable do
  	text :attribution, :quote
  end
end
