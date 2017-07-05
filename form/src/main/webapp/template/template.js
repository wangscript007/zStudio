/**
 * 模板管理
 * @constructor
 */
function TemplateManage(){
}

/**
 * 模板信息列表
 * @type {Array}
 */
TemplateManage.templates = [];

/**
 * 当前选中的模板
 */
TemplateManage.selectTemplateName ;

/**
 * 模板选择事件
 * @param templateName
 */
TemplateManage.onTemplateSelected=function(templateName){
    TemplateManage.selectTemplateName = templateName;
}

/**
 * 模板原型
 * @type {{init, getTemplate: Function, getHTML: Function, submit: Function, getTemplateParam: Function}}
 */
TemplateManage.prototype = {
    /**
     * 模板初始化时加载模板信息列表
     */
    init: (function () {
        var param=new AjaxParameter();
        param.url = "jersey-services/layoutit/frame/templates/info";
        param.callBack = function(data){
            if(data && data.status) {
                TemplateManage.templates = data.data;
            }
        }
        dsTool.getData(param);
    })(),

    /**
     * 根据模板名称获取模板
     * @param templateName
     * @returns {*}
     */
    getTemplate: function (templateName) {
        var ret ;
        if(TemplateManage.templates && TemplateManage.templates.length>0){
            $.each(TemplateManage.templates,function(index,item){
                if(item.name == templateName){
                    ret = item;
                    return false;
                }
            })
        }
        return ret;
    },

    /**
     * 获取模板列表html
     * @returns {string}
     */
    getHTML:function(){
        var html = [];
        if(TemplateManage.templates && TemplateManage.templates.length>0) {
            var total = TemplateManage.templates.length;
            $.each(TemplateManage.templates, function (index, item) {
                if(index % 4 == 0){
                    html.push("<div class=\"row\">");
                }
                html.push("<div class=\"col-xs-6 col-md-3\" style='text-align: center'>");
                html.push("<a href=\"#\" class=\"thumbnail\" onclick='TemplateManage.onTemplateSelected(\""+item.name+"\")'>");
                html.push("<img src=\"template/"+item.thumbnail+"\" alt=\""+item.description+"\">");
                html.push("<span>"+item.displayName+"</span>");
                html.push("</a></div>");
                if(index % 4 == 3 || total-1 == index){
                    html.push("</div>");
                }
            })
        }
        return html.join(" ");
    },

    /**
     * 选择模板后，提交进入下一步骤
     */
    submit:function(){
        if(!TemplateManage.selectTemplateName){
            bootbox.alert("请选择模板！");
            return;
        }

        var template = this.getTemplate(TemplateManage.selectTemplateName);
        if(template){
            var jsObject =  this.getTemplateParam(template.paramList,"jsObject");
            if(jsObject){
                FormViewTemplatesManager.setSelectedTemplate(eval("new "+jsObject+"()"));
            }

            var configURL = this.getTemplateParam(template.paramList,"configURL");
            if(configURL){
                hideModalDialog("templateConfigDialog");
                showModalDialog("relationModelConfigDialog","表单模板配置","template/"+configURL);
            }
        }
    },

    /**
     * 获取模板参数
     * @param templateParam
     * @param paramName
     * @returns {*}
     */
    getTemplateParam:function(templateParam,paramName){
        var result;
        if(paramName && templateParam){
            $.each(templateParam,function(index,item){
                if(item.key == paramName){
                    result = item.value;
                }
            })
        }
        return result;
    }
}

$(document).ready(function(){
    /**
     * 初始化模板信息列表内容
     * @type {TemplateManage}
     */
    var templateManage = new TemplateManage();
    $("#templateContainer").html(templateManage.getHTML());
    $("#btnSubmitTemplate").click(function(){
        templateManage.submit();
    })
})
