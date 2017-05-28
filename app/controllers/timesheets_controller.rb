#coding: utf-8
class TimesheetsController < ApplicationController
  def index
    redirect_to new_timesheet_path
  end

  def new
    @timesheet = Timesheet.new
  end

  def create
    @timesheet = Timesheet.create_new_timesheet(timesheet_params)
    if @timesheet.errors.present?
      return render :new
    end
    redirect_to new_timesheet_path, notice: t('notice_message.save_success')
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
