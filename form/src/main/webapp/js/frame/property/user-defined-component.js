/**
 * Created by 10177027 on 2016/3/17.
 * 用户自定义组件 保存、加载
 */

function UserDefinedComponent() {
    /**
     * 用户组件容器
     * @type {*|jQuery|HTMLElement}
     */
    this.componentContainer = $("#user-defined-component-container");
    /**
     * 用户组件模板
     * @type {*|jQuery|HTMLElement}
     */
    this.componentTemplate = $("#user-defined-component-container").children(":first");
}
/**
 * 用户自定义组件集合
 */
UserDefinedComponent.DataList = (function($){
    var result = new Map();
    $.ajax({
        async: false,
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=UTF-8',
        url: "jersey-services/layoutit/frame/files/info",
        success: function (data, textStatus) {
            $.each(data.rows, function (index, item) {
                if (item.componentName) {
                    result.put(item.componentName, item.fullInfo);
                }
            });
        }
    });

    return result;
})(jQuery);

UserDefinedComponent.prototype = {
    /**
     * 设计页面初始化时执行
     */
    init:function() {
        //流程平台不需要自定义组件
        if(getUrlParam(designFormGrolbalObject.commonconst.processid, window.location.search)) {
            return;
        }

        var totalComponents = UserDefinedComponent.DataList.keySet().length;
        for (var i = 0; i < totalComponents; i++) {
            var item = UserDefinedComponent.DataList.keySet()[i];
            this.addComponentToContainer(item, UserDefinedComponent.DataList.get(item));
        }
        if(totalComponents > 0) {
            this.componentContainer.parent().css('display', '');
        }
    },
    /**
     * 添加新组件到面板
     * @param componentName
     * @param framePath
     */
    addComponentToContainer:function(componentName,framePath) {
        if(this.isComponentExist(componentName)){
            return;
        }

        var myComponent = this.componentTemplate.clone();
        $(myComponent).css("display","block");
        $(myComponent).find(".preview").html('<div class="img-left"><img src="img/frame/icon/custom.png" /></div>' + componentName);
        $(myComponent).find("div[type]").attr("framePath", framePath);

        this.componentContainer.append(myComponent);
        this.componentContainer.parent().css('display', '');
    },
    /**
     * 设计文件名称修改后更新组件
     * @param componentName
     * @param framePath
     */
    refreshComponent:function(componentName,framePath){
        $(this.componentContainer).find(".preview").each(function (index, item) {
            var cname = $(item).html();
            if (cname === componentName) {
                $(item).parent().find("div[type=user_defined_component]").attr("framePath", framePath);
            }
        })
    },
    /**
     *根据组件名称判断组件是否已经存在
     * @param componentName
     * @returns {boolean}
     */
    isComponentExist:function(componentName) {
        var ret = false;
        $(this.componentContainer).find(".preview").each(function (index, item) {
            var cname = $(item).html();
            if (cname === componentName) {
                ret = true;
                return false;
            }
        })

        return ret;
    },
    /**
     * 从组件面板中删除组件
     * @param componentName
     */
    deleteComponentFromContainer:function(framePath) {
        var deletedComponent;
        $(this.componentContainer).find("[type=user_defined_component][framepath='" + framePath + "']").each(function (index, item) {
            deletedComponent = $(item).parent().parent();
        })

        $(deletedComponent).remove();
    }
}



/**
 * 用户自定义组件实例管理
 *
 * @param currentObject
 * @constructor
 */
function UserDefinedComponentInst(currentObject){
    this.currentObject = currentObject;
    this.framePath = $(currentObject).attr("framePath");
    this.footerContainer = $("#container_data>.footer-bg");
    this.rootContainer = $(".container");
}

UserDefinedComponentInst.prototype = {
    /**
     * 加载组件html
     * @param framePath
     */
    _loadComponentHTML: function () {
        var that = this;
        $.ajax({
            async: false,
            cache: false,
            type: 'GET',
            contentType: 'application/json; charset=UTF-8',
            url: "jersey-services/layoutit/frame/html/get/" + this.framePath + "/",
            success: function (data, textStatus) {
                if (data && data.data) {
                    var footerComponents = $(that.currentObject).append(data.data).find(".footer-bg").children().clone();
                    $.each(footerComponents, function (index, fc) {
                        if ($(that.footerContainer).children(fc).size() > 0) {
                            return;
                        }
                        $(that.footerContainer).append(fc);
                    })

                    var components = $(that.currentObject).empty().append(data.data).find(".demo>.lyrow>.view>div").children().clone();
                    $(that.currentObject).empty().attr("type", "layout").append(components);
                }
            }
        });
    },
    /**
     * 清理组件中的多余信息
     * @param currentObject
     * @private
     */
    _cleanComponentHTML: function () {
        $(this.currentObject).find("[ms-duplex]").removeAttr("ms-duplex");
        $(this.currentObject).find("[ms-duplex-number]").removeAttr("ms-duplex-number");
        $(this.currentObject).find("[ms-duplex-string]").removeAttr("ms-duplex-string");
        $(this.currentObject).find("[field]").removeAttr("field");
        $(this.currentObject).find("[fieldtype]").removeAttr("fieldtype");
    },
    /**
     * 修改组件ID，解决在同一个页面组件多次引用时ID重复问题。
     * @private
     */
    _changeComponentId:function() {
        var that = this;
        $(this.currentObject).find("[id]").each(function (index, item) {
            if (!that._isComponentsExist(item)) {
                return;
            }

            var container = $(item).parent();
            if (container) {
                var id = $(container).attr("type") + getCurrentTime() + index;
                $(container).attr("compid", id).attr("compname", id);
                $(item).attr("id", id).attr("name", id);
            }
        })
    },
    _initComponents:function(){
        this.currentObject.trigger("click");
        initFrame();
    },
    /**
     * 判断组件是否存在
     * @param component
     * @private
     */
    _isComponentsExist:function(component) {
        var ret = false;
        if ($(this.rootContainer).find("[id=" + component.id + "]").size() > 1) {
            ret = true;
        }

        return ret;
    },
    /**
     * 组件拉到设计区后，更新组件HTML
     * @param currentObject
     */
    updateComponentHTML: function () {
        this._loadComponentHTML();
        this._cleanComponentHTML();
        this._changeComponentId();
        this._initComponents();
    }
}

