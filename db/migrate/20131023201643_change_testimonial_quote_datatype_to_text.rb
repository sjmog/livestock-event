class ChangeTestimonialQuoteDatatypeToText < ActiveRecord::Migration
  def change
  	change_column :testimonials, :quote, :text
  end
end
