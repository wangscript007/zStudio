/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "data_scatter_map";

    var SCHEMA_TYPE_LNG  = "lng";
    var SCHEMA_TYPE_LAT  = "lat";
    var SCHEMA_TYPE_SERIES = "series";
    var SCHEMA_TYPE_SYMBOL  = "symbol";
    var SCHEMA_TYPE_LABEL   = "label";
    var SCHEMA_TYPE_VISUALMAP   = "visualMap";
    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_LNG, SCHEMA_TYPE_LAT, SCHEMA_TYPE_SERIES, SCHEMA_TYPE_SYMBOL, SCHEMA_TYPE_LABEL, SCHEMA_TYPE_VISUALMAP];

    /**
     * api
     */
    var Scatter_map = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Scatter_map.prototype.getHtmlElement = function() {
        return this.el[0];
    };

    /**
     * api
     */
    Scatter_map.prototype.getDataSourceInfo = function(){
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
	}; 
	
    /**
     * api
     */
    Scatter_map.prototype.getQueryCondArr = function(){
	   	var schema = this.schema;
    	var condArr = [];
    	SCHEMA_TYPE_ARRAY.forEach(function(item, index) {
    		if (schema[item]) {
				var ormParam = schema[item].type == 'value' ? runtime.workset.OrmCommon.handlColumn_Metric(schema[item]) : 
													  runtime.workset.OrmCommon.handlColumn_Dimension(schema[item]);
				
    			condArr.push(ormParam);
			}
		});
		
        if(schema[SCHEMA_TYPE_WHERE] != null && schema[SCHEMA_TYPE_WHERE] != undefined && schema[SCHEMA_TYPE_WHERE].length > 0){
            $.each(schema[SCHEMA_TYPE_WHERE], function(key, value) {
                if (value && value.fieldName) {
					var ormParam = runtime.workset.OrmCommon.handleWhere(value);
                    condArr.push(ormParam);
                }
            });
        }
		
        if(schema[SCHEMA_TYPE_HAVING] != null && schema[SCHEMA_TYPE_HAVING] != undefined && schema[SCHEMA_TYPE_HAVING].length > 0 ){
            $.each(schema[SCHEMA_TYPE_HAVING], function(key, value) {
                if (value && value.fieldName) {
					var ormParam = value.type == 'value' ? runtime.workset.OrmCommon.handleHaving_Metric(value) : 
														   runtime.workset.OrmCommon.handleHaving_Dimension(value);
													  
                    condArr.push(ormParam);
                }
            });
        }
    	return condArr;
    };
	
    /**
     * api
     * 根据数据加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Scatter_map.prototype.getOption = function(rows) {
        if (this.schema[SCHEMA_TYPE_LNG] == null || this.schema[SCHEMA_TYPE_LNG] == undefined ||
            this.schema[SCHEMA_TYPE_LAT] == null || this.schema[SCHEMA_TYPE_LAT] == undefined) {
            return false;
        }

        var transformRule = {};
        transformRule.lng = {
            fieldName: this.schema[SCHEMA_TYPE_LNG].fieldName,
            type: this.schema[SCHEMA_TYPE_LNG].type,
            displayText: this.schema[SCHEMA_TYPE_LNG].displayText
        };

        transformRule.lat = {
            fieldName: this.schema[SCHEMA_TYPE_LAT].fieldName,
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
                fieldName: this.schema[SCHEMA_TYPE_SYMBOL].fieldName,
                type: this.schema[SCHEMA_TYPE_SYMBOL].type,
                displayText: this.schema[SCHEMA_TYPE_SYMBOL].displayText
            };
        }
        if (this.schema[SCHEMA_TYPE_LABEL]) {
            transformRule.label = {
                fieldName: this.schema[SCHEMA_TYPE_LABEL].fieldName,
                type: this.schema[SCHEMA_TYPE_LABEL].type,
                displayText: this.schema[SCHEMA_TYPE_LABEL].displayText
            };
        }
        if (this.schema[SCHEMA_TYPE_VISUALMAP]) {
            transformRule.visualMap = {
                fieldName: this.schema[SCHEMA_TYPE_VISUALMAP].fieldName,
                type: this.schema[SCHEMA_TYPE_VISUALMAP].type,
                displayText: this.schema[SCHEMA_TYPE_VISUALMAP].displayText
            };
        }

        return this._transformData(transformRule, rows);
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
					}
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
                return size;
            }
        }

        return symbolSizeFun;
    };

    Scatter_map.prototype._mixinRenderOption = function(dataOption) {
        var option = dataOption;

        if (option) {
            // 合并series属性
            var properties = this.schema.properties;
            var propertySeries = properties.series;

            var optionSeries = option.series;
            if (optionSeries != null && optionSeries != undefined &&
                propertySeries != null && propertySeries != undefined) {
                if (_.isPlainObject(propertySeries)) {
                    propertySeries = [propertySeries];
                }

                $.each(optionSeries, function(index, item) {
                    var propIndex = index % propertySeries.length;

                    $.extend(true, item, propertySeries[propIndex]);
                });
            }

            properties = _.omit(properties, "series");
            $.extend(true, option, properties);
        }

        return option;
    };

    Scatter_map.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_LNG] == null || this.schema[SCHEMA_TYPE_LNG] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【经度】未正确设置');
        }

        if (this.schema[SCHEMA_TYPE_LAT] == null || this.schema[SCHEMA_TYPE_LAT] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【纬度】未正确设置');
        }

        return result;
    };

    Scatter_map.prototype.render = function() {
        var result = this._isValid();
        if (result.isValid) {
            var dsInfo = this.getDataSourceInfo();
            var condArr = this.getQueryCondArr();

            var that = this;
            window.runtime.workset.OrmCommon.getChartData(dsInfo, condArr, function(rows) {

                var option = that.getOption(rows);
                option = that._mixinRenderOption(option);
                that._drawChart(option);
            });
        } else {
            this._drawError(result.errorMessages);
        }
    };

    Scatter_map.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Scatter_map.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【矢量地图散点图】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_scatter_map = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Scatter_map(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };
}(jQuery, window));