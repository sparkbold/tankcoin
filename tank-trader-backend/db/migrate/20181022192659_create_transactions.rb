class CreateTransactions < ActiveRecord::Migration[5.2]
  def change
    create_table :transactions do |t|
      t.string :action
      t.float :price
      t.belongs_to :game, foreign_key: true

      t.timestamps
    end
  end
end
