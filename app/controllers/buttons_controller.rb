module Admin
  class ButtonsController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @buttons = Button.all
    end

    def new
      @button = Button.new
    end

    def show
      @button = Button.find(params[:id])
    end

    def edit
      @button = Button.find(params[:id])
    end

    def update
      @button = Button.find(params[:id])
     
      if @button.update(params[:button])
        redirect_to admin_button_path(@button)
      else
        render 'edit'
      end
    end

    def create
      @button = Button.create(button_params)
      if @button.save
        redirect_to admin_button_path(@button)
      else
        render "new"
      end
    end


    def destroy
      @button = Button.find(params[:id])
      @button.destroy
      flash[:notice] = "Button deleted."
      @buttons = Button.all
    end

  protected

    def permitted_params
      params.permit(:button => [:flip_button, :tile_id, :icon, :button_link, :title])
    end

    private

    # Strong Parameters (Rails 4)
    def button_params
      params.require(:button).permit(:flip_button, :tile_id, :icon, :button_link, :title)
    end
  end
end