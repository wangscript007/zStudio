var DataModelColumnDataMapping = function() {};
DataModelColumnDataMapping.prototype = {
    /**
     * 初始化所有的数据项类型名称
     */
    itemColumnTypeDataMapping: function() {
        return [
                {id: 1, name: '短文本'},
                {id: 2, name: '长文本'},
                {id: 3, name: '逻辑型'},
                {id: 4, name: '整数'},
                {id: 5, name: '单精度型'},
                {id: 6, name: '日期'},
                {id: 7, name: '长整型'},
                {id: 8, name: '双精度型'}
         ];
    },
    /**
     * 根据数据库字段类型映射数据项类型
     */
    dataBaseColumnTypeToDataModelItemType: function (dataBaseColumnType, columnLength, decimal) {
        if ((dataBaseColumnType == 'char' || dataBaseColumnType == 'varchar') && columnLength <= 300) {
            return 1;
        }
        if (dataBaseColumnType == 'char' || dataBaseColumnType == 'varchar') {
            return 2;
        }
        if (dataBaseColumnType == 'bool') {
            return 3;
        }
        if (dataBaseColumnType == 'int' || dataBaseColumnType == 'integer' || dataBaseColumnType == 'tinyint') {
            return 4;
        }
        if (dataBaseColumnType == 'float') {
            return 5;
        }
        if (dataBaseColumnType == 'datetime' || dataBaseColumnType == 'date' || dataBaseColumnType == 'time') {
            return 6;
        }
        if (dataBaseColumnType == 'bigint') {
            return 7;
        }
        if (dataBaseColumnType == 'double') {
            return 8;
        }
        return 0;
    },
    /**
     * 根据key返回数据项映射的数据项类型名称
     */
    itemColumnTypeDataMappingValue: function(mappingId) {
        if(mappingId == 1) {
            return "短文本";
        }
        if(mappingId == 2) {
            return "长文本";
        }
        if(mappingId == 3) {
            return "逻辑型";
        }
        if(mappingId == 4 || mappingId == 7) {
            return "整数";
        }
        if(mappingId == 5 || mappingId == 8) {
            return "浮点型";
        }
        if(mappingId == 6) {
            return "日期";
        }

        return '';
    },
    /**
     * 根据类型返回场景名称
     */
    getBaseColumnScencByType: function(type) {
        if (type == 1) {
            return '已有表';
        }
        if (type == 2) {
            return '在线设计';
        }
        if (type == 3) {
            return '自定义SQL';
        }
        return '其他';
    },
    /**
     * 根据数据项类型key返回组件类型
     */
    itemCompanentCompanentTypeDataMappingValue: function(mappingId) {
        switch (mappingId)
            {
                case 1:return "label";
                break;
                case 2:return "input_text";
                break;
                case 3:return "textarea";
                break;
                case 4:return "select_dynamic";
                break;
                case 5:return "input_radio";
                break;
                case 6:return "checkbox";
                break;
                case 7:return "input_datetime";
                break;
                case 8:return "input_fileinput";
                break;
                default: return "";
            }
    },
    /**
     * 是否为空的数据初始化
     */
    itemColumnIsNullDataMapping: function() {
        return [
                {id: 0, name: '允许'},
                {id: 1, name: '不允许'}
          ];
    },
    /**
     * 布局类型初始化
     */
    itemColumnLayoutDataMapping: function() {
        return [
            {id: 0, name: '占半行，后面有其他控件'},
            {id: 1, name: '独占一行'},
            {id: 2, name: '占半行，后面为空'}
        ];
    },
    /**
     * 根据数据项类型，返回组件类型
     */
    getComponentTypeByType: function (type) {
        if (type == 1 || type == 4 || type == 5 || type == 7 || type == 8) {
            return 2;
        }
        if (type == 2) {
            return 3;
        }
        if (type == 3) {
            return 4;
        }
        if (type == 6) {
            return 7;
        }
        return -1;
    },
    /**
     * 主键类型数据初始化
     */
    itemColumnComponentTypeDataMapping: function() {
        return [
            {id: 1, name: '标签'},
            {id: 2, name: '文本框'},
            {id: 3, name: '文本域'},
            {id: 4, name: '下拉列表框'},
            {id: 5, name: '单选框'},
            {id: 6, name: '多选框'},
            {id: 7, name: '时间控件'},
            {id: 8, name: '文件上传控件'}
        ];
    },
    /**
     * 根据字段类型，映射组件类型
     */
    itemColumnComponentTypeDataMappingByType: function(type) {
        var data = this.itemColumnComponentTypeDataMapping();
        if (type == 1) {
            return [data[1], data[7]];
        }
        if (type == 2) {
            return [data[2], data[7]];
        }
        if (type == 3) {
            return [data[3], data[4], data[5]];
        }
        if (type == 4) {
            return [data[1]];
        }
        if (type == 5) {
            return [data[1]];
        }
        if (type == 6) {
            return [data[6]];
        }
        if (type == 7) {
            return [data[1]];
        }
        if (type == 8) {
            return [data[1]];
        }
    },
    /**
     * 是否可见数据初始化
     */
    itemColumnUiVsibleDataMapping: function() {
        return [
            {id: 1, name: '可见'},
            {id: 2, name: '不可见'}
        ];
    },
    /**
     * 参数类型数据初始化
     */
    methodBindColumnParameterTypeDataMapping: function() {
        return [
                {id: 0, name: '输入参数'},
                {id: 1, name: '输出参数'},
                {id: 2, name: '输入和输出参数'}
        ];
    },
    /**
     * 是否为主键数据初始化
     */
    itemColumnKeyDataMapping: function() {
        return [
                {id: 0, name: '否'},
                {id: 1, name: '是'}
        ];
    },
    /**
     * 绑定方法数据值初始化
     */
    methodColumnMapTypeDataMapping: function() {
        return [
                {id: 1, name: '字段绑定'},
                {id: 2, name: '常量'}
        ];
    },
    /**
     * 绑定表是否存在初始化
     */
    infoColumnBindTheExistingTableDataMapping: function() {
        return [
                {id: 1, name: '否'},
                {id: 2, name: '是'}
        ];
    }
};
var dataModelColumnDataMapping = new DataModelColumnDataMapping();