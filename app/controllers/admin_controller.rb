class AdminController < ApplicationController
  before_filter :ensure_authenticated_user, :only => :main
  def index
  end
  def main
    @bookings_today = Booking.where("created_at >= :today", {today: Date.today})
    @bookings_today ||= []

    @payments_today = Order.where("created_at >= :today", {today: Date.today})
    @payments_today ||= []

    @profit_today = 0
    @payments_today.each do |payment|
      @profit_today += payment.amount if payment.status === "paid"
    end

    @payments = Order.find(:all)
    @running_total = 0
    @payments.each do |payment|
      @running_total += payment.amount if payment.status === "paid"
    end

    indoor_stands = Stand.where('area = ?', 'indoor')
    indoor_taken = Stand.where('area = ? AND taken = ?', 'indoor', true)
    @indoor_space = (indoor_taken.size / indoor_stands.size) * 100

    outdoor_stands = Stand.where('area = ?', 'outdoor')
    outdoor_taken = Stand.where('area = ? AND taken = ?', 'outdoor', true)
    @outdoor_space = (outdoor_taken.size / outdoor_stands.size) * 100

    machinery_hall_stands = Stand.where('area = ?', 'machinery hall')
    machinery_hall_taken = Stand.where('area = ? AND taken = ?', 'machinery hall', true)
    @machinery_hall_space = (machinery_hall_stands.size / machinery_hall_stands.size) * 100


  end
  # Redirects to the login screen if the current user or admin is not authorized
  def ensure_authenticated_user
  	puts session.size
  	puts token
  	puts request.session_options[:id]
  	puts Rails.application.config.session_options[:key]
    if current_user
    	puts 'user authenticated, redirecting to main'
    else

    	puts 'user not authenticated, redirecting to login'
    	flash[:notice] = "Please sign in as an administrator first."
    	redirect_to '/admin/login'
    end
  end
  def login
  end



  # Parses the access token from the header
  def token
    access_token = request.cookies["access_token"]

    if access_token.present?
      access_token
    else
      nil
    end
  end
  private
   
    # Finds the API key and returns its associated user.
    # Uses the unique request cookie in the header to figure out who the user is
    def current_user
      api_key = ApiKey.active.where(access_token: token).first
      if api_key
        puts api_key.user.id
        return api_key.user
      else
        if session[:current_user_id]
          return User.find(session[:current_user_id])
        else
          return nil
        end
      end
    end
end
