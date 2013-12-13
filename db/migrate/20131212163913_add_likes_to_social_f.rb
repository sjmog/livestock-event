class AddLikesToSocialF < ActiveRecord::Migration
  def up
  	add_column :social_fs, :likes, :integer
  end

  def down
  	remove_column :social_fs, :likes
  end
end
