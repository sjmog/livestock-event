module Admin
  class TestimonialsController < BaseController
  	layout "admin"
  	load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @testimonials = Testimonial.all
    end

    def new
      @testimonial = Testimonial.new
    end

    def show
      @testimonial = Testimonial.find(params[:id])
    end

    def edit
      @testimonial = Testimonial.find(params[:id])
    end

    def update
      @testimonial = Testimonial.find(params[:id])
     
      if @testimonial.update(params[:testimonial])
        redirect_to admin_testimonial_path(@testimonial)
      else
        render 'edit'
      end
    end

    def create
      @testimonial = Testimonial.create(testimonial_params)
      if @testimonial.save
        # Tell the UserMailer to send a welcome Email after save
        # ApplicationMailer.testimonial_email(@testimonial.user).deliver
        redirect_to admin_testimonial_path(@testimonial)
      else
        render "new"
      end
    end


    def destroy
      @testimonial = Testimonial.find(params[:id])
      @testimonial.destroy
      flash[:notice] = "Testimonial deleted."
      @testimonials = Testimonial.all
    end

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
