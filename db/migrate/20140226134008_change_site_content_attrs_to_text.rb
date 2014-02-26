class ChangeSiteContentAttrsToText < ActiveRecord::Migration
  def change
  	change_column :site_contents, :why_two_text, :text
  	change_column :site_contents, :why_three_text, :text
  	change_column :site_contents, :why_four_text, :text
  end
end
