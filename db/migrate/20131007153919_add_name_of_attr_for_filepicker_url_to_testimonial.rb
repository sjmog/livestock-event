class AddNameOfAttrForFilepickerUrlToTestimonial < ActiveRecord::Migration
	def up
		add_column :testimonials, :filepicker_url, :string
	end

	def down
		remove_column :testimonials, :filepicker_url
	end
end
