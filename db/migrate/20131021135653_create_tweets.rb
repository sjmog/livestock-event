class CreateTweets < ActiveRecord::Migration
  def change
    create_table :tweets do |t|
      t.string :user
      t.date :published
      t.text :tweetcontent
      t.string :avatar

      t.timestamps
    end
  end
end
