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
         * 只有不能渲染的组件才需要添加该方法
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