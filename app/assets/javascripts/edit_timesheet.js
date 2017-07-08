$(function() {
   'use strict';

    if (!$('#timesheets-edit').length) {
        return
    }

    var EditTimesheetModel = {
        updateTimesheet: function(params, successFunc, errorFunc) {
            var requestURL = API_BASE_URL + 'timesheets/' + params.id;
            Util.commonAjaxTypeJson(requestURL, 'PATCH', params, successFunc, errorFunc);
        }
    };

    var EditTimesheetCtrl = {
        init: function() {
            EditTimesheetView.init();
        },
        update: function(params, successFunc, errorFunc) {
            EditTimesheetModel.updateTimesheet(params, successFunc, errorFunc);
        }
    };

    var EditTimesheetView = {
        init: function() {
            this.editTimesheetForm = $('.edit_timesheet');
            this.editTargetId = $('#timesheet_id');
            this.errorTemplate = Handlebars.compile($('#error-template').html());
            this.bindEvents();
        },
        bindEvents: function() {
            $('.up-btn').on('click', FormUtil.changeTargetBoxNum.bind(this));
            $('.down-btn').on('click', FormUtil.changeTargetBoxNum.bind(this));
            $('#timesheet-submit').on('click', this.updateTimesheet.bind(this));
        },
        updateTimesheet: function() {
            var params = Util.serializeJson(this.editTimesheetForm);
            params.id = this.editTargetId.val();
            EditTimesheetCtrl.update(params, EditTimesheetView.afterSaved, EditTimesheetView.errorSaved);
        },
        afterSaved: function(data, statusCode, jqXHR) {
            EditTimesheetView.sendNotification(data);
            location.replace('/timesheets/' + data.year + data.month);
        },
        errorSaved: function(jqXHR, statusCode, error) {
            var errorMessages = EditTimesheetView.errorTemplate({errors: jqXHR.responseJSON});
            toastr.error(errorMessages);
        },
        sendNotification: function (data) {
            App.timesheet.saved(data);
        }
    };

    EditTimesheetCtrl.init();
});