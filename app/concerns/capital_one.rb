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
        balance: 0,
      }.to_json,
    headers: { 'Content-Type' => 'application/json' },
    query: @options[:query])
  end

  def create_bill(account_id, payment_amount)
    self.class.post("http://api.reimaginebanking.com/accounts/#{account_id}/bills",
	  body: { status: "pending",
      payee: "Travel One",
		  nickname: "Upcoming Trip",
		  payment_date: Date.today,
		  recurring_date: 0,
		  payment_amount: payment_amount,
		  }.to_json,
	  headers: { 'Content-Type' => 'application/json' },
	  query: @options[:query])
  end
  
  def withdraw(account_id, amount)
    self.class.post("http://api.reimaginebanking.com/accounts/#{account_id}/withdrawals",
	  body: { medium: "balance",
		  transaction_date: Date.today,
		  status: "pending",
		  amount: amount,
		  description: "The withdrawal associated with your new travel plans"
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