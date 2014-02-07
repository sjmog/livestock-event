class Booking < ActiveRecord::Base
  resourcify
  include PublicActivity::Model
    tracked
  belongs_to :user, inverse_of: :bookings
  has_many :orders, inverse_of: :booking
  has_one :stand, inverse_of: :booking
  has_one :raform
  has_one :hsform
  has_one :showform
  searchable do
  	text :company_name, :correspondence_address, :invoice_address, :show_area, :stand_type, :breed_society, :zone, :website, :contact_name, :telephone, :email, :notes, :exhibiting_name, :po_number, :finance_contact, :finance_telephone, :requirements
  end

  def process_attention
    if (raform.complete && !raform.verified) || (hsform.complete && !hsform.verified) || (showform.complete && !showform.verified)
      update_attributes(:needs_attention => true)
      update_attributes(:attention_type => 'verification')
    else
      update_attributes(:needs_attention => false)
      update_attributes(:attention_type => nil)
    end
  end

end