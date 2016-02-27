class Vacation < ActiveRecord::Base
  belongs_to :user

  # need origin, fare, origin and return time
  validates :origin, :destination, :fare, :departure_time, :return_time, presence: true
end
