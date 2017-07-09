App.timesheet = App.cable.subscriptions.create("TimesheetChannel", {
    connected: function() {
        // Called when the subscription is ready for use on the server

    },

    disconnected: function() {
        // Called when the subscription has been terminated by the server
    },

    received: function(data) {
        var action = data.data.action;
        console.log('Received!! action ~ ' + data.action );
        console.log(data);
        // 一覧以外には通知しない
        if ($("#timesheets-index").length) {
            TimesheetView.loadList();
            var targetDate = data.data['year'] + '/' + data.data['month'] + '/' + data.data['day'];
            var message;
            // 削除か更新かで通知メッセージを変更
            if (action == 'deleted') {
                message = targetDate + 'のデータが削除されました。';
            } else {
                message = targetDate + 'のデータが更新されました。'
            }
            toastr.info(message);
        }
    },
    saved: function(data) {
        return this.perform('saved', data)
    },
    deleted: function(data) {
        return this.perform('deleted', data)
    }
});
