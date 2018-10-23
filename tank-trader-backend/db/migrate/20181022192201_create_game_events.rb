class CreateGameEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :game_events do |t|
      t.belongs_to :event, foreign_key: true
      t.belongs_to :game, foreign_key: true

      t.timestamps
    end
  end
end
