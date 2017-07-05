/**
 * Created by 10089289 on 2017/2/21.
 */

;
(function ($, global) {
    'use strict';
    var alertLevel = "alert-error";

    function TipBox() {

    }
    TipBox.prototype = {
        hide: function (index) {
            $("#frmTipBox_" + index).remove();
        },

        generateID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },

        showMessage: function (message, level) {
            $('#frmTipBox').empty();
            var index = this.generateID(),
                that = this;
            if(message.length>100){
                message = message.substring(0,100) + "...";
            }
            var tipBoxHtml = '<div class="alert fade" style="word-wrap:break-word;" id="frmTipBox_' + index + '">' +
                '<button class="close" data-close="alert"></button>' +
                '<div style="display:inline;"></div>' + message
                '</div>';
            if ($(".alert.fade").length == 0) {
                $("#frmTipBox").addClass("frmTipBoxTransition");
            } else {
                $("#frmTipBox").removeClass("frmTipBoxTransition");
            }
            $("#frmTipBox").append(tipBoxHtml);

            $('#frmTipBox_' + index).find('.close').off('click').on('click', function () {
                that.hide(index);
            });

            if (!level) {
                level = tipBox.INFO;
            }
            if (level === tipBox.ERROR) {
                alertLevel = tipBox.ERROR;
            } else if (level === tipBox.INFO) {
                alertLevel = tipBox.INFO;
            }
            $("#frmTipBox_" + index).addClass(alertLevel).addClass('in', 1000).addClass("frmTipBoxTransition");
            if (level === tipBox.INFO) {
                setTimeout(function () {
                    that.hide(index);
                }, 3000);
            }
        }
    };

    $(document).ready(function(){
        if(!$('#frmTipBox')[0]) {
            $('body').append('<div id="frmTipBox" style="top: 80px;"> </div>');
        }
    });

    $(window).scroll(function () {
        $("#frmTipBox")[0].style.top = $(window).scrollTop() + 80 + "px";
    });

    global.tipBox = new TipBox();
    global.tipBox.INFO = 'info';
    global.tipBox.ERROR = 'error';

})(jQuery, window);