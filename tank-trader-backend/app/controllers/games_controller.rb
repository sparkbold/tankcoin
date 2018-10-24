

class GamesController < ApplicationController
  def index
    games = Game.all
    render json: { games: games }
  end

  def create
    game_params = user_params
    binding.pry
    new_game = Game.create(game_params.user_name)
    new_game.create_events(game_params.num_of_events)
    new_game.create_prices

    render json: { prices: new_game.prices, events: new_game.events }
  end

  def show; end

  private

  def user_params
      params.require(:body).permit(:user_name, :num_of_events)
  end

end
