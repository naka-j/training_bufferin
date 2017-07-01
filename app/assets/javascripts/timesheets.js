// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(function() {
    'use strict';

    if (!$('#timesheets-index').length) {
        return
    }
    var TimesheetModel = {
        getAll: function (params, successFunc, errorFunc) {
            var requestURL = API_BASE_URL + '/timesheets/' + params.yyyymm;
            Util.commonAjaxTypeJson(requestURL, 'GET', params, successFunc, errorFunc);
        }
    };

    var TimesheetCtrl = {
        getTimesheets: function (params, successFunc, errorFunc) {
            return TimesheetModel.getAll(params, successFunc, errorFunc);
        },
        init: function () {
            TimesheetView.init();
        }
    };

    var TimesheetView = {
        init: function () {
            this.timesheetList = $('#timesheet-list');
            this.targetYearMonth = $('#target-year-month');
            this.timesheetListItem = Handlebars.compile($('#timesheet-row-template').html());
            this.bindEvents();
            this.loadList();
        },
        bindEvents: function () {

        },
        afterListLoaded: function (data, statusCode, jqXHR) {
            var htmlStr = '';
            data.timesheets.forEach(function (t) {
                t.start_time = new Date(t.start_time)
                t.start_time_str = t.start_time.getHours() + ':' + (t.start_time.getMinutes() < 10 ? '0' : '') + t.start_time.getMinutes();
                t.end_time = t.end_time == null ? null : new Date(t.end_time);
                t.end_time_str = t.end_time == null ? '' : t.end_time.getHours() + ':' + (t.end_time.getMinutes() < 10 ? '0' : '') + t.end_time.getMinutes();

                htmlStr += TimesheetView.timesheetListItem(t);
            });
            TimesheetView.timesheetList.html(htmlStr);
            TimesheetView.rowSlideIn();
        },
        errorListLoaded: function (jqXHR, statusCode, error) {
            alert('Load Error!');
        },
        loadList: function () {
            var params = {
                yyyymm: this.targetYearMonth.val()
            };
            TimesheetCtrl.getTimesheets(params, this.afterListLoaded, this.errorListLoaded);
        },
        rowSlideIn: function () {
            $('.timesheet-detail').each(function (i) {
                $(this).delay(25 * i).animate({left: 0}, 80);
            })
        }
    };

    TimesheetCtrl.init();

});