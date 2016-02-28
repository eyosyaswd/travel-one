class CreatePaymentPlans < ActiveRecord::Migration
  def change
    create_table :payment_plans do |t|
      t.string :paying_account
      t.string :transfer_account
      t.date :start_date
      t.date :end_date
      t.integer :interval
      t.integer :vacation_id
      t.decimal :cost

      t.timestamps null: false
    end
  end
end
