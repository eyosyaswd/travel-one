class SabreController < ApplicationController
  before_action :authenticate_user!

  def initialize
    @sabre = Sabre.new(ENV["SB_ID"], ENV["SB_SC"])
  end

  def index
    render json: @sabre.destination_finder(params[:option])
  end
end
