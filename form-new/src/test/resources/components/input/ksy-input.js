/**
 * Created by 10089289 on 2017/2/8.
 */
;(function ($, global) {
    function KsyInput(defProperties) {
        this.defProperties = defProperties;
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

        init: function(comp, properties) {
            if(properties['text']) {
                comp.attr('value', properties['text']);
            }
            if(properties['placeholder']){
                comp.attr('placeholder', properties['placeholder']);
            }
        },

        runtimeHtml: function($thisDom) {

        },

        dragEvent: function () {

        },

        runtimeCode: function(properties) {

        },
        
        eventFocusout: function (event) {
            alert(event);
        }





    }

    if(!global.appCompoent) {
        global.appCompoent = {};
    }
    global.appCompoent.KsyInput = KsyInput;
})
(jQuery, window);