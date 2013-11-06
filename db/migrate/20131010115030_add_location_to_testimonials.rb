class AddLocationToTestimonials < ActiveRecord::Migration
  def up
  	add_column :testimonials, :location, :string
  end

  def down
  	remove_column :testimonials, :location
  end
end
