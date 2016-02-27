class PlacesController < ApplicationController
  before_action :authenticate_user!

  def initialize
    @gooPla = GooglePlaces.new(ENV["GP_KEY"])
  end

  def index
    render json: @gooPla.text_search(params[:type], params[:city])
  end

  def show
    render json: @gooPla.detail_search(params[:place_id])
  end

end
