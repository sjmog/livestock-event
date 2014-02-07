module Api
  class ShowformsController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
    def index
      @showforms = Showforms.all
      render json: @showforms
    end

    def new
      @showform = Showform.new
    end

    def show
      render json: Showform.find(params[:id])
    end

    def update
      @showform = Showform.find(params[:id])

      respond_to do |format|
        if @showform.update_attributes(params[:showform])
          #mark as complete or not
          if @showform.company_name && @showform.contact_name && @showform.address && @showform.telephone && @showform.email && @showform.website && @showform.particulars
            @showform.complete = true
          else
            @showform.complete = false
          end
          Booking.find(@showform.booking_id).process_attention
          @showform.save
          format.html { redirect_to @showform, notice: 'Showform was successfully updated.' }
          format.json { render json: @showform, status: 201 }
        else
          format.html { render action: "edit" }
          format.json { render json: @showform.errors, status: :unprocessable_entity }
        end
      end

    end

    def create
      showform = Showform.create(showform_params)
      if showform.new_record?
        render json: { errors: showform.errors.messages }, status: 422
      else
        render json: showform, status: 201
      end
    end

    protected

      def permitted_params
        params.permit(:showform => [:booking_id, :progress, :complete, :verified, :company_name, :contact_name, :address, :telephone, :email, :website, :particulars, :dairy, :beef, :sheep, :goats, :pigs, :poultry, :arable])
      end
    private

    # Strong Parameters (Rails 4)
    def showform_params
      params.require(:showform).permit(:booking_id, :progress, :complete, :verified, :company_name, :contact_name, :address, :telephone, :email, :website, :particulars, :dairy, :beef, :sheep, :goats, :pigs, :poultry, :arable)
    end
  end
end