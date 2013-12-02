module Admin
  class PostsController < BaseController
  	layout "admin"
    actions :index, :show
  end
end
