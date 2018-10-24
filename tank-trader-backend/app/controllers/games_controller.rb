

class GamesController < ApplicationController
  def index
    games = Game.all
    render json: { games: games }
  end

  def create
    game_params = user_params
    user = User.find_by(user_name: game_params['user_name'])
    new_game = Game.create(user_id: user.id)
    new_game.create_events(game_params['num_of_events'])
    new_game.create_prices

    render json: { prices: new_game.prices, events: new_game.events, game_events: new_game.game_events }
  end

  private

  def user_params
    params.permit(:user_name, :num_of_events)
  end
end
