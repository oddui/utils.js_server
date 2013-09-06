# server.rb
# This server implements CORS standard to enable cross site http requests.
require 'sinatra'
require 'json'

configure do
  set :protection, :except => :http_origin
end

before do
  # CORS headers
  headers 'Access-Control-Allow-Origin' => '*'
  headers 'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS'
  headers 'Access-Control-Allow-Headers' => 'accept, authorization, origin'
end

get '/get' do
  content_type :json
  { key: params[:data] }.to_json
end

post '/post' do
  content_type :json
  { key: params[:data] }.to_json
end

# put is preflighted with options by some clients due to CORS
options '/put' do
end

put '/put' do
  content_type :json
  { key: params[:data] }.to_json
end

# delete is preflighted with options by some clients due to CORS
options '/delete' do
end

delete '/delete' do
  content_type :json
  { key: params[:data] }.to_json
end
