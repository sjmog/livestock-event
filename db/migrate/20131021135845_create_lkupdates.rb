class CreateLkupdates < ActiveRecord::Migration
  def change
    create_table :lkupdates do |t|
      t.string :user
      t.text :lkcontent
      t.date :published
      t.string :avatar

      t.timestamps
    end
  end
end
