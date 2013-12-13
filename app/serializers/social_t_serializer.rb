class SocialTSerializer < BaseSerializer
  attributes :id
  attribute :text
  attribute :user
  attribute :published
  attribute :link
  attributes :day, :month
  attribute :created_at

  def day
  	created_at.day
  end

  def month
  	created_at.strftime("%b")
  end
end