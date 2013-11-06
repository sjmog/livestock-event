class CreateContractors < ActiveRecord::Migration
  def change
    create_table :contractors do |t|
      t.string :name
      t.string :companyName
      t.text :address
      t.text :explanation
      t.string :category

      t.timestamps
    end
  end
end
