/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "table_detail";
    var MAX_HEADER_COUNT = 6;

    var SCHEMA_TYPE_COLUMNS  = "columns";

    var Table_detail = function(config, propertiesConfig) {
        this.schema = {};
        this.schema[SCHEMA_TYPE_COLUMNS] = [];

        this.ctrlItems_header = [];

        this.config = config || {};
        this.propertiesConfig = propertiesConfig;

        this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties);
        this._initCtrlItems();

        this.datasourceInfo = this.config.datasourceInfo;

        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    datavisual.extend(Table_detail, win.datavisual.plugin.TableBase);

    /**
     * api
     */
    Table_detail.prototype.getCssClass = function () {
        return "zdata_table_detail";
    };

    /**
     * api
     * @returns {{}}
     */
    Table_detail.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = PLUGIN_ID;
        data["datasourceInfo"] = this.datasourceInfo;
        data.ctrlItems = [];
        _.forEach(this.ctrlItems_header, function(item) {
            if (item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                data.ctrlItems.push(item.getJson());
            }
        });
        //data["properties"] = this._getChartProperties();   //TODO table组件目前不提供配置属性，后续扩展

        return data;
    };

    Table_detail.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Table_detail.prototype._getRuntimeDataSourceInfo = function() {
        var dsInfo = this._getDatasourceInfo();
        return {
            'datasource' : {'id': dsInfo.datasource.id},
            'dataset' : {'name': dsInfo.dataset.name}
        };
    };

    Table_detail.prototype._getControlPanelHtmlString = function() {
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

        return html.join("");
    };

    Table_detail.prototype._drawCtrlItems = function() {
        var items = [];
        items = items.concat(this.ctrlItems_header);

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

    Table_detail.prototype._initCtrlItems = function() {
        var items = this.config.ctrlItems || [];

        // 重新恢复ctrlItem的内存数据模型
        var that = this;
        _.forEach(items, function(item) {
            var ctrlItem = new datavisual.entity.ControlItem(item);
            that._onControlItemAdded(ctrlItem);
        });
    };

    /**
     * api
     */
    Table_detail.prototype._onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';

        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);

        this.ctrlItems_header.push(ctrlItem);
    };

    /**
     * api
     * 处理控制项的移除事件
     */
    Table_detail.prototype.onControlItemRemoved = function(ctrlItem) {
        _.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) {
            return o.fieldName == ctrlItem.getFieldName();
        });
        _.remove(this.ctrlItems_header, function(o) {
            return o.getFieldName() == ctrlItem.getFieldName();
        });
    };

    /**
     * api
     * 处理控制项的更新事件。
     * 主要是其数据的更新，例如排序方式、聚合方式等等
     */
    Table_detail.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';

        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        var index = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) {
            return o.fieldName == ctrlItem.getFieldName();
        });

        if (index > -1) {
            this.schema[ctrlItem.getCtrlItemType()][index] = schemaItem;
            this.ctrlItems_header[index] = ctrlItem;
        }
    };

    /**
     *
     * @param dropData
     * @returns {*}
     * @private
     */
    Table_detail.prototype._checkDroppable = function(dropData) {
        if (this.schema[dropData.ctrlItemType].length >= MAX_HEADER_COUNT) {
            return {accept: false, message: "【列】最多接受 " + MAX_HEADER_COUNT + " 个选项"};
        }

        // 暂时不允许同名字段的度量重复出现，后续需要orm支持为column指定别名后方可支持
        if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
            var hasDup = false;
            _.forEach(this.schema[SCHEMA_TYPE_COLUMNS], function(item) {
                if (item && item.fieldName === dropData.field.name) {
                    hasDup = true;
                }
            });

            if (hasDup) {
                return {accept: false, message: "同一个度量不允许重复使用"};
            }
        }

        return {accept: true};
    };

    /**
     *
     * @returns {*}
     * @private
     */
    Table_detail.prototype._getTableHtml = function() {
        if (this.schema[SCHEMA_TYPE_COLUMNS] == null || this.schema[SCHEMA_TYPE_COLUMNS] == undefined ||
            this.schema[SCHEMA_TYPE_COLUMNS].length < 1) {
            return false;
        }

        var condArr = this._getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);

        var ctrlItem = {};
        ctrlItem.columns = [];

        $.each(this.schema[SCHEMA_TYPE_COLUMNS], function(index, item) {
            ctrlItem.columns.push({
                fieldName: item.fieldName,
                displayText: item.displayText
            });
        });

        return this._buildTableHtml(ctrlItem, data);
    };

    /**
     *
     * @returns {Array}
     * @private
     */
    Table_detail.prototype._getQueryCondArr = function() {
    	var schema = this.schema;
    	var condArr = [];

		$.each(schema[SCHEMA_TYPE_COLUMNS], function(key, value) {
            if (value && value.fieldName) {
				var ormParam = value.type == 'value' ? 
								workbench.workset.OrmCommon.handlColumn_Metric(value) : 
								workbench.workset.OrmCommon.handlColumn_Dimension(value);
				condArr.push(ormParam);
            }
        });

    	return condArr;
    };

    /**
     *
     * @param ctrlItem
     * @param data
     * @returns {string}
     * @private
     */
    Table_detail.prototype._buildTableHtml = function(ctrlItem, data) {
        var columns = ctrlItem.columns;

        var html = '<div style="width: 100%;">';

        //表头 table-head
        html += '<div class="table-head">';
        html += '<table>';
        html += '<colgroup>';
        html += '<col style="width: initial;" />';
        html += '</colgroup>';
        html += '<thead>';
        html += '<tr>';
        for (var i=0; i<columns.length; i++) {
            html += '<th>' + columns[i].displayText + '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '</table>';
        html += '</div>';

        //表数据 table-body
        html += '<div class="table-body">';
        html += '<table>';
        html += '<colgroup>';
        html += '<col style="width: initial;" />';
        html += '</colgroup>';
        html += '<tbody>';
        for (var j=0; j<data.length; j++) {
            var dataInfo = data[j];
            html += '<tr>';
            for (var k=0; k<columns.length; k++) {
                var dataItem = dataInfo[columns[k].fieldName];
                if (dataItem == null) {
                    html += '<td></td>';
                } else {
                    html += '<td>' + dataInfo[columns[k].fieldName] + '</td>';
                }
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';

        html += '</div>';

        return html;
    };

    /**
     *
     * @private
     */
    Table_detail.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
        this.schema[SCHEMA_TYPE_COLUMNS] = [];
        this.ctrlItems_header = [];
    };

    /**
     *
     * @returns {string}
     * @private
     */
    Table_detail.prototype._getDemoTableHtml = function() {
        var html = '<div style="width: 100%;">';

        //表头 table-head
        html += '<div class="table-head">';
        html += '<table>';
        html += '<colgroup>';
        html += '<col style="width: initial;" />';
        html += '</colgroup>';
        html += '<thead>';
        html += '<tr>';
        for (var i=1; i<=6; i++) {
            html += '<th>表头' + i + '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '</table>';
        html += '</div>';

        //表数据 table-body
        html += '<div class="table-body">';
        html += '<table>';
        html += '<colgroup>';
        html += '<col style="width: initial;" />';
        html += '</colgroup>';
        html += '<tbody>';
        for (var j=0; j<3; j++) {
            html += '<tr>';
            for (var k=1; k<=6; k++) {
                html += '<td>数据' + k + '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        html += '</div>';

        return html;
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.Table_detail = win.datavisual.plugin.Table_detail || function (config, propertiesConfig) {
            return new Table_detail(config, propertiesConfig);
        };
}(jQuery, window));