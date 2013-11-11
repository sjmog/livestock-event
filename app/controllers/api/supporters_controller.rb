module Api
  class SupportersController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
    def index
      @supporters = Supporter.all
      render json: @supporters
    end

    def new
      @supporter = Supporter.new
    end

    def show
      render json: Supporter.find(params[:id])
    end

    def update
      @supporter = Supporter.find(params[:id])

      respond_to do |format|
        if @supporter.update_attributes(params[:supporter])
          render json: @supporter, status: 201
        else
          render json: @supporter.errors, status: :unprocessable_entity
        end
      end
    end

    def create
      supporter = Supporter.create(supporter_params)
      if supporter.new_record?
        render json: { errors: supporter.errors.messages }, status: 422
      else
        render json: supporter, status: 201
      end
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