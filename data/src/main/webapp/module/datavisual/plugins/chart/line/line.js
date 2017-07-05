/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "line";

    var SCHEMA_TYPE_Y_AXIS  = "y-axis";
    var SCHEMA_TYPE_X_AXIS  = "x-axis";
    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";
    
    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_X_AXIS, SCHEMA_TYPE_SERIES, SCHEMA_TYPE_Y_AXIS];

    var Line = function(config, propertiesConfig) {
        this.schema = {};
        this.ctrlItems = {};

        this.havingEnable = true;   //having筛选条件框是否灰化
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];

        this.config = config || {};
        this.propertiesConfig = propertiesConfig;
        this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties, this);
        this._initCtrlItems();
        this.datasourceInfo = this.config.datasourceInfo;
        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    datavisual.extend(Line, win.datavisual.plugin.ChartBase);

    Line.prototype.getCssClass = function () {
        return "zdata_line";
    };

    /**
     * api
     */
    Line.prototype.getDesignFileContent = function() {
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
    Line.prototype._getControlPanelHtmlString = function() {
        var html = [];
        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     X轴：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_X_AXIS + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     Y轴：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_Y_AXIS + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
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
    Line.prototype._onControlItemAdded = function(ctrlItem) {
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
    Line.prototype.onControlItemRemoved = function(ctrlItem) {
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
    Line.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem  = {
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

    Line.prototype._updateHavingStatus = function() {
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
    Line.prototype._checkDroppable = function(dropData) {
        if (this.schema[dropData.ctrlItemType]) {
            return {accept: false, message: "该项仅接受一个度量或维度"};
        }

        // 暂时不支持x轴和y轴都是category的情况
        if (dropData.ctrlItemType == SCHEMA_TYPE_X_AXIS && dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION
            && this.schema[SCHEMA_TYPE_Y_AXIS] && this.schema[SCHEMA_TYPE_Y_AXIS].type == "category") {
            return {accept: false, message: "X轴和Y轴不能同时都是维度"};
        }

        if (dropData.ctrlItemType == SCHEMA_TYPE_Y_AXIS && dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION
            && this.schema[SCHEMA_TYPE_X_AXIS] && this.schema[SCHEMA_TYPE_X_AXIS].type == "category") {
            return {accept: false, message: "X轴和Y轴不能同时都是维度"};
        }

        // 暂时不允许同名字段的度量重复出现，后续需要orm支持为column指定别名后方可支持
        if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
            var hasDup = false;
            _.forEach(this.schema, function(item, key) {
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

    Line.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
		
        this.ctrlItems = {};
		this.ctrlItems_where = [];
        this.ctrlItems_having = [];
    };

    Line.prototype._getQueryCondArr = function(){
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

    Line.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_X_AXIS] == null || this.schema[SCHEMA_TYPE_X_AXIS] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【X轴】');
        }

        if (this.schema[SCHEMA_TYPE_Y_AXIS] == null || this.schema[SCHEMA_TYPE_Y_AXIS] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【Y轴】');
        }

        return result;
    };

    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Line.prototype._getDataOption = function() {
        if (this.schema[SCHEMA_TYPE_Y_AXIS] == null || this.schema[SCHEMA_TYPE_Y_AXIS] == undefined ||
            this.schema[SCHEMA_TYPE_X_AXIS] == null || this.schema[SCHEMA_TYPE_X_AXIS] == undefined) {
            return false;
        }

        var condArr = this._getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);

        var transformRule = {};
        transformRule.xAxis = {
            fieldName: this.schema[SCHEMA_TYPE_X_AXIS].operation.alias || this.schema[SCHEMA_TYPE_X_AXIS].fieldName,
            type: this.schema[SCHEMA_TYPE_X_AXIS].type,
            displayText: this.schema[SCHEMA_TYPE_X_AXIS].displayText
        };

        transformRule.yAxis = {
            fieldName: this.schema[SCHEMA_TYPE_Y_AXIS].operation.alias || this.schema[SCHEMA_TYPE_Y_AXIS].fieldName,
            type: this.schema[SCHEMA_TYPE_Y_AXIS].type,
            displayText: this.schema[SCHEMA_TYPE_Y_AXIS].displayText
        };

        if (this.schema[SCHEMA_TYPE_SERIES]) {
            transformRule.legend = {
                fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
            }
        }

        return this._transformData(transformRule, data);
    };

    Line.prototype._transformData = function(transformRule, data) {
        var xAxis = transformRule.xAxis;
        var yAxis = transformRule.yAxis;
        var legend = transformRule.legend;

        if (xAxis.type == 'value' && yAxis.type == 'value') {
            return this._transformDataXVYV(xAxis, yAxis, legend, data);
        } else if (xAxis.type == 'value' && yAxis.type == 'category') {
            return this._transformDataXVYC(xAxis, yAxis, legend, data);
        } else if (xAxis.type == 'category' && yAxis.type == 'value') {
            return this._transformDataXCYV(xAxis, yAxis, legend, data);
        }

        return {};
    };

    Line.prototype._transformDataXVYV = function(xAxis, yAxis, legend, data) {
        var legendData = [];
        if  (legend) {
            $.each(data, function(index, item) {
                legendData.push(item[legend.fieldName]);
            });
            legendData = _.uniq(legendData);
        }

        var serieData = [];
        $.each(data, function(index, item) {
            var legendIndex = 0;
            if  (legend) {
                legendIndex = _.indexOf(legendData, item[legend.fieldName]);
                if (legendIndex < 0) {
                    return;
                }
            }

            serieData[legendIndex] = serieData[legendIndex] || [];

            var array = [];

            array.push(item[xAxis.fieldName]);
            array.push(item[yAxis.fieldName]);

            serieData[legendIndex].push(array);
        });


        var option = {};

        option.legend = {
            data: legendData
        };

        option.xAxis = {
            type: xAxis.type,
            name: xAxis.displayText
        };

        option.yAxis = {
            type: yAxis.type,
            name: yAxis.displayText,
        };

        var that = this;
        var optSeries = [];
        $.each(serieData, function(index, item) {
            var serieName = legendData.length  == 0 ? "" : legendData[index];

            var serieItem = {
                name: serieName,
                type: 'line',
                data: item
            };

            optSeries.push(serieItem);
        });
        option.series = optSeries;

        return option;
    };

    Line.prototype._transformDataXVYC = function(xAxis, yAxis, legend, data) {
        var legendData = [];
        if  (legend) {
            $.each(data, function(index, item) {
                legendData.push(item[legend.fieldName]);
            });
            legendData = _.uniq(legendData);
        }

        var yAxisData = [];
        $.each(data, function(index, item) {
            yAxisData.push(item[yAxis.fieldName]);
        });
        yAxisData = _.uniq(yAxisData);

        var serieData = [];
        $.each(data, function(index, item) {
            var legendIndex = 0;
            if  (legend) {
                legendIndex = _.indexOf(legendData, item[legend.fieldName]);
                if (legendIndex < 0) {
                    return;
                }
            }

            serieData[legendIndex] = serieData[legendIndex] || [];

            var yAxisIndex = _.indexOf(yAxisData, item[yAxis.fieldName]);
            if (yAxisIndex < 0) {
                return;
            }

            serieData[legendIndex][yAxisIndex] = item[xAxis.fieldName];
        });


        var option = {};

        option.legend = {
            data: legendData
        };

        option.xAxis = {
            type: xAxis.type,
            name: xAxis.displayText
        };

        option.yAxis = {
            type: yAxis.type,
            name: yAxis.displayText,
            data: yAxisData
        };

        var optSeries = [];
        $.each(serieData, function(index, item) {
            var serieName = legendData.length  == 0 ? "" : legendData[index];

            var serieItem = {
                name: serieName,
                type: 'line',
                data: item
            };

            optSeries.push(serieItem);
        });
        option.series = optSeries;

        return option;
    };

    Line.prototype._transformDataXCYV = function(xAxis, yAxis, legend, data) {
        var legendData = [];
        if  (legend) {
            $.each(data, function(index, item) {
                legendData.push(item[legend.fieldName]);
            });
            legendData = _.uniq(legendData);
        }


        var xAxisData = [];
        $.each(data, function(index, item) {
            xAxisData.push(item[xAxis.fieldName]);
        });
        xAxisData = _.uniq(xAxisData);

        var serieData = [];
        $.each(data, function(index, item) {
            var legendIndex = 0;
            if  (legend) {
                legendIndex = _.indexOf(legendData, item[legend.fieldName]);
                if (legendIndex < 0) {
                    return;
                }
            }

            serieData[legendIndex] = serieData[legendIndex] || [];

            var xAxisIndex = _.indexOf(xAxisData, item[xAxis.fieldName]);
            if (xAxisIndex < 0) {
                return;
            }

            serieData[legendIndex][xAxisIndex] = item[yAxis.fieldName];
        });


        var option = {};

        option.legend = {
            data: legendData
        };

        option.xAxis = {
            type: xAxis.type,
            name: xAxis.displayText,
            data: xAxisData
        };

        option.yAxis = {
            type: yAxis.type,
            name: yAxis.displayText,
        };

        var optSeries = [];
        $.each(serieData, function(index, item) {
            var serieName = legendData.length  == 0 ? "" : legendData[index];

            var serieItem = {
                name: serieName,
                type: 'line',
                data: item
            };

            optSeries.push(serieItem);
        });
        option.series = optSeries;

        return option;
    };

    Line.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Line.prototype._getName = function () {
        return "折线图";
    };

    Line.prototype._drawCtrlItems = function() {
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

    Line.prototype._initCtrlItems = function() {
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
    win.datavisual.plugin.Line = win.datavisual.plugin.Line || function(config, propertiesConfig) { return new Line(config, propertiesConfig) };
    }(jQuery, window));