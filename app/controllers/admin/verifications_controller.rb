module Admin
  class VerificationsController < BaseController
    layout "admin"
    actions :index, :show, :create, :new, :update

    def verify_raform
      raform = Raform.find(params[:id])
      raform.verified = true
      raform.save()
      redirect_to admin_bookings_path
    end

        

    def verify_hsform
        hsform = Hsform.find(params[:id])
        hsform.verified = true
        hsform.save()
        redirect_to admin_bookings_path
    end

    def verify_showform
        showform = Showform.find(params[:id])
        showform.verified = true
        showform.save()
        redirect_to admin_bookings_path
    end




  end
end