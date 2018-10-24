class Game < ApplicationRecord
  belongs_to :user
  has_many :game_events
  has_many :events, through: :game_events
  has_many :prices

  def create_events(num_of_events)
    events = Event.all
    event_ids = []
    events.each do |e|
      event_ids << e.id
    end
    num_of_events.times do
      GameEvent.create(game_id: self.id, event_id: event_ids.sample)
    end
  end

  def create_prices
    game_length = []
    use_events = []

    for i in (1..60).step(1) do
      game_length << i
    end

    game_length.length.times do 
      use_events << 0
    end
    
    game = Game.find(self.id)
    game_event_intervals = []
    game.events.each do |event|
      game_event_intervals << event.time_interval
    end

    # find the GameEvent IDs and update them with the start time



    event_times = []
    game_event_intervals.each_with_index do |ei, i|
      current_time = game_length.slice(0, game_length.length - ei).sample
      GameEvent.update(game.game_events[i].id, interval: current_time)
      game_length.slice!(current_time, ei)
      ei.times do
        use_events.slice!(current_time)
      end
      ei.times do 
        use_events.insert(current_time, i + 1)
      end
      event_times << [current_time, ei]
    end

    60.times do |i|
      if use_events[i] == 0
        np = Price.new(game_id: self.id)
        np.new_price

      else 
        np = Price.new(game_id: self.id)
        np.new_price(game.events[use_events[i-1]])
      end 
    end
  end

end
