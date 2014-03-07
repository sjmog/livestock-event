module Admin
  class StaffMembersController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @staff_members = StaffMember.all
    end

    def new
      @staff_member = StaffMember.new
    end

    def show
      @staff_member = StaffMember.find(params[:id])
    end

    def edit
      @staff_member = StaffMember.find(params[:id])
    end

    def update
      @staff_member = StaffMember.find(params[:id])
     
      if @staff_member.update(params[:staff_member])
        redirect_to admin_staff_member_path(@staff_member)
      else
        render 'edit'
      end
    end

    def create
      @staff_member = StaffMember.create(staff_member_params)
      if @staff_member.save
        redirect_to admin_staff_member_path(@staff_member)
      else
        render "new"
      end
    end


    def destroy
      @staff_member = StaffMember.find(params[:id])
      @staff_member.destroy
      flash[:notice] = "StaffMember removed."
      @staff_members = StaffMember.all
    end

    protected

      def permitted_params
        params.permit(:staff_member => [:name, :image, :description, :contact, :job, :enabled, :linkedin])
      end
    private

    # Strong Parameters (Rails 4)
    def staff_member_params
      params.require(:staff_member).permit(:name, :image, :description, :contact, :job, :enabled, :linkedin)
    end
  end
end