/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "map";

    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_REGION  = "region";
    var SCHEMA_TYPE_DATA  = "data";
    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_SERIES, SCHEMA_TYPE_REGION, SCHEMA_TYPE_DATA];

    var Map = function(config,propertiesConfig) {
        this.schema = {};
        this.ctrlItems = {};

        this.havingEnable = true;   //having筛选条件框是否灰化
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];

        this.config = config || {};
        this.propertiesConfig = propertiesConfig;

        this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties);
        this._initCtrlItems();

        this.datasourceInfo = this.config.datasourceInfo;

        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    datavisual.extend(Map, win.datavisual.plugin.ChartBase);

    Map.prototype.getCssClass = function () {
        return "zdata_map";
    };

    /**
     * api
     */
    Map.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = PLUGIN_ID;
        data["datasourceInfo"] = this.datasourceInfo;
        data.ctrlItems = [];
        _.forEach(this.ctrlItems, function(item) {
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
    Map.prototype._getControlPanelHtmlString = function() {
        var html = [];
        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     系列：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_SERIES + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     区域：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_REGION + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     数据：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_DATA + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    /**
     * api
     */
    Map.prototype._onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        if($.inArray(ctrlItem.getCtrlItemType(),SCHEMA_TYPE_ARRAY) != -1){
            this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
            this.ctrlItems[ctrlItem.getCtrlItemType()] = ctrlItem;
        }else {
            this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);
            if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
                this.ctrlItems_where.push(ctrlItem);
            }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
                this.ctrlItems_having.push(ctrlItem);
            }
        };
		this._updateHavingStatus();
    };

    /**
     * api
     * 处理控制项的移除事件
     */
    Map.prototype.onControlItemRemoved = function(ctrlItem) {
        if($.inArray(ctrlItem.getCtrlItemType(),SCHEMA_TYPE_ARRAY) != -1){
            this.schema[ctrlItem.getCtrlItemType()] = null;
            this.ctrlItems[ctrlItem.getCtrlItemType()] = null;
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
    Map.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };
        if($.inArray(ctrlItem.getCtrlItemType(),SCHEMA_TYPE_ARRAY) != -1) {
            this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
            this.ctrlItems[ctrlItem.getCtrlItemType()] = ctrlItem;
			this._updateHavingStatus();
        }else{
            var index = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) { return o.operation.conditionId == ctrlItem.getOperationItem("conditionId"); });

            if (index > -1) {
                this.schema[ctrlItem.getCtrlItemType()][index] = schemaItem;
                if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
                    this.ctrlItems_where[index] = ctrlItem;
                }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
                    this.ctrlItems_having[index] = ctrlItem;
                }
            }
        }
    };
	
	Map.prototype._updateHavingStatus = function() {
        this.havingEnable = true;
        var that = this;
        SCHEMA_TYPE_ARRAY.forEach(function(item) {
            if (that.schema[item] && that.schema[item].operation["aggr"] && that.schema[item].operation["aggr"] == "none") {
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
    Map.prototype._checkDroppable = function(dropData) {
        if (this.schema[dropData.ctrlItemType]) {
            return {accept: false, message: "该项仅接受一个度量或维度"};
        }


        if (dropData.ctrlItemType == SCHEMA_TYPE_SERIES && dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
            return {accept: false, message: "系列不能是度量"};
        }

        if (dropData.ctrlItemType == SCHEMA_TYPE_REGION && dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
            return {accept: false, message: "区域不能是度量"};
        }

        if (dropData.ctrlItemType == SCHEMA_TYPE_DATA && dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
            return {accept: false, message: "数据不能是维度"};
        }

        return {accept: true};
    };

    Map.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
        this.ctrlItems = {};
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];
    };

    Map.prototype._getQueryCondArr = function() {
    	var schema = this.schema;
    	var condArr = [];
    	SCHEMA_TYPE_ARRAY.forEach(function(item, index) {
    		if (schema[item]) {
				var ormParam = schema[item].type == 'value' ? workbench.workset.OrmCommon.handlColumn_Metric(schema[item]) : 
													  workbench.workset.OrmCommon.handlColumn_Dimension(schema[item]);
				
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

    Map.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_DATA] == null || this.schema[SCHEMA_TYPE_DATA] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【数据】');
        }

        if (this.schema[SCHEMA_TYPE_REGION] == null || this.schema[SCHEMA_TYPE_REGION] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【区域】');
        }

        return result;
    };

    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Map.prototype._getDataOption = function() {
        if (this.schema[SCHEMA_TYPE_DATA] == null || this.schema[SCHEMA_TYPE_DATA] == undefined ||
            this.schema[SCHEMA_TYPE_REGION] == null || this.schema[SCHEMA_TYPE_REGION] == undefined) {
            return false;
        }

        var condArr = this._getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);

        var transformRule = {};
        if (this.schema[SCHEMA_TYPE_SERIES]) {
            transformRule.legend = {
                fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
            }
        }

        transformRule.region = {
            fieldName: this.schema[SCHEMA_TYPE_REGION].fieldName,
            type: this.schema[SCHEMA_TYPE_REGION].type,
            displayText: this.schema[SCHEMA_TYPE_REGION].displayText
        };

        transformRule.keyData = {
            fieldName: this.schema[SCHEMA_TYPE_DATA].operation.alias || this.schema[SCHEMA_TYPE_DATA].fieldName,
            type: this.schema[SCHEMA_TYPE_DATA].type,
            displayText: this.schema[SCHEMA_TYPE_DATA].displayText
        };

        return this._transformData(transformRule, data);
    };


    Map.prototype._transformData = function(transformRule, data) {
        var legend = transformRule.legend;
        var region = transformRule.region;
        var keyData = transformRule.keyData;

        if (legend != null && legend != undefined) {
            return this._transformDataMultiSeries(legend, region, keyData, data);
        } else {
            return this._transformDataSingleSeries(region, keyData, data);
        }
    };

    /**
     * 处理没有Legend的情况，一般为单系列
     * @param region
     * @param data
     * @param keyData
     * @returns {{}}
     * @private
     */
    Map.prototype._transformDataSingleSeries = function(region, keyData, data) {
        var regionData = [];
        $.each(data, function(index, item) {
            regionData.push( item[region.fieldName]);
        });

        var seriesData = [];
        $.each(regionData, function(index, item) {
            var itemData = {
                name: item,
                value: data[index][keyData.fieldName]
            };

            seriesData.push(itemData);
        });

        var option = {};

        var optSeries = [];
        var seriesItem = {
            type: 'map',
            map: 'china',
            data: seriesData
        };
        optSeries.push(seriesItem);
        option.series = optSeries;

        return option;
    };

    /**
     * 处理有Legend的情况，Legend在这里是数组，拆分出来对应为不同的“map”系列
     * @param legend
     * @param region
     * @param keyData
     * @param data
     * @returns {{}}
     * @private
     */
    Map.prototype._transformDataMultiSeries = function(legend, region, keyData, data) {
        var legendData = [];
        $.each(data, function(index, item) {
            legendData.push( item[legend.fieldName]);
        });
        legendData = _.uniq(legendData);

        var regionData = [];
        $.each(data, function(index, item) {
            regionData.push(item[region.fieldName]);
        });

        var that = this;
        var seriesData = [];
        $.each(legendData, function(key, value) {
            seriesData[key] = seriesData[key] || [];

            var itemData = {};
            var itemDatas = [];
            $.each(data, function(index, item) {
                var seriesType = item[that.schema[SCHEMA_TYPE_SERIES].fieldName];
                if (seriesType === value) {
                    itemData = {
                        name: item[that.schema["region"].fieldName],
                        value: data[index][keyData.fieldName]
                    };
                    itemDatas.push(itemData);
                }
            });
            seriesData[key] = itemDatas;
        });

        var option = {};
        option.legend = {
            data: legendData
        };

        var optSeries = [];
        $.each(legendData, function(index, item) {
            var seriesItem = {
                name: item,
                type: 'map',
                map: 'china',
                data: seriesData[index]
            };
            optSeries.push(seriesItem);
        });

        option.series = optSeries;

        return option;
    };

    Map.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Map.prototype._getName = function () {
        return "矢量地图";
    };

    Map.prototype._drawCtrlItems = function() {
        var item = [];
		
		_.forEach(this.ctrlItems, function(ctrlItem) {
			item.push(ctrlItem);
		});
		
		item = item
			.concat(this.ctrlItems_where)
			.concat(this.ctrlItems_having);
		
        var that = this;
        _.forEach(item, function(ctrlItem) {
            if (ctrlItem == null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                return;
            }

            var ctrlItemContainer = that._getCtrlItemContainer(ctrlItem.getCtrlItemType());
            if (ctrlItemContainer) {
                ctrlItemContainer.append(ctrlItem.getDom());
            }
        });
    };

    Map.prototype._initCtrlItems = function() {
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
    win.datavisual.plugin.Map = win.datavisual.plugin.Map || function(config, propertiesConfig) { return new Map(config, propertiesConfig) };
}(jQuery, window));