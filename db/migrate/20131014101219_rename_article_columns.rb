class RenameArticleColumns < ActiveRecord::Migration
	def up
		add_column :articles, :image, :string
		rename_column :articles, :content, :article_content
	end

	def down
		remove_column :articles, :image
		rename_column :articles, :article_content, :content
	end
end
