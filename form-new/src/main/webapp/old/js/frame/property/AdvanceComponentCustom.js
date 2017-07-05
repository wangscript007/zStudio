/**
 * 更新表格单元格
 * @param $table table jquery对象
 * @param index      行号
 * @param fieldName      字段名称
 * @param fieldValue  新值
 */
var updateTableCell = function ($table, index, fieldName, fieldValue) {
    $table.bootstrapTable("updateCell",
        {
            index: index,
            field: fieldName,
            value: fieldValue
        }
    )
}

var EDITABLE_SUFFIX = "-editable",//编辑常量
    TableConfigProperty = {};//通用表格类
//通用表格字段格式化
TableConfigProperty.FORMATTER = {
    //用于表格初始值字段样式呈现,通用本地表格、远程表格
    selectorInitFormatter: function (value, row, index) {
        var disabled = row["editable"] ? row["formatter"] ? "" : "disabled" : "disabled";
        return [
            '<button class="btn btn-default init-editable" ', disabled, ' data-field="', this.field, '" >',
            '初始值',
            '</button>'
        ].join("");
    },
    //用于表格验证字段样式呈现,通用本地表格、远程表格
    validateSelectFormatter: function (value, row, index) {
        var html = [];
        var disabled = row.editable ? row["formatter"] == "formatTableText" ? "" : "disabled" : "disabled";
        var selected = function (option) {
            return value === option ? "selected " : " ";
        }
        html.push('<select class="form-control form-combo" ' + disabled + ' data-field="' + this.field + '">');
        html.push('<option ' + selected('undefined') + ' value="undefined">无</option>');
        //html.push('<option '+selected('digits')+' value="digits">整数</option>');
        html.push('<option ' + selected('notEmpty') + ' value="notEmpty">非空</option>');
        html.push('<option ' + selected('integer') + ' value="integer">整数</option>');
        html.push('<option ' + selected('numeric') + ' value="numeric">有效数字</option>');
        html.push('<option ' + selected('custom') + ' value="custom">自定义</option>');
        html.push('</select>');
        return html.join("");
    }
}
//表格字段格式化自定义事件
TableConfigProperty.FORMATTEREVENTS = {
    //文本框change事件
    'change :text': function (e, value, row, index) {
        var $this = $(this),
            fieldName = $this.data("field"),
            fieldValue = $this.val(),
            $table = $this.parents("table");

        updateTableCell($table, index, fieldName, fieldValue);


    },
    //多选框click事件
    'click :checkbox': function (e, value, row, index) {
        var $this = $(this),
            fieldName = $this.data("field"),
            fieldValue = $this.is(":checked") ? true : false,
            $table = $this.parents("table");

        //表格"可编辑"字段
        if (fieldName === "editable" && !fieldValue) {

            row["editable"] = fieldValue;
            row["hide"] = false;
            row["validate"] = "";
            row["formatter"] = "",
                row["initData"] = {
                    defaultValue: "",
                    data: []
                };
            $table.bootstrapTable("updateRow", {
                index: index,
                row: row
            })
        } else {
            updateTableCell($table, index, fieldName, fieldValue);
        }


    },
    //下拉框change事件
    'change select': function (e, value, row, index) {
        var $this = $(this),
            fieldName = $this.data("field"),
            fieldValue = $this.find("option:selected").val(),
            $table = $this.parents("table");

        updateTableCell($table, index, fieldName, fieldValue);
    },
    //可编辑字段初始化设置,设置默认值
    'click .init-editable': function (e, value, row, index) {
        var $this = $(this),
            fieldName = $this.data("field"),
            $table = $this.parents("table"),

            _formatter = row["formatter"],
            _value = typeof value === "object" ? value : {defaultValue: "", data: []},
            message = '',
            $modal = $([
                '<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
                '<div class="modal-dialog">',
                '<div class="modal-content">',
                '<div class="modal-header">',
                '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>',
                '<h4 class="modal-title">',
                '可编辑初始化',
                '</h4>',
                '</div>',
                '<div class="modal-body">',

                '</div>',
                '<div class="modal-footer">',
                '<button type="button" class="btn btn-primary confirm-editable-btn">确定</button>',
                '</div>',
                '</div>',
                '</div>',
                '</div>',
            ].join(""));

        switch (_formatter) {
            case 'formatTableText':
                message = [
                    '<input class="form-control select-default" placeholder="初始值" value="', _value["defaultValue"], '">'
                ].join('');
                break;
            case 'formatTableMultipleSelect':
            case 'formatTableSelect':
            case 'formatTableCheckbox':
                message = [
                    '<div class="row">  ',
                    '<div class="col-md-12"> ',
                    '<div class="form-horizontal"> ',
                    '<div class="form-group"> ',
                    '<label class="col-md-2 control-label" for="select-default">默认值</label> ',
                    '<div class="col-md-4"> ',
                    '<input  name="select-default" type="text" placeholder="默认值" value="', _value["defaultValue"], '" class="form-control input-md select-default"> ',
                    '</div> ',

                    '</div> ',
                    '<div class="form-group"> ',
                    '<label class="col-md-2 control-label" for="select-text">选项名称</label> ',
                    '<div class="col-md-4"> ',
                    '<input  name="select-text" type="text" placeholder="显示名" class="form-control input-md select-text"> ',
                    '</div> ',
                    '<label class="col-md-2 control-label" for="select-value">选项值</label> ',
                    '<div class="col-md-4"> ',
                    '<input  name="select-value" type="text" placeholder="值" class="form-control input-md select-value"> ',
                    '</div> ',
                    '</div> ',
                    '<div class="form-group"> ',

                    '<div class="col-md-offset-10 col-md-2">',
                    '<button class="btn btn-danger addJson"><span class="glyphicon glyphicon-plus">添加</span></button>',
                    '</div>',
                    '</div> ',
                    '<div class="form-group"> ',
                    '<div class="col-md-12"> ',
                    '<table class="options-table"></table>',
                    //'<textarea  name="select-json" class="form-control select-json" rows="4"></textarea> ' ,
                    '</div> ',
                    '</div> ',
                    '</div>',
                    '</div>',
                    '</div>'
                ].join('');
                break;

        }

        var formatter = {
            textFormatter: function (value, row, index) {
                return '<input type="text" data-field="' + this.field + '" class="form-control" value="' + value + '" />';
            },
            deleteFormatter: function (value, row, index) {
                return [
                    '<a class="remove" href="javascript:void(0)" title="Remove">',
                    '<i class="glyphicon glyphicon-remove"></i>',
                    '</a>'
                ].join('');
            }
        }
        var events = {
            'change .form-textbox-text': function (e, value, row, index) {
                var $this = $(this),
                    fieldName = $this.data("field"),
                    fieldValue = $this.val(),
                    $table = $this.parents("table");

                updateTableCell($table, index, fieldName, fieldValue);

            },
            'click .remove': function (e, value, row, index) {
                var $table = $(this).parents("table");
                bootbox.confirm("确认删除数据吗？", function (result) {
                    if (!result) {
                        return;
                    }
                    $table.bootstrapTable('remove', {
                        field: 'value',
                        values: [row.value]
                    });
                })
            }
        }

        var columns = [
            {
                field: 'text',
                title: '选项名称',
                formatter: formatter.textFormatter,
                events: events
            },
            {
                field: 'value',
                title: '选项值',
                formatter: formatter.textFormatter,
                events: events
            },
            {
                field: 'delete',
                title: '删除',
                formatter: formatter.deleteFormatter,
                events: events
            }

        ];

        $modal.find(".modal-body").append(message);//.find(".select-json").text($.isEmptyObject(_value)?"":JSON.stringify(_value));

        var optionsTable = $modal.find("table.options-table");
        optionsTable.bootstrapTable({
            columns: columns,
            data: _value["data"]
        })
        $modal.find("button.addJson").off("click").on("click", function (event) {

            var text = $modal.find(".select-text").val(),
                value = $modal.find(".select-value").val();


            if (value) {
                _value["data"].push({
                    text: text,
                    value: value,
                })
                optionsTable.bootstrapTable("load", _value["data"]);
            } else {
                bootbox.alert("值不能为空")
            }


        });
        $modal.find("button.confirm-editable-btn").off("click").on("click", function (event) {
            var sValue = $modal.find(".select-default").val();
            if (_formatter == "formatTableText") {
                _value["data"][0] = sValue;
            }
            _value["defaultValue"] = sValue;
            updateTableCell($table, index, fieldName, _value);

            $modal.modal("hide");
        })
        $modal.modal("show");
    },
};
/**
 * 远程表格
 * @param componentObject  当前组件对象
 * @constructor
 */
var TableRemoteConfigProperty = function (componentObject) {
    this.componentObject = componentObject;
    this.options = $.extend({}, TableRemoteConfigProperty.DEFAULTS);

    this.showOrderModalBtnId = "btn_order_modal_" + getCurrentTime();
    this.showAdvanceModalBtnId = "btn_advance_modal_" + getCurrentTime();
    this.id = this.showAdvanceModalBtnId+","+this.showOrderModalBtnId;
    this.html = '';
}

TableRemoteConfigProperty.prototype = {
    constructor: TableRemoteConfigProperty,
    getHtml: function () {
        this.init();
        return this.html;
    },
    init: function () {
        this.initData();
        this.initHtml();
    },
    initHtml: function () {
        this.html = [
            '<div class="zte-panel">',
            '<div class="btn-group" id="toolbar">',
            '<button class="btn btn-default orderBtn" type="button" id="',this.showOrderModalBtnId,'">',
            '排序',
            '</button>',
            '<button class="btn btn-default advanceBtn" type="button" id="',this.showAdvanceModalBtnId,'">',
            '列定制',
            '</button>',
            '</div>',
            '</div>'
        ].join('');

        this.$advanceModal = $([
            '<div  class="modal fade" data-type="setting" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
            '<div class="modal-dialog" style="width:1200px">',
            '<div class="modal-content">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>',
            '<h4 class="modal-title">', '表格列设置', '</h4>',
            '</div>',
            '<div class="modal-body" style="height: auto">',
            '<div id="toolbar"  class="btn-group">',
            '<button class="btn btn-primary add"><span class="glyphicon glyphicon-plus"></span> 添加</button>',
            '<button class="btn btn-danger delete"><span class="glyphicon glyphicon-remove"></span> 删除</button>',
            '</div>',
            '<table></table>',
            '</div>',
            '<div class="modal-footer">',
            '<button type="button" class="btn btn-primary confirmBtn" id="confirmBtn">确定</button>',
            '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
        ].join(''));
        this.$advanceTable = this.$advanceModal.find("table");
        this.$confirmBtn = this.$advanceModal.find("button.confirmBtn");
        this.$addBtn = this.$advanceModal.find("button.add");
        this.$delBtn = this.$advanceModal.find("button.delete");

        this.$advanceModal.remove();
        $("body").append(this.$advanceModal);
    },
    initData: function () {
        var dataColumns = [],
            $componentObject = this.componentObject,
            dataField = $(this.componentObject).attr("dataField"),
            dataFieldsManage = new ComponentDataFieldsManage($componentObject,dataField),
            rows = [],
            orders = [],
            existsRows = [];

        if (dataFieldsManage.isSetDataSourceInfo()) {
            this.options.uri = dataFieldsManage.getUri();
            this.options.dsname = dataFieldsManage.getDataSourceName();
            dataColumns = dataFieldsManage.getDataColumns();
        }

        //获取列定制数据
        if ($componentObject.attr("rowdata") != undefined) {
            rows = existsRows = JSON.parse(decodeURIComponent($componentObject.attr("rowdata")));
            //对旧数据进行兼容性处理
            for(var i = 0;i<existsRows.length;i++){
                existsRows[i]["formatter"] = existsRows[i]["format"]?existsRows[i]["format"]:existsRows[i]["formatter"]?existsRows[i]["formatter"]:"";
                existsRows[i]["width"] = existsRows[i]["width"]?existsRows[i]["width"]:"";
            }

        }

        for (var i = 0; i < dataColumns.length; i++) {
            var isExists = false;
            //检测是否有新数据
            $.each(existsRows, function (index, value) {
                if (value.field == dataColumns[i].columnName) {
                    isExists = true;
                    return;
                }
            });
            if (!isExists) {
                rows.push({
                    $id:i,
                    title: dataColumns[i].displayName ? dataColumns[i].displayName : dataColumns[i].columnName,
                    field: dataColumns[i].columnName,
                    order: 'asc',
                    hide: false,
                    primarykey: false,
                    editable: false,
                    validate: '',
                    formatter: '',
                    width: '150',
                    defaultcondition: {checked: false, condition: '', value: ''},
                    searchcondition: {checked: false, condition: '', value: ''}
                });
            }
        }


        //获取排序数据
        if ($componentObject.attr("orders") != undefined) {
            orders = JSON.parse(decodeURIComponent($componentObject.attr("orders")));
        } else {
            orders = _.map(rows, function (order) {
                return {"state": false, "field": order.field, "order": order.order};
            });
        }

        this.options.dataColumns = dataColumns;
        this.options.advanceData = rows;
        this.options.orderData = orders;

    },
    setParameter : function(){

    },
    clear : function(){
        this.$advanceTable.bootstrapTable("destroy");
        this.$advanceModal.remove();
    },
    setProperty : function(event,currentPropertyID){
        if(event.type == "click"){
            this.initData();

            //打开排序Modal
            if(currentPropertyID == this.showOrderModalBtnId){
                this.$advanceModal.modal({
                    backdrop: "static",
                    show: true
                }).data("type", "order");
                //打开列定制Modal
            }else if(currentPropertyID == this.showAdvanceModalBtnId){
                this.$advanceModal.modal({
                    backdrop: "static",
                    show: true
                }).data("type", "setting");
            }
            this.onClickShowModal();
            this.initEvents();
        }
    },
    //初始化组件事件
    initEvents: function () {
        var that = this;
        //列定制Modal关闭事件
        that.$advanceModal.off("hidden.bs.modal").on("hidden.bs.modal", function (e) {
            that.clear();
        });
        //Modal确认按钮触发事件
        that.$confirmBtn.off("click").on('click', function (event) {
            that.onClickConfirmBtn();
        });

        that.$delBtn.off("click").on('click', function () {
            var ids = $.map(that.$advanceTable.bootstrapTable('getSelections'), function (row) {
                return row.$id;
            });

            that.$advanceTable.bootstrapTable('remove', {
                field: '$id',
                values: ids
            });
        });

        that.$addBtn.off("click").on('click', function () {
            var length = that.$advanceTable.bootstrapTable('getData').length;
            var rows = [];
            rows.push({
                $id:length,
                title: "",
                field: "",
                order: 'asc',
                hide: false,
                primarykey: false,
                editable: false,
                validate: '',
                formatter: '',
                width: '150',
                defaultcondition: {checked: false, condition: '', value: ''},
                searchcondition: {checked: false, condition: '', value: ''}
            });
            that.$advanceTable.bootstrapTable('append', rows);
        });

        //that.$applicationBtn.off("click").on('click', function (event) {
        //    that.onClickApplication(event);
        //});
    },
    //Show Modal 触发事件
    onClickShowModal: function () {
        var
            data = [],
            columns = [],
            $modal = this.$advanceModal,
            $modal_title = $modal.find('.modal-title'),
            $modal_dialog = $modal.find('.modal-dialog'),
            $modal_content = $modal.find('.modal-content'),
            type = $modal.data("type"),
            table_height = 550,
            table_body = "465px";

        if (type === "order") {
            //设置modal 样式
            $modal_dialog.css('width', '600px');
            //$modal_content.css('height',window.screen.height/3)
            //设置modal title
            $modal_title.text('表格排序');
            //获取columns定义
            columns = this.options.sortTableColumns;
            data = _.slice(this.options.orderData, 0, 5);
            table_height = 278;
            table_body = "240px";
        } else if (type === "setting") {
            $modal_dialog.css('width', '1200px');
            //$modal_content.css('height',window.screen.height/1.25)
            $modal_title.text('表格列设置');
            data = this.options.advanceData;
            columns = this.options.advanceTableColumns;
        }

        //初始化设置表格
        this.$advanceTable.bootstrapTable({
            data: data,
            columns: columns,
            reorderableRows:true,
            useRowAttrFunc:true,
            height:table_height
        });
        this.$advanceModal.find('.fixed-table-body').css('height', table_body);
    },
    onClickConfirmBtn: function () {
        var that = this,
            data = this.$advanceTable.bootstrapTable("getData"),
            type = this.$advanceModal.data("type"),
            valid = true,
            editable = false,
            message = "";

        if (type === "order") {
            that.options.orderData = data;
            //保存自定义排序信息 orders 属性
            that.componentObject.attr('orders', encodeURIComponent(JSON.stringify(data)));
        } else if (type === "setting") {

            $.each(data, function (index, item) {
                //判断该字段是否可编辑
                if (item["editable"]) {
                    editable = true;
                    //可编辑字段必须选择格式化类型
                    if (!item["formatter"]) {
                        valid = false;
                        message = "请选择格式化!";
                        return false;
                    }
                    //对初始化数据进行非空处理
                    if (item["formatter"] !== "formatTableText") {
                        if (item["initData"] && _.isEmpty(item["initData"]["data"])) {
                            valid = false;
                            message = "请初始化值!";
                            return false;
                        }
                    }
                }
                //设置主键信息
                if (item["primarykey"]) {
                    that.options.pk.push(item["field"]);
                }
            });
            //可编辑表格必须选择主键
            if (editable && $.isEmptyObject(that.options.pk)) {
                valid = false;
                message = "请至少选择一个主键!";
            }

            if (!valid) {
                bootbox.alert(message);
                return;
            }
            that.options.advanceData = data;
            //保存列定制信息到 rowdata 字段
            that.componentObject.attr('rowdata', encodeURIComponent(JSON.stringify(that.options.advanceData)));
        }

        this.onClickApplication();
        this.$advanceModal.modal("hide");
    },
    //根据定制信息重绘表格，并验证
    onClickApplication: function () {
        var that = this,
            data = this.options.advanceData,
            isPrimary = false,
            isModal = false,
            isDelOrMod = false,
            $toolbar = $("input[name=tabletoolbar]");

        $.each($toolbar, function (index, item) {
            if ($(item).is(":checked") && ($(item).val() === "modify" || $(item).val() === "del")) {
                isDelOrMod = true;
                return;
            }
        })

        if ($("#tablemodel").find("option:selected").val() != "none") {
            isModal = true;
        }
        $.each(data, function (index, item) {
            if (item["primarykey"]) {
                isPrimary = true;
                return;
            }
        })


        if (isDelOrMod && !isPrimary) {
            bootbox.alert("请在列定制中选择主键,可以选多个!");
            return;
        }

        if (isDelOrMod && !isModal) {
            bootbox.alert("请在属性中选择表格模式为多选或者单选!");
            return;
        }

        that.generatorTable();
    },
    //重绘表格
    generatorTable: function () {
        var that = this,
            tableid = that.componentObject.attr("compid"),
            pageSize = that.componentObject.attr("pagesize"),
            dataField = that.componentObject.attr("dataField"),
            totalRowsField = that.componentObject.attr("totalRowsField"),
            columns = that.getTableColumns();
        if (columns.length == 0) {
            bootbox.alert("请选择字段!");
            return;
        }

        var queryColumns = new Array();
        that.componentObject.empty();
        $.each(columns, function (index, value) {
            if (value.field == "state_form_disabled") {
                return true;
            }

            var isFieldExist = false;
            for (var i = 0; i < queryColumns.length; i++) {
                if (queryColumns[i].cname === value.field) {
                    isFieldExist = true;
                    break;
                }
            }

            if (!isFieldExist) {
                queryColumns.push({cname: value.field});
            }
        });
        var conditions = [];
        var searchConditions = [];


        var toolbar = that.getToolBar(tableid);
        var table = '<table id="' + tableid + '"></table>';

        that.componentObject.append(toolbar.join(" "));
        that.componentObject.append(table);

        var rows = that.options.advanceData;
        $.each(rows, function (index, item) {
            //if(item.primarykey){
            //	uniqueId = item.field;
            //}
            if (item["defaultcondition"]["checked"]) {
                var condition = new QueryCondition();
                condition.setCName(item["field"]);
                if (item["defaultcondition"]["condition"] === "like") {
                    condition.setValue("%" + item["defaultcondition"]["value"] + "%");
                } else {
                    condition.setValue(item["defaultcondition"]["value"]);
                }
                condition.setCompare(item["defaultcondition"]["condition"]);
                conditions.push(condition);
            }
            if (item["searchcondition"]["checked"]) {
                var condition = {};
                condition.title = item["title"];
                condition.field = item["field"];
                condition.condition = item["searchcondition"]["condition"];
                searchConditions.push(condition);
            }

        })

        var orders = this.options.orderData;
        orders = _.chain(orders).
            filter(function (order) {
                return order.state == true;
            })
            .map(function (order) {
                return {"field": order.field, "order": order.order};
            }).value();
        var paramsObj = {};
        paramsObj.columns = queryColumns;
        paramsObj.orders = orders;
        //禁用默认查询条件，后期开放
        paramsObj.condition = generateCondition(conditions, "and");
        var params = "?param=" + encodeURIComponent(JSON.stringify(paramsObj));

        //是否隐藏单选框或者多选框
        var hidebox = $("#hidebox").find("option:selected").val();
        var tablemodal = $("#tablemodel").find("option:selected").val();


        var param = {
            method: 'get',
            contentType : null,
            url: getOperatorURL(this.options.dsname, this.options.uri) + params,
            cache: false,
            toolbar: $.isEmptyObject(toolbar) ? undefined : '#' + tableid + 'toolbar',
            //checkboxHeader:false,
            //striped: true,
            pagination: true,
            pageSize: pageSize,
            pageList: [10, 20, 50, 100, 200],
            dataField:dataField,
            totalRowsField:totalRowsField,
            height: $("#tableheight").val() ? $("#tableheight").val() : 500,
            search: false,
            showColumns: false,
            selectItemName: 'btSelectItem'+tableid,
            //resizable:true,
            showRefresh: false,
            sidePagination: 'server',
            //uniqueId:uniqueId,
            sortable: true,
            clickToSelect: tablemodal != "none" && hidebox === "true" ? true : false,
            //rowStyle:"rowStyle",
            //search:true,
            advancedSearch: searchConditions.length == 0 ? false : true,
            searchcondition: searchConditions,
            idTable:tableid,
            defaultcondition:conditions,
            responseHandler:"tableResponseHandler",
            pk: that.options.pk,
            editable: true,
            columns: columns
        };

        $("#" + tableid).bootstrapTable(param).on('load-success.bs.table', function () {
            if (param["clickToSelect"]) {
                $(this).find(".bs-checkbox").addClass("hide");
            }
        });
        that.componentObject.attr('rowdata', encodeURIComponent(JSON.stringify(that.options.advanceData)));
        that.componentObject.attr("parameter", encodeURIComponent(JSON.stringify(param)));
        that.componentObject.attr("toobarhtml", encodeURI(toolbar.join(" ")));
        that.componentObject.attr("querycolumns", encodeURIComponent(JSON.stringify({columns: queryColumns})));
    },
    getTableColumns: function () {
        var that = this,
            data = this.options.advanceData,
            columns = new Array(),
            align = that.componentObject.attr("tablecolumnalign"),
            halign = that.componentObject.attr("tableheaderalign"),
            tablemodel = that.componentObject.attr("tablemodel");
        if (tablemodel == "radiotable") {
            columns.push({field: 'state_form_disabled', radio: true});
        }
        else if (tablemodel == "checkboxtable") {
            columns.push({field: 'state_form_disabled', checkbox: true});
        }


        $.each(data, function (index, item) {
            var state = item["state"];
            if (state != undefined) {
                if (state) {
                    columns.push(
                        {
                            title: item["title"],
                            field: item["field"],
                            width: item["width"] ? item["width"] : "150",
                            editable: item["editable"] ? item["editable"] : false,
                            validate: item["editable"] ? item["validate"] : '',
                            initData: item["initData"],
                            align: align,
                            halign: halign,
                            valign:"middle",
                            primarykey: item["primarykey"],
                            visible: item["hide"] ? false : true,
                            formatter: item["formatter"],
                            tableId: that.componentObject.attr("compid"),
                            defaultcondition:item["defaultcondition"],
                            searchcondition: item["searchcondition"]
                        }
                    )
                }
            }
        });
        return columns;
    },
    getToolBar: function (tableid) {
        var that = this,
            tabletoolbar = that.componentObject.attr("tabletoolbar"),
            customToolBar = that.componentObject.attr("options");
        if (customToolBar) {
            customToolBar = JSON.parse(decodeURIComponent(customToolBar));
        } else {
            customToolBar = new Object();
        }

        if (tabletoolbar) {
            tabletoolbar = JSON.parse(decodeURIComponent(tabletoolbar));
        }
        var toolbars = new Array();

        /*if (tabletoolbar.add == "checked") {
            toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'新建\', \'' + $("#formuri").val() + '\')" id="' + tableid + 'AddBtn"> 新建</button>');
        }
        if (tabletoolbar.modify == "checked") {
            toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'修改\', \'' + $("#formuri").val() + '\')" id="' + tableid + 'ModifyBtn"> 修改</button>');
        }
        if (tabletoolbar.del == "checked") {
            toolbars.push('<button type="button" class="btn btn-primary" onclick="deleteServerTableRows(\'' + tableid + '\')" id="' + tableid + 'DeleteBtn"> 删除</button>');
        }
        if (tabletoolbar.refresh == "checked") {
            toolbars.push('<button type="button" class="btn btn-primary" onclick="refreshTable(\'' + tableid + '\')" id="' + tableid + 'RefreshBtn"> 刷新</button>');
        }*/


        if (!$.isEmptyObject(customToolBar)) {
            $.each(customToolBar, function (indec, item) {
                toolbars.push('<button type="button" class="btn btn-primary" onclick="' + item["clickfunction"].replace(/\"/g, "'") + '" id="btn' + getCurrentTime() + '"> ');
                toolbars.push(' <span class="' + item["icon"] + '" aria-hidden="true"></span>' + item["title"] + '</button>');
            })
        }
        if (toolbars.length > 0) {

            toolbars.push('<div class="modal fade" tabindex="-1" role="dialog" id="' + tableid + 'modal" aria-labelledby="myLargeModalLabel">');
            toolbars.push('<div class="modal-dialog modal-lg">');
            toolbars.push('<div class="modal-content">');
            toolbars.push('<div class="modal-header">');
            toolbars.push('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            toolbars.push('<h4 class="modal-title" id="gridSystemModalLabel"></h4>');
            toolbars.push('</div>');
            toolbars.push('<div class="modal-body">');
            toolbars.push('</div>');
            toolbars.push('<div class="modal-footer">');
            toolbars.push('</div>');
            toolbars.push('</div>');
            toolbars.push('</div>');
            toolbars.push('</div>');


        }

        if (!$.isEmptyObject(customToolBar) || toolbars.length > 0) {
            toolbars.unshift('<div id="' + tableid + 'toolbar" class="btn-group">');
            toolbars.push('</div>');
        }


        return toolbars;
    }

}
//远程表格格式化
TableRemoteConfigProperty.FORMATTER = {
    /**
     * 文本格式化
     * @param value
     * @param row
     * @param index
     * @returns {string}
     */
    textFormatter: function (value, row, index) {
        return '<input type="text" data-field="' + this.field + '" class="form-control" value="' + (value?value:"") + '" />';
    },

    textFixFormatter: function (value, row, index) {
        return '<input type="text" data-field="' + this.field + '" class="form-control fix-col-small" value="' + value + '" />';
    },
    selectorFormatter: function (value, row, index) {
        var html = [];
        var selected = function (option) {
            return value === option ? "selected " : " ";
        }
        if (row["editable"]) {
            html.push('<select class="form-control form-combo"  data-field="' + this.field + '">');
            html.push('<option value="">请选择</option>');
            html.push('<option ' + selected('formatTableText') + ' value="formatTableText">文本框</option>');
            html.push('<option ' + selected('formatTableCheckbox') + ' value="formatTableCheckbox">复选框</option>');
            html.push('<option ' + selected('formatTableSelect') + ' value="formatTableSelect">单选下拉框</option>');
            html.push('<option ' + selected('formatTableMultipleSelect') + ' value="formatTableMultipleSelect">多选下拉框</option>');
            html.push('</select>');
        } else {
            html.push('<input type="text" data-field="' + this.field + '" class="form-control fix-col-width" value="' + value + '" />')
        }

        return html.join("");
    },

    /**
     * 绑定字段格式化
     * @param value
     * @param row
     * @param index
     * @returns {string}
     */
    bindFieldFormatter: function (value, row, index) {
        var html = [];
        html.push('<select class="form-control form-combo" data-field="field">');
        html.push(bindField2($("#" + tagComponent.attr("compid")).parents("div[type]:first"), value));
        html.push('</select>');
        return html.join("");
    },

    /**
     * 单选框格式化
     * @param value
     * @param row
     * @param index
     * @returns {string}
     */
    inputRadioFormatter: function (value, row, index) {
        var checked = value ? "checked" : "";
        return '<input type="radio" data-field="' + this.field + '" name="' + this.field + '" ' + checked + ' value="' + value + '"/>';
    },

    /**
     * 多选框格式化
     * @param value
     * @param row
     * @param index
     * @returns {string}
     */
    checkboxFormatter: function (value, row, index) {
        var checked = value ? "checked" : "",
            value = value ? value : 'false',
            field = this.field,
            disabled = "";
        //编辑为true时，隐藏和主键不可用;反之亦然
        if ((row["editable"] && (field === "hide" || field === "primarykey")) || ((row["hide"] || row["primarykey"]) && field === "editable" )) {
            disabled = "disabled";
        }
        return '<input type="checkbox" ' + disabled + ' data-field="' + field + '" name="' + field + '" ' + checked + ' value="' + value + '"/>';
    },

    /**
     * 升序降序格式化
     * @param value
     * @param row
     * @param index
     * @returns {*}
     */
    columnAscOrDescFormatter: function (value, row, index) {
        var selected = function (value, optionvalue) {
            return value === optionvalue ? "selected" : "";
        }
        return [
            '<select class="form-control form-combo" data-field="order">',
            '<option value="asc"', selected(value, "asc"), '>升序</option>',
            '<option value="desc"', selected(value, "desc"), '>降序</option>',
            '</select>'
        ].join("");
    },

    /**
     * 默认条件格式化
     * @param value
     * @param row
     * @param index
     * @returns {string}
     */
    defaultConditionFormatter: function (value, row, index) {
        var html = [];
        var checked = value["checked"] ? "checked" : "";
        var checkbox_value = value["checked"] ? true : false;
        var disabled = checkbox_value ? "" : "disabled";
        var selected = function (value, selected) {
            return value["condition"] === selected ? "selected" : "";
        }
        var input_value = value["value"] ? value["value"] : "";
        html.push('<div data-field="defaultcondition" style="width:140px">');
        html.push('<span style="float:left;margin:5px"><input type="checkbox" ' + checked + ' value="' + checkbox_value + '" /></span>')
        html.push('<span>');
        html.push('<select class="form-control form-combo" style="width:45px" ' + disabled + '>');
        html.push('<option ' + selected(value, "undefined") + ' value="undefined">请选择</option>');
        html.push('<option ' + selected(value, ">") + ' value=">">&gt;</option>');
        html.push('<option ' + selected(value, "<") + ' value="<">&lt;</option>');
        html.push('<option ' + selected(value, ">=") + ' value=">=">&gt;=</option>');
        html.push('<option ' + selected(value, "<=") + ' value="<=">&lt;=</option>');
        html.push('<option ' + selected(value, "=") + ' value="=">=</option>');
        html.push('<option ' + selected(value, "like") + ' value="like">like</option>');
        html.push('</select>')
        html.push('<input class="form-control" style="width:70px" type="text" value="' + input_value + '" ' + disabled + '/>');
        html.push("</span>");
        html.push('</div>')
        return html.join("");
    },
    /**
     * 查询条件格式化
     * @param value
     * @param row
     * @param index
     * @returns {string}
     */
    searchConditionFormatter: function (value, row, index) {
        var html = [];
        var checked = value["checked"] ? "checked" : "";
        var checkbox_value = value["checked"] ? true : false;
        var disabled = checkbox_value ? "" : "disabled";
        var selected = function (value, selected) {
            return value["condition"] === selected ? "selected" : "";
        }
        var input_value = value["value"] ? value["value"] : "";
        html.push('<div data-field="searchcondition" style="width:75px">');
        html.push('<span style="float:left;margin:5px"><input type="checkbox" ' + checked + ' value="' + checkbox_value + '" /></span>')
        html.push('<span>');
        html.push('<select class="form-control form-combo" style="width:45px" ' + disabled + '>');
        html.push('<option ' + selected(value, "undefined") + ' value="undefined">请选择</option>');
        html.push('<option ' + selected(value, ">") + ' value=">">&gt;</option>');
        html.push('<option ' + selected(value, "<") + ' value="<">&lt;</option>');
        html.push('<option ' + selected(value, ">=") + ' value=">=">&gt;=</option>');
        html.push('<option ' + selected(value, "<=") + ' value="<=">&lt;=</option>');
        html.push('<option ' + selected(value, "=") + ' value="=">=</option>');
        html.push('<option ' + selected(value, "like") + ' value="like">like</option>');
        html.push('</select>')
        html.push("</span>");
        html.push('</div>')
        return html.join("");
    }
}
//远程表格自定义格式化事件
TableRemoteConfigProperty.FORMATTEREVENTS = {
    'click div[data-field="defaultcondition"]>span>input[type="checkbox"],div[data-field="searchcondition"]>span>input[type="checkbox"]': function (e, value, row, index) {
        var $this = $(this),
            checked = $this.is(":checked"),
            fieldName = $this.parents('div[data-field]').data("field"),
            fieldValue = {},
            table = $this.parents("table");

        fieldValue["checked"] = checked;
        fieldValue["condition"] = 'undefined';
        fieldValue["value"] = '';

        updateTableCell(table, index, fieldName, fieldValue);
    },
    'change div[data-field="defaultcondition"]>span>select,div[data-field="searchcondition"]>span>select': function (e, value, row, index) {
        var $this = $(this),
            fieldName = $this.parents('div[data-field]').data("field"),
            fieldValue = {},
            checked = value["checked"] ? true : false,
            table = $this.parents("table");

        fieldValue["checked"] = checked;
        fieldValue["condition"] = $this.find("option:selected").val();
        fieldValue["value"] = $this.next().val();

        updateTableCell(table, index, fieldName, fieldValue);
    },
    'change div[data-field="defaultcondition"]>span>input[type="text"]': function (e, value, row, index) {
        var $this = $(this),
            fieldName = $this.parents('div[data-field]').data("field"),
            fieldValue = {},
            checked = value["checked"] ? true : false,
            table = $this.parents("table");

        fieldValue["checked"] = checked;
        fieldValue["condition"] = $this.prev().find("option:selected").val();
        fieldValue["value"] = $this.val();

        updateTableCell(table, index, fieldName, fieldValue);
    }
}
//远程表格默认数据
TableRemoteConfigProperty.DEFAULTS = {
    uri: undefined,              //数据源URI
    dsname: undefined,           //数据源名称
    orderData: [],                //表格排序数据
    advanceData: [],              //表格列定制数据
    dataColumns: [],              //数据源返回数据,
    pk: [],							//主键,可能有多个
    sortTableColumns: [              //排序表字段
        {
            field: 'state',
            checkbox: true
        },
        {
            field: 'field',
            title: '字段',
            formatter: TableRemoteConfigProperty.FORMATTER.bindFieldFormatter,
            events: TableConfigProperty.FORMATTEREVENTS
        },
        {
            field: 'order',
            title: '排序',
            visible: true,
            formatter: TableRemoteConfigProperty.FORMATTER.columnAscOrDescFormatter,
            events: TableConfigProperty.FORMATTEREVENTS
        }
    ],
    advanceTableColumns: [               //列定制表字段
        [
            {
                field: 'state',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                checkbox: true
            },
            {
                field: '$id',
                title: '序号',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                visible: false
            },
            {
                field: 'title',
                title: '标题',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                formatter: TableRemoteConfigProperty.FORMATTER.textFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'field',
                title: '字段',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                formatter: TableRemoteConfigProperty.FORMATTER.bindFieldFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'order',
                title: '排序',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                visible: false,
                formatter: TableRemoteConfigProperty.FORMATTER.columnAscOrDescFormatter,
                events: TableRemoteConfigProperty.FORMATTEREVENTS
            },
            {
                title: '可编辑',
                colspan: 4,
                align: 'center'
            },
            {
                field: 'hide',
                title: '隐藏',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                formatter: TableRemoteConfigProperty.FORMATTER.checkboxFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'primarykey',
                title: '主键',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                formatter: TableRemoteConfigProperty.FORMATTER.checkboxFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'width',
                title: '宽度',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                formatter: TableRemoteConfigProperty.FORMATTER.textFixFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            /*{
                field: 'defaultcondition',
                title: '默认条件',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                formatter: TableRemoteConfigProperty.FORMATTER.defaultConditionFormatter,
                events: TableRemoteConfigProperty.FORMATTEREVENTS
            },*/
            {
                field: 'searchcondition',
                title: '查询条件',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                formatter: TableRemoteConfigProperty.FORMATTER.searchConditionFormatter,
                events: TableRemoteConfigProperty.FORMATTEREVENTS
            }

        ],
        [
            {
                field: 'editable',
                title: '编辑',
                align: 'center',
                formatter: TableRemoteConfigProperty.FORMATTER.checkboxFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'formatter',
                title: '格式化',
                align: 'center',
                formatter: TableRemoteConfigProperty.FORMATTER.selectorFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'validate',
                title: '验证类型',
                align: 'center',
                formatter: TableConfigProperty.FORMATTER.validateSelectFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'initData',
                title: '初始值',
                align: 'center',
                formatter: TableConfigProperty.FORMATTER.selectorInitFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            }
        ]

    ]
}
/**
 * 本地表格
 * @param componentObject  当前组件对象
 * @constructor
 */
var TableLocalConfigProperty = function(componentObject){
    this.componentObject = componentObject;
    this.options = $.extend({}, TableLocalConfigProperty.DEFAULTS);
    this.suffix = getCurrentTime();
    this.showModalBtnId = "btn_modal_"+this.suffix;
    this.id = this.showModalBtnId;
    this.html = '';
}
TableLocalConfigProperty.prototype = {
    constructor: TableLocalConfigProperty,
    getHtml: function () {
        this.init();
        return this.html;
    },
    init: function () {
        this.initData();
        this.initHtml();
    },
    initData: function () {
        var rowData = this.componentObject.attr("rowdata");
        if (rowData) {
            this.options.data = JSON.parse(decodeURIComponent(rowData));
        }
        else {
            var dataFieldsManage = new ComponentDataFieldsManage(this.componentObject),
                rows = [],
                dataColumns = [];
            if (dataFieldsManage.isSetDataSourceInfo()) {
                dataColumns = dataFieldsManage.getDataColumns();
            }
            for (var i = 0; i < dataColumns.length; i++) {
                rows.push({
                    state: false,
                    $id: length,
                    title: dataColumns[i].displayName ? dataColumns[i].displayName : dataColumns[i].columnName,
                    field: dataColumns[i].columnName,
                    formatter: "",
                    width:"150",
                    initData: {
                        defaultValue: "",
                        data: []
                    },
                    editable: false,
                    hide: false
                })
            }
            rows.push(TableLocalConfigProperty.DEFAULTS.data[0]);
            this.options.data = rows;
        }
    },
    initHtml: function () {
        this.html = [
            '<div class="zte-panel">',
            '<button class="btn btn-default" type="button" id="', this.showModalBtnId, '">列定制</button>',
            '</div>'
        ].join("");
    },
    clear: function () {
        this.$advanceTable.bootstrapTable('destroy');
        this.$advanceModal.remove();
    },
    setProperty: function (event, currentPropertyID) {
        if (event.type == "click") {
            if (currentPropertyID == this.showModalBtnId) {
                this.$advanceModal = $([
                    '<div  class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
                    '<div class="modal-dialog" style="width:1200px" id="localTableSettingDialog">',
                    '<div class="modal-content">',
                    '<div class="modal-header">',
                    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>',
                    '<h4 class="modal-title">表格列设置</h4>',
                    '</div>',
                    '<div class="modal-body" style="height: auto">',
                    '<div id="toolbar"  class="btn-group">',
                    '<button class="btn btn-primary add"><span class="glyphicon glyphicon-plus"></span> 添加</button>',
                    '<button class="btn btn-danger delete"><span class="glyphicon glyphicon-remove"></span> 删除</button>',
                    '</div>',
                    '<table class="advance"></table>',
                    '</div>',
                    '<div class="modal-footer">',
                    '<button type="button" class="btn btn-primary confirm">确定</button>',
                    '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</div>',
                ].join(""));
                this.$showAdvanceModalBtn = $("#" + this.showModalBtnId);
                this.$advanceTable = this.$advanceModal.find("table");
                this.$addBtn = this.$advanceModal.find("button.add");
                this.$delBtn = this.$advanceModal.find("button.delete");
                this.$confirmBtn = this.$advanceModal.find("button.confirm");
                $("body").append(this.$advanceModal);

                this.initEvents();

                this.$advanceModal.modal({
                    backdrop: "static",
                    show: true
                });
            }
        }
    },
    initEvents: function () {
        var that = this;

        that.$advanceModal.off("show.bs.modal").on("show.bs.modal", function () {

            that.$advanceTable.bootstrapTable({
                columns: that.options.advanceTableColumns,
                data: that.options.data,
                reorderableRows:true,
                useRowAttrFunc:true,
                height: 550
            })
            $("#localTableSettingDialog").find('.fixed-table-body').css('height', '465px');
        }).off("hidden.bs.modal").on("hidden.bs.modal", function () {
            that.clear();
        });

        that.$delBtn.off("click").on('click', function () {
            var ids = $.map(that.$advanceTable.bootstrapTable('getSelections'), function (row) {
                return row.$id;
            });

            that.$advanceTable.bootstrapTable('remove', {
                field: '$id',
                values: ids
            });
        });

        that.$addBtn.off("click").on('click', function () {
            var length = that.$advanceTable.bootstrapTable('getData').length;
            var rows = [];
            rows.push({
                state: true,
                $id: length,
                title: "",
                field: "",
                formatter: "",
                width: "150",
                initData: {
                    defaultValue: "",
                    data: []
                },
                editable: false,
                hide: false

            });
            that.$advanceTable.bootstrapTable('prepend', rows);
        });

        that.$confirmBtn.off('click').on('click', function () {

            if (that.validateTable()) {
                that.options.data = that.$advanceTable.bootstrapTable('getData');
                that.$advanceModal.modal('hide');
                that.setParameter();
            }

        });
    },
    validateTable: function () {
        var data = this.$advanceTable.bootstrapTable('getData'),
            valid = true,
            message = "";

        if(data.length === 0) {
            valid = false;
            message = '请设置本地表格列';
        }
        else {
            $.each(data, function (index, item) {
                if (item["state"]) {
                    if (!item["title"] || !item["field"]) {
                        message = "标题或者字段不能为空";
                        valid = false;
                        return false;
                    }
                    if (item["editable"]) {
                        if (!item["formatter"]) {
                            valid = false;
                            message = "请选择格式化";
                            return false;
                        }
                        if (item["formatter"] !== "formatTableText") {
                            if (item["initData"] && _.isEmpty(item["initData"]["data"])) {
                                valid = false;
                                message = "请设置初始化值";
                                return false;
                            }
                        }
                    }
                }
            })
        }
        if (!valid) {
            bootbox.alert(message);
        }
        return valid;
    },
    setParameter: function () {
        var that = this,
            $table = that.$advanceTable,
            data = $table.bootstrapTable('getData'),
            columns = new Array(),
            initData = new Object(),
            editable = false,
            isAddBtn = that.componentObject.attr("isAddBtn"), //操作列是否支持添加按钮，默认支持删除按钮
            tableModel = that.componentObject.attr("tablemodel"),
            pageSize = that.componentObject.attr("pagesize"),
            compId = that.componentObject.attr("compid"),
            formFields = "",//用于存放表格列字段，在form表单模型中包含表格时，需要用此字段来生成vm模型属性。
            uriPath = (new VMDataFieldsManage(that.componentObject)).getURIPath();//数据源路径

        that.componentObject.attr('rowdata', encodeURIComponent(JSON.stringify(data)));
        that.componentObject.empty();
        that.componentObject.append('<table id="' + compId + '"></table>');

        if (tableModel == "radiotable") {
            columns.push({field: 'state_form_disabled', radio: true});
        }
        else if (tableModel == "checkboxtable") {
            columns.push({field: 'state_form_disabled', checkbox: true});
        }

        columns.push(
            {
                field: '$id',
                visible: false,
                title: 'ID',
                width: 50,
                'class': 'td-word-wrap'
            }
        )
        $.each(data, function (index, item) {
            var state = item["state"];
            if (state) {
                if (item["editable"]) {
                    editable = true;
                }
                if (item["field"] === "operator") {
                    columns.push(
                        {
                            field: item["field"],
                            title: item["title"],
                            formatter: "operatorFormatter",
                            isAddBtn: isAddBtn && isAddBtn == "true" ? true : false,
                            'class': 'td-word-wrap',
                            width: 100

                        });
                    initData["$id"] = 0;
                } else {
                    columns.push(
                        {
                            field: item["field"],
                            title: item["title"],
                            formatter: item["formatter"],
                            editable: item["editable"],
                            initData: item["editable"] ? item["initData"] : undefined,
                            visible: item["hide"] ? false : true,
                            validate: item["editable"] ? item["validate"] : '',
                            valign: "middle",
                            'class': 'td-word-wrap',
                            tableId: compId,
                            width: item["width"] ? item["width"] : ""
                        }
                    );
                    var defaultValue = "";
                    if (item["editable"] && item["initData"]) {
                        initData[item["field"]] = item["initData"]["defaultValue"];
                        initData[item["field"] + EDITABLE_SUFFIX] = true;
                        defaultValue = item["initData"]["defaultValue"];
                    } else {
                        initData[item["field"]] = "";
                        initData[item["field"] + EDITABLE_SUFFIX] = false;
                    }

                    formFields += "id=" + uriPath + item["field"] + ",type=string,defaultvalue="
                        + defaultValue + ",componenttype=table_base_local,parenttype=array@";
                }
            }
        });

        var param = {
            striped: true,
            pagination: true,
            pageSize: pageSize,
            pageList: [10, 20, 50, 100, 200],
            height: $("#tableheight").val() ? $("#tableheight").val() : 500,
            //clickToSelect:true,
            search: false,
            showColumns: false,
            selectItemName: 'btSelectItem' + compId,
            showRefresh: false,
            sidePagination: 'client',
            sortable: true,
            idTable: compId,
            idField: "$id",
            pk: ["$id"],
            columns: columns,
            data: editable ? [initData] : []
        };

        $("#" + compId).bootstrapTable(param);

        that.componentObject.attr("parameter", encodeURIComponent(JSON.stringify(param)))
            .attr("field", encodeURIComponent(formFields))
            .attr("bfd-uri-path", encodeURIComponent(uriPath.substring(0, uriPath.lastIndexOf("."))));
    }
}

TableLocalConfigProperty.FORMATTER = {
    textFormatter: function (value, row, index) {
        var disabled = arguments[1].$id == 0 ? "disabled " : "";
        return '<input type="text" data-field="' + this.field + '" class="form-control" ' + disabled + ' value="' + (value?value:"") + '" />';
    },

    selectorFormatter: function (value, row, index) {
        var html = [];
        var disabled = row.$id == 0 ? "disabled " : " ";
        var selected = function (option) {
            return value === option ? "selected " : " ";
        }
        if (row["editable"]) {
            html.push('<select class="form-control form-combo" ' + disabled + ' data-field="' + this.field + '">');
            html.push('<option value="">请选择</option>');
            html.push('<option ' + selected('formatTableText') + ' value="formatTableText">文本框</option>');
            html.push('<option ' + selected('formatTableCheckbox') + ' value="formatTableCheckbox">复选框</option>');
            html.push('<option ' + selected('formatTableSelect') + ' value="formatTableSelect">单选下拉框</option>');
            html.push('<option ' + selected('formatTableMultipleSelect') + ' value="formatTableMultipleSelect">多选下拉框</option>');
            html.push('</select>');
        } else {
            html.push('<input type="text" data-field="' + this.field + '" ' + disabled + 'class="form-control fix-col-width" value="' + value + '" />')
        }

        return html.join("");
    },

    checkboxFormatter: function (value, row, index) {
        var field = this.field,
            checked = value ? "checked" : "",
            disabled = row.$id == 0 ? "disabled" : "";
        if (row["editable"] && field === "hide") {
            disabled = "disabled";
        }
        return '<input type="checkbox" data-field="' + field + '" name="' + field + index + '" ' + checked + ' ' + disabled + ' value="' + value + '"/>';
    },
    checkboxSelectFormatter: function (value, row, index) {
        var checked = value ? "checked" : "";
        var disabled = arguments[1].$id == 0 ? "disabled" : "";
        var html = [];
        html.push('<div style="width:100px">');
        html.push('<span style="float:left;margin:5px"><input type="checkbox" data-field="' + this.field + '"' + checked + ' ' + disabled + ' value="' + value + '"/></span>');
        html.push('<span>');
        html.push('<select class="form-control form-combo" data-field="' + this.field + '" ' + (value ? '' : 'disabled') + '>');
        html.push('<option value="undefined">请选择</option>');
        html.push('<option value=">">&gt;</option>');
        html.push('<option value="<">&lt;</option>');
        html.push('<option value=">=">&gt;=</option>');
        html.push('<option value="<=">&lt;=</option>');
        html.push('<option value="=">=</option>');
        html.push('<option value="like">like</option>');
        html.push('</select>');
        html.push('</span>');
        html.push("</div>");
        return html.join("");
    }
}

TableLocalConfigProperty.FORMATTEREVENTS = {

}

TableLocalConfigProperty.DEFAULTS = {
    data: [
        {
            state: true,
            $id: 0,
            title: '操作',
            field: 'operator',
            editable: false,
            width:"",
            initData: {
                defaultValue: "",
                data: []
            },
            hide: false,
            validate: "",
            formatter: "operatorFormatter"
        }
    ],
    advanceTableColumns: [
        [
            {
                field: 'state',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                checkbox: true
            },
            {
                field: '$id',
                title: '序号',
                rowspan: 2,
                align: 'center',
                valign: 'middle',
                visible: false
            },
            {
                field: 'title',
                title: '标题',
                align: 'center',
                valign: 'middle',
                rowspan: 2,
                formatter: TableLocalConfigProperty.FORMATTER.textFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },

            {
                field: 'field',
                title: '字段',
                align: 'center',
                valign: 'middle',
                rowspan: 2,
                formatter: TableLocalConfigProperty.FORMATTER.textFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'width',
                title: '宽度',
                align: 'center',
                valign: 'middle',
                rowspan: 2,
                formatter: TableLocalConfigProperty.FORMATTER.textFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                title: '可编辑',
                align: 'center',
                colspan: 4
            },
            {
                field: 'hide',
                title: '隐藏',
                align: 'center',
                valign: 'middle',
                rowspan: 2,
                formatter: TableLocalConfigProperty.FORMATTER.checkboxFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            }
        ],

        [
            {
                field: 'editable',
                title: '编辑',
                align: 'center',
                formatter: TableLocalConfigProperty.FORMATTER.checkboxFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },

            {
                field: 'formatter',
                title: '格式化',
                align: 'center',
                formatter: TableLocalConfigProperty.FORMATTER.selectorFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'initData',
                title: '初始值',
                align: 'center',
                formatter: TableConfigProperty.FORMATTER.selectorInitFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            },
            {
                field: 'validate',
                title: '验证类型',
                align: 'center',
                formatter: TableConfigProperty.FORMATTER.validateSelectFormatter,
                events: TableConfigProperty.FORMATTEREVENTS
            }
        ]


    ]
}








