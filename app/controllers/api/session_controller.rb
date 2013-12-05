module Api
	class SessionController < ApplicationController
	  def create
	    user = User.where("username = ? OR email = ?", params[:email], params[:email]).first
	    if user && user.authenticate(params[:password])
	      render json: {"api_key" => user.session_api_key, "role" => user.role}, status: 201
	    else
	      render json: {}, status: 401
	    end
	  end
	end
end