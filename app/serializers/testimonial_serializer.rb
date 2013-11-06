class TestimonialSerializer < BaseSerializer
  attributes :id, :param
  attribute :attribution
  attribute :quote
  attribute :image
  attribute :category
  attribute :location
  attributes :call_route, :call_route_name, :call_icon

  def param
    "#{id}-#{attribution}"
  end
end