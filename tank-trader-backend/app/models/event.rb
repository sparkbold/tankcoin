class Event < ApplicationRecord
    has_many :game_events
    has_many :games, through: :game_events
end
