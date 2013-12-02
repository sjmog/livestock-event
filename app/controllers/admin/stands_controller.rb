module Admin
  class StandsController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @stands = Stand.all
    end

    def new
      @stand = Stand.new
    end

    def show
      @stand = Stand.find(params[:id])
    end

    def edit
      @stand = Stand.find(params[:id])
    end

    def update
      @stand = Stand.find(params[:id])
     
      if @stand.update(params[:stand])
        redirect_to admin_stand_path(@stand)
      else
        render 'edit'
      end
    end

    def create
      @stand = Stand.create(stand_params)
      if @stand.save
        # Tell the UserMailer to send a welcome Email after save
        # ApplicationMailer.stand_email(@stand.user).deliver
        redirect_to admin_stand_path(@stand)
      else
        render "new"
      end
    end


    def destroy
      @stand = Stand.find(params[:id])
      @stand.destroy
      flash[:notice] = "Stand deleted."
      @stands = Stand.all
    end

    protected

      def permitted_params
        params.permit(:stand => [:number, :taken, :frontage, :depth, :area, :booking_id])
      end
    private

    # Strong Parameters (Rails 4)
    def stand_params
      params.require(:stand).permit(:number, :taken, :frontage, :depth, :area, :booking_id)
    end
  end
end