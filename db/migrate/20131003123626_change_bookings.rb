class ChangeBookings < ActiveRecord::Migration
  def up
  	change_table :bookings do |t|
	  	t.rename :companyName, :company_name
	  	t.rename :companyReg, :company_reg
	  	t.rename :corporateMembership, :corporate_membership
	  	t.rename :correspondenceAddress, :correspondence_address
	  	t.rename :invoiceAddress, :invoice_address
	  	t.rename :tcAgreed, :tc_agreed
	  	t.rename :showArea, :show_area
	  	t.rename :sameAs2013, :same_as2013
	  	t.rename :standType, :stand_type
	  	t.rename :depositPaid, :deposit_paid
	  	t.rename :totalPaid, :total_paid
	  	t.rename :breedSociety, :breed_society
  	end
  end

  def down
  end
end
