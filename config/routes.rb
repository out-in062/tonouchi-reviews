# config/routes.rb

Rails.application.routes.draw do
  # Defines the root path route ("/")
  root "courses#index" # syllabuses#index より courses#index の方が一般的かと思われます

  get '/syllabuses', to: 'syllabuses#index'

  # ログイン/ログアウト/ユーザー登録
  get    "login"   => "sessions#new"
  post   "login"   => "sessions#create"
  delete "logout"  => "sessions#destroy"

  get    "signup"  => "users#new"
  # UsersControllerTest が resources :users を期待しているため、以下のように書くのが最も簡単です
  get '/mypage', to: 'users#show', as: 'mypage'
  resources :users, only: [ :new, :create, :show ]
  resources :reviews, only: [ :show, :edit, :update, :destroy ] do
    resources :review_reactions, only: [ :create, :destroy ]
  end

  # コースとレビュー
  resources :courses, only: [ :index, :show ] do
    resources :reviews, only: [ :new, :create ]
  end



  # Reveal health status on /up that returns 200...
  get "up" => "rails/health#show", as: :rails_health_check
end
