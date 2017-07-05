/**
 * 界面组件模型
 * @constructor
 */
function FormViewComponent() {
    this.properties = {
        type: "",
        compid: "",
        compname: "",
        dataFields: [],
        ratio:"12"
    };
    this.childComponents = [];
    this.display = true;
}
FormViewComponent.prototype = {
    getType:function(){
        return this.properties.type;
    },
    getRatio:function(){
        return this.properties.ratio;
    },
    setProperties:function(params){
        if(params){
            $.extend(true,this.properties,params);
        }
    },
    getProperties:function(){
         return this.properties;
    },
    addChildComponents:function(formViewComponent){
        if(formViewComponent instanceof FormViewComponent){
            this.childComponents.push(formViewComponent);
        }else{
            console.log("参数类型错误！");
        }
    },
    getChildComponents:function(){
        return this.childComponents;
    },
    hasChildComponents:function(){
        if(this.childComponents && this.childComponents.length>0){
            return true;
        }
        return false;
    }
}


/**
 * 表单组件接口
 * @constructor
 */
function IFormViewTemplate(){
    this.components;
}

IFormViewTemplate.prototype = {
    getComponentType:function(){
        return FormComponentAPI.componentType;
    },
    getFormViewComponents : function(){
        return this.components;
    },
    setFormViewComponents : function(formViewComponent){
        if(formViewComponent instanceof FormViewComponent){
            if(!this.components){
                this.components = [];
            }
            this.components.push(formViewComponent);
        }else{
            console.log(formViewComponent);
        }
    },
    validate : function(){
        return true;
    }
}


/**
 * 模板实例管理
 * @constructor
 */
var FormViewTemplatesManager = {};
/**
 * 当前选中的模板
 */
FormViewTemplatesManager.selectedTemplate = null;
/**
 * 获取当前选中的模板
 * @returns {null|IFormViewTemplate|*}
 */
FormViewTemplatesManager.getSelectedTemplate = function(){
    return FormViewTemplatesManager.selectedTemplate;
}
/**
 * 设置当前选中的模板
 * @param template
 */
FormViewTemplatesManager.setSelectedTemplate = function(template){
    if(template instanceof IFormViewTemplate){
        FormViewTemplatesManager.selectedTemplate = template;
    }else{
        console.log("参数格式错误！");
    }
}
/**
 * 获取模板组件
 * @returns {*}
 */
FormViewTemplatesManager.getFormViewComponents = function(){
    if(FormViewTemplatesManager.selectedTemplate ){
        return FormViewTemplatesManager.selectedTemplate.getFormViewComponents();
    }else{
        return [];
    }
}
/**
 * 验证模板
 * @returns {*}
 */
FormViewTemplatesManager.validateTemplate = function(){
    if(FormViewTemplatesManager.selectedTemplate ){
        return FormViewTemplatesManager.selectedTemplate.validate();
    }else{
        return false;
    }
}
/**
 * 生成模板
 */
FormViewTemplatesManager.generate = function(){
    if(FormViewTemplatesManager.validateTemplate()) {
        var generateTemplate = new FormTemplateGenerator();
        generateTemplate.generate(FormViewTemplatesManager.getFormViewComponents());
    }
}


/**
 * 表单模板生成器
 * @param formViewModels
 * @param container
 * @constructor
 */
function FormTemplateGenerator(){
    this.formContainer = $(".demo");
    this.compAPI = new FormComponentAPI($(".form-layout-west"));
}
FormTemplateGenerator.prototype = {
    generate:function(components) {
        this._getVMComponents(this.formContainer,components);
    },
    _getVMComponents:function(container,components){
        if(!components || components.length <= 0){
            return;
        }
        var $that = this;
        var compObjects = [];
        var childComponents = [];

        $.each(components,function(index,item){
            var compObject;
            if(item.getType() == FormComponentAPI.componentType.layout){
                var compObject = $that.compAPI.getLayout(item.getRatio());
                compObjects.push(compObject);
                if(item.hasChildComponents()){
                    childComponents.push({container:compObject,children:item.getChildComponents()});
                }
            }else{
                compObject = $that.compAPI.getComponentObject(item.getType());
                compObjects.push(compObject);
            }
            /**
             * 配置组件属性
             */
            if($(container).hasClass("demo")) {
                $that.compAPI.setVMProperties(compObject, item.getProperties());
            }else{
                $that.compAPI.setComponentProperties(compObject, item.getProperties());
            }
        });

        if(compObjects.length > 0 && container){
            if($(container).hasClass("demo")){
                container.append(compObjects);
            }else {
                var columns = container.find(".column");
                var lastColumn ;
                $.each(columns, function (index, column) {
                    var compObject = compObjects.shift();
                    $(column).append(compObject);
                    $that.compAPI.initComponent(compObject);
                    lastColumn = column;
                })

                if (compObjects.length > 0) {
                    for (var i = 0; i < compObjects.length; i++) {
                        $(lastColumn).append(compObjects[i]);
                        $that.compAPI.initComponent(compObjects[i]);
                    }
                }
            }
        }

        if(childComponents.length>0){
            $.each(childComponents,function(index,item){
                $that._getVMComponents(item.container,item.children);
            })
        }
    }
}


function testFormViewModelView(){
    // var test = new FormViewModel();
    //FormViewModel.view.sort = 1;

    var fc1 = new FormViewComponent();
    fc1.setId("1");

    var fc2 = new FormViewComponent();
    fc2.setId("12");
    fc2.setFormViewComponentProperty(new FormViewComponentProperty());
    console.log(fc2.getFormViewComponentProperty());

    var fc3 = new FormViewComponent();
    fc3.setId("123");

    fc2.addChildComponents(fc3);
    fc1.addChildComponents(fc2);

    formViewLayout(fc1);
}

function formViewLayout(fc){
    console.log(fc.id);
    if(fc.hasChildComponents()){
        $.each(fc.getChildComponents(),function(index,item){
            formViewLayout(item);
        })
    }
}






