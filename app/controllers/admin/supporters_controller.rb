module Admin
  class SupportersController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @supporters = Supporter.all
    end

    def new
      @supporter = Supporter.new
    end

    def show
      @supporter = Supporter.find(params[:id])
    end

    def edit
      @supporter = Supporter.find(params[:id])
    end

    def update
      @supporter = Supporter.find(params[:id])
     
      if @supporter.update(params[:supporter])
        redirect_to admin_supporter_path(@supporter)
      else
        render 'edit'
      end
    end

    def create
      @supporter = Supporter.create(supporter_params)
      if @supporter.save
        # Tell the UserMailer to send a welcome Email after save
        # ApplicationMailer.supporter_email(@supporter.user).deliver
        redirect_to admin_supporter_path(@supporter)
      else
        render "new"
      end
    end


    def destroy
      @supporter = Supporter.find(params[:id])
      @supporter.destroy
      flash[:notice] = "Supporter removed."
      @supporters = Supporter.all
    end


    protected

      def permitted_params
        params.permit(:supporter => [:name, :image, :company_name, :address, :explanation, :category])
      end
    private

    # Strong Parameters (Rails 4)
    def supporter_params
      params.require(:supporter).permit(:name, :image, :company_name, :address, :explanation, :category)
    end
  end
end