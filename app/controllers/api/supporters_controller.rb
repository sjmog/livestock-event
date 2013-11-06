module Api
  class SupportersController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
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