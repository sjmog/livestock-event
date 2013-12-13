class AddUidAndLinkToSocials < ActiveRecord::Migration
  def up
  	add_column :social_ts, :uid, :string
  	add_column :social_ts, :link, :string
  	add_column :social_fs, :uid, :string
  	add_column :social_fs, :link, :string
  	add_column :social_ls, :uid, :string
  	add_column :social_ls, :link, :string
  end

  def down
  	remove_column :social_ts, :uid
  	remove_column :social_ts, :link
  	remove_column :social_fs, :uid
  	remove_column :social_fs, :link
  	remove_column :social_ls, :uid
  	remove_column :social_ls, :link
  end
end
