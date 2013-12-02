module Admin
  class BookingsController < BaseController
    layout "admin"
    load_and_authorize_resource

    actions :index, :show, :create, :new, :update, :destroy

    def index
      @bookings = Booking.all
    end

    def new
      @booking = Booking.new
    end

    def show
      @booking = Booking.find(params[:id])
    end

    def edit
      @booking = Booking.find(params[:id])
    end

    def update
      @booking = Booking.find(params[:id])
     
      if @booking.update(params[:booking])
        redirect_to admin_booking_path(@booking)
      else
        render 'edit'
      end
    end

    def create
      @booking = Booking.create(booking_params)
      if @booking.save
        # Tell the UserMailer to send a welcome Email after save
        # ApplicationMailer.booking_email(@booking.user).deliver
        redirect_to admin_booking_path(@booking)
      else
        render "new"
      end
    end


    def destroy
      @booking = Booking.find(params[:id])
      @booking.destroy
      flash[:notice] = "Booking deleted."
      @bookings = Booking.all
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
