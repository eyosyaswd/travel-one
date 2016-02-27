class AccountsController < ApplicationController
  before_action :authenticate_user!

  def initialize
    @cap1 = CapitalOne.new(ENV["CAP1_KEY"])
  end

  def index
    render json: @cap1.accounts(current_user.capitalone_id).parsed_response
  end

  def show
    render json: @cap1.account(params[:id])
  end

  def create
    render json: @cap1.create_account(current_user.capitalone_id, params[:nickname])
  end
end
