module Admin
  class PrintController < BaseController
    layout "admin"

    def print_raform
          @raform = Raform.find(params[:id])
          @hazards = @raform.hazards
          @booking = Booking.find(@raform.booking_id)
        end

        def print_hsform
          @hsform = Hsform.find(params[:id])
          @booking = Booking.find(@hsform.booking_id)
        end

        def print_showform
          @showform = Showform.find(params[:id])
          @booking = Booking.find(@showform.booking_id)
        end

	end
end