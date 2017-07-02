class TimesheetChannel < ApplicationCable::Channel
  def subscribed
    stream_from "timesheet_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def saved(data)
    ActionCable.server.broadcast('timesheet_channel', data: data)
  end
end
