var DataModelDetailLogic = function () {
};

DataModelDetailLogic.prototype = {
    modelItemGroups: {},
    dataModelCreateUrl: '',
    dataModelUpdateUrl: '',
    model_id: '',
    dataModelInfoTableUrl: '',
    dataModelItemTableUrl: '',
    dataModelPublishUrl: '',
    isView: true,
    dataModelSceneViewId: 'input_text14828305407960',
    dataModelDescriptionViewId: 'textarea14828304381390',
    dataModelIdViewId: 'input_text14816270916850',
    dataModelNameViewId: 'input_text14816270931710',
    dataModelCreateTimeViewId: 'input_text14816271035490',
    dataModelUpdateTimeViewId: 'input_text14816271241310',
    dataModelCreatorViewId: 'input_text14816271425010',
    dataModelExistingTableViewId: 'input_text14816271448120',
    appid: '',
    /**
    * 初始化界面方法
     */
    init: function () {
        this.initParamValue();
        this.initUrl();
        this.initBtn();
        this.initHtml();
        this.initDataModel();
		var obj = $('#vm1481532544268a');
		var height = obj.height();
		$(obj.parent()).css({"padding-bottom":height});
		obj.suspensionWindow({right:"0.75%",bottom:"0px",left:"0px"});
    },
    /**
     * 初始化参数
     */
    initParamValue : function() {
        if (this.initUrlParam('operator') == 'view') {
            var modelId = this.initUrlParam('modelId');
            if (modelId == false) {
                modelId = '';
            }
            this.model_id = modelId;
            var appid = this.initUrlParam('packageId');
            if (appid == false) {
                appid = '';
            }
            this.appid = appid;
            this.getComponentById('button14815327374600').hide();
            this.getComponentById('button14815327398760').hide();
            return;
        }
        this.appid = dataModelDesigner.dataModelDesignerBaseInfo.PACKAGE_ID;
        this.isView = false;
        this.initBootstrapTable();
    },
    /**
     * 初始化表格属性
     */
    initBootstrapTable: function () {
        this.getComponentById('table_base_local14815333956381').bootstrapTable(dataModelDesignCommon.dataItemDetailTable());
    },
    /**
     * 根据key初始化参数值
     */
    initUrlParam : function(key) {
        var search = window.location.search;
        return decodeURIComponent(this.getUrlParam(key, search));
    },
    /**
     * 根据url产生和key获取相应key的值
     */
    getUrlParam:function (name, search) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = search.match(reg);
        if(search.indexOf("?") > -1) {
            r = search.substring(1).match(reg);
        }
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return ''; //返回参数值
    },
    /**
     * 初始化按钮
     */
    initBtn: function () {
        var that = this;
		$('#button14815327374598').click(function () {
            that.backMain();
        });
        $('#button14815327374600b').click(function (e) {
            that.previousStep(e);
        });
        $('#button14815327398760a').click(function () {
            that.saveDataModelDetail();
        });
    },
    /**
     * 返回主页处理方法
     */
    backMain : function(){
        if (this.isView == false) {
            dataModelDesignCommon.handleDeleteTable(dataModelDesigner.dataModelDesignerBaseInfo);
        }
        dataModelDesignCommon.backMain(this.appid);
	},
    /**
     * 上一步操作处理方法
     */
    previousStep: function (e) {
        dataModelDesigner.isClick = false;
        var previousIndex = 2;
        dataModelDesigner.previousIndex = previousIndex;
        var toIndex = 1;
        dataModelDesignerLogic.onTabClick(e, toIndex, previousIndex);
    },
    /**
     * 页面元素初始化
     */
    initHtml: function () {
        this.getComponentById(this.dataModelIdViewId).attr('readonly', 'readonly');
        this.getComponentById(this.dataModelNameViewId).attr('readonly', 'readonly');
        this.getComponentById(this.dataModelCreateTimeViewId).attr('readonly', 'readonly');
        this.getComponentById(this.dataModelUpdateTimeViewId).attr('readonly', 'readonly');
        this.getComponentById(this.dataModelCreatorViewId).attr('readonly', 'readonly');
        this.getComponentById(this.dataModelExistingTableViewId).attr('readonly', 'readonly');
        this.getComponentById(this.dataModelSceneViewId).attr('readonly', 'readonly');
        this.getComponentById(this.dataModelDescriptionViewId).attr('readonly', 'readonly');
        if (this.isView == false
            && this.getDataModelDesignerObj().operator == 'add') {
            this.getComponentById('layout1481627021688').hide();
        }
    },
    /**
     * 根据Id或许页面元素对象
     */
    getComponentById: function (id) {
        return $('#' + id);
    },
    /**
     * 初始化url地址
     */
    initUrl : function() {
        var table = 'table/';
        var baseUrl = bcp + table;
        this.dataModelInfoTableUrl = baseUrl + 'data_model_info_table';
        var dataModelItemTable = 'data_model_item_table';
        this.dataModelItemTableUrl = baseUrl + dataModelItemTable;
        var modelUrl = '/' + $base_url + '/model/';
        this.dataModelCreateUrl = modelUrl + 'create';
        this.dataModelUpdateUrl = modelUrl + 'update';
        this.dataModelPublishUrl = modelUrl + 'publish';
    },
    /**
     * 初始化数据模型和数据模型相关联的信息
     */
    initDataModel: function () {
        var dataModelInfo = undefined;
        var dataModelItems = [];
        if (this.isView) {
            var result = this.getDataModelInfo();
            if (this.returnResultPrompt(result && result.status == 1, '请求数据异常。')) {
                var rows = result.rows;
                if (this.returnResultPrompt(rows && rows.length > 0, '该数据模型已删除。')) {
                    dataModelInfo = rows[0];
                    this.handleDataModelGroupTable();
                    var resultItem = this.getDataModelItem();
                    if (this.returnResultPrompt(resultItem && resultItem.status == 1, '请求数据异常。')) {
                        var rowsItem = resultItem.rows;
                        if (rowsItem && rowsItem.length > 0) {
                            dataModelItems = rowsItem;
                        }
                    }
                }
            }
        } else {
            this.modelItemGroups = dataModelDesigner.modelItemGroups;
            dataModelInfo = dataModelDesigner.dataModelDesignerBaseInfo;
            dataModelItems = dataModelDesigner.dataModelDesignerAssociatedInformation.dataItems;
        }
        if (dataModelInfo) {
            this.handleDataModelInfo(dataModelInfo);
            if (dataModelItems.length > 0) {
                this.handleDataModelItem(dataModelItems);
            }
        }
    },
    /**
     * 返回和初始化数据模型的面板分组
     */
    handleDataModelGroupTable: function () {
        var urlParam = {
            columns : [
                {cname : 'ID'},{cname : 'NAME'}
            ],
            isDistinct : true,
            condition : {
                cname: 'MODEL_ID',
                compare: '=',
                value: this.model_id
            }
        };
        var url = bcp + 'table/data_model_group_table?param=' + encodeURIComponent(JSON.stringify(urlParam));
        var result = this.ajaxMethod('get',url, undefined);
        var modelItemGroups = {};
        if (result && result.status == 1) {
            var rows = result.rows;
            $.each(rows, function(index, value){
                modelItemGroups[value.ID] = value.NAME;
            });
        }
        dataModelDesignCommon.modelItemGroups = modelItemGroups;
    },
    /**
     * 返回结果，设置错误提示信息方法
     */
    returnResultPrompt: function(boolData, falsePromptMessage) {
        if (boolData) {
            return true;
        }
        tipBox.showMessage(falsePromptMessage, 'error');
        return false;
    },
    /**
     * 根据数据模型基本信息数据初始化模型信息
     */
    handleDataModelInfo: function (dataModelInfo) {
        this.getComponentById(this.dataModelIdViewId).val(dataModelInfo.ID);
        this.getComponentById(this.dataModelNameViewId).val(dataModelInfo.NAME);
        this.getComponentById(this.dataModelCreateTimeViewId).val(dataModelInfo.CREATE_TIME);
        this.getComponentById(this.dataModelUpdateTimeViewId).val(dataModelInfo.UPDATE_TIME);
        this.getComponentById(this.dataModelCreatorViewId).val(dataModelInfo.CREATOR);
        this.getComponentById(this.dataModelSceneViewId).val(dataModelColumnDataMapping.getBaseColumnScencByType(dataModelInfo.SCENE));
        this.getComponentById(this.dataModelDescriptionViewId).val(dataModelInfo.DESCRIPTION);
        var bindTableName = dataModelInfo.ID;
        if (dataModelInfo.SCENE != 2) {
            bindTableName = dataModelInfo.BIND_TABLE_NAME;
        }
        this.getComponentById(this.dataModelExistingTableViewId).val(bindTableName);
    },
    /**
     * 根据数据项数据初始化数据项信息
     */
    handleDataModelItem: function (dataModelItems) {
        var tableId = 'table_base_local14815333956381';
	    if (this.isView) {
	        tableId = 'table_base_local1481533395638';
        }
        this.getComponentById(tableId).bootstrapTable('load', dataModelItems);
    },
    /**
     * 获取数据模型基本信息
     */
    getDataModelInfo: function () {
        var urlParam = {
            columns : [
                {cname : 'ID'}, {cname : 'NAME'}, {cname : 'DESCRIPTION'},
                {cname : 'SCENE'}, {cname : 'CREATOR'}, {cname : 'CREATE_TIME'},
                {cname : 'UPDATE_TIME'}, {cname : 'BIND_TABLE_NAME'}, {cname : 'SCRIPT'},
                {cname : 'I18N'}
            ],
            isDistinct : true,
            condition : {'cname' : 'ID','value' : this.model_id, 'compare' : '='}
        };
        return this.ajaxMethod('GET', this.getUrlAndParam(
            this.dataModelInfoTableUrl, urlParam), undefined);
    },
    /**
     * 根据url地址和参数返回带参数的url地址
     */
    getUrlAndParam : function(url, paramValue) {
        var urlAndParam = '';
        urlAndParam += url;
        urlAndParam += '?param=';
        urlAndParam += encodeURIComponent(JSON.stringify(paramValue));
        return urlAndParam;
    },
    /**
     * 获取数据项信息
     */
    getDataModelItem : function() {
        var urlParam = {
            columns : [
                {cname : 'ID'}, {cname : 'NAME'}, {cname : 'MODEL_ID'},
                {cname : 'TYPE'}, {cname : 'IS_NULL'}, {cname : 'COLUMN_KEY'},
                {cname : 'LENGTH'}, {cname : 'DECIMAL'}, {cname : 'DEFAULT'},
                {cname : 'COMPONENT_TYPE'}, {cname : 'UI_VISIBLE'}, {cname : 'LAYOUT'},
                {cname : 'DATA_BLOCK'}
            ],
            isDistinct : true,
            orders:[
                {field: 'INDEX', order: 'asc'}
            ],
            condition : {cname : 'MODEL_ID', value : this.model_id, compare : '='}
        };
        return this.ajaxMethod('GET', this.getUrlAndParam(
            this.dataModelItemTableUrl, urlParam), undefined);
    },
    /**
     * ajax请求
     */
    ajaxMethod : function(method, urlAndParam, bodyData) {
        return $.designerAjax(method, urlAndParam, bodyData, undefined,
            undefined);
    },
    /**
     * 根据不同的操作返回数据模型基本信息
     */
    getDataModelDetailBase: function (dataModelInfo) {
        var dataModelDetailBase = dataModelDesignCommon.getDataModelDetailBase(dataModelInfo);
        if (this.getDataModelDesignerObj().operator == 'edit') {
            dataModelDetailBase.updatetime = dataModelInfo.UPDATE_TIME;
        }
        return dataModelDetailBase;
    },
    /**
     * 日期格式化
     */
    dateFormat: function(date) {
        var dateFormat = '';
        dateFormat += date.getFullYear();
        dateFormat += '-' + (date.getMonth() + 1);
        dateFormat += '-' + date.getDate();
        dateFormat += ' ' + date.getHours();
        dateFormat += ':' + date.getMinutes();
        dateFormat += ':' + date.getSeconds();
        return dateFormat;
    },
    /**
     * 获取保存需要的数据模型和相关联的数据
     */
    getDataModelDetail: function () {
        var dataModelInfo = dataModelDesigner.dataModelDesignerBaseInfo;
        var dataItems = dataModelDesigner.dataModelDesignerAssociatedInformation.dataItems;
        var modelItemGroups = dataModelDesigner.modelItemGroups;
        return dataModelDesignCommon.getDataModelDetail(this.getDataModelDetailBase(dataModelInfo), dataItems, modelItemGroups);
    },
    /**
     * 获取数据模型设计缓存对象
     */
    getDataModelDesignerObj: function () {
        return dataModelDesigner;
    },
    /**
     * 保存处理方法
     */
    saveDataModelDetail: function () {
        var operator = this.getDataModelDesignerObj().operator;
        var result = {};
        var dataModelDetail = this.getDataModelDetail();
        if (operator == 'add') {
            result = this.ajaxMethod('POST', this.dataModelCreateUrl, dataModelDetail);
        } else if(operator == 'edit') {
            result = this.ajaxMethod('PUT', this.dataModelUpdateUrl, dataModelDetail);
        }
        if (this.returnResultPrompt(result.status == 1, result.message)) {
			tipBox.showMessage('保存成功。', 'info');
            window.setTimeout(dataModelDesignCommon.backMain(dataModelDetail.basic.packageId), 1000);
        }
    }
};

var dataModelDetailLogic = new DataModelDetailLogic();