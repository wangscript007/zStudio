/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "gauge";
    var MAX_SERIES_COUNT = 3;
    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var Gauge = function(config, propertiesConfig) {
        this.schema = {};
        this.schema[SCHEMA_TYPE_SERIES] = [];

        this.havingEnable = true;   //having筛选条件框是否灰化
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];
        this.ctrlItems_series = [];

        this.config = config || {};
        this.propertiesConfig = propertiesConfig;

        this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties, this);
        this._initCtrlItems();

        this.datasourceInfo = this.config.datasourceInfo;

        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    datavisual.extend(Gauge, win.datavisual.plugin.ChartBase);

    Gauge.prototype.getCssClass = function () {
        return "zdata_gauge";
    };

    /**
     * api
     */
    Gauge.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = PLUGIN_ID;

        data["datasourceInfo"] = this.datasourceInfo;

        data.ctrlItems = [];
        _.forEach(this.ctrlItems_series, function(item) {
            if (item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                data.ctrlItems.push(item.getJson());
            }
        });
        _.forEach(this.ctrlItems_where, function(item) {
            if (item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                data.ctrlItems.push(item.getJson());
            }
        });
        _.forEach(this.ctrlItems_having, function(item) {
            if (item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                data.ctrlItems.push(item.getJson());
            }
        });
        data["properties"] = this._getChartProperties();

        return data;
    };

    /**
     * api
     */
    Gauge.prototype._getControlPanelHtmlString = function() {
        var html = [];
        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     系列：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_SERIES + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    /**
     * api
     */
    Gauge.prototype._onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);
        if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES){
            this.ctrlItems_series.push(ctrlItem);
			this._updateHavingStatus();
        }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
            this.ctrlItems_where.push(ctrlItem);
        }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
            this.ctrlItems_having.push(ctrlItem);
        };
		this._updateHavingStatus();
    };

    /**
     * api
     * 处理控制项的移除事件
     */
    Gauge.prototype.onControlItemRemoved = function(ctrlItem) {
        
        if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES){
			_.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) {return o.fieldName == ctrlItem.getFieldName();});
            _.remove(this.ctrlItems_series, function(o) { return o.getFieldName() == ctrlItem.getFieldName(); });
			this._updateHavingStatus();
        }else {
			_.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) { 
				return o.operation.conditionId == ctrlItem.getOperationItem("conditionId"); 
			});
            if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
                _.remove(this.ctrlItems_where, function(o) { return o.operation.conditionId == ctrlItem.getOperationItem("conditionId"); });
            }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
                _.remove(this.ctrlItems_having, function(o) { return o.operation.conditionId == ctrlItem.getOperationItem("conditionId"); });
            }
		}
    };

    /**
     * api
     * 处理控制项的更新事件。
     * 主要是其数据的更新，例如排序方式、聚合方式等等
     */
    Gauge.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        var index = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) {	
            return ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES ? 
					o.fieldName == ctrlItem.getFieldName() 
					: o.operation.conditionId == ctrlItem.getOperationItem("conditionId");
        });
        if (index > -1) {
            this.schema[ctrlItem.getCtrlItemType()][index] = schemaItem;
            if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES){
                this.ctrlItems_series[index] = ctrlItem;
				this._updateHavingStatus();
            }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
                this.ctrlItems_where[index] = ctrlItem;
            }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
                this.ctrlItems_having[index] = ctrlItem;
            }

        }
    };
	
	Gauge.prototype._updateHavingStatus = function() {
        this.havingEnable = true;
        var that = this;
		$.each(that.schema[SCHEMA_TYPE_SERIES], function(key, value) {
            if (value && value.operation["aggr"] && value.operation["aggr"] == "none") {
				that.havingEnable = false;
            }
        });
    };

    /**
     * api
     * @param dropData
     * {
     *      target: dropData, //例如X轴、Y轴对应的DOM对象
            ctrlItemType: <item-type>   //例如xAxis, yAxis等
     * }
     */
    Gauge.prototype._checkDroppable = function(dropData) {
        if (SCHEMA_TYPE_SERIES == dropData.ctrlItemType) {
            if (this.schema[dropData.ctrlItemType].length >= MAX_SERIES_COUNT) {
                return {accept: false, message: "【系列】最多接受 " + MAX_SERIES_COUNT + " 个度量"};
            }
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                return {accept: false, message: "【系列】不支持放入维度"};
            }
        }

        // 暂时不允许同名字段的度量重复出现，后续需要orm支持为column指定别名后方可支持
        if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
            var hasDup = false;
            _.forEach(this.schema[SCHEMA_TYPE_SERIES], function(item, key) {
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

    Gauge.prototype._getQueryCondArr = function() {
        var schema = this.schema;
        var condArr = [];

        $.each(schema[SCHEMA_TYPE_SERIES], function(key, value) {
            if (value && value.fieldName) {
			var ormParam = value.type == 'value' ? workbench.workset.OrmCommon.handlColumn_Metric(value) : 
													  workbench.workset.OrmCommon.handlColumn_Dimension(schema[value]);
				
    			condArr.push(ormParam);
            }
        });

        if(schema[SCHEMA_TYPE_WHERE] != null && schema[SCHEMA_TYPE_WHERE] != undefined && schema[SCHEMA_TYPE_WHERE].length > 0){
            $.each(schema[SCHEMA_TYPE_WHERE], function(key, value) {
                if (value && value.fieldName) {
					var ormParam = workbench.workset.OrmCommon.handleWhere(value);
                    condArr.push(ormParam);
                }
            });
        }
		
        if(this.havingEnable && schema[SCHEMA_TYPE_HAVING] != null && schema[SCHEMA_TYPE_HAVING] != undefined && schema[SCHEMA_TYPE_HAVING].length > 0){
            $.each(schema[SCHEMA_TYPE_HAVING], function(key, value) {
                if (value && value.fieldName) {
					var ormParam = value.type == 'value' ? workbench.workset.OrmCommon.handleHaving_Metric(value) : 
														   workbench.workset.OrmCommon.handleHaving_Dimension(value);
													  
                    condArr.push(ormParam);
                }
            });
        }
        return condArr;
    };

    Gauge.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
        this.schema[SCHEMA_TYPE_SERIES] = [];
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];
        this.ctrlItems_series = [];
    };

    Gauge.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_SERIES].length == 0) {
            result.isValid = false;
            result.errorMessages.push('【系列】');
        }

        return result;
    };

    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Gauge.prototype._getDataOption = function() {
        if (this.schema[SCHEMA_TYPE_SERIES].length == 0) {
            return false;
        }

        var condArr = this._getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);

        var transformRule = {};
        transformRule.series = [];
        $.each(this.schema[SCHEMA_TYPE_SERIES], function(index, item) {
            transformRule.series.push({
                fieldName: item.operation.alias || item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });

        return this._transformData(transformRule, data);
    };

    Gauge.prototype._transformData = function(transformRule, data) {
        var optionSeries = [];
        $.each(transformRule.series, function(serieIndex, item) {
            $.each(data, function(dataIndex, dataItem) {
                optionSeries[serieIndex] = {
                    name: item.displayText,
                    type: 'gauge',
                    data: [{value: dataItem[item.fieldName], name: item.displayText}]
                };
            });
        });

        var option = {};
        option.series = optionSeries;
        return option;
    };

    Gauge.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Gauge.prototype._getName = function () {
        return "仪表";
    };

    Gauge.prototype._drawCtrlItems = function() {
        var that = this;
        var items = [];
        items = items.concat(this.ctrlItems_series).concat(this.ctrlItems_where).concat(this.ctrlItems_having);

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

    Gauge.prototype._initCtrlItems = function() {
        var items = this.config.ctrlItems || [];

        // 重新恢复ctrlItem的内存数据模型
        var that = this;
        _.forEach(items, function(item) {
            var ctrlItem = new datavisual.entity.ControlItem(item);
            that._onControlItemAdded(ctrlItem);
        });
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.Gauge = win.datavisual.plugin.Gauge || function(config, propertiesConfig) { return new Gauge(config, propertiesConfig) };
}(jQuery, window));