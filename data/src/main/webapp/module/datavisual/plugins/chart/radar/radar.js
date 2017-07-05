/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "radar";
    var MAX_RADAR_COUNT = 6;

    var SCHEMA_TYPE_SERIES  = "series";
    var SCHEMA_TYPE_RADAR  = "radar";
    var SCHEMA_TYPE_WHERE = "where";
    var SCHEMA_TYPE_HAVING = "having";

    var Radar = function(config, propertiesConfig) {
        this.schema = {};
        this.schema[SCHEMA_TYPE_RADAR] = [];

        this.havingEnable = true;   //having筛选条件框是否灰化
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];

        this.ctrlItems_series = null;
        this.ctrlItems_radar = [];

        this.config = config || {};
        this.propertiesConfig = propertiesConfig;

        this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties, this);
        this._initCtrlItems();

        this.datasourceInfo = this.config.datasourceInfo;

        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    datavisual.extend(Radar, win.datavisual.plugin.ChartBase);

    /**
     * api
     */
    Radar.prototype.getCssClass = function () {
        return "zdata_radar";
    };

    /**
     * api
     */
    Radar.prototype._getControlPanelHtmlString = function() {
        var html = [];
        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     系列：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_SERIES + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-12">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('    坐标系：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_RADAR + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    /**
     * api
     */
    Radar.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = PLUGIN_ID;
        data["datasourceInfo"] = this.datasourceInfo;

        data.ctrlItems = [];
        if (this.ctrlItems_series != null) {
            data.ctrlItems.push(this.ctrlItems_series.getJson());
        }
        _.forEach(this.ctrlItems_radar, function(item) {
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
    Radar.prototype._onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES) {
            this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
            this.ctrlItems_series = ctrlItem;
        } else{
            this.schema[ctrlItem.getCtrlItemType()].push(schemaItem);
            if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_RADAR){
                this.ctrlItems_radar.push(ctrlItem);
				this._updateHavingStatus();
            }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
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
    Radar.prototype.onControlItemRemoved = function(ctrlItem) {
        if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES) {
            delete this.schema[ctrlItem.getCtrlItemType()];
            this.ctrlItems_series = null;
			this._updateHavingStatus();
        }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_RADAR){
			_.remove(this.schema[ctrlItem.getCtrlItemType()], function(o) { return o.fieldName == ctrlItem.getFieldName(); });
            _.remove(this.SCHEMA_TYPE_RADAR, function(o) { return o.getFieldName() == ctrlItem.getFieldName(); });
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
    Radar.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        var schemaItem = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        if (ctrlItem.getCtrlItemType() == SCHEMA_TYPE_SERIES) {
            this.schema[ctrlItem.getCtrlItemType()] = schemaItem;
            this.ctrlItems_series = ctrlItem;
        } else {
            var index = _.findIndex(this.schema[ctrlItem.getCtrlItemType()], function(o) { 
						return ctrlItem.getCtrlItemType() == SCHEMA_TYPE_RADAR ? 
							o.fieldName == ctrlItem.getFieldName() 
							: o.operation.conditionId == ctrlItem.getOperationItem("conditionId");
						});
            if (index > -1) {
                this.schema[ctrlItem.getCtrlItemType()][index] = schemaItem;
                if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_RADAR){
                    this.ctrlItems_radar[index] = ctrlItem;
					this._updateHavingStatus();
                }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_WHERE){
                    this.ctrlItems_where[index] = ctrlItem;
                }else if(ctrlItem.getCtrlItemType() == SCHEMA_TYPE_HAVING){
                    this.ctrlItems_having[index] = ctrlItem;
                }
            }
        }
    };

	Radar.prototype._updateHavingStatus = function() {
        this.havingEnable = true;
        var that = this;
		$.each(that.schema[SCHEMA_TYPE_RADAR], function(key, value) {
            if (value && value.operation["aggr"] && value.operation["aggr"] == "none") {
				that.havingEnable = false;
            }
        });
    };
    /**
     * api
     * @param dropData
     * {
            ctrlItemType: <item-type>   //例如xAxis, yAxis等
            ctrlType
     * }
     */
    Radar.prototype._checkDroppable = function(dropData) {
        if (SCHEMA_TYPE_SERIES == dropData.ctrlItemType) {
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
                return {accept: false, message: "【系列】不支持放入度量"};
            } else {
                if (this.schema[dropData.ctrlItemType]) {
                    return {accept: false, message: "【系列】仅接受一个维度"};
                }
            }
        }

        if (SCHEMA_TYPE_RADAR == dropData.ctrlItemType) {
            if (this.schema[dropData.ctrlItemType].length >= MAX_RADAR_COUNT) {
                return {accept: false, message: "【坐标系】最多接受 " + MAX_RADAR_COUNT + " 个度量"};
            }
            if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_DIMENSION) {
                return {accept: false, message: "【坐标系】不支持放入维度"};
            }
        }

        // 暂时不允许同名字段的度量重复出现，后续需要orm支持为column指定别名后方可支持
        if (dropData.ctrlType == DATA_MODEL.FIELD_TYPE_METRIC) {
            var hasDup = false;

            if (this.schema[SCHEMA_TYPE_SERIES] && this.schema[SCHEMA_TYPE_SERIES].fieldName === dropData.field.name) {
                hasDup = true;
            }

            _.forEach(this.schema[SCHEMA_TYPE_RADAR], function(item, key) {
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

    Radar.prototype._clearCtrlItems = function () {
        // 移除ctrlItem
        this.schema = {};
        this.schema[SCHEMA_TYPE_RADAR] = [];
        this.schema[SCHEMA_TYPE_WHERE] = [];
        this.schema[SCHEMA_TYPE_HAVING] = [];
        this.ctrlItems_where = [];
        this.ctrlItems_having = [];
        this.ctrlItems_series = null;
        this.ctrlItems_radar = [];
    };

    Radar.prototype._isValid = function () {
        var result = {
            isValid: true,
            errorMessages: []
        };

        if (this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined) {
            result.isValid = false;
            result.errorMessages.push('【系列】');
        }

        if (this.schema[SCHEMA_TYPE_RADAR] == null || this.schema[SCHEMA_TYPE_RADAR] == undefined || this.schema[SCHEMA_TYPE_RADAR].length == 0) {
            result.isValid = false;
            result.errorMessages.push('【坐标系】');
        }


        return result;
    };

    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Radar.prototype._getDataOption = function() {
        if (this.schema[SCHEMA_TYPE_SERIES] == null || this.schema[SCHEMA_TYPE_SERIES] == undefined ||
            this.schema[SCHEMA_TYPE_RADAR] == null || this.schema[SCHEMA_TYPE_RADAR] == undefined || this.schema[SCHEMA_TYPE_RADAR].length == 0) {
            return false;
        }

        var condArr = this._getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(this.datasourceInfo, condArr);

        var transformRule = {};

        if (this.schema[SCHEMA_TYPE_SERIES]) {
            transformRule.legend = {
                fieldName: this.schema[SCHEMA_TYPE_SERIES].fieldName
            }
        }

        transformRule.indicator = [];
        $.each(this.schema[SCHEMA_TYPE_RADAR], function(index, item) {
            transformRule.indicator.push({
                fieldName: item.operation.alias || item.fieldName,
                type: item.type,
                displayText: item.displayText
            });
        });

        return this._transformData(transformRule, data);
    };

    Radar.prototype._getQueryCondArr = function(){
        var schema = this.schema;
        var condArr = [];
        var ormParam = workbench.workset.OrmCommon.handlColumn_Dimension(schema[SCHEMA_TYPE_SERIES]);
				
    	condArr.push(ormParam);
		
		$.each(schema[SCHEMA_TYPE_RADAR], function(key, value) {
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

    Radar.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Radar.prototype._getName = function () {
        return "雷达图";
    };

    Radar.prototype._drawCtrlItems = function() {
        var items = [];
        items.push(this.ctrlItems_series);
        items = items.concat(this.ctrlItems_radar).concat(this.ctrlItems_where).concat(this.ctrlItems_having);

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

    Radar.prototype._initCtrlItems = function() {
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
    win.datavisual.plugin.Radar = win.datavisual.plugin.Radar || function(config, propertiesConfig) { return new Radar(config, propertiesConfig) };
}(jQuery, window));