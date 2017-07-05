//改变开关组件的大小
;
(function ($, win) {
    win.changeSwitchSize = function (e, component) {
        _common("data-switchsize",$(e.target).val(),component);

    }
    //默认值筛选
    win._defaultSwitchVal = function(value,component){
        if(value === "On"){
            component.find("input").bootstrapSwitch("state",true);
        }else{
            component.find("input").bootstrapSwitch("state",false);

        }
    }
    //公共抽取
    win._common = function(property,value,component){
        var id = component.attr("compid");
        var file = "<input id=\"" + id + "_0\" type=\"checkbox\" display=\"none\" checked/>";
        $(component).empty();
        $(component).append(file);
        component.attr(property,value);
        $(component).initializtionSwitch('init');
    }
    //默认值设置
    win.changeSwitchDefaultVal = function (e, component) {
        _common("data-defaultvalue",$(e.target).val(),component);

    }
//设置绑定字段属性值方法
    win._bindSwitchValue = function(component){
        $(component).find("input").on('switchChange.bootstrapSwitch', function(event, state) {
            var field = component.attr("field");
            var avalonctrl = eval($(component).parents("[avalonctrl]").attr("avalonctrl"));
            var value = avalonctrl[field];
            if(state === true){
                avalonctrl[field] = 1;
            }else{
                avalonctrl[field] = 0;
            }

        })
    }
//颜色筛选
    win.colorSwitchDecide = function(value,component){
        if (value == "primary") {
            component.find("input").bootstrapSwitch("onColor","primary");
            component.find("input").bootstrapSwitch("offColor","info");
        } else if (value == "info") {
            component.find("input").bootstrapSwitch("onColor","info");
            component.find("input").bootstrapSwitch("offColor","success");
        } else if (value == "success") {
            component.find("input").bootstrapSwitch("onColor","success");
            component.find("input").bootstrapSwitch("offColor","warning");

        } else if (value == "warning") {
            component.find("input").bootstrapSwitch("onColor","warning");
            component.find("input").bootstrapSwitch("offColor","danger");

        } else {
            component.find("input").bootstrapSwitch("onColor","danger");
            component.find("input").bootstrapSwitch("offColor","primary");

        }

    }
//改变开关组件的颜色
    win.changeSwitchColor = function (e, component) {
        _common("data-switchcolor",$(e.target).val(),component);

    }
//初始化开关组件
    win.initialize = function (id) {
        if (typeof(id) !== "undefined" && id.indexOf("m_switch") > -1) {
            var checkId = id + "_0";
            $("[id=" + checkId + "]").bootstrapSwitch();
        }
    }

//保存开关控件
    $.switchCleanData = function () {
        $.each($(".demo").find("div[type='m_switch']"), function (index, value) {
            var id = $(value).attr("compid");
            var file = "<input id=\"" + id + "_0\" type=\"checkbox\" display=\"none\" checked/>";
            $(value).empty();
            $(value).append(file);
        });
    };
    $.switchRestoreData = function () {
        $.each($(".demo").find("div[type='m_switch']"), function (index, value) {
            $(value).initializtionSwitch('init');
        });
    };

    $.fn.initializtionSwitch = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
            var $this = $(this),
                data = $this.data('initializtion.switch'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (option === 'init') {
                    new InitializtionSwitch(this, false);
                    return;
                }
                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('initializtion.switch');
                }
            }

            if (!data) {
                $this.data('initializtion.switch', (data = new InitializtionSwitch(this, true)));
            }
            if (data.size == undefined || data.color == undefined) {
                return;
            }
        });
        return typeof value === 'undefined' ? this : value;
    };

    var InitializtionSwitch = function(currentComponent, isfromCache) {
        this.currentComponent = $(currentComponent);
        this.initUI(isfromCache);
    }

    InitializtionSwitch.prototype.initUI = function (isfromCache) {

        var size,
            color = this.currentComponent.attr('data-switchcolor'),
            defaultval = this.currentComponent.attr('data-defaultvalue');
        //判断缓存中是否有对应属性值，若有则用attr，若没有则用data取值-开始
        if(isfromCache) {
            size = this.currentComponent.data('switchsize');
            color = this.currentComponent.data('switchcolor');
            defaultval = this.currentComponent.data('defaultvalue');
        }
        else {
            size = this.currentComponent.attr('data-switchsize');
            color = this.currentComponent.attr('data-switchcolor');
            defaultval = this.currentComponent.attr('data-defaultvalue');
        }
        //结束
        if (size == undefined || color == undefined) {
            return;
        };
        this.currentComponent.children().bootstrapSwitch("size", size);
        win._defaultSwitchVal(defaultval,this.currentComponent);
        colorSwitchDecide(color, this.currentComponent);
        _bindSwitchValue(this.currentComponent);
        var eventStr = this.currentComponent.attr("switch-event"),
            change,
            id,
            data = win.deepClone(this.data),
            events;
        if(eventStr && eventStr.length > 0) {
            change = decodeURIComponent(eventStr);
            events = JSON.parse(change).events;
            id = JSON.parse(change).id;
        }

        $('#'+id+'_0').on('switchChange.bootstrapSwitch', function(event, state) {
            if(events !== undefined && events.length > 0) {
                $.each(events, function (index, event) {
                    var jscode = event.substring(event.indexOf('value=')+6);
                    if(jscode != undefined) {
                        eval(jscode);
                    }
                });
            }
        });
    }

    //利用字段值对控件初始化
    InitializtionSwitch.prototype.setSwitchValue = function(component){
        var component = this.currentComponent;
        var avalonObj = eval(component.parents("[avalonctrl]").attr("avalonctrl"));
        var defaultval = component.attr('data-defaultvalue')
        if(avalonObj === undefined){
            win._defaultSwitchVal(defaultval,component);
        }else{
            var fieldVal = component.attr("field");
            var bindVal = avalonObj[fieldVal];
            if(bindVal !== undefined && bindVal !== ""){
                if(bindVal === false || bindVal=== 0){
                    component.find("input").bootstrapSwitch("state",false);
                }else{
                    component.find("input").bootstrapSwitch("state",true);
                }
            }
        }
        //判断可编辑性代码-开始
        if(typeof win.getEditorItem !== 'undefined' && viewoperator) {
            var items = win.getEditorItem();
            var fieldEdit = this.currentComponent.attr("field") + '_form_disabled';
            for(var i = 0;i<items.length;i++){
                if(items[i].field == fieldEdit){
                    var editable = items[i].editable;
                    var addval = editable.add;
                    var viewval = editable.view;
                    var modifyval = editable.modify;
                    if(viewoperator === "add" && addval === "" ){
                        this.currentComponent.find("input").bootstrapSwitch("disabled",true)
                    }else if(viewoperator === "view" && viewval === "" ){
                        this.currentComponent.find("input").bootstrapSwitch("disabled",true)
                    }else if(viewoperator === "edit" && modifyval === "" ){
                        this.currentComponent.find("input").bootstrapSwitch("disabled",true)
                    }
                }

            }
        }
        //结束
    }

//默认初始化
    $(function () {
        $('div[type="m_switch"]').initializtionSwitch();
    });

})(jQuery, window);