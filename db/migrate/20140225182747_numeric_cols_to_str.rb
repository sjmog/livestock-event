class NumericColsToStr < ActiveRecord::Migration
  def change

  	rename_column :site_contents, :awards_1_name, :awards_one_name
  	rename_column :site_contents, :awards_1_about, :awards_one_about
  	rename_column :site_contents, :awards_1_lastyear, :awards_one_lastyear
  	rename_column :site_contents, :awards_1_lastyear_image_url, :awards_one_lastyear_image_url
  	rename_column :site_contents, :awards_1_conditions, :awards_one_conditions
  	rename_column :site_contents, :awards_2_name, :awards_two_name
  	rename_column :site_contents, :awards_2_about, :awards_two_about
  	rename_column :site_contents, :awards_2_lastyear, :awards_two_lastyear
  	rename_column :site_contents, :awards_2_lastyear_image_url, :awards_two_lastyear_image_url
  	rename_column :site_contents, :awards_2_conditions, :awards_two_conditions
  	rename_column :site_contents, :why_1_title, :why_one_title
  	rename_column :site_contents, :why_1_text, :why_one_text
  	rename_column :site_contents, :why_2_title, :why_two_title
  	rename_column :site_contents, :why_3_title, :why_three_title
  	rename_column :site_contents, :why_4_title, :why_four_title
  	rename_column :site_contents, :why_2_text, :why_two_text
  	rename_column :site_contents, :why_3_text, :why_three_text
  	rename_column :site_contents, :why_4_text, :why_four_text
  	rename_column :site_contents, :welcome_1_label, :welcome_one_label
  	rename_column :site_contents, :welcome_2_label, :welcome_two_label
  	rename_column :site_contents, :welcome_3_label, :welcome_three_label
  	rename_column :site_contents, :welcome_4_label, :welcome_four_label
  	rename_column :site_contents, :welcome_5_label, :welcome_five_label
  	rename_column :site_contents, :welcome_6_label, :welcome_six_label
  	rename_column :site_contents, :welcome_1_icon, :welcome_one_icon
  	rename_column :site_contents, :welcome_2_icon, :welcome_two_icon
  	rename_column :site_contents, :welcome_3_icon, :welcome_three_icon
  	rename_column :site_contents, :welcome_4_icon, :welcome_four_icon
  	rename_column :site_contents, :welcome_5_icon, :welcome_five_icon
  	rename_column :site_contents, :welcome_6_icon, :welcome_six_icon
  	rename_column :site_contents, :welcome_1_text, :welcome_one_text
  	rename_column :site_contents, :welcome_2_header, :welcome_two_header
  	rename_column :site_contents, :welcome_3_header, :welcome_three_header
  	rename_column :site_contents, :welcome_4_header, :welcome_four_header
  	rename_column :site_contents, :welcome_5_header, :welcome_five_header
  	rename_column :site_contents, :welcome_6_header, :welcome_six_header
  	rename_column :site_contents, :welcome_2_text, :welcome_two_text
  	rename_column :site_contents, :welcome_3_text, :welcome_three_text
  	rename_column :site_contents, :welcome_4_text, :welcome_four_text
  	rename_column :site_contents, :welcome_5_text, :welcome_five_text
  	rename_column :site_contents, :welcome_6_text, :welcome_six_text
  	
  end
end
