/**
 * Created by 10177027 on 2015/9/22.
 */
/**
 * 表单组件接口
 * @param componentContainer
 * @constructor
 */
function FormComponentAPI(componentContainer){
    this.componentContainer = componentContainer;
}
FormComponentAPI.componentType={
    layout:"layout",
    label:"label",
    input_text:"input_text",
    textarea:"textarea",
    select_dynamic:"select_dynamic",
    input_radio:"input_radio",
    checkbox:"checkbox",
    input_datetime:"input_datetime",
    input_fileinput:"input_fileinput",
    button:"button",
    table_base:"table_base",
    table_base_local:"table_base_local",
    modal_dialog:"modal_dialog",
    jsscript:"jsscript",
    tree:"tree",
    separator:"separator",
    iframe:"iframe",
    tab:"tab",
    collapse:"collapse",
    button_group:"button_group",
    cssscript:"cssscript",
    imgBar:"imgBar"
};
FormComponentAPI.properties={
    dataFields:"dataFields",
    defaultValue:"defaultvalue",
    class:"class"
};

FormComponentAPI.prototype = {
    getComponentObject:function(type){
        var result ;
        var componentList =this.componentContainer.find(".lyrow,.box");
        $.each(componentList,function(index,item){
            var element = $(item).find("[type="+type+"]").first();
            if(element.length > 0){
                result =$(item).clone();
                return false;
            }
        })

        return result;
    },
    /**
     * 根据输入比例获取布局器
     * @param ratio
     * @returns {*}
     */
    getLayout:function(ratio){
        var layout = this.componentContainer.find(".lyrow [type=layout][ratio=12]");
        if(layout.length > 0){
            if(ratio == "12"){
                return $.extend(true, {}, $(layout).parent().parent().clone());
            }else{
                var layoutAPI = new  LayoutAPI($(layout).parent().parent().clone());
                return layoutAPI.getLayout(ratio);
            }
        }
        return undefined;
    },
    setVMProperties:function(component,params) {
        if (!params || params.length <= 0 || !params.type) {
            console.log(params);
            return;
        }
        var compObject = $(component).find("[type=" + params.type + "]");
        $.each(params, function (index, param) {
            if (param && param != "") {
                $(compObject).attr(index, param);
            }
        })

        $(compObject).attr("id", params.compid).attr("ms-controller", params.compid);
    },
    setComponentProperties:function(compnent,params) {
        if (!params || params.length <= 0 || !params.type) {
            console.log(params);
            return;
        }
        var compObject = $(compnent).find("[type=" + params.type + "]");
        $(compObject).children().attr("id", params.compid).attr("name", params.compid);
        switch (params.type) {
            case FormComponentAPI.componentType.layout:
                this._setLayoutProperty(compnent, params);
                break;
            case FormComponentAPI.componentType.label:
                this._setLabelProperty(compnent, params);
                break;
            case FormComponentAPI.componentType.input_text:
                this._setTextBoxProperty(compnent, params)
                break;
            case FormComponentAPI.componentType.button:
                this._setButtonProperty(compnent,params);
                break;
            case FormComponentAPI.componentType.table_base_local:
                this._setLocalTableProperty(compnent,params);
                break;
        }
    },
    /**
     * 初始化组件接口
     * @param component
     */
    initComponent:function(component){
        if(!component){
            return;
        }
        var comp = $(component).find("[type]:first");
        var compid = $(comp).attr("compid");
        var type = $(comp).attr("type");
        if(compid && type && type === FormComponentAPI.componentType.table_base_local){
            initTemplateTable(compid);
        }
    },
    _bindDataFields:function(component,field) {
        if (!field || field.length != 1 || !field[0] instanceof DataColumn) {
            return;
        }
        var fieldName = field[0].getColumnName();
        $(component).attr("fieldtype", field[0].getColumnType())
            .attr("field", fieldName);
        $(component).children().attr("ms-duplex-string", fieldName);
    },
    _setLayoutProperty:function(component,params){
        var layout = $(component).find("[type="+params.type+"]");
        $.each(params,function(index,param){
           if(param && param != ""){
               $(layout).attr(index,param);
           }
        })
    },
    _setLabelProperty:function(component,params){
        var label = $(component).find(params.type);
        $.each(params,function(index,param){
            if(param && param != "") {
                if (index == FormComponentAPI.properties.defaultValue) {
                    $(label).html(param);
                } else if (index == FormComponentAPI.properties.class) {
                    $(label).parent().addClass(param);
                } else {
                    $(label).attr(index, param);
                }
            }
        })
    },
    _setTextBoxProperty:function(component,params){
        var $that = this;
        var textBox = $(component).find("[type="+params.type+"]");

        $.each(params,function(index,param){
            if(param && param != ""){
                if(index ==FormComponentAPI.properties.dataFields){
                    $that._bindDataFields(textBox,param);
                }else{
                    $(textBox).attr(index,param);
                }
            }
        })
    },
    _setButtonProperty:function(component,params){
        var $that = this;
        var button = $(component).find("[type="+params.type+"]");
        $.each(params,function(index,param){
            if(param && param != "") {
                if (index === FormComponentAPI.properties.defaultValue) {
                    $(button).children().html(param);
                } else if (index === FormComponentAPI.properties.class) {
                    $(button).addClass(param);
                } else {
                    $(button).attr(index, param);
                }
            }
        })
    },
    _setLocalTableProperty:function(component,params){
        var $that = this;
        var table = $(component).find("[type="+params.type+"]");
        $.each(params,function(index,param){
            if(param && param != "") {
                $(table).attr(index, param);
            }
        })
    },
}

/**
 * 布局器接口
 * @param componentObject
 * @constructor
 */
function LayoutAPI(componentObject){
    this.componentObject = componentObject;
}
LayoutAPI.prototype={
    validateRatioValue:function(ratio) {
        //验证返回结果
        var ret = false;
        if (ratio != undefined) {
            //用户输入比例以“,”号分隔
            var columns = ratio.split(",");
            //验证用户输入的总列数是否大于0小于12，且不能包含非数字字符。
            var totalColumns = 0;
            for (var i = 0; i < columns.length; i++) {
                totalColumns += parseInt(columns[i]);
            }
            ret = true;
            if (isNaN(totalColumns) || totalColumns < 0 || totalColumns > 12) {
                ret = false;
            }
        }
        return ret;
    },
    getLayout:function(ratio){
        if(this.validateRatioValue(ratio)) {
            var html = "";
            var columns=ratio.split(",");
            for (var i = 0; i < columns.length; i++) {
                html += "<div class=\"col-md-" + parseInt(columns[i]) +
                    " col-xs-" + parseInt(columns[i]) +
                    " col-sm-" + parseInt(columns[i]) +
                    " col-lg-" + parseInt(columns[i]) + " column\"></div>";
            }
            //调整对象布局比例
            $(this.componentObject).find(".row:first").html(html);
            $(this.componentObject).find("[type=layout]").attr("ratio",ratio);
        }
        return this.componentObject;
    }
}
