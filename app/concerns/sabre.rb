class Sabre
  
  #store the api key
  def initialize(sabreid, sabresecret)
    puts sabreid
	puts sabresecret
    clientid = Base64.encode64("V1:p4w7512jm9g963ev:DEVCENTER:EXT ").gsub("\n", '')
    secret = Base64.encode64("DJcn1pR4").gsub("\n", '')
	client = OAuth2::Client.new(clientid, secret, site: 'https://api.test.sabre.com', token_url: '/v1/auth/token')
	@token = client.client_credentials.get_token
  end
	
  # get all places of type in city, use place id for select locations to perform
  # detail search.
  def destination_finder(orig, departure, retdate)
    options = {
	 origin: orig,
	 departuredate: departure,
	 returndate: retdate,
	 topdestinations: 3
	}
	response = @token.get '/v2/shop/flights/fares', params: options
  end
end