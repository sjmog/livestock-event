class CreateFbposts < ActiveRecord::Migration
  def change
    create_table :fbposts do |t|
      t.string :user
      t.date :published
      t.text :fbcontent
      t.string :avatar

      t.timestamps
    end
  end
end
