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

        when 'btc-clp'
          year = params.key?('year') ? params['year'] : Date.today.year
          start_date = "#{year}-01-01"
          end_date = if "#{year}-12-31" <= Date.today.strftime('%Y-%m-%d')
                       "#{year}-12-31"
                     else
                       Date.today.strftime('%Y-%m-%d')
                     end
          btc_usd_response = RestClient.get "https://api.coindesk.com/v1/bpi/historical/close.json?start=#{start_date}&end=#{end_date}",
                                            { content_type: :json, accept: :json }
          render json: { error: 'Error with external API', status: 404 }, status: 404 if btc_usd_response.code != 200

          usd_clp_response = RestClient.get "https://mindicador.cl/api/dolar/#{year}",
                                            { content_type: :json, accept: :json }
          render json: { error: 'Error with external API', status: 404 }, status: 404 if usd_clp_response.code != 200

          btc_usd_rates = JSON.parse(btc_usd_response.body)['bpi']
          filled_btc_usd_rates = []
          btc_usd_rates.each do |date, price|
            filled_btc_usd_rates << { date: date, value: price }
          end
          usd_clp_rates = JSON.parse(usd_clp_response.body)['serie']
          usd_clp_rates.reverse!


          filled_usd_clp_rates = []
          current_price = usd_clp_rates.first['valor']
          current_date = start_date.to_time
          while current_date < usd_clp_rates.first['fecha']
            filled_usd_clp_rates << { value: current_price, date: current_date.strftime('%Y-%m-%d') }
            current_date += 1.days
          end
          usd_clp_rates.each do |rate|
            if rate['fecha'] == current_date
              filled_usd_clp_rates << rate
            else
              while current_date < rate['fecha']
                filled_usd_clp_rates << { value: current_price, date: current_date.strftime('%Y-%m-%d') }
                current_date += 1.days
              end
            end
            current_price = rate['valor']
          end


          last_date = end_date.to_time
          current_price = usd_clp_rates.last['valor']
          current_date = usd_clp_rates.last['fecha'].to_time

          while last_date >= current_date
            filled_usd_clp_rates << { value: current_price, date: current_date.strftime('%Y-%m-%d') }
            current_date += 1.days
          end
          filled_usd_clp_rates.pop if year.to_s == Date.today.year.to_s


          btc_clp_rates = { rates: [], market: 'btc-clp' }
          filled_usd_clp_rates.each_with_index do |usd_clp_rate, index|
            btc_clp_rates[:rates] << { value: usd_clp_rate[:value] * filled_btc_usd_rates[index][:value],
                                       date: usd_clp_rate[:date] }
          end

          render json: btc_clp_rates
        else
          render json: { error: 'Invalid market parameters', status: 400 }, status: 400

        end
      end
    end
  end
end
# rubocop:enable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/MethodLength, Metrics/PerceivedComplexity
