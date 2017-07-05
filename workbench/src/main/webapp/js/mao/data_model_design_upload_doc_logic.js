var DataModelDesignUploadDocLogic = function () {

};

DataModelDesignUploadDocLogic.prototype = {
    controlTypeTableId: 'controlTypeTable_sdf53532123',
    layoutTableId: 'layoutTable_sdf53532123',
    uiVisibleTableId: 'uiVisibleTable_sdf53532123',
    /**
     * 页面初始化
     */
    init: function () {
        this.initHtml();
    },
    /**
     * 初始化html元素
     */
    initHtml: function () {
        this.initTable(this.controlTypeTableId, this.initControlTypeData());
        this.initTable(this.layoutTableId, this.initLayoutData());
        this.initTable(this.uiVisibleTableId, this.initUiVisibleData());
    },
    /**
     * 初始化布局表格的head和body数据
     */
    initLayoutData: function () {
        return  {
            head: {
                value: '布局类型（layout）值',
                mapping: '布局类型'
            },
            body :[
                {value: '0', mapping: '占半行，后面可布局其他控件'},
                {value: '1', mapping: '独占一行'},
                {value: '2', mapping: '占半行，后面不能布局其他控件'}
            ]
        }
    },
    /**
     * 初始化显示表格的head和body数据
     */
    initUiVisibleData: function () {
        return  {
            head: {
                value: '可显示（uiVisible）值',
                mapping: '显示类型'
            },
            body :[
                {value: '1', mapping: '显示'},
                {value: '2', mapping: '隐藏'}
            ]
        }
    },
    /**
     * 初始化控件类型表格的head和body数据
     */
    initControlTypeData: function () {
        return {
            head: {
                value: '控件类型（controlType）值',
                mapping: '控件类型'
            },
            body :[
                {value: '1', mapping: '标签'},
                {value: '2', mapping: '文本框'},
                {value: '3', mapping: '文本域'},
                {value: '4', mapping: '下拉列表框'},
                {value: '5', mapping: '单选框'},
                {value: '6', mapping: '多选框'},
                {value: '7', mapping: '时间控件'},
                {value: '8', mapping: '文件上传控件'}
            ]
        }
    },
    /**
     * 根据表格id和表格数据初始化表格
     */
    initTable: function (id, data) {
        var tableHtml = '';
        tableHtml += '<thead>';
        var head = data.head;
        tableHtml += '<tr>';
        for (var filed in head) {
            tableHtml += '<th style="width:50%;">';
            tableHtml += head[filed];
            tableHtml += '</th>';
        }
        tableHtml += '</tr>';
        tableHtml += '</thead>';

        tableHtml += '<tbody>';
        var bodyDatas = data.body;
        for (var i = 0, len = bodyDatas.length; i < len; i++) {
            tableHtml += '<tr>';
            var bodyData = bodyDatas[i];
            for (var filed in bodyData) {
                tableHtml += '<td>';
                tableHtml += bodyData[filed];
                tableHtml += '</td>';
            }
            tableHtml += '</tr>';
        }
        tableHtml += '</tbody>';
        this.getComponentById(id).html(tableHtml);
    },
    /**
     * 根据id获取html元素
     */
    getComponentById: function (id) {
        return $('#' + id);
    }
};
var dataModelDesignUploadDocLogic = new DataModelDesignUploadDocLogic();

$(document).ready(function(){
    dataModelDesignUploadDocLogic.init();
});