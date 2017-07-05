var DataViewLogic = function () {

};

DataViewLogic.prototype = {
    dataViewInfoTableUrl: '',
    deleteDataViewUrl: '',
    dataViewInfoTableId: 'table_base1481524766272',
    init: function () {
        this.initUrl();
        this.initHtml();
        this.initBtn();
        this.initBootstrapTable();
    },
    initUrl: function () {
        var baseUrl = '/' + $base_url + '/';
        this.dataViewInfoTableUrl = bcp + 'table/data_view_info_table';
        this.deleteDataViewUrl = baseUrl + 'view/delete';
    },
    initBtn: function () {
        var that = this;
        this.getComponentById('toolbar-button14815241407140').click(function () {
            that.redirectDataViewOperate('add', undefined);
        });
        this.getComponentById('toolbar-button14815241290240').click(function () {
            that.updateDataView();
        });
        this.getComponentById('toolbar-button14815241389190').click(function () {
            that.queryDataView();
        });
        this.getComponentById('toolbar-button14815241426622').click(function () {
            that.refreshTable();
        });
        this.getComponentById('toolbar-button14815241426620').click(function () {
            that.deleteView();
        });
    },
    refreshTable: function () {
        this.getComponentById(this.dataViewInfoTableId).bootstrapTable('refresh');
    },
    redirectDataViewOperate: function (operate, paramStr) {
        var dataViewOperateUrl = '';
        dataViewOperateUrl += 'data_view_operate.html?operate=';
        dataViewOperateUrl += operate;
        if (paramStr) {
            dataViewOperateUrl += paramStr;
        }
        window.location.href= dataViewOperateUrl;
    },
    queryDataView: function () {
        this.queryOrUpdateDataView('query');
    },
    updateDataView: function () {
        this.queryOrUpdateDataView('edit');
    },
    queryOrUpdateDataView: function (operate) {
        var rows = this.getBootstrapTableSelections();
        if (rows.length == 0 || rows.length > 1) {
            bootbox.alert('请选择一条数据！');
            return;
        }
        var param = '&id=' + rows[0].ID;
        this.redirectDataViewOperate(operate, param);
    },
    deleteView: function () {
        var that = this;
        var rows = this.getBootstrapTableSelections();
        if (rows.length == 0) {
            bootbox.alert('请选择要删除的视图！');
        } else {
            bootbox.confirm("确定要删除吗？", function(result){
                if (result) {
                    var ids = [];
                    for (var i = 0, len = rows.length; i < len; i++) {
                        ids.push(rows[i].ID);
                    }
                    var urlAndParam = '';
                    urlAndParam += that.deleteDataViewUrl;
                    urlAndParam += '?viewIds=';
                    urlAndParam += JSON.stringify(ids);
                    var returnResult = that.ajaxMethod('DELETE', urlAndParam, undefined);
                    if (returnResult.status == 1) {
                        bootbox.alert('删除成功！', function () {
                            that.refreshTable();
                        });
                    } else {
                        bootbox.alert('删除失败，' + returnResult.message);
                    }
                }
            })
        }
    },
    getBootstrapTableSelections:function () {
        var rows = this.getComponentById(this.dataViewInfoTableId).bootstrapTable('getSelections');
        if (rows == undefined || rows == null) {
            return [];
        }
        return rows;
    },
    initHtml: function () {
        
    },
    getTableColumns: function () {
        var columns = [
            {field: 'ID', title: '视图标识'},
            {field:  'CREATOR', title: '创建者'},
            {field:  'CREATE_TIME', title: '创建时间'},
            {field:  'UPDATE_TIME', title: '更新时间'}
        ];
        return columns;
    },
    initBootstrapTable: function () {
        var dataViewInfoTableUrlAndParam = '';
        var param = {
            columns: [
            ],
            isDistinct:true,
            condition:{
            },
            orders:[
                {field:'INDEX', order:'asc'}
            ]
        };
        dataViewInfoTableUrlAndParam += this.dataViewInfoTableUrl;
        dataViewInfoTableUrlAndParam += '?param=';
        var columns = this.getTableColumns();
        for (var i = 0, len = columns.length; i < len; i++) {
            var column = columns[i];
            param.columns.push({cname: column.field});
        }
        dataViewInfoTableUrlAndParam += JSON.stringify(param);
        this.getComponentById(this.dataViewInfoTableId).bootstrapTable({
            method:"get",
            url:dataViewInfoTableUrlAndParam,
            cache:false,
            pagination:true,
            pageSize:"20",
            pageList:[10,20,50,100,200],
            height:"300",
            search:false,
            showColumns:false,
            showRefresh:false,
            sidePagination:"server",
            sortable:true,
            clickToSelect:false,
            advancedSearch:false,
            editable:true,
            columns:this.packageColumns(columns)});
    },
    packageColumns: function (datas) {
        var columns = [];
        columns.push({field:'state_form_disabled',checkbox:true});
        for (var i = 0, len = datas.length; i < len; i++) {
            var data = datas[i];
            columns.push(this.packageColumn(data.field, data.title));
        }
        return columns;
    },
    packageColumn: function (field, title) {
        return {
            title:title,
            field:field,
            editable:false,
            align:'left',
            halign:'left',
            valign:'middle',
            visible:true,
            formatter:""
        };
    },
    getComponentById: function (id) {
        return $('#' + id);
    },
    ajaxMethod : function(method, urlAndParam, bodyData) {
        return $.designerAjax(method, urlAndParam, bodyData, undefined,
            undefined);
    }
};

var dataViewLogic = new DataViewLogic();

var pageDocumentReadyAfter = function () {
    dataViewLogic.init();
};