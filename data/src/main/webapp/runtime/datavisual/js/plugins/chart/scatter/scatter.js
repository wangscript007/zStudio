/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "data_scatter";
    var SCHEMA_TYPE_Y_AXIS  = "y-axis";
    var SCHEMA_TYPE_X_AXIS  = "x-axis";
    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_SYMBOL  = "symbol";
    var SCHEMA_TYPE_LABEL   = "label";
	var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";
    
    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_Y_AXIS, SCHEMA_TYPE_X_AXIS, SCHEMA_TYPE_SERIES, SCHEMA_TYPE_SYMBOL, SCHEMA_TYPE_LABEL];

    /**
     * api
     */
    var Scatter = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Scatter.prototype.getHtmlElement = function() {
        return this.el[0];
    };
    /**
     * api
     */
	Scatter.prototype.getDataSourceInfo = function(){
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
	}; 
	
    /**
     * api
     */
	Scatter.prototype.getQueryCondArr = function(){
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
    Scatter.prototype.getOption = function(rows) {
        if (this.schema[SCHEMA_TYPE_Y_AXIS] == null || this.schema[SCHEMA_TYPE_Y_AXIS] == undefined ||
            this.schema[SCHEMA_TYPE_X_AXIS] == null || this.schema[SCHEMA_TYPE_X_AXIS] == undefined) {
            return false;
        }

        var transformRule = {};
        transformRule.xAxis = {
            fieldName: this.schema[SCHEMA_TYPE_X_AXIS].fieldName,
            type: this.schema[SCHEMA_TYPE_X_AXIS].type,
            displayText: this.schema[SCHEMA_TYPE_X_AXIS].displayText
        };

        transformRule.yAxis = {
            fieldName: this.schema[SCHEMA_TYPE_Y_AXIS].fieldName,
            type: this.schema[SCHEMA_TYPE_Y_AXIS].type,
            displayText: this.schema[SCHEMA_TYPE_Y_AXIS].displayText
        };

        if (this.schema[SCHEMA_TYPE_SERIES]) {
            transformRule.legend = {
                fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
            }
        }

        if (this.schema[SCHEMA_TYPE_SYMBOL]) {
            transformRule.symbol = {
                fieldName: this.schema[SCHEMA_TYPE_SYMBOL].fieldName
            }
        }

        if (this.schema[SCHEMA_TYPE_LABEL]) {
            transformRule.label = {
                fieldName: this.schema[SCHEMA_TYPE_LABEL].fieldName
            }
        }

        var option = this._transformData(transformRule, rows);
        return option;
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

    Scatter.prototype._mixinRenderOption = function(dataOption) {
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

    Scatter.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_X_AXIS] == null || this.schema[SCHEMA_TYPE_X_AXIS] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【X轴】未正确设置');
        }

        if (this.schema[SCHEMA_TYPE_Y_AXIS] == null || this.schema[SCHEMA_TYPE_Y_AXIS] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【Y轴】未正确设置');
        }

        return result;
    };

    Scatter.prototype.render = function() {
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

    Scatter.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Scatter.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【直角坐标系散点图】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_scatter = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Scatter(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };
}(jQuery, window));