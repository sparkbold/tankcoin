class PricesController < ApplicationController
    
    def show
        prices = Price.where(game_id: params[:id])

        only_price = prices.map do |price_object|
            price_object.value + 1
        end

        ending_value = only_price.reduce(1,:*)
        render json: {ending_value: ending_value, price: only_price}
    end

end