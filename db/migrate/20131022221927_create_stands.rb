class CreateStands < ActiveRecord::Migration
  def change
    create_table :stands do |t|
    	t.integer :number
    	t.boolean :taken
    	t.integer :frontage
    	t.integer :depth
    	t.string :area

    	t.timestamps
    end
  end
end
