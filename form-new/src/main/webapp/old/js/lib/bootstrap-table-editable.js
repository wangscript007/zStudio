/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * extensions: https://github.com/vitalets/x-editable
 */

!function ($,window) {

    'use strict';

    var
        EDITABLE_SUFFIX = "-editable",//编辑常量
        VALIDATE_SUFFIX = "-validate",//验证常量
        UPDATE_SUFFIX = "-update",//是否更新常量
        DEFAULT_SUFFIX = "-checkbox",//默认值常量
        KEY_SUFFIX = "-key",
        FORMATTER = {
            /**
             * 表格列格式化函数，显示效果为输入框
             * @param value
             * @param row
             * @param index
             */
            formatTableText : function(value, row, index) {
                    //row[this.field+DEFAULT_SUFFIX] = this.initData.defaultValue;
                    if(row[this.field+EDITABLE_SUFFIX]){
                        var isError = row[this.field+VALIDATE_SUFFIX]===false,msg = VALIDATE_MESSAGE[this.validate];//判断该单元格是否验证失败
                        if(this.validate==="custom"){
                            if(!this.tableId){
                                console.error(this.field + " 字段缺失属性tableId ");
                                return;
                            }
                            var customVariable =  eval("table$"+this.tableId+"$"+this.field);
                            msg = customVariable.message
                        }
                        return [
                            '<div data-type="text" data-update="false" data-editable="true" data-field="',this.field,'" class="form-group ',isError?' has-error ':'','">',
                            '<input type="text"  value="' ,value, '" class="form-control"/>',
                            '<label class="control-label">',isError && this.validate?msg:'','</label>',
                            '</div>'
                        ].join('');
                    }else{
                        return [
                            '<div data-type="text" data-editable="false" data-field="',this.field,'" class="form-group">',
                            '<input type="text"  value="' ,value, '" class="form-control" disabled/>',
                            '</div>'
                        ].join("");
                    }

            },
            formatTableSelect : function(value,row,index){
                //row[this.field+DEFAULT_SUFFIX] = this.initData.defaultValue;
                var selected = function(option){
                    return value==option?"selected ":" ";
                    },
                    options = function(data){
                        var html = [];
                        // html.push("<option value=''>-请选择-</option>");
                        $.each(data,function(index,item){
                            html.push('<option '+ selected(item["value"])+' value="'+item["value"]+'">'+item["text"]+'</option>');
                        })
                        return html;
                    },
                    customVariable =  undefined;
                    try{
                        customVariable = eval("table$"+this.tableId+"$"+this.field)
                    }catch(e){
                        console.log("变量table$"+this.tableId+"$"+this.field+"不存在!")
                    }
		            if(typeof customVariable != "undefined" && customVariable.hasOwnProperty("data")){
                        if(row[this.field+EDITABLE_SUFFIX]){
                            return [
                                '<div data-type="select" data-update="false" data-editable="true" data-field="',this.field,'">',
                                '<select  class="form-control">',
                                options(customVariable.data),
                                '</select>',
                                '</div>'
                            ].join("");
                        }else{
                            return [
                                '<div data-type="select" data-editable="false" data-field="',this.field,'" class="form-group">',
                                '<select  class="form-control" disabled>',
                                options(customVariable.data),
                                '</select>',
                                '</div>'
                            ].join("");
                        }

                }else if(this.initData){
                    if(row[this.field+EDITABLE_SUFFIX]){
                        return [
                            '<div data-type="select" data-update="false" data-editable="true" data-field="',this.field,'">',
                            '<select  class="form-control">',
                            options(this.initData["data"]),
                            '</select>',
                            '</div>'
                        ].join("");
                    }else{
                        return [
                            '<div data-type="select" data-editable="false" data-field="',this.field,'" class="form-group">',
                            '<select  class="form-control" disabled>',
                            options(this.initData["data"]),
                            '</select>',
                            '</div>'
                        ].join("");
                    }
                }else{
                    return value;
                }


            },
            formatTableMultipleSelect : function(value,row,index){
                //row[this.field+DEFAULT_SUFFIX] = this.initData.defaultValue;
                var _value = $.isArray(value)?value:[value.toString()],
                    selected = function(option){
                        return $.inArray(option,_value)!=-1?'selected="selected"':'';
                    },
                    options = function(data){
                        var html = [];
                        $.each(data,function(index,item){
                            html.push('<option '+ selected(item["value"])+' value="'+item["value"]+'">'+item["text"]+'</option>');
                        })
                        return html;
                    }

                if(this.initData){
                    if(row[this.field+EDITABLE_SUFFIX]){
                        return [
                            '<div data-type="select2" data-update="false" data-editable="true" data-field="',this.field,'">',
                            '<select multiple="multiple" class="form-control">',
                            options(this.initData["data"]),
                            '</select>',
                            '</div>'
                        ].join("");
                    }else{
                        return [
                            '<div data-type="select2" data-editable="false" data-field="',this.field,'">',
                            '<select multiple="multiple" class="form-control" disabled>',
                            options(this.initData["data"]),
                            '</select>',
                            '</div>'
                        ].join("");
                    }
                }else{
                    return value;
                }


            },
            formatTableCheckbox : function(value,row,index){
                //暂不考虑多个复选框的情况，默认只有一个复选框
                var that = this,
                    _value = value.toString(),
                    selected = function(option){
                        return option == _value?"checked ":" ";
                    },
                    options = function(data,disabled){
                        var html = [];
                        $.each(data,function(index,item){
                            html.push('<div><input  type="checkbox" '+disabled+ selected(item["value"])+' value="'+item["value"]+'"><span>'+item["text"]+'</span></div>');
                        })
                        return html;
                    }

                if(this.initData){
                    if(row[this.field+EDITABLE_SUFFIX]){
                        if(!row[this.field+UPDATE_SUFFIX]){
                            var optionsData = this.initData.data,
                                isDefalut = true;//判断初次加载数据是否需要设置默认值
                            for(var i in optionsData){
                                if(optionsData[i].value == _value){
                                    isDefalut = false;
                                }
                            }
                            if(isDefalut){
                                row[this.field] = this.initData.defaultValue;
                            }

                        }
                        return [
                            '<div data-type="checkbox" data-update="false" data-editable="true" data-field="',that.field,'">',
                            options(this.initData["data"]," "),
                            '</div>'

                        ].join("");
                    }else{
                        return [
                            '<div data-type="checkbox" data-editable="false" data-field="',that.field,'" disabled>',
                            options(this.initData["data"]," disabled "),
                            '</div>'
                        ].join("");
                    }
                }else{
                    return value;
                }


                //if(this.initData && typeof this.initData.defaultValue !=="undefined"){
                //    row[this.field+DEFAULT_SUFFIX] = this.initData.defaultValue;
                //}
                //
                //var that = this,
                //    _value = $.isArray(value)?value:[value.toString()],
                //    selected = function(option){
                //        return $.inArray(option,_value)!=-1?"checked ":" ";
                //    },
                //    options = function(data){
                //        var html = ['<div data-type="checkbox" data-update="false" data-editable="true" data-field="',that.field,'">'];
                //        $.each(data,function(index,item){
                //            html.push('<div><input  type="checkbox" '+ selected(item["value"])+' value="'+item["value"]+'"><span>'+item["text"]+'</span></div>');
                //        })
                //        html.push('</div>');
                //        return html;
                //    }
                //
                //if(row[this.field+EDITABLE_SUFFIX]){
                //    return options(this.initData["data"]).join("");
                //}else{
                //    return [
                //        '<div data-type="checkbox" data-editable="false" data-field="',that.field,'">',
                //            value,
                //        '</div>'
                //    ].join("");
                //}

            }
        },
        FORMATTER_EVENTS = {
            'click div.operator>button.remove':function(e, value, row, index){
                var $this = $(this),
                    $table = $this.parents("table"),
                    pk = $this.data("pk"),
                    field = $this.data("field");
                bootbox.confirm("确认删除数据吗？", function(result){
                    if(!result) {
                        return;
                    }
                    if($table.bootstrapTable('getData').length === 1) {
                        bootbox.alert('不能删除最后一条记录。');
                        return;
                    }
                    $table.bootstrapTable('remove', {
                        field: field,
                        values: [pk]
                    });
                });
            },
            'click div.operator>button.plus':function(e, value, row, index){
                var $this = $(this),
                    $table = $this.parents("table"),
                    length = $table.bootstrapTable("getData").length,
                    pk = $this.data("pk"),
                    field = $this.data("field"),//默认是$id
                    columns = $table.bootstrapTable("getOptions").columns[0],
                    row = {};

                    $.each(columns,function(index,item){
                        if(item.field===field){
                            row[item.field] = length;
                        }else{
                            row[item.field] = typeof item.initData === "undefined"?"":item.initData.defaultValue;
                            row[item.field+EDITABLE_SUFFIX] = true;
                            row[item.field+VALIDATE_SUFFIX] = true;
                        }


                    })

                    //$table.bootstrapTable('append',[row]);
                $table.bootstrapTable('insertRow',{
                    index:index+1,
                    row:row
                })
            }
        },
        VALIDATE_MESSAGE = {
            digits:"请输入有效的数字",
            integer:"请输入有效的整数值",
            numeric:"请输入有效的数值，允许小数",
            notEmpty:"请输入有效的数值，允许小数"
        };


    //扩展默认属性
    $.extend($.fn.bootstrapTable.defaults, {
        editable: true,
        onEditableInit: function () {
            return false;
        },
        onEditableSave: function (field, row, oldValue, $el) {
            return false;
        }
    });

    //添加 方法 为默认方法
    $.merge($.fn.bootstrapTable.methods,[
        "getRealData","getUpdateData",
        "updateTableEditable","updateRemoteTableRows",
        "appendData","showTableColumns","hideTableColumns"
    ]);


    $.extend($.fn.bootstrapTable.Constructor.EVENTS, {
        'editable-init.bs.table': 'onEditableInit',
        'editable-save.bs.table': 'onEditableSave'
    });

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initTable = BootstrapTable.prototype.initTable,
        _initBody = BootstrapTable.prototype.initBody,
        _initData = BootstrapTable.prototype.initData;

    BootstrapTable.prototype.initTable = function () {
        var that = this;
        //重写initTable方法
        _initTable.apply(this, Array.prototype.slice.apply(arguments));
        //判断该表格是否是可编辑
        if (!this.options.editable) {
            return;
        }
        //新版本支持表格头内嵌列,二维数组 columns[0]
        $.each(this.options.columns[0], function (i, column) {
            var _formatter = column.formatter;
            //表格列字段样式
            if(_formatter === "operatorFormatter"){
                //设置表格组件
                var pk = that.options.pk,
                    field = pk[0];

                column.formatter = function(value,row,index){
                    var removeBtn = [
                                '<button class="btn btn-default btn-sm remove" data-field="',field,'" data-pk="',row[field],'">',
                                '<span class="glyphicon glyphicon-remove"></span>',
                                '</button>'
                        ].join(""),
                        addBtn = [
                            '<button class="btn btn-default btn-sm plus" data-field="',field,'" data-pk="',row[field],'" >',
                                '<span class="glyphicon glyphicon-plus"></span>',
                            '</button>'
                        ].join("");
                    return [
                        '<div class="btn-group operator">',
                            column.isAddBtn?addBtn:'',
                            removeBtn,
                        '</div>'
                    ].join('');
                };
                column.events = FORMATTER_EVENTS;
            }
            if (!column.editable) {
                return;
            }

            switch (_formatter){
                //可编辑文本框
                case 'formatTableText':
                    column.formatter = FORMATTER.formatTableText;
                    break;
                //可编辑单选下拉框
                case 'formatTableSelect':
                    column.formatter = FORMATTER.formatTableSelect;
                    break;
                //可编辑多选下拉框
                case 'formatTableMultipleSelect':
                    column.formatter = FORMATTER.formatTableMultipleSelect;
                    break;
                //可编辑多选框
                case 'formatTableCheckbox':
                    column.formatter = FORMATTER.formatTableCheckbox;
                    break;
            }
        });
    };

    BootstrapTable.prototype.initBody = function () {

        _initBody.apply(this, Array.prototype.slice.apply(arguments));

        var that = this,
            columns = this.options.columns[0];

        if (!this.options.editable) {
            return;
        }


        $.each(columns, function (i, column) {

            if (!column.editable) {
                return;
            }
            //设置可编辑字段自定义事件
            that.$body.find('div[data-field="'+column.field+'"]').each(function(){
                var $element = $(this),
                    index = $element.parents('tr[data-index]').data('index'),
                    type = $element.data("type"),
                    fieldName = $element.data("field"),
                    fieldValue = null;


                switch (type){
                    //文本框可验证
                    case 'text':
                        $element.find(":text").off("blur").on("blur",function(e) {
                            var args = Array.prototype.slice.call(arguments,1),
                                isOperator = args[0]?true:false,//判断是否是鼠标悬停在按钮上触发
                                $this = $(this),
                                msg = '',
                                valid = true,
                                fieldValue = $this.val();
                            if(!isOperator){
                                if (fieldName == column["field"] && column["validate"]) {
                                    switch (column.validate) {
                                        case "digits":
                                            /^\d+$/.test(fieldValue) ? valid = true : valid = false;
                                            msg = VALIDATE_MESSAGE[column.validate];
                                            break;
                                        case "integer":
                                            /^(?:-?(?:0|[1-9][0-9]*))$/.test(fieldValue) ? valid = true : valid = false;
                                            msg = VALIDATE_MESSAGE[column.validate];
                                            break;
                                        case "numeric":
                                            !isNaN(parseFloat(fieldValue)) && isFinite(fieldValue) ? valid = true : valid = false;
                                            msg = VALIDATE_MESSAGE[column.validate];
                                            break;
                                        case "notEmpty":
                                            $.trim(fieldValue) !== '' ? valid = true : valid = false;
                                            msg = VALIDATE_MESSAGE[column.validate];
                                            break;
                                        case "custom":
                                            /**
                                             * 提供用户自定义验证，自定义变量格式如下，message为验证不通过时的提示信息
                                             * var table$tablieid$field = {message:"" ,regex:/^\d+$/}
                                             */
                                            if(that.options.idTable && column.field){
                                                var customVariable = eval("table$"+that.options.idTable+"$"+column.field);
                                                if(customVariable && typeof customVariable.regex === "object"){
                                                    msg = customVariable.message;
                                                    customVariable.regex.test(fieldValue)?valid = true:valid = false;
                                                }else{
                                                    console.error("请填写正确的正则表达式，如/^(?:-?(?:0|[1-9][0-9]*))$/")
                                                    valid = false;
                                                }

                                            }else{
                                                valid = false;
                                                msg = "tableId不存在或则字段名称不存在!"
                                            }
                                            break;
                                    }
                                }

                                that.data[index][fieldName+VALIDATE_SUFFIX] = valid;

                                if (valid) {

                                    that.data[index][fieldName+UPDATE_SUFFIX] = true;

                                    $this.parent().removeClass("has-error");
                                    $this.next().text("");
                                    that.updateCell(
                                        {
                                            index: index,
                                            field: fieldName,
                                            value: fieldValue
                                        }
                                    )                               

                                } else {
                                    $this.parent().addClass("has-error");
                                    $this.next().text(msg);
                                    that.updateCell(
                                        {
                                            index: index,
                                            field: fieldName,
                                            value: ""
                                        }
                                    )
                                }
								
								//提供updateLocalTableCallback对外回调接口
								if(typeof updateLocalTableCallback === "function"){
									updateLocalTableCallback(that.options.idTable,index,column.field,that.getRealData()[index]);
								}

                            }

                        });
                        break;
                    case 'checkbox':
                        $element.off("change").on("change",function(e){
                            var checkboxs = $(this).find(":checkbox"),
                                results = [];
                            checkboxs.each(function(){
                                var $that = $(this);
                                if($that.is(":checked")){
                                    results.push($that.val());
                                }
                            })
                            fieldValue = results;

                            if(fieldValue.length==0){
                                fieldValue = [column["initData"]["defaultValue"]];
                            }


                            that.data[index][fieldName+UPDATE_SUFFIX] = true;

                            that.updateCell(
                                {
                                    index: index,
                                    field: fieldName,
                                    value: fieldValue
                                }
                            )
                        });
                        break;
                    case 'select':
                        $element.find("select").off("change").on("change",function(e){
                            fieldValue = $(this).val();

                            that.data[index][fieldName+UPDATE_SUFFIX] = true;


                            that.updateCell(
                                {
                                    index: index,
                                    field: fieldName,
                                    value: fieldValue
                                }
                            );
                        })
                        break;
                    case 'select2':
                        $element.find("select").select2().off("select2:select").on("select2:select", function (e) {
                            fieldValue = $(this).val();

                            that.data[index][fieldName+UPDATE_SUFFIX] = true;

                            that.updateCell(
                                {
                                    index: index,
                                    field: fieldName,
                                    value: fieldValue
                                }
                            )
                        }).off("select2:unselect").on("select2:unselect",function(e){
                            fieldValue = $(this).val();

                            that.data[index][fieldName+UPDATE_SUFFIX] = true;

                            that.updateCell(
                                {
                                    index: index,
                                    field: fieldName,
                                    value: fieldValue
                                }
                            )
                        })
                        break;
                }

            });
        });

        //鼠标移动隐藏操作列
        /*that.$body.find("tr").off("mouseover").on("mouseover",function(e){
            var $element = $(this),
                $operator = $element.find("button.plus");

                if($operator.hasClass("hidden")){
                    $operator.removeClass("hidden");
                }
        }).off("mouseout").on("mouseout",function(e){
            var $element = $(this),
                $operator = $element.find("button.plus");

            if(!$operator.hasClass("hidden")){
                $operator.addClass("hidden");
            }
        });*/

        that.$body.find("div.operator").off("mouseover").on("mouseover",function(e){
            var $tr = $(this).parents("tbody");
            $tr.find(":text").trigger("blur",true);
        })
    };


    BootstrapTable.prototype.initData = function (data, type) {
        _initData.apply(this, Array.prototype.slice.apply(arguments));
        var that = this,
            columns = this.options.columns[0];

        //封装数据，设置可编辑字段可编辑属性和验证属性判断
        if($.isEmptyObject(data)){
            return;
        }

        if(!this.options.editable){
            return;
        }
        $.each(columns, function (i, column) {

            if (!column.editable) {
                return;
            }
            var field = column.field,
                primarykey = column.primarykey?true:false,
                initData = column.initData;

            $.each(data,function(index,item){
                var value = item[field];
                if(($.trim(value)==="" || typeof value === "undefined") && typeof initData !=="undefined"){
                    item[field] = initData.defaultValue;
                }
                if(typeof item[field+EDITABLE_SUFFIX] === "undefined"){
                    item[field+EDITABLE_SUFFIX] = true;
                }
                item[field+VALIDATE_SUFFIX] = true;
                item[field+UPDATE_SUFFIX] = false;
                item[field+KEY_SUFFIX] = primarykey;
            })

        });
    }

    /**
     * 表格可编辑性设置
     * @param params{rowIndex,fieldName,editable}
     * @example
     *           $("#tableId").bootstrapTable("updateTableEditable",{
     *              rowIndex:1,
     *              fieldName:'name',
     *              editable:true
     *           })
     * 禁用所有属性不可编辑时只需要传入editable为false；禁用单独列不可编辑，需要传入fieldName和editable，只有在针对某一行不可编辑时才需要传入rowIndex。
     */
    BootstrapTable.prototype.updateTableEditable = function(params){

        if(!params.hasOwnProperty('editable')){
            return;
        }
        var data = this.data,
            length = data.length,
            editable = params.editable;
        //整个表格
        if(!params.hasOwnProperty('rowIndex')  && !params.hasOwnProperty("fieldName") && params.hasOwnProperty('editable')){

            for(var rowIndex = 0;rowIndex<length;rowIndex++){
                var row = data[rowIndex];
                for(var field in row){
                    if(field.endsWith(EDITABLE_SUFFIX)){
                        data[rowIndex][field] = editable;
                    }
                }
            }
        }
        //指定ROW
        if (params.hasOwnProperty('rowIndex')  && !params.hasOwnProperty("fieldName") && params.hasOwnProperty('editable') ) {
            var row = data[params.rowIndex];
            for(var filed in row){
                if(filed.endsWith(EDITABLE_SUFFIX)){
                    row[filed] = editable;
                }
            }
        }
        //指定COLUMN
        if (!params.hasOwnProperty('rowIndex')  && params.hasOwnProperty("fieldName") && params.hasOwnProperty('editable') ) {
            var
                fieldName = params.fieldName;
            for(var rowIndex = 0;rowIndex<length;rowIndex++){
                data[rowIndex][fieldName+EDITABLE_SUFFIX] = editable;
            }
        }
        //指定CELL
        if (params.hasOwnProperty('rowIndex')  && params.hasOwnProperty("fieldName") && params.hasOwnProperty('editable') ) {
            data[params.rowIndex][params.fieldName+EDITABLE_SUFFIX] = editable;
        }
        //
        this.initSort();
        this.initBody(true);
    }

    /**
     * 获得表格干净数据，去除掉editable标识
     * @returns {Array}
     */
    BootstrapTable.prototype.getRealData = function(){
        var data = this.data,
            realData = [],
            length = data.length;

            for(var rowIndex = 0;rowIndex<length;rowIndex++){
                var row = data[rowIndex],realRow = {};
                for(var field in row){
                    if(!field.endsWith(EDITABLE_SUFFIX) && !field.endsWith(VALIDATE_SUFFIX) && !field.endsWith(UPDATE_SUFFIX) && !field.endsWith(DEFAULT_SUFFIX) && !field.endsWith(KEY_SUFFIX)){
                        realRow[field] = row[field];
                    }
                }
                realData[rowIndex] = realRow;
            }

       return realData;
    }

    /**
     * 获取需要更新的数据
     * @returns {Array}
     */
    BootstrapTable.prototype.getUpdateData = function(){
        var that = this,
            data = this.data,
            updateData = [];

        for(var i=0;i<data.length;i++){
            var row = data[i],updateRow = {};
            var isUpdate = false;
            for(var field in row){
                if(!field.endsWith(EDITABLE_SUFFIX) && !field.endsWith(VALIDATE_SUFFIX) && !field.endsWith(UPDATE_SUFFIX) && !field.endsWith(DEFAULT_SUFFIX) && !field.endsWith(KEY_SUFFIX)){
                    //返回可编辑字段的行数据
//                    if(row[field+EDITABLE_SUFFIX]){
                        if(row[field+UPDATE_SUFFIX]){
                            isUpdate = true;

                        }

                        //解决复选框默认值得问题
                        if($.isArray(row[field])){
                            updateRow[field] = row[field].join(",");
                        }else{
                            updateRow[field] = row[field];
                        }
                }
            }
            if(isUpdate&&!$.isEmptyObject(updateRow)){
                updateData.push(updateRow);
            }
        }
        return updateData;
    }
    /**
     * 提供远程更新接口
     * @param tableName 数据库对应表名称
     * @param validate 自定义验证函数
     * @param success 自定义更新成功回调函数
     * @example $().bootstrapTable("updateRemoteTableRows",{
     *      tableName:"t_xt_user",      //optional
     *      validate:function({tableId:"local",data:data}){
     *          return {
     *              message:"",
     *              status:true/false
     *          }
     *      },  //optional
     *      success:function(){}        //optional
     * })
     */
    BootstrapTable.prototype.updateRemoteTableRows = function(params) {
        var id = this.options.idTable,
            tableName = "",
            validFunction = undefined,
            successCallback = undefined,
            args = arguments;
        if(!id){
            console.error("请在表单设计器中重新设计表!");
            return;
        }

        if(typeof params === "object"){

            if(params.hasOwnProperty("tableName")){
                tableName = params.tableName;
            }

            if(params.hasOwnProperty("validate")){
                validFunction = params.validate;
            }

            if(params.hasOwnProperty("success")){
                successCallback = params.success;
            }

        }else{
            tableName = args[0];
            validFunction = args[1];
            successCallback = args[2];
        }

        var validate = {message:"",status:true};
        var url = window.getTableOptions(id, "url");
        url = url.substring(0, url.indexOf("?"));


        var rows = this.getUpdateData();
        if(rows.length==0){

            bootbox.alert("没有可更新数据，请检查数据是否正确!")
            return;
        }



        var updaterows = [], commonColumns = [], keyColumns = [];
        var columns = window.getTableOptions(id, "columns");

        var isSplitColumn = (tableName && tableName.length != 0);

        $.each(columns, function(index, item) {
            if(item.primarykey == true) {
                keyColumns.push(item);
            }
            else {
                if(item.editable) {
                    commonColumns.push(item);
                }
            }
        });
        var datas = [];
        $.each(rows, function(index, item) {
            var columns = {}, conditions = [];
            $.each(commonColumns, function(index1, item1){
                if(item[item1.field] == undefined || item[item1.field] == "null") {
                    return true;
                }
                var cname = item1.field;
                if(isSplitColumn && cname.indexOf("$$") > -1) {
                    cname = cname.split("$$")[1];
                }
                columns[cname] = item[item1.field];
            });

            $.each(keyColumns, function(index1, item1){
                if(item[item1.field] == undefined) {
                    return true;
                }
                var condition = new window.QueryCondition();

                var cname = item1.field;
                if(isSplitColumn && cname.indexOf("$$") > -1) {
                    cname = cname.split("$$")[1];
                }
                conditions.push(condition.setCName(cname).setCompare("=").setValue(item[item1.field]));
            });
            if(conditions.length == 0) {
                console.error("updateRemoteTableRows conditions length is 0, please check data. ");
                return true;
            }
            datas.push({columns: columns, condition: window.generateCondition(conditions, "and")});
        });
        if(isSplitColumn) {
            url = url.substring(0, url.lastIndexOf("/")) + "/" + tableName;
        }

        if(validFunction && typeof validFunction === "function"){
            validate = validFunction({tableId:id,data:rows}) || {message:"自定义验证失败!",status:false};
        }

        if(validate.hasOwnProperty("message") && validate.hasOwnProperty("status")){
            if(validate.status){
                $.ajax({
                    type: "PUT",
                    url:  window.getMultiRowsOperatorUrl(url),
                    data: JSON.stringify({records:datas}),
                    contentType :'application/json; charset=UTF-8',
                    async: false,
                    success: function (data, textStatus) {
                        if(successCallback && typeof successCallback === "function"){
                            successCallback();
                        }else{
                            window.operatorCallBack(data, "数据更新成功。", "数据更新失败。");
                            setTimeout(function() {window.refreshTable(id)}, 500);
                        }

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        window.errorCallback(textStatus, errorThrown, url);
                    }
                });
            }else{
                bootbox.alert(validate.message);
            }
        }else{
            bootbox.alert("自定义验证函数返回格式错误，正确格式:{message:'',status:true/false}");
        }
    }

    /**
     * 加载到当前数据的末尾
     * @param data Array
     * @description 数据的可编辑性能生效的前提是数据对应字段具有可编辑性
     *                字段属性如下:
     *                columns:[
     *                  {
     *                      field:"age",
     *                      editable:true,
     *                      validate:"custom"
     *                  },
     *                  {
     *                      field:"ete",
     *                      editable:false,
     *                      validate:''
     *                  }
     *                ]
     * @example $().bootstrapTable("showTableColumns",
     *          [
     *              {
     *              age:{
     *                  value:111,
     *                  editable:false
     *                  }
     *              },
     *              {
     *                  aeta:14,
     *                  age:{value:14,editable:true},
     *                  ete:15,
     *                  test:{value:14,editable:false}
     *              }
     *          ]
     * )
     */
	 
	 BootstrapTable.prototype.appendData = function(data){


        var newData = data instanceof Array ? data :[data],
            oldDataLength = this.options.data.length;

        for(var i=0;i<newData.length;i++){
            var row = newData[i],
                _row = deepClone(row);
            for(var column in _row){
				
				if(_row[column] && _row[column].value){
					
					row[column] = _row[column].value
				}else{
					row[column] = _row[column]
				}
				
                //row[column] =typeof _row[column].value === "undefined"?_row[column]:_row[column].value;

                if(_row[column] && typeof _row[column].editable !== "undefined"){
                    row[column+EDITABLE_SUFFIX] = _row[column].editable;
                }

            }
            row["$id"] = oldDataLength+i;

        }
        this.append(newData);

    } 

    /**
     * @description 显示指定列
     * @param       field {}/[]
     * @example     $("#tableId").bootstrapTable("showTableColumns","name");
     * @example     $("#tableId").bootstrapTable("showTableColumns","operator"),
     *               $("#tableId").bootstrapTable("showTableColumns",["name","age","sex"]);
     */
    BootstrapTable.prototype.showTableColumns = function(field){
        var fields = field instanceof Array ? field : [field];
        for(var i=0;i<fields.length;i++){
            this.showColumn(fields[i]);
        }
    }

    /**
     * @description 隐藏指定列
     * @param       field {}/[]
     * @example     $("#tableId").bootstrapTable("hideTableColumns","name");
     *               $("#tableId").bootstrapTable("hideTableColumns",["name","age","sex"]);
     */
    BootstrapTable.prototype.hideTableColumns = function(field){
        var fields = field instanceof Array ? field : [field];
        for(var i=0;i<fields.length;i++){
            this.hideColumn(fields[i]);
        }
    }
}(jQuery,window);
