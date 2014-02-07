class AdminController < ApplicationController
  before_filter :ensure_authenticated_user, :only => :main
  before_filter :retrieve_activities
  def retrieve_activities
    @activities = PublicActivity::Activity.all.order("created_at desc")
  end
  def index
  end
  def search
    @search_term = params[:term]
    @constraint = params[:constraint]
    @search = retrieve_records(params[:constraint], params[:term])
    @search_results = @search.results
    @results_number = @search.total
    @pagination = false

  end
  def search_ajax
    @search_term = params[:term]
    @constraint = params[:constraint]
    @search = retrieve_records(params[:constraint], params[:term])
    @search_results = @search.results
    @results_number = @search.total
    @pagination = false
    render json: {"results_number" => @results_number, "search_results" => @search.results}, status: 201
  end
  def retrieve_records(constraint, search_term)
    case constraint
    when "Bookings"
      @search = Booking.search do
        keywords search_term do
          boost_fields :company_name => 2.0
          boost_fields :contact_name => 2.0
          boost_fields :exhibiting_name => 2.0
        end
      end
      return @search
    when "Payments"
      @search = Order.search do
        keywords search_term do
          boost_fields :title => 2.0
        end
      end
      return @search
    when "Users"
      @search = User.search do
        keywords search_term do
          boost_fields :title => 2.0
        end
      end
      return @search
    when "Livestock Bookings"
      @search = []
      return @search
    when "Ticket Purchases"
      @search = []
      return @search
    when "Testimonials"
      @search = Testimonial.search do
        keywords search_term do
          boost_fields :title => 2.0
        end
      end
      return @search
    when "News"
      @search = Article.search do
        keywords search_term do
          boost_fields :title => 2.0
        end
      end
      return @search
    when "Supporters"
      @search = Supporter.search do
        keywords search_term do
          boost_fields :title => 2.0
        end
      end
      return @search
    when "Contractors"
      @search = Contractor.search do
        keywords search_term do
          boost_fields :title => 2.0
        end
      end
      return @search
    else
      @search = Sunspot.search Booking, Order, User, Testimonial, Article, Supporter, Contractor do |query| 
        query.keywords search_term
        query.paginate(:page => params[:page], :per_page => 20)
      end
      return @search
    end
  end
  def main
    @bookings = Booking.find(:all)

    @bookings_today = Booking.where("created_at >= :today", {today: Date.today})
    @bookings_today ||= []

    @payments_today = Order.where("created_at >= :today", {today: Date.today})
    @payments_today ||= []

    @profit_today = 0
    @payments_today.each do |payment|
      @profit_today += payment.amount if payment.status === "deposit paid"
    end

    @payments = Order.find(:all)
    @running_total = 0
    @payments.each do |payment|
      unless payment.amount.nil?
        @running_total += payment.amount if payment.status === "deposit paid"
      end
    end

    indoor_stands = Stand.where('area = ?', 'indoor')
    indoor_taken = Stand.where('area = ? AND taken = ?', 'indoor', true)
    @indoor_space = ((indoor_taken.size.to_f / indoor_stands.size.to_f) * 100).round
    

    outdoor_stands = Stand.where('area = ?', 'outdoor')
    outdoor_taken = Stand.where('area = ? AND taken = ?', 'outdoor', true)
    @outdoor_space = ((outdoor_taken.size.to_f / outdoor_stands.size.to_f) * 100).round
    

    machinery_hall_stands = Stand.where('area = ?', 'machinery hall')
    machinery_hall_taken = Stand.where('area = ? AND taken = ?', 'machinery hall', true)
    @machinery_hall_space = ((machinery_hall_taken.size.to_f / machinery_hall_stands.size.to_f) * 100).round
    
    #refresh the attention required on each Booking
    @bookings.each do |item|
      item.process_attention
    end

    #Bookings that require attention
    @attn_bookings = Booking.where('needs_attention = ?', true)
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



  # Parses the access token from the cookies
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
