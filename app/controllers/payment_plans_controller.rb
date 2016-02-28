class PaymentPlansController < ApplicationController
  before_action :authenticate_user!

  def initialize
    @cap1 = CapitalOne.new('62dbca64eba755113d88efdeee141db0')
  end

  def index
    render json: PaymentPlan.all #Vacation.where(user: current_user) #needs to be changed
  end

  def create
    payment_plan = PaymentPlan.new filtered_params
    payment_plan.vacation = current_vacation #needs to be changed

    if payment_plan.valid?
      payment_plan.save!
      current_vacation.payment_plan = [payment_plan]
      current_vacation.save!
    else
      head :error
      return
    end

    render json: payment_plan
  end

  def show
    payment_plan = PaymentPlan.find_by(id: params[:id], vacation_id: current_vacation.id)

    if payment_plan.nil?
      head :error
    else
      render json: payment_plan
    end
  end

  def destroy
    # only destroy user's vacations
    payment_plan = PaymentPlan.find_by(id: params[:id], vacation_id: current_vacation.id)

    if vacation.nil?
      head :error
    else
      payment_plan.destroy
      render json: payment_plan
    end
  end

  private
    def filtered_params
      params.require(:payment_plan).permit(:paying_account, :transfer_account, :start_date, :end_date, :interval, :vacation_id, :cost)
    end
	
	def transfer #where will we check when the next payment is due?
	  if (current date - start_date) % interval = 0
	    transfer_amount = cost / ((end_date - start_date) / interval) 
	    @cap1.create_transfer(:paying_account, :transfer_account, Date.current, transfer_amount)
	  end
	end
end
