App.timesheet = App.cable.subscriptions.create("TimesheetChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server

  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
      console.log('Received!!')
    return console.log(data["message"]);
  },

  test: function(message) {
    return this.perform('test', {message: message})
  }
});
