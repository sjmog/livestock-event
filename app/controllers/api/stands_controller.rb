module Api
  class StandsController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
    protected

      def permitted_params
        params.permit(:stand => [:number, :taken, :frontage, :depth, :area, :booking_id, :zone])
      end
    private

    # Strong Parameters (Rails 4)
    def stand_params
      params.require(:stand).permit(:number, :taken, :frontage, :depth, :area, :booking_id, :zone)
    end
  end
end