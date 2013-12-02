class AdminController < ApplicationController
  before_filter :ensure_authenticated_user, :only => :main
  def index
  end
  def main
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
