class CreateSocialLs < ActiveRecord::Migration
  def change
    create_table :social_ls do |t|
      t.string :user
      t.text :text
      t.datetime :published

      t.timestamps
    end
  end
end
