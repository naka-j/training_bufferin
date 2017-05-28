#coding: utf-8
class Timesheet < ApplicationRecord
  attr_accessor :start_time_year,
                :start_time_month,
                :start_time_day,
                :start_time_hour,
                :start_time_min

  #---------------------------------
  # バリデーション
  #---------------------------------
  validate :check_start_time

  # Check: 出勤時間
  def check_start_time
    # 有効な値かどうか？
    if !start_time.present?
      return errors.add(:start_time, I18n.t('activerecord.attributes.timesheet.start_time') + I18n.t('error_message.is_invalid'))
    end

    # 15分単位かどうか？
    if !start_time_min.in?(['00', '0', '15', '30', '45'])
      errors.add(:start_time_min, I18n.t('activerecord.attributes.timesheet.start_time_min') + I18n.t('error_message.must_be_by_15min'))
    end
  end

  #---------------------------------
  # インスタンスメソッド
  #---------------------------------

  # 入力値を０埋め （ex. '9' -> '09'）
  def start_time_year_str
    sprintf("%04d", start_time_year) if start_time_year.present?
  end
  def start_time_month_str
    sprintf("%02d", start_time_month) if start_time_month.present?
  end
  def start_time_day_str
    sprintf("%02d", start_time_day) if start_time_day.present?
  end
  def start_time_hour_str
    sprintf("%02d", start_time_hour) if start_time_hour.present?
  end
  def start_time_min_str
    sprintf("%02d", start_time_min) if start_time_min.present?
  end

  # 入力値をyyyymmddhhmissの形式で返す
  def timesheet_time_str
    "#{start_time_year_str}#{start_time_month_str}#{start_time_day_str}#{start_time_hour_str}#{start_time_min_str}00"
  end

  #---------------------------------
  # クラスメソッド
  #---------------------------------
  class << self
    include Utilities
    # 勤怠データ新規登録
    def create_new_timesheet(params)
      ts = Timesheet.new(params)
      # 時間文字列(yyyymmddhhmiss)を時間に変換して登録
      ts.start_time = convert_string_to_time(ts.timesheet_time_str)
      ts.save
      ts
    end
  end
end
