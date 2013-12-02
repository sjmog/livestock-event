module Admin
  class AuthController < BaseController
  	layout "admin"
    protected

    def auth_only!
      unless params[:auth_token] && user_signed_in?
        render json: {}, status: 401
      end
    end
  end
end
