var DataModelInfo = function() {
};
DataModelInfo.prototype = {
    sceneSelectId: 'select_dynamic14878469249860',
    bindingTableSelectId: 'select_dynamic14878469267940',
    packageId: 0,
    /**
     * 页面初始化
     */
	init : function() {
    	this.initHtml();
		this.initBtn();
		this.initValidator();
		this.initGetParam();
		var obj = $('#layout1481608833101');
		var height = obj.height();
		$(obj.parent()).css({"padding-bottom":height});
		obj.suspensionWindow({right:"19px",top:"420px",left:"0px"});
	},
    /**
     * 初始化表单验证
     */
	initValidator: function () {
        $('#vm1481598122807').bootstrapValidator({
            fields:{
                input_text14815961208541:{
                    validators: {
                        notEmpty: {
                            message: '请输入数据模型编号'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z]\w*$/,
                            message: '请输入以字母开头且只包含字母数字或下划线的标识'
                        },
                        callback: {
                            message: '数据模型编号不能重复',
                            callback: function(value){
                                return dataModelInfo.checkDataModel("ID",value);
                            }
                        }
                    }
                },
                input_text14815961208543:{
                    validators: {
                        notEmpty: {
                            message: '请输入数据模型名称'
                        },
						callback: {
                            message: '数据模型名称不能重复',
                            callback: function(value){
                                return dataModelInfo.checkDataModel("NAME",value);
                            }
                        }
                    }
                }
            }
        });
    },
    /**
     *
     * 初始化按钮
     */
	initBtn : function(){
		this.getComponentById(this.sceneSelectId).change(function() {
            that.sceneChange($(this).val());
		});
		var that = this;
		$("#button14816092471660").click(function(){
			that.backMain();
		});
		$("#button14816092528980").click(function(e){
			that.nextDataModel(e);
		});
	},
    /**
     *
     * 场景切换处理
     */
    sceneChange: function (value) {
		var bindingTableLable = this.getComponentById('label14878469133842');
		var bindingTableSelect = this.getComponentById(this.bindingTableSelectId);
		if (value == '1') {
            bindingTableLable.attr('style', 'display: inline !important');
            bindingTableSelect.show();
            this.initSelect(value);
            return;
		}
        bindingTableLable.attr('style', 'display: none !important');
        bindingTableSelect.hide();
    },
    /**
     *
     * 初始化html元素
     */
	initHtml: function () {
		this.initSecne();
    },
    /**
     *
     * 初始化场景
     */
	initSecne: function () {
        var secneObj = this.getComponentById(this.sceneSelectId);
        secneObj.html(this.getSelectOptions(this.initSecneData()));
        secneObj.val('2');
        this.sceneChange('2');
    },
    /**
     *
     * 获取下拉列表框元素数据
     */
	getSelectOptions: function (datas) {
		if (datas == false) {
            return '';
		}
        var htmlStr = '';
        for (var i = 0, len = datas.length; i < len; i++) {
            var data = datas[i];
            htmlStr += '<option value="' + data.key + '">' + data.value + '</option>'
        }
		return htmlStr;
    },
    /**
     *
     * 初始化场景数据
     */
    initSecneData: function () {
		return [
			{key: 1, value:'绑定已有表'},
            {key: 2, value:'在线设计'},
            {key: 3, value:'自定义SQL'}
		];
    },
    /**
     *
     * 根据Id返回主键
     */
	getComponentById: function(id) {
		return $('#' + id);
	},
    /**
     *
     * 控制是否只读
     */
    readonlyByOperator: function (operator) {
		if (operator == 'edit' || operator == 'query') {
            this.getComponentById('input_text14815961208541').attr("readonly","readonly");
            this.getComponentById(this.bindingTableSelectId).attr("disabled","disabled");
            this.getComponentById(this.sceneSelectId).attr('disabled',"disabled");
            if(operator == 'query') {
                this.getComponentById('input_text14815961208543').attr("readonly","readonly");
                this.getComponentById('textarea14815961544470').attr("readonly","readonly");
            }
        }
    },
    /**
     *
     * 初始化参数，获取数据，初始化界面
     */
	initGetParam : function(){
		var dataModelInfoObj = this.getBase();
		var operator = this.initUrlParam('operator');
		var modelId = this.initUrlParam('modelId');
        this.packageId = this.initUrlParam('packageId');
		if(operator == "add"){
			dataModelDesigner.operator = 'add';
			if (dataModelInfoObj.ID) {
				this.initSelect(dataModelInfoObj.SCENE);
                this.initData(dataModelInfoObj);
			} else {
                this.initData(null);
                this.sceneChange('2');
			}
			return;
		}
		if(operator == 'edit' && modelId != null){
			dataModelDesigner.operator = 'edit';
            this.handleDataModelInfoTable(modelId);
			this.readonlyByOperator(operator);
		} else{
			if(this.isEmptyObject(dataModelInfoObj)){
				bootbox.alert("数据模型信息页面有误，请联系管理员。");
			}else{
				this.initData(dataModelInfoObj);
			}
            this.readonlyByOperator(operator);
		}
	},
    /**
     *
     * 处理数据模型数据
     */
    handleDataModelInfoTable: function (modelId) {
        var url = bcp + 'table/data_model_info_table?param=' + encodeURIComponent(JSON.stringify({
                columns:[{cname:'ID'},{cname:'NAME'},
                    {cname:'DESCRIPTION'},{cname:'CREATOR'},
                    {cname:'BIND_TABLE_NAME'},{cname:'CREATE_TIME'},
                    {cname:'UPDATE_TIME'},{cname:'I18N'},
                    {cname:'SCENE'},{cname:'SCRIPT'},
                    {cname:'PACKAGE_ID'}
                ],
                condition:{"and":[
                    {"cname":"ID","compare":"=","value": modelId},
                    {"cname":"PACKAGE_ID","compare":"=","value": this.packageId}
                ]},
                orders:[],
                isDistinct:true
            }));
        var result = this.ajaxMethod('get',url, undefined);
        if (result.status == 1 && result.rows.length > 0) {
            var row = result.rows[0];
            dataModelDesigner.dataModelDesignerBaseInfo = row;
            this.initData(row);
            this.handleDataModelGroupTable(modelId);
        }else{
            bootbox.alert("查询数据模型信息有误，请联系管理员。");
        }
    },
    /**
     *初始化界面数据
     *
     */
	initData : function(obj){
        var model_name = $("#input_text14815961208543");
        var model_num = $("#input_text14815961208541");
        var model_desc = $("#textarea14815961544470");
        if(obj){
            model_num.val(obj.ID);
            model_name.val(obj.NAME);
            model_desc.html(obj.DESCRIPTION);
            this.sceneChange(obj.SCENE);
            this.getComponentById(this.sceneSelectId).val(obj.SCENE);
            this.getComponentById(this.bindingTableSelectId).val(obj.BIND_TABLE_NAME);
            return;
        }

        model_num.val('');
        model_name.val('');
        model_desc.html('');
        this.initSelect(undefined);
	},
    /**
     * 判断对象是否为空对象
     */
	isEmptyObject : function(obj){
        return Object.keys(obj).length == 0 ? true : false;
	},
    /**
     * 根据key获取对应的值
     */
	initUrlParam : function(key) {
		return decodeURIComponent(getUrlParam(key, window.location.search));
	},
    /**
     * 根据场景初始化绑定表数据
     */
	initSelect : function(value){
		if (value == '1') {
            var bindingTableSelectObj = this.getComponentById(this.bindingTableSelectId);
            bindingTableSelectObj.empty();
            var url = bcp + 'table/data_model_info_table?param=' + encodeURIComponent(JSON.stringify({
                    columns:[{cname:'BIND_TABLE_NAME'}],
                    condition:{},
                    orders:[],
                    isDistinct:true
                }));
            var result = $.designerAjax('get',url, undefined, undefined, undefined);
            if (result.status == 1) {
                if (result.rows.length > 0) {
                    for(var index = 0;index < result.rows.length;index++){
                        var p = '<option value='+result.rows[index].BIND_TABLE_NAME+'>'+result.rows[index].BIND_TABLE_NAME+'</option>';
                        bindingTableSelectObj.append(p);
                    }
                } else {
                    tipBox.showMessage('没有已有表可绑定。','info');
                    this.getComponentById(this.sceneSelectId).val('2');
                    this.sceneChange('2');
                }
            }
		}
	},
    /**
     * 返回主页
     */
    backMain : function() {
        dataModelDesignCommon.handleDeleteTable(this.getBase());
        dataModelDesignCommon.backMain(this.packageId);
	},
    /**
     * 进入下一步的处理方法
     */
	nextDataModel : function(e){
		dataModelDesigner.isClick = false;
		var val_com = $("#vm1481598122807").data('bootstrapValidator');
        val_com.validate();
		if(val_com.isValid()){
			this.renewDataModelInfoObj(e);
		}
	},
    /**
     * 跳转到第一步
     */
    toTab: function (e) {
	    var toIndex = 1;
	    var previousIndex = 0;
        dataModelDesigner.previousIndex = previousIndex;
        dataModelDesignerLogic.onTabClick(e, toIndex, previousIndex);
    },
    /**
     * 验证是否可以进行后续步骤的操作
     */
    verificationSenceOrBindTableIsChange: function() {
        var scene = this.getBase().SCENE;
        var bindTableName = this.getBase().BIND_TABLE_NAME;
        var newScene = this.getComponentById(this.sceneSelectId).val();
        var newBindTableName = this.getComponentById(this.bindingTableSelectId).val();
        if (scene == undefined || scene == '') {
            tipBox.showMessage('请按步骤进行操作。','info');
            return false;
        }
        if (scene != newScene) {
            tipBox.showMessage('场景已切换，请按步骤进行操作。','info');
            return false;
        }
        if (scene == '1'
            && scene == newScene
            && newBindTableName != bindTableName) {
            tipBox.showMessage('绑定表已切换，请按步骤进行操作。','info');
            return false;
        }
        return true;
    },
    /**
     * 获取数据并写入缓存方法
     */
	getData: function () {
        var dataModelInfoObj = this.getBase();
        var scene = this.getBase().SCENE;
        dataModelInfoObj.ID = $("#input_text14815961208541").val();
        dataModelInfoObj.NAME = $("#input_text14815961208543").val();
        dataModelInfoObj.DESCRIPTION = $("#textarea14815961544470").val();
        dataModelInfoObj.SCENE = this.getComponentById(this.sceneSelectId).val();
        dataModelInfoObj.PACKAGE_ID = this.packageId;
        if(dataModelDesigner.operator == 'add'){
            dataModelInfoObj.CREATOR = maoEnvBase.getCurrentUserName();
            dataModelInfoObj.CREATE_TIME = '';
            dataModelInfoObj.UPDATE_TIME = '';
            dataModelInfoObj.I18N = '';
        }
        dataModelDesigner.modelItemGroups[1] = dataModelInfoObj.NAME;
        if ((scene == '3'
                && dataModelInfoObj.SCRIPT
                && scene == dataModelInfoObj.SCENE) == false) {
            dataModelInfoObj.BIND_TABLE_NAME = '';
            dataModelInfoObj.SCRIPT = '';
        }
        
        if(dataModelInfoObj.SCENE == '1'){
            dataModelInfoObj.BIND_TABLE_NAME = this.getComponentById(this.bindingTableSelectId).val();
        }else if(dataModelInfoObj.SCENE == '2'){
            dataModelInfoObj.BIND_TABLE_NAME = dataModelInfoObj.ID;
        }
        this.setBase(dataModelInfoObj);
    },
    /**
     * 数据写入缓存处理方法
     */
	renewDataModelInfoObj : function(e){
		var scene = this.getBase().SCENE;
        var bindTableName = this.getBase().BIND_TABLE_NAME;
        var newScene = this.getComponentById(this.sceneSelectId).val();

        var newBindTableName = '';
        if(newScene == '1'){
            newBindTableName = this.getComponentById(this.bindingTableSelectId).val();
        } else if(newScene == '2'){
            newBindTableName = $("#input_text14815961208541").val();
        }
		if (!scene
			|| ((scene == newScene
			        && scene == '1'
			        && newBindTableName == bindTableName)
				|| (scene == newScene
				        && scene != '1'))) {
			this.getData();
            this.toTab(e);
            return;
		}
		var infoStr = '';
		if (scene == '1' && scene == newScene && newBindTableName != bindTableName) {
            infoStr += '绑定表已经切换';
		} else {
            infoStr += '场景已经切换';
		}
		infoStr += '，继续将清除后续步骤的数据，确定继续吗？';
		var that = this;
		bootbox.confirm(infoStr, function(result) {
			if (result) {
                dataModelDesigner.isTwoTabInit = false;
				if (scene == '3' && dataModelDesigner.isExecute) {
				    dataModelDesigner.isExecute = false;
                    dataModelDesignCommon.handleDeleteTable(that.getBase().BIND_TABLE_NAME);
				}
				dataModelDesigner.dataModelDesignerAssociatedInformation = {
					dataItems: [],
					globalizationSelectVal: '',
					uploadFileVal: '',
					dataModelStep: '1'

				};
                dataModelDesigner.modelItemGroups = {1: $("#input_text14815961208543").val()};
				that.getData();
                that.toTab(e);
			} else {
                dataModelDesignerLogic.showByIndex(0);
			}
		});
	},
    /**
     * 获取数据模型基本信息
     */
    getBase : function(){
		return dataModelDesigner.dataModelDesignerBaseInfo;
	},
    /**
     * 设置数据模型基本信息
     */
	setBase : function(obj){
		dataModelDesigner.dataModelDesignerBaseInfo = obj;
	},
    /**
     * 检查数据模型ID和名称是否重复
     */
	checkDataModel : function(type,value){
		if(value == dataModelInfo.getBase()[type]){
			return true;
		}
		
		var urlParam = {
				columns : [ {
					cname : 'ID'
				}, {
					cname : 'NAME'
				} ],
				isDistinct : true,
				condition : {
					'cname':type,
					'compare':'=',
					'value':value
				}
		};
		var url = bcp + 'table/data_model_info_table?param=' + encodeURIComponent(JSON.stringify(urlParam));
		var result = $.designerAjax('get',url, undefined, undefined, undefined);
		if (result.status == 1 && result.rows.length > 0) {
			return false;
		}	
		
		return true;
	},
	 
    /**
     * 处理数据分组
     */
    handleDataModelGroupTable: function (modelId) {
        var urlParam = {
            columns : [
                {cname : 'ID'},
                {cname : 'NAME'}
            ],
            isDistinct : true,
            condition : {
                cname: 'MODEL_ID',
                compare: '=',
                value: modelId
            }
        };
        var url = bcp + 'table/data_model_group_table?param=' + encodeURIComponent(JSON.stringify(urlParam));
        var result = this.ajaxMethod('get',url, undefined);
		if (result && result.status == 1) {
            $.each(result.rows, function(index, value){
                dataModelDesigner.modelItemGroups[value.ID] = value.NAME;
            });
		}
    },
    /**
     * ajax请求方法
     */
    ajaxMethod : function(method, urlAndParam, bodyData) {
        return $.designerAjax(method, urlAndParam, bodyData, undefined,
            undefined);
    }
};

var dataModelInfo = new DataModelInfo();
dataModelInfo.init();