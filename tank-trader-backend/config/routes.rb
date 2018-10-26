Rails.application.routes.draw do
  resources :transactions
  resources :game_events
  resources :events
  get 'games/top10', to: 'games#top_10'
  resources :games
  resources :users
  get 'games', to: 'games#show'
  get 'games/:id/prices', to: 'prices#show'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

end
