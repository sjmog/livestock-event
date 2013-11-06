class AddImageToContractors < ActiveRecord::Migration
	def up
		add_column :contractors, :image, :string
	end

	def down
		remove_column :contractors, :image
	end
end
