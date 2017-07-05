/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "table_pivot";
    var MAX_QUOTA_COUNT = 3;

    var SCHEMA_TYPE_ROWS   = "rows";
    var SCHEMA_TYPE_COLUMNS   = "columns";
    var SCHEMA_TYPE_SYMBOL  = "symbol";

    var Table_pivot = function(config, propertiesConfig) {
        this.schema = {};

        this.schema[SCHEMA_TYPE_ROWS] = [];
        this.schema[SCHEMA_TYPE_COLUMNS] = [];
        this.schema[SCHEMA_TYPE_SYMBOL] = [];

        this.ctrlItems_columns = [];
        this.ctrlItems_rows = [];
        this.ctrlItems_symbol = [];

        this.config = config || {};
        this.propertiesConfig = propertiesConfig;

        this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties);
        this._initCtrlItems();

        this.datasourceInfo = this.config.datasourceInfo;

        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    /**
     * api
     * @param compWrapper
     */
    Table_pivot.prototype.setComponentWrapper = function(compWrapper) {
        this.compWrapper = compWrapper;
    };

    /**
     * api
     * @returns {boolean}
     */
    Table_pivot.prototype.outputRuntimeHtmlSameAsDesign  = function () {
        return false;
    };

    /**
     * api
     */
    Table_pivot.prototype.getCssClass = function () {
        return "zdata_table_pivot";
    };

    /**
     * api
     * @returns {string}
     */
    Table_pivot.prototype.getRuntimeHtml = function () {
        var html = [];

        html.push('<div style="width:100%; height:300px; margin-left: 1px; overflow: scroll;">');
        html.push('</div>');

        return html.join("");
    };

    /**
     * api
     * @returns {*}
     */
    Table_pivot.prototype.getRuntimeConfig = function() {
        var runtimeConfig =  _.clone(this.schema);
        runtimeConfig['pluginId'] = this._getPluginID();
        $.extend(runtimeConfig, this._getRuntimeDataSourceInfo());
        //runtimeConfig['properties'] = this._getChartProperties(); //TODO table組件目前不提供配置項，后续扩展

        return runtimeConfig;
    };

    /**
     * api
     * @returns {*|HTMLElement}
     */
    Table_pivot.prototype.getControlPanel = function() {
        this.$controlPanel = $(this._getControlPanelHtmlString());
        return this.$controlPanel;
    };

    /**
     * api
     * @returns {string}
     */
    Table_pivot.prototype.getDesignHtml = function () {
        if (this.jqueryWrapper) {
            return this.jqueryWrapper;
        }

        var html = [];
        //html.push('<div style="width:100%; height:300px; overflow: scroll;">');
        html.push('<div style="width:100%; height:300px; margin-left: 1px; overflow: scroll">');
        html.push('</div>');

        this.jqueryWrapper = $(html.join(""));
        return this.jqueryWrapper;
    };

    /**
     * api
     * @returns {{}}
     */
    Table_pivot.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = PLUGIN_ID;
        data["datasourceInfo"] = this.datasourceInfo;
        data.ctrlItems = [];
        _.forEach(this.ctrlItems_columns, function(item) {
            if (item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                data.ctrlItems.push(item.getJson());
            }
        });
        _.forEach(this.ctrlItems_rows, function(item) {
            if (item != null) {
                data.ctrlItems.push(item.getJson());
            }
        });
        _.forEach(this.ctrlItems_symbol, function(item) {
            if (item != null) {
                data.ctrlItems.push(item.getJson());
            }
        });
        //data["properties"] = this._getChartProperties();   //TODO table组件目前不提供配置属性，后续扩展

        return data;
    };

    /**
     * api
     */
    Table_pivot.prototype.onComponentDrawn = function() {
        this._initDataSourceView();
        this._captureDataSourceInfo();
        this._initDom();
        this.redraw();
    };

    /**
     * api
     */
    Table_pivot.prototype.onControlPanelDrawn = function() {
        this._registerDropEvent();
        this._drawCtrlItems();
    };

    /**
     * api
     */
    Table_pivot.prototype.redraw = function() {
        var dataTable = this._getDataTable();
        if (dataTable) {
            this.dom.innerHTML = dataTable;
        } else {
            // 显示示例图形
            this.dom.innerHTML = this._getDemoTablePivot();
        }
    };

    /**
     * api
     * @returns {Array}
     */
    Table_pivot.prototype.getEastTabs = function() {
        var tabs = [];

        /*var propTab = {
         title: '属性',
         panel: this._getEastTabPanelProperty()
         };
         tabs.push(propTab);*/

        var datasourceTab = {
            title: '数据源',
            panel: this._getEastTabPanelDatasource()
        };
        tabs.push(datasourceTab);

        return tabs;
    };

    Table_pivot.prototype._initDataSourceView = function () {
        if (this.dataSourceView) {
            return;
        }

        var config = {};

        var dsInfo = this._getDatasourceInfo();
        if (dsInfo) {
            config["selectedDatasourceId"] = dsInfo.datasource.id;
            config["selectedDatasetName"] = dsInfo.dataset.name;
        }

        var that = this;
        config["datasourceChangedCallback"] = function () {
            that._onDataSourceSelectionChanged();
        };

        this.dataSourceView = new datavisual.ui.DataSourceView(config);
    };

    Table_pivot.prototype._getDatasourceInfo = function() {
        return this.datasourceInfo;
    };

    Table_pivot.prototype._captureDataSourceInfo = function() {
        this.datasourceInfo = this.dataSourceView.getCurrentDataSource();
    };

    Table_pivot.prototype._initDom = function() {
        this.dom = this.jqueryWrapper[0];
    };

    Table_pivot.prototype._registerDropEvent = function() {
        var that = this;
        // 修改.droppable 的查找范围
        this.$controlPanel.find(".droppable").droppable({
            accept: ".group-item",
            activeClass: "droppable-highlight",
            hoverClass: "droppable-hover",
            drop: function( event, ui ) {
                var droppable = $(event.target);
                var draggable = ui.draggable;

                var ctrlItemData = {
                    ctrlItemType: droppable.data("ctrl-item-type"),
                    ctrlType: draggable.data("ctrltype"),
                    field: {
                        name: draggable.data("field-name"),
                        dataType: draggable.data("field-data-type")
                    }
                };

                var checkResult = that._checkDroppable(ctrlItemData);
                if (checkResult.accept === false) {
                    var msg = checkResult.message || "当前控制项不能放入维度或度量了！";
                    alert(msg);
                    return;
                }

                var ctrlItem = new datavisual.entity.ControlItem(ctrlItemData);
                droppable.append(ctrlItem.getDom());
                that._onControlItemAdded(ctrlItem);
                that._captureDataSourceInfo();
                that.redraw();
            }
        })
    };

    Table_pivot.prototype._getEastTabPanelDatasource = function () {
        // 恢复数据模型面板的显示
        var html = this.dataSourceView.getHtml();
        html = $(html);

        html.find("div.form-panel > div.title").off('click').on('click', function () {
            var $this = $(this);
            $this.next().slideToggle("normal");
        });

        return html;
    };

    /**
     *
     * @private
     */
    Table_pivot.prototype._onDataSourceSelectionChanged = function () {
        //数据源的选择发生变化时，需要
        // 1、清除当前controlPanel上拖拽的ctrlItems，
        // 2、并且对应清除内存缓存的ctrlItems等信息
        // 3、保存新选择的数据源信息
        // 4、重绘图表

        //移除ctrlItem
        this._clearCtrlItems();

        this._captureDataSourceInfo();

        datavisual.pluginManager.redrawActiveComponentWrapperControlPanel();
        this.redraw();
    };

    Table_pivot.prototype._initCtrlItems = function() {
        var items = this.config.ctrlItems || [];

        // 重新恢复ctrlItem的内存数据模型
        var that = this;
        _.forEach(items, function(item) {
            var ctrlItem = new datavisual.entity.ControlItem(item);
            that._onControlItemAdded(ctrlItem);
        });
    };

    Table_pivot.prototype._getCtrlItemContainer = function(ctrlItemType) {
        return this.$controlPanel.find("div[data-ctrl-item-type=" + ctrlItemType + "]");
    };

    /**
     * api
     */
    Table_pivot.prototype._getControlPanelHtmlString = function() {
        var html = [];

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     列：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_COLUMNS + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     行：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_ROWS + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     标签：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_SYMBOL + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    Table_pivot.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Table_pivot.prototype._drawCtrlItems = function() {
        var items = [];
        items = items.concat(this.ctrlItems_columns);
        items = items.concat(this.ctrlItems_rows);
        items = items.concat(this.ctrlItems_symbol);

        var that = this;
        _.forEach(items, function(ctrlItem) {
            if (ctrlItem == null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                return;
            }

            var ctrlItemContainer = that._getCtrlItemContainer(ctrlItem.getCtrlItemType());
            if (ctrlItemContainer) {
                ctrlItemContainer.append(ctrlItem.getDom());
            }
        });
    };

    Table_pivot.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
    };

    /**
     * api
     */
    Table_pivot.prototype._onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';

        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SYMBOL) {
            this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);
            this.ctrlItems_symbol.push(ctrlItem);
        } else if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_COLUMNS) {
            this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);
            this.ctrlItems_columns.push(ctrlItem);
        } else if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_ROWS) {
            this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);
            this.ctrlItems_rows.push(ctrlItem);
        }
    };

    /**
     * api
     * 处理控制项的移除事件
     */
    Table_pivot.prototype.onControlItemRemoved = function(ctrlItem) {
        if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SYMBOL) {
            _.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) { return o.fieldName == ctrlItem.getFieldName(); });
            _.remove(this.ctrlItems_symbol, function(o) { return o.getFieldName() == ctrlItem.getFieldName(); });
        } else if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_COLUMNS) {
            _.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) { return o.fieldName == ctrlItem.getFieldName(); });
            _.remove(this.ctrlItems_columns, function(o) { return o.getFieldName() == ctrlItem.getFieldName(); });
        } else if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_ROWS) {
            _.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) { return o.fieldName == ctrlItem.getFieldName(); });
            _.remove(this.ctrlItems_rows, function(o) { return o.getFieldName() == ctrlItem.getFieldName(); });
        }
    };

    /**
     * api
     * 处理控制项的更新事件。
     * 主要是其数据的更新，例如排序方式、聚合方式等等
     */
    Table_pivot.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';

        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SYMBOL) {
            var i = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) {
                return o.fieldName == ctrlItem.getFieldName();
            });
            if (i > -1) {
                this.schema[ctrlItem.getItemType()][i] = schemaItem;
                this.ctrlItems_columns[i] = ctrlItem;
            }
        } else if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_COLUMNS) {
            var index = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) {
                return o.fieldName == ctrlItem.getFieldName();
            });
            if (index > -1) {
                this.schema[ctrlItem.getCtrlItemType()][index] = schemaItem;
                this.ctrlItems_columns[index] = ctrlItem;
            }
        } else if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_ROWS) {
            var idx = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) {
                return o.fieldName == ctrlItem.getFieldName();
            });
            if (idx > -1) {
                this.schema[ctrlItem.getCtrlItemType()][idx] = schemaItem;
                this.ctrlItems_rows[idx] = ctrlItem;
            }
        }
    };

    /**
     *
     * @param dropData
     * @returns {*}
     */
    Table_pivot.prototype._checkDroppable = function(dropData) {
        if (SCHEMA_TYPE_COLUMNS == dropData.ctrlItemType) {
            if (this.schema[dropData.ctrlItemType].length >= MAX_QUOTA_COUNT) {
                return {accept: false, message: "【列】最多接受 " + MAX_QUOTA_COUNT + " 个维度"};
            }
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
                return {accept: false, message: "【列】不支持放入度量"};
            }
        }

        if (SCHEMA_TYPE_ROWS == dropData.ctrlItemType) {
            if (this.schema[dropData.ctrlItemType].length >= MAX_QUOTA_COUNT) {
                return {accept: false, message: "【行】最多接受 " + MAX_QUOTA_COUNT + " 个维度"};
            }
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
                return {accept: false, message: "【行】不支持放入度量"};
            }
        }

        if (SCHEMA_TYPE_SYMBOL == dropData.ctrlItemType) {
            if (this.schema[dropData.ctrlItemType].length >= MAX_QUOTA_COUNT) {
                return {accept: false, message: "【标签】最多接受 " + MAX_QUOTA_COUNT + " 个度量"};
            }
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                return {accept: false, message: "【标签】不支持放入维度"};
            }
        }

        return {accept: true};
    };

    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Table_pivot.prototype._getDataTable = function() {
        if (this.schema[SCHEMA_TYPE_COLUMNS] == null || this.schema[SCHEMA_TYPE_COLUMNS] == undefined ||
            this.schema[SCHEMA_TYPE_COLUMNS].length < 1 || this.schema[SCHEMA_TYPE_ROWS] == null ||
            this.schema[SCHEMA_TYPE_ROWS] == undefined || this.schema[SCHEMA_TYPE_ROWS].length < 1 ||
            this.schema[SCHEMA_TYPE_SYMBOL] == null || this.schema[SCHEMA_TYPE_SYMBOL] == undefined ||
            this.schema[SCHEMA_TYPE_SYMBOL].length < 1) {
            return false;
        }

        var condArr = this.getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);

        var transformRule = {};
        transformRule.symbol = [];
        $.each(this.schema[SCHEMA_TYPE_SYMBOL], function(index, item) {
            transformRule.symbol.push({
                fieldName: item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });

        transformRule.columns = [];
        $.each(this.schema[SCHEMA_TYPE_COLUMNS], function(index, item) {
            transformRule.columns.push({
                fieldName: item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });

        transformRule.rows = [];
        $.each(this.schema[SCHEMA_TYPE_ROWS], function(index, item) {
            transformRule.rows.push({
                fieldName: item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });

        return this._transformData(transformRule, data);
    };
    
    Table_pivot.prototype.getQueryCondArr = function() {
    	var schema = this.schema;
    	var condArr = [];

        $.each(schema[SCHEMA_TYPE_COLUMNS], function(key, value) {
            if (value) {
                condArr.push(value);
            }
        });

        $.each(schema[SCHEMA_TYPE_ROWS], function(key, value) {
            if (value) {
                condArr.push(value);
            }
        });

        $.each(schema[SCHEMA_TYPE_SYMBOL], function(key, value) {
            if (value) {
                condArr.push(value);
            }
        });

    	return condArr;
    };

    Table_pivot.prototype._transformData = function(transformRule, data) {
        var symbol = transformRule.symbol;
        var columns = transformRule.columns;
        var rows = transformRule.rows;

        //列表头选项数据
        var columnsLen = columns.length;
        var columnsCtrlItems = [];
        for (var i=0; i<columnsLen; i++) {
            var columnsCtrlItem = [];
            $.each(data , function(index, item) {
                columnsCtrlItem.push(item[columns[i].fieldName]);
            });
            columnsCtrlItem = _.uniq(columnsCtrlItem);
            columnsCtrlItems.push(columnsCtrlItem);
        }

        this._extractColumnsHeader(data, columns, columnsCtrlItems);

        var preData = null;
        var nextData = null;
        var categoryLevel = null;

        //列表头分类所属层次数据
        var columnsCategories = [];
        if (columnsLen > 1) {
            for (var ii=0; ii<columnsLen; ii++) {
                preData = columnsCtrlItems[ii];
                nextData = columnsCtrlItems[ii + 1];
                if (nextData) {
                    categoryLevel = this._handleCategoryLevel(preData, nextData, data, columns[ii], columns[ii + 1]);
                    columnsCategories.push(categoryLevel);
                }
            }
        }

        //行表头分类
        var rowsLen = rows.length;
        var rowsData = [];
        for (var j=0; j<rowsLen; j++) {
            var rowsItem = [];
            $.each(data, function(index, item) {
                rowsItem.push(item[rows[j].fieldName]);
            });
            rowsItem = _.uniq(rowsItem);
            rowsData.push(rowsItem);
        }

        //行表头分类所属层次数据
        var rowsCategories = [];
        if (rowsLen > 1) {
            for (var jj=0; jj<rowsLen; jj++) {
                preData = rowsData[jj];
                nextData = rowsData[jj + 1];
                if (nextData) {
                    categoryLevel = this._handleCategoryLevel(preData, nextData, data, rows[jj], rows[jj + 1]);
                    rowsCategories.push(categoryLevel);
                }
            }
        }

        var html = '<table id="my_table" border="1" style="overflow: scroll" >';
        html += '<thread>';

        //生成列表头
        html += this._buildColumnsHeader(columnsCtrlItems, columnsCategories, columns, rowsLen, symbol.length);

        //生成列表头和标签项
        //html += '<tr>';
        //html += '<th colspan="1" style="width: 160px;">' + rows[0].displayText + '</th>';
        //html += '<th colspan="1" style="width: 160px;">' + rows[1].displayText + '</th>';
        //for (var k=0; k<columnsData[1].length; k++) {
        //    html += '<th colspan="1" style="width: 160px;">' + symbol[0].displayText + '</th>';
        //}
        //html += '</tr>';

        html += '</thread>';

        //tbody
        /*html +=  '<tbody>';
         html +=  '</tbody>';*/
        html += '</table>';

        //$("#demo-chart-view").html($(html));
        //this.getDemoTable_pivot();
        return html;
    };

    Table_pivot.prototype._handleCategoryLevel = function(preData, nextData, datas, preObj, postObj) {
        var categoryObj = {};
        /*if (categoryLevel) {
            _.forEach(categoryLevel, function(n, key) {
                for (var i=0; i<n.length; i++) {
                    n[i];
                    $.each(datas, function(index, item) {

                    });
                }
            });
        } else {
            for (var i=0; i<preData.length; i++) {
                var categoryItem = [];
                var preItem = preData[i];
                for (var j=0; j<nextData.length; j++) {
                    var postItem = nextData[j];
                    $.each(datas, function(index, item) {
                        if (item[preObj.fieldName] == preItem && item[postObj.fieldName] == postItem) {
                            categoryItem.push(postItem);
                        }
                    });
                }
                categoryItem = _.uniq(categoryItem);
                categoryObj[preItem] = categoryItem;
            }
        }*/
        for (var i=0; i<preData.length; i++) {
            var categoryItem = [];
            var preItem = preData[i];
            for (var j=0; j<nextData.length; j++) {
                var postItem = nextData[j];
                $.each(datas, function(index, item) {
                    if (item[preObj.fieldName] == preItem && item[postObj.fieldName] == postItem) {
                        categoryItem.push(postItem);
                    }
                });
            }
            categoryItem = _.uniq(categoryItem);
            categoryObj[preItem] = categoryItem;
        }

        return categoryObj;
    };

    Table_pivot.prototype._buildColumnsHeader = function(columnsData, columnsCategories, columns, rowsLen, symbolLen) {
        var html = '';
        var width = 160;
        var styleLen = width * rowsLen;

        for (var i=0; i<columnsData.length; i++) {
            var columnsItemObj = columnsData[i];
            var colCategory = columnsCategories[i];

            html += '<tr>';
            html += '<th colspan="' + rowsLen + '" style="width: ' + styleLen + 'px;">' + columns[i].displayText + '</th>';

            for (var j=0; j<columnsItemObj.length; j++) {
                var ttt = columnsItemObj[j];

                if (colCategory) {
                    var len;
                    _.forEach(colCategory, function(item, key) {
                        if (key == ttt) {
                            len = item.length;
                        }
                    });
                    html += '<th colspan="' + len + '" style="width: ' + width * len * symbolLen + 'px;">' + ttt + '</th>';
                } else {  //在列表头上没有再往下分层
                    var colCategorysss = columnsCategories[i - 1];
                    html += '<th colspan="' + symbolLen + '" style="width: ' + width * symbolLen + 'px;">' + ttt + '</th>';
                }
            }
            html += '</tr>';
        }

        return html;
    };

    Table_pivot.prototype._extractColumnsHeader = function(datas, columns, columnsCtrlItems) {
        var colLen = columnsCtrlItems.length;
        var colCtrlItem1 = null;
        var colCtrlItem2 = null;
        var colCtrlItem3 = null;

        var result = [];

        if (colLen > 0) {
            if (colLen == 1) {
                return columnsCtrlItems[0];
            } else if (colLen == 2) {
                colCtrlItem1 = columnsCtrlItems[0];
                colCtrlItem2 = columnsCtrlItems[1];

                for (var i=0; i<colCtrlItem1.length; i++) {
                    var item1 = colCtrlItem1[i];
                    for (var j=0; j<colCtrlItem2.length; j++) {
                        var item2 = colCtrlItem2[j];
                        $.each(datas, function(index, item) {
                            var res1 = [];
                            if (item1 == item[columns[0].fieldName] && item2 == item[columns[1].fieldName]) {
                                console.log(item1 + ' , ' + item2);
                                res1.push(item1);
                                res1.push(item2);

                            }
                            result.push(res1);
                        });
                    }
                }
                /*$.each(datas, function(index, item) {
                    var res1 = [];
                    for (var i=0; i<colCtrlItem1.length; i++) {
                        var item1 = colCtrlItem1[i];
                        for (var j=0; j<colCtrlItem2.length; j++) {
                            var item2 = colCtrlItem2[j];
                            if (item1 == item[columns[0].fieldName] && item2 == item[columns[1].fieldName]) {
                                console.log(item1 + ' , ' + item2);

                                res1.push(item1);
                                res1.push(item2);
                                //result.push(item2);
                            }
                        }
                    }
                    result.push(_.uniq(res1));
                });*/

            } else if (colLen == 3) {
                colCtrlItem1 = columnsCtrlItems[0];
                colCtrlItem2 = columnsCtrlItems[1];
                colCtrlItem3 = columnsCtrlItems[2];

                $.each(datas, function(index, item) {
                    for (var i=0; i<colCtrlItem1.length; i++) {
                        var item1 = colCtrlItem1[i];
                        for (var j=0; j<colCtrlItem2.length; j++) {
                            var item2 = colCtrlItem2[j];
                            for (var k= 0; k<colCtrlItem3.length; k++) {
                                var item3 = colCtrlItem3[k];
                                if (item1 == item[columns[0].fieldName] && item2 == item[columns[1].fieldName] && item3 == item[columns[2].fieldName]) {
                                    result.push(item1);
                                    result.push(item2);
                                    result.push(item3);

                                    //console.log(item1 + ' , ' + item2 + ' , ' + item3);
                                }
                            }
                        }
                    }
                });
            } else {
                return null;
            }
        }
        /*for (var i=0; i<datas.length; i++) {
            for (var j=0; j<columnsCtrlItems.length; j++) {
                var colCtrlItem = columnsCtrlItems[j];
            }
        }*/
    };

    Table_pivot.prototype._getDemoTablePivot = function() {
        var html = '<table id="table_test" border="1">';
        html += '<thead>';
        html +=  '<tr>';
        html +=  '<th colspan="2" style="width: 320px;">区域</th>';
        html +=  '<th colspan="3" style="width: 480px;">东北</th>';
        html +=   '</tr>';
        html +=   '<tr>';
        html +=  '<th colspan="2" style="width: 320px;">省份</th>';
        html +=  '<th style="width: 160px;">吉林</th>';
        html +=  '<th style="width: 160px;">辽宁</th>';
        html +=  '<th style="width: 160px;">黑龙江</th>';
        html +=  '</tr>';
        html +=  '<tr>';
        html +=   '<th style="width: 160px;">产品类别</th>';
        html +=  '<th style="width: 160px;">产品子类别</th>';
        html +=  '<th style="width: 160px;">销售额</th>';
        html +=  '<th style="width: 160px;">销售额</th>';
        html +=  '<th style="width: 160px;">销售额</th>';
        html +=  '</tr>';
        html +=  '</thead>';
        html +=  '<tbody>';
        html +=  '<tr>';
        html += '<td rowspan="5">家具产品</td>';
        html +=  '</tr>';
        html +=  '<tr>';
        html +=  '<td rowspan="1">书架</td>';
        html += '<td rowspan="1" bgcolor="#5f9ea0">4344.610</td>';
        html +=  '<td rowspan="1" id="on333" bgcolor="#a52a2a">46257.030</td>';
        html +=  '<td rowspan="1" bgcolor="aqua">13066.510</td>';
        html += '</tr>';
        html += '<tr>';
        html +=  '<td rowspan="1">办公饰品</td>';
        html +=  '<td rowspan="1">16094.390</td>';
        html += '<td rowspan="1">25463.170</td>';
        html += '<td rowspan="1">9447.270</td>';
        html +=  '</tr>';
        html +=  '<tr>';
        html += '<td rowspan="1">桌子</td>';
        html +=  '<td rowspan="1">4344.610</td>';
        html +=  '<td rowspan="1">46257.030</td>';
        html += '<td rowspan="1">13066.510</td>';
        html +=  '</tr>';
        html +=  '<tr>';
        html +=  '<td rowspan="1">椅子</td>';
        html +=  '<td rowspan="1">4344.610</td>';
        html +=  '<td rowspan="1">46257.030</td>';
        html +=  '<td rowspan="1">13066.510</td>';
        html += '</tr>';

        html +=  '<tr>';
        html += '<td rowspan="5">技术产品</td>';
        html += '</tr>';
        html +=  '<tr>';
        html += '<td rowspan="1">办公机器</td>';
        html += '<td rowspan="1">4344.610</td>';
        html += '<td rowspan="1">46257.030</td>';
        html += '<td rowspan="1">13066.510</td>';
        html +=  '</tr>';
        html +=  '<tr>';
        html += '<td rowspan="1">电脑配件</td>';
        html += '<td rowspan="1">16094.390</td>';
        html +=  '<td rowspan="1">25463.170</td>';
        html +=  '<td rowspan="1">9447.270</td>';
        html += '</tr>';
        html +=  '<tr>';
        html +=  '<td rowspan="1">电话通信产品</td>';
        html +=  '<td rowspan="1">4344.610</td>';
        html +=  '<td rowspan="1">46257.030</td>';
        html +=  '<td rowspan="1">13066.510</td>';
        html +=  '</tr>';
        html +=  '</tbody>';
        html += '</table>';

        return html;
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.Table_pivot = win.datavisual.plugin.Table_pivot || function (config, propertiesConfig) {
            return new Table_pivot(config, propertiesConfig);
        };
}(jQuery, window));