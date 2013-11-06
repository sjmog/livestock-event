class RemoveUserDudFromOrders < ActiveRecord::Migration

  	def up
  		remove_column :orders, :user
  	end

  	def down
  		add_column :orders, :user, :string
  	end


end
