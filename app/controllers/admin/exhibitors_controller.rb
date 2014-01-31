module Admin
  class ExhibitorsController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @exhibitors = Exhibitor.all
    end

    def new
      @exhibitor = Exhibitor.new
    end

    def show
      @exhibitor = Exhibitor.find(params[:id])
    end

    def edit
      @exhibitor = Exhibitor.find(params[:id])
    end

    def update
      @exhibitor = Exhibitor.find(params[:id])
     
      if @exhibitor.update(params[:exhibitor])
        redirect_to admin_exhibitor_path(@exhibitor)
      else
        render 'edit'
      end
    end

    def create
      @exhibitor = Exhibitor.create(exhibitor_params)
      if @exhibitor.save
        redirect_to admin_exhibitor_path(@exhibitor)
      else
        render "new"
      end
    end


    def destroy
      @exhibitor = Exhibitor.find(params[:id])
      @exhibitor.destroy
      flash[:notice] = "Exhibitor removed."
      @exhibitors = Exhibitor.all
    end

    protected

      def permitted_params
        params.permit(:exhibitor => [:name, :email, :telephone, :website, :area, :zone, :list, :description])
      end
    private

    # Strong Parameters (Rails 4)
    def exhibitor_params
      params.require(:exhibitor).permit(:name, :email, :telephone, :website, :area, :zone, :list, :description)
    end
  end
end