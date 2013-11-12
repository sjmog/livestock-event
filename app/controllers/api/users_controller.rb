module Api
  class UsersController < ApplicationController
    load_and_authorize_resource
    before_filter :ensure_authenticated_user, only: [:index]

    # Returns list of users. This requires authorization
    def index
      @users = User.all
      render json: User.all
    end

    def new
      @user = User.new
      @user.role = 'standard'
    end

    def show
      render json: User.find(params[:id])
    end

    def update
      @user = User.find(params[:id])

      respond_to do |format|
        if @user.update_attributes(params[:user])
          format.html # new.html.erb
          format.json { render json: @user, status: 201 }
          
        else
          format.html # new.html.erb
          format.json { render json: @user.errors, status: :unprocessable_entity }
          
        end
      end
    end

    def create
      user = User.create(user_params)
      user.role = 'standard'
      if user.new_record?
        render json: { errors: user.errors.messages }, status: 422
      else
        # Tell the UserMailer to send a welcome Email after save
        ApplicationMailer.welcome_email(@user).deliver
        render json: user.session_api_key, status: 201
        
      end
    end

    protected

      def permitted_params
        params.permit(:user => [:name, :email, :password, :password_confirmation, :role])
      end

    private

    # Strong Parameters (Rails 4)
    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation, :role)
    end
  end
end
