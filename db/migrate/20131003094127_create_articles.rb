class CreateArticles < ActiveRecord::Migration
	def change
	  create_table :articles do |t|
	    t.string :title
	    t.datetime :published
	    t.string :author
	    t.string :content

	    t.timestamps
	  end
	end
end
