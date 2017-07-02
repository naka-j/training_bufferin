App.timesheet = App.cable.subscriptions.create("TimesheetChannel", {
  connected: function() {
    // Called when the subscription is ready for use on the server

  },

  disconnected: function() {
    // Called when the subscription has been terminated by the server
  },

  received: function(data) {
      console.log('Received!!')
      console.log(data);
  },

    saved: function(data) {
    return this.perform('saved', data)
  }
});
