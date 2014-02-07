module Api
  class HsformsController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
    def index
      @hsforms = Hsforms.all
      render json: @hsforms
    end

    def new
      @hsform = Hsform.new
    end

    def show
      render json: Hsform.find(params[:id])
    end

    def update
      @hsform = Hsform.find(params[:id])

      respond_to do |format|
        if @hsform.update_attributes(params[:hsform])
          #mark as complete or not
          if @hsform.company_name && @hsform.name && @hsform.mobile && @hsform.particulars && @hsform.public_insurance && @hsform.employee_insurance && @hsform.agreed && @hsform.completed_by && @hsform.date
            @hsform.complete = true
          else
            @hsform.complete = false
          end
          Booking.find(@hsform.booking_id).process_attention
          @hsform.save
          format.html { redirect_to @hsform, notice: 'Health & Safety Form was successfully updated.' }
          format.json { render json: @hsform, status: 201 }
        else
          format.html { render action: "edit" }
          format.json { render json: @hsform.errors, status: :unprocessable_entity }
        end
      end
    end

    def create
      hsform = Hsform.create(hsform_params)
      if hsform.new_record?
        render json: { errors: hsform.errors.messages }, status: 422
      else
        render json: hsform, status: 201
      end
    end

    protected

      def permitted_params
        params.permit(:hsform => [:booking_id, :progress, :complete, :company_name, :name, :mobile, :particulars, :policy, :public_insurance, :employee_insurance, :tick_1, :tick_2, :tick_3, :tick_4, :tick_5, :tick_6, :tick_7, :agreed, :completed_by, :date])
      end
    private

    # Strong Parameters (Rails 4)
    def hsform_params
      params.require(:hsform).permit(:booking_id, :progress, :complete, :company_name, :name, :mobile, :particulars, :policy, :public_insurance, :employee_insurance, :tick_1, :tick_2, :tick_3, :tick_4, :tick_5, :tick_6, :tick_7, :agreed, :completed_by, :date)
    end
  end
end