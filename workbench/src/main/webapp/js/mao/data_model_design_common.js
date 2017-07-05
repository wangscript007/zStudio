/*
*数据模型设计公共的处理方法类
 */
var DataModelDesignCommon = function () {
};

DataModelDesignCommon.prototype = {
    /*
    * 面板分组集合
     * */
    modelItemGroups: {},
    /*
     * 场景3的时候，删除自定义的表或视图
     * */
    handleDeleteTable: function (dataModelBaseInfo) {
        if (dataModelBaseInfo.SCENE == '3'
            && dataModelBaseInfo.BIND_TABLE_NAME
            && dataModelDesigner.isExecute) {
            var deleteTableUrlAndParam = '/' + $base_url + '/model/';
            deleteTableUrlAndParam += 'delete/table?tableName=' + dataModelBaseInfo.BIND_TABLE_NAME;
            this.ajaxMethod('DELETE', deleteTableUrlAndParam, undefined);
        }
    },
    /*
     * 返回主页
     * */
    backMain: function (appid) {
        window.location.href = 'app-design-main.html?appid=' + appid;
    },
    /*
     * 字段类型格式化
     * */
    dataItemColumnTypeFormatter : function(value, row, index) {
        var dataModelItemType = dataModelColumnDataMapping
            .itemColumnTypeDataMapping();
        for (var i = 0, len = dataModelItemType.length; i < len; i++) {
            if (dataModelItemType[i].id == value) {
                return dataModelItemType[i].name;
            }
        }
        return '';
    },
    /*
     * 布局类型格式化
     * */
    dataItemLayoutFormatter : function(value, row, index) {
        var dataModelItemType = dataModelColumnDataMapping
            .itemColumnLayoutDataMapping();
        for (var i = 0, len = dataModelItemType.length; i < len; i++) {
            if (dataModelItemType[i].id == value) {
                return dataModelItemType[i].name;
            }
        }
        return '';
    },
    /*
     * 显示类型格式化
     * */
    dataItemUiVsibleFormatter : function(value, row, index) {
        var dataModelItemType = dataModelColumnDataMapping
            .itemColumnUiVsibleDataMapping();
        for (var i = 0, len = dataModelItemType.length; i < len; i++) {
            if (dataModelItemType[i].id == value) {
                return dataModelItemType[i].name;
            }
        }
        return '';
    },
    /*
     * 主键类型格式化
     * */
    dataItemColumnKeyFormatter : function(value, row, index) {
        var dataModelItemType = dataModelColumnDataMapping
            .itemColumnKeyDataMapping();
        for (var i = 0, len = dataModelItemType.length; i < len; i++) {
            if (dataModelItemType[i].id == value) {
                return dataModelItemType[i].name;
            }
        }
        return '';
    },
    /*
     * 操作类型格式化
     * */
    dataItemOperatorFormatter : function(value, row, index) {
        var rowStr = encodeURIComponent(JSON.stringify(row));
        var operatorData = '';
        operatorData += '<span style="cursor:pointer;" onclick="dataModelDesignLogic.dataItemOperator(1, \'' + rowStr +  '\', ' + index + ');" title="查看" class="glyphicon glyphicon-search"></span>';
        operatorData += ' <span style="cursor:pointer;" onclick="dataModelDesignLogic.dataItemOperator(2, \'' + rowStr +  '\', ' + index + ');" title="编辑" class="glyphicon glyphicon-pencil"></span>';
        if (dataModelDesignLogic.dataModelSceneType == 2) {
            operatorData += ' <span style="cursor:pointer;" onclick="dataModelDesignLogic.dataItemOperator(3, \'' + rowStr +  '\', ' + index + ');" title="删除" class="glyphicon glyphicon-remove"></span>';
        }
        return operatorData;
    },
    /*
     * 是否为空格式化
     * */
    dataItemColumnIsNullFormatter : function(value, row, index) {
        var dataModelItemIsNull = dataModelColumnDataMapping
            .itemColumnIsNullDataMapping();
        for (var i = 0, len = dataModelItemIsNull.length; i < len; i++) {
            if (dataModelItemIsNull[i].id == value) {
                return dataModelItemIsNull[i].name;
            }
        }
        return '';
    },
    /*
     * 组件类型格式化
     * */
    dataItemColumnComponentTypeFormatter : function(value, row, index) {
        var dataModelItemIsNull = dataModelColumnDataMapping
            .itemColumnComponentTypeDataMapping();
        for (var i = 0, len = dataModelItemIsNull.length; i < len; i++) {
            if (dataModelItemIsNull[i].id == value) {
                return dataModelItemIsNull[i].name;
            }
        }
        return '其他';
    },
    /*
     * 面板分组类型格式化
     * */
    dataItemColumnDataBlockFormatter : function(value, row, index) {
        var modelItemGroups = dataModelDesignCommon.modelItemGroups;
        if (Object.keys(modelItemGroups).length == 0) {
            modelItemGroups = dataModelDesigner.modelItemGroups;
        }
        for (var field in modelItemGroups) {
            if (value == field) {
                return modelItemGroups[field];
            }
        }
        return '';
    },
    /*
     * 数据项字段数组
     * */
    getDataItemColumnDatas: function () {
        return [
            {
                field: 'ID',
                title: '数据项标识',
                formatter: ''
            },
            {
                field: 'NAME',
                title: '数据项名称',
                formatter: ''
            },
            {
                field: 'TYPE',
                title: '类型',
                formatter: 'dataModelDesignCommon.dataItemColumnTypeFormatter'
            },
            {
                field: 'LENGTH',
                title: '长度',
                formatter: ''
            },
            {
                field: 'DECIMAL',
                title: '精度',
                formatter: ''
            },
            {
                field: 'COLUMN_KEY',
                title: '主键',
                formatter: 'dataModelDesignCommon.dataItemColumnKeyFormatter'
            },
            {
                field: 'IS_NULL',
                title: '值为空',
                formatter: 'dataModelDesignCommon.dataItemColumnIsNullFormatter'
            },
            {
                field: 'COMPONENT_TYPE',
                title: '组件类型',
                formatter: 'dataModelDesignCommon.dataItemColumnComponentTypeFormatter'
            },
            {
                field: 'UI_VISIBLE',
                title: '可显示',
                formatter: 'dataModelDesignCommon.dataItemUiVsibleFormatter'
            },
            {
                field: 'LAYOUT',
                title: '布局类型',
                formatter: 'dataModelDesignCommon.dataItemLayoutFormatter'
            },
            {
                field: 'DATA_BLOCK',
                title: '面板分组',
                formatter: 'dataModelDesignCommon.dataItemColumnDataBlockFormatter'
            }
        ];
    },
    /*
     * 获取数据模型基础信息
     * */
    getDataModelDetailBase: function (dataModelInfo) {
        return {
            id: dataModelInfo.ID,
            name: dataModelInfo.NAME,
            description: dataModelInfo.DESCRIPTION,
            scene: dataModelInfo.SCENE,
            creator: dataModelInfo.CREATOR,
            bindTable: dataModelInfo.BIND_TABLE_NAME,
            i18n: dataModelInfo.I18N,
            script: dataModelInfo.SCRIPT,
            packageId: dataModelInfo.PACKAGE_ID
        };
    },
    /*
     * 获取数据模型信息
     * */
    getDataModelDetail: function (dataModelInfo, dataItems, modelItemGroups) {
        return {
            basic: dataModelInfo,
            modelItems: this.getDataModelDetailModelItems(dataItems),
            modelItemGroups: modelItemGroups
        };
    },
    /*
     * 获取数据项信息
     * */
    getDataModelDetailModelItems: function (dataItems) {
        if (dataItems == false) {
            return [];
        }
        var dataModelDetailModelItems = [];
        for (var i = 0, len = dataItems.length; i < len; i++) {
            var dataItem = dataItems[i];
            dataModelDetailModelItems.push({
                id: dataItem.ID,
                name: dataItem.NAME,
                type: dataItem.TYPE,
                null: dataItem.IS_NULL == "1" ? true : false,
                columnKey: dataItem.COLUMN_KEY,
                length: dataItem.LENGTH,
                decimal: dataItem.DECIMAL,
                defaultValue: dataItem.DEFAULT,
                componentType: dataItem.COMPONENT_TYPE,
                uiVisible: dataItem.UI_VISIBLE == 1 ? true : false,
                layout: dataItem.LAYOUT,
                dataBlock: dataItem.DATA_BLOCK
            });
        }
        return dataModelDetailModelItems;
    },
    /*
     * 获取数据项表格字段属性
     * */
    getDataItemColumn: function (field, title, formatter) {
        return {
            field: field,
            title: title,
            formatter: formatter,
            editable: false,
            visible: true,
            validate: "",
            valign: "middle",
            class: "td-word-wrap"
        };
    },
    /*
     * 获取所有数据项表格字段属性
     * */
    getDataItemColumns: function () {
        var columns = [];
        var dataItemColumnDatas = this.getDataItemColumnDatas();
        for (var i = 0, len = dataItemColumnDatas.length; i < len; i++) {
            var dataItemColumnData = dataItemColumnDatas[i];
            columns.push(this.getDataItemColumn(dataItemColumnData.field, dataItemColumnData.title, dataItemColumnData.formatter));
        }
        return columns;
    },
    /*
     * 获取数据项表格属性
     * */
    dataItemDetailBootstrapTable: function (columns) {
        return {
            striped: true,
            pagination: false,
            height: '300',
            search: false,
            showColumns: false,
            selectItemName: 'btSelectItemtable_base_local1481533395638',
            showRefresh: false,
            sidePagination: 'client',
            sortable: true,
            columns: columns,
            data:[]
        };
    },
    /*
     * 获取没有操作数据项表格信息
     * */
    dataItemDetailTable: function () {
        return this.dataItemDetailBootstrapTable(this.getDataItemColumns());
    },
    /*
     * ajax请求方法
     * */
    ajaxMethod : function(method, urlAndParam, bodyData) {
        return $.designerAjax(method, urlAndParam, bodyData, undefined,
            undefined);
    },
    /*
     * 获取带有操作和选择的数据项表格信息
     * */
    dataItemTable: function () {
        var commons = this.getDataItemColumns();
        commons.splice(0, 0, {
            field: 'state_form_disabled',
            checkbox: true
        });
        commons.splice(commons.length, 0, this.getDataItemColumn('operate', '操作', 'dataModelDesignCommon.dataItemOperatorFormatter'));
        return this.dataItemDetailBootstrapTable(commons);
    }
}
var dataModelDesignCommon = new DataModelDesignCommon();