/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "col_4_4_4";

    /**
     * @param config
     * @param propertiesConfig
     * @constructor
     */
    var Col_4_4_4 = function(config, propertiesConfig) {
        this.propertiesConfig = propertiesConfig;
        this.config = config || this._getDefaultConfig();
        this._ratio = this.config.properties.ratio;

        this.chartPropertiesModel = new ChartPropertiesModel(this.config.properties, this);

        this.htmlBuilder = new CommonChartPropertyHtmlBuilder(this.chartPropertiesModel);
        this.htmlBuilder._getPropertyPanelHtml(this.propertiesConfig);
    };

    datavisual.extend(Col_4_4_4, win.datavisual.plugin.ColBase);

    Col_4_4_4.prototype._getPluginID = function() {
        return PLUGIN_ID;
    };

    Col_4_4_4.prototype._getDefaultConfig = function () {
        var dc = {
            properties: {
                ratio: '4,4,4'
            }
        };

        dc["innerContainers"] = this._getInnerContainerJson(dc.properties.ratio);

        return dc;
    };

    /**
     * api
     */
    Col_4_4_4.prototype.getCssClass = function () {
        return "zdata_col12";
    };

    win.datavisual = win.datavisual || {};
    win.datavisual.plugin = win.datavisual.plugin || {};
    win.datavisual.plugin.Col_4_4_4 = win.datavisual.plugin.Col_4_4_4 || function(config, propertiesConfig) { return new Col_4_4_4(config, propertiesConfig) };
}(jQuery, window));