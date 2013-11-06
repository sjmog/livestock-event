class AddRouteDetailsToTestimonials < ActiveRecord::Migration
  def up
  	add_column :testimonials, :call_route, :string
  	add_column :testimonials, :call_route_name, :string
  end

  def down
  	add_column :testimonials, :call_route
  	add_column :testimonials, :call_route_name
  end
end
