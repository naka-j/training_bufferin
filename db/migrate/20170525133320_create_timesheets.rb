#coding: utf-8
class CreateTimesheets < ActiveRecord::Migration[5.0]
  def change
    create_table :timesheets do |t|
      t.time :start_time
      t.time :end_time

      t.timestamps
    end
  end

  def down
    drop_table :timesheets
  end
end
