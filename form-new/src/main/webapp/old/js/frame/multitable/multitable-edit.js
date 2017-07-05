/**
 * 主表字段加载
 */
function initMasterTable() {
    var search;
    if (typeof  pageParams == "undefined") {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var masterTable = getUrlParam("master_Table", search);
    var definitionName = getUrlParam("definitionName", search);
    if (masterTable == null && definitionName != null) {
        var tableModel = ServerMultiTableDataSourceInfo.getMultiTableModel(dataSource, definitionName);
        if (tableModel != undefined) {
            masterTable = tableModel.tableName;
        }
    }
    $("#master_TableName").append("主表：" + masterTable);
    $("#master_TableName").append("<span style=\"margin-left:20px;\">只读：<input type=\"checkbox\" id =\"masterTableReadOnly\"></span>");
    var tableField = ServerMultiTableDataSourceInfo.getSingleTableFields(dataSource,masterTable);
    var dataField = [];
    $("#master_TableField").bootstrapTable({
        columns: [
            [
                {
                    field: 'check_state',
                    checkbox: true
                },
                {
                    field: 'columnName',
                    title: '字段名',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'columnType',
                    title: '类型',
                    align: 'center',
                    valign: 'middle'
                }
            ]
        ]
    });
    if (tableField.length > 0) {
        $.each(tableField, function (index, item) {
            dataField.push({columnName: item.name, columnType: item.type});
        });
        $("#master_TableField").bootstrapTable('load', dataField);
    }

}

/**
 * 初始化关系设置表格
 */
function initRelationSetTable() {
    var search;
    if (typeof  pageParams == "undefined") {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var definitionName = getUrlParam("definitionName", search);

    $("#relation_Set").bootstrapTable({
        columns: [
            [
                {
                    field: 'relationShip',
                    title: '主从表关系',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'masterField',
                    title: '主表字段',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'slaveField',
                    title: '从表字段',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'fields',
                    visible: false
                },
                {
                    field: 'readOnly',
                    visible: false
                },
                {
                    field: 'tableName',
                    title: '从表表名',
                    align: 'center',
                    valign: 'middle'
                }
            ]
        ]
    })
    if (definitionName != null) {
        var multiTableModel = ServerMultiTableDataSourceInfo.getMultiTableModel(dataSource, definitionName);
        if (multiTableModel != undefined && multiTableModel != null) {
            var readOnly = multiTableModel.readOnly;
            $("#masterTableReadOnly").prop("checked", readOnly);
            var masterSelectFields = multiTableModel.fields;
            if (masterSelectFields.length > 0) {
                var masterTableFields = $("#master_TableField").bootstrapTable("getData");
                $.each(masterSelectFields, function (index, item) {
                    if (masterTableFields.length > 0) {
                        $.each(masterTableFields, function (index, subItem) {
                            if (item.column_name == subItem.columnName) {
                                $("#master_TableField").bootstrapTable("checkBy", {field: "columnName", values: [item.column_name]});
                            }
                        });
                    }
                });
            }
            var slaveTables = multiTableModel.slaveTables;
            if (slaveTables.length > 0) {
                var relationData = [];
                $.each(slaveTables, function (index, item) {
                    var masterArr = item["master-columns"];
                    var slaveArr = item["slave-columns"];
                    $.each(masterArr, function (subIndex, subItem) {
                        var subData = {};
                        subData["relationShip"] = item.relationType;
                        subData["tableName"] = item.tableName;
                        subData["masterField"] = subItem;
                        subData["slaveField"] = slaveArr[subIndex];
                        subData["fields"] = [];
                        subData["readOnly"] = item.readOnly;
                        subData["fields"] = item.fields;
                        relationData.push(subData);
                    });
                });
                $("#relation_Set").bootstrapTable('load', relationData);
                initSlaveTables(dataSource, slaveTables);
            }
        }
    }
}

/**
 * 从表初始化
 * @param slaveTables
 */
function initSlaveTables(dataSource, slaveTables) {
    var html = [];
    if (slaveTables.length > 0) {
        var total = slaveTables.length;
        $.each(slaveTables, function (index, item) {
            var checkId = item.tableName + "Panel";
            if (index % 2 == 0) {
                html.push("<div class=\"row\">");
            }
            html.push("<div class=\"col-md-6\">");
            html.push("<div class=\"panel panel-default\">");
            html.push("<div class=\"panel-heading\">从表：" + item.tableName);
            html.push("<span style=\"margin-left:20px;\">只读：<input type=\"checkbox\" id=" + checkId + "></span>")
            html.push("</div>");
            html.push("<table class=\"table table-bordered\" id=" + item.tableName + "></table>");
            html.push("</div></div>");
            if (index % 2 != 0 || total - 1 == index) {
                html.push("</div>");
            }
        });
        var slaveHtml = html.join(" ");
        $("#slaveTableContainer").empty();
        $("#slaveTableContainer").html(slaveHtml);
        $.each(slaveTables, function (index, item) {
            var $item = $("#" + item.tableName);
            var tableField = ServerMultiTableDataSourceInfo.getSingleTableFields(dataSource, item.tableName);
            var data = [];
            if (tableField.length > 0) {
                $.each(tableField, function (index, subItem) {
                    data.push({columnName: subItem.name, columnType: subItem.type});
                });
            }
            $item.bootstrapTable({
                columns: [
                    [
                        {
                            field: 'check_state',
                            checkbox: true
                        },
                        {
                            field: 'columnName',
                            title: '字段名',
                            align: 'center',
                            valign: 'middle'
                        },
                        {
                            field: 'columnType',
                            title: '类型',
                            align: 'center',
                            valign: 'middle'
                        }
                    ]
                ],
                data: data
            });
            if (item.fields != undefined && item.fields.length > 0) {
                var readOnly = item.readOnly;
                var checkId = item.tableName + "Panel";
                $("#" + checkId).prop("checked", readOnly);
                var fields = item.fields;
                var slaveTableFields = $item.bootstrapTable("getData");
                $.each(fields, function (index, sub2Item) {
                    if (slaveTableFields.length > 0) {
                        $.each(slaveTableFields, function (index, sub3Item) {
                            if (sub2Item.column_name == sub3Item.columnName) {
                                $item.bootstrapTable("checkBy", {field: "columnName", values: [sub2Item.column_name]});
                            }
                        });
                    }
                });
            }
        });
    }
}

/**
 * 关系设置添加按钮
 */
function clickToRelationSet() {
    var search;
    if (typeof pageParams == "undefined") {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var masterTable = getUrlParam("master_Table", search);
    var definitionName = getUrlParam("definitionName", search);

    if (masterTable == null && definitionName != null) {
        var tableMode = ServerMultiTableDataSourceInfo.getMultiTableModel(dataSource, definitionName);
        if (tableMode != undefined) {
            masterTable = tableMode.tableName;
        }
    }
    showModalDialog
    ('relationShipSet', '关系设置', 'html/multitable-relation.html?dataSource=' + dataSource + '&master_Table=' + masterTable);
}

/**
 * 子页面加载父页面的数据
 */
function subTableGetData() {
    var tableData = $("#relation_Set").bootstrapTable('getData');
    if (tableData != null && tableData.length > 0) {
        $("#relationShipTable").bootstrapTable('load', tableData);
    }
}

/**
 * 封装数据
 */
function packData() {
    var search;
    if (typeof pageParams == "undefined") {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var masterTable = getUrlParam("master_Table", search);
    var definitionName = getUrlParam("definitionName", search);
    if (masterTable == null && definitionName != null) {
        var tableModel = ServerMultiTableDataSourceInfo.getMultiTableModel(dataSource, definitionName);
        if (tableModel != undefined) {
            masterTable = tableModel.tableName;
        }
    }
    var masterTableFieldModel = $("#master_TableField").bootstrapTable("getSelections");
    var masterReadOnly = $("#masterTableReadOnly").prop("checked");
    var data = {};
    data.definitionName = definitionName;
    data.tableName = masterTable;
    data.fields = [];
    if (masterTableFieldModel.length > 0) {
        $.each(masterTableFieldModel, function (index, item) {
            data.fields.push({data_type: item.columnType, column_name: item.columnName});
        });
    }
    data.readOnly = masterReadOnly;
    var relationTableList = $("#relation_Set").bootstrapTable("getData");
    data.slaveTables = [];

    var initData = [];
    var subData = {};

    if (relationTableList.length > 0) {
        $.each(relationTableList, function (index, item) {
            if (initData.length > 0) {
                if (isTableInData(initData, item.tableName)) {
                    var tableIndex = getTableNameRow(initData, item.tableName);
                    initData[tableIndex].masterField.push(item.masterField);
                    initData[tableIndex].slaveField.push(item.slaveField);
                } else {
                    subData = {};
                    subData["masterField"] = [];
                    subData["slaveField"] = [];
                    subData["fields"] = [];
                    subData["fields"] = item.fields;
                    subData["masterField"].push(item.masterField);
                    subData["slaveField"].push(item.slaveField);
                    subData["relationShip"] = item.relationShip;
                    subData["tableName"] = item.tableName;
                    initData.push(subData);
                }
            } else {
                subData["masterField"] = [];
                subData["slaveField"] = [];
                subData["fields"] = [];
                subData["fields"] = item.fields;
                subData["masterField"].push(item.masterField);
                subData["slaveField"].push(item.slaveField);
                subData["relationShip"] = item.relationShip;
                subData["tableName"] = item.tableName;
                initData.push(subData);
            }
        })
        $.each(initData, function (index, item) {
            var checkId = item.tableName + "Panel";
            var readOnly = $("#" + checkId).prop("checked");
            var $tableName = $("#" + item.tableName);

            var subTable = {};
            subTable["master-columns"] = [];
            subTable["slave-columns"] = [];
            subTable["fields"] = [];
            subTable["tableName"] = item.tableName;
            subTable["relationType"] = item.relationShip;
            subTable["readOnly"] = readOnly;

            var slaveTableFieldList = $tableName.bootstrapTable("getSelections");
            if (slaveTableFieldList.length > 0) {
                $.each(slaveTableFieldList, function (sub3index, sub3Item) {
                    subTable["fields"].push({data_type: sub3Item.columnType, column_name: sub3Item.columnName});
                });
            }

            var masterArr = item.masterField;
            var slaveArr = item.slaveField;

            $.each(masterArr, function (subIndex, subItem) {
                subTable["master-columns"].push(subItem);
            });

            $.each(slaveArr, function (sub2Index, sub2Item) {
                subTable["slave-columns"].push(sub2Item);
            });

            data.slaveTables.push(subTable);

        });
        return data;
    }
}

/**
 * 判断从表字段是否已选择
 * @param data
 */
function selectSlaveField(data){
    var result = false;
    var slaveTable = data.slaveTables;
    $.each(slaveTable,function(index,item){
        if(item.fields.length <=0 ){
            result = true;
            return false;
        }
    });
    return result;
}

/**
 * 保存数据集
 */
function saveMultiTable() {
    var search;
    if (typeof pageParams == "undefined") {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var param = getUrlParam("param", search);

    var data = packData();
    if (data === undefined) {
        bootbox.alert("请设置主从关系！");
    } else if (selectSlaveField(data)) {
        bootbox.alert("请选择从表字段！")
    } else if(data.fields <= 0){
        bootbox.alert("请选择主表字段！");
    }else{
        var json_data = JSON.stringify(data);

        var serverInfo = ServerMultiTableDataSourceInfo.getServerInfoByName(dataSource);
        var DataSourceController = new DataSource2MultiTable(serverInfo);

        var callBack = function (data) {
            if (data && data.status && data.status === 1) {
                bootbox.alert("存储成功！",function(){
                    window.location.href = "html/multitable-list.html";
                });

            } else {
                bootbox.alert("存储失败！");
            }
        }
        //新增
        if (param === "new") {
            DataSourceController.addMultiTableModel(json_data, callBack);
        } else {
            DataSourceController.updateMultiTableModel(json_data, callBack);
        }
    }

}

$(document).ready(function () {
    initMasterTable();
    initRelationSetTable();
    $("#relationSetBtn").on('click', function () {
        clickToRelationSet();
    });
    $("#btnCancel").on('click', function () {
        window.location.href = "html/multitable-list.html";
    });
    $("#btnSave").on('click', function () {
        saveMultiTable()
    });
})