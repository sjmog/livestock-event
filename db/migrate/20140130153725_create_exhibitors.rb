class CreateExhibitors < ActiveRecord::Migration
  def change
    create_table :exhibitors do |t|
      t.string :name
      t.string :email
      t.string :telephone
      t.string :website
      t.string :area
      t.string :zone
      t.boolean :list
      t.text :description

      t.timestamps
    end
  end
end
