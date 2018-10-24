class AddIntervalToGameEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :game_events, :interval, :integer
  end
end
