class SocialTSerializer < BaseSerializer
  attributes :id
  attribute :text
  attribute :user
  attribute :published
  attribute :link
  attributes :day, :month
  attribute :created_at

  def day
  	published.day
  end

  def month
  	published.strftime("%b")
  end
end