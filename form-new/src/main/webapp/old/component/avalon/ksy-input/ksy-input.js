/**
 * Created by 10089289 on 2017/2/8.
 */
;(function ($, global) {
    function KsyInput() {
        this.children = new Map();
    }

    KsyInput.prototype = {
        html: function() {
            return '<input type="text" class="form-control">';
        },
        /**
         * ֻ�в�����Ⱦ���������Ҫ��Ӹ÷���
         */
        /*displayHtml: function () {

        },*/

        init: function(properties) {

        },

        runtimeHtml: function($thisDom) {

        },

        runtimeCode: function(properties) {

        },
        
        eventFocusout: function (event) {
            
        }





    }


    global.appCompoent ? global.appCompoent : {};
    global.appCompoent.KsyInput = KsyInput;
})
(jQuery, window);