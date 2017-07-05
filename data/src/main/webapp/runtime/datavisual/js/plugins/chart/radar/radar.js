/**
 *
 */
(function($, win) {
    var PLUGIN_ID = "data_radar";

    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_RADAR  = "radar";
	var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    /**
     * api
     */
    var Radar = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Radar.prototype.getHtmlElement = function() {
        return this.el[0];
    };

    /**
     * override
     */
    Radar.prototype.getDataSourceInfo = function() {
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
    };

    /**
     * override
     */
    Radar.prototype.getQueryCondArr = function() {
        var schema = this.schema;
        var condArr = [];
        var ormParam = runtime.workset.OrmCommon.handlColumn_Dimension(schema[SCHEMA_TYPE_SERIES]);
				
    	condArr.push(ormParam);
		
		$.each(schema[SCHEMA_TYPE_RADAR], function(key, value) {
            if (value && value.fieldName) {
				var ormParam = value.type == 'value' ? 
								runtime.workset.OrmCommon.handlColumn_Metric(value) : 
								runtime.workset.OrmCommon.handlColumn_Dimension(value);
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
    Radar.prototype.getOption = function(rows) {
        // if (this.schema[SCHEMA_TYPE_RADAR] == null || this.schema[SCHEMA_TYPE_RADAR] == undefined || this.schema[SCHEMA_TYPE_RADAR].length == 0 ||
        //     this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
        //     return false;
        // }

        var transformRule = {};

        transformRule.legend = {
            fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
        };

        transformRule.indicator = [];
        $.each(this.schema[SCHEMA_TYPE_RADAR], function(index, item) {
            transformRule.indicator.push({
                fieldName: item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });

        return this._transformData(transformRule, rows);
    };

    Radar.prototype._transformData = function(transformRule, data) {
        var indicators = transformRule.indicator;
        var legend = transformRule.legend;

        var indicatorData = [];
        $.each(indicators, function(index, item) {
            indicatorData.push({
                name: item.displayText
            });
        });

        var legendData = [];
        $.each(data, function(index, item) {
            legendData.push( item[legend.fieldName]);
        });
        legendData = _.uniq(legendData);

        var seriesData = [];
        $.each(data, function(index, item) {
            var array = [];
            $.each(indicators, function(index, indicator) {
                array.push(item[indicator.fieldName]);
            });

            var seriesItemData = {
                name: item[legend.fieldName],
                value: array
            };
            seriesData.push(seriesItemData);
        });

        var option = {
        };

        option.legend = {
            data: legendData
        };

        _.set(option, 'radar.indicator', indicatorData);

        option.series = [{
            type: 'radar',
            data: seriesData
        }];

        return option;
    };

    Radar.prototype._mixinRenderOption = function(dataOption) {
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

    Radar.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_RADAR] == null || this.schema[SCHEMA_TYPE_RADAR] == undefined || this.schema[SCHEMA_TYPE_RADAR].length == 0) {
            result.isValid = false;
            result.errorMessages.push('【坐标系】未正确设置');
        }

        if (this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【系列】未正确设置');
        }

        return result;
    };

    Radar.prototype.render = function() {
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

    Radar.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Radar.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【雷达图】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_radar = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Radar(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };
}(jQuery, window));