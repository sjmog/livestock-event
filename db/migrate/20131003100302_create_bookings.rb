class CreateBookings < ActiveRecord::Migration
	def change
	  create_table :bookings do |t|
	    t.string :companyName
	    t.string :companyReg
	    t.boolean :corporateMembership
	    t.string :correspondenceAddress
	    t.string :invoiceAddress
	    t.boolean :tcAgreed
	    t.string :showArea
	    t.boolean :sameAs2013
	    t.string :standType
	    t.integer :frontage
	    t.integer :depth
	    t.string :position
	    t.boolean :depositPaid
	    t.boolean :totalPaid
	    t.string :breedSociety

	    t.timestamps
	  end
	end
end