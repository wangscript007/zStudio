/**
 * Created by 10112872 on 2016/10/20.
 */

(function($, win) {
    function _showGuideAfterDrag(pluginGroupId, pluginId) {
        var steps = window.workbench.ui.GuideManager.getSteps(pluginGroupId, pluginId);
        if (!steps) {
            return;
        }

        cranberry(steps).start();
    }

    var IPlugin = {
        setComponentWrapper : function (compWrapper) {

        },

        outputRuntimeHtmlSameAsDesign : function () {
            return true;
        },

        getRuntimeHtml : function () {
            return "";
        },

        handleForRuntimeHtml : function ($dom) {

        },

        afterHandleForRuntimeHtml : function ($dom) {

        },

        getCssClass : function () {
            return "";
        },

        getRuntimeHtml : function () {
            return "";
        },

        getRuntimeConfig : function() {
            return {}
        },

        getControlPanel : function() {
            return '<div></div>';
        },

        getDesignHtml : function () {
            return "";
        },

        getDesignFileContent : function() {
            return {};
        },

        onComponentDrawn : function() {

        },

        onControlPanelDrawn : function() {

        },

        redraw : function() {

        },

        resize : function () {

        },

        getEastTabs : function() {
            return [];
        }
    };

    /////////////

    var PluginManager = function() {
        this.pluginGroupConfigURLs = [
            "module/datavisual/plugins/layout/plugins.json",
            "module/datavisual/plugins/table/plugins.json",
            "module/datavisual/plugins/chart/plugins.json"
        ];

        this.pluginGroupConfigs = {};
        this.pluginId2PluginConfig = {};

        this.componentWrappers = [];
    };

    // private method

    /**
     * @private
     */
    PluginManager.prototype._init = function(pluginGroupCfg) {
        this.pluginGroupConfigs[pluginGroupCfg.id] = pluginGroupCfg;

        var that = this;

        // 解析每个插件的配置文件config.json
        _.forEach(pluginGroupCfg.plugins, function(basePluginConfig) {
            var url = pluginGroupCfg.baseUri + "/" + basePluginConfig.path + "/config.json";
            var pluginConfig = null;
            $.ajax({
                url: url,
                type : 'get',
                dataType : 'json',
                cache : false,
                async : false,
                contentType : 'application/json; charset=UTF-8',
                success : function(data) {
                    pluginConfig = data;
                }
            });

            // TODO 处理加载错误

            $.extend(basePluginConfig, pluginConfig);

            that.pluginId2PluginConfig[pluginConfig.id] = pluginConfig;
        });
    };

    /**
     * @private
     * 加载各个插件的js文件
     */
    PluginManager.prototype._loadPluginJS = function(afterInitCallback) {
        var jsUrls = [];

        $.each(this.pluginGroupConfigs, function (j, pluginGroupConfig) {
            if (pluginGroupConfig.guide) {
                jsUrls.push(pluginGroupConfig.baseUri + "/" + pluginGroupConfig.guide);
            }

            $.each(pluginGroupConfig.plugins, function(i, pluginConfig) {
                var jsUrl = pluginGroupConfig.baseUri + "/" + pluginConfig.path + "/" + pluginConfig.js;
                var index = jsUrl.indexOf(".js");
                if (index > -1) {
                    jsUrl = jsUrl.substring(0, index);
                }
                jsUrls.push(jsUrl);
            });
        });

        requirejs(jsUrls, function() {
            if (afterInitCallback) afterInitCallback();
        });
    };

    /**
     * @private
     * 显示插件的缩略图，并注册缩略图的点击事件
     */
    PluginManager.prototype._showThumbnail = function() {
        var that = this;
        var html = [];

        $.each(this.pluginGroupConfigs, function (j, pluginGroupConfig) {
            html.push('<div class="form-panel">');
            html.push('<div class="title">');
            html.push('<em class="glyphicon glyphicon-th-large icon1"></em>');
            html.push('<span> ' + pluginGroupConfig.name + '</span>');
            html.push('</div>');
            html.push('<div class="body">');

            $.each(pluginGroupConfig.plugins, function(index, item) {
                var thumbnailUrl = pluginGroupConfig.baseUri + "/" + item.path + "/" + item.thumbnail;

                html.push('<div class="preview" data-plugin-id="' + item.id + '" data-plugin-group-id="' + pluginGroupConfig.id + '">');
                html.push('<div class="img-left"><img src="' + thumbnailUrl + '" /></div>' + item.displayName);
                html.push('</div>');
            });

            html.push('</div>');
            html.push('</div>');
        });

        html = html.join("");
        html = $(html);

        // 注册组件缩略图的拖拽事件
        html.find(".preview").draggable({
            connectToSortable: ".droppable-component",
            helper: "clone",
            cursor: "move",
            cursorAt: {left: 5, top: 5},
            start: function (event, ui) {
                // 修改helper的width、height，避免出现placeholder同时出现在两个droppable-component中的bug
                ui.helper.removeClass("preview").css("width", 30).css("height", 30).css("overflow", "hidden").css("border", "1px solid red");
                that._addingComponent = true;
            },
            drag: function (e, t) {
                //t.helper.width(100);
            },
            stop: function (e, t) {
            }
        });

        // 注册组件分组面板的收缩展开事件
        html.find(".title").off('click').on('click', function () {
            var $this = $(this);
            $this.next().slideToggle("normal");
        });

        workbench.ui.UIManager.setComponentPanelContent(html);
    };

    /**
     * @private
     */
    PluginManager.prototype._registerSortableComponentEvent = function() {
        var that = this;

        $(".droppable-component").sortable({
            opacity: .85,
            connectWith: ".droppable-component",
            cursorAt: {left: 5, top: 5},
            cursor: "move",
            //handle: ".draggableHandle",
            placeholder: 'comp-sort-placeholder',
            forcePlaceholderSize: true,
            forceHelperSize: true,
            dropOnEmpty: true,
            //cancel:".box .column",
            start: function (event, ui) {
                ui.helper.css("width", 30).css("height", 30).css("overflow", "hidden");
                ui.placeholder.css("height", 30).css("overflow", "hidden");
            },
            stop: function (event, ui) {
                // 只有从组件区域拖拽进设计区域新增的组件项才执行添加操作
                if (that._addingComponent) {
                    var droppable = $(event.target);    //设计区域中的droppable-component html对象
                    var draggable = ui.item;    //由draggable的clone得到的dom，是左侧组件缩略图对应的html

                    var pluginId = draggable.data("plugin-id");
                    var pluginGroupId = draggable.data("plugin-group-id");

                    var compWrapper = new datavisual.ui.ComponentWrapper(pluginId);
                    compWrapper.getDesignHtml();

                    var next = ui.item.next();
                    //删除由draggable的clone得到的dom，否则会在界面上显示类似左侧组件缩略图的html
                    // remove必须放在此处，否则下面的insertBefore和appendChild时候计算容器高度时，会把ui.item的高度加上去，导致高度不正确
                    ui.item.remove();

                    if (next.length > 0) {
                        // 1、draggable被拖拽到其他的component-wrapper之前的情况下，将新建的component-wrapper插入到该component-wrapper的前面
                        compWrapper.insertBefore(next.data("component-wrapper"));
                    } else {
                        // 2、draggable被拖拽到droppable-component容器中其他所有component-wrapper的后面时，
                        // 将新建的component-wrapper插入droppable-component容器内部的末尾
                        droppable.data("component-wrapper").appendChild(compWrapper, droppable);
                    }

                    compWrapper.onComponentDrawn();

                    that._addingComponent = false;

                    that.addComponentWrapper(compWrapper);

                    _showGuideAfterDrag(pluginGroupId, pluginId);
                } else {
                    // 当设计区域内的组件被拖拽重新放置位置时的处理：
                    // 由于dom的append、remove操作等已经由sortable插件完成，所以这里只处理wrapper间的父子关系更新，已经相关
                    // 组件的resize
                    var draggable = ui.item;
                    var droppable = draggable.parent();
                    var droppableId = droppable.attr("id");
                    var fromParent = draggable.data("component-wrapper").getParentWrapper()

                    draggable.data("component-wrapper").setParentContainerId(droppableId);
                    droppable.data("component-wrapper").pushChild(draggable.data("component-wrapper"));
                    droppable.data("component-wrapper").redrawSelfAndChildren();

                    // 若是同一个布局组件内部的子组件位置变动，则不执行下面的resize，以避免同一个组件被重复的resize
                    if (fromParent != droppable.data("component-wrapper")) {
                        fromParent.resize();
                    }

                    droppable.data("component-wrapper").resize();
                    draggable.data("component-wrapper").focus();

                    //console.log("!!!! fromParent == droppable  ->  " + (fromParent == droppable.data("component-wrapper")));
                }

                datavisual.pluginManager._registerSortableComponentEvent();
            }
        });
    };

    //  public method

    PluginManager.prototype.loadPlugins = function(afterInitCallback) {
        var that = this;

        _.forEach(this.pluginGroupConfigURLs, function (url) {
            $.ajax({
                url: url,
                type : 'get',
                dataType : 'json',
                cache : false,
                async : false,
                contentType : 'application/json; charset=UTF-8',
                success : function(json) {
                    that._init(json);
                }
            });
        });

        this._loadPluginJS(afterInitCallback);
    };

    PluginManager.prototype.setActiveComponentWrapper = function (componentWrapper) {
        this.activeComponentWrapper = componentWrapper;
    };

    PluginManager.prototype.getActiveComponentWrapper = function () {
        return this.activeComponentWrapper;
    };

    PluginManager.prototype.redrawActiveComponentWrapperControlPanel = function () {
        this.activeComponentWrapper.redrawActiveComponentWrapperControlPanel();
    };

    PluginManager.prototype.redrawActiveComponentWrapper = function () {
        this.activeComponentWrapper.redrawActiveComponentWrapper();
    };

    PluginManager.prototype.redrawDesignContent = function () {
        this.rootComponentWrapper.redrawSelfAndChildren();
    };

    PluginManager.prototype.addComponentWrapper = function(compWrapper) {
        this.componentWrappers.push(compWrapper);
    };

    PluginManager.prototype.removeComponentWrapper = function(compWrapper) {
        var childWrapperId = "";
        if (typeof compWrapper == 'string') {
            childWrapperId = compWrapper;
        } else {
            childWrapperId = compWrapper.getWrapperId();
        }

        // 查找是否在componentWrappers中
        var index = -1;
        for (var i = 0; i < this.componentWrappers.length; i++) {
            if (this.componentWrappers[i].getWrapperId() == childWrapperId) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            // 移除
            this.componentWrappers.splice(index, 1);
        }

        // 移除该compWrapper所包含的children
        var childrenWrapper = compWrapper.getChildrenWrapper();
        if (childrenWrapper) {
            for (var i = 0; i < childrenWrapper.length; i++) {
                this.removeComponentWrapper(childrenWrapper[i]);
            }
        }
    };

    PluginManager.prototype.onInitFrame = function() {
        this._showThumbnail();
        //this._registerSortableComponentEvent();
    };

    PluginManager.prototype.restoreDesignView = function(data) {
        this.componentWrappers = [];
        this.rootComponentWrapper = new datavisual.ui.RootComponentWrapper($("#design-view"));

        if (data.baseId) {
            this.baseId = data.baseId;
        } else {
            this.baseId = 1;
        }

        if (data.rootComponentWrapper) {
            buildDesignView(this.rootComponentWrapper, data.rootComponentWrapper.childrenWrapper);
        }

        this._registerSortableComponentEvent();
    };

    PluginManager.prototype.closeDesignView = function() {
        // TODO 待重构
        $("#design-view").html("");
        window.workbench.ui.UIManager.setControlPanelContent();
        window.workbench.ui.UIManager.removeAllEastTab();
    };

    PluginManager.prototype.getRuntimeHtml = function() {
        this.componentWrappers.forEach(function (wrapper) {
            wrapper.switchToRuntimeHtml();
        });

        // 获取dom的html
        var html = $("#design-view").html();

        this.componentWrappers.forEach(function (wrapper) {
            wrapper.switchToDesignHtml();
        });

        return html;
    };

    PluginManager.prototype.getDesignFileContent = function() {
        var data = {};
        data["rootComponentWrapper"] = this.rootComponentWrapper.getDesignFileContent();
        data["baseId"] = this.baseId;

        return JSON.stringify(data);
    };

    PluginManager.prototype.getPluginInstanceById = function(pluginId, data) {
        var pluginConfig = this.pluginId2PluginConfig[pluginId];
        if (pluginConfig) {
            var propertiesConfig = $.extend({}, pluginConfig.properties);

            return win.datavisual.plugin[pluginConfig.instanceName](data, propertiesConfig);
        }

        // TODO 防御性编程：返回一个空行为的插件对象??
        return null;
    };

    PluginManager.prototype.newId = function() {
        this.baseId += 1;
        return "zd_" + this.baseId;
    };

    function buildDesignView(componentWrapper, childrenWrapperConfigs) {
        if (childrenWrapperConfigs == undefined || childrenWrapperConfigs == null) {
            return;
        }

        for (var i = 0; i < childrenWrapperConfigs.length; i++) {
            var childConfig = childrenWrapperConfigs[i];
            childConfig = $.extend({}, childConfig);
            // 传给ComponentWrapper的childConfig最终会传给组件的构造函数，
            // childrenWrapper属性由框架管理，这里删除其中的childrenWrapper属性，避免组件误使用
            delete childConfig.childrenWrapper;

            var childCompWrapper = new datavisual.ui.ComponentWrapper(childConfig.pluginId, childConfig);
            childCompWrapper.getDesignHtml();
            componentWrapper.appendChild(childCompWrapper, $("#" + childCompWrapper.getParentContainerId()));
            childCompWrapper.onComponentDrawn();

            datavisual.pluginManager.addComponentWrapper(childCompWrapper);

            if (childrenWrapperConfigs[i].childrenWrapper) {
                buildDesignView(childCompWrapper, childrenWrapperConfigs[i].childrenWrapper);
            }
        }
    }

    win.datavisual = win.datavisual || {};
    win.datavisual.pluginManager = win.datavisual.pluginManager || new PluginManager();
}(jQuery, window));
