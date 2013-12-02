module Admin
  class ContractorsController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @contractors = Contractor.all
    end

    def new
      @contractor = Contractor.new
    end

    def show
      @contractor = Contractor.find(params[:id])
    end

    def edit
      @contractor = Contractor.find(params[:id])
    end

    def update
      @contractor = Contractor.find(params[:id])
     
      if @contractor.update(params[:contractor])
        redirect_to admin_contractor_path(@contractor)
      else
        render 'edit'
      end
    end

    def create
      @contractor = Contractor.create(contractor_params)
      if @contractor.save
        redirect_to admin_contractor_path(@contractor)
      else
        render "new"
      end
    end


    def destroy
      @contractor = Contractor.find(params[:id])
      @contractor.destroy
      flash[:notice] = "Contractor removed."
      @contractors = Contractor.all
    end
    protected

      def permitted_params
        params.permit(:contractor => [:name, :image, :company_name, :address, :explanation, :category])
      end
    private

    # Strong Parameters (Rails 4)
    def contractor_params
      params.require(:contractor).permit(:name, :image, :company_name, :address, :explanation, :category)
    end
  end
end