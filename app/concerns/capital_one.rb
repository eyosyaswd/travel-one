class CapitalOne
  include HTTParty
  base_uri 'api.reimaginebanking.com'
  
  def initialize(api_key)
    @options = { query: { key: api_key } }
  end
	
  # get accounts by customer id
  def accounts(customer_id)
    self.class.get("/customers/#{customer_id}/accounts", @options)
  end

  def account(account_id)
    self.class.get("/accounts/#{account_id}", @options)
  end
	
  def create_account(customer_id, nickname)
    self.class.post("http://api.reimaginebanking.com/customers/#{customer_id}/accounts",
      body: { type: "Savings",
              nickname: nickname,
              rewards: 0,
              balance: 0
            }.to_json,
      headers: { 'Content-Type' => 'application/json' },
      query: @options[:query])
  end

  def transfers(account_id)
    self.class.get("/accounts/#{account_id}/transfers", @options)
  end

  def transfer(transfer_id)
    self.class.get("/transfers/#{transferId}", @options)
  end

  def create_transfer(account_id, payee_id, date, amount)
    medium = 'balance'
    self.class.post("/accounts/#{account_id}/transfers", 
      body: { 
              medium: medium,
              payee_id: payee_id,
              amount: amount,
              transaction_date: date
            }.to_json,
      headers: { 'Content-Type' => 'application/json'},
      query: @options[:query])
  end
end