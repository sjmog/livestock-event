class HazardSerializer < BaseSerializer
  attributes :id
  attributes :raform_id, :name, :persons, :level, :rassociation, :controls
end