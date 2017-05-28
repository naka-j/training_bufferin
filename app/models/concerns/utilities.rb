module Utilities
  extend ActiveSupport::Concern

  # 日時文字列をTime型に変換
  def convert_string_to_time(time_yyyymmddhhmiss)
    if time_yyyymmddhhmiss.length != 14
      return nil
    end
    if !(time_yyyymmddhhmiss =~ /^[0-9]+$/)
      return nil
    end
    year = time_yyyymmddhhmiss[0..3]
    month = time_yyyymmddhhmiss[4..5]
    day = time_yyyymmddhhmiss[6..7]
    hour = time_yyyymmddhhmiss[8..9]
    min = time_yyyymmddhhmiss[10..11]
    sec = time_yyyymmddhhmiss[12..13]

    begin
      time = Time.new(year, month, day, hour, min, sec)
    rescue ArgumentError
      return nil
    end

    time
  end
end