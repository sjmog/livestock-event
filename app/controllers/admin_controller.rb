class AdminController < ApplicationController
  before_filter :ensure_authenticated_user, :only => :main
  def index
  end
  def main
  end
  # Redirects to the login screen if the current user or admin is not authorized
  def ensure_authenticated_user
  	puts session.size
  	puts request.session_options[:id]
  	puts Rails.application.config.session_options[:key]
    if session[:current_user_id]
    	puts 'user authenticated, redirecting to main'
    else

    	puts 'user not authenticated, redirecting to login'
    	flash[:notice] = "Please sign in as an administrator first."
    	redirect_to '/admin/login'
    end
  end
  def login
  end
  private
   
    # Finds the User with the ID stored in the session with the key
    # :current_user_id This is a common way to handle user login in
    # a Rails application; logging in sets the session value and
    # logging out removes it.
    def current_user
      @_current_user ||= session[:current_user_id] &&
        User.find_by(id: session[:current_user_id])
    end
end
