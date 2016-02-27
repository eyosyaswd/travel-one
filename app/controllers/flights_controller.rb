class FlightsController < ApplicationController
  before_action :authenticate_user!

  def initialize
    @sab = Sabre.new(ENV["SB_ID"], ENV["SB_SC"])
  end

  def index
    render json: @sab.destination_finder(params[:orig], params[:departure], params[:retdate])
  end
end
