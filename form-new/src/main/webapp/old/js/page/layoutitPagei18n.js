function initI18NProperties(name, path, language) {
    if (name === undefined
        || name.trim().length == 0
        || path === undefined
        || path.trim().length == 0) {
        return;
    }
    if (language === undefined || language === "" || language === null) {
        language = navigator.language;
    }
    jQuery.i18n.properties({
        name: name,
        path: path,
        language: language,
        mode: 'map',
        callback: function () {
                var $i18nkeyforPH = $("[i18nkeyforph]");
                if ($i18nkeyforPH.length > 0) {
                    $.each($i18nkeyforPH, function (phIndex, phItem) {
                        var i18nStrPH;
                        if(isI18n === "true"){
                            i18nStrPH = $.i18n.prop($(phItem).attr("i18nkeyforph"));
                        }else{
                            i18nStrPH = $(phItem).attr("i18nkeyforph");
                        }

                        if (i18nStrPH.indexOf("[") === 0) {
                            i18nStrPH = i18nStrPH.substring(i18nStrPH.indexOf("[") + 1, i18nStrPH.indexOf("]"));
                        }
                        var phitemId = phItem.id;
                        if (phitemId != "") {
                            $("#" + phitemId).attr("placeholder", i18nStrPH);
                        }
                    });
                }
                var $i18nkey = $("[i18nkey]");
                $.each($i18nkey, function (index, item) {
                    var i18nStr;
                    if(isI18n === "true"){
                        i18nStr = $.i18n.prop($(item).attr("i18nkey"));
                    }else{
                        i18nStr = $(item).attr("i18nkey");
                    }

                    if (i18nStr.indexOf("[") === 0) {
                        i18nStr = i18nStr.substring(i18nStr.indexOf("[") + 1, i18nStr.indexOf("]"));
                    }

                    //var itemId = item.id;
                    var type = item.type;
                    if (type === "text" || type === "textarea") {
                        //if (itemId != "") {
                        $(item).val(i18nStr);
                        //}
                    } else if(type === "button"){
                        var child = $(item).children();
                        if (child.length > 0) {
                            $(item).html(i18nStr).prepend(child);
                        } else {
                            $(item).html(i18nStr);
                        }
                        /*if (itemId != "") {
                         var child = $("#" + itemId).children();
                         if(child.length > 0){
                         $("#" + itemId).html(i18nStr).prepend(child);
                         }else {
                         $("#" + itemId).html(i18nStr);
                         }
                         } else {
                         var child = $(item).children();
                         if(child.length > 0){
                         $(item).html(i18nStr).prepend(child);
                         }else {
                         $(item).html(i18nStr);
                         }
                         }*/
                    }else{
                        $(item).html(i18nStr);
                    }
                });
        }
    });
}