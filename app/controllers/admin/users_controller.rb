module Admin
  class UsersController < BaseController
    layout "admin"
    load_and_authorize_resource
    def index
      @users = User.all
    end

    def new
      @user = User.new
    end

    def show
      @user = User.find(params[:id])
    end

    def edit
      @user = User.find(params[:id])
    end

    def update
      @user = User.find(params[:id])
     
      if @user.update(params[:user])
        redirect_to admin_user_path(@user)
      else
        render 'edit'
      end
    end

    def create
      @user = User.create(user_params)
      if @user.save
        # Tell the UserMailer to send a welcome Email after save
        ApplicationMailer.welcome_email(@user).deliver
        redirect_to admin_user_path(@user)
      else
        render "new"
      end
    end


    def destroy
      @user = User.find(params[:id])
      @user.destroy
      flash[:notice] = "User removed."
      @users = User.all
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
