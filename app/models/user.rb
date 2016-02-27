class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  acts_as_token_authenticatable
  
  has_many :vacations

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
end
