class Article < ActiveRecord::Base
  resourcify
  searchable do
  	text :title, :article_content, :author
  	time :published
  end
end