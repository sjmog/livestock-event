module Admin
  class TilesController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @tiles = Tile.all
    end

    def new
      @tile = Tile.new
      @tile.tabs.build
      @tile.buttons.build
    end

    def show
      @tile = Tile.find(params[:id])
    end

    def edit
      @tile = Tile.find(params[:id])
    end

    def update
      @tile = Tile.find(params[:id])
     
      if @tile.update(params[:tile])
        redirect_to admin_tile_path(@tile)
      else
        render 'edit'
      end
    end

    def create
      @tile = Tile.create(tile_params)
      if @tile.save
        redirect_to admin_tile_path(@tile)
      else
        render "new"
      end
    end


    def destroy
      @tile = Tile.find(params[:id])
      @tile.destroy
      flash[:notice] = "Tile deleted."
      @tiles = Tile.all
    end

  protected

    def permitted_params
      params.permit(:tile => [:flips, :flip_title, :flip_content, :flip_buttons, :name, :exhibitor, :visitor, :general, :title, :tile_type, :height, :width, :group, :tile_content, buttons_attributes: [:id, :_destroy, :tile_id, :icon, :button_link, :title, :flip_button], tabs_attributes: [:id, :_destroy, :tile_id, :tab_content, :name, :icon, :tab_type, :split_left, :split_right, :split_title, :tab_link, :tab_large_icon, :split_text]])
    end

    private

    # Strong Parameters (Rails 4)
    def tile_params
      params.require(:tile).permit(:flips, :flip_title, :flip_content, :flip_buttons, :name, :exhibitor, :visitor, :general, :title, :tile_type, :height, :width, :group, :tile_content, buttons_attributes: [:id, :_destroy, :tile_id, :icon, :button_link, :title, :flip_button], tabs_attributes: [:id, :_destroy, :tile_id, :tab_content, :name, :icon, :tab_type, :split_left, :split_right, :split_title, :tab_link, :tab_large_icon, :split_text])
    end
  end
end