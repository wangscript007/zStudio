/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var PLUGIN_ID = "table_detail";
    var SCHEMA_TYPE_COLUMNS  = "columns";

    var Table_detail = function(el, schema) {
        this.el = el;
        this.schema = schema;
    };

    Table_detail.prototype.getHtmlElement = function() {
        return this.el[0];
    };

    /**
     * api
     */
    Table_detail.prototype.getDataSourceInfo = function() {
        return {"datasource":this.schema.datasource, "dataset":this.schema.dataset};
    };

    Table_detail.prototype.getQueryCondArr = function() {
        var schema = this.schema;
        var condArr = [];

        $.each(schema[SCHEMA_TYPE_COLUMNS], function(key, value) {
            if (value && value.fieldName) {
				var ormParam = value.type == 'value' ? 
								runtime.workset.OrmCommon.handlColumn_Metric(value) : 
								runtime.workset.OrmCommon.handlColumn_Dimension(value);
				condArr.push(ormParam);
            }
        });

        return condArr;
    };

    /**
     *
     * @param rows
     * @returns {*}
     */
    Table_detail.prototype.getTableHtml = function(rows) {
        if (this.schema[SCHEMA_TYPE_COLUMNS] == null || this.schema[SCHEMA_TYPE_COLUMNS] == undefined ||
            this.schema[SCHEMA_TYPE_COLUMNS].length < 1) {
            return false;
        }

        var ctrlItem = {};
        ctrlItem.columns = [];

        $.each(this.schema[SCHEMA_TYPE_COLUMNS], function(index, item) {
            ctrlItem.columns.push({
                fieldName: item.fieldName,
                displayText: item.displayText
            });
        });

        return this._buildTableHtml(ctrlItem, rows);
    };

    /**
     *
     * @param ctrlItem
     * @param data
     * @returns {string}
     * @private
     */
    Table_detail.prototype._buildTableHtml = function(ctrlItem, data) {
        var columns = ctrlItem.columns;

        var html = '<div style="width: 100%;">';

        //表头 table-head
        html += '<div class="table-head">';
        html += '<table>';
        html += '<colgroup>';
        html += '<col style="width: initial;" />';
        html += '</colgroup>';
        html += '<thead>';
        html += '<tr>';
        for (var i=0; i<columns.length; i++) {
            html += '<th>' + columns[i].displayText + '</th>';
        }
        html += '</tr>';
        html += '</thead>';
        html += '</table>';
        html += '</div>';

        //表数据 table-body
        html += '<div class="table-body">';
        html += '<table>';
        html += '<colgroup>';
        html += '<col style="width: initial;" />';
        html += '</colgroup>';
        html += '<tbody>';
        for (var j=0; j<data.length; j++) {
            var dataInfo = data[j];
            html += '<tr>';
            for (var k=0; k<columns.length; k++) {
                var dataItem = dataInfo[columns[k].fieldName];
                if (dataItem == null) {
                    html += '<td></td>';
                } else {
                    html += '<td>' + dataInfo[columns[k].fieldName] + '</td>';
                }
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        html += '</div>';

        return html;
    };

    function render(plugin) {
        var dsInfo = plugin.getDataSourceInfo();
        var condArr = plugin.getQueryCondArr();

        window.runtime.workset.OrmCommon.getChartData(dsInfo, condArr, function(rows) {
            var tableHtml = plugin.getTableHtml(rows);
            if (tableHtml === false) {
                return;
            }

            plugin.getHtmlElement().innerHTML = tableHtml;
        });
    }

    $.fn.zdata_table_detail = function(options, param) {
        this.each(function () {
            var el = $(this);

            var plugin = new Table_detail(el, options);
            el.data(PLUGIN_ID, plugin);
            render(plugin);
        });

        return this;
    };
}(jQuery, window));