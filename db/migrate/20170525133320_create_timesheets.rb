#coding: utf-8
class CreateTimesheets < ActiveRecord::Migration[5.0]
  def change
    create_table :timesheets do |t|
      t.string :year
      t.string :month
      t.string :day
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps
    end
  end

  def down
    drop_table :timesheets
  end
end
