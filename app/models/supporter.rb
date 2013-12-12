class Supporter < ActiveRecord::Base
	resourcify
	include PublicActivity::Model
  tracked owner: Proc.new{ |controller, model| controller.current_user }
	searchable do
		text :name, :company_name, :address, :category
	end
end
