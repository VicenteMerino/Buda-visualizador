# frozen_string_literal: true

# rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
require 'json'

module Api
  module V1
    # Request method for GET /api/v1/exchange-rates
    class ExchangeController < ApplicationController
      def exchange_rates
        case params['market']
        when 'clp-usd'
          year = params.key?('year') ? params['year'] : Date.today.year
          response = RestClient.get "https://mindicador.cl/api/dolar/#{year}",
                                    { content_type: :json, accept: :json }
          render json: { error: 'Error with external API', status: 404 }, status: 404 if response.code != 200

          serie_info = JSON.parse(response.body)['serie']
          exchange_rates = { rates: [], market: params['market'] }
          serie_info.each do |serie|
            date = serie['fecha'].to_time.strftime('%Y-%m-%d')
            puts date
            exchange_rates[:rates] << { date: date, value: serie['valor'] } if date <= Date.today.strftime('%Y-%m-%d')
          end
          render json: exchange_rates
        when 'btc-usd'
          year = params.key?('year') ? params['year'] : Date.today.year
          start_date = "#{year}-01-01"
          end_date = if "#{year}-12-31" <= Date.today.strftime('%Y-%m-%d')
                       "#{year}-12-31"
                     else
                       Date.today.strftime('%Y-%m-%d')
                     end
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
# rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
