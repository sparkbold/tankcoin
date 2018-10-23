class GamesController < ApplicationController
    
    def index
        games = Game.all
        render json: {games: games}
    end

    def create
        new_game = Game.create(user_id: 1)
        new_game.create_events(4)
        new_game.create_prices

        render json: {prices: new_game.prices, events: new_game.events}
    end

    def show
        
    end


end
