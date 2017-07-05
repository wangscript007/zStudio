/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "parallel";

    var MAX_AXIS_COUNT = 10;

    var SCHEMA_TYPE_SERIES  = "series";
	var SCHEMA_TYPE_VISUALMAP   = "visualMap";
    var SCHEMA_TYPE_PARALLEL_AXIS  = "parallel-axis";
	
    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

	var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_SERIES, SCHEMA_TYPE_VISUALMAP];
	
    var Parallel = function(config,propertiesConfig) {
        this.schema = {};
        this.schema[SCHEMA_TYPE_PARALLEL_AXIS] = [];

        this.havingEnable = true;   //having筛选条件框是否灰化
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];

        this.ctrlItems = {};
        this.ctrlItems_parallelAxises = [];
		
        this.config = config || {};
        this.propertiesConfig = propertiesConfig;
        
		this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties, this);
        this._initCtrlItems();
		
        this.datasourceInfo = this.config.datasourceInfo;
		
        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    datavisual.extend(Parallel, win.datavisual.plugin.ChartBase);

    Parallel.prototype.getCssClass = function () {
        return "zdata_parallel";
    };


    Parallel.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = PLUGIN_ID;
        data["datasourceInfo"] = this.datasourceInfo;
        data.ctrlItems = [];

        //if(this.ctrlItems_series != null){
        //   data.ctrlItems.push(this.ctrlItems_series.getJson());
        //}
		_.forEach(this.ctrlItems, function(item) {
        	if (item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                data.ctrlItems.push(item.getJson());
        	}
        });
        _.forEach(this.ctrlItems_parallelAxises, function(item) {
        	if(item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
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
    Parallel.prototype._getControlPanelHtmlString = function() {
        var html = [];

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
        html.push('     视觉映射：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_VISUALMAP + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-12 col-xs-12 col-sm-12 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     平行轴：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_PARALLEL_AXIS + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    /**
     * api
     */
    Parallel.prototype._onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        //if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES) {
        //    this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
        //    this.ctrlItems_series = ctrlItem;
        //} 
		if($.inArray(ctrlItem.getCtrlItemType(),SCHEMA_TYPE_ARRAY) != -1){
            this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
            this.ctrlItems[ctrlItem.getCtrlItemType()] = ctrlItem;
        }else{
            this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);
            if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_PARALLEL_AXIS){
                this.ctrlItems_parallelAxises.push(ctrlItem);
				//this._updateHavingStatus();
            }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
                this.ctrlItems_where.push(ctrlItem);
            }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
                this.ctrlItems_having.push(ctrlItem);
            }
        }
		this._updateHavingStatus();
    };

    /**
     * api
     * 处理控制项的移除事件
     */
    Parallel.prototype.onControlItemRemoved = function(ctrlItem) {
        //if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES) {
        //    delete this.schema[ctrlItem.getCtrlItemType()];
        //    this.ctrlItems_series = null;
		//	this._updateHavingStatus();
        //}
		if($.inArray(ctrlItem.getCtrlItemType(),SCHEMA_TYPE_ARRAY) != -1){
            //this.schema[ctrlItem.getCtrlItemType()] = null;
			delete this.schema[ctrlItem.getCtrlItemType()];
            this.ctrlItems[ctrlItem.getCtrlItemType()] = null;
			this._updateHavingStatus();
        }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_PARALLEL_AXIS){
			_.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) { return o.fieldName == ctrlItem.getFieldName(); });
            _.remove(this.ctrlItems_parallelAxises, function(o) { return o.getFieldName() == ctrlItem.getFieldName(); });
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
    Parallel.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        //if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES) {
        //    this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
        //    this.ctrlItems_series = ctrlItem;
		//	this._updateHavingStatus();
        //} 
		if($.inArray(ctrlItem.getCtrlItemType(),SCHEMA_TYPE_ARRAY) != -1) {
            this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
            this.ctrlItems[ctrlItem.getCtrlItemType()] = ctrlItem;
			this._updateHavingStatus();
        }else{
            var index = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) {
				return ctrlItem.getCtrlItemType() == SCHEMA_TYPE_PARALLEL_AXIS ? 
						o.fieldName == ctrlItem.getFieldName() 
						: o.operation.conditionId == ctrlItem.getOperationItem("conditionId");
			});
            if (index > -1) {
                this.schema[ctrlItem.getCtrlItemType()][index] = schemaItem;
                if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_PARALLEL_AXIS){
                    this.ctrlItems_parallelAxises[index] = ctrlItem;
					this._updateHavingStatus();
                }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
                    this.ctrlItems_where[index] = ctrlItem;
                }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
                    this.ctrlItems_having[index] = ctrlItem;
                }
            }
        }
    };
	
	Parallel.prototype._updateHavingStatus = function() {
        this.havingEnable = true;
        var that = this;
        
		if (that.schema[SCHEMA_TYPE_SERIES] && that.schema[SCHEMA_TYPE_SERIES].operation["aggr"] && that.schema[SCHEMA_TYPE_SERIES].operation["aggr"] == "none") {
			that.havingEnable = false;
        }
		if (that.schema[SCHEMA_TYPE_VISUALMAP] && that.schema[SCHEMA_TYPE_VISUALMAP].operation["aggr"] && that.schema[SCHEMA_TYPE_VISUALMAP].operation["aggr"] == "none") {
			that.havingEnable = false;
        }
		
		$.each(that.schema[SCHEMA_TYPE_PARALLEL_AXIS], function(key, value) {
            if (value && value.operation["aggr"] && value.operation["aggr"] == "none") {
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
    Parallel.prototype._checkDroppable = function(dropData) {
        if (SCHEMA_TYPE_SERIES == dropData.ctrlItemType && this.schema[dropData.ctrlItemType]) {
            return {accept: false, message: "【系列】仅接受一个度量或维度"};
        }
		
		if (dropData.ctrlItemType == SCHEMA_TYPE_VISUALMAP) {
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                return {accept: false, message: "【视觉映射】只支持一个度量"};
            }
		}

        if (SCHEMA_TYPE_PARALLEL_AXIS == dropData.ctrlItemType) {
            if (this.schema[dropData.ctrlItemType].length >= MAX_AXIS_COUNT) {
                return {accept: false, message: "【平行轴】最多接受 " + MAX_AXIS_COUNT + " 个度量或维度"};
            }
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                return {accept: false, message: "【平行轴】不支持放入维度"};
            }
        }

        // 暂时不允许同名字段的度量重复出现，后续需要orm支持为column指定别名后方可支持
        
		if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
            var hasDup = false;

            if (this.schema[SCHEMA_TYPE_SERIES] && this.schema[SCHEMA_TYPE_SERIES].fieldName === dropData.field.name) {
                hasDup = true;
            }

            _.forEach(this.schema[SCHEMA_TYPE_PARALLEL_AXIS], function(item, key) {
                if (item && item.fieldName === dropData.field.name) {
                    hasDup = true;
                }
            });

            if (hasDup && dropData.ctrlItemType != SCHEMA_TYPE_VISUALMAP) {
                return {accept: false, message: "同一个度量不允许重复使用"};
            }
        }
		

        return {accept: true};
    };

    Parallel.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == null || this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == undefined || this.schema[SCHEMA_TYPE_PARALLEL_AXIS].length == 0) {
            result.isValid = false;
            result.errorMessages.push('【平行轴】');
        }

        if (this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【系列】');
        }

        return result;
    };

    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Parallel.prototype._getDataOption = function() {
        if (this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == null || this.schema[SCHEMA_TYPE_PARALLEL_AXIS] == undefined || this.schema[SCHEMA_TYPE_PARALLEL_AXIS].length == 0 ||
            this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            return false;
        }

        var condArr = this._getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);
        
        var transformRule = {};

        transformRule.legend = {
            fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
        };

        transformRule.parallelAxises = [];
        $.each(this.schema[SCHEMA_TYPE_PARALLEL_AXIS], function(index, item) {
            transformRule.parallelAxises.push({
                fieldName: item.operation.alias || item.fieldName,
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

        return this._transformData(transformRule, data);
    };

    Parallel.prototype._clearCtrlItems = function () {
        //移除ctrlItem
        this.schema = {};
        this.schema[SCHEMA_TYPE_PARALLEL_AXIS] = [];
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];
        this.ctrlItems = {};
        this.ctrlItems_parallelAxises = [];
    };
    /**
     * override
     */
    Parallel.prototype._getQueryCondArr = function() {
    	var schema = this.schema;
    	var condArr = [];
		//var ormParam = schema[SCHEMA_TYPE_SERIES] == 'value' ? workbench.workset.OrmCommon.handlColumn_Metric(schema[SCHEMA_TYPE_SERIES]) : 
		//											  workbench.workset.OrmCommon.handlColumn_Dimension(schema[SCHEMA_TYPE_SERIES]);
				
    	//condArr.push(ormParam);
		SCHEMA_TYPE_ARRAY.forEach(function(item, index) {
    		if (schema[item] && item != SCHEMA_TYPE_VISUALMAP) {
				var ormParam = schema[item].type == 'value' ? workbench.workset.OrmCommon.handlColumn_Metric(schema[item]) : 
													  workbench.workset.OrmCommon.handlColumn_Dimension(schema[item]);
				
    			condArr.push(ormParam);
			}
		});
		
		$.each(schema[SCHEMA_TYPE_PARALLEL_AXIS], function(key, value) {
            if (value && value.fieldName) {
				var ormParam = value.type == 'value' ? 
								workbench.workset.OrmCommon.handlColumn_Metric(value) : 
								workbench.workset.OrmCommon.handlColumn_Dimension(value);
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

        var option = {
        };


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

    Parallel.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Parallel.prototype._getName = function () {
        return "平行坐标";
    };

    Parallel.prototype._drawCtrlItems = function() {
        var items = [];
        
		_.forEach(this.ctrlItems, function(ctrlItem) {
			items.push(ctrlItem);
		});
		
        items = items.concat(this.ctrlItems_parallelAxises).concat(this.ctrlItems_where).concat(this.ctrlItems_having);

        var that = this;
        _.forEach(items, function(ctrlItem) {
            if (ctrlItem == null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                return;
            }

            var ctrlItemContainer = that._getCtrlItemContainer(ctrlItem.getCtrlItemType());
            if (ctrlItemContainer) {
                ctrlItemContainer.append(ctrlItem.getDom());
            }
        });
    };

    Parallel.prototype._initCtrlItems = function() {
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
    win.datavisual.plugin.Parallel = win.datavisual.plugin.Parallel || function (config, propertiesConfig) {
            return new Parallel(config, propertiesConfig);
        };
}(jQuery, window));