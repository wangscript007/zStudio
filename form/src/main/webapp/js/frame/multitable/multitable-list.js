function btnAddNew() {
    var dataSource = $("#source_select").val();
    var master_Table = $("#master_Table").val();
    var inputDefinitionName = $("#inputDefinitionName").val();

    if (inputDefinitionName != "") {
        if (isSetNameExist(inputDefinitionName)) {
            if (dataSource != "" && master_Table != "") {
                window.location.href =
                    "html/multitable-edit.html?dataSource="
                        + dataSource + "&master_Table=" + master_Table + "&definitionName=" + inputDefinitionName+"&param=new";
            } else if (dataSource != "" && master_Table == "") {
                bootbox.alert("请选择主表！");
            } else {
                bootbox.alert("请选择数据源！");
            }
        } else {
            bootbox.alert("数据集名称已存在，请重新输入！");
        }
    } else {
        bootbox.alert("请输入数据集名称！");
    }
}

function isSetNameExist(inputDefinitionName) {
    var flag = true;
    var dataSourceArr = $("#datasource_List").bootstrapTable("getData");
    if (dataSourceArr.length > 0) {
        $.each(dataSourceArr, function (index, item) {
            if (inputDefinitionName === item.definitionName) {
                flag = false;
                return false;
            }
        });
    }
    return flag;
}


function tableConfirm() {
    $("#dataTable_List").bootstrapTable('getSelections');

}


function getSource() {
    $("#source_select").empty();
    var rows = ServerMultiTableDataSourceInfo.getServerInfo();
    if (rows.length > 0) {
        var options = [];
        if (rows.length == 1) {
            options.push("<option value=" + rows[0].sourceName + ">" + rows[0].displayName + "</option>")
        } else {
            options.push("<option value=''><--请选择--></option>");
            $.each(rows, function (index, item) {
                var sourceName = item.sourceName;
                var displayName = item.displayName;
                var option = "<option value=" + sourceName + ">" + displayName + "</option>";
                options.push(option)
            });

        }
        $("#source_select").append(options);
    }

}


function operateFormatter(value, row, index) {
    return [
        '<a class="edit" href="javascript:void(0)" title="edit">',
        '<i class="glyphicon glyphicon-edit"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-remove"></i>',
        '</a>'
    ].join('');
}

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        window.location.href = "html/multitable-edit.html?dataSource="
            + row.sourceName + "&definitionName=" + row.definitionName + "&param=update";
    },
    'click .remove': function (e, value, row, index) {
        bootbox.confirm("确认要删除当前组件吗？", function(result){
            if(result){
                $("#datasource_List").bootstrapTable('remove', {
                    field: 'definitionName',
                    values: [row.definitionName]
                });

                var dataSource = row.sourceName;
                var serverInfo = ServerMultiTableDataSourceInfo.getServerInfoByName(dataSource);
                var DataSourceController = new DataSource2MultiTable(serverInfo);

                var callBack = function (data) {
                    if (data && data.status && data.status === 1) {
                        bootbox.alert("删除成功！");
                    } else {
                        bootbox.alert("删除失败！");
                    }
                }
                DataSourceController.deleteMultiTableModel(row.definitionName, callBack);
            }
        });

    }
};

function tableInit() {
    $("#datasource_List").bootstrapTable({
        columns: [
            [
                {
                    title: '数据源',
                    field: 'displayName',
                    align: 'center',
                    valign: 'middle'

                },
                {
                    title: '数据集',
                    field: 'definitionName',
                    align: 'center',
                    valign: 'middle'
                },
                {
                    field: 'sourceName',
                    visible: false
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

function dataSetList(dataSource) {
    if (dataSource != null) {
        var multiTable = ServerMultiTableDataSourceInfo.getMultiTableNames(dataSource.sourceName);
        var data = [];
        if (multiTable.length > 0) {
            $.each(multiTable, function (index, item) {
                data.push({displayName: dataSource.displayName, definitionName: item, sourceName: dataSource.sourceName});
            });
            $("#datasource_List").bootstrapTable('append', data);
        }
    }
}

function dataSetTable() {
    var dataSource = ServerMultiTableDataSourceInfo.getServerInfo();
    if (dataSource.length > 0) {
        $.each(dataSource, function (index, item) {
            dataSetList(item);
        });
    }
}

function bindDataTableNames(dataSourceID) {
    var tableNames = ServerMultiTableDataSourceInfo.getSingleTableNames(dataSourceID);
    if (tableNames && tableNames.length > 0) {
        var options = [];
        options.push("<option value=''><--请选择--></option>")
        $.each(tableNames, function (index, item) {
            options.push("<option value =" + item.name + ">" + item.name + "</option>");
        });

        $("#master_Table").append(options);
    }
}

$(document).ready(function () {
    getSource();
    tableInit();
    dataSetTable();

    var sourceName = $("#source_select").val();
    if (sourceName) {
        bindDataTableNames(sourceName);
    }

    $("#source_select").change(function () {
        $("#master_Table").empty();
        bindDataTableNames($(this).val());
    });

    $("#btnDataSourceAdd").on('click', function () {
        btnAddNew();
    });
});