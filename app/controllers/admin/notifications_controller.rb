module Admin
  class NotificationsController < BaseController
    layout "admin"
    actions :index, :show, :create, :new, :update

    def index
      @activities = PublicActivity::Activity.all.order("created_at desc")
    end


    def show
      @article = Article.find(params[:id])
    end


    def destroy
      @article = Article.find(params[:id])
      @article.destroy
      flash[:notice] = "Article deleted."
      @articles = Article.all
    end

  end
end
