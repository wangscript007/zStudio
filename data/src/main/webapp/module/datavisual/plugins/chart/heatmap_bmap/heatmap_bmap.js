/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "heatmap_bmap";

    var SCHEMA_TYPE_LNG  = "lng";
    var SCHEMA_TYPE_LAT  = "lat";
    var SCHEMA_TYPE_WEIGHT  = "weight";
    
    var SCHEMA_TYPE_ARRAY = [SCHEMA_TYPE_LNG, SCHEMA_TYPE_LAT, SCHEMA_TYPE_WEIGHT];

    var Heatmap_bmap = function(config) {
        this.schema = {};
        this.ctrlItems = {};

        config = config || {};
        this.chartPropertiesModel = new ChartPropertiesModel(config.properties);
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.getRuntimeConfig = function() {
        var runtimeConfig =  _.clone(this.schema);
        runtimeConfig["pluginId"] = PLUGIN_ID;
        $.extend(runtimeConfig, this.getRuntimeDataSourceInfo());
        runtimeConfig["properties"] = this.getChartProperties();

        return runtimeConfig;
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.getDesignFileContent = function() {
        var data = {};
        data["pluginId"] = PLUGIN_ID;
        $.extend(data, this.getDataSourceInfo());
        data.ctrlItems = [];
        _.forEach(this.ctrlItems, function(item) {
            if (item != null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                data.ctrlItems.push({
                    ctrlItemType: item.getItemType(),   //"x-axis",
                    ctrlType: item.getType(), //DATA_MODEL.FIELD_TYPE_METRIC,
                    field: item.getField(),
                    operation: item.getOperation()
                });
            }
        });
        data["properties"] = this.getChartProperties();

        return JSON.stringify(data);
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.getPropertyPanelHtml = function(pluginCustomProperties, baseProperties, unsupportedBaseProperties) {
        var htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        return htmlBuilder._getPropertyPanelHtml(pluginCustomProperties, baseProperties, unsupportedBaseProperties);
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.onPropertyEventTrigger = function(e) {
        this.chartPropertiesModel.handlePropertyEvent(e);
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.getCtrlItemContainer = function(ctrlItemType) {
        return $("div[data-ctrl-item-type=" + ctrlItemType + "]");
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.getControlPanelHtml = function() {
        var html = [];
        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     经度：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_LNG + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     纬度：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_LAT + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        html.push('<div class="row row-m0 mb-5">');
        html.push(' <div class="col-md-6 col-xs-6 col-sm-6 col-lg-6">');
        html.push('     <div class="inline-container ctrl-item-label">');
        html.push('     权重：');
        html.push('     </div>');
        html.push('     <div class="inline-container ctrl-item-content droppable" data-ctrl-item-type="' + SCHEMA_TYPE_WEIGHT + '">');
        html.push('     </div>');
        html.push(' </div>');
        html.push('</div>');

        return html.join("");
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';

        this.schema[ctrlItem.getItemType()] = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        this.ctrlItems[ctrlItem.getItemType()] = ctrlItem;
    };

    /**
     * api
     * 处理控制项的移除事件
     */
    Heatmap_bmap.prototype.onControlItemRemoved = function(ctrlItem) {
        this.schema[ctrlItem.getItemType()] = null;

        this.ctrlItems[ctrlItem.getItemType()] = null;
    };

    /**
     * api
     * 处理控制项的更新事件。
     * 主要是其数据的更新，例如排序方式、聚合方式等等
     */
    Heatmap_bmap.prototype.onControlItemUpdated = function(ctrlItem) {

        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';

        this.schema[ctrlItem.getItemType()] = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        this.ctrlItems[ctrlItem.getItemType()] = ctrlItem;
    };

    /**
     * api
     */
    Heatmap_bmap.prototype.checkDroppable = function(dropData) {
        if (this.schema[dropData.ctrlItemType]) {
            return {accept: false, message: "该项仅接受一个度量或维度"};
        }

        if (dropData.fieldDataType != DATA_MODEL.DATATYPE_DECIMAL && dropData.fieldDataType != DATA_MODEL.DATATYPE_DOUBLE) {
            return {accept: false, message: "该项必须是浮点类型的值"};
        }

        return {accept: true};
    };
    
    Heatmap_bmap.prototype.getDataSourceInfo = function() {
    	return win.datavisual.ui.DataSourceView.getCurrentDataSource();
    };

    /**
     * override
     */
    Heatmap_bmap.prototype.getRuntimeDataSourceInfo = function() {
        return win.datavisual.ui.DataSourceView.getCurrentDataSourceForRuntime();
    };

    Heatmap_bmap.prototype.getQueryCondArr = function() {
    	var schema = this.schema;
    	var condArr = [];
    	SCHEMA_TYPE_ARRAY.forEach(function(item, index) {
    		if (item) {
    			condArr.push(schema[item]);
			}
		});
    	return condArr;
    };    
    
    /**
     * api
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    Heatmap_bmap.prototype.getDataOption = function() {
        if (this.schema[SCHEMA_TYPE_LNG] == null || this.schema[SCHEMA_TYPE_LNG] == undefined ||
            this.schema[SCHEMA_TYPE_LAT] == null || this.schema[SCHEMA_TYPE_LAT] == undefined) {
            return false;
        }

        var dsInfo = this.getDataSourceInfo();
        var condArr = this.getQueryCondArr();
        var data = win.workbench.workset.OrmCommon.getChartData(dsInfo, condArr);

        var lng = {
            fieldName: this.schema[SCHEMA_TYPE_LNG].fieldName,
            type: this.schema[SCHEMA_TYPE_LNG].type,
            displayText: this.schema[SCHEMA_TYPE_LNG].displayText
        };

        var lat = {
            fieldName: this.schema[SCHEMA_TYPE_LAT].fieldName,
            type: this.schema[SCHEMA_TYPE_LAT].type,
            displayText: this.schema[SCHEMA_TYPE_LAT].displayText
        };

        var weight = null;
        if (this.schema[SCHEMA_TYPE_WEIGHT]) {
            weight = {
                fieldName: this.schema[SCHEMA_TYPE_WEIGHT].fieldName
            }
        }

        return this._transformData(lng, lat, weight, data);
    };

    Heatmap_bmap.prototype.getChartProperties = function() {
        return this.chartPropertiesModel.getChartProperties();
    };

    Heatmap_bmap.prototype._transformData = function(lng, lat, weight, data) {
        var points = [];
        var min = 0;
        var max = 5;
        $.each(data, function(index, item) {
            var point = [item[lng.fieldName], item[lat.fieldName]];
            if (weight) {
                var weightVal = item[weight.fieldName];
                point.push(weightVal);
                max = Math.max(max, weightVal);
                min = Math.min(min, weightVal);
            } else {
                point.push(1);
            }
            points.push(point);
        });

        var option = {
            animation: false,
            bmap: {
                //center: [107.638532, 37.538248],
                //zoom: 14,
                roam: true
            },
            visualMap: {
                show: false,
                top: 'top',
                min: min,
                max: max,
                seriesIndex: 0,
                calculable: false,
                inRange: {
                    color: ['blue', 'green', 'yellow', 'red']
                }
            },
            series: [{
                type: 'heatmap',
                coordinateSystem: 'bmap',
                data: points,
                pointSize: 5,
                blurSize: 6
            }]
        };

        return option;
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.Heatmap_bmap = win.datavisual.plugin.Heatmap_bmap || function(config) { return new Heatmap_bmap(config) };
}(jQuery, window));