module Api
  class RaformsController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
    def index
      @raforms = Raforms.all
      render json: @raforms
    end

    def new
      @raform = Raform.new
    end

    def show
      render json: Raform.find(params[:id])
    end

    def update
      @raform = Raform.find(params[:id])
      

      respond_to do |format|
        if @raform.update_attributes(params[:raform])
          #mark as complete or not
          if @raform.company_name && @raform.conducted_by && @raform.signature && @raform.date
            @raform.complete = true
          else
            @raform.complete = false
          end
          Booking.find(@raform.booking_id).process_attention
          @raform.save
          format.html { redirect_to @raform, notice: 'Risk Assessment Form was successfully updated.' }
          format.json { render json: @raform, status: 201 }
        else
          format.html { render action: "edit" }
          format.json { render json: @raform.errors, status: :unprocessable_entity }
        end
      end
    end

    def create
      raform = Raform.create(raform_params)
      if raform.new_record?
        render json: { errors: raform.errors.messages }, status: 422
      else
        render json: raform, status: 201
      end
    end

    protected

      def permitted_params
        params.permit(:raform => [:verified, :booking_id, :particulars, :equipment, :complex, :company_name, :conducted_by, :signature, :date])
      end
    private

    # Strong Parameters (Rails 4)
    def raform_params
      params.require(:raform).permit(:verified, :booking_id, :particulars, :equipment, :complex, :company_name, :conducted_by, :signature, :date)
    end
  end
end