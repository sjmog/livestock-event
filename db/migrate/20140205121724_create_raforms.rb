class CreateRaforms < ActiveRecord::Migration
  def change
    create_table :raforms do |t|
      t.references :booking, index: true
      t.text :particulars
      t.text :equipment
      t.boolean :complex
      t.string :company_name
      t.string :conducted_by
      t.string :signature
      t.string :date

      t.timestamps
    end
  end
end
