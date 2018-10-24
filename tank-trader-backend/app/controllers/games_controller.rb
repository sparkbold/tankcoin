<<<<<<< HEAD
class GamesController < ApplicationController
    
    def index
        games = Game.all
        render json: {games: games}
    end

    def create
        new_game = Game.create(user_id: 5)
        new_game.create_events(4)
        new_game.create_prices
=======
# frozen_string_literal: true
>>>>>>> master

class GamesController < ApplicationController
  def index
    games = Game.all
    render json: { games: games }
  end

  def create
    new_game = Game.create(user_id: 1)
    new_game.create_events(4)
    new_game.create_prices

    render json: { prices: self.new_game.prices, events: self.new_game.events }
  end

  def show; end
end
