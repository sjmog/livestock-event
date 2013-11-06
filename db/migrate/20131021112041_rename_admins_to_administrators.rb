class RenameAdminsToAdministrators < ActiveRecord::Migration
	 def self.up
	   rename_table :admins, :administrators
	 end

	def self.down
	   rename_table :administrators, :admins
	end
end
