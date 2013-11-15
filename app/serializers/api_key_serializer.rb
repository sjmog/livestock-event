class ApiKeySerializer < ActiveModel::Serializer
	attributes :id, :access_token, :expired_at
	has_one :user, embed: :id
end
