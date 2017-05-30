#coding: utf-8
class TimesheetsController < ApplicationController
  def index
    redirect_to new_timesheet_path
  end

  def new
    @timesheet = Timesheet.new
    @timesheet.set_default_value
  end

  def create
    @timesheet = Timesheet.new(timesheet_params)
    @timesheet.set_time_params
    if @timesheet.save
      redirect_to new_timesheet_path, notice: t('notice_message.save_success')
    else
      render :new
    end
  end

  private
  def timesheet_params
    params.require(:timesheet).permit(
        :start_time,
        :start_time_year,
        :start_time_month,
        :start_time_day,
        :start_time_hour,
        :start_time_min,
        :end_time
    )
  end
end
