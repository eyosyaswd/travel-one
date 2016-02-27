class GooglePlaces
  include HTTParty
  base_uri 'maps.googleapis.com/maps/api/place'
  
  #store the api key
  def initialize(api_key)
    @key = api_key 
  end
	
  # get all places of type in city, use place id for select locations to perform
  # detail search.
  def text_search(type, city)
    self.class.get("/textsearch/json?query=#{type}+in+#{city}&key=#{@key}")
  end

  #get specific details such as name, address, types, gplaces url, phone number
  # and location website corresponding to the place_id
  def detail_search(place_id)
    self.class.get("/details/json?placeid=#{place_id}&key=", @options)
  end
end