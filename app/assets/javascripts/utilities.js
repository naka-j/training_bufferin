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
    },

    // formの入力値をJsonに変換
    serializeJson: function(form) {
        var resultJson = {};
        form.serializeArray().forEach(function (f, i) {
            resultJson[f['name']] = f['value'];
        });
        return resultJson;
    },

    commonAjaxTypeJson: function(url, method, params, successFunc, errorFunc) {
        $.ajax({
            url: url,
            type: method,
            data: params,
            dataType: 'json'
        })
            .done(function(data, status, jqXHR) {
                successFunc(data, status, jqXHR);
            })
            .fail(function(jqXHR, status, error) {
                errorFunc(jqXHR, status, error);
            })
    }
};