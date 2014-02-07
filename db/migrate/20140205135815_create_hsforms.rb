class CreateHsforms < ActiveRecord::Migration
  def change
    create_table :hsforms do |t|
      t.references :booking, index: true
      t.integer :progress
      t.boolean :complete
      t.string :company_name
      t.string :name
      t.string :mobile
      t.text :particulars
      t.boolean :policy
      t.boolean :public_insurance
      t.boolean :employee_insurance
      t.boolean :tick_1
      t.boolean :tick_2
      t.boolean :tick_3
      t.boolean :tick_4
      t.boolean :tick_5
      t.boolean :tick_6
      t.boolean :tick_7
      t.boolean :agreed
      t.string :completed_by
      t.string :date

      t.timestamps
    end
  end
end
