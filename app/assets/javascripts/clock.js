jQuery(function() {
   var clockUtil = {
       // 針の角度を算出
       hourNeedleDeg: function(currentDate) {
           var currentHour = currentDate.getHours();
           var deg = 90; // 12の位置にセット
           deg += 30 * currentHour;

           return deg;
       },
       minuteNeedleDeg: function(currentDate) {
           var currentMinute = currentDate.getMinutes();
           var deg = 90; // 12の位置にセット
           deg += 6 * currentMinute;

           return deg;
       }
   };

    var Clock = {
        init: function() {
            this.bindEvents();
        },
        bindEvents: function() {
            $(document).on('ready', this.setHour.bind(this))
            $(document).on('ready', this.setMinute.bind(this))
        },
       setHour: function() {
           var currentDate = new Date();
           var newDeg = clockUtil.hourNeedleDeg(currentDate);
           $('.clock .needle.hour').css('transform', 'rotate(' + newDeg + 'deg)');

           // 分が変わる時（何秒後）に時針を再描画（スリープモード等で時針だけズレないように分針と同時に再描画する）
           setTimeout(function() {
               Clock.setHour();
           }, 1000 * (60 - currentDate.getSeconds()));
       },
        setMinute: function() {
            var currentDate = new Date();
            var newDeg = clockUtil.minuteNeedleDeg(currentDate);
            $('.clock .needle.minute').css('transform', 'rotate(' + newDeg + 'deg)');

            // 分が変わる時（何秒後）に分針を再描画
            setTimeout(function() {
                Clock.setMinute();
            }, 1000 * (60 - currentDate.getSeconds()));
        }
    };

    Clock.init();
});