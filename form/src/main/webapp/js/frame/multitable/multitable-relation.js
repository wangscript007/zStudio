/**
 * 从表选项加载
 */
function getSlaveTables() {
    var search;
    if (pageParams == undefined) {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var masterTable = getUrlParam("master_Table", search);

    var tableNames = ServerMultiTableDataSourceInfo.getSingleTableNames(dataSource);
    var options = [];
    if (tableNames.length > 0) {
        $.each(tableNames, function (index, item) {
            if (item != masterTable) {
                var option = "<option value=" + item.name + ">" + item.name + "</option>";
                options.push(option);
            }
        });
    }
    $("#slaveTable").append(options);
}

/**
 * 主从表获取字段名选项共用方法
 * @param dataSource
 * @param tableName
 */
function getTableFieldNames(dataSource, tableName) {
    var tableField = ServerMultiTableDataSourceInfo.getSingleTableFields(dataSource, tableName);
    var options = [];
    if (tableField.length > 0) {
        $.each(tableField, function (index, item) {
            var option = "<option value=" + item.name + ">" + item.name + "</option>";
            options.push(option);
        });
    }
    return options;
}

/**
 * 获取主表字段
 */
function getMasterFields() {
    var search;
    if (pageParams == undefined) {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var masterTable = getUrlParam("master_Table", search);
    var options = this.getTableFieldNames(dataSource, masterTable);
    $("#masterTableField").append(options);
}

/**
 * 表格格式初始化
 */
function initRelationTable() {
    $("#relationShipTable").bootstrapTable({
        columns: [
            [
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
                    field: 'relationShip',
                    visible: false
                },
                {
                    field: 'tableName',
                    title: '从表表名',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'fields',
                    visible: false
                },
                {
                    field:'readOnly',
                    visible:false
                },
                {
                    title: '操作',
                    field: 'operate',
                    align: 'center',
                    valign: 'middle',
                    events: operateEvents,
                    formatter: operateFormatter
                }
            ]
        ]
    });
}

/**
 *  表格操作列格式化
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function operateFormatter(value, row, index) {
    return [
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
}

/**
 * 表格格式化方法
 * @type {{click .remove: Function}}
 */
window.operateEvents = {
    'click .remove': function (e, value, row, index) {
        $("#relationShipTable").bootstrapTable('remove', {
            field: 'slaveField',
            values: [row.slaveField]
        });
    }
};


/**
 * 判断是否加入已经加入到表格中
 */
function isTableNameExist(relationTableData, slaveTables) {
    var result = false;
    if (!relationTableData || relationTableData.length <= 0) {
        return result;
    }

    $.each(relationTableData, function (index, item) {
        if (slaveTables === item.tableName) {
            result = true;
            return false;
        }
    })

    return result;
}

/**
 * 判断主表是否已经存在
 * @param relationTableData
 * @param masterTableField
 * @returns {boolean}
 */
function isMasterFieldUsed(relationTableData, masterTableField, slaveTablesName) {
    var result = false;
    if (!relationTableData || relationTableData.length <= 0) {
        return result;
    }

    $.each(relationTableData, function (index, item) {
        if (masterTableField === item.masterField) {
            if (item.tableName != slaveTablesName) {
                result = true;
                return false;
            }
        }
    })

    return result;
}

/**
 * 判断主表字段是否已经存在表格当中
 * @param masterTableField
 * @param relationTableData
 * @returns {boolean}
 */
function isTableMasterFieldUsed(masterTableField, relationTableData) {
    var result = false;
    var masterFieldArr = [];
    for (var i = 0; i < relationTableData.length; i++) {
        var columnIndex = i * 4;
        var masterField = $("#relationShipTable tr td").eq(columnIndex).text();
        masterFieldArr.push(masterField);
    }
    $.each(masterFieldArr, function (index, item) {
        if (masterTableField === item) {
            result = true;
            return false;
        }
    });
    return result;
}

/**
 * 判断从表字段是否已经存在表格当中
 * @param slaveTableField
 * @param relationTableData
 * @returns {boolean}
 */
function isTableSlaveFieldUsed(slaveTableField, relationTableData) {
    var result = false;
    var slaveFieldArr = [];
    for (var i = 0; i < relationTableData.length; i++) {
        var columnIndex = (i * 4) + 1;
        var slaveField = $("#relationShipTable tr td").eq(columnIndex).text();
        slaveFieldArr.push(slaveField);
    }
    $.each(slaveFieldArr, function (index, item) {
        if (slaveTableField === item) {
            result = true;
            return false;
        }
    });
    return result;
}
/**
 * 获取主表字段所在行
 * @param masterTableField
 * @param relationTableData
 * @returns {*}
 */
function getMasterTableFieldIndex(masterTableField, relationTableData) {
    var rowIndex;
    $.each(relationTableData, function (index, item) {
        if (masterTableField === item.masterField) {
            rowIndex = index;
        }
    });
    return rowIndex;
}
/**
 * 获取从表字段所在行
 * @param slaveTableField
 * @param relationTableData
 * @returns {*}
 */
function getSlaveTableFieldIndex(slaveTableField, relationTableData) {
    var rowIndex;
    $.each(relationTableData, function (index, item) {
        if (slaveTableField === item.slaveField) {
            rowIndex = index;
        }
    });
    return rowIndex;
}
/**
 * 添加按钮点击事件
 */
function masterSlaveRelationAdd() {
    var $masterTableField = $("#masterTableField").val();
    var $slaveTableField = $("#slaveTableField").val();
    var $relationShip = $("#relationShip").val();
    var $slaveTables = $("#slaveTable").val();

    var masterFieldName = "masterField";
    var slaveFieldName = "slaveField";

    var fields = [];
    var data = [];
    data.push({masterField: $masterTableField,
        slaveField: $slaveTableField, relationShip: $relationShip, tableName: $slaveTables,fields:fields});
    if ($masterTableField != null && $slaveTableField != null) {
        var relationTableData = $("#relationShipTable").bootstrapTable("getData");
        if (isTableNameExist(relationTableData, $slaveTables)) {
            $.each(relationTableData, function (index, item) {
                if ($slaveTables === item.tableName) {
                    if (isTableMasterFieldUsed($masterTableField, relationTableData)
                        && isTableSlaveFieldUsed($slaveTableField, relationTableData)) {
                        if (isMasterFieldUsed(relationTableData, $masterTableField, $slaveTables)) {
                            bootbox.alert("主表字段已关联!");
                        } else {
                            $("#relationShipTable").bootstrapTable('remove', {
                                field: masterFieldName,
                                values: [$masterTableField]
                            });
                            $("#relationShipTable").bootstrapTable('remove', {
                                field: slaveFieldName,
                                values: [$slaveTableField]
                            });
                            $("#relationShipTable").bootstrapTable('append', data);
                        }
                    } else if (isTableMasterFieldUsed($masterTableField, relationTableData)
                        && isTableSlaveFieldUsed($slaveTableField, relationTableData) === false) {

                        var rowIndex = getMasterTableFieldIndex($masterTableField, relationTableData);
                        $("#relationShipTable").bootstrapTable('updateCell', {
                            index: rowIndex,
                            field: slaveFieldName,
                            value: $slaveTableField
                        });


                    } else if (isTableMasterFieldUsed($masterTableField, relationTableData) === false
                        && isTableSlaveFieldUsed($slaveTableField, relationTableData)) {

                        var rowIndex = getSlaveTableFieldIndex($slaveTableField, relationTableData);
                        $("#relationShipTable").bootstrapTable('updateCell', {
                            index: rowIndex,
                            field: masterFieldName,
                            value: $masterTableField
                        });

                    } else if (isTableMasterFieldUsed($masterTableField, relationTableData) === false
                        && isTableSlaveFieldUsed($slaveTableField, relationTableData) === false) {

                        $("#relationShipTable").bootstrapTable('append', data);

                    }

                }

            });
        } else {
            if (isMasterFieldUsed(relationTableData, $masterTableField, $slaveTables)) {
                bootbox.alert("主表字段已关联!");
            } else {
                $("#relationShipTable").bootstrapTable('append', data);
            }
        }
    } else {
        bootbox.alert("请选择字段！");
    }
}

/**
 * 判断表名是否已经存在
 * @param initData
 * @param tableName
 * @returns {boolean}
 */
function isTableInData(initData,tableName){
    var result = false;
    if(initData.length > 0){
        $.each(initData,function(index,item){
            if(tableName === item.tableName){
                result = true;
                return false;
            }
        });
        return result;
    }
}

/**
 * 获取表名所在的下标
 * @param initData
 * @param tableName
 */
function getTableNameRow(initData,tableName){
    var tableIndex ;
    $.each(initData,function(index,item){
        if(tableName === item.tableName){
            tableIndex = index
            return false;
        }
    });
    return tableIndex;
}

/**
 * 确认按钮将数据加载回父页面
 */
function addRelationToSelectTable() {
    var search;
    if (pageParams == undefined) {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var data = $("#relationShipTable").bootstrapTable('getData');
    var initData = [];
    var subData = {};

    if (data.length > 0) {
        $.each(data,function(index,item){
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
                    subData["readOnly"] = item.readOnly;
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
                subData["readOnly"] = item.readOnly;
                initData.push(subData);
            }
        });

        $("#relation_Set").bootstrapTable('load', data);
        initSlaveTables(dataSource, initData);
        hideModalDialog("relationShipSet");
    } else {
        bootbox.alert("请选择关联字段！");
    }
}

$(document).ready(function () {
    initRelationTable();
    getSlaveTables();
    getMasterFields();
    subTableGetData();
    var search;
    if (pageParams == undefined) {
        search = window.location.search;
    } else {
        search = pageParams;
    }
    var dataSource = getUrlParam("dataSource", search);
    var $slaveTable = $("#slaveTable");
    if ($slaveTable.val() != null) {
        var options = getTableFieldNames(dataSource, $slaveTable.val());
        $("#slaveTableField").append(options);
    }
    $("#slaveTable").change(function () {
        $("#slaveTableField").empty();
        var selectValue = $(this).val();
        var options = getTableFieldNames(dataSource, selectValue);

        $("#slaveTableField").append(options);
    });


    $("#relationAddBtn").on('click', function () {
        masterSlaveRelationAdd();
    });
    $("#relationReviewBtn").on('click', function () {
        addRelationToSelectTable();
    });
})