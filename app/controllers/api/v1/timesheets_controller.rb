#coding: utf-8
class API::V1::TimesheetsController < ApplicationController
  def index
    if !params[:yyyymm].present?
      return redirect_to "#{timesheets_path}/#{Date.today.strftime('%Y%m')}"
    end
    @timesheets = Timesheet.get_monthly_timesheet(params[:yyyymm])
    @timesheets_header = Timesheet.get_timesheet_header(params[:yyyymm])
    render json: {timesheets: @timesheets, timesheets_header: @timesheets_header}
  end

  def new
    @timesheet = Timesheet.new_with_default_value
  end

  def create
    @timesheet = Timesheet.new_with_params(timesheet_params)
    if @timesheet.save
      status = 201
    else
      status = 400
    end
    render json: @timesheet, status: status
  end

  def edit
    @timesheet = Timesheet.get_edit_target(params)
  end

  def update
    @timesheet = Timesheet.get_edit_target_with_params(params[:id], params[:dd], timesheet_params)
    if @timesheet.save
      redirect_to timesheets_path(params[:id]), notice: t('notice_message.save_success')
    else
      render :edit
    end
  end

  def destroy
    timesheet = Timesheet.get_monthly_timesheet(params[:id]).find_by_day(params[:dd])
    timesheet.destroy if timesheet.present?
    redirect_to timesheets_path, notice: t('notice_message.delete_success')
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
