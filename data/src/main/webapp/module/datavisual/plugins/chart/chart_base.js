/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var ChartBase = function() {
    };

    /**
     * api
     */
    ChartBase.prototype.setComponentWrapper = function (compWrapper) {
        this.compWrapper = compWrapper;
    };

    /**
     * api
     */
    /*
    ChartBase.prototype.getCssClass = function () {
        return "";
    };
    */

    /**
     * api
     */
    ChartBase.prototype.outputRuntimeHtmlSameAsDesign = function () {
        return false;
    };

    /**
     * api
     */
    ChartBase.prototype.getRuntimeHtml = function () {
        var html = [];

		var chartProps = this._getChartProperties();
		var height = '300px';
		if (chartProps && chartProps.chart_height) {
			height = chartProps.chart_height;
		}
		
        html.push('<div style="width:100%; height:' + height + ';">');
        html.push('</div>');

        return html.join("");
    };

    ChartBase.prototype.handleForRuntimeHtml = function ($dom) {

    };

    ChartBase.prototype.afterHandleForRuntimeHtml = function ($dom) {

    };

    /**
     * TODO
     * api
     */
    ChartBase.prototype.getRuntimeConfig = function() {
        var runtimeConfig =  _.clone(this.schema);
		//having过滤条件不可用时删除运行期JS having查询条件
		if(!this.havingEnable){
			delete runtimeConfig["having"];
		};
        runtimeConfig['pluginId'] = this._getPluginID();
        $.extend(runtimeConfig, this._getRuntimeDataSourceInfo());
        runtimeConfig['properties'] = this._getChartProperties();

        return runtimeConfig;
    };

    /**
     * api
     */
    ChartBase.prototype.getControlPanel = function() {
        var ctrlPanel = [];
        
        ctrlPanel.push('<div class="row" >');
		
		//切换按钮区域html
        ctrlPanel.push('	<div class="col-md-1 col-xs-1 col-sm-1 col-lg-1" style="height:87px;padding-left:0;z-index:99">');
        ctrlPanel.push('		<ul class="ctrl-tabs">');
        ctrlPanel.push('			<li id="basic_btn"><span>基本设置</span></li>');
        ctrlPanel.push('			<li id="condition_btn"><span>高级功能</span></li>');
        ctrlPanel.push('		</ul>');
        ctrlPanel.push('	</div>');

        //基本设置区域html
        ctrlPanel.push('	<div class="col-md-11 col-xs-11 col-sm-11 col-lg-11  ui-sortable" id="basic_panel" >');
        ctrlPanel.push(this._getControlPanelHtmlString());
        ctrlPanel.push('	</div>');

        //高级功能区域html
        ctrlPanel.push('	<div class="col-md-11 col-xs-11 col-sm-11 col-lg-11  ui-sortable" id="condition_panel" style="display: none">');
        ctrlPanel.push('		<div class="row row-m0 mb-5">');
        ctrlPanel.push('			<div class="col-md-11 col-xs-11 col-sm-11 col-lg-11">');
        ctrlPanel.push('				<div class="inline-container ctrl-item-label"> 分组前筛选：</div>');
        ctrlPanel.push('				<div class="inline-container ctrl-item-content droppable ui-droppable" data-ctrl-item-type="where"></div>');
        ctrlPanel.push('			</div>');
		ctrlPanel.push('		</div>');
        ctrlPanel.push('		<div class="row row-m0 mb-5">');
        ctrlPanel.push('			<div id="ctrl_having" class="col-md-11col-xs-11 col-sm-11 col-lg-11">');
        ctrlPanel.push('				<div class="inline-container ctrl-item-label"> 分组后筛选：</div>');
        ctrlPanel.push('				<div class="inline-container ctrl-item-content droppable ui-droppable" data-ctrl-item-type="having"></div>');
        ctrlPanel.push('			</div>');
        ctrlPanel.push('		</div>');
		ctrlPanel.push('	</div>');
		
		ctrlPanel.push('</div>');

        // 作为成员变量缓存起来
        this.$controlPanel = $(ctrlPanel.join(""));
        return this.$controlPanel;
    };

    /**
     * api
     */
    ChartBase.prototype.getDesignHtml = function () {
        if (this.jqueryWrapper) {
            return this.jqueryWrapper;
        }

		var height = '300px';
		if (this.config.properties && this.config.properties.chart_height) {
			height = this.config.properties.chart_height;
		}
		
        var html = [];
        html.push('<div style="width:100%;">');
        html.push('</div>');

        this.jqueryWrapper = $(html.join(""));
		this.jqueryWrapper.css('height', height);
        return this.jqueryWrapper;
    };

    /**
     * api
     */
    /*
    ChartBase.prototype.getDesignFileContent = function() {

    };
    */

    /**
     * api
     */
    ChartBase.prototype.onComponentDrawn = function () {
        this._initDataSourceView();
        this._captureDataSourceInfo();
        this.redraw();
    };

    /**
     * api
     */
    ChartBase.prototype.onControlPanelDrawn = function() {
        this._registerDropEvent();
        this._drawCtrlItems();
        this._initBtn(); //绑定按钮切换事件
    };

    /**
     * api
     */
    ChartBase.prototype.redraw = function() {
        var result = this._isValid();

        if (result.isValid) {
            this._initChart();
            this.chart.clear();
            this.resize();

            // TODO _getDataOption目前又做了一次valid判断，是否必要??
            var dataOption = this._getDataOption();   // 暂时实现为数据获取是同步的方式
            if (dataOption) {
                var option = this._mixinRenderOption(dataOption);
                this.chart.setOption(option);
            }

            // var option = this._getDataOption();
            // option = this._mixinRenderOption(option);
            // this.chart.setOption(option);
        } else {
            this._drawError(result.errorMessages);
        }
    };

    ChartBase.prototype._drawError = function (errorMessages) {
        this._disposeChart();

        var errorHtml = [];
        errorHtml.push('<div class="ksy-chart-err-wrap">');
        errorHtml.push('<div class="ksy-chart-err">');
        errorHtml.push('<div class="ksy-chart-err-title">【' + this._getName() + '】需设置下列项（拖拽<b>维度</b>、<b>度量</b>到顶部面板）</div>');

        errorMessages.forEach(function (errorMsg) {
            errorHtml.push('<div class="ksy-chart-err-item">' + errorMsg + '</div>');
        });

        errorHtml.push('</div>');
        errorHtml.push('</div>');

        this.jqueryWrapper.html(errorHtml.join(''));
    };

    ChartBase.prototype.resize = function () {
        this.chart.resize();
    };

    /**
     * api
     */
    ChartBase.prototype.getEastTabs = function () {
        var tabs = [];

        var datasourceTab = {
            title: '数据源',
            panel: this._getEastTabPanelDatasource()
        };
        tabs.push(datasourceTab);

        var propTab = {
            title: '属性',
            panel: this._getEastTabPanelProperty()
        };
        tabs.push(propTab);

        return tabs;
    };

    ChartBase.prototype._initChart = function() {
        if (this.chart) {
            return;
        }

        var dom = this.jqueryWrapper[0];
        this.chart = echarts.init(dom);
    };

    ChartBase.prototype._disposeChart = function() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
    };

    ChartBase.prototype._getEastTabPanelProperty = function() {
        var html = this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
        html = $(html);

        var that = this;
        html.on("change", "select, input[type='text']", function(e) {
            that._onPropertyEventTrigger(e);
        }).on("click", "input[type='checkbox'], input[type='radio']", function(e) {
            that._onPropertyEventTrigger(e);
        }).on("blur", "textarea", function(e) {
            that._onPropertyEventTrigger(e);
        }).on("input", "textarea", function(e) {
            that._onPropertyEventTrigger(e);
        });

        html.find("div.form-panel > div.title").off('click').on('click', function () {
            var $this = $(this);
            $this.next().slideToggle("normal");
        });

        return html;
    };

    ChartBase.prototype._getEastTabPanelDatasource = function () {
        // 恢复数据模型面板的显示
        var html = this.dataSourceView.getHtml();
        html = $(html);

        html.find("div.form-panel > div.title").off('click').on('click', function () {
            var $this = $(this);
            $this.next().slideToggle("normal");
        });

        return html;
    };

    ChartBase.prototype._onPropertyEventTrigger = function(e) {
        this.chartPropertiesModel.handlePropertyEvent(e);
        this._getChartProperties();
        this.redraw();
    };

    ChartBase.prototype._getCtrlItemContainer = function(ctrlItemType) {
        // 修改查找范围
        return this.$controlPanel.find("div[data-ctrl-item-type=" + ctrlItemType + "]");
    };
	
	ChartBase.prototype.onPropertyChanged = function (path, value, inputControl) {
        if (path == 'chart_height') {
            this._onPropertyChanged_height(path, value, inputControl);
        }
    };
	
	ChartBase.prototype._onPropertyChanged_height = function (path, value, inputControl) {
		if (this.jqueryWrapper) {
			this.jqueryWrapper.css('height', value);
			this.redraw();
		}
    };

    /**
     * @param ctrlItem
     * @private
    ChartBase.prototype._onControlItemAdded = function(ctrlItem) {
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        this.schema[ctrlItem.getCtrlItemType()] = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        this.ctrlItems[ctrlItem.getCtrlItemType()] = ctrlItem;
    };
     */

    /**
     * api
     * 处理控制项的移除事件
    ChartBase.prototype.onControlItemRemoved = function(ctrlItem) {
        this.schema[ctrlItem.getCtrlItemType()] = null;

        this.ctrlItems[ctrlItem.getCtrlItemType()] = null;
    };
     */

    /**
     * api
     * 处理控制项的更新事件。
     * 主要是其数据的更新，例如排序方式、聚合方式等等
    ChartBase.prototype.onControlItemUpdated = function(ctrlItem) {
        // 直接全部覆盖原来的schema对象
        var type = ctrlItem.getCtrlType() == DATA_MODEL.FIELD_TYPE_METRIC ? 'value' : 'category';
        this.schema[ctrlItem.getCtrlItemType()] = {
            fieldName: ctrlItem.getFieldName(),
            type: type,
            displayText: ctrlItem.getFieldDisplayText(),
            operation: ctrlItem.getOperation()
        };

        this.ctrlItems[ctrlItem.getCtrlItemType()] = ctrlItem;
    };
     */

    /*
    ChartBase.prototype._checkDroppable = function(dropData) {
        return {accept: false};
    };
    */

    ChartBase.prototype._initDataSourceView = function () {
        if (this.dataSourceView) {
            return;
        }

        var config = {};

        var dsInfo = this._getDatasourceInfo();
        if (dsInfo) {
            config["selectedDatasourceId"] = dsInfo.datasource.id;
            config["selectedDatasetName"] = dsInfo.dataset.name;
        }

        var that = this;
        config["datasourceChangedCallback"] = function () {
            that._onDataSourceSelectionChanged();
        };

        this.dataSourceView = new datavisual.ui.DataSourceView(config);
    };

    ChartBase.prototype._getDatasourceInfo = function() {
        return this.datasourceInfo;
    };

    ChartBase.prototype._captureDataSourceInfo = function() {
        this.datasourceInfo = this.dataSourceView.getCurrentDataSource();
    };

    /**
     * TODO
     * @private
     */
    ChartBase.prototype._onDataSourceSelectionChanged = function () {
        //数据源的选择发生变化时，需要
        // 1、清除当前controlPanel上拖拽的ctrlItems，
        // 2、并且对应清除内存缓存的ctrlItems等信息
        // 3、保存新选择的数据源信息
        // 4、重绘图表

        //移除ctrlItem
        this._clearCtrlItems();

        this._captureDataSourceInfo();

        datavisual.pluginManager.redrawActiveComponentWrapperControlPanel();
        this.redraw();
    };

    /*
    ChartBase.prototype._clearCtrlItems = function () {

    };
    */

    ChartBase.prototype._getRuntimeDataSourceInfo = function() {
        var dsInfo = this._getDatasourceInfo();
        return {
            'datasource' : {'id': dsInfo.datasource.id},
            'dataset' : {'name': dsInfo.dataset.name}
        };
    };

    ChartBase.prototype._mixinRenderOption = function(dataOption) {
        var option = dataOption;

        if (option) {
            // 合并series属性
            var properties = this._getChartProperties();
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
            properties = _.omit(properties, 'series');

            $.extend(true, option, properties);
        }

        return option;
    };

    /**
     * 获取数据，并加工成option对象返回。
     * ！！！重要：如果无法根据目前拖拽的条件获取数据，则返回false ！！！
     */
    /*
    ChartBase.prototype._getDataOption = function() {

    };
    */

    /*
    ChartBase.prototype._getDemoOption = function () {

    };
    */

    /*
    ChartBase.prototype._getPluginID = function() {

    };
    */

    ChartBase.prototype._getChartProperties = function() {
        return this.chartPropertiesModel.getChartProperties();
    };

    ChartBase.prototype._registerDropEvent = function() {
        var that = this;
        // 修改.droppable 的查找范围
        this.$controlPanel.find(".droppable").droppable({
            accept: ".group-item",
            activeClass: "droppable-highlight",
            hoverClass: "droppable-hover",
            drop: function( event, ui ) {
                var droppable = $(event.target);
                var draggable = ui.draggable;

                var ctrlItemData = {
                    ctrlItemType: droppable.data("ctrl-item-type"),
                    ctrlType: draggable.data("ctrltype"),   // 值为维度 DATA_MODEL.FIELD_TYPE_DIMENSION 或度量DATA_MODEL.FIELD_TYPE_METRIC
                    field: {
                        name: draggable.data("field-name"),
                        dataType: draggable.data("field-data-type")
                    }
                };

                //筛选条件允许放入多个维度和度量
                if (ctrlItemData.ctrlItemType !=  "where" && ctrlItemData.ctrlItemType != "having") {
                    var checkResult = that._checkDroppable(ctrlItemData);
                    if (checkResult.accept === false) {
                        var msg = checkResult.message || "当前控制项不能放入维度或度量了！";
                        alert(msg);
                        return;
                    }
                }
                //having筛选条件 先验证条件框是否已经灰化
                if (ctrlItemData.ctrlItemType == "having" && !that.havingEnable) {
					alert("有度量设置为不聚合，当前不允许放入分组后筛选条件！");
                    return;
                }

                var ctrlItem = new datavisual.entity.ControlItem(ctrlItemData);
                droppable.append(ctrlItem.getDom());
                that._onControlItemAdded(ctrlItem);
                that._captureDataSourceInfo();
                that.redraw();
            }
        })
    };



    /**
     * @private

    ChartBase.prototype._drawCtrlItems = function() {
        var that = this;
        _.forEach(this.ctrlItems, function(ctrlItem) {
            if (ctrlItem == null) {	//移除操作是将对象置空，而不是删除，此处需要判空
                return;
            }

            var ctrlItemContainer = that._getCtrlItemContainer(ctrlItem.getCtrlItemType());
            if (ctrlItemContainer) {
                ctrlItemContainer.append(ctrlItem.getDom());
            }
        });
    };
     */

    /**
     * @private
    ChartBase.prototype._initCtrlItems = function() {
        var items = this.config.ctrlItems || [];

        // 重新恢复ctrlItem的内存数据模型
        var that = this;
        _.forEach(items, function(item) {
            var ctrlItem = new datavisual.entity.ControlItem(item);
            that._onControlItemAdded(ctrlItem);
        });
    };
     */


    //控制面板按钮点击切换事件
    ChartBase.prototype._initBtn = function() {
        $("#basic_btn").on("click", function() {
			$(this).addClass('tab-selected');
			$("#condition_btn").removeClass('tab-selected');
			
            $("#basic_panel").css("display", "block");
            $("#condition_panel").css("display", "none");
        }).click();

		var that = this;
        $("#condition_btn").on("click",function() {
            //判断是否灰化having过滤条件框
            if (that.havingEnable) {
                $("#ctrl_having").removeClass("ctrl-disabled");
            } else {
                $("#ctrl_having").addClass("ctrl-disabled");
            }
            
			$(this).addClass('tab-selected');
			$("#basic_btn").removeClass('tab-selected');
			
			$("#basic_panel").css("display", "none");
            $("#condition_panel").css("display", "block");
        });
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.ChartBase = win.datavisual.plugin.ChartBase || ChartBase;
}(jQuery, window));