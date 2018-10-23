class AddEndPriceToGames < ActiveRecord::Migration[5.2]
  def change
    add_column :games, :end_price, :float
  end
end
