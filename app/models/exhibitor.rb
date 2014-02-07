class Exhibitor < ActiveRecord::Base
	resourcify
	searchable do
		text :name, :email
	end
end
