class ApplicationController < ActionController::Base
  include DeviseTokenAuth::Concerns::SetUserByToken
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.

  # For hackathon: don't worry about CSRF attacks...
  # protect_from_forgery with: :exception
end
