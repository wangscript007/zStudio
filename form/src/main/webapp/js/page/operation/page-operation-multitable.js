;(function($,win) {


    /**
     * 多表模型管理
     * 提供表单增、删、改、查接口
     * @constructor
     */
    function MultiTablePageModel() {
    }

    MultiTablePageModel.prototype = new IPageModel();
    MultiTablePageModel.prototype.initVMData = function () {
        //只有在修改或者查看时才填充数据
        if (!viewoperator || (viewoperator != "view" && viewoperator != "edit")) {
            return;
        }
        //构建查询参数
        var dataModel = this.getRelationModelData();
        if (!dataModel || !dataModel.definitionName || !dataModel.masterTable) {
            return;
        }

        var condition = generateCondition(getURLParameters(), "and");
        var url = this.getOperatorURL(this.getDSName(), dataModel.definitionName)
            + "?param=" + encodeURIComponent(JSON.stringify({
                condition: condition
            }));

        var $that = this;
        var callback = function (data) {
            if (!data || !data.status || data.status != 1) {
                console.log(data);
                return;
            }

            var viewModels = $("[dstype=dataset][relationmodel]");
            if (viewModels.length <= 0) {
                return;
            }

            $.each(viewModels, function (index, vm) {
                var relationModel = $.parseJSON(decodeURIComponent($(vm).attr("relationmodel")));
                if (!relationModel) {
                    console.log("no relationmodel params!");
                    return;
                }

                var dataRows = data.rows;
                if (!relationModel.slaveTables && data.slaveTables) {
                    $.each(data.slaveTables, function (subIndex, item) {
                        if (subIndex === relationModel.tableName) {
                            dataRows = item.rows;
                            return false;
                        }
                    })
                }
                /**
                 * 当是主表或是从表1比1关系时，配置avalon vm模型
                 */
                if (relationModel.slaveTables || relationModel.relationType === "one-to-one") {
                    var viewModel = eval($(vm).attr("id"));
                    $that.setModelData(viewModel, dataRows);
                } else if (relationModel.relationType === "one-to-many") {
                    var localTable = $(vm).find("[type=table_base_local]").find("table[id]");
                    if (localTable && localTable.length > 0) {
                        var tableId = $(localTable).attr("id");
                        $('#' + tableId).bootstrapTable('removeAll');
                        addRowtoLocalTable(tableId, dataRows);

                        if (viewoperator === "view") {
                            $("#" + tableId).bootstrapTable("updateTableEditable", {editable: false});
                        }
                    }
                }
            })
        }
        return this.ajaxGet(url, callback);
    }
    /**
     * 保存表单数据
     * @param dsname
     * @returns {*}
     */
    MultiTablePageModel.prototype.saveVMData = function () {
        var dataModel = this.getRelationModelData();
        if (!dataModel || !dataModel.definitionName || !dataModel.masterTable) {
            return;
        }

        var url = this.getOperatorURL(this.getDSName(), dataModel.definitionName);
        var data = {}, method = "POST", result;
        data = dataModel.masterTable;
        if (viewoperator == "edit") {
            url += "/" + encodeURIComponent(JSON.stringify({
                    condition: generateCondition(getURLParameters(), "and")
                }));
            method = "PUT";
        }

        return this.ajaxPost(method, url, data);
    }
    /**
     * 删除多表模型实例
     * @param definitionName
     * @param condition
     */
    MultiTablePageModel.prototype.deleteData = function (definitionName, conditions) {
        if (!definitionName || !conditions) {
            return;
        }

        var url = this.getOperatorURL(this.getDSName(), definitionName);
        url += "/" + encodeURIComponent(JSON.stringify({condition: generateCondition(conditions, "and")}));

        return this.ajaxDelete(url);
    }
    /**
     * 获取关系模型数据
     * @returns {*}
     */
    MultiTablePageModel.prototype.getRelationModelData = function () {
        var viewModels = $("[dstype=dataset][relationmodel]");
        if (viewModels.length <= 0) {
            return undefined;
        }

        var masterTable = {}, $that = this, dataModel = {};
        masterTable.slaveTables = {};

        $.each(viewModels, function (index, vm) {
            var relationModel = $.parseJSON(decodeURIComponent($(vm).attr("relationmodel")));
            if (!relationModel) {
                console.log("no relationmodel params!");
                return;
            }
            var dataRows = $that.getModelData(eval($(vm).attr("id")));
            if (relationModel.slaveTables) {
                masterTable.rows = [dataRows];
                dataModel.definitionName = relationModel.definitionName;
            } else {
                var tableName = relationModel.tableName;
                masterTable.slaveTables[tableName] = {};
                masterTable.slaveTables[tableName].rows = [dataRows];
                if (relationModel.relationType && relationModel.relationType === "one-to-many") {
                    var localTable = $(vm).find("[type=table_base_local]").find("table[id]");
                    if (localTable && localTable.length > 0) {
                        var tableId = $(localTable).attr("id");
                        masterTable.slaveTables[tableName].rows = [];
                        var allTableData = getTalbeAllData(tableId);
                        $.each(allTableData, function (rowIndex, dataRow) {
                            var row = {};
                            $.each(relationModel.fields, function (fIndex, field) {
                                row[field.column_name] = dataRow[field.column_name];
                            })
                            masterTable.slaveTables[tableName].rows.push(row);
                        })
                    }
                }
            }
        })

        dataModel.masterTable = masterTable;
        return dataModel;
    }

    /**
     * 获取url
     * @param dsname 数据源名称
     * @param definitionName 多表名称
     * @returns {string}
     */
    MultiTablePageModel.prototype.getOperatorURL = function (dsname, definitionName) {
        if (typeof(viewoperator) == "undefined") {
            return eval(dsname) + "multitable/runtime/object-instances?definitionName=" + definitionName;
        }
        if (viewoperator == "add" || viewoperator == "query" || viewoperator == "edit" || viewoperator == "view") {
            return eval(dsname) + "multitable/runtime/object-instances/" + definitionName;
        }
        else {
            console.log("viewoperator error " + viewoperator);
            return eval(dsname) + "multitable/runtime/object-instances?definitionName=" + definitionName;
        }
    }

    $.bfd = $.bfd || {};
    $.bfd.multiTablePageModel = new MultiTablePageModel();
}(jQuery,window))