/**
 * Created by 10089289 on 2017/2/8.
 */
;(function ($, global) {
    function Input(defProperties) {
        this.defProperties = defProperties;
    }

    Input.prototype = {
        getDesignHtml: function(name) {
            return '<input data-comp-name="' + name + '" type="text" class="form-control">';
        },
        /**
         * 只有不能渲染的组件才需要添加该方法
         */
        /*displayHtml: function () {

        },*/

		getDesignFileContent: function() {
			var data = {};
			data["name"] = "";
			data["type"] = "";

			return data;
		},
		
        init: function(comp, properties) {
            if(properties['text']) {
                comp.attr('value', properties['text']);
            }
            if(properties['placeholder']){
                comp.attr('placeholder', properties['placeholder']);
            }
        },

        getRuntimeHtml: function($thisDom) {

        },

        dragEvent: function () {

        },

        getRuntimeCode: function(properties) {

        },
        
        eventFocusout: function (event) {
            alert(event);
        }





    }

    if(!global.appCompoent) {
        global.appCompoent = {};
    }
    global.appCompoent.Input = Input;
})
(jQuery, window);