class PaymentPlan < ActiveRecord::Base
  belongs_to :vacation
  
  #need all fields
  validates_presence_of :paying_account, :transfer_account, :start_date, :end_date, :interval, :vacation_id, :cost
end
