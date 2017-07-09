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
      render json: @timesheet, status: 201
    else
      render json: @timesheet.errors.full_messages, status: 400
    end

  end

  def edit

  end

  def update
    @timesheet = Timesheet.get_edit_target_with_params_for_api(params[:id], timesheet_params)
    if @timesheet.save
      render json: @timesheet, status: 201
    else
      render json: @timesheet.errors.full_messages, status: 400
    end
  end

  def destroy
    @timesheet = Timesheet.find_by_id(params[:id])
    if @timesheet.destroy
      render json: @timesheet, status: 201
    else
      render json: @timesheet.errors.full_messages, status: 400
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
        :end_time,
        :end_time_year,
        :end_time_month,
        :end_time_day,
        :end_time_hour,
        :end_time_min
    )
  end
end
