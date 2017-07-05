var DataModelDesignItemLogic = function() {
};

DataModelDesignItemLogic.prototype = {
    dataModelAssociatedInformation: '',
    dataItemIndex: 0,
    dataModelHeadId : 'dataModelHeadId_1245533321553',
    dataModelInfoColumnIdForInputId : 'input_text1476672264671',
    dataModelInfoColumnNameForInputId : 'input_text1476672262496',
    dataModelInfoColumnDescriptionForTextareaId : 'textarea1476183446040',
    dialogId: 'dialog1478688694555',
    columnIdForComponentId: 'input_text1476788876644',
    columnNameForComponentId: 'input_text1476788882499',
    columnTypeForComponentId: 'select_dynamic1476429793350',
    columnIsNullForComponentId: 'select_dynamic1476430482563',
    columnLengthForComponentId: 'input_text1476788886577',
    columnDecimalForComponentId: 'input_text1476788890982',
    columnDefaultForComponentId: 'input_text1476788906361',
    columnKeyForComponentId: 'select_dynamic1477040214949',
    saveButtonComponentId: 'button1476869365722',
    saveAndAddButtonComponentId: 'button1476869365722q',
    decimalLayoutId: 'layout1476434863533',
    lengthLabelId: "label1476434711317",
    lengthInputId: "input_text1476788886577",
    columnComponentTypeForComponentId: 'select_dynamic1476429793350qqq',
    columnUiVisibleForComponentId: 'select_dynamic1476429793350qq',
    columnLayoutForComponentId: 'select_dynamic1476429793350q',
    columnDataBlockForComponentId: 'select_dynamic476788886577q',
    dataModelItemOperator:'',
    dataItem:{},
    addPaneDemainId: 'addPaneDemain_125451215432154',
    deletePaneDemainId: 'deletePaneDemain_125451215432154',
    paneDemainInputAddId: 'input_text14767889063612',
    vmId: 'vm1477036928060',
    frmTipBoxId: 'frmTipBox',
    /**
     * 初始化数据项操作界面
     */
    init : function() {
        this.initDataItemOperator();
        this.initVerification();
        this.initBtn();
    },
    /**
     * 查看或编辑面板分组的界面初始化
     */
    queryOrEditPaneDemain: function (isEdit) {
        var dataBlockDiv = this.getComponent(this.columnDataBlockForComponentId).parent();
        var addpaneDemainDiv = this.getComponent(this.addPaneDemainId).parent();
        if (isEdit) {
            dataBlockDiv.removeClass('col-md-12 col-xs-12 col-sm-12 col-lg-12 column noPadding');
            dataBlockDiv.addClass('col-md-10 col-xs-10 col-sm-10 col-lg-10 column noPadding');
            addpaneDemainDiv.show();
            return;
        }
        dataBlockDiv.removeClass('col-md-10 col-xs-10 col-sm-10 col-lg-10 column noPadding');
        dataBlockDiv.addClass('col-md-12 col-xs-12 col-sm-12 col-lg-12 column noPadding');
        addpaneDemainDiv.hide();
    },
    /**
     * 显示面板分组的处理方法
     */
    showPaneDemainInput: function (isTrue) {
        if (isTrue) {
            this.getComponent(this.paneDemainInputAddId).show();
            this.getComponent(this.columnDataBlockForComponentId).hide();
            return;
        }
        this.getComponent(this.paneDemainInputAddId).hide();
        this.getComponent(this.columnDataBlockForComponentId).show();
    },
    /**
     * 新增面板分组的处理方法
     */
    handleAddPaneDemain: function () {
        var paneDemainInputAddObj = this.getComponent(this.paneDemainInputAddId);
        if (paneDemainInputAddObj.is(':visible') == false) {
            this.changePaneDemain(true);
            paneDemainInputAddObj.val('');
            return;
        }
        var paneDemainInputAddValue = $.trim(paneDemainInputAddObj.val());
        paneDemainInputAddObj.val(paneDemainInputAddValue);
        this.getComponent(this.frmTipBoxId).empty();
        if (!paneDemainInputAddValue) {
            tipBox.showMessage('请输入面板分组名称。', 'info');
            return;
        }
        this.changePaneDemain(false);
        var modelItemGroups = dataModelDesigner.modelItemGroups;
        for (var field in modelItemGroups) {
            if (paneDemainInputAddValue == modelItemGroups[field]) {
                tipBox.showMessage('该面板分组已存在。', 'info');
                return;
            }
        }

        var newKey = Object.keys(modelItemGroups).length + 1;
        dataModelDesigner.modelItemGroups[newKey] = paneDemainInputAddValue;
        this.initModelItemGroups();
        this.getComponent(this.columnDataBlockForComponentId).val(newKey);
    },
    /**
     * 是否新增面板分组的处理方法
     */
    changePaneDemain: function(isAdd) {
        if (isAdd) {
            this.getComponent(this.addPaneDemainId).addClass('glyphicon-ok').removeClass('glyphicon-plus');
            this.getComponent(this.deletePaneDemainId).addClass('glyphicon-remove').removeClass('glyphicon-minus');
        } else {
            this.getComponent(this.deletePaneDemainId).addClass('glyphicon-minus').removeClass('glyphicon-remove');
            this.getComponent(this.addPaneDemainId).addClass('glyphicon-plus').removeClass('glyphicon-ok');
        }
        this.showPaneDemainInput(isAdd);
    },
    /**
     * 删除或者取消编辑面板分组的处理方法
     */
    handleDeleteOrCancelPaneDemain: function () {
        if (this.getComponent(this.paneDemainInputAddId).is(':visible')) {
            this.changePaneDemain(false);
            return;
        }

        var columnDataBlockForComponentVal = this.getComponent(this.columnDataBlockForComponentId).val();
        if (columnDataBlockForComponentVal == '1') {
            tipBox.showMessage('默认面板分组不能删除。', 'info');
            return;
        }
        var deleteMessage = '';
        var dataItems = dataModelDesignLogic.dataItems;
        for (var i = 0, len = dataItems.length; i < len; i++) {
            if (dataItems[i].DATA_BLOCK == columnDataBlockForComponentVal) {
                deleteMessage += '该面板分组已被使用，删除后数据项的面板分组将重置为默认面板分组，';
                break;
            }
        }
        deleteMessage += '确定要删除吗？';
        var that = this;
        bootbox.confirm(deleteMessage, function(result) {
            if (result) {
                that.operateDeletePaneDemain(columnDataBlockForComponentVal);
            }
        });
    },
    /**
     * 删除面板分组后处理方法
     */
    operateDeletePaneDemain: function (dataBlock) {
        var modelItemGroups = dataModelDesigner.modelItemGroups;
        var newKey = Object.keys(modelItemGroups).length;
        if (newKey > 2) {
            var modelItemGroupsTemp = {};
            for (var field in modelItemGroups) {
                if (field > dataBlock) {
                    modelItemGroupsTemp[field - 1] = modelItemGroups[field];
                } else {
                    modelItemGroupsTemp[field] = modelItemGroups[field];
                }
            }
            dataModelDesigner.modelItemGroups = modelItemGroupsTemp;
        } else {
            delete dataModelDesigner.modelItemGroups[2];
        }

        tipBox.showMessage('删除成功。', 'info');
        this.initModelItemGroups();
        if (newKey > 2) {
            this.getComponent(this.columnDataBlockForComponentId).val(newKey - 1);
        }
        this.reloadDataItems(dataBlock);
    },
    /**
     *
     * 重新加载数据项
     */
    reloadDataItems: function (dataBlock) {
        var dataItems = [];
        $.each(dataModelDesignLogic.dataItems, function(index, value) {
            if (value.DATA_BLOCK == dataBlock) {
                value.DATA_BLOCK = 1;
            } else if (value.DATA_BLOCK > dataBlock) {
                value.DATA_BLOCK -= 1;
            }
            dataItems.push(value);
        });
        dataModelDesignLogic.dataItems = dataItems;
        dataModelDesignLogic.loadDataItems();
    },
    /**
     * 初始化按钮
     */
    initBtn : function() {
        var that = this;

        this.getComponent(this.addPaneDemainId).click(function() {
            that.handleAddPaneDemain();
        });

        this.getComponent(this.deletePaneDemainId).click(function() {
            that.handleDeleteOrCancelPaneDemain();
        });
        
        $('#button1476869365722').click(function () {
            if (that.saveOrUpdateDataModelItemHandle()) {
            	var checkbox_stutus = document.getElementById('qf-create-another').checked;
            	checkbox_stutus = $('#qf-create-another').is(':checked');
            	if(!checkbox_stutus){
            		that.handeSaveResult(1);
            		return;
            	}
                that.handeSaveResult(2);
            }
        });

        $('#button1476869363293').click(function () {
            that.getComponent(that.dialogId).modal('hide');
        });
        
        // 改变数据长度时，启动精度的input事件，对其校验
		$('#input_text1476788886577').on('keyup', function(){
			if(!isNaN(parseInt($('#input_text1476788890982').val()))){
				$('#input_text1476788890982').trigger('input');
			}
		});
    },
    /**
     * 初始化一个面板分组
     */
    initModelItemGroup: function (field, value) {
        return '<option value="' + field + '">' + value + '</option>';
    },
    /**
     * 初始化面板分组集合
     */
    initModelItemGroups: function () {
        var modelItemGroups = dataModelDesigner.modelItemGroups;
        var items = '';
        for (var field in modelItemGroups) {
            items += this.initModelItemGroup(field, modelItemGroups[field]);
        }
        this.getComponent(this.columnDataBlockForComponentId).html(items);
    },
    /**
     * 重置数据项操作界面验证
     */
    resetValidator: function () {
        var bootstrapValidator = this.getComponent(this.vmId).data('bootstrapValidator');
        if (bootstrapValidator) {
            bootstrapValidator.destroy();
        }
    },
    /**
     * 编辑数据项初始化
     */
    editDataModelItem : function(dataItem, index) {
        this.resetValidator();
        this.initVerification();
        this.dataItemIndex = index;
        this.dataModelItemOperator = 'edit';
        this.dataItem = dataItem;
        this.showDialog();
        this.initDataComponent();
        this.queryOrEditPaneDemain(true);
    },
    /**
     * 查询数据项初始化
     */
    queryDataModelItem : function(dataItem) {
        this.resetValidator();
        this.dataModelItemOperator = 'view';
        this.dataItem = dataItem;
        this.showDialog();
        this.initDataComponent();
        this.queryOrEditPaneDemain(false);
    },
    /**
     * 新增数据项初始化
     */
    addDataModelItem : function() {
        this.resetValidator();
        this.initVerification();
        this.showDialog();
        this.dataModelItemOperator = 'add';
        this.dataItem = {};
        this.initDataComponent();
        this.queryOrEditPaneDemain(true);
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
     *显示数据项弹出框
     */
    showDialog: function () {
        this.getComponent(this.dialogId).modal({
            backdrop: 'static',
            show: true,
			keyboard:false
        });
    },
    /**
     * 初始化数据项界面元素，数据准备
     */
    initDataComponent: function() {
        $('#layout1476434710035').hide();
        this.clearDataItem();
        this.initComponentValue(this.columnDecimalForComponentId, '0');
        this.initModelItemGroups();
        this.showPaneDemainInput(false);
        this.initSelectComponent(this.columnTypeForComponentId, dataModelColumnDataMapping.itemColumnTypeDataMapping());
        this.initSelectComponent(this.columnKeyForComponentId, dataModelColumnDataMapping.itemColumnKeyDataMapping());
        this.initSelectComponent(this.columnIsNullForComponentId, dataModelColumnDataMapping.itemColumnIsNullDataMapping());
        this.initSelectComponent(this.columnLayoutForComponentId, dataModelColumnDataMapping.itemColumnLayoutDataMapping());
        this.initSelectComponent(this.columnUiVisibleForComponentId, dataModelColumnDataMapping.itemColumnUiVsibleDataMapping());
        this.initSelectComponent(this.columnComponentTypeForComponentId, dataModelColumnDataMapping.itemColumnComponentTypeDataMappingByType(1));
        this.initComponentValue(this.columnLayoutForComponentId, '0');
        this.initComponentValue(this.columnUiVisibleForComponentId, '1');
        this.initComponentValue(this.columnComponentTypeForComponentId, '2');
        this.initComponentValue(this.columnIsNullForComponentId, '0');
        this.initComponentValue(this.columnDataBlockForComponentId, '1');
        this.initComponentValue(this.columnTypeForComponentId, '1');
        this.initComponentValue(this.columnKeyForComponentId, '0');
        $('#' + this.decimalLayoutId).hide();
        var that = this;
        $('#' + this.columnTypeForComponentId).change(function() {
            that.handleDataByType($(this).val());
        });
        this.initDataModelItem();
    },
    /**
     * 根据不同数据字段类型显示不同的情况，数据类型配置，如“双精度型，要显示和初始化数据精度字段”
     */
    handleDataByType: function (value) {
        if (value == '5' || value == '8') {
            $('#' + this.decimalLayoutId).show();
        } else {
            $('#' + this.decimalLayoutId).hide();
        }
        // 日期和逻辑型时隐藏长度按钮
        if(value == '6' || value == '3'){
            $('div [compid=' + this.lengthLabelId+']').hide();
            $('div [compid=' + this.lengthInputId+']').hide();
        }else{
            $('div [compid=' + this.lengthLabelId+']').show();
            $('div [compid=' + this.lengthInputId+']').show();
        }
        this.initComponentValue(this.columnDecimalForComponentId, '0');
        this.initCompontentTypeDataByType(value);
    },
    /**
     *根据类型初始化类型组件和值
     */
    initCompontentTypeDataByType: function (type) {
        this.initSelectComponent(this.columnComponentTypeForComponentId, dataModelColumnDataMapping.itemColumnComponentTypeDataMappingByType(type));
        this.initComponentValue(this.columnComponentTypeForComponentId, dataModelColumnDataMapping.getComponentTypeByType(type));
    },
    /**
     * 根据html元素Id初始化值
     */
    initComponentValue: function(id, value) {
        $('#' + id).val(value);
    },
    /**
     * 根据html元素Id获取组件
     */
    getComponent: function(id) {
        return $('#' + id);
    },
    /**
     * 根据html元素Id获取组件值
     */
    getComponentValue: function(id) {
        return $('#' + id).val();
    },
    /**
     * 根据html元素Id初始化下拉框组件
     */
    initSelectComponent: function(id, arrData) {
        if (arrData) {
            var optionHtml = '';
            for (var i = 0, len = arrData.length; i < len; i++) {
                optionHtml += '<option value ="' + arrData[i].id + '">' + arrData[i].name + '</option>';
            }
            $('#' + id).html(optionHtml);
        }
    },
    /**
     * 验证数据项值
     */
    validate: function() {
        var validate = $('#' + this.vmId).data('bootstrapValidator');
        validate.validate();
        if (validate.isValid() == false) {
            return false;
        }
        validate.resetForm();
        var columnTypeValue = this.getComponentValue(this.columnTypeForComponentId);
        var columnDefaultValue = this.getComponentValue(this.columnDefaultForComponentId);

        if (columnTypeValue == '4' || columnTypeValue == '7') {
            if (columnDefaultValue == '') {
                return true;
            }
            var columnDefaultIntValue = parseInt(columnDefaultValue);
            if (columnDefaultIntValue == 0 || !!columnDefaultIntValue) {
                this.getComponent(this.columnDefaultForComponentId).val(columnDefaultIntValue);
                return true;
            }
            tipBox.showMessage('数据项类型为整数时，默认值应为有效整数。','info');
            return false;
        }
        if (columnTypeValue == '5') {
            if (columnDefaultValue == '') {
                return true;
            }
            var columnDefaultFloatValue = parseFloat(columnDefaultValue);
            if (columnDefaultFloatValue == 0 || !!columnDefaultFloatValue) {
                this.getComponent(this.columnDefaultForComponentId).val(columnDefaultFloatValue);
                return true;
            }
            tipBox.showMessage('数据项类型为浮点型时，默认值应为有效小数。','info');
            return false;
        }

        if (columnTypeValue == '6') {
            if (columnDefaultValue == '') {
                return true;
            }
            var columnDefaultDateValue = new Date(columnDefaultValue);
            if (columnDefaultDateValue == 'Invalid Date') {
                tipBox.showMessage('数据项类型为日期类型时，默认值应为日期，如“2016-6-12 12:12:12”。','info');
                return false;
            }
            return true;
        }

        if (columnTypeValue == '8') {
            if (columnDefaultValue == '') {
                return true;
            }
            var columnDefaultFloatValue = parseFloat(columnDefaultValue);
            if (columnDefaultFloatValue == 0 || !!parseFloat(columnDefaultFloatValue)) {
                this.getComponent(this.columnDefaultForComponentId).val(columnDefaultFloatValue);
                return true;
            }
            tipBox.showMessage('数据项类型为浮点型时，默认值应为有效小数。','info');
            return false;
        }
        return true;
    },
    /**
     * 保存或者更新数据项处理方法
     */
    saveOrUpdateDataModelItemHandle: function() {
        if (this.validate() == false) {
            return false;
        }
        var bodyData = {
            ID: this.getComponentValue(this.columnIdForComponentId),
            NAME: this.getComponentValue(this.columnNameForComponentId),
            TYPE: this.getComponentValue(this.columnTypeForComponentId),
            IS_NULL: this.getComponentValue(this.columnIsNullForComponentId),
            LENGTH: this.getComponentValue(this.columnLengthForComponentId),
            DECIMAL: this.getComponentValue(this.columnDecimalForComponentId),
            DEFAULT: this.getComponentValue(this.columnDefaultForComponentId),
            COLUMN_KEY: this.getComponentValue(this.columnKeyForComponentId),
            COMPONENT_TYPE: this.getComponentValue(this.columnComponentTypeForComponentId),
            UI_VISIBLE: this.getComponentValue(this.columnUiVisibleForComponentId),
            LAYOUT: this.getComponentValue(this.columnLayoutForComponentId),
            DATA_BLOCK: this.getComponentValue(this.columnDataBlockForComponentId),
            operate: ''
        };
        dataModelDesignLogic.handleSaveDataItem(this.dataItemIndex, bodyData, this.dataModelItemOperator);
        return true;
    },
    /**
     * 保存结果后的处理方法
     */
    handeSaveResult: function(mark) {
        var that = this;
        if (dataModelDesignLogic.dataModelSceneType != '2' || mark == 1) {
	    that.getComponent(that.dialogId).modal('hide');
            tipBox.showMessage('保存成功。','info');
            return;
        }
        this.getComponent(that.dialogId).modal('show');
        this.dataModelItemOperator = 'add';
        this.initDataComponent();
    },
    /**
     * 根据操作初始化界面元素
     */
    initDataModelItem: function() {
        if (this.dataModelItemOperator == 'edit' || this.dataModelItemOperator == 'view') {
            this.initDataModelItemHandle();
            if (this.dataModelItemOperator == 'view') {
                this.isReadonly(true);
                return;
            }
            this.isReadonly(false);
            if (dataModelDesignLogic.dataModelSceneType != '2') {
                this.handleDataModelItemByScene();
                return;
            }
            this.getComponent(this.columnIdForComponentId).attr('readonly', true);
            return;
        }
        this.handleDataByType(this.getComponentValue(this.columnTypeForComponentId));
        this.isReadonly(false);
    },
    /**
     * 根据场景初始化界面元素，如“场景一和场景三，是不能修改数据项类型等”
     */
    handleDataModelItemByScene: function () {
        var isReadOnly = true;
        this.getComponent(this.saveAndAddButtonComponentId).hide();
        this.getComponent(this.columnIdForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnTypeForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnIsNullForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnLengthForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnDecimalForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnDefaultForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnKeyForComponentId).attr('disabled', isReadOnly);
    },
    /**
     * 清除数据项操作界面元素的数据
     */
    clearDataItem : function(){
        this.getComponent(this.columnIdForComponentId).val('');
        this.getComponent(this.columnNameForComponentId).val('');
        this.getComponent(this.columnTypeForComponentId).val('');
        this.getComponent(this.columnIsNullForComponentId).val('');
        this.getComponent(this.columnLengthForComponentId).val('');
        this.getComponent(this.columnDecimalForComponentId).val('');
        this.getComponent(this.columnDefaultForComponentId).val('');
        this.getComponent(this.columnKeyForComponentId).val('');
        this.getComponent(this.columnComponentTypeForComponentId).val('');
        this.getComponent(this.columnUiVisibleForComponentId).val('');
        this.getComponent(this.columnLayoutForComponentId).val('');
        this.getComponent(this.columnDataBlockForComponentId).val('');
    },
    /**
     * 设置是否只读
     */
    isReadonly: function(isReadOnly) {
        this.getComponent(this.columnIdForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnNameForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnTypeForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnIsNullForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnLengthForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnDecimalForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnDefaultForComponentId).attr('readonly', isReadOnly);
        this.getComponent(this.columnKeyForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnComponentTypeForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnUiVisibleForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnLayoutForComponentId).attr('disabled', isReadOnly);
        this.getComponent(this.columnDataBlockForComponentId).attr('disabled', isReadOnly);
        if(isReadOnly) {
            this.getComponent(this.saveButtonComponentId).hide();
            this.getComponent(this.saveAndAddButtonComponentId).hide();
            return;
        }
        if (dataModelDesignLogic.dataModelSceneType == '2') {
            this.getComponent(this.saveAndAddButtonComponentId).show();
        }
        this.getComponent(this.saveButtonComponentId).show();
    },
    /**
     * 数据项的界面元素的数据初始化
     */
    initDataModelItemHandle: function() {
        var row = this.dataItem;
        this.initSelectComponent(this.columnComponentTypeForComponentId, dataModelColumnDataMapping.itemColumnComponentTypeDataMappingByType(row.TYPE));
        this.initComponentValue(this.columnIdForComponentId, row.ID);
        this.initComponentValue(this.columnNameForComponentId, row.NAME);
        this.initComponentValue(this.columnTypeForComponentId, row.TYPE);
        this.initComponentValue(this.columnIsNullForComponentId, row.IS_NULL);
        this.initComponentValue(this.columnLengthForComponentId, row.LENGTH);
        this.handleDataByType(this.getComponentValue(this.columnTypeForComponentId));
        this.initComponentValue(this.columnDecimalForComponentId, row.DECIMAL);
        this.initComponentValue(this.columnDefaultForComponentId, row.DEFAULT);
        this.initComponentValue(this.columnKeyForComponentId, row.COLUMN_KEY);
        this.initComponentValue(this.columnComponentTypeForComponentId, row.COMPONENT_TYPE);
        this.initComponentValue(this.columnUiVisibleForComponentId, row.UI_VISIBLE);
        this.initComponentValue(this.columnLayoutForComponentId, row.LAYOUT);
        this.initComponentValue(this.columnDataBlockForComponentId, row.DATA_BLOCK);
    },
   /**
     * 检查数据项Id和名称是否重复
     */
    checkDataItem:function(type,value){
		if( value == dataModelDesignItemLogic.dataItem[type]){
			return true;
		}
		var dataItems = dataModelDesignLogic.dataItems;
        for (var i = 0, len = dataItems.length; i < len; i++) {
            if (value == dataItems[i][type]) {
                return false;
            }
        }    
        return true;
    },
    /**
     * 初始化数据项表单验证功能
     */
    initVerification: function () {
        var that = this;
        this.getComponent(this.vmId).bootstrapValidator({
            fields:{
                input_text1476788876644:{
                    validators: {
                        notEmpty: {
                            message: '请输入数据项编号'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z]\w*$/,
                            message: '请输入以字母开头且只包含字母数字或下划线的标识'
                        },
                        callback: {
                            message: '数据项编号不能重复',
                            callback: function(value, validator){
                                return that.checkDataItem("ID",value);
                            }}
                    }
                }   ,
                input_text1476788882499:{
                    validators: {
                        notEmpty: {
                            message: '请输入数据项名称'
                        },
						regexp: {
                            regexp: /^[a-zA-Z\u4e00-\u9fa5][_a-zA-Z0-9\u4e00-\u9fa5]*$/,
                            message: '数据项名称可包含中文，字母，数字，下划线；不能以数字或下划线开头'
                        },
						callback: {
                            message: '数据项名称不能重复',
                            callback: function(value, validator){
                                return that.checkDataItem("NAME",value);
                            }}
                    }
                }   ,
                input_text1476788886577:{
                    validators: {
                        notEmpty: {
							message: '请输入总长度'
						},
                        regexp: {
                            regexp: /^\+?[1-9]\d*$/,
                            message: '请输入大于0的整数'
                        },
	                    callback: {
	                    	message: '数据总长度不能小于小数部分长度',
	                    	callback: function(value, validator) {
		                    	var percision_length = isNaN(parseInt($('#input_text1476788890982').val())) ? 0 : parseInt($('#input_text1476788890982').val());
		                    	if(/^\+?[1-9]\d*$/.test(value)){
		                    		return value >= percision_length;
		                    	}
		                    	return true;
	                    	}
	                    }
                    }
                }   ,
                input_text1476788890982:{
                    validators: {
                        integer:{},
	                    callback: {
	                    	message: '小数部分长度不能大于数据总长度',
	                    	callback: function(value, validator) {
		                    	var total_length = isNaN(parseInt($('#input_text1476788886577').val())) ? 0 : parseInt($('#input_text1476788886577').val());
		                    	console.debug(/^\+?[1-9]\d*$/.test(value));
		                    	if(/^\+?[1-9]\d*$/.test(value)){
		                    		return value <= total_length;
		                    	}
		                    	return true;
	                    	}
	                    }
                    }
                }   ,
                input_text1476788906361:{
                    validators: {
                    }
                }
            }
        });
    },
    /**
     * 模型设计界面初始化时，获取整个数据项操作html数据，初始化到界面上。
     */
    initDataItemOperator: function () {
        var dataModelDesignItemHtmlData = this.ajaxHtml('/' + $base_url  + '/data_model_design_item.html');
        dataModelDesignerLogic.appendHtmlByVm(dataModelDesignerLogic.dataModelDesignVm, dataModelDesignItemHtmlData);
    },
    /**
     * 获取html数据
     */
    ajaxHtml: function (url) {
        var result = '';
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'text',
            async: false,
            cache: false,
            success: function (data, textStatus) {
                result = data;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("textStatus " + textStatus + " errorThrown "
                    + errorThrown + " url "  + url);
                tipBox.showMessage('请求错误。','error');
            }
        });
        return result;
    }
};

var dataModelDesignItemLogic = new DataModelDesignItemLogic();