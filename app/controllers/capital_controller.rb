class CapitalController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  base_url 'api.reimaginebanking.com'
  def index 
  end

  def initialize(api_key)
    @api_key = api_key
  end
	
  def accounts(customer_id)
    response = HTTParty.get(base_url + "/" + customer_id + "/accounts?key=" + api_key)
  end
	
  def createAccount(customer_id, nickname)
    #HTTParty.post(base_url, "")
  end
end