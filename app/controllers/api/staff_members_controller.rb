module Api
  class StaffMembersController < BaseController
    load_and_authorize_resource
    actions :index, :show
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