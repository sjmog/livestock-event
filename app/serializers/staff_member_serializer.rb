class StaffMemberSerializer < BaseSerializer
  attributes :id
  attributes :name, :image, :description, :contact, :job, :enabled, :linkedin
end