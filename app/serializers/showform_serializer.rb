class ShowformSerializer < BaseSerializer
  attributes :id
  attributes :booking_id, :progress, :complete, :verified, :company_name, :contact_name, :address, :telephone, :email, :website, :particulars, :dairy, :beef, :sheep, :goats, :pigs, :poultry, :arable
end