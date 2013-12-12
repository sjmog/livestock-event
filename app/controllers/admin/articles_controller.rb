module Admin
  class ArticlesController < BaseController
    layout "admin"
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update

    def index
      @articles = Article.all
    end

    def new
      @article = Article.new
    end

    def show
      @article = Article.find(params[:id])
    end

    def edit
      @article = Article.find(params[:id])
    end

    def update
      @article = Article.find(params[:id])
     
      if @article.update(params[:article])
        redirect_to admin_article_path(@article)
      else
        render 'edit'
      end
    end

    def create
      @article = Article.create(article_params)
      if @article.save
        # Tell the UserMailer to send a welcome Email after save
        # ApplicationMailer.booking_email(@booking.user).deliver
        redirect_to admin_article_path(@article)
      else
        render "new"
      end
    end


    def destroy
      @article = Article.find(params[:id])
      @article.destroy
      flash[:notice] = "Article deleted."
      @articles = Article.all
    end
    protected

    

      def permitted_params
        params.permit(:article => [:title, :image, :author, :published, :article_content])
      end
    private

    # Strong Parameters (Rails 4)
    def article_params
      params.require(:article).permit(:title, :image, :author, :published, :article_content)
    end
  end
end
