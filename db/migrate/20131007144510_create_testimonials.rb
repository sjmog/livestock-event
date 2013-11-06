class CreateTestimonials < ActiveRecord::Migration
  def change
    create_table :testimonials do |t|
      t.string :image
      t.string :attribution
      t.string :quote
      t.string :category

      t.timestamps
    end
  end
end
