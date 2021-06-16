Rails.application.routes.draw do
  root 'pages#index'
  namespace 'api' do
    namespace 'v1' do
      get 'exchange-rates', :to => "exchange#exchange_rates"
    end
  end
end
