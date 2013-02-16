PhotoTagger::Application.routes.draw do

  root to: 'static_pages#index'
  resources :tags
end
