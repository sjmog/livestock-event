module Admin
  class TabsController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @tabs = Tab.all
    end

    def new
      @tab = Tab.new
    end

    def show
      @tab = Tab.find(params[:id])
    end

    def edit
      @tab = Tab.find(params[:id])
    end

    def update
      @tab = Tab.find(params[:id])
     
      if @tab.update(params[:tab])
        redirect_to admin_tab_path(@tab)
      else
        render 'edit'
      end
    end

    def create
      @tab = Tab.create(tab_params)
      if @tab.save
        redirect_to admin_tab_path(@tab)
      else
        render "new"
      end
    end


    def destroy
      @tab = Tab.find(params[:id])
      @tab.destroy
      flash[:notice] = "Tab deleted."
      @tabs = Tab.all
    end

  protected

    def permitted_params
      params.permit(:tab => [:tile_id, :tab_content, :name, :icon, :tab_type, :split_left, :split_right, :split_title, :tab_link, :tab_large_icon, :split_text])
    end

    private

    # Strong Parameters (Rails 4)
    def tab_params
      params.require(:tab).permit(:tile_id, :tab_content, :name, :icon, :tab_type, :split_left, :split_right, :split_title, :tab_link, :tab_large_icon, :split_text)
    end
  end
end