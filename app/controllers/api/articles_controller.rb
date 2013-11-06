module Api
  class ArticlesController < BaseController
    load_and_authorize_resource
    actions :index, :show, :create, :new, :update
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
