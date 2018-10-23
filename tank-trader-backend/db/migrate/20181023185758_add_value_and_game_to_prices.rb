class AddValueAndGameToPrices < ActiveRecord::Migration[5.2]
  def change
    add_column :prices, :value, :float
    add_reference :prices, :game, foreign_key: true
  end
end
