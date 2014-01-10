class Tile < ActiveRecord::Base
	has_many :tabs
	accepts_nested_attributes_for :tabs

	has_many :buttons
	accepts_nested_attributes_for :buttons
end
