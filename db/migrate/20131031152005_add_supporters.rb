class AddSupporters < ActiveRecord::Migration
	def change
	  create_table :supporters do |t|
	    t.string :name
	    t.string :company_name
	    t.text :address
	    t.text :explanation
	    t.string :category
	    t.string :image

	    t.timestamps
	  end
	end
end
