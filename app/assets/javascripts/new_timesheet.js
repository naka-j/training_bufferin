$(function() {
    'use strict';

    if (!$('#timesheets-new').length) {
        return
    }

    var NewTimesheetModel = {
        addNewTimesheet: function(params, successFunc, errorFunc) {
            var requestURL = API_BASE_URL + 'timesheets';
            Util.commonAjaxTypeJson(requestURL, 'POST', params, successFunc, errorFunc);
        }
    };

    var NewTimesheetCtrl = {
        init: function() {
            NewTimesheetView.init();
        },
        create: function(params, successFunc, errorFunc) {
            NewTimesheetModel.addNewTimesheet(params, successFunc, errorFunc);
        }
    };

    var NewTimesheetView = {
        init: function() {
            this.newTimesheetForm = $('#new_timesheet');
            this.bindEvents();
        },
        bindEvents: function() {
            $('.up-btn').on('click', FormUtil.changeTargetBoxNum.bind(this));
            $('.down-btn').on('click', FormUtil.changeTargetBoxNum.bind(this));
            $('#timesheet-submit').on('click', this.createTimesheet.bind(this));
        },
        createTimesheet: function() {
            var params = Util.serializeJson(this.newTimesheetForm);
            NewTimesheetCtrl.create(params, NewTimesheetView.afterSaved, NewTimesheetView.errorSaved);
        },
        afterSaved: function(data, statusCode, jqXHR) {
            NewTimesheetView.sendNotification(data);
            location.replace('/timesheets/' + data.year + data.month);
        },
        errorSaved: function(jqXHR, statusCode, error) {
            alert('OH MY GOD!!')
        },
        sendNotification: function (data) {
            App.timesheet.saved(data);
        }
    };

    NewTimesheetCtrl.init();
});