class AddCallIconToTestimonials < ActiveRecord::Migration
	def up
		add_column :testimonials, :call_icon, :string
	end

	def down
		add_column :testimonials, :call_icon
	end
end
