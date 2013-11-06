class AddFieldsToOrder < ActiveRecord::Migration
	def up
		add_column :orders, :billing_surname, :string
		add_column :orders, :billing_firstnames, :string
		add_column :orders, :billing_address, :string
		add_column :orders, :billing_city, :string
		add_column :orders, :billing_postcode, :string
		add_column :orders, :billing_country, :string
		add_column :orders, :delivery_surname, :string
		add_column :orders, :delivery_firstnames, :string
		add_column :orders, :delivery_address, :string
		add_column :orders, :delivery_city, :string
		add_column :orders, :delivery_postcode, :string
		add_column :orders, :delivery_country, :string
	end

	def down
		remove_column :orders, :billing_surname
		remove_column :orders, :billing_firstnames
		remove_column :orders, :billing_address
		remove_column :orders, :billing_city
		remove_column :orders, :billing_postcode
		remove_column :orders, :billing_country
		remove_column :orders, :delivery_surname
		remove_column :orders, :delivery_firstnames
		remove_column :orders, :delivery_address
		remove_column :orders, :delivery_city
		remove_column :orders, :delivery_postcode
		remove_column :orders, :delivery_country
	end
end
