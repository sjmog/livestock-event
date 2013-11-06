class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string :status
      t.decimal :amount
      t.date :date

      t.timestamps
    end
  end
end
