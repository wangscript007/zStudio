var CreateViewLogic = function () {

};

CreateViewLogic.prototype = {
    dialogId: 'dialog_12345431321432454341',
    preViewThreeUrl:'',
    tableOneSelectId: 'select_dynamic14840163855010',
    tableTwoSelectId: 'select_dynamic14840163885580',
    tableOneColumnSelectId: 'select_dynamic14840164376660',
    tableTwoColumnSelectId: 'select_dynamic14840164392730',
    connectionSelectId: 'select_dynamic14840314039130',
    table_base_One_localId: 'table_base_local1484016794244',
    table_base_Two_localId: 'table_base_local1484016652433',
    viewNameId: 'input_text14840379778070',
    previewTable_base_One_localId: 'table_base_local14840167942441',
    previewTable_base_Two_localId: 'table_base_local14840167942442',
    previewTable_base_Three_localId: 'table_base_local14840167942443',
    tableNamesUrl: '',
    tableColumnsBaseUrl: '',
    createViewUrl: '',
    operate: 'add',
    dataViewId: '',
    loadDataViewUrl: '',
    updateDataViewUrl: '',
    previewBtnId: 'toolbar-button148152414071401',
    createBtnId: 'toolbar-button148152414071402',
    backBtnId: 'toolbar-button148152414071404',
    preConfirmBtnId: 'toolbar-button148152414071405',
    colummn_table_one: 'colummn_table_one',
    colummn_table_Two: 'colummn_table_Two',
    getDataViewData: function () {
        var urlAndParam = '';
        urlAndParam += this.loadDataViewUrl;
        urlAndParam += '?viewIds=["';
        urlAndParam += this.dataViewId;
        urlAndParam += '"]';
        return this.ajaxMethod('GET', urlAndParam, undefined);
    },
    handleDataViewData: function () {
        var result = this.getDataViewData();
        if (result.status == 0) {
            bootbox.alert(result.message);
            return;
        }
        var rows = result.data;
        if (rows.length == 0) {
            bootbox.alert("数据不存在。");
            return;
        }
        this.initDabaViewInfo(rows[0]);
    },
    queryOperateReadOnly: function () {
        this.elementReadonly(this.getComponentById(this.viewNameId));
        this.elementDisabled(this.getComponentById(this.tableOneSelectId));
        this.elementDisabled(this.getComponentById(this.tableOneColumnSelectId));
        this.elementDisabled(this.getComponentById(this.connectionSelectId));
        this.elementDisabled(this.getComponentById(this.tableTwoSelectId));
        this.elementDisabled(this.getComponentById(this.tableTwoColumnSelectId));
        this.tableElementReadonly(this.table_base_One_localId);
        this.tableElementReadonly(this.table_base_Two_localId);
    },
    tableElementReadonly: function (tableId) {
        var inputTexts = this.getComponentById(tableId).find('input[type="text"]');
        for (var i = 0, len = inputTexts.length; i < len; i++) {
            this.elementReadonly($(inputTexts[i]));
        }
        var inputCheckboxs = this.getComponentById(tableId).find('input[type="checkbox"]');
        for (var i = 0, len = inputCheckboxs.length; i < len; i++) {
            this.elementDisabled($(inputCheckboxs[i]));
        }
    },
    elementReadonly: function (element) {
        element.attr('readonly','readonly');
    },
    elementDisabled: function (element) {
        element.attr('disabled','disabled');
    },
    initDabaViewInfo: function (dataViewInfo) {
        this.initDataViewBase(dataViewInfo.dataViewBase);
        this.initDataViewAssociateds(dataViewInfo.dataViewAssociateds);
        this.initDataViewItems(dataViewInfo.dataViewItems, dataViewInfo.dataViewBase.mainTableName);
    },
    initDataViewBase: function (dataViewBase) {
        this.getComponentById(this.viewNameId).val(dataViewBase.id);
        this.getComponentById(this.tableOneSelectId).val(dataViewBase.mainTableName);
        this.initOneTableInfo();
    },
    initDataViewItems: function (dataViewItems, mainTableName) {
        var tableOneCheckIds = [];
        var tableTwoCheckIds = [];
        for (var i = 0, len = dataViewItems.length; i < len; i++) {
            var dataViewItem = dataViewItems[i];
            if (dataViewItem.tableName == mainTableName) {
                tableOneCheckIds.push(dataViewItem.id);
                this.bootstrapTableAlisa(dataViewItem.id, 'one', dataViewItem.alisaName);
            } else {
                tableTwoCheckIds.push(dataViewItem.id);
                this.bootstrapTableAlisa(dataViewItem.id, 'two', dataViewItem.alisaName);
            }
        }
        this.bootstrapTableCheckBy(this.table_base_One_localId, 'column', tableOneCheckIds);
        this.bootstrapTableCheckBy(this.table_base_Two_localId, 'column', tableTwoCheckIds);
    },
    bootstrapTableAlisa: function (columnName, tableMark, alisaName) {
        $('input[name="' + columnName + '"][item="' + tableMark + '"]').val(alisaName);
    },
    bootstrapTableCheckBy: function (tableId, fieldName, values) {
        this.getComponentById(tableId).bootstrapTable('checkBy', {field:fieldName, values:values});
    },
    initDataViewAssociateds: function (dataViewAssociateds) {
        for (var i = 0, len = dataViewAssociateds.length; i < len; i++) {
            var dataViewAssociated = dataViewAssociateds[i];
            this.getComponentById(this.connectionSelectId).val(dataViewAssociated.associatedType);
            this.getComponentById(this.tableTwoSelectId).val(dataViewAssociated.associatedTableName);
            this.initTwoTableInfo();
            this.initDataViewAssociatedConditons(dataViewAssociated.dataViewAssociatedConditons);
        }
    },
    initDataViewAssociatedConditons: function (dataViewAssociatedConditons) {
        for (var i = 0, len = dataViewAssociatedConditons.length; i < len; i++) {
            var dataViewAssociatedConditon = dataViewAssociatedConditons[i];
            this.getComponentById(this.tableOneColumnSelectId).val(dataViewAssociatedConditon.mainColumnName);
            this.getComponentById(this.tableTwoColumnSelectId).val(dataViewAssociatedConditon.childColumnName);
        }
    },
    init: function () {
        this.initUrl();
        this.initParam();
        this.initHtml();
        this.initBtn();
        this.initOperate();
    },
    initOperate: function () {
        if (this.operate == 'add') {

        } else if (this.operate == 'edit') {
            this.handleDataViewData();
            this.elementReadonly(this.getComponentById(this.viewNameId));
        } else if (this.operate == 'query') {
            this.getComponentById(this.createBtnId).hide();
            this.handleDataViewData();
            this.queryOperateReadOnly();
        } else {

        }
    },
    initParam: function () {
        var operate = this.GetQueryString('operate');
        if(operate) {
            this.operate = operate;
        }
        var dataViewId = this.GetQueryString('id');
        if (dataViewId) {
            this.dataViewId = dataViewId;
        }
    },
    GetQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    },
    initHtml: function () {
        this.initDialog();
        this.initBtnHtml();
        this.initSelectComponent(this.tableOneSelectId, this.getTableNames());
        this.initSelectComponent(this.tableTwoSelectId, this.getTableNames());
        this.initSelectComponent(this.connectionSelectId, this.initConnectionData());
        this.initOneTableInfo();
        this.initTwoTableInfo();
    },
    packageTableUrlAndParam: function (tableName, datas) {
        var urlAndParam = '';
        urlAndParam += bcp + 'table/' + tableName + '?param=';
        var param = {
            orders:[],
            condition:{},
            columns: []
        };
        for (var i = 0, len = datas.length; i < len; i++) {
            param.columns.push({cname: datas[i].column});
        }
        return urlAndParam + JSON.stringify(param);
    },
    initPreViewBootstrapTable: function (id, tableUrlAndParam, columns) {
        this.getComponentById(id).bootstrapTable('destroy');
        tableUrlAndParam += '&order=asc&offset=0&limit=2';
        var result = this.ajaxMethod('GET', tableUrlAndParam, undefined);
        var dataArr = [];
        if (result.status == 1) {
            dataArr = result.rows;
        }
        this.getComponentById(id).bootstrapTable({
            cache:false,
            pagination:false,
            height:"180",
            search:false,
            showColumns:false,
            showRefresh:false,
            sidePagination:"client",
            sortable:true,
            clickToSelect:false,
            advancedSearch:false,
            editable:true,
            data: dataArr,
            columns:this.packageColumns(columns)});
    },
    initBootstrapTable: function (id, tableUrlAndParam, columns) {
        this.getComponentById(id).bootstrapTable('destroy');
        this.getComponentById(id).bootstrapTable({
            "method":"get",
            "url":tableUrlAndParam,
            "cache":false,
            "pagination":true,
            "pageSize":"20",
            "pageList":[10,20,50,100,200],
            "height":"300",
            "search":false,
            "showColumns":false,
            "showRefresh":false,
            "sidePagination":"server",
            "sortable":true,
            "clickToSelect":false,
            "advancedSearch":false,
            "editable":true,
            "columns":this.packageColumns(columns)});
    },
    packageColumns: function (datas) {
        var columns = [];
        for (var i = 0, len = datas.length; i < len; i++) {
            var data = datas[i];
            columns.push(this.packageColumn(data.alias, data.column));
        }
        return columns;
    },
    packageColumn: function (title, field) {
        return {
            title:title,
            field:field,
            editable:false,
            align:"left",
            halign:"left",
            valign:"middle",
            visible:true,
            formatter:""
        };
    },
    initPreviewTableObj: function () {
        var tableNameOne = this.getComponentById(this.tableOneSelectId).val();
        var tableOneColumns = this.packageTableData(this.table_base_One_localId, 'one');
        this.handleInitPreBootstrapTable(this.previewTable_base_One_localId, tableNameOne, tableOneColumns);
        var tableNameTwo = this.getComponentById(this.tableTwoSelectId).val();
        var tableTwoColumns = this.packageTableData(this.table_base_Two_localId, 'two');
        this.handleInitPreBootstrapTable(this.previewTable_base_Two_localId, tableNameTwo, tableTwoColumns);
        var tableThreeColumns = [];
        if (tableOneColumns && tableOneColumns.length > 0) {
            for (var i = 0, len = tableOneColumns.length; i < len; i++) {
                tableThreeColumns.push(tableOneColumns[i]);
            }
        }
        if (tableTwoColumns && tableTwoColumns.length > 0) {
            for (var i = 0, len = tableTwoColumns.length; i < len; i++) {
                tableThreeColumns.push(tableTwoColumns[i]);
            }
        }
        if (tableThreeColumns && tableThreeColumns.length > 0) {
            var preViewThreeUrlAndParam = '';
            preViewThreeUrlAndParam += this.preViewThreeUrl;
            preViewThreeUrlAndParam += '?param=';
            preViewThreeUrlAndParam += JSON.stringify(this.getView());
            this.initPreViewBootstrapTable(this.previewTable_base_Three_localId, preViewThreeUrlAndParam, tableThreeColumns);
        }
    },
    initTable: function () {
        var preview = '';
        preview += '<div class="row" style="height: 100%;margin-left: 0;">';

        preview += '<div class="row" style="margin-bottom:5px;height:230px;margin-right: 0;">';
        preview += '<div id="' + this.colummn_table_one + '" class="col-md-6 col-xs-6 col-sm-6 col-lg-6 column" style="margin-bottom: 5px;">';
        preview += this.tableHtml(this.previewTable_base_One_localId);
        preview += '</div>';
        preview += '<div id="' + this.colummn_table_Two + '"  class="col-md-6 col-xs-6 col-sm-6 col-lg-6 column" style="margin-bottom: 5px;">';
        preview += this.tableHtml(this.previewTable_base_Two_localId);
        preview += '</div>';
        preview += '</div>';

        preview += '<div class="row" style="margin-right: 0;">';
        preview += '<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column">';
        preview += this.tableHtml(this.previewTable_base_Three_localId);
        preview += '</div>';
        preview += '</div>';

        preview += '</div>';
        return preview;
    },
    initTableHandle: function (lableId, tableId) {
        this.getComponentById(lableId).parent().parent().html(this.tableHtml(tableId));
    },
    tableHtml: function (tableId) {
        var tableHtml = '';
        tableHtml += '<table id="' + tableId + '">';
        tableHtml += '</table>';
        return tableHtml;
    },
    handleInitBootstrapTable: function (tableId, tableName, datas) {
        this.initBootstrapTable(tableId, this.packageTableUrlAndParam(tableName, datas), datas);
    },
    handleInitPreBootstrapTable: function (tableId, tableName, datas) {
        this.initPreViewBootstrapTable(tableId, this.packageTableUrlAndParam(tableName, datas), datas);
    },
    initDialogElements: function () {
        if (this.operate != 'query') {
            if (this.saveValidation() == false) {
                return;
            }
        }
        this.getComponentById(this.dialogId).modal('show');
        this.initPreviewTableObj();
    },
    initBtn: function () {
        var that = this;
        this.getComponentById(this.previewBtnId).click(function () {
            that.initDialogElements();
        });
        this.getComponentById(this.createBtnId).click(function () {
            that.saveView();
        });
        this.getComponentById(this.preConfirmBtnId).click(function () {
            that.getComponentById(that.dialogId).modal('hide');
        });
        this.getComponentById(this.backBtnId).click(function () {
            window.location.href = 'data_view.html';
        });
        this.getComponentById(this.tableOneSelectId).change(function () {
            that.initOneTableInfo();
        });
        this.getComponentById(this.tableTwoSelectId).change(function () {
            that.initTwoTableInfo();
        });
    },
    initBtnHtml: function () {
        var btnHtml = '';
        btnHtml += '<button type="button" class="btn btn-primary btn-sm" id="' + this.previewBtnId + '" i18nkey="预览">';
        btnHtml += '预览';
        btnHtml += '</button>';
        btnHtml += ' <button type="button" class="btn btn-primary btn-sm" id="' + this.createBtnId + '" i18nkey="创建">';
        btnHtml += '确定';
        btnHtml += '</button>';
        btnHtml += ' <button type="button" class="btn btn-primary btn-sm" id="' + this.backBtnId + '" i18nkey="返回">';
        btnHtml += '返回';
        btnHtml += '</button>';
        this.getComponentById('label14840455875400').parent().html(btnHtml);
    },
    initDialog: function () {
        var dialog = '';
        dialog += '<div id="' + this.dialogId + '" class="modal fade">';
        dialog += '<div class="modal-dialog" style="width: 950px;height: 660px;">';
        dialog += '<div class="modal-content" style="width: 100%; height: 100%;">';
        dialog += '<div class="modal-header">';
        dialog += '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>';
        dialog += '<h4 class="modal-title">视图预览</h4>';
        dialog += '</div>';
        dialog += '<div class="modal-body" style="width: 100%;height:460px;padding-bottom: 0px;padding-top: 0px;">';
        dialog += this.initTable();
        dialog += '</div>';
        dialog += '<div class="modal-footer">';
        dialog += '<button type="button" class="btn btn-primary btn-sm" id="' + this.preConfirmBtnId + '" i18nkey="确定">';
        dialog += '确定';
        dialog += '</button>';
        dialog += '</div>';
        dialog += '</div>';
        dialog += '</div>';
        dialog += '</div>';
        $('body').append(dialog);
        this.getComponentById(this.dialogId).modal('hide');
    },
    initUrl: function () {
        var baseUrl = '/' + $base_url + '/';
        this.tableNamesUrl = bcp + 'metadata/tablenames';
        this.tableColumnsBaseUrl = bcp + 'metadata/table/';
        var viewBaseUrl = baseUrl + 'view/';
        this.createViewUrl = viewBaseUrl + 'create';
        this.loadDataViewUrl = viewBaseUrl + 'load';
        this.updateDataViewUrl = viewBaseUrl + 'update';
        this.preViewThreeUrl = viewBaseUrl + 'execute/query';
    },
    saveView: function () {
        if (this.saveValidation() == false) {
            return;
        }
        var result = {};
        if (this.operate == 'add') {
            result = this.ajaxMethod('POST', this.createViewUrl, this.getView());
        } else if (this.operate == 'edit') {
            result = this.ajaxMethod('PUT', this.updateDataViewUrl, this.getView());
        } else {

        }

        if (result.status == 1) {
            bootbox.alert('保存成功。', function () {
                window.location.href = 'data_view.html';
            });
        } else {
            bootbox.alert(result.message);
        }
    },
    saveValidation: function () {
        var viewName = this.getComponentById(this.viewNameId).val();
        if (!viewName) {
            bootbox.alert('视图名不能为空。');
            return false;
        }
        if (!new RegExp(/^[a-zA-Z]\w*$/).test(viewName)) {
            bootbox.alert('请输入以字母开头且只包含字母数字或下划线的标识。');
            return false;
        }
        if (this.operate != 'edit') {
            var tableNames = this.getTableNames();
            for (var i = 0, len = tableNames.length; i < len; i++) {
                if (viewName == tableNames[i].id) {
                    bootbox.alert('该名称已存在。');
                    return false;
                }
            }
        }

        if (this.getComponentById(this.tableOneSelectId).val() == this.getComponentById(this.tableTwoSelectId).val()) {
            bootbox.alert('请选择不同的数据库表名。');
            return false;
        }
        var oneTableSelectionsDatasLength = this.getTableSelections(this.table_base_One_localId).length;
        var twoTableSelectionsDatasLength = this.getTableSelections(this.table_base_Two_localId).length
        if ((oneTableSelectionsDatasLength == 0)
            && (twoTableSelectionsDatasLength == 0)) {
            bootbox.alert('请选择表字段。');
            return false;
        }
        if ((oneTableSelectionsDatasLength > 0)
            && (twoTableSelectionsDatasLength > 0)) {
            var oneTableDatas = this.packageTableData(this.table_base_One_localId, 'one');
            var twoTableDatas = this.packageTableData(this.table_base_Two_localId, 'two');
            var columns = [];
            for (var i = 0,len = oneTableDatas.length; i < len; i++) {
                var oneTableData = oneTableDatas[i];
                for (var j = 0,lenTwo = twoTableDatas.length; j < lenTwo; j++) {
                    var twoTableData = twoTableDatas[j];
                    if (oneTableData.alias == twoTableData.alias) {
                        columns.push(oneTableData.alias);
                    }
                }
            }
            if (columns.length > 0) {
                bootbox.alert('表字段别名不能重复。');
                return false;
            }
        }

        return true;
    },
    getView: function () {
        return {
            dataViewBase: this.getDataViewBase(),
            dataViewAssociateds: this.getDataViewAssociateds(),
            dataViewItems: this.getDataViewItems()
        };
    },
    getDataViewItems: function () {
        var dataViewItems = [];
        var oneTableDatas = this.packageTableData(this.table_base_One_localId, 'one');
        var twoTableDatas = this.packageTableData(this.table_base_Two_localId, 'two');
        for (var i = 0, len = oneTableDatas.length; i < len; i++) {
            dataViewItems.push(this.getDataViewItem(oneTableDatas[i], this.getComponentById(this.tableOneSelectId).val()));
        }
        for (var i = 0, len = twoTableDatas.length; i < len; i++) {
            dataViewItems.push(this.getDataViewItem(twoTableDatas[i], this.getComponentById(this.tableTwoSelectId).val()));
        }
        return dataViewItems;
    },
    packageDataViewItems: function (tableDatas, tableName) {
        var dataViewItems = [];
        for (var i = 0, len = tableDatas.length; i < len; i++) {
            dataViewItems.push(this.getDataViewItem(tableData, tableName));
        }
        return dataViewItems;
    },
    getDataViewItem: function (tableData, tableName) {
        return {
            id: tableData.column,
            tableName: tableName,
            alisaName: tableData.alias
        };
    },
    getDataViewAssociateds: function () {
        var dataViewAssociateds = [];
        dataViewAssociateds.push({
            associatedType: this.getComponentById(this.connectionSelectId).val(),
            associatedTableName: this.getComponentById(this.tableTwoSelectId).val(),
            dataViewAssociatedConditons: this.getDataViewAssociatedConditons()
        });
        return dataViewAssociateds;
    },
    getDataViewAssociatedConditons: function () {
        var dataViewAssociatedConditons = [];
        dataViewAssociatedConditons.push({
            mainTableName: this.getComponentById(this.tableOneSelectId).val(),
            mainColumnName: this.getComponentById(this.tableOneColumnSelectId).val(),
            comparison: '=',
            childTableName: this.getComponentById(this.tableTwoSelectId).val(),
            childColumnName: this.getComponentById(this.tableTwoColumnSelectId).val()
        });
        return dataViewAssociatedConditons;
    },
    getDataViewBase: function () {
        return {
            id: this.getComponentById(this.viewNameId).val(),
            creator: maoEnvBase.getCurrentUserName(),
            mainTableName: this.getComponentById(this.tableOneSelectId).val()
        };
    },
    packageTableData: function (tableId, tableMark) {
        var columns = this.getTableSelections(tableId);
        if (columns == undefined || columns.length == 0) {
            return [];
        }
        var tableDatas = [];
        for (var i = 0, len = columns.length; i < len; i++) {
            var column = columns[i];
            tableDatas.push({column: column.column, alias: this.getAliasValue(tableMark, column.column)})
        }
        return tableDatas;
    },
    getAliasValue: function (tableMark, column) {
        return $('input[item="' + tableMark + '"][name="' + column + '"]').val();
    },
    getTableSelections: function (tableId) {
        return this.getComponentById(tableId).bootstrapTable('getSelections');
    },
    initOneTableInfo: function () {
        var columns = this.getTableColumns(this.getComponentById(this.tableOneSelectId).val());
        this.initSelectComponent(this.tableOneColumnSelectId, columns);
        this.initBootstrapTableData(this.table_base_One_localId, columns, 'one');
    },
    initTwoTableInfo: function () {
        var columns = this.getTableColumns(this.getComponentById(this.tableTwoSelectId).val());
        this.initSelectComponent(this.tableTwoColumnSelectId, columns);
        this.initBootstrapTableData(this.table_base_Two_localId, columns, 'two');
    },
    initBootstrapTableData: function (id, datas, tableMark) {
        var tableDatas = [];
        for (var i = 0, len = datas.length; i < len; i++) {
            var data = datas[i];
            var alias = '<input type="text" value="' + data.id + '" name="' + data.id + '" item="' + tableMark + '" class="form-control">';
            tableDatas.push({column: data.id, alias: alias});
        }
        this.getComponentById(id).bootstrapTable('load', tableDatas);
    },
    initConnectionData: function () {
        return [
            {id: 'INNER JOIN', name: '内连接'},
            {id: 'LEFT JOIN', name: '左连接'},
            {id: 'RIGHT JOIN', name: '右连接'},
            {id: 'CROSS JOIN', name: '交叉连接'},
            {id: 'UNION', name: '联合'},
            {id: 'UNION ALL', name: '联合所有'}
        ];
    },
    getTableNames: function () {
        var result = this.ajaxMethod('GET', this.tableNamesUrl, undefined);
        if (result.status == 1) {
            var results = result.tablenames.split(' ');
            var tablenames = [];
            for (var i = 0, len = results.length; i< len; i++) {
                var name = results[i];
                tablenames.push({id: name, name: name});
            }
            return tablenames;
        }
        return [];
    },
    getTableColumns: function (tableName) {
        var result = this.ajaxMethod('GET', this.tableColumnsBaseUrl + tableName, undefined);
        if (result.status == 1) {
            var fieldInfos = result.fieldInfos;
            var columns = [];
            for (var i = 0, len = fieldInfos.length; i< len; i++) {
                var columnName = fieldInfos[i].column_name;
                columns.push({id: columnName, name: columnName});
            }
            return columns;
        }
        return [];
    },
    initSelectComponent: function (id, values) {
        var options = '';
        for (var i = 0, len = values.length; i < len; i++) {
            var value = values[i];
            options += this.initSelectOption(value.id, value.name);
        }
        this.getComponentById(id).html(options);
    },
    initSelectOption: function (value, showValue) {
        return '<option value ="' + value + '">' + showValue + '</option>';
    },
    getComponentById: function (id) {
        return $('#' + id);
    },
    ajaxMethod : function(method, urlAndParam, bodyData) {
        return $.designerAjax(method, urlAndParam, bodyData, undefined,
            undefined);
    },
};

var createViewLogic = new CreateViewLogic();

var pageDocumentReadyAfter = function () {
    createViewLogic.init();
};