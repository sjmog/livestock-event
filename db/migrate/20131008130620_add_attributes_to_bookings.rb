class AddAttributesToBookings < ActiveRecord::Migration
  def up
  	add_column :bookings, :requires_leaflets, :boolean
  	add_column :bookings, :number_leaflets, :integer
  	add_column :bookings, :pdf_leaflet, :boolean
  	add_column :bookings, :machinery_motion, :boolean
  	add_column :bookings, :mobile_unit, :boolean
  	add_column :bookings, :livestock_stand, :boolean
  	add_column :bookings, :new_products, :boolean
  	add_column :bookings, :philip_award, :boolean
  	add_column :bookings, :livestock_award, :boolean
  	add_column :bookings, :exports, :boolean
  	add_column :bookings, :exhibitor_list, :boolean
  	add_column :bookings, :website, :string
  	add_column :bookings, :contact_name, :string
  	add_column :bookings, :telephone, :string
  	add_column :bookings, :email, :string
  	add_column :bookings, :notes, :text
  	add_column :bookings, :exhibiting_name, :string
  	add_column :bookings, :po_number, :string
  	add_column :bookings, :finance_contact, :string
  	add_column :bookings, :finance_telephone, :string
  	add_column :bookings, :contractor_company_name, :string
  	add_column :bookings, :contractor_address, :text
  	add_column :bookings, :contractor_telephone, :string
  	add_column :bookings, :contractor_email, :string
  end

  def down
  	remove_column :bookings, :requires_leaflets, :boolean
  	remove_column :bookings, :number_leaflets, :integer
  	remove_column :bookings, :pdf_leaflet, :boolean
  	remove_column :bookings, :machinery_motion, :boolean
  	remove_column :bookings, :mobile_unit, :boolean
  	remove_column :bookings, :livestock_stand, :boolean
  	remove_column :bookings, :new_products, :boolean
  	remove_column :bookings, :philip_award, :boolean
  	remove_column :bookings, :livestock_award, :boolean
  	remove_column :bookings, :exports, :boolean
  	remove_column :bookings, :exhibitor_list, :boolean
  	remove_column :bookings, :website, :string
  	remove_column :bookings, :contact_name, :string
  	remove_column :bookings, :telephone, :string
  	remove_column :bookings, :email, :string
  	remove_column :bookings, :notes, :text
  	remove_column :bookings, :exhibiting_name, :string
  	remove_column :bookings, :po_number, :string
  	remove_column :bookings, :finance_contact, :string
  	remove_column :bookings, :finance_telephone, :string
  	remove_column :bookings, :contractor_company_name, :string
  	remove_column :bookings, :contractor_address, :text
  	remove_column :bookings, :contractor_telephone, :string
  	remove_column :bookings, :contractor_email, :string
  end
end

              
               
           
          