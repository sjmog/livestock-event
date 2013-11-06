module Api
  class TestimonialsController < BaseController
  	load_and_authorize_resource
    actions :index, :show, :create, :new, :update

	protected

	  def permitted_params
	    params.permit(:testimonial => [:attribution, :category, :image, :quote, :location, :call_route, :call_route_name, :call_icon])
	  end

	  private

	  # Strong Parameters (Rails 4)
	  def testimonial_params
	    params.require(:testimonial).permit(:attribution, :category, :image, :quote, :location, :call_route, :call_route_name, :call_icon)
	  end
  end
end
