class CreateSocialFs < ActiveRecord::Migration
  def change
    create_table :social_fs do |t|
      t.string :user
      t.text :text
      t.datetime :published

      t.timestamps
    end
  end
end
