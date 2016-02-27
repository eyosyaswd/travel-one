class Sabre
  
  #store the api key
  def initialize(sabreid, sabresecret)
    @clientid = Base64.encode64(sabreid).gsub("\n", '')
    @secret = Base64.encode64(sabresecret).gsub("\n", '')
	@client = OAuth2::Client.new(@clientid, @secret, site: 'https://api.test.sabre.com', token_url: '/v1/auth/token')
	@token = @client.client_credentials.get_token
  end
	
  # get all places of type in city, use place id for select locations to perform
  # detail search.
  def destination_finder(orig, departure, returnd)
    params: {
	 origin: [:orig]
	 departuredate: [:departure]
	 returndate: [:returnd]
	 topdestinations: 3
	}
	response = @token.get '/v2/shop/flights/fares', params: params
  end
end