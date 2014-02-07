class ExhibitorSerializer < BaseSerializer
  attributes :id
  attribute :name
  attribute :email
  attribute :telephone
  attribute :website
  attribute :area
  attribute :zone
  attribute :list
  attribute :description

  #don't expose exhibitors not in the list
  def filter(keys)
  	if object.list
  		keys
  	else
  		keys - [:name] - [:email] - [:telephone] - [:website]
  	end
  end

end