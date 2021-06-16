# frozen_string_literal: true

# rubocop:disable Metrics/AbcSize, Metrics/MethodLength
require 'json'
require 'dotenv'
Dotenv.load

module Api
  module V1
    # Request method for GET /api/v1/exchange-rates
    class BudaController < ApplicationController
      def orders
        api_key = ENV['API_KEY']
        secret = ENV['SECRET']
        nonce = (Time.now.to_f * 1e6).to_i.to_s
        request_signature = "GET /api/v2/markets/btc-clp/orders #{nonce}"
        hmac = OpenSSL::HMAC.hexdigest('sha384', secret, request_signature)
        response = RestClient.get 'https://www.buda.com/api/v2/markets/btc-clp/orders',
                                  { content_type: :json, accept: :json, 'X-SBTC-APIKEY': api_key,
                                    'X-SBTC-NONCE': nonce, 'X-SBTC-SIGNATURE': hmac }
        render json: { message: 'Error with external API', error: 404 } if response.code != 200
        orders = JSON.parse(response.body)['orders']
        market_orders = { orders: [] }
        orders.each do |order|
          order['created_at'] = order['created_at'].to_time.strftime('%Y-%m-%d')
          market_orders[:orders] << order if (order['state'] == 'traded') && (order['price_type'] == 'market')
        end
        render json: market_orders
      end
    end
  end
end

# rubocop:enable Metrics/AbcSize, Metrics/MethodLength
