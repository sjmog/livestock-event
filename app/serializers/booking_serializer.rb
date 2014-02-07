class BookingSerializer < BaseSerializer
  has_one :stand
  has_one :raform
  has_one :hsform
  has_one :showform
  attributes :id
  attribute :order_id
  attribute :requirements
  attribute :stand_number
  attribute :company_name
  attribute :company_reg
  attribute :corporate_membership
  attribute :correspondence_address
  attribute :invoice_address
  attribute :tc_agreed
  attribute :show_area
  attribute :zone
  attribute :same_as2013
  attribute :stand_type
  attribute :frontage
  attribute :depth
  attribute :position
  attribute :deposit_paid
  attribute :total_paid
  attribute :breed_society
  attribute :user_id
  attributes :requires_leaflets, :number_leaflets, :pdf_leaflet, :machinery_motion, :mobile_unit, :livestock_stand, :new_products, :philip_award, :livestock_award, :exports, :exhibitor_list, :website, :contact_name, :telephone, :email, :notes, :exhibiting_name, :po_number, :finance_contact, :finance_telephone, :contractor_company_name, :contractor_contact_name, :contractor_address, :contractor_telephone, :contractor_email
  attributes :the_deposit, :the_total
end