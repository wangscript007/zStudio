/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "data_funnel";
    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_DATA  = "data";
	var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_SERIES, SCHEMA_TYPE_DATA];

    var Funnel = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Funnel.prototype.getHtmlElement = function() {
        return this.el[0];
    };

    /**
     * override
     * @returns
     */
    Funnel.prototype.getDataSourceInfo = function() {
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
    };

    /**
     *
     * @returns {Array}
     */
    Funnel.prototype.getQueryCondArr = function() {
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
    Funnel.prototype.getOption = function(rows) {
        var transformRule = {};
        if (this.schema[SCHEMA_TYPE_SERIES]) {
            transformRule.legend = {
                fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
            }
        }

        if (this.schema[SCHEMA_TYPE_DATA]) {
            transformRule.dataItem = {
                fieldName: this.schema[SCHEMA_TYPE_DATA].fieldName,
                type: this.schema[SCHEMA_TYPE_DATA].type,
                displayText: this.schema[SCHEMA_TYPE_DATA].displayText
            }
        }

        return this._transformData(transformRule, rows);
    };

    /**
     *
     * @param transformRule
     * @param data
     * @returns {*}
     * @private
     */
    Funnel.prototype._transformData = function(transformRule, data) {
        var legend = transformRule.legend;
        var dataItem = transformRule.dataItem;

        var legendData = [];
        $.each(data, function(index, item) {
            legendData.push( item[legend.fieldName]);
        });
        legendData = _.uniq(legendData);

        var option = {};

        option.legend = {
            data: legendData
        };

        var seriesData = [];
        $.each(data, function(index, item) {
            var optData = {
                name: item[legend.fieldName],
                value: item[dataItem.fieldName]
            };
            seriesData.push(optData);
        });
        var seriesOption = {
            name: dataItem.displayText,
            type: "funnel",
            data: seriesData
        };
        option.series = [seriesOption];

        return option;
    };

    Funnel.prototype._mixinRenderOption = function(dataOption) {
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

    Funnel.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【系列】未正确设置');
        }

        if (this.schema[SCHEMA_TYPE_DATA] == null || this.schema[SCHEMA_TYPE_DATA] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【数据】未正确设置');
        }

        return result;
    };

    Funnel.prototype.render = function() {
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

    Funnel.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Funnel.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【漏斗图】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_funnel = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Funnel(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };
}(jQuery, window));