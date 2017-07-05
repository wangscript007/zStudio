/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "data_pie";

    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_ANGLE  = "angle";
	var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_SERIES, SCHEMA_TYPE_ANGLE];

    var Pie = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Pie.prototype.getHtmlElement = function() {
        return this.el[0];
    };

    /**
     * override
     */
    Pie.prototype.getDataSourceInfo = function() {
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
    };

    /**
     * override
     */
    Pie.prototype.getQueryCondArr = function() {
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
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Pie.prototype.getOption = function(rows) {
        var transformRule = {};
        if (this.schema[SCHEMA_TYPE_SERIES]) {
            transformRule.legend = {
                fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
            }
        }

        if (this.schema[SCHEMA_TYPE_ANGLE]) {
            transformRule.angle = {
                fieldName: this.schema[SCHEMA_TYPE_ANGLE].fieldName,
                displayText: this.schema[SCHEMA_TYPE_ANGLE].displayText
            }
        }

        var option = this._transformData(transformRule, rows);
        return option;
    };

    Pie.prototype._transformData = function(transformRule, data) {
        var legend = transformRule.legend;
        var angle = transformRule.angle;

        return this._transformDataLA(legend, angle, data);
    };

    Pie.prototype._transformDataLA = function(legend, angle, data) {
        var legendData = [];
        $.each(data, function(index, item) {
            legendData.push(item[legend.fieldName]);
        });
        legendData = _.uniq(legendData);

        var option = {};

        option.legend = {
            data: legendData
        };

        var optSeries = [];
        var seriesData = [];
        $.each(data, function(index, item) {
            var optData = {
                name: item[legend.fieldName],
                value: item[angle.fieldName]
            };
            seriesData.push(optData);
        });

        seriesData = seriesData.length == 0 ? [0] : seriesData;
        var seriesOption = {
            name: angle.displayText,
            type: "pie",
            data: seriesData
        };
        optSeries.push(seriesOption);
        option.series = optSeries;

        return option;
    };

    Pie.prototype._mixinRenderOption = function(dataOption) {
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

    Pie.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_ANGLE] == null || this.schema[SCHEMA_TYPE_ANGLE] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【角度】未正确设置');
        }

        if (this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【系列】未正确设置');
        }

        return result;
    };

    Pie.prototype.render = function() {
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

    Pie.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Pie.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【饼图】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_pie = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Pie(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };
}(jQuery, window));