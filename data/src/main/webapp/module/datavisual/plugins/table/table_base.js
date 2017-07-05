/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var TableBase = function() {
    };

    /**
     * api
     */
    TableBase.prototype.setComponentWrapper = function (compWrapper) {
        this.compWrapper = compWrapper;
    };

    /**
     * api
     */
    TableBase.prototype.outputRuntimeHtmlSameAsDesign = function () {
        return false;
    };

    /**
     * api
     */
    TableBase.prototype.getRuntimeHtml = function () {
        var html = [];

        html.push('<div style="width:100%; height:300px; margin-left: 1px;">');
        html.push('</div>');

        return html.join("");
    };

    TableBase.prototype.handleForRuntimeHtml = function ($dom) {

    };

    TableBase.prototype.afterHandleForRuntimeHtml = function ($dom) {

    };

    /**
     * TODO
     * api
     */
    TableBase.prototype.getRuntimeConfig = function() {
        var runtimeConfig =  _.clone(this.schema);
        runtimeConfig['pluginId'] = this._getPluginID();
        $.extend(runtimeConfig, this._getRuntimeDataSourceInfo());
        //runtimeConfig['properties'] = this._getChartProperties();  //TODO table組件目前不提供配置項，后续扩展

        return runtimeConfig;
    };

    /**
     * api
     */
    TableBase.prototype.getControlPanel = function() {
        // 作为成员变量缓存起来
        this.$controlPanel = $(this._getControlPanelHtmlString());
        return this.$controlPanel;
    };

    /**
     * api
     */
    TableBase.prototype.getDesignHtml = function () {
        if (this.jqueryWrapper) {
            return this.jqueryWrapper;
        }

        var html = [];
        html.push('<div style="width:100%; height:300px; margin-left: 1px;">');
        html.push('</div>');

        this.jqueryWrapper = $(html.join(""));
        return this.jqueryWrapper;
    };

    /**
     * api
     */
    TableBase.prototype.onComponentDrawn = function () {
        this._initDataSourceView();
        this._captureDataSourceInfo();
        this._initDom();
        this.redraw();
    };

    /**
     * api
     */
    TableBase.prototype.onControlPanelDrawn = function() {
        this._registerDropEvent();
        this._drawCtrlItems();
    };

    /**
     * api
     */
    TableBase.prototype.redraw = function() {
        var html = this._getTableHtml();
        if (html) {
            //this.dom.append($(html));
            this.dom.innerHTML = html;
        } else {
            // 显示示例图形
            //this.dom.append($(this._getDemoTableDetail()));
            this.dom.innerHTML = this._getDemoTableHtml();
        }
    };

    TableBase.prototype.resize = function () {

    };

    /**
     * api
     */
    TableBase.prototype.getEastTabs = function () {
        var tabs = [];

        /*var propTab = {
            title: '属性',
            panel: this._getEastTabPanelProperty()
        };
        tabs.push(propTab);*/

        var datasourceTab = {
            title: '数据源',
            panel: this._getEastTabPanelDatasource()
        };
        tabs.push(datasourceTab);

        return tabs;
    };

    TableBase.prototype._initDom = function() {
        this.dom = this.jqueryWrapper[0];
    };

    /*TableBase.prototype._getEastTabPanelProperty = function() {
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
    };*/

    TableBase.prototype._getEastTabPanelDatasource = function () {
        // 恢复数据模型面板的显示
        var html = this.dataSourceView.getHtml();
        html = $(html);

        html.find("div.form-panel > div.title").off('click').on('click', function () {
            var $this = $(this);
            $this.next().slideToggle("normal");
        });

        return html;
    };

    /*TableBase.prototype._onPropertyEventTrigger = function(e) {
        this.chartPropertiesModel.handlePropertyEvent(e);
        this._getChartProperties();
        this.redraw();
    };*/

    TableBase.prototype._getCtrlItemContainer = function(ctrlItemType) {
        // 修改查找范围
        return this.$controlPanel.find("div[data-ctrl-item-type=" + ctrlItemType + "]");
    };

    TableBase.prototype._initDataSourceView = function () {
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

    TableBase.prototype._getDatasourceInfo = function() {
        return this.datasourceInfo;
    };

    TableBase.prototype._captureDataSourceInfo = function() {
        this.datasourceInfo = this.dataSourceView.getCurrentDataSource();
    };

    /**
     * TODO
     * @private
     */
    TableBase.prototype._onDataSourceSelectionChanged = function () {
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

    TableBase.prototype._getRuntimeDataSourceInfo = function() {
        var dsInfo = this._getDatasourceInfo();
        return {
            'datasource' : {'id': dsInfo.datasource.id},
            'dataset' : {'name': dsInfo.dataset.name}
        };
    };

    /*TableBase.prototype._getChartProperties = function() {
        return this.chartPropertiesModel.getChartProperties();
    };*/

    TableBase.prototype._registerDropEvent = function() {
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
                    ctrlType: draggable.data("ctrltype"),
                    field: {
                        name: draggable.data("field-name"),
                        dataType: draggable.data("field-data-type")
                    }
                };

                var checkResult = that._checkDroppable(ctrlItemData);
                if (checkResult.accept === false) {
                    var msg = checkResult.message || "当前控制项不能放入维度或度量了！";
                    alert(msg);
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

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.TableBase = win.datavisual.plugin.TableBase || TableBase;
}(jQuery, window));