class Exhibitor < ActiveRecord::Base
	resourcify
	include PublicActivity::Model
	  tracked owner: Proc.new{ |controller, model| controller.current_user }
	searchable do
		text :name, :email
	end
end
