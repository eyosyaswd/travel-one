class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.

  # For hackathon: don't worry about CSRF attacks...
  # protect_from_forgery with: :exception

  protected
    def configure_permitted_parameters
      puts "Devise controller wooooo!"
      devise_parameter_sanitizer.for(:sign_up) << :capitalone_id
    end
end
