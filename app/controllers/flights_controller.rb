class FlightsController < ApplicationController
  before_action :authenticate_user!

  def initialize
    clientid = Base64.encode64(ENV["SB_ID"]).gsub("\n", '')
    secret = Base64.encode64(ENV["SB_SC"]).gsub("\n", '')
    @client = OAuth2::Client.new(clientid, secret, site: 'https://api.test.sabre.com', token_url: '/v1/auth/token')
  end

  def index
    options = {
      origin: params[:origin],
      departuredate: params[:departuredate],
      returndate: params[:returndate],
      maxfare: params[:maxfare],
      topdestinations: 10
    }
    token = @client.client_credentials.get_token

    response = token.get('/v2/shop/flights/fares', params: options)
    render json: response.body
  end
end
