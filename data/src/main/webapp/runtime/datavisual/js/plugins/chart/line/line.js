/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "data_line";

    var SCHEMA_TYPE_Y_AXIS  = "y-axis";
    var SCHEMA_TYPE_X_AXIS  = "x-axis";
    var SCHEMA_TYPE_SERIES  = "series";
	var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_X_AXIS, SCHEMA_TYPE_SERIES, SCHEMA_TYPE_Y_AXIS];

    /**
     * api
     */
    var Line = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Line.prototype.getHtmlElement = function() {
        return this.el[0];
    };
    /**
     * api
     */
    Line.prototype.getDataSourceInfo = function() {
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
    };

    /**
     * api
     */
    Line.prototype.getQueryCondArr = function() {
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
    Line.prototype.getOption = function(rows) {
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

        var option = this._transformData(transformRule, rows);
        return option;
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

    Line.prototype._mixinRenderOption = function(dataOption) {
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

    Line.prototype._isValid = function () {
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

    Line.prototype.render = function() {
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

    Line.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Line.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【折线图】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_line = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Line(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };
}(jQuery, window));