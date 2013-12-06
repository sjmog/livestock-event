class CreateSocialTs < ActiveRecord::Migration
  def change
    create_table :social_ts do |t|
      t.string :user
      t.text :text
      t.datetime :published

      t.timestamps
    end
  end
end
