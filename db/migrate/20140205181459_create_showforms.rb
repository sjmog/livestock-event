class CreateShowforms < ActiveRecord::Migration
  def change
    create_table :showforms do |t|
      t.references :booking, index: true
      t.integer :progress
      t.boolean :complete
      t.boolean :verified
      t.string :company_name
      t.string :contact_name
      t.text :address
      t.string :telephone
      t.string :email
      t.string :website
      t.text :particulars
      t.boolean :dairy
      t.boolean :beef
      t.boolean :sheep
      t.boolean :goats
      t.boolean :pigs
      t.boolean :poultry
      t.boolean :arable

      t.timestamps
    end
  end
end
