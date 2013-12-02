module Admin
	class SessionController < ApplicationController

	  def create
	    user = User.where("username = ? OR email = ?", params[:email], params[:email]).first
	    if user && user.authenticate(params[:password]) && user.role === 'admin'
	      # Save the user ID in the session so it can be used in
	      # subsequent requests
	      if token.nil?
	      	puts 'user needs to login in the frontend first'
	      	redirect_to admin_login_path
	      else
		      @key = ApiKey.create(:access_token => token)
		      @key.save
		      redirect_to '/admin/home/' + token
	  	  end
	    else
	      flash[:notice] = "Incorrect username or password."
	      redirect_to admin_login_path
	    end
	  end
	  def destroy
	  	session[:current_user_id] = nil
	  	redirect_to '/'
	  end
	  def token
	    access_token = request.cookies["access_token"]

	    if access_token.present?
	      access_token
	    else
	      nil
	    end
	  end
	end
end