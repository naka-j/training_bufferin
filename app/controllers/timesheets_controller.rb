#coding: utf-8
class TimesheetsController < ApplicationController
  def index
    if !params[:yyyymm].present?
      redirect_to "#{timesheets_path}/#{Date.today.strftime('%Y%m')}"
    end
    @timesheets = Timesheet.get_monthly_timesheet(params[:yyyymm])
    @timesheets_header = Timesheet.get_timesheet_header(params[:yyyymm])
  end
  
  def new
    @timesheet = Timesheet.new_with_default_value
  end

  def create
    @timesheet = Timesheet.new_with_params(timesheet_params)
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
