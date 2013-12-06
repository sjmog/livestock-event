class Supporter < ActiveRecord::Base
	resourcify
	searchable do
		text :name, :company_name, :address, :category
	end
end
