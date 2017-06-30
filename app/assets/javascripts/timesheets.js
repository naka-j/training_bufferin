// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(function() {
    'use strict';

    if (!$('#timesheets-index').length) {
        return
    }
    var TimesheetModel = {
        getAll: function (params, successFunc, errorFunc) {
            $.ajax({
                type: 'GET',
                url: API_BASE_URL + '/timesheets/' + params.yyyymm,
                dataType: 'json'
            })
                .done(function (data, statusCode, jqXHR) {
                    successFunc(data, statusCode, jqXHR);
                })
                .fail(function (jqXHR, statusCode, error) {
                    errorFunc(jqXHR, statusCode, error)
                })
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
            this.bindEvents();
            this.loadList();
        },
        bindEvents: function () {

        },
        afterListLoaded: function (data, statusCode, jqXHR) {
            var htmlStr = '';
            data.timesheets.forEach(function (t) {
                var start_time = new Date(t.start_time)
                var start_time_str = start_time.getHours().toString() + ':' + start_time.getMinutes().toString();
                var end_time = new Date(t.end_time)
                var end_time_str = end_time.getHours().toString() + ':' + end_time.getMinutes().toString();

                htmlStr += '<div class="row timesheet-detail">' +
                    '<div class="col-xs-2 text-center">' + t.day + '</div>' +
                    '<div class="col-xs-2 text-center">' + start_time_str + '</div>' +
                    '<div class="col-xs-2 text-center">' + end_time_str + '</div>' +
                    '<div class="col-xs-2"></div>' +
                    '<div class="col-xs-4 text-right">' +
                    '<a href="/timesheets/' + TimesheetView.targetYearMonth + '/' + t.day + '/edit" class="btn btn-sm btn-default"><span class="glyphicon glyphicon-pencil"></span></a>' +
                    '<a href="/timesheets/' + t.id + '" data-method="delete" class="btn btn-sm btn-danger" style="margin-left: 10px;"><span class="glyphicon glyphicon-trash"></span></a>' +
                    '</div>' +
                    '</div>';
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