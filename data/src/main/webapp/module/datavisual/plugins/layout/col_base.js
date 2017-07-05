/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {

    /**
     * @constructor
     */
    var ColBase = function() {
    };

    ColBase.prototype._getInnerContainerJson = function (ratio) {
        ratio = ratio.split(',');

        var innerContainers = [];
        for (var i = 0; i < ratio.length; i++) {
            var colRatio = parseInt(_.trim(ratio[i]));

            innerContainers.push({
                id : datavisual.pluginManager.newId(),
                ratio: colRatio
            })
        }

        return innerContainers;
    };

    ColBase.prototype.setComponentWrapper = function (compWrapper) {
        this.compWrapper = compWrapper;
    };

    ColBase.prototype.outputRuntimeHtmlSameAsDesign = function () {
        return true;
    };

    ColBase.prototype.handleForRuntimeHtml = function ($dom) {
        //this._oldMaxColHeight =
        var that = this;
        that._oldMaxColHeight = 30;
        $dom.children().each(function () {
            var minHeight = parseInt($(this).css("min-height"));
            that._oldMaxColHeight = Math.max(minHeight, that._oldMaxColHeight);

            $(this).css("min-height", "");
        });
    };

    ColBase.prototype.afterHandleForRuntimeHtml = function ($dom) {
        var that = this;
        $dom.children().each(function () {
            $(this).css("min-height", that._oldMaxColHeight);
        });
    };

    /**
     * api
     */
    ColBase.prototype.getRuntimeConfig = function() {
        return {};
    };

    /**
     * api
     */
    ColBase.prototype.getControlPanel = function() {
        return '';
    };

    ColBase.prototype.getDesignHtml = function () {
        if (this.jqueryWrapper) {
            return this.jqueryWrapper;
        }

        var html = [];
        html.push('<div class="row clearfix">');
        for (var i = 0; i < this.config.innerContainers.length; i++) {
            var ic = this.config.innerContainers[i];
            html.push(this._createInnerContainerHtml(ic.id, ic.ratio));
        }
        html.push('</div>');

        this.jqueryWrapper = $(html.join(""));
        this.jqueryWrapper.find(".droppable-component").data("component-wrapper", this.compWrapper);

        return this.jqueryWrapper;
    };

    ColBase.prototype._createInnerContainerHtml = function (id, ratio) {
        return '<div id="' + id + '" class="' + this._createInnerContainerHtmlClass(ratio) + '"></div>';
    };

    ColBase.prototype._createInnerContainerHtmlClass = function (ratio) {
        return 'col-md-' + ratio +
            ' col-xs-' + ratio +
            ' col-sm-' + ratio +
            ' col-lg-' + ratio +
            ' column droppable-component';
    };

    /**
     * api
     */
    ColBase.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = this._getPluginID();;
        data["properties"] = this._getProperties();
        data["innerContainers"] = this.config.innerContainers;

        return data;
    };

    ColBase.prototype.onComponentDrawn = function () {
		
    };

    /**
     * api
     */
    ColBase.prototype.onControlPanelDrawn = function() {

    };

    ColBase.prototype.redraw = function() {
        //this.resize();
    };

    ColBase.prototype.resize = function() {
        var maxHeight = 0;
        var padNMargin = 0;
        this.jqueryWrapper.children().each(function () {
            var colHeight = 0;
            $(this).children().each(function () {
                var height = $(this).outerHeight(true);
                colHeight += height;

            });

            maxHeight = Math.max(colHeight, maxHeight);
            padNMargin = $(this).outerHeight(true) - $(this).height();

            //console.log("id=" + $(this).attr("id") + "padNMargin=" + padNMargin);
            //console.log("id=" + $(this).attr("id") + "height=" + colHeight);
        });

        maxHeight += padNMargin;
        maxHeight = Math.max(maxHeight, 30);

        //console.log("maxHeight=" + maxHeight);

        this.jqueryWrapper.children().each(function () {
            $(this).css("min-height", maxHeight);
        });
    };

    /**
     * api
     */
    ColBase.prototype.getEastTabs = function () {
        var tabs = [];

        var propTab = {
            title: '属性',
            panel: this._getEastTabPanelProperty()
        };
        tabs.push(propTab);

        return tabs;
    };

    ColBase.prototype._getEastTabPanelProperty = function() {
        var html = this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
        html = $(html);

        var that = this;
        html.on("change", "select, input[type='text']", function(e) {
            that._onPropertyEventTrigger(e);
        }).on("click", "input[type='checkbox'], input[type='radio']", function(e) {
            that._onPropertyEventTrigger(e);
        }).on("blur", "textarea", function(e) {
            that._onPropertyEventTrigger(e);
        }).on("input", "textarea", function(e) {
            that._onPropertyEventTrigger(e);
        });

        html.find("div.form-panel > div.title").off('click').on('click', function () {
            var $this = $(this);
            $this.next().slideToggle("normal");
        });

        return html;
    };

    ColBase.prototype._onPropertyEventTrigger = function(e) {
        this.chartPropertiesModel.handlePropertyEvent(e);
        //this._getChartProperties();
        this.redraw();
    };

    ColBase.prototype.getInnerContainerIds = function () {
        var ids = [];
        for (var i = 0; i <  this.config.innerContainers.length; i++) {
            ids.push(this.config.innerContainers[i].id);
        }

        return ids;
    };

    ColBase.prototype.onPropertyChanged = function (path, value, inputControl) {
        if (path == 'ratio') {
            this._onPropertyChanged_ratio(path, value, inputControl);
        }
    };

    ColBase.prototype._onPropertyChanged_ratio = function (path, value, inputControl) {
        if (!this._validateRatio(value)) {
            bootbox.alert("布局器分隔比例配置错误！分隔比例为0-12之间的数值，分隔比例之和大于0小于12，比例值之间以逗号分隔；如：6,6。");
            inputControl.setValue(this._ratio);
            return;
        }

        var oldColumns = this.jqueryWrapper.children();
        var oldColumnSize = oldColumns.length;
        var columns = value.split(",");
        var newColumnSize = columns.length;

        if (oldColumnSize > newColumnSize && this._isColumnsHasChildItem(oldColumns, newColumnSize)) {
            var that = this;
            bootbox.confirm("布局调整后第[" + newColumnSize + "]列后的数据会丢失，确认继续吗？", function (result) {
                if (result) {
                    that._ratio = value;
                    that._resetColumns(columns);
                } else {
                    // 回退ratio值到改变前的值
                    //$("#" + that.id).val($(that.componentObject).attr("ratio"));
                    inputControl.setValue(that._ratio);
                }
            })
        } else {
            this._ratio = value;
            this._resetColumns(columns);
        }
    };

    ColBase.prototype._validateRatio = function (value) {
        if (value == undefined) {
            return false;
        }

        //用户输入比例以“,”号分隔
        var columns = value.split(",");
        //验证用户输入的总列数是否大于0小于12，且不能包含非数字字符。
        var totalColumns = 0;
        for (var i = 0; i < columns.length; i++) {
            totalColumns += parseInt(_.trim(columns[i]));
        }

        return !isNaN(totalColumns) && totalColumns >= 0 && totalColumns <= 12;
    };

    /**
     * 判断数据列中是否包含子集
     * @param columns
     * @param startIndex
     */
    ColBase.prototype._isColumnsHasChildItem = function (columns, startIndex) {
        var hasChildItem = false;
        if (!columns || columns.length < startIndex) {
            return hasChildItem;
        }

        for (var i = startIndex; i < columns.length; i++) {
            if ($(columns[i]).children().length > 0) {
                hasChildItem = true;
                break;
            }
        }

        return hasChildItem;
    };

    ColBase.prototype._resetColumns = function (columns) {
        if (!columns || columns.length == 0) {
            return ;
        }

        var oldColumns = this.jqueryWrapper.children();
        var oldColumnSize = oldColumns.length;
        var newColumnSize = columns.length;

        var newInnerContainers = [];

        // 先直接修改oldColumns和新columns共同保留的div的class
        var min = Math.min(oldColumnSize, newColumnSize);
        var i = 0;
        for (i = 0; i < min; i++) {
            var ratio = parseInt(_.trim(columns[i]));
            var newCssClass = 'col-md-' + ratio + ' col-xs-' + ratio + ' col-sm-' + ratio + ' col-lg-' + ratio + ' column droppable-component';
            $(oldColumns[i]).removeClass().addClass(newCssClass);

            newInnerContainers.push({
                id: $(oldColumns[i]).attr("id"),
                ratio: ratio
            });
        }

        if (oldColumnSize > newColumnSize) {
            // 移除oldColumn中多余的列
            for (;i < oldColumnSize; i++) {
                // 还需要移除这些多余列中包含的子ComponentWrapper
                this._removeChildWrappersFromInnerContainer($(oldColumns[i]));
                $(oldColumns[i]).remove();
            }
        } else if (oldColumnSize < newColumnSize) {
            // 增加新的列
            for (;i < newColumnSize; i++) {
                var id = datavisual.pluginManager.newId();
                var ratio = parseInt(_.trim(columns[i]));

                var html = this._createInnerContainerHtml(id, ratio);
                html = $(html);
                html.data("component-wrapper", this.compWrapper);
                this.jqueryWrapper.append(html);

                newInnerContainers.push({
                    id: id,
                    ratio: ratio
                });
            }

            // 新增的列需要注册sortable事件
            datavisual.pluginManager._registerSortableComponentEvent();
        }

        // 更新config中的innerContainers
        this.config["innerContainers"] = newInnerContainers;

        // 重绘子componentWrapper
        this.compWrapper.redrawChildrenWrappers();
    };

    ColBase.prototype._removeChildWrappersFromInnerContainer = function ($innerContainer) {
        // compWrapper.removeChild()操作会导致数组长度发生变化，因此创建childWrappers数组的copy
        var childWrappers = [].concat(this.compWrapper.getChildrenWrapper());
        var innerContainerId = $innerContainer.attr("id");

        for (var j = 0; j < childWrappers.length; j++) {
            var cwParentContainerId = childWrappers[j].getParentContainerId();
            if (cwParentContainerId == innerContainerId) {
                this.compWrapper.removeChild(childWrappers[j]);
            }
        }
    };

    ColBase.prototype._getProperties = function() {
        return this.chartPropertiesModel.getChartProperties();
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.ColBase = win.datavisual.plugin.ColBase || ColBase;
}(jQuery, window));