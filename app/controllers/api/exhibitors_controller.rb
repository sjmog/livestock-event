module Api
  class ExhibitorsController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
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