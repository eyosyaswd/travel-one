class Vacation < ActiveRecord::Base
  belongs_to :user

  # need origin, fare, origin and return time
  validates :origin, presence: true
  validates :destination, presence: true
  validates :fare, presence: true
  validates :departure_time, presence: true
  validates :return_time, presence: true
end
