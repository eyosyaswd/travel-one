class CreateVacations < ActiveRecord::Migration
  def change
    create_table :vacations do |t|
      t.string :origin
      t.string :destination
      t.decimal :fare
      t.datetime :departure_time
      t.datetime :return_time
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
