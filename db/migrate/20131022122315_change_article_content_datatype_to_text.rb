class ChangeArticleContentDatatypeToText < ActiveRecord::Migration
  def change
  	change_column :articles, :article_content, :text
  end
end
