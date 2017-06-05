// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
jQuery(function() {
    var Timesheet = {
        init: function() {
          this.bindEvents();
        },
        bindEvents: function() {
          $('.up-btn').on('click', this.changeTargetBoxNum.bind(this));
          $('.down-btn').on('click', this.changeTargetBoxNum.bind(this));
        },
        // 押されたボタンによって入力値を変更
        changeTargetBoxNum: function(e) {
            var target = $(e.currentTarget).attr('target-type');
            var targetTextBox = $('.time-input-' + target);
            var currentVal = parseInt(targetTextBox.val());
            if (isNaN(currentVal)) {
                return false;
            }
            if (e.currentTarget.className == 'up-btn') {
                this.countUpTime(target, targetTextBox, currentVal);
            } else if (e.currentTarget == 'up-btn') {
                this.countDownTime(target, targetTextBox, currentVal);
            } else {
                return false;
            }
        },
        // TODO: 月日に関してうるう年とか日付の考慮
        countUpTime: function(target, targetTextBox, currentVal) {
            if (target == 'year') {
                targetTextBox.val(currentVal + 1)
            } else if (target == 'month') {
                if (targetTextBox.val() == '12') {
                    targetTextBox.val(1)
                } else {
                    targetTextBox.val(currentVal + 1)
                }
            } else if (target == 'day') {
                if (targetTextBox.val() == '31') {
                    targetTextBox.val(1)
                } else {
                    targetTextBox.val(currentVal + 1)
                }
            } else if (target == 'hour') {
                if (targetTextBox.val() == '23') {
                    targetTextBox.val(0)
                } else {
                    targetTextBox.val(currentVal + 1)
                }
            } else if (target == 'minute') {
                if (targetTextBox.val() == '00') {
                    targetTextBox.val('15')
                } else if (targetTextBox.val() == '15') {
                    targetTextBox.val('30')
                } else if (targetTextBox.val() == '30') {
                    targetTextBox.val('45')
                } else if (targetTextBox.val() == '45') {
                    targetTextBox.val('00')
                }
            }
        },
        countDownTime: function(target, targetTextBox, currentVal) {
            if (target == 'year') {
                targetTextBox.val(currentVal - 1)
            } else if (target == 'month') {
                if (targetTextBox.val() == '1') {
                    targetTextBox.val(12)
                } else {
                    targetTextBox.val(currentVal - 1)
                }
            } else if (target == 'day') {
                if (targetTextBox.val() == '1') {
                    targetTextBox.val(31)
                } else {
                    targetTextBox.val(currentVal - 1)
                }
            } else if (target == 'hour') {
                if (targetTextBox.val() == '0') {
                    targetTextBox.val(23)
                } else {
                    targetTextBox.val(currentVal - 1)
                }
            } else if (target == 'minute') {
                if (targetTextBox.val() == '15') {
                    targetTextBox.val('00')
                } else if (targetTextBox.val() == '30') {
                    targetTextBox.val('15')
                } else if (targetTextBox.val() == '45') {
                    targetTextBox.val('30')
                } else if (targetTextBox.val() == '00') {
                    targetTextBox.val('45')
                }
            }
        }
    }

    Timesheet.init();
})