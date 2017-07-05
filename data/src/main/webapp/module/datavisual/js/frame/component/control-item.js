/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var ControlItem = function(config) {
        // 维度或度量 dimension / metric
        this.ctrlType = config.ctrlType;

        // 由图表插件自定义的控制项类型，例如xAxis, yAxis, label, symbol等等
        this.ctrlItemType = config.ctrlItemType;

        /*
            字段信息，包括字段名name、数据类型type等等
            {
                name: 'xxx',
                dataType: 'int',
                displayText: 'yyy'
            }
         */
        this.field = config.field;

        /*
            其他控制信息，例如排序方式sort、聚合方式aggr
            {
                sort: 'asc',
                aggr: 'sum'
            }
         */
        this.operation = config.operation || this._getDefaultOperation();

        // 表示ctrlItem是否作用于condition类型的控制项
        this.usedAsCondition = false;
				

        if(this.ctrlItemType == "where" || this.ctrlItemType == "having"){
            this.setUsedAsCondition(true);
			
			if(!this.getOperationItem("conditionId")){
				this.setOperationItem("conditionId",_.now());		//为Condition控制项设置时间戳以便移除时可以据此区分同名控制项
			}
            
			var tempOperation = {
                "condition" : this.ctrlItemType,
                "cname" : this.field.name
            };
            this.operation = Object.assign(tempOperation , this.operation);
        }
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.entity = win.datavisual.entity || {};
    win.datavisual.entity.ControlItem = ControlItem;

    /**
     * api,
     */
    ControlItem.prototype.getDom = function() {
        if (this.dom) {
            // 组件点击切换后，下拉菜单的打开点击事件失效，需要重新绑定
            this._bindMenuClickTriggerEvent();

            return this.dom;
        }

        var ctrlItemDom = this._createCtrlItemDom();
        this.setDom(ctrlItemDom);
        this._bindMenuClickTriggerEvent();

        return this.dom;
    };

    /**
     * api,
     */
    ControlItem.prototype.setDom = function(dom) {
        this.dom = dom;

        // 绑定控制项的数据到其对应的dom上
        dom.data('ctrl-item-data', this);
    };

    /**
     * api,
     */
    ControlItem.prototype.getCtrlType = function() {
        return this.ctrlType;
    };

    /**
     * api,
     */
    ControlItem.prototype.getCtrlItemType = function() {
        return this.ctrlItemType;
    };

    /**
     * api,
     */
    ControlItem.prototype.isUsedAsCondition = function() {
        return this.usedAsCondition;
    };

    /**
     * api,
     */
    ControlItem.prototype.setUsedAsCondition = function(usedAsCondition) {
        this.usedAsCondition = usedAsCondition;
    };

    /**
     * api,
     */
    ControlItem.prototype.getField = function() {
        return this.field;
    };

    /**
     * api,
     */
    ControlItem.prototype.getFieldName = function() {
        return this.field.name;
    };

    /**
     * api,
     */
    ControlItem.prototype.getFieldDisplayText = function() {
        return this.field.displayText || this.field.name;
    };

    /**
     * api,
     */
    ControlItem.prototype.setFieldDisplayText = function(displayText) {
        this.field.displayText = displayText;
    };

	
    /**
     * api,
     */
    ControlItem.prototype.getOperation = function() {
        return this.operation;
    };

    /**
     * api,
     */
    ControlItem.prototype.setOperationItem = function(name, value) {
        this.operation = this.operation || {};
        this.operation[name] = value;
    };

    /**
     * api,
     */
    ControlItem.prototype.getOperationItem = function(name) {
        if (this.operation) {
            return this.operation[name];
        }
        return null;
    };

    /**
     * api
     */
    ControlItem.prototype.getJson = function () {
        return {
            ctrlItemType: this.getCtrlItemType(),   //"x-axis",
            ctrlType: this.getCtrlType(), //DATA_MODEL.FIELD_TYPE_METRIC,
            field: this.getField(),
            operation: this.getOperation()
        }
    };

    /**
     * api,
     */
    ControlItem.prototype.onRename = function(onRenameEndCallback) {
        this.dom.find(".drop-item-view").hide();

        var inputContainer = this.dom.find(".drop-item-input");

        var inputRename = inputContainer.find("input[type=text].drop-item-input-name");
        inputRename.val(this.getFieldDisplayText());

        this._outsideClickProxy = $.proxy(function (e) {
                var target = $(e.target);
                var inputRename = this.dom.find("input[type=text].drop-item-input-name");
                if (target.is(inputRename)) {
                    return;
                }

                this.onRenameEnd(onRenameEndCallback);
            }, this);

        this._enterKeyUpProxy = $.proxy(function (e) {
            if (e.keyCode == 13) {
                this.onRenameEnd(onRenameEndCallback);
            }
        }, this);

        // Bind global datepicker mousedown for hiding and
        $(document).on('mousedown.ctrlItem', this._outsideClickProxy);
        inputRename.on('keyup.ctrlItem', this._enterKeyUpProxy);
            // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
            //.on('click.popup-menu', '[data-toggle=dropdown]', this._outsideClickProxy)
            // and also close when focus changes to outside the picker (eg. tabbing between controls)
            //.on('focusin.popup-menu', this._outsideClickProxy);

        inputContainer.show();
        inputRename.focus();
    };

    ControlItem.prototype.outsideClick = function (e, onRenameEndCallback) {
        var target = $(e.target);
        // if the page is clicked anywhere except within the daterangerpicker/button
        // itself then call this.hide()

/*
        if (
            target.closest(target).length
        // || target.closest('.calendar-date').length
        ) return;
*/
        var inputRename = this.dom.find("input[type=text].drop-item-input-name");

        if (
            target.is(inputRename)
        // || target.closest('.calendar-date').length
        ) return;

        this.onRenameEnd();
        onRenameEndCallback(this);
    };

    ControlItem.prototype.onRenameEnd = function(onRenameEndCallback) {
        var inputContainer = this.dom.find(".drop-item-input");
        var inputRename = inputContainer.find("input[type=text].drop-item-input-name");

        $(document).off('mousedown.ctrlItem');
        inputRename.off('keyup.ctrlItem');

        var val = inputRename.val();
        if (val !== this.getFieldName()) {
            this.setFieldDisplayText(val);
        } else {
            this.setFieldDisplayText("");
        }

        this.getDom().find(".drop-item-text").text(this._getUIDisplayText());

        this.dom.find(".drop-item-view").show();
        inputContainer.hide();

        if (onRenameEndCallback) {
            onRenameEndCallback(this);
        }
    };

    ControlItem.prototype._getDefaultOperation = function () {
        if (this.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION ) {
            return {
                sort: 'none'
            };
        } else {
            return {
                sort: 'none',
                aggr: 'sum'
            };
        }
    };

    //获取控制项在设计界面中，并处于名称非编辑状态下，显示的文字信息
    ControlItem.prototype._getUIDisplayText = function() {
        var uiText = "";
        if (this.getFieldDisplayText() !== null && this.getFieldDisplayText() !== undefined && this.getFieldDisplayText() !== ""
            && this.getFieldDisplayText() != this.getFieldName()) {
            uiText = this.getFieldDisplayText() + ' (' + this.getFieldName() + ')';
        } else {
            uiText = this.getFieldName();
        }

        return uiText;
    };

    /////////////
    ControlItem.prototype._createCtrlItemDom = function() {
        var cssClass = this.getCtrlType() == DATA_MODEL.FIELD_TYPE_DIMENSION ? "drop-item-dimension" : "drop-item-metric";

        var ctrlItemHtml = [];

        ctrlItemHtml.push('<div class="drop-item ' + cssClass + '">');

        ctrlItemHtml.push('<div class="drop-item-view">');
        ctrlItemHtml.push('<span class="drop-item-text">' + this._getUIDisplayText() + '</span>');
        ctrlItemHtml.push('<span class="drop-item-menu z3-arrow"></span>');
        ctrlItemHtml.push('</div>');

        ctrlItemHtml.push('<div class="drop-item-input" style="display:none">');
        ctrlItemHtml.push('<input type="text" class="drop-item-input-name" />');
        ctrlItemHtml.push('<span class="z3-check-right"></span>');
        ctrlItemHtml.push('</div>');

        ctrlItemHtml.push('</div>');

        return $(ctrlItemHtml.join(""));
    };

    /**
     * api,
     */
    ControlItem.prototype._bindMenuClickTriggerEvent = function() {
        if (this.isUsedAsCondition()) {
            this._setConditionMenu();
        } else {
            if (this.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                this._setDimensionMenu();
            } else if(this.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC){
                this._setMetricMenu();
            }
        }
    };

    ControlItem.prototype._setDimensionMenu = function() {
        // 获取menu 的数据
        var triggerElement = this.dom.find(".drop-item-menu");
        var menuConfig = {
            ctrlItem: this,
            element: triggerElement,
            menu: [
                {
                    text: '重命名',
                    type: 'normal',
                    handler: function(ctrlItem) {
                        ctrlItem.onRename(function(ctrlItem) {
                            // 触发图表重新绘制
                            datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                            datavisual.pluginManager.redrawActiveComponentWrapper();
                        });
                    }
                },
                '-',
                {
                    text: '正序',
                    type: 'radio',
                    inputName: 'sort',
                    inputValue: 'asc',
                    handler: function(ctrlItem) {
                        ctrlItem.setOperationItem("sort", "asc");
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                },
                {
                    text: '倒序',
                    type: 'radio',
                    inputName: 'sort',
                    inputValue: 'desc',
                    handler: function(ctrlItem) {
                        ctrlItem.setOperationItem("sort", "desc");
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                },
                {
                    text: '不排序',
                    type: 'radio',
                    inputName: 'sort',
                    inputValue: 'none',
                    handler: function(ctrlItem) {
                        ctrlItem.setOperationItem("sort", "none");
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                },
                '-',
                {
                    text: '移除',
                    type: 'normal',
                    handler: function(ctrlItem) {
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemRemoved(ctrlItem);
                        // 从界面中移除对应的dom元素
                        ctrlItem.getDom().remove();

                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                }
            ]
        };

        triggerElement.on("click", function() {
            PopupMenu.showMenu(menuConfig);
        });
    };

    ControlItem.prototype._setMetricMenu = function() {
        // 获取menu 的数据
        var triggerElement = this.dom.find(".drop-item-menu");
        var menuConfig = {
            ctrlItem: this,
            element: triggerElement,
            menu: [
                {
                    text: '重命名',
                    type: 'normal',
                    handler: function(ctrlItem) {
                        ctrlItem.onRename(function(ctrlItem) {
                            // 触发图表重新绘制
                            datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                            datavisual.pluginManager.redrawActiveComponentWrapper();
                        });
                    }
                },
                '-',
                {
                    text: '正序',
                    type: 'radio',
                    inputName: 'sort',
                    inputValue: 'asc',
                    handler: function(ctrlItem) {
                        ctrlItem.setOperationItem("sort", "asc");
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                },
                {
                    text: '倒序',
                    type: 'radio',
                    inputName: 'sort',
                    inputValue: 'desc',
                    handler: function(ctrlItem) {
                        ctrlItem.setOperationItem("sort", "desc");
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                },
                {
                    text: '不排序',
                    type: 'radio',
                    inputName: 'sort',
                    inputValue: 'none',
                    handler: function(ctrlItem) {
                        ctrlItem.setOperationItem("sort", "none");
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                },
                '-',
                {
                    text: '聚合度量',
                    type: 'normal',
                    menu: [
                        {
                            text: '不聚合 (所有度量)',
                            type: 'radio',
                            inputName: 'aggr',
                            inputValue: 'none',
                            handler: function(ctrlItem) {
                                ctrlItem.setOperationItem("aggr", "none");
                                //灰化having条件筛选框
                                bootbox.alert("度量设置为不聚合时会移除其他度量的聚合方法，且分组后过滤条件失效。");

                                // 触发图表重新绘制
                                datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                                datavisual.pluginManager.redrawActiveComponentWrapper();
                            }
                        },
                        '-',
                        {
                            text: '汇总',
                            type: 'radio',
                            inputName: 'aggr',
                            inputValue: 'sum',
                            handler: function(ctrlItem) {
                                ctrlItem.setOperationItem("aggr", "sum");
                                //datavisual.pluginManager.getActiveComponentWrapper().getComponent().havingEnable = true;
                                // 触发图表重新绘制
                                datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                                datavisual.pluginManager.redrawActiveComponentWrapper();
                            }
                        },
                        {
                            text: '平均值',
                            type: 'radio',
                            inputName: 'aggr',
                            inputValue: 'avg',
                            handler: function(ctrlItem) {
                                ctrlItem.setOperationItem("aggr", "avg");
                                // 触发图表重新绘制
                                datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                                datavisual.pluginManager.redrawActiveComponentWrapper();
                            }
                        },
                        {
                            text: '计数',
                            type: 'radio',
                            inputName: 'aggr',
                            inputValue: 'count',
                            handler: function(ctrlItem) {
                                ctrlItem.setOperationItem("aggr", "count");
                                // 触发图表重新绘制
                                datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemUpdated(ctrlItem);
                                datavisual.pluginManager.redrawActiveComponentWrapper();
                            }
                        }
                    ]
                },
                '-',
                {
                    text: '移除',
                    type: 'normal',
                    handler: function(ctrlItem) {
                        // 触发图表重新绘制
                        datavisual.pluginManager.getActiveComponentWrapper().getComponent().onControlItemRemoved(ctrlItem);
                        // 从界面中移除对应的dom元素
                        ctrlItem.getDom().remove();

                        datavisual.pluginManager.redrawActiveComponentWrapper();
                    }
                }
            ]
        };

        triggerElement.on("click", function() {
            PopupMenu.showMenu(menuConfig);
        });
    };

    ControlItem.prototype._setConditionMenu = function() {
        // 根据触发器点击事件获取过滤条件面板
        var triggerElement = this.dom.find(".drop-item-menu");
        var that = this;
        triggerElement.on("click", function() {
            ConditionPanel.showPanel(this.parentElement,that);
        });

    };

}(jQuery, window));