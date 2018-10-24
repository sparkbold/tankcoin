<<<<<<< HEAD
=======
# frozen_string_literal: true

>>>>>>> 8d8247cc97a43eddcc574cb9598d776beae5766e
class GamesController < ApplicationController
  def index
    games = Game.all
    render json: { games: games }
  end

  def create
<<<<<<< HEAD
    game_params = user_params
    new_game = Game.create(game_params.user_name)
    new_game.create_events(game_params.num_of_events)
=======
    new_game = Game.create(user_id: 8)
    new_game.create_events(4)
>>>>>>> 8d8247cc97a43eddcc574cb9598d776beae5766e
    new_game.create_prices

    render json: { prices: new_game.prices, events: new_game.events }
  end

  def show; end

  private

  def user_params
      params.require(:body).permit(:user_name, :num_of_events)
  end

end
