class TimesheetChannel < ApplicationCable::Channel
  def subscribed
    stream_from "timesheet_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def test(data)
    ActionCable.server.broadcast('timesheet_channel', message: data)
  end
end
