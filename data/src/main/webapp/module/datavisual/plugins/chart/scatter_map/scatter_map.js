/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "scatter_map";

    var SCHEMA_TYPE_LNG  = "lng";
    var SCHEMA_TYPE_LAT  = "lat";
    var SCHEMA_TYPE_SERIES = "series";
    var SCHEMA_TYPE_SYMBOL  = "symbol";
    var SCHEMA_TYPE_LABEL   = "label";
    var SCHEMA_TYPE_VISUALMAP   = "visualMap";

    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_LNG, SCHEMA_TYPE_LAT, SCHEMA_TYPE_SERIES, SCHEMA_TYPE_SYMBOL, SCHEMA_TYPE_LABEL, SCHEMA_TYPE_VISUALMAP];

    var Scatter_map = function(config, propertiesConfig) {
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

    datavisual.extend(Scatter_map, win.datavisual.plugin.ChartBase);

    /**
     * api
     */
    Scatter_map.prototype.getCssClass = function () {
        return "zdata_scatter_map";
    };

    /**
     * api
     */
    Scatter_map.prototype._getControlPanelHtmlString = function() {
        var html = [];

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     经度：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_LNG + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     纬度：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_LAT + '">');
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
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     标签：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_LABEL + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     视觉映射：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_VISUALMAP + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    Scatter_map.prototype.getDesignFileContent = function() {
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
    Scatter_map.prototype._onControlItemAdded = function(ctrlItem) {
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
    Scatter_map.prototype.onControlItemRemoved = function(ctrlItem) {
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
     */
    Scatter_map.prototype.redraw = function() {
        // 覆盖chart_base中的redraw方法，利用echart.dispose后重建的方式
        // 解决矢量地图重绘后，散点位置与地图在缩放时发生的错误bug，并去掉了resize的调用
        var result = this._isValid();

        if (result.isValid) {
            this._disposeChart();
            this._initChart();
            this.chart.clear();

            // TODO _getDataOption目前又做了一次valid判断，是否必要??
            var dataOption = this._getDataOption();   // 暂时实现为数据获取是同步的方式
            if (dataOption) {
                var option = this._mixinRenderOption(dataOption);
                this.chart.setOption(option);
            }

            // var option = this._getDataOption();
            // option = this._mixinRenderOption(option);
            // this.chart.setOption(option);
        } else {
            this._drawError(result.errorMessages);
        }
    };

    /**
     * api
     * 处理控制项的更新事件。
     * 主要是其数据的更新，例如排序方式、聚合方式等等
     */
    Scatter_map.prototype.onControlItemUpdated = function(ctrlItem) {
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
	
	Scatter_map.prototype._updateHavingStatus = function() {
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
    Scatter_map.prototype._checkDroppable = function(dropData) {
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
        } else if (dropData.ctrlItemType == SCHEMA_TYPE_VISUALMAP) {
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                return {accept: false, message: "【视觉映射】只支持一个度量"};
            }
        } else if (dropData.ctrlItemType == SCHEMA_TYPE_LNG || dropData.ctrlItemType == SCHEMA_TYPE_LAT) {
            if (dropData.field.dataType != DATA_MODEL.DATATYPE_DECIMAL && dropData.field.dataType != DATA_MODEL.DATATYPE_DOUBLE) {
                return {accept: false, message: "该项必须是浮点类型的值"};
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

    Scatter_map.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
        this.ctrlItems = {};
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];
    };

    Scatter_map.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_LNG] == null || this.schema[SCHEMA_TYPE_LNG] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【经度】');
        }

        if (this.schema[SCHEMA_TYPE_LAT] == null || this.schema[SCHEMA_TYPE_LAT] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【纬度】');
        }

        return result;
    };

    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Scatter_map.prototype._getDataOption = function() {
        if (this.schema[SCHEMA_TYPE_LNG] == null || this.schema[SCHEMA_TYPE_LNG] == undefined ||
            this.schema[SCHEMA_TYPE_LAT] == null || this.schema[SCHEMA_TYPE_LAT] == undefined) {
            return false;
        }

        var condArr = this._getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);
        
        var transformRule = {};
        transformRule.lng = {
            fieldName: this.schema[SCHEMA_TYPE_LNG].operation.alias || this.schema[SCHEMA_TYPE_LNG].fieldName,
            type: this.schema[SCHEMA_TYPE_LNG].type,
            displayText: this.schema[SCHEMA_TYPE_LNG].displayText
        };

        transformRule.lat = {
            fieldName: this.schema[SCHEMA_TYPE_LAT].operation.alias || this.schema[SCHEMA_TYPE_LAT].fieldName,
            type: this.schema[SCHEMA_TYPE_LAT].type,
            displayText: this.schema[SCHEMA_TYPE_LAT].displayText
        };

        if (this.schema[SCHEMA_TYPE_SERIES]) {
            transformRule.legend = {
                fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName,
                type: this.schema[SCHEMA_TYPE_SERIES].type,
                displayText: this.schema[SCHEMA_TYPE_SERIES].displayText
            };
        }

        if (this.schema[SCHEMA_TYPE_SYMBOL]) {
            transformRule.symbol = {
                fieldName: this.schema[SCHEMA_TYPE_SYMBOL].operation.alias || this.schema[SCHEMA_TYPE_SYMBOL].fieldName,
                type: this.schema[SCHEMA_TYPE_SYMBOL].type,
                displayText: this.schema[SCHEMA_TYPE_SYMBOL].displayText
            };
        }
        if (this.schema[SCHEMA_TYPE_LABEL]) {
            transformRule.label = {
                fieldName: this.schema[SCHEMA_TYPE_LABEL].operation.alias || this.schema[SCHEMA_TYPE_LABEL].fieldName,
                type: this.schema[SCHEMA_TYPE_LABEL].type,
                displayText: this.schema[SCHEMA_TYPE_LABEL].displayText
            };
        }
        if (this.schema[SCHEMA_TYPE_VISUALMAP]) {
            transformRule.visualMap = {
                fieldName: this.schema[SCHEMA_TYPE_VISUALMAP].operation.alias || this.schema[SCHEMA_TYPE_VISUALMAP].fieldName,
                type: this.schema[SCHEMA_TYPE_VISUALMAP].type,
                displayText: this.schema[SCHEMA_TYPE_VISUALMAP].displayText
            };
        }

        return this._transformData(transformRule, data);
    };

    Scatter_map.prototype._getQueryCondArr = function() {
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
    
    Scatter_map.prototype._transformData = function(transformRule, data) {
        var lng = transformRule.lng;
        var lat = transformRule.lat;
        var legend = transformRule.legend;
        var symbol = transformRule.symbol;
        var label = transformRule.label;
        var visualMap = transformRule.visualMap;

        var transformData;
        if (legend) {
            transformData = this._transformDataMultiSeries(lng, lat, legend, symbol, label, visualMap, data);
        } else {
            transformData = this._transformDataSingleSeries(lng, lat, symbol, label, visualMap, data);
        }

        var symbolSizeFun = this._getSymbolSizeFunc(symbol, data, transformData.symbolDataIndex);

        var optionSeries = [];
        $.each(transformData.seriesData, function(index, item) {
            var optionItem = {
                type: 'scatter',
                coordinateSystem: 'geo',
                data: item
            };
            if (legend) {
                optionItem.name = transformData.legendData[index];
            } else {
                optionItem.name = "";
            }

            if (symbol) {
                optionItem.symbolSize = symbolSizeFun;
            }

            if (label) {
                optionItem.label = {
                    normal: {
                        show: true,
                        formatter: function (param) {
                            return param.data[transformData.labelDataIndex];
                        }
                    }
                }
            }

            optionSeries.push(optionItem);
        });

        var option = {};
        if (legend) {
            option.legend = {data: transformData.legendData};
        }

        if (visualMap) {
			if (data.length > 0) {
				var visualMap_min = data[0][visualMap.fieldName];
				var visualMap_max = data[0][visualMap.fieldName];
				$.each(data, function(index, item) {
					var visualMapValue = item[visualMap.fieldName];
					visualMap_min = Math.min(visualMap_min, visualMapValue);
					visualMap_max = Math.max(visualMap_max, visualMapValue);
				});

				option.visualMap = {
					show: true,
					min: visualMap_min,
					max: visualMap_max,
					dimension: transformData.visualMapDataIndex,
					calculable: true,
					inRange: {
						color: ['#50a3ba', '#eac736', '#d94e5d']
					},
					borderColor: "#fff"
				}
			} else {
				option.visualMap = {
					show: false
				}
			}
        }

        option.series = optionSeries;

        return option;
    };

    Scatter_map.prototype._transformDataSingleSeries = function(lng, lat, symbol, label, visualMap, data) {
        var seriesData = [];
        seriesData[0] = [];

        var symbolDataIndex = 0;
        var visualMapDataIndex = 0;
        var labelDataIndex = 0;

        $.each(data, function(index, item) {
            var itemSerieData = [];
            itemSerieData.push(item[lng.fieldName]);
            itemSerieData.push(item[lat.fieldName]);
            if (symbol) {
                itemSerieData.push(item[symbol.fieldName]);

                symbolDataIndex = itemSerieData.length - 1;
            }
            if (visualMap) {
                itemSerieData.push(item[visualMap.fieldName]);

                visualMapDataIndex = itemSerieData.length - 1;
            }
            // label 必须放在最后
            if (label) {
                itemSerieData.push(item[label.fieldName]);

                labelDataIndex = itemSerieData.length - 1;
            }
            seriesData[0].push(itemSerieData);
        });

        return {
            seriesData: seriesData,
            symbolDataIndex: symbolDataIndex,
            visualMapDataIndex: visualMapDataIndex,
            labelDataIndex: labelDataIndex
        }
    };

    Scatter_map.prototype._transformDataMultiSeries = function(lng, lat, legend, symbol, label, visualMap, data) {
        var legendData = [];
        $.each(data, function(index, item) {
            legendData.push( item[legend.fieldName]);
        });
        legendData = _.uniq(legendData);

        var seriesData = [];
        var symbolDataIndex = 0;
        var visualMapDataIndex = 0;
        var labelDataIndex = 0;

        $.each(legendData, function(key, value) {
            seriesData[key] = seriesData[key] || [];

            $.each(data, function(index, item) {
                var itemSerieData = [];
                if (item[legend.fieldName] == value) {
                    itemSerieData.push(item[lng.fieldName]);
                    itemSerieData.push(item[lat.fieldName]);
                    if (symbol) {
                        itemSerieData.push(item[symbol.fieldName]);

                        symbolDataIndex = itemSerieData.length - 1;
                    }
                    if (visualMap) {
                        itemSerieData.push(item[visualMap.fieldName]);

                        visualMapDataIndex = itemSerieData.length - 1;
                    }

                    // label 必须放在最后
                    if (label) {
                        itemSerieData.push(item[label.fieldName]);

                        labelDataIndex = itemSerieData.length - 1;
                    }

                    seriesData[key].push(itemSerieData);
                }
            });
        });

        return {
            legendData: legendData,
            seriesData: seriesData,
            symbolDataIndex: symbolDataIndex,
            visualMapDataIndex: visualMapDataIndex,
            labelDataIndex: labelDataIndex
        }
    };

    Scatter_map.prototype._getSymbolSizeFunc = function(symbol, data, symbolDataIndex) {
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
                var size = Math.abs((data[symbolDataIndex] - min) / span);
                size = Math.ceil(size * 25);
                size = size + 1;
				console.log('size=' + size);
                return size;
            }
        }

        return symbolSizeFun;
    };

    Scatter_map.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Scatter_map.prototype._getName = function () {
        return "矢量地图散点图";
    };

    Scatter_map.prototype._drawCtrlItems = function() {
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

    Scatter_map.prototype._initCtrlItems = function() {
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
    win.datavisual.plugin.Scatter_map = win.datavisual.plugin.Scatter_map || function (config, propertiesConfig) {
            return new Scatter_map(config, propertiesConfig);
        };
}(jQuery, window));