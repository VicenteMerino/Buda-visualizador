Rails.application.routes.draw do
  root 'pages#index'
  get 'dashboard', :to => "pages#index"
  namespace 'api' do
    namespace 'v1' do
      post 'exchange-rates', :to => "exchange#exchange_rates"
      get 'orders', :to => "buda#orders"
    end
  end
end
