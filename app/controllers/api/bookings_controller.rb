module Api
  class BookingsController < BaseController
    load_and_authorize_resource
  	before_filter :ensure_authenticated_user, only: [:index, :new, :create, :update]
    actions :index, :show, :create, :new, :update

    def create
      booking = Booking.create(booking_params)
      if booking.new_record?
         booking.create_activity key: 'booking.create', owner: booking.user
        render json: { errors: booking.errors.messages }, status: 422
      else
        # Tell the UserMailer to send a welcome Email after save
        ApplicationMailer.booking_email(booking.user).deliver
        render json: booking, status: 201
        
      end
    end

    # PUT /bookings/1
    # PUT /bookings/1.json
    def update
      @booking = Booking.find(params[:id])
      
      respond_to do |format|
        if @booking.update_attributes(params[:booking])
          format.html { redirect_to @booking, notice: 'Booking was successfully updated.' }
          format.json { render json: @booking, status: 200 }
        else
          format.html { render action: "edit" }
          format.json { render json: @booking.errors, status: :unprocessable_entity }
        end
      end
    end

    protected

      def permitted_params
        params.permit(:booking => [:stand_id, :order_id, :exhibitor_list, :requirements, :user_id, :stand_number, :company_name, :placements, :company_reg, :corporate_membership, :correspondence_address, :invoice_address, :tc_agreed, :show_area, :zone, :same_as2013, :stand_type, :frontage, :depth, :position, :deposit_paid, :total_paid, :breed_society, :requires_leaflets, :number_leaflets, :pdf_leaflet, :machinery_motion, :mobile_unit, :livestock_stand, :new_products, :philip_award, :livestock_award, :exports, :exhibitor_list, :website, :contact_name, :telephone, :email, :notes, :exhibiting_name, :po_number, :finance_contact, :finance_telephone, :contractor_company_name, :contractor_contact_name, :contractor_address, :contractor_telephone, :contractor_email, :the_deposit, :the_total])
      end
    private

    # Strong Parameters (Rails 4)
    def booking_params
      params.require(:booking).permit(:stand_id, :order_id, :exhibitor_list, :requirements, :user_id, :stand_number, :company_name, :placements, :company_reg, :corporate_membership, :correspondence_address, :invoice_address, :tc_agreed, :show_area, :zone, :same_as2013, :stand_type, :frontage, :depth, :position, :deposit_paid, :total_paid, :breed_society, :requires_leaflets, :number_leaflets, :pdf_leaflet, :machinery_motion, :mobile_unit, :livestock_stand, :new_products, :philip_award, :livestock_award, :exports, :exhibitor_list, :website, :contact_name, :telephone, :email, :notes, :exhibiting_name, :po_number, :finance_contact, :finance_telephone, :contractor_company_name, :contractor_contact_name, :contractor_address, :contractor_telephone, :contractor_email, :the_deposit, :the_total)
    end
  end
end
