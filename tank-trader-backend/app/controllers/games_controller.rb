

class GamesController < ApplicationController
  def index
    games = Game.all
    render json: { games: games }
  end
  def show
    game = Game.find(params[:id])
    render json: {game: game}
  end

  def create
    game_params = user_params
    user = User.find_by(user_name: game_params['user_name'])
    new_game = Game.create(user_id: user.id)
    new_game.create_events(game_params['num_of_events'])
    new_game.create_prices

    render json: { game_id: new_game.id, prices: new_game.prices, events: new_game.events, game_events: new_game.game_events }
  end

  def update
    gp = game_params
    game = Game.find(game_params["id"])
    game.update(net_value: game_params["net_value"], end_price: game_params["end_price"])
  end

  def login
    params.user_name

    User.find_or_create_by(user_name: user)
  end

  def top_10
    top10games = Game.order('net_value DESC').limit(10)
    games = top10games.map do |game|
      {user_name: User.find(game.user_id).user_name, net_value: game.net_value}
    end
    render json: games
  end

  private

  def user_params
    params.permit(:user_name, :num_of_events)
  end

  def game_params
    params.require(:game).permit(:net_value, :end_price, :id)
  end


end
