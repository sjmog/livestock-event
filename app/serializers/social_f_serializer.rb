class SocialFSerializer < BaseSerializer
  attributes :id
  attribute :text
  attribute :user
  attribute :published
  attribute :link
  attribute :likes
  attributes :day, :month

  def day
  	published.day
  end

  def month
  	published.strftime("%b")
  end

end