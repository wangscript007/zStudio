/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "data_gauge";
    var SCHEMA_TYPE_SERIES  = "series";
	var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var Gauge = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Gauge.prototype.getHtmlElement = function() {
        return this.el[0];
    };
    /**
     * override
     * @returns {{datasource: (*|datasource|rtDsInfo.datasource|{id}), dataset: (*|dataset|rtDsInfo.dataset|{name}|DOMStringMap)}}
     */
    Gauge.prototype.getDataSourceInfo = function() {
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
    };

    /**
     *
     * @returns {Array}
     */
    Gauge.prototype.runtime = function() {
        var schema = this.schema;
        var condArr = [];

        $.each(schema[SCHEMA_TYPE_SERIES], function(key, value) {
            if (value && value.fieldName) {
			var ormParam = value.type == 'value' ? runtime.workset.OrmCommon.handlColumn_Metric(value) : 
													  runtime.workset.OrmCommon.handlColumn_Dimension(schema[value]);
				
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
    Gauge.prototype.getOption = function(rows) {
        if ($.isEmptyObject(this.schema)) {
            return false;
        }

        var transformRule = {};
        transformRule.series = [];

        $.each(this.schema[SCHEMA_TYPE_SERIES], function(index, item) {
            transformRule.series.push({
                fieldName: item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });
        return this._transformData(transformRule, rows);
    };

    /**
     *
     * @param transformRule
     * @param data
     * @returns {*}
     * @private
     */
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

    Gauge.prototype._mixinRenderOption = function(dataOption) {
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

    Gauge.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_SERIES].length == 0) {
            result.isValid = false;
            result.errorMessages.push('【系列】未正确设置');
        }

        return result;
    };

    Gauge.prototype.render = function() {
        var result = this._isValid();
        if (result.isValid) {
            var dsInfo = this.getDataSourceInfo();
            var condArr = this.runtime();

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

    Gauge.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Gauge.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【仪表】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_gauge = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Gauge(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };
}(jQuery, window));