class CreateStaffMembers < ActiveRecord::Migration
  def change
    create_table :staff_members do |t|
      t.string :name
      t.string :image
      t.text :description
      t.text :contact
      t.string :job
      t.boolean :enabled
      t.string :linkedin

      t.timestamps
    end
  end
end
