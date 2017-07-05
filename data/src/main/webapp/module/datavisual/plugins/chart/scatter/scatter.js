/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "scatter";

    var SCHEMA_TYPE_Y_AXIS  = "y-axis";
    var SCHEMA_TYPE_X_AXIS  = "x-axis";
    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_SYMBOL  = "symbol";
    var SCHEMA_TYPE_LABEL   = "label";
    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";
    
    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_Y_AXIS, SCHEMA_TYPE_X_AXIS, SCHEMA_TYPE_SERIES, SCHEMA_TYPE_SYMBOL, SCHEMA_TYPE_LABEL];

    var Scatter = function(config, propertiesConfig) {
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

    datavisual.extend(Scatter, win.datavisual.plugin.ChartBase);

    Scatter.prototype.getCssClass = function () {
        return "zdata_scatter";
    };

    Scatter.prototype.getDesignFileContent = function() {
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
    Scatter.prototype._getControlPanelHtmlString = function() {
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
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     符号：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_SYMBOL + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     标签：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_LABEL + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    /**
     * api
     */
    Scatter.prototype._onControlItemAdded = function(ctrlItem) {
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
    Scatter.prototype.onControlItemRemoved = function(ctrlItem) {
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
    Scatter.prototype.onControlItemUpdated = function(ctrlItem) {
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
	
	Scatter.prototype._updateHavingStatus = function() {
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
     *      target: droppable, //例如X轴、Y轴对应的DOM对象
            ctrlItemType: <item-type>   //例如xAxis, yAxis等
     * }
     */
    Scatter.prototype._checkDroppable = function(dropData) {
        if (this.schema[dropData.ctrlItemType]) {
            return {accept: false, message: "该项仅接受一个度量或维度"};
        }

        if (dropData.ctrlItemType == SCHEMA_TYPE_SERIES) {
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
                return {accept: false, message: "【系列】只支持一个维度"};
            }
        } else if (dropData.ctrlItemType == SCHEMA_TYPE_SYMBOL) {
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                return {accept: false, message: "【符号】只支持一个度量"};
            }
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

    Scatter.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
        this.ctrlItems = {};
	this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];
    };

    Scatter.prototype._isValid = function () {
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
    Scatter.prototype._getDataOption = function() {
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
                fieldName: this.schema[SCHEMA_TYPE_SERIES].operation.alias || this.schema[SCHEMA_TYPE_SERIES].fieldName
            }
        }

        if (this.schema[SCHEMA_TYPE_SYMBOL]) {
            transformRule.symbol = {
                fieldName: this.schema[SCHEMA_TYPE_SYMBOL].operation.alias || this.schema[SCHEMA_TYPE_SYMBOL].fieldName
            }
        }

        if (this.schema[SCHEMA_TYPE_LABEL]) {
            transformRule.label = {
                fieldName:  this.schema[SCHEMA_TYPE_LABEL].operation.alias || this.schema[SCHEMA_TYPE_LABEL].fieldName
            }
        }

        return this._transformData(transformRule, data);
    };
    

    Scatter.prototype._getQueryCondArr = function() {
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

    Scatter.prototype._transformData = function(transformRule, data) {
        var xAxis = transformRule.xAxis;
        var yAxis = transformRule.yAxis;
        var legend = transformRule.legend;
        var symbol = transformRule.symbol;
        var label = transformRule.label;

        var option = this._makeLegendAndSerie(xAxis, yAxis, legend, symbol, label, data);

        if (xAxis.type == 'value' && yAxis.type == 'value') {
            return this._transformDataXVYV(xAxis, yAxis, option);
        } else if (xAxis.type == 'value' && yAxis.type == 'category') {
            return this._transformDataXVYC(xAxis, yAxis, option, data);
        } else if (xAxis.type == 'category' && yAxis.type == 'value') {
            return this._transformDataXCYV(xAxis, yAxis, option, data);
        } else if (xAxis.type == 'category' && yAxis.type == 'category') {
            return this._transformDataXCYC(xAxis, yAxis, option, data);
        }

        return {};
    };

    Scatter.prototype._makeLegendAndSerie = function(xAxis, yAxis, legend, symbol, label, data) {
        var legendData = [];
        var serieData = [];
        if (legend) {
            $.each(data, function (index, item) {
                // TODO 对于legend字段是数字类型时，界面无法正常显示legend图例，需要转换成字符串
                legendData.push(item[legend.fieldName]);
            });
            legendData = _.uniq(legendData);

            $.each(data, function(index, item) {
                // TODO 对于legend字段是数字类型时，界面无法正常显示legend图例，需要转换成字符串
                // TODO 但是若上面legend转换成字符串后，这里的查找就会失效，需要统一考虑如何处理
                var legendIndex = _.indexOf(legendData, item[legend.fieldName]);
                if (legendIndex < 0) {
                    return;
                }
                serieData[legendIndex] = serieData[legendIndex] || [];

                var array = [];
                array.push(item[xAxis.fieldName]);
                array.push(item[yAxis.fieldName]);
                if (symbol) {
                    array.push(item[symbol.fieldName]);
                }
                if (label) {
                    array.push(item[label.fieldName]);
                }

                serieData[legendIndex].push(array);
            });
        } else {
            serieData[0] = [];
            $.each(data, function(index, item) {
                var array = [];
                array.push(item[xAxis.fieldName]);
                array.push(item[yAxis.fieldName]);
                if (symbol) {
                    array.push(item[symbol.fieldName]);
                }
                if (label) {
                    array.push(item[label.fieldName]);
                }

                serieData[0].push(array);
            });
        }

        var symbolSizeFun = null;
        if (symbol && data.length > 0) {
            var min = data[0][symbol.fieldName];
            var max = data[0][symbol.fieldName];
            $.each(data, function(index, item) {
                var symbolValue = item[symbol.fieldName];
                min = Math.min(min, symbolValue);
                max = Math.max(max, symbolValue);
            });

            var span = max - min;
            symbolSizeFun = function (data) {
                var size = Math.abs((data[2] - min) / span);
                size = Math.ceil(size * 55);
                size = size + 5;
                return size;
            }
        }

        var option = {
            legend: {
                data: legendData
            },
            series: []
        };

        var that = this;
        $.each(serieData, function(index, item) {
            var serieName = legendData.length  == 0 ? "" : legendData[index];

            var serieItem = {
                name: serieName,
                type: 'scatter',
                data: item
            };

            if (symbol) {
                serieItem.symbolSize = symbolSizeFun;
            }

            if (label) {
                serieItem.label = {
                    normal: {
                        show: true,
                        formatter: function (param) {
                            return param.data[param.data.length - 1];
                        }
                    }
                }
            }

            option.series.push(serieItem);
        });

        return option;
    };

    Scatter.prototype._transformDataXVYV = function(xAxis, yAxis, option) {
        option.xAxis = {
            type: xAxis.type,
            name: xAxis.displayText
        };

        option.yAxis = {
            type: yAxis.type,
            name: yAxis.displayText
        };

        return option;
    };

    Scatter.prototype._transformDataXVYC = function(xAxis, yAxis, option, data) {
        var yAxisData = [];
        $.each(data, function(index, item) {
            yAxisData.push(item[yAxis.fieldName]);
        });
        yAxisData = _.uniq(yAxisData);

        option.xAxis = {
            type: xAxis.type,
            name: xAxis.displayText
        };

        option.yAxis = {
            type: yAxis.type,
            name: yAxis.displayText,
            data: yAxisData
        };

        return option;
    };

    Scatter.prototype._transformDataXCYV = function(xAxis, yAxis, option, data) {
        var xAxisData = [];
        $.each(data, function(index, item) {
            xAxisData.push(item[xAxis.fieldName]);
        });
        xAxisData = _.uniq(xAxisData);

        option.xAxis = {
            type: xAxis.type,
            name: xAxis.displayText,
            data: xAxisData
        };

        option.yAxis = {
            type: yAxis.type,
            name: yAxis.displayText
        };

        return option;
    };

    Scatter.prototype._transformDataXCYC = function(xAxis, yAxis, option, data) {
        var xAxisData = [];
        $.each(data, function(index, item) {
            xAxisData.push(item[xAxis.fieldName]);
        });
        xAxisData = _.uniq(xAxisData);

        var yAxisData = [];
        $.each(data, function(index, item) {
            yAxisData.push(item[yAxis.fieldName]);
        });
        yAxisData = _.uniq(yAxisData);

        option.xAxis = {
            type: xAxis.type,
            name: xAxis.displayText,
            data: xAxisData
        };

        option.yAxis = {
            type: yAxis.type,
            name: yAxis.displayText,
            data: yAxisData
        };

        return option;
    };

    Scatter.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Scatter.prototype._getName = function () {
        return "直角坐标系散点图";
    };

    Scatter.prototype._drawCtrlItems = function() {
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

    Scatter.prototype._initCtrlItems = function() {
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
    win.datavisual.plugin.Scatter = win.datavisual.plugin.Scatter || function (config, propertiesConfig) {
            return new Scatter(config, propertiesConfig);
        };
}(jQuery, window));