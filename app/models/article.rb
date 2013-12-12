class Article < ActiveRecord::Base
  resourcify
  include PublicActivity::Model
    tracked owner: Proc.new{ |controller, model| controller.current_user }
  searchable do
  	text :title, :article_content, :author
  	time :published
  end
end