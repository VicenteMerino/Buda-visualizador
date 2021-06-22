# frozen_string_literal: true

# rubocop:disable Metrics/AbcSize, Metrics/MethodLength
require 'json'

module Api
  module V1
    # Request method for GET /api/v1/exchange-rates
    class ExchangeController < ApplicationController
      protect_from_forgery with: :null_session

      def exchange_rates
        case params['market']
        when 'btc-usd'
          start_date = params['start_date']
          end_date = params['end_date']
          response = RestClient.get "https://api.coindesk.com/v1/bpi/historical/close.json?start=#{start_date}&end=#{end_date}",
                                    { content_type: :json, accept: :json }
          render json: { error: 'Error with external API', status: 404 }, status: 404 if response.code != 200
          serie_info = JSON.parse(response.body)['bpi']
          exchange_rates = { rates: [], market: params['market'] }
          serie_info.each do |date, price|
            exchange_rates[:rates] << { date: date, value: price }
          end
          render json: exchange_rates
        else
          render json: { error: 'Invalid market parameters', status: 400 }, status: 400
        end
      end
    end
  end
end

# rubocop:enable Metrics/AbcSize, Metrics/MethodLength
