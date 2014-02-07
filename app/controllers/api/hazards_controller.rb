module Api
  class HazardsController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
    def index
      @hazards = Hazards.all
      render json: @hazards
    end

    def new
      @hazard = Hazard.new
    end

    def show
      render json: Hazard.find(params[:id])
    end

    def update
      @hazard = Hazard.find(params[:id])

      respond_to do |format|
        if @hazard.update_attributes(params[:hazard])
          format.json {render json: @hazard, status: 201}
        else
          format.json {render json: @hazard.errors, status: :unprocessable_entity}
        end
      end
    end

    def create
      hazard = Hazard.create(hazard_params)
      if hazard.new_record?
        render json: { errors: hazard.errors.messages }, status: 422
      else
        render json: hazard, status: 201
      end
    end

    def destroy
      @hazard = Hazard.find(params[:id])
      @hazard.destroy
      respond_to do |format|
        format.json { head :no_content }
      end
    end

    protected

      def permitted_params
        params.permit(:hazard => [:raform_id, :name, :persons, :level, :rassociation, :controls])
      end
    private

    # Strong Parameters (Rails 4)
    def hazard_params
      params.require(:hazard).permit(:raform_id, :name, :persons, :level, :rassociation, :controls)
    end
  end
end