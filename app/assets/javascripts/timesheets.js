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
            Util.commonAjaxTypeJson(requestURL, 'GET', {}, successFunc, errorFunc);
        },
        deleteItem: function(params, successFunc, errorFunc) {
            var requestURL = API_BASE_URL + '/timesheets/' + params.id;
            Util.commonAjaxTypeJson(requestURL, 'DELETE', {}, successFunc, errorFunc);
        }
    };

    var TimesheetCtrl = {
        getTimesheets: function (params, successFunc, errorFunc) {
            return TimesheetModel.getAll(params, successFunc, errorFunc);
        },
        deleteItem: function (params, successFunc, errorFunc) {
            return TimesheetModel.deleteItem(params, successFunc, errorFunc)
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
            this.loadList();
        },
        bindEvents: function () {
            $('.timesheet-delete').on('click', this.deleteTimesheetItem.bind(this));
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
            // ロード後にイベントバインド
            TimesheetView.bindEvents();
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
        },
        deleteTimesheetItem: function(e) {
            this.deleteTargetRow = $(e.currentTarget).closest('.timesheet-detail');
            var params = {
                id: $(e.currentTarget).attr('data-item-id')
            };
            TimesheetCtrl.deleteItem(params, TimesheetView.itemDeleted, TimesheetView.errorItemDelete);
        },
        itemDeleted: function(data, status, jqXHR) {
            TimesheetView.deleteTargetRow.animate({height: 0}, 200, function() {
                this.remove();
            })
        },
        errorItemDelete: function(jqXHR, status, error) {
            alert('deleted error');
        }
    };

    TimesheetCtrl.init();

});