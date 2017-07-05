/**
 * Created by 10089289 on 2017/2/8.
 */
;(function ($, global) {
    function InputR(defProperties) {
        this.defProperties = defProperties;
    }

    InputR.prototype = {
        init: function(comp, properties) {
            if(properties['text']) {
                comp.attr('value', properties['text']);
            }
            if(properties['placeholder']){
                comp.attr('placeholder', properties['placeholder']);
            }
        }
    }

    if(!global.appCompoent) {
        global.appCompoent = {};
    }
    global.appCompoent.InputR = InputR;
})
(jQuery, window);