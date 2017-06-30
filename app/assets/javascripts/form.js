$(function() {
    'use strict';

    if (!$('#timesheets-new').length && !$('#timesheets-edit').length) {
        return
    }

    var FormCtrl = {
        init: function() {
            FormView.init();
        }
    };

    var FormView = {
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            $('.up-btn').on('click', this.changeTargetBoxNum.bind(this));
            $('.down-btn').on('click', this.changeTargetBoxNum.bind(this));
            $('#timesheet-submit').on('click', this.sendNotification.bind(this));
        },
        sendNotification: function () {
            App.timesheet.test("test");
        },
        // 押されたボタンによって入力値を変更
        changeTargetBoxNum: function (e) {
            var target = $(e.currentTarget).attr('target-type');
            var countType;
            if (e.currentTarget.className == 'up-btn') {
                countType = COUNT_TYPE_PLUS;
            } else if (e.currentTarget.className == 'down-btn') {
                countType = COUNT_TYPE_MINUS
            } else {
                return false;
            }

            this.updateTimeBoxVal(target, countType);
        },
        updateTimeBoxVal: function (target, countType) {
            var targetTextBox = $('.time-input-' + target);
            // 入力値が数字かどうか
            var currentVal = parseInt(targetTextBox.val());
            if (isNaN(currentVal)) {
                return false;
            }

            var nextVal = this.calculateTime(target, currentVal, countType);
            targetTextBox.val(nextVal);
        },
        calculateTime: function (target, currentVal, countType) {
            var nextVal;
            // 入力値の次の値を算出
            if (target == 'minute') {
                nextVal = this.doSimpleCalculation(currentVal, BY_MINUTE, countType);
            } else {
                nextVal = this.doSimpleCalculation(currentVal, 1, countType);
            }
            nextVal = this.fixCalculatedTime(target, nextVal, countType);

            return nextVal;
        },
        fixCalculatedTime: function (target, nextVal, countType) {
            // 計算後の値が日付として有効な場合は、修正せずにreturn（分の桁数のみ修正）
            if (this.isValidUpdatedDatetime(target, nextVal)) {
                if (target == 'minute' && nextVal == '0') {
                    nextVal = '00';
                }
                return nextVal;
            }

            // 有効でない場合は、値を修正
            var fixedVal = nextVal;
            if (countType == COUNT_TYPE_PLUS) {
                switch (target) {
                    case 'month':
                        fixedVal = '1';
                        break;
                    case 'day':
                        fixedVal = '1';
                        break;
                    case 'hour':
                        fixedVal = '0';
                        break;
                    case 'minute':
                        fixedVal = '00';
                        break;
                }
            } else if (countType == COUNT_TYPE_MINUS) {
                switch (target) {
                    case 'month':
                        fixedVal = '12';
                        break;
                    case 'day':
                        // 1日からマイナスする場合は、月末の日を算出
                        fixedVal = this.getLastDay();
                        break;
                    case 'hour':
                        fixedVal = '23';
                        break;
                    case 'minute':
                        fixedVal = (BY_MINUTE * (60 / BY_MINUTE - 1)).toString();
                        break;
                }
            }

            return fixedVal;
        },
        doSimpleCalculation: function (currentVal, diff, countType) {
            if (countType == COUNT_TYPE_PLUS) {
                return (currentVal + diff).toString();
            } else if (countType == COUNT_TYPE_MINUS) {
                return (currentVal - diff).toString();
            }
        },
        isValidUpdatedDatetime: function (target, nextVal) {
            var year = $('.time-input-year').val();
            var month = $('.time-input-month').val();
            var day = $('.time-input-day').val();
            var hour = $('.time-input-hour').val();
            var minute = $('.time-input-minute').val();
            // 変更対象の値に変更後の値をセット
            if (target == 'year') {
                year = nextVal;
            } else if (target == 'month') {
                month = nextVal;
            } else if (target == 'day') {
                day = nextVal;
            } else if (target == 'hour') {
                hour = nextVal;
            } else if (target == 'minute') {
                minute = nextVal;
            }

            if (target == 'hour' || target == 'minute') {
                return Util.isValidDateTime(year, month, day, hour, minute, 0)
            } else {
                return Util.isValidDate(year, month, day)
            }

        },
        // 入力されている月の末日を取得
        getLastDay: function () {
            var nextVal = 31;
            // 年月が数値でない場合は算出しない
            if (Util.isNumberOnly([$('.time-input-year').val(), $('.time-input-month').val()])) {
                while (!this.isValidUpdatedDatetime('day', nextVal)) {
                    nextVal = this.doSimpleCalculation(nextVal, 1, COUNT_TYPE_MINUS)
                }
            }
            return nextVal.toString();
        }
    };

    FormCtrl.init();
});