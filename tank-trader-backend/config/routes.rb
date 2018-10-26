Rails.application.routes.draw do
  resources :transactions
  resources :game_events
  resources :events
  resources :games
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

end
