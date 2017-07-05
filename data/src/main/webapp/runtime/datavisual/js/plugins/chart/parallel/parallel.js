/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "data_parallel";
    var SCHEMA_TYPE_SERIES  = "series";
	var SCHEMA_TYPE_VISUALMAP   = "visualMap";
    var SCHEMA_TYPE_PARALLEL_AXIS  = "parallel-axis";
	var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

	var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_SERIES, SCHEMA_TYPE_VISUALMAP];
	
    /**
     * api
     */
    var Parallel = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Parallel.prototype.getHtmlElement = function() {
        return this.el[0];
    };
    /**
     * override
     */
    Parallel.prototype.getDataSourceInfo = function() {
    	return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
    };
    
    /**
     * override
     */
    Parallel.prototype.getQueryCondArr = function() {
		var schema = this.schema;
    	var condArr = [];
		/*
		var ormParam = schema[SCHEMA_TYPE_SERIES] == 'value' ? runtime.workset.OrmCommon.handlColumn_Metric(schema[SCHEMA_TYPE_SERIES]) : 
													  runtime.workset.OrmCommon.handlColumn_Dimension(schema[SCHEMA_TYPE_SERIES]);
				
    	condArr.push(ormParam);
		*/
		SCHEMA_TYPE_ARRAY.forEach(function(item, index) {
    		if (schema[item] && item != SCHEMA_TYPE_VISUALMAP) {
				var ormParam = schema[item].type == 'value' ? runtime.workset.OrmCommon.handlColumn_Metric(schema[item]) : 
													  runtime.workset.OrmCommon.handlColumn_Dimension(schema[item]);
				
    			condArr.push(ormParam);
			}
		});
		$.each(schema[SCHEMA_TYPE_PARALLEL_AXIS], function(key, value) {
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
    Parallel.prototype.getOption = function(rows) {
        if (this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == null || this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == undefined || this.schema[SCHEMA_TYPE_PARALLEL_AXIS].length == 0 ||
            this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            return false;
        }
        
        var transformRule = {};

        transformRule.legend = {
            fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName,
            //type: this.schema[SCHEMA_TYPE_X_AXIS].type,
            //displayText: this.schema[SCHEMA_TYPE_X_AXIS].displayText
        };

        transformRule.parallelAxises = [];
        $.each(this.schema[SCHEMA_TYPE_PARALLEL_AXIS], function(index, item) {
            transformRule.parallelAxises.push({
                fieldName: item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });
		
		if (this.schema[SCHEMA_TYPE_VISUALMAP]) {
            transformRule.visualMap = {
                fieldName: this.schema[SCHEMA_TYPE_VISUALMAP].operation.alias || this.schema[SCHEMA_TYPE_VISUALMAP].fieldName,
                type: this.schema[SCHEMA_TYPE_VISUALMAP].type,
                displayText: this.schema[SCHEMA_TYPE_VISUALMAP].displayText
            };
        }

        var option = this._transformData(transformRule, rows);
        return option;
    };

    Parallel.prototype._transformData = function(transformRule, data) {
        var parallelAxises = transformRule.parallelAxises;
        var legend = transformRule.legend;
		var visualMap = transformRule.visualMap;

        var parallelAxisData = [];
        $.each(parallelAxises, function(index, item) {
            parallelAxisData.push({
                dim: index,
                name: item.displayText
            });
        });

        var legendData = [];
        $.each(data, function(index, item) {
            // TODO 对于legend字段是数字类型时，界面无法正常显示legend图例，需要转换成字符串
            legendData.push( item[legend.fieldName]);
        });
        legendData = _.uniq(legendData);

        var serieData = [];
		var visualMapDataIndex = -1;
        $.each(data, function(index, item) {
            // TODO 对于legend字段是数字类型时，界面无法正常显示legend图例，需要转换成字符串
            // TODO 但是若上面legend转换成字符串后，这里的查找就会失效，需要统一考虑如何处理
            var legendIndex = _.indexOf(legendData, item[legend.fieldName]);
            if (legendIndex < 0) {
                return;
            }
            serieData[legendIndex] = serieData[legendIndex] || [];

            var array = [];
            $.each(parallelAxises, function(index, parallelAxis) {
                array.push(item[parallelAxis.fieldName]);
				
				if (visualMap) {
					//array.push(item[visualMap.fieldName]);
					if (visualMap.fieldName == parallelAxis.fieldName) {
						//visualMapDataIndex = array.length - 1;
						visualMapDataIndex = index;
					}
				}
            });

            serieData[legendIndex].push(array);
        });

        var option = {};

        option.legend = {
            data: legendData
        };


        option.parallelAxis = parallelAxisData;


        var that = this;
        var optSeries = [];
        $.each(legendData, function(index, item) {
            var serieItem = {
                name: item,
                type: 'parallel',
                data: serieData[index]
            };

            optSeries.push(serieItem);
        });
		
		if (visualMap && visualMapDataIndex >= 0) {
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
					dimension: visualMapDataIndex,
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
		
        option.series = optSeries;

        return option;
    };

    Parallel.prototype._mixinRenderOption = function(dataOption) {
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

    Parallel.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == null || this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == undefined || this.schema[SCHEMA_TYPE_PARALLEL_AXIS].length == 0) {
            result.isValid = false;
            result.errorMessages.push('【平行轴】未正确设置');
        }

        if (this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【系列】未正确设置');
        }

        return result;
    };

    Parallel.prototype.render = function() {
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

    Parallel.prototype._drawChart = function (option) {
        var chart = echarts.init(this.getHtmlElement());
        chart.setOption(option);
    };

    Parallel.prototype._drawError = function (errorMessages) {
        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">该【平行坐标】存在以下问题</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        $(this.getHtmlElement()).html(errorHtml.join(''));
    };

    $.fn.zdata_parallel = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Parallel(el, options);
            el.data(PLUGIN_ID, plugin);
            plugin.render();
        });

        return this;
    };

}(jQuery, window));