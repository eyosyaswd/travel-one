class PaymentPlansController < ApplicationController
  before_action :authenticate_user!

  def initialize
    @cap1 = CapitalOne.new('62dbca64eba755113d88efdeee141db0')
  end
  
  def index
    payment_plan = PaymentPlan.where(vacation: Vacation.where(user: current_user))
	  render json: payment_plan
  end
  
  def create
    payment_plan = PaymentPlan.new filtered_params
    current_vacation = (Vacation.where(user: current_user)).order("created_at").last 
	  payment_plan.vacation = current_vacation
	  payment_plan.transfer_amount = payment_plan.cost / ((payment_plan.end_date - payment_plan.start_date) / payment_plan.interval)
	
    if payment_plan.valid?
      payment_plan.save!
      current_vacation.payment_plan = payment_plan
      current_vacation.save!
    else
      head :error
      return
    end

    render json: payment_plan
  end

  def show
    current_vacation = (Vacation.where(user: current_user)).order("created_at").last 
    payment_plan = PaymentPlan.find_by(id: params[:id], vacation_id: current_vacation.vacation_id)

    if payment_plan.nil?
      head :error
    else
      render json: payment_plan
    end
  end

  def destroy
    current_vacation = (Vacation.where(user: current_user)).order("created_at").last 
    payment_plan = PaymentPlan.find_by(id: params[:id], vacation_id: current_vacation.vacation_id)

    if vacation.nil?
      head :error
    else
      payment_plan.destroy
	  #cost should be the current balance of the transfer account
	  #@cap1.create_transfer(payment_plan.transfer_account, payment_plan.paying_account, Date.current, cost)
	  render json: payment_plan
    end
  end

  private
    def filtered_params
      params.require(:payment_plan).permit(:paying_account, :transfer_account, :start_date, :end_date, :interval, :vacation_id, :cost)
    end
	
	def transfer #where will we check when the next payment is due?
	  current_vacation = (Vacation.where(user: current_user)).order("created_at").last 
      payment_plan = PaymentPlan.find_by(id: params[:id], vacation_id: current_vacation.vacation_id)
	  if (Date.current - payment_plan.start_date) % payment_plan.interval = 0
	   # @cap1.create_transfer(payment_plan.paying_account, payment_plan.transfer_account, Date.current, payment_plan.transfer_amount)
	  end
	end
end
