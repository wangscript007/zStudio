/**
 * Created by 10089289 on 2017/2/8.
 */
;(function ($, global) {
    function KsyLayout12(defProperties) {
        this.defProperties = defProperties;
    }

    KsyLayout12.prototype = {
        getDesignHtml: function(name) {
            return '<div class="bc-white" data-comp-name="'+name+'" >'+
				        '<div class="row">'+
				            '<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column"></div>'+
				        '</div>'+
				    '</div>';
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
    global.appCompoent.KsyLayout12 = KsyLayout12;
})
(jQuery, window);