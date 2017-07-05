(function(a) {

    a.fn.ictWizard = function() {
        var e = a(this);
        // innitialize  Wizard
        e.bootstrapWizard({
            'nextSelector': '.button-next',
            'previousSelector': '.button-previous',
            'lastSelector': '.button-last',
            'firstSelector': '.button-first',

            onInit:function(tab, navigation, index, clickedIndex){
                handleTitle(e,tab, navigation, index);
            },
            onTabClick:function(tab, navigation, index, clickedIndex){
                var f = a.Event("onTabClick");
                e.trigger(f,[tab, navigation, index, clickedIndex]);

                if(f.isDefaultPrevented()){
                    return false;
                }
                handleTitle(e,tab, navigation, clickedIndex);
            },
            onNext:function(tab, navigation, index, clickedIndex){
                var f = a.Event("onNext");
                e.trigger(f,[tab, navigation, index, clickedIndex]);

                if(f.isDefaultPrevented()){
                    return false;
                }
                handleTitle(e,tab, navigation, index);
            },
            onPrevious:function(tab, navigation, index, clickedIndex){
                var f = a.Event("onPrevious");
                e.trigger(f,[tab, navigation, index, clickedIndex]);

                if(f.isDefaultPrevented()){
                    return false;
                }

                handleTitle(e,tab, navigation, index);
            },
            onFirst:function(tab, navigation, index, clickedIndex){
                var f = a.Event("onFirst");
                e.trigger(f,[tab, navigation, index, clickedIndex]);

                if(f.isDefaultPrevented()){
                    return false;
                }

                handleTitle(e,tab, navigation, index);
            },
            onLast:function(tab, navigation, index, clickedIndex){
                var f = a.Event("onLast");
                e.trigger(f,[tab, navigation, index, clickedIndex]);

                if(f.isDefaultPrevented()){
                    return false;
                }

                handleTitle(e,tab, navigation, index);

            }
        });
        return this;
    }
})(window.jQuery);

function handleTitle(wizardBody,tab, navigation, index) {
    var total = navigation.find('li:visible').length;
    var current = index + 1;

    // set done steps
    jQuery('li', wizardBody).removeClass("done");
    var li_list = navigation.find('li');
    for (var i = 0; i < index; i++) {
        jQuery(li_list[i]).addClass("done");
    }

    if (current == 1) {
        wizardBody.find('.button-previous,.button-first').hide();
    } else {
        wizardBody.find('.button-previous').show();
    }

    if (current >= total) {
        wizardBody.find('.button-next').hide();
        wizardBody.find('.button-last').hide();
    } else {
        wizardBody.find('.button-next').show();
    }

    var $percent = (current / total) * 100;
    wizardBody.find('.progress-bar').css({
        width: $percent + '%'
    });
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}

    var wizardObj = $('#vm1481509074971').ictWizard();

    //初始化当前是第几步
    // wizardObj.find("a[href*='tab2']").trigger('click');

    wizardObj.on('onTabClick', function(e,info) {
        dataModelDesigner.isClick = true;
        var clickedIndex = arguments[4];
        dataModelDesignerLogic.onTabClick(e,clickedIndex, dataModelDesigner.currentIndex);
    });
});


