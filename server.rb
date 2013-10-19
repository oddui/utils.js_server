# server.rb
# This server implements CORS standard to enable cross site http requests.
require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'json'

configure do
  # disable Rack::Protection::HttpOrigin for CORS
  set :protection, :except => :http_origin
end

before do
  # CORS headers
  headers 'Access-Control-Allow-Origin' => '*'

  # if request is preflighted with http options
  if request.request_method == 'OPTIONS'
    headers 'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE'
    headers 'Access-Control-Allow-Headers' => 'accept, content-type, origin'
    halt 200
  end
end

get '/' do
  send_file File.expand_path('index.html', settings.public_folder)
end

get '/get' do
  content_type :json
  { key: params[:data] }.to_json
end

post '/post' do
  content_type :json

  case request.media_type
  when 'application/x-www-form-urlencoded'
    # urlencoded data will be decoded and set in params hash
    { key: params[:data] }.to_json
  when 'application/json'
    # params hash will not be set, parse the body directly
    data = JSON.parse(request.body.read)
    { key: data['data'] }.to_json
  else
    ''
  end
end

put '/put' do
  content_type :json
  { key: params[:data] }.to_json
end

delete '/delete' do
  content_type :json
  { key: params[:data] }.to_json
end
