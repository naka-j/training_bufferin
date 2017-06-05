#coding: utf-8
class Timesheet < ApplicationRecord
  include Utilities

  attr_accessor :start_time_year,
                :start_time_month,
                :start_time_day,
                :start_time_hour,
                :start_time_min

  MINUTE_INPUT_BY = 15

  scope :by_start_date, ->(start_time) {
    where('start_time >= ? and start_time <= ?',
          Time.new(start_time.year, start_time.month, start_time.day, 0, 0, 0),
          Time.new(start_time.year, start_time.month, start_time.day, 23, 59, 59)
    )
  }

  #---------------------------------
  # バリデーション
  #---------------------------------
  validate :check_start_time

  # Check: 出勤時間
  def check_start_time
    # 有効な値かどうか？
    if !start_time.present?
      return errors.add(:start_time, I18n.t('error_message.is_invalid'))
    end

    # 分が設定された単位の入力かどうか？
    if start_time_min.to_i % MINUTE_INPUT_BY != 0
      errors.add(:start_time_min, I18n.t('error_message.must_be_by_15min'))
    end

    # 既に登録されている時間か？
    registered = Timesheet.by_start_date(start_time)
    if registered.present?
      errors.add(:start_time, I18n.t('error_message.already_registered'))
    end
  end

  #---------------------------------
  # インスタンスメソッド
  #---------------------------------

  # 入力値を０埋め （ex. '9' -> '09'）
  def start_time_year_str
    sprintf("%04d", start_time_year) if is_number_only?(start_time_year)
  end
  def start_time_month_str
    sprintf("%02d", start_time_month) if is_number_only?(start_time_month)
  end
  def start_time_day_str
    sprintf("%02d", start_time_day) if is_number_only?(start_time_day)
  end
  def start_time_hour_str
    sprintf("%02d", start_time_hour) if is_number_only?(start_time_hour)
  end
  def start_time_min_str
    sprintf("%02d", start_time_min) if is_number_only?(start_time_min)
  end

  # 入力値をyyyy/mm/dd hh:miの形式で返す
  def start_time_str_with_slash
    "#{start_time_year_str}/#{start_time_month_str}/#{start_time_day_str} #{start_time_hour_str}:#{start_time_min_str}"
  end
  # 入力値をyyyymmddhhmissの形式で返す
  def start_time_str
    "#{start_time_year_str}#{start_time_month_str}#{start_time_day_str}#{start_time_hour_str}#{start_time_min_str}00"
  end
  def end_time_str

  end

  # 初期表示時に現在時刻をデフォルトでセット（分は切り上げ）
  def set_default_value
    current_time = Time.now
    target_time = current_time + (MINUTE_INPUT_BY - (current_time.min % MINUTE_INPUT_BY)).minute
    self.start_time_year = target_time.year
    self.start_time_month = target_time.month
    self.start_time_day = target_time.day
    self.start_time_hour = target_time.hour
    self.start_time_min = sprintf("%02d", target_time.min)
  end

  # インスタンスの値からTime型カラムに値をセット
  def set_time_params
    self.start_time = convert_string_to_time(start_time_str)
    # self.end_time = convert_string_to_time(end_time_str)
  end

  #---------------------------------
  # クラスメソッド
  #---------------------------------
  class << self

  end
end
