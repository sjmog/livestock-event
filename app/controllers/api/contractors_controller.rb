module Api
  class ContractorsController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
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