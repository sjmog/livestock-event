class CreateHazards < ActiveRecord::Migration
  def change
    create_table :hazards do |t|
      t.references :raform, index: true
      t.string :name
      t.text :persons
      t.string :level
      t.string :rassociation
      t.text :controls

      t.timestamps
    end
  end
end
