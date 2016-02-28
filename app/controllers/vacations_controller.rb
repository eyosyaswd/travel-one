class VacationsController < ApplicationController
  before_action :authenticate_user!

  def initialize
    @cap1 = CapitalOne.new('62dbca64eba755113d88efdeee141db0')
  end

  def index
    render json: Vacation.where(user: current_user)
  end

  def create
    vacation = Vacation.new filtered_params
    vacation.user = current_user

    if vacation.valid?
      vacation.save!
      current_user.vacations += [vacation]
      current_user.save!
    else
      head :error
      return
    end

    render json: vacation
  end

  def show
    vacation = Vacation.find_by(id: params[:id], user_id: current_user.id)

    if vacation.nil?
      head :error
    else
      render json: vacation
    end
  end

  def destroy
    # only destroy user's vacations
    vacation = Vacation.find_by(id: params[:id], user_id: current_user.id)

    if vacation.nil?
      head :error
    else
      vacation.destroy
	  vacation.payment_plan.destroy
      render json: vacation
    end
  end

  private
    def filtered_params
      params.require(:vacation).permit(:id, :origin, :destination, :fare, :departure_time, :return_time)
    end
end
