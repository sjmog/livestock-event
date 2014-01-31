module Admin
  class BookingsController < BaseController
    layout "admin"
    load_and_authorize_resource

    actions :index, :show, :create, :new, :update, :destroy

    def print
      @booking = Booking.find(params[:id])
      @base_price = base_price(@booking)
      @surcharge = surcharge(@booking)
      @total_price = total_price(@booking)
      @total_price_vat = total_price_vat(@booking)
      @deposit_ex_vat = deposit_ex_vat(@booking)
      @deposit_inc_vat = deposit_inc_vat(@booking)
    end

    def base_price(booking)
      show_area = booking.show_area
      stand_type = booking.stand_type
      area = booking.frontage.to_i * booking.depth.to_i
      breed = booking.breed_society
      if show_area === "indoor"
        if stand_type === "clear"
          if area >= 200
            return 44*area
          else 
            return 47*area
          end
        elsif stand_type === "modular"
          return 100*area
        else return "Error: no stand format"
        end
            
      elsif show_area === "outdoor"
        if area <100 
          return 18*area
        elsif area>=100 && area < 200
          return 17*area
        else 
          return 16*area
        end

      elsif show_area === "machinery hall"
        if area <100
           return 20*area
        elsif area>=100 && area < 200
           return 19*area
        else 
           return 18*area
        end

      elsif show_area === "livestock hall"
        if breed === "dairy"
          return 0
        elsif breed === "beef"
          return 850
        elsif breed === "sheep"
          return 360
        else 
          return 0
        end
      else return "Error: no show area"
      end
    end

    def surcharge(booking)
      position = booking.position
      show_area = booking.show_area
      base_price = base_price(booking)
      if show_area === "indoor"
        if position === "standard"
          return 0
        elsif position === "corner"
          return base_price * 0.1
        elsif position === "peninsula"
          return base_price * 0.15
        elsif position === "island"
          return base_price * 0.2
        else
          return "Error: no declared stand type"
        end
            
      else
        return 0
      end
    end

    def total_price(booking)
      base_price = base_price(booking)
      surcharge = surcharge(booking)
      return base_price + surcharge
    end

    def total_price_vat(booking)
      total_price = total_price(booking)
      return total_price * 1.2
    end

    def deposit_ex_vat(booking)
      total_price = total_price(booking)
      return total_price * 0.3
    end

    def deposit_inc_vat(booking)
      total_price_vat = total_price_vat(booking)
      return total_price_vat * 0.3
    end

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
        # Create an Exhibitor model, populated correctly
        Exhibitor.create(
          :name    => @booking.exhibiting_name,
          :email      => @booking.email,
          :telephone => @booking.telephone,
          :website    => @booking.website,
          :area => @booking.show_area,
          :zone => @booking.zone,
          :list => @booking.exhibitor_list,
          :description => "",
          )
        redirect_to admin_booking_path(@booking)
      else
        render "new"
      end
    end

    def build_exhibitors
      @bookings = Booking.all
        @bookings.each do |booking|
          # Create an Exhibitor model, populated correctly
        
          Exhibitor.create(
            :name    => booking.exhibiting_name,
            :email      => booking.email,
            :telephone => booking.telephone,
            :website    => booking.website,
            :area => booking.show_area,
            :zone => booking.zone,
            :list => booking.exhibitor_list,
            :description => "",
            )
        end
        render html: "Built exhibitors"
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
