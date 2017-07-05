var DataModelDesignLogic = function () {
};

DataModelDesignLogic.prototype = {
    dataModelDesignerBaseInfo: {},/* 临时缓存当前的数据模型基本信息，第三种场景自定义SQl时，会编辑绑定表和脚本字段 */
    dataModelDesignerBaseInfoA: {},/* 临时缓存之前的数据基本信息 */
    uploadFileDocBtnId: 'upload_file_aaa212211doc',
    addDataModelItemLayoutId: 'layout1481533272076',
    dataTableNameId:'input_text14815329095180',
    dataTableName: '',
    docDialog: 'doc_aaaaaa231312121',
    operator: '',
    script: '',/* 自定义SQL脚本字段 */
    dataModelItemUrl: '',
    previousIndex: 0,/* 上一步骤的索引 */
    dataItems: [],
    tableDataItems: [],/* 第一种场景或者第三种场景返回的已有表的字段信息 */
    dataModelSceneType:'',/* 场景字段 */
    dataModelStep:'1',/* 第三种场景，导航第二步的步骤，值为“1”时是编辑自定义SQL，值为“2”时是根据自定义SQL生成的表或视图，初始化或编辑数据项 */
    dataModelConfigFileUrl: '',
    uploadGlobalization: '',
    dataModelItemTableUrl : '',
    getTabelColumnsUrl:'',
    fileInputId: 'file_aaa4535432124535',
    globalizationSelectId: 'select_dynamic14815329159480',
    globalizationHtmlLayout: 'layout1481530769639',
    dataModelVmId: 'vm1481533389021',
    dataModelItemTableId: 'table_base_local1481533395638',
    sQLEditVmId: 'vm1481532540285',
    sqlEdit: {},/* 自定义sql编辑器对象 */
    dataModelDesignerAssociatedInformation: {/* 数据模型相关信息缓存对象 */
        dataModelDesignerBaseInfo:{},/* 第三种场景自定义SQl时，会编辑绑定表和脚本字段修改后，保存到缓存后，可以根据后续的操作是否需要修改整个的缓存对象的数据模型的基本信息 */
        dataItems: [],/* 数据项缓存对象 */
        globalizationSelectVal: '',/* 保存已选择的国际化文件 */
        uploadFileVal: '',/* 保存上传的国际化文件值 */
        dataModelStep: '1'/* 第三种场景，导航第二步的步骤，值为“1”时是编辑自定义SQL，值为“2”时是根据自定义SQL生成的表或视图，初始化或编辑数据项 */
    },
    /**
     * 初始化界面
     */
    init: function () {
        this.beforeInit();
        this.afterInit();
		var obj = $('#vm1481532544268');
		var height = obj.height();
		$(obj.parent()).css({"padding-bottom":height});
		obj.suspensionWindow({right:"1.25%",bottom:"0px",left:"0px"});
    },
    /**
     * 前初始化，包括页面元素，rul地址，事件
     */
    beforeInit: function () {
        this.initUrl();
        this.initSqlEdit();
        this.initHtml();
        this.initDataItem();
        this.initBootstrapTable();
        this.initBtn();

    },
    /**
     * 表格初始化
     */
    initBootstrapTable: function () {
        this.getComponentById(this.dataModelItemTableId).bootstrapTable(dataModelDesignCommon.dataItemTable());
    },
    /**
     * 数据项页面初始化
     */
    initDataItem: function () {
        dataModelDesignItemLogic.init();
    },
    /**
     * html元素初始化
     */
    initHtml: function () {
        this.getComponentById(this.globalizationSelectId).parent().parent().css('padding-right', '0');
        this.getComponentById(this.dataTableNameId).attr('readonly', 'readonly');
    },
    /**
     * 根据id获取html元素
     */
    getComponentById: function (id) {
      return $('#' + id);
    },
    /**
     * 数据初始化
     */
    afterInit: function () {
        this.getGlobalization();
        this.initDataModelDesign();
        this.initScene();
    },
    /**
     * 判断是否存在数据模型基本信息
     */
    findDataModelDesignerBaseInfo: function (dataModelDesignerBaseInfo) {
        return dataModelDesignerBaseInfo && dataModelDesignerBaseInfo.ID;
    },
    /**
     * 从缓存数据对象获取相应的数据
     */
    initDataModelDesign: function () {
        this.previousIndex = this.getDataModelDesignerObj().previousIndex;
        this.dataModelSceneType = this.getDataModelDesignerBaseInfo().SCENE;
        this.dataModelDesignerAssociatedInformation = this.getDataModelDesignerAssociatedInformation();
        this.dataModelStep = this.dataModelDesignerAssociatedInformation.dataModelStep;
        var dataModelDesignerBaseInfo = this.dataModelDesignerAssociatedInformation.dataModelDesignerBaseInfo;
        if (this.findDataModelDesignerBaseInfo(dataModelDesignerBaseInfo)) {
            this.dataModelDesignerBaseInfoA = dataModelDesignerBaseInfo;
        }
        this.dataModelDesignerBaseInfo = this.getDataModelDesignerBaseInfo();
        this.operator = this.getDataModelDesignerObj().operator;
        var dataTableName = this.getDataModelDesignerBaseInfo().BIND_TABLE_NAME;
        if (dataTableName) {
            this.dataTableName = dataTableName;
        }
    },
    /**
     * 初始化已有表配置信息
     */
    initExistedConfig: function () {
        this.showModelDesignOrSQLEdit(true);
        this.handleTableColumns();
        this.getComponentById(this.addDataModelItemLayoutId).hide();
        this.getComponentById(this.globalizationSelectId).val(this.dataModelDesignerAssociatedInformation.globalizationSelectVal);
        if (dataModelDesigner.isTwoTabInit == false) {
            this.handleDataItemByGlobalization();
            dataModelDesigner.isTwoTabInit = true;
        }
        if (this.previousIndex == 2) {
            this.dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
            this.loadDataItems();
            return;
        }
        if (this.operator == 'add') {
            if (this.findDataModelDesignerBaseInfo(this.dataModelDesignerBaseInfoA) && this.dataModelSceneType == this.dataModelDesignerBaseInfo.SCENE) {
                if (this.dataModelSceneType == '1' && this.dataModelDesignerBaseInfoA.BIND_TABLE_NAME == this.dataModelDesignerBaseInfo.BIND_TABLE_NAME) {
                    this.dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
                } else if (this.dataModelDesignerBaseInfoA.SCENE == '3') {
                    if (this.dataModelDesignerBaseInfoA.SCRIPT == this.dataModelDesignerBaseInfo.SCRIPT) {
                        this.dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
                    } else {
                        var tableDataItems = this.tableDataItems;
                        var dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
                        var resultDataItems = [];
                        for (var i = 0; i < tableDataItems.length; i++) {
                            var isFind = false;
                            var tableDataItem = tableDataItems[i];
                            for (var j = 0; j < dataItems.length; j++) {
                                var resultDataItem = dataItems[j];
                                if (resultDataItem.id == tableDataItem.ID) {
                                    isFind = true;
                                    resultDataItems.push(resultDataItem);
                                }
                            }
                            if (!isFind) {
                                resultDataItems.push(tableDataItem);
                            }
                        }
                        this.dataItems = resultDataItems;
                    }
                }
            }
        } else if (this.operator == 'edit') {
            if (this.findDataModelDesignerBaseInfo(this.dataModelDesignerBaseInfoA)) {
                this.dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
            } else {
                this.initDataModelItemsAsEdit();
            }
        }
        this.loadDataItems();
    },
    /**
     * 获取缓存对象
     */
    getDataModelDesignerObj: function () {
        return dataModelDesigner;
    },
    /**
     * 在新增的情况，初始化场景二
     */
    initDataItemsSceneTwoWithAdd: function () {
        var dataItem = {
            ID: 'id',
            NAME: '编号',
            TYPE: '4',
            IS_NULL: '1',
            LENGTH: '11',
            DECIMAL: '0',
            DEFAULT: '',
            COLUMN_KEY: 1,
            UI_VISIBLE: '2',
            LAYOUT: '0',
            DATA_BLOCK: '1',
            operate: ''
        };
        dataItem.COMPONENT_TYPE = dataModelColumnDataMapping.getComponentTypeByType(dataItem.TYPE);
        this.dataItems.push(dataItem);
        this.loadDataItems();
    },
    /**
     * 初始化场景二
     */
    initSceneWithTwo: function () {
        this.getComponentById('layout1482980374608').hide();
        this.getComponentById('layout1481530769639').hide();
        this.showModelDesignOrSQLEdit(true);
        if (this.previousIndex == 2) {
            this.dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
            this.loadDataItems();
            return;
        }
        if (this.operator == 'edit') {
            if (this.findDataModelDesignerBaseInfo(this.dataModelDesignerBaseInfoA)) {
                this.dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
            } else {
                this.initDataModelItemsAsEdit();
            }
            this.loadDataItems();
            return;
        }
        if (this.operator == 'add') {
            if (this.findDataModelDesignerBaseInfo(this.dataModelDesignerBaseInfoA) && this.dataModelSceneType == this.dataModelDesignerBaseInfoA.SCENE) {
                this.dataItems = this.dataModelDesignerAssociatedInformation.dataItems;
                this.loadDataItems();
            } else {
                this.initDataItemsSceneTwoWithAdd();
            }
        }
    },
    /**
     * 初始化场景三
     */
    initSceneWithThree: function () {
        this.dataModelStep = this.dataModelDesignerAssociatedInformation.dataModelStep;
        if (this.operator == 'edit') {
            this.dataModelStep = '2';
        }
        if (this.dataModelStep == '2') {
            this.initExistedConfig();
            return;
        }
        this.showModelDesignOrSQLEdit(false);
        if (this.findDataModelDesignerBaseInfo(this.dataModelDesignerBaseInfoA)) {
            var script = this.dataModelDesignerBaseInfoA.SCRIPT;
            if (script) {
                this.script = script;
                this.sqlEdit.session.setValue(script);
            }
        }
    },
    /**
     * 初始化场景
     */
    initScene: function () {
        if (this.dataModelSceneType ==  '1') {
            this.initExistedConfig();
        } else if (this.dataModelSceneType == '2') {
            this.initSceneWithTwo();
        } else if (this.dataModelSceneType == '3') {
            this.initSceneWithThree();
        }
        this.getComponentById(this.dataTableNameId).val(this.dataTableName);
    },
    /**
     * 临时存储数据模型基本信息
     */
    saveDataModelDesignerBaseInfoA: function () {
        var dataModelDesignerBaseInfo = {};
        var dataModelDesignerBaseInfoBase = this.dataModelDesignerBaseInfo;
        for (var attribute in dataModelDesignerBaseInfoBase) {
            dataModelDesignerBaseInfo[attribute] = dataModelDesignerBaseInfoBase[attribute];
        }
        this.dataModelDesignerBaseInfoA = dataModelDesignerBaseInfo;
    },
    /**
     * 获取数据模型相关信息，包括数据项、国际化选项、上传的国际化文件值和场景三步骤数据
     */
    getDataModelDesignerAssociatedInformation: function () {
        return dataModelDesigner.dataModelDesignerAssociatedInformation;
    },
    /**
     * 下一步操作数据保存到缓存数据操作
     */
    nextStepInitDataModelDesigner: function () {
        this.dataModelDesignerBaseInfo = this.getDataModelDesignerBaseInfo();
        if (this.dataModelSceneType == '3' && this.dataModelStep == '1') {
            this.dataModelDesignerBaseInfo.BIND_TABLE_NAME = this.dataTableName;
            this.dataModelDesignerBaseInfo.SCRIPT = this.script;
            this.dataModelDesignerAssociatedInformation.dataModelStep = '2';
        } else {
            this.initDataModelDesignerAssociatedInformation();
        }
        this.initDataModelDesigner();
    },
    /**
     * 初始化数据模型相关信息，包括数据项、国际化选项、上传的国际化文件值和场景三步骤数据
     */
    initDataModelDesignerAssociatedInformation: function () {
        this.dataModelDesignerAssociatedInformation.globalizationSelectVal = this.getComponentById(this.globalizationSelectId).val();
        this.dataModelDesignerAssociatedInformation.uploadFileVal = this.getComponentById(this.fileInputId).val();
        this.dataModelDesignerAssociatedInformation.dataModelStep = this.dataModelStep;
        this.dataModelDesignerAssociatedInformation.dataItems = this.dataItems;
        this.dataModelDesignerAssociatedInformation.dataModelDesignerBaseInfo = this.dataModelDesignerBaseInfoA;
    },
    /**
     * 上一步操作数据保存到缓存数据操作
     */
    previousStepInitDataModelDesigner: function () {
        dataModelDesigner.previousIndex = 1;
        if (this.dataModelSceneType == '3' && this.dataModelStep == '1') {
            this.dataModelDesignerBaseInfo.SCRIPT = this.sqlEdit.session.getValue();
        }
        this.saveDataModelDesignerBaseInfoA();
        if (this.dataModelSceneType == '3' && this.dataModelStep == '2') {
            this.dataModelStep = '1';
            this.initDataModelDesignerAssociatedInformation();
        } else if (this.dataModelSceneType != '3') {
            this.initDataModelDesignerAssociatedInformation();
        }
        this.initDataModelDesigner();
    },
    /**
     * 将数据存入缓存数据
     */
    initDataModelDesigner: function () {
        dataModelDesigner.dataModelDesignerAssociatedInformation = this.dataModelDesignerAssociatedInformation;
        dataModelDesigner.dataModelDesignerBaseInfo = this.dataModelDesignerBaseInfo;
    },
    /**
     * 获取缓存数据模型基本信息
     */
    getDataModelDesignerBaseInfo: function () {
        return dataModelDesigner.dataModelDesignerBaseInfo;
    },
    /**
     * 初始化url地址
     */
    initUrl : function() {
        var table = 'table/';
        var baseUrl = bcp + table;
        var dataModelItemTable = 'data_model_item_table';
        this.dataModelItemTableUrl = baseUrl + dataModelItemTable;
        this.getTabelColumnsUrl = bcp + 'metadata/table/';
        var dataModelBaseUrl = '/' + $base_url + '/model/';
        this.executeSqlUrl = dataModelBaseUrl + 'execute/sql';
        this.uploadGlobalization = dataModelBaseUrl + 'upload/globalization';
        this.dataModelItemUrl =  baseUrl + 'data_model_item_table';
        this.dataModelConfigFileUrl = dataModelBaseUrl + 'config-file';
    },
    /**
     * 自定义SQL没有保存时，删除表
     */
    handleDeleteTable: function () {
        var dataModelBaseInfo = {};
        dataModelBaseInfo.SCENE == this.getDataModelDesignerBaseInfo().SCENE;
        dataModelBaseInfo.BIND_TABLE_NAME = this.dataTableName;
        dataModelDesignCommon.handleDeleteTable(dataModelBaseInfo);
    },
    /**
     * 在编辑的时候，初始化数据模型数据项
     */
    initDataModelItemsAsEdit: function () {
        var resultItem = this.getDataModelItems();
        if (this.returnResultPrompt(resultItem && resultItem.status == 1, '请求数据异常。')) {
            var rowsItem = resultItem.rows;
            if (rowsItem && rowsItem.length > 0) {
                this.dataItems = rowsItem;
            }
        }
    },
    /**
     * 获取数据项
     */
    getDataModelItems : function() {
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
                {field:'INDEX', order: 'asc'}
            ],
            condition : {cname : 'MODEL_ID', value : this.getDataModelDesignerBaseInfo().ID, compare : '='}
        };
        return this.ajaxMethod('GET', this.getUrlAndParam(
            this.dataModelItemTableUrl, urlParam), undefined);
    },
    /**
     * 根据url和参数，返回带参数的url路径
     */
    getUrlAndParam : function(url, paramValue) {
        return url + '?param=' + encodeURIComponent(JSON.stringify(paramValue));
    },
    /**
     * 根据国际化信息返回相关数据
     */
    getGlobalizationDetailed: function (globalization) {
        var selectOption = this.getComponentById(this.globalizationSelectId).find('option[value="' + globalization + '"]');
        return  this.ajaxMethod('GET', '/' + $base_url + '/' + selectOption.attr('path'), undefined);
    },
    /**
     * 获取数据项表格html对象
     */
    getDataModelItemTable: function () {
        return this.getComponentById(this.dataModelItemTableId);
    },
    /**
     * 初始化按钮事件
     */
    initBtn: function () {
        var that = this;
        $('#toolbar-button14815332780130').click(function () {
            dataModelDesignItemLogic.addDataModelItem();
        });
        this.getComponentById(this.uploadFileDocBtnId).click(function () {
            that.getComponentById(that.docDialog).modal('show');
        });
        $('#toolbar-button14815332810070').click(function () {
            that.deleteSelectItems();
        });
		$('#button14815327374599').click(function () {
            that.backDataModel();
        });
        $('#button14815327374600').click(function (e) {
            that.previousStep(e);
        });
        $('#button14815327398760').click(function (e) {
            that.nextStep(e);
        });
        $('#upload_file_aaa212211').click(function() {
            that.uploadFile();
        });
        $('#trash_file_aaa212211').click(function() {
            $('#' + that.fileInputId).val('');
        });
        $('#loadLayoutTemplateBtn').click(function() {
            that.handleModelLayoutTemplate(this);
        });
        this.getComponentById(this.globalizationSelectId).change(function () {
            that.handleDataItemByGlobalization();
            that.loadDataItems();
        });
    },
    /**
     * 根据国际化文件处理相关数据
     */
    handleDataItemByGlobalization: function () {
        var valueSelect = this.getComponentById(this.globalizationSelectId).val();
        if (valueSelect) {
            var resultGlobalizationData = this.getGlobalizationDetailed(valueSelect);
            if (resultGlobalizationData) {
                this.initGroupMap(resultGlobalizationData.groupMap);
                var globalizationDataItems = resultGlobalizationData.layoutList;
                if (globalizationDataItems) {
                    this.dataItems = this.getGlobalizationDataItems(this.tableDataItems, globalizationDataItems);
                }
            }
            return;
        }
        this.dataItems = this.tableDataItems;
        this.initGroupMap();
    },
    /**
     * 根据已有表数据和国际化文件数据，返回重组后的数据项
     */
    getGlobalizationDataItems: function (tableDataItems, globalizationDataItems) {
        var dataItems = [];
        for (var j = 0, len = tableDataItems.length; j < len; j++) {
            var tableDataItem = tableDataItems[j];
            var isFind = false;
            for (var i = 0, lenResult = globalizationDataItems.length; i < lenResult; i++) {
                var resultDataItem = globalizationDataItems[i];
                if (resultDataItem.id == tableDataItem.ID) {
                    isFind = true;
                    dataItems.push({
                        ID: tableDataItem.ID,
                        NAME: resultDataItem.name,
                        TYPE: tableDataItem.TYPE,
                        IS_NULL: tableDataItem.IS_NULL,
                        COLUMN_KEY: tableDataItem.COLUMN_KEY,
                        LENGTH: tableDataItem.LENGTH,
                        DECIMAL: tableDataItem.DECIMAL,
                        DEFAULT: tableDataItem.default ? tableDataItem.default : '',
                        COMPONENT_TYPE: resultDataItem.controlType,
                        UI_VISIBLE: resultDataItem.uiVisible,
                        LAYOUT: resultDataItem.layout,
                        DATA_BLOCK: this.getGroup(resultDataItem.dataBlock)
                    });
                }
            }
            if (!isFind) {
                dataItems.push(tableDataItem);
            }
        }
        return dataItems;
    },
    /**
     * 查看是否存在该面板分组，不存在返回默认面板分组
     */
    getGroup: function (dataBlock) {
        var modelItemGroups = dataModelDesigner.modelItemGroups;
        for (var field in modelItemGroups) {
            if (field == dataBlock) {
                return dataBlock;
            }
        }
        return '1';
    },
    /**
     * 根据面板分组数据存入缓存对象
     */
    initGroupMap: function (groupMap) {
        var modelItemGroupsTemp = {};
        if (groupMap) {
            for (var field in groupMap) {
                var value = parseInt(field);
                if (value && value > 0) {
                    modelItemGroupsTemp[value] = groupMap[field];
                }
            }
        } else {
            modelItemGroupsTemp[1] = dataModelDesigner.modelItemGroups[1];
        }
        dataModelDesigner.modelItemGroups = modelItemGroupsTemp;
    },
    /**
     * 表格加载数据项数据
     */
    loadDataItems: function () {
        this.getComponentById(this.dataModelItemTableId).bootstrapTable('load', this.dataItems);
    },
    /**
     * 删除数据项处理
     */
    deleteSelectItems: function () {
        var selectData = this.getDataModelItemTable().bootstrapTable('getSelections');
        if (selectData && selectData.length > 0) {
            var ids = [];
            for (var i = 0, len = selectData.length; i < len; i++) {
                ids.push(selectData[i].ID);
            }
            this.deleteItemsByIds(ids);
        } else {
            tipBox.showMessage('请选择要删除的数据项。','info');
        }
    },
    /**
     * 根据ids删除数据项
     */
    deleteItemsByIds: function (ids) {
        var that = this;
        bootbox.confirm('确定要删除数据项吗？',function(result) {
            if (result) {
                var dataItems = that.dataItems;
                for (var i = 0; i < dataItems.length; i++) {
                    for (var j = 0, lenId = ids.length; j < lenId; j++) {
                        if (dataItems[i].ID == ids[j]) {
                            dataItems.splice(i,1);
                        }
                    }
                }
                that.loadDataItems();
                tipBox.showMessage('删除成功。','info');
            }
        });
    },
    /**
     * 返回主界面处理方法
     */
	backDataModel : function(){
	    var baseInfo = dataModelDesigner.dataModelDesignerBaseInfo;
        dataModelDesignCommon.handleDeleteTable(baseInfo);
        dataModelDesignCommon.backMain(baseInfo.PACKAGE_ID);
	},
    /**
     * 上一步操作
     */
    previousStep: function (e) {
        var previousIndex = 1;
        dataModelDesigner.isClick = false;
        if (this.dataModelSceneType == '3' && this.dataModelStep == '2' && this.operator == 'add') {
            this.previousStepInitDataModelDesigner();
            var toIndex = 1;
            this.onTabClick(e,toIndex, previousIndex);
        } else {
            var toIndex = 0;
            this.previousStepInitDataModelDesigner();
            this.onTabClick(e,toIndex, previousIndex);
        }
    },
    /**
     * 点击tab操作
     */
    onTabClick: function (e, index, previousIndex) {
        dataModelDesignerLogic.onTabClick(e, index, previousIndex);
    },
    /**
     * 自定义sql处理
     */
    handleSql: function (e) {
        var sqlexpression = this.sqlEdit.session.getValue();
        if(sqlexpression) {
            //sqlexpression = sqlexpression.replace(/([\r\n]|\ )+/g," ");
            if (sqlexpression == this.getDataModelDesignerBaseInfo().SCRIPT
                && dataModelDesigner.isExecute) {
                dataModelDesigner.dataModelDesignerAssociatedInformation.dataModelStep = '2';
                var toIndex = 1;
                var previousIndex = 1;
                this.onTabClick(e,toIndex, previousIndex);
            } else {
                dataModelDesigner.isExecute = false;
                this.handleDeleteTable();
                var urlAndParam = this.executeSqlUrl;
                var bodydata = {
                    sql:sqlexpression
                };
                var result = this.ajaxMethod('PUT', urlAndParam , bodydata);
                if (result.status == 1) {
                    dataModelDesigner.isExecute = true;
                    this.dataTableName = result.data[0];
                    this.script = sqlexpression;
                    tipBox.showMessage('SQL执行成功。','info');
                    this.nextStepInitDataModelDesigner();
                    var toIndex = 1;
                    var previousIndex = 1;
                    this.onTabClick(e,toIndex, previousIndex);
                } else {
                    tipBox.showMessage('SQL执行失败。' +  result.message, 'error');
                }
            }
        } else {
            tipBox.showMessage('请先输入SQL语句。','info');
        }
        dataModelDesignerLogic.showByIndex(1);
    },
    /**
     * 下一步操作
     */
    nextStep: function (e) {
        dataModelDesigner.isClick = false;
        dataModelDesigner.previousIndex = 1;
        if (this.dataModelSceneType == '3' && this.dataModelStep == '1') {
            this.handleSql();
            return;
        }

        this.nextStepInitDataModelDesigner();
        this.onTabClick(e,2);
    },
    /**
     * 初始化SQL编辑器
     */
    initSqlEdit: function () {
        this.sqlEdit = ace.edit("editor");
        this.sqlEdit.setTheme("ace/theme/iplastic");
        var SqlMode = ace.require("ace/mode/sql").Mode;
        this.sqlEdit.session.setMode(new SqlMode);
        this.sqlEdit.setShowPrintMargin(false);
    },
    /**
     * 显示在线设计或SQL编辑器
     */
    showModelDesignOrSQLEdit: function (showModelDesign) {
        var modelDesignObj = $('#' + this.dataModelVmId);
        var sQLEditObj = $('#' + this.sQLEditVmId);
        if (showModelDesign) {
            modelDesignObj.show();
            sQLEditObj.hide();
            return;
        }
        modelDesignObj.hide();
        sQLEditObj.show();
    },
    /**
     * 上传国际化文件
     */
    uploadFile: function() {
        var fileInputVal = $('#' + this.fileInputId).val();
        if (fileInputVal) {
            var handleFileInputVal = fileInputVal;
            while(handleFileInputVal.indexOf('\\') >= 0) {
                handleFileInputVal = handleFileInputVal.replace('\\', '/');
            }
            var handleFileInputValArr = handleFileInputVal.split('/');
            var globalizationFileName = handleFileInputValArr[handleFileInputValArr.length - 1];
            if (globalizationFileName) {
                var endStr = '.json';
                var globalizationFileNameLower = globalizationFileName.toLowerCase();
                var endLength = globalizationFileNameLower.length - endStr.length;
                if (((endLength >= 0)
                    && (globalizationFileNameLower.lastIndexOf(endStr) == endLength)) == false) {
                    tipBox.showMessage('请选择已“.json”结尾的文件上传。','info');
                    return;
                }
            }
            var resultData = this.ajaxMethod('GET', this.dataModelConfigFileUrl, undefined);
            if (resultData) {
                var isExist = false;
                for (var i = 0, len = resultData.length; i < len; i++) {
                    if (resultData[i].name == globalizationFileName) {
                        isExist = true;
                        break;
                    }
                }
                if (isExist) {
                    var that = this;
                    bootbox.confirm('该布局模板文件已存在，确定要覆盖吗？', function(result) {
                        if (result) {
                            that.handleUploadFile();
                        }
                    });
                    return;
                }

                this.handleUploadFile();
                return;
            }

            this.handleUploadFile();
            return;
        }

        tipBox.showMessage('请选择布局模板文件。','info');
    },
    /**
     * 数据项操作
     */
    dataItemOperator: function (operatorMark, row, index) {
        var dataItem = JSON.parse(decodeURIComponent(row));
        if (operatorMark == 1) {
            dataModelDesignItemLogic.queryDataModelItem(dataItem);
            return;
        }
        if (operatorMark == 2) {
            dataModelDesignItemLogic.editDataModelItem(dataItem, index);
            return;
        }
        if (operatorMark == 3) {
            var ids = [];
            ids.push(dataItem.ID);
            this.deleteItemsByIds(ids);
        }
    },
    /**
     * 上传国际化文件处理方法
     */
    handleUploadFile: function() {
        var formData = new FormData($("#uploadFormFile")[0]);
        var result = {};
        $.ajax({
            url : this.uploadGlobalization,
            type : 'POST',
            async: false,
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success : function(data) {
                if ((typeof data=='string') && (data.constructor==String)) {
                    result = JSON.parse(data);
                } else {
                    result = data;
                }
            },
            error : function(data) {
                result.status = 0;
            }
        });

        if (result.status == 1) {
            var filename = result.data.name;
            this.getGlobalization();
            $('#' + this.globalizationSelectId).val(filename);
            this.handleDataItemByGlobalization();
            this.loadDataItems();
            tipBox.showMessage('上传成功。','info');
        } else {
            tipBox.showMessage('上传失败。' + result.message, 'error');
        }
    },
    /**
     * ajax请求
     */
    ajaxMethod : function(method, urlAndParam, bodyData) {
        return $.designerAjax(method, urlAndParam, bodyData, undefined,
            undefined);
    },
    /**
     * 操作完成结果处理，false,提示信息
     */
    returnResultPrompt: function(boolData, falsePromptMessage) {
        if (boolData) {
            return true;
        }
        tipBox.showMessage(falsePromptMessage,'error');
        return false;
    },
    /**
     * 处理已有表字段信息
     */
    handleTableColumns: function () {
        var result = this.getTableColumns();
        if (this.returnResultPrompt(result.status == 1, '请求数据异常。')) {
            var fieldInfos = result.fieldInfos;
            var dataItems = [];
            for (var i = 0, len = fieldInfos.length; i< len; i++) {
                dataItems.push(this.handleDataItemByfieldInfo(fieldInfos[i]));
            }
            this.tableDataItems = dataItems;
        }
    },
    /**
     * 根据数据库字段信息封装数据项
     */
    handleDataItemByfieldInfo: function(fieldInfo) {
        var dataItem = {
            ID: fieldInfo.column_name,
            NAME: fieldInfo.column_name,
            TYPE: dataModelColumnDataMapping.dataBaseColumnTypeToDataModelItemType(fieldInfo.original_data_type),
            IS_NULL: fieldInfo.is_nullable == '0' ? 1 : 0,
            COLUMN_KEY: fieldInfo.column_key == 'PRI' ? 1 : 0,
            DECIMAL: fieldInfo.numeric_scale == null ? 0 : fieldInfo.numeric_scale,
            DEFAULT: fieldInfo.column_default,
            UI_VISIBLE: "1",
            LAYOUT:"0",
            DATA_BLOCK:"1"
        };
        if (fieldInfo.original_data_type == 'int'
            || fieldInfo.original_data_type == 'integer'
            || fieldInfo.original_data_type == 'bigint'
            || fieldInfo.original_data_type == 'tinyint'
            || fieldInfo.original_data_type == 'smallint') {
            var lengthVal = fieldInfo.column_type.split('(')[1].split(')')[0];
            dataItem.LENGTH = parseInt(lengthVal);
        } else {
            dataItem.LENGTH = fieldInfo.character_maximum_length == null ? fieldInfo.numeric_precision : fieldInfo.character_maximum_length;
        }
        dataItem.TYPE = dataModelColumnDataMapping.dataBaseColumnTypeToDataModelItemType(fieldInfo.original_data_type, dataItem.LENGTH, dataItem.DECIMAL);
        dataItem.COMPONENT_TYPE = dataModelColumnDataMapping.getComponentTypeByType(dataItem.TYPE);
        return dataItem;
    },
    /**
     * 数据项保存处理
     */
    handleSaveDataItem: function (index, dataItem, operate) {
        if (operate == 'add') {
            this.dataItems.push(dataItem);
            this.getDataModelItemTable().bootstrapTable('load', this.dataItems);
        } else if (operate == 'edit') {
            var dataItems = this.dataItems;
            for (var i = 0, len = dataItems.length; i < len; i++) {
                var dataItemR = dataItems[i];
                if (dataItemR.ID == dataItem.ID) {
                    dataItems.splice(i, 1, dataItem);

                }
                this.getDataModelItemTable().bootstrapTable('updateRow', {index: index, row: dataItem});
            }
            if (this.dataModelSceneType != '2') {
                var tableDataItems = this.tableDataItems;
                for (var i = 0, len = tableDataItems.length; i < len; i++) {
                    var dataItemR = tableDataItems[i];
                    if (dataItemR.ID == dataItem.ID) {
                        tableDataItems.splice(i, 1, dataItem);
                    }
                }
            }
        }
    },
    /**
     * 获取已有表字段
     */
    getTableColumns: function () {
        var url = this.getTabelColumnsUrl + this.dataTableName;
        return this.ajaxMethod('GET', url, undefined);
    },
    /**
     * 下载数据模型国际化模板
     */
    handleModelLayoutTemplate: function (htmlObj) {
        var dataModelInfo = dataModelDesignCommon.getDataModelDetail(
            dataModelDesignCommon.getDataModelDetailBase(this.getDataModelDesignerBaseInfo()),
            this.dataItems, dataModelDesigner.modelItemGroups);
        var baseUrl = '/'+ $base_url + '/';
	    var urlAndParam = baseUrl + 'model/layout-template/download?model-info=';
        urlAndParam += encodeURIComponent(JSON.stringify(dataModelInfo));
        var result = this.ajaxMethod('GET', urlAndParam, undefined);
        if (result.status == 1) {
            var layoutTemplateUrl = baseUrl + result.data.replace(/\\/g, '/');
            var layoutTemplateUrlSplitArr = layoutTemplateUrl.split('/');
            $(htmlObj).attr('download', layoutTemplateUrlSplitArr[layoutTemplateUrlSplitArr.length - 1]);
            $(htmlObj).attr('href', layoutTemplateUrl);
            return;
        }
        tipBox.showMessage('下载模板失败，' + result.message, 'error');
    },
    /**
     * 获取国际化文件模板并显示
     */
    getGlobalization: function () {
        var result = this.ajaxMethod('GET', this.dataModelConfigFileUrl, undefined);
        var gHtml =  '<option value ="">请选择布局模板</option>';
        if (result && result.length > 0) {
            for (var i = 0, len = result.length; i < len; i++) {
                var data = result[i];
                gHtml += '<option path="' + data.path + '" value ="' + data.name+ '">' + data.name.replace('.json','') + '</option>';
            }
        }
        $('#' + this.globalizationSelectId).html(gHtml);
    }
};

var dataModelDesignLogic = new DataModelDesignLogic();
dataModelDesignLogic.init();