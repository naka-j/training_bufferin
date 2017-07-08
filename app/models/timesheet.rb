#coding: utf-8
class Timesheet < ApplicationRecord
  include Utilities

  attr_accessor :start_time_year, :start_time_month, :start_time_day, :start_time_hour, :start_time_min,
                :end_time_year, :end_time_month, :end_time_day, :end_time_hour, :end_time_min

  MINUTE_INPUT_BY = 15
  EDIT_TARGET_START = 'S'
  EDIT_TARGET_END = 'E'

  # 指定日付のデータを取得
  scope :by_start_date, ->(start_time) {
    where('start_time >= ? and start_time <= ?',
          Time.new(start_time.year, start_time.month, start_time.day, 0, 0, 0),
          Time.new(start_time.year, start_time.month, start_time.day, 23, 59, 59)
    )
  }

  # 月ごとのデータを取得
  scope :get_monthly_timesheet, ->(yyyymm) {
    where(year: yyyymm[0..3], month: yyyymm[4..5]).order('start_time desc')
  }

  #---------------------------------
  # バリデーション
  #---------------------------------
  validate :check_start_time
  validate :check_end_time

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
    if registered.present? && id != registered.first.id
      errors.add(:start_time, I18n.t('error_message.already_registered'))
    end
  end

  # Check: 退勤時間
  def check_end_time
    # 有効な値かどうか？
    if !end_time.present?
      return
    end

    # 分が設定された単位の入力かどうか？
    if end_time_min.to_i % MINUTE_INPUT_BY != 0
      errors.add(:end_time_min, I18n.t('error_message.must_be_by_15min'))
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
  def end_time_year_str
    sprintf("%04d", end_time_year) if is_number_only?(end_time_year)
  end
  def end_time_month_str
    sprintf("%02d", end_time_month) if is_number_only?(end_time_month)
  end
  def end_time_day_str
    sprintf("%02d", end_time_day) if is_number_only?(end_time_day)
  end
  def end_time_hour_str
    sprintf("%02d", end_time_hour) if is_number_only?(end_time_hour)
  end
  def end_time_min_str
    sprintf("%02d", end_time_min) if is_number_only?(end_time_min)
  end

  # 入力値をyyyy/mm/dd hh:miの形式で返す
  def start_time_str_with_slash
    "#{start_time_year_str}/#{start_time_month_str}/#{start_time_day_str} #{start_time_hour_str}:#{start_time_min_str}"
  end
  def end_time_str_with_slash
    "#{end_time_year_str}/#{end_time_month_str}/#{end_time_day_str} #{end_time_hour_str}:#{end_time_min_str}"
  end

  # 入力値をhh:miの形式で返す
  def start_time_time_str
    if start_time.present?
    self.start_time_hour = start_time.hour.to_s
    self.start_time_min = start_time.min.to_s
    "#{start_time_hour_str}:#{start_time_min_str}"
    end
  end
  def end_time_time_str
    if end_time.present?
      self.end_time_hour = end_time.hour.to_s
      self.end_time_min = end_time.min.to_s
      "#{end_time_hour_str}:#{end_time_min_str}"
    end
  end

  # 入力値をyyyymmddhhmissの形式で返す
  def start_time_str
    if !start_time_year_str.present? || !start_time_month_str.present? || !start_time_day_str.present? || !start_time_hour_str.present? || !start_time_min_str.present?
      return ''
    end
    "#{start_time_year_str}#{start_time_month_str}#{start_time_day_str}#{start_time_hour_str}#{start_time_min_str}00"
  end
  def end_time_str
    if !end_time_year_str.present? || !end_time_month_str.present? || !end_time_day_str.present? || !end_time_hour_str.present? || !end_time_min_str.present?
      return ''
    end
    "#{end_time_year_str}#{end_time_month_str}#{end_time_day_str}#{end_time_hour_str}#{end_time_min_str}00"
  end

  # 初期表示時、時間登録がない場合現在時刻をデフォルトでセット
  def set_default_value
    current_time = Time.now
    self.start_time = current_time if !self.start_time.present?
    # 退勤時間の初期値は時間は現在時刻、日付は登録対象日付
    if !self.end_time.present? && self.id.present?
      self.end_time = Time.new(self.year, self.month, self.day, current_time.hour, current_time.min, 0)
    elsif !self.end_time.present?
      self.end_time = Time.now
    end
    set_time_value
  end

  # 時間関係の値をセット
  def set_time_value
    # 出勤時間
    start_target_time = start_time
    # 出勤の分は設定された単位で切り上げ
    if start_target_time.min % MINUTE_INPUT_BY > 0
      start_target_time = start_target_time + (MINUTE_INPUT_BY - (start_target_time.min % MINUTE_INPUT_BY)).minute
    end
    self.start_time_year = start_target_time.year
    self.start_time_month = start_target_time.month
    self.start_time_day = start_target_time.day
    self.start_time_hour = start_target_time.hour
    self.start_time_min = sprintf("%02d", start_target_time.min)

    # 退勤時間
    end_target_time = end_time
    # 退勤の分は設定された単位で切り捨て
    if end_target_time.min % MINUTE_INPUT_BY > 0
      end_target_time = end_target_time - (end_target_time.min % MINUTE_INPUT_BY).minute
    end
    self.end_time_year = end_target_time.year
    self.end_time_month = end_target_time.month
    self.end_time_day = end_target_time.day
    self.end_time_hour = end_target_time.hour
    self.end_time_min = sprintf("%02d", end_target_time.min)
  end

  # インスタンスの値から時間に関するカラムに値をセット
  def set_time_params
    if start_time_str.present?
      # 年月日は出勤時間のものとする
      self.year = start_time_year_str
      self.month = start_time_month_str
      self.day = start_time_day_str
      self.start_time = convert_string_to_time(start_time_str)
    end
    if end_time_str.present?
      self.end_time = convert_string_to_time(end_time_str)
    end
  end

  #---------------------------------
  # クラスメソッド
  #---------------------------------
  class << self
    # デフォルト値がセットされたインスタンスを生成
    def new_with_default_value
      timesheet = self.new
      timesheet.set_default_value
      timesheet
    end

    # 入力値をセットしたインスタンスを生成
    def new_with_params(params)
      timesheet = self.new(params)
      timesheet.set_time_params
      timesheet
    end

    # 時間の値をセットした１データを取得
    def get_edit_target(params)
      timesheet = self.get_monthly_timesheet(params[:id]).find_by_day(params[:dd])
      if timesheet.present?
        timesheet.set_default_value
        timesheet.set_time_value
      end
      timesheet
    end

    # 更新するデータに入力値をセットして取得
    def get_edit_target_with_params(yyyymm, dd, params)
      timesheet = self.get_monthly_timesheet(yyyymm).find_by_day(dd)
      if timesheet.present?
        timesheet.assign_attributes(params)
        timesheet.set_time_params
      end
      timesheet
    end

    # 更新するデータに入力値をセットして取得（API用）
    def get_edit_target_with_params_for_api(id, params)
      timesheet = self.find_by_id(id)
      if timesheet.present?
        timesheet.assign_attributes(params)
        timesheet.set_time_params
      end
      timesheet
    end

    def get_timesheet_header(yyyymm)
      year = yyyymm[0..3].to_i
      month = yyyymm[4..5].to_i
      current_date = Date.new(year, month, 1)
      next_month = current_date.next_month
      prev_month = current_date.prev_month
      {
          target_month: "#{year}/#{month}",
          next_month_str: next_month.strftime('%Y%m'),
          prev_month_str: prev_month.strftime('%Y%m')
      }
    end
  end
end
