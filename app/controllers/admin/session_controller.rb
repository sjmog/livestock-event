module Admin
	class SessionController < ApplicationController

	  def create
	    user = User.where("username = ? OR email = ?", params[:email], params[:email]).first
	    if user && user.authenticate(params[:password]) && user.role === 'admin'
	      # Save the user ID in the session so it can be used in
	      # subsequent requests
	      session[:current_user_id] = user.id
	      session[:current_user_role] = user.role
	      puts session.size
	      puts Rails.application.config.session_options[:key]
	      puts session
	      redirect_to '/admin'
	    else
	      flash[:notice] = "Incorrect username or password."
	      redirect_to admin_login_path
	    end
	  end
	  def destroy
	  	session[:current_user_id] = nil
	  	redirect_to '/'
	  end
	end
end