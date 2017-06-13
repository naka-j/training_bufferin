// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
jQuery(function() {
    var COUNT_TYPE_PLUS = 'P';
    var COUNT_TYPE_MINUS = 'M';
    var BY_MINUTE = 15;

    var Util = {
        // 数字のみか？
        isNumberOnly: function(numArray) {
            var result = true;
            $.each(numArray, function(i, num) {
                if (isNaN(parseInt(num))){
                    result = false;
                    return false;
                }
            });

            return result;
        },
        // 日付として有効か？
        isValidDate: function(year, month, day) {
            var y = parseInt(year);
            var m = parseInt(month);
            var d = parseInt(day);
            if (isNaN(y) || isNaN(m) || isNaN(d)) {
                return false;
            }
            var time = new Date(y, m - 1, d);
            return (time.getFullYear() == y && time.getMonth() == m - 1 && time.getDate() == d);
        },
        // 日時として有効か？
        isValidDateTime: function(year, month, day, hour, minute, second) {
            var y = parseInt(year);
            var m = parseInt(month);
            var d = parseInt(day);
            var h = parseInt(hour);
            var mi = parseInt(minute);
            var s = parseInt(second);
            if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h) || isNaN(mi) || isNaN(s)) {
                return false;
            }
            var time = new Date(y, m - 1, d, h, mi, second);
            return (time.getFullYear() == y && time.getMonth() == m - 1 && time.getDate() == d &&
                    time.getHours() == h && time.getMinutes() == mi && time.getSeconds() == s);
        }
    };

    var Timesheet = {
        init: function() {
            this.bindEvents();
            this.rowSlideIn();
        },
        bindEvents: function() {
            $('.up-btn').on('click', this.changeTargetBoxNum.bind(this));
            $('.down-btn').on('click', this.changeTargetBoxNum.bind(this));
        },
        rowSlideIn: function() {
            $('.timesheet-detail').each(function(i) {
                $(this).delay(25 * i).animate({left: 0}, 80);
            })
        },
        // 押されたボタンによって入力値を変更
        changeTargetBoxNum: function(e) {
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
        updateTimeBoxVal: function(target, countType) {
            var targetTextBox = $('.time-input-' + target);
            // 入力値が数字かどうか
            var currentVal = parseInt(targetTextBox.val());
            if (isNaN(currentVal)) {
                return false;
            }

            var nextVal = this.calculateTime(target, currentVal, countType);
            targetTextBox.val(nextVal);
        },
        calculateTime: function(target, currentVal, countType) {
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
        fixCalculatedTime: function(target, nextVal, countType) {
            // 計算後の値が日付として有効な場合は、修正せずにreturn（分の桁数のみ修正）
            if (this.isValidUpdatedDatetime(target, nextVal)) {
                if (target == 'minute' && nextVal == '0') {
                    nextVal = '00';
                }
                return nextVal;
            }

            // TODO: 日が30の時に2月に移動できるように
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
        doSimpleCalculation: function(currentVal, diff, countType) {
            if (countType == COUNT_TYPE_PLUS) {
                return (currentVal + diff).toString();
            } else if (countType == COUNT_TYPE_MINUS) {
                return (currentVal - diff).toString();
            }
        },
        isValidUpdatedDatetime: function(target, nextVal) {
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
        getLastDay: function() {
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

    Timesheet.init();
});