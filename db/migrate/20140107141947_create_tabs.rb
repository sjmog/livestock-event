class CreateTabs < ActiveRecord::Migration
  def change
    create_table :tabs do |t|
      t.references :tile, index: true
      t.string :content

      t.timestamps
    end
  end
end
