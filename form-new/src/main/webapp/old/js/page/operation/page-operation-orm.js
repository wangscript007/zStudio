;(function($,win) {
    /**
     * 单表页面模型
     * 提供表单增、删、改、查接口
     * @constructor
     */
    function SingleTablePageModel() {
    }

    SingleTablePageModel.prototype = new IPageModel();
    SingleTablePageModel.prototype._initORMVMData = function (viewModel, tableName, dsname) {
        var vmProperties = getVMProperties(viewModel);

        //构建列名参数
        var paramColumn = new Array();
        if (vmProperties.length > 0) {
            $.each(vmProperties, function (index, item) {
                paramColumn.push({cname: item});
            });
        }
        //构建查询参数
        var condition = generateCondition(getURLParameters(tableName), "and");
        var url = getOperatorURL(dsname, tableName) + "?param=" + encodeURIComponent(JSON.stringify({
                columns: paramColumn,
                condition: condition
            }));

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            async: false,
            success: function (data, textStatus) {
                if (!$.bfd.pageCache.execOperationSuccessFuc(viewModel, tableName, "GET", dsname)) {
                    if (data != undefined && data.status != undefined && data.status == 1) {
                        $.each(data.rows, function (index, dataItem) {
                            $.each(vmProperties, function (index1, item) {
                                if (dataItem[item] != undefined) {
                                    viewModel[item] = dataItem[item];
                                }
                            });
                        });
                    }
                    else {
                        console.error(data.message);
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (!$.bfd.pageCache.execOperationErrorFuc(viewModel, tableName, "GET", dsname)) {
                    console.log("textStatus " + textStatus + " errorThrown " + errorThrown + " url " + url);
                }
            }
        });
    }

    /**
     * 默认提交
     * @param vmid
     * @param uri
     * @param method
     * @param dsname
     * @returns {*}
     * @private
     */
    SingleTablePageModel.prototype._saveOrmVMData = function (vmid, uri, method, dsname) {
        var result;
        if ($("#" + vmid.$id).data('bootstrapValidator')) {
            $("#" + vmid.$id).data('bootstrapValidator').resetForm();
            $("#" + vmid.$id).bootstrapValidator('validate');
            if (!$("#" + vmid.$id).data('bootstrapValidator').isValid()) {
                return {status: 0, message: "validate fail. "};
            }
        }

        //用户自定义验证方法
        if (typeof(eval("window." + vmid.$id + "CustomerValidate")) !== "undefined") {
            var validateMsg = applyFunc(vmid.$id + "CustomerValidate", [vmid.$model]);
            if (validateMsg && !validateMsg.status) {
                bootbox.alert(validateMsg.msg);
                return validateMsg;
            }
        }

        var url = getOperatorURL(dsname, uri);
        var data;

        var newmodel = {};
        for (var pro in vmid.$model) {
            if (pro.indexOf("form_disabled") > -1 || pro.lastIndexOf("_form_compute") > -1) {
                continue;
            }
            // 处理存储内容为0的number情况。
            if (vmid.$model[pro] != '' || vmid.$model[pro] == '0') {
                newmodel[pro] = vmid.$model[pro];
            }
        }
        if (viewoperator == "add") {
            data = {columns: newmodel};
        }
        else if (viewoperator == "edit") {
            var condition = generateCondition(getURLParameters(uri), "and");
            data = {columns: newmodel, condition: condition};
            method = "PUT";
        }

        var newData = applyFunc(vmid.$id + "ParameterFilterCallBack", [data]);

        //11.20 临时修改
        if (typeof(eval("window.vmParameterFilterCallBack")) !== "undefined") {
            newData = applyFunc("vmParameterFilterCallBack", [data]);
        }

        if (newData != undefined) {
            data = newData;
        }

        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            async: false,
            success: function (data, textStatus) {
                if (!$.bfd.pageCache.execOperationSuccessFuc(vmid, uri, method, dsname)) {
                    //未定义回调方法
                    if (typeof(eval("window." + vmid.$id + "SuccessCallBack")) == "undefined" &&
                        typeof(eval("window.vmSuccessCallBack")) == "undefined"
                    ) {
                        operatorCallBack(data, "表单提交成功。", "表单提交失败。");
                    } else {
                        //回调用户自定义方法
                        applyFunc(vmid.$id + "SuccessCallBack", [data]);
                        if (typeof(eval("window.vmSuccessCallBack")) !== "undefined") {
                            applyFunc("vmSuccessCallBack", [data]);
                        }
                    }

                    result = data;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (!$.bfd.pageCache.execOperationErrorFuc(vmid, uri, method, dsname)) {
                    if (typeof(eval("window." + vmid.$id + "ErrorCallBack")) == "undefined" &&
                        typeof(eval("window.vmErrorCallBack")) == "undefined") {
                        errorCallback(textStatus, errorThrown, url);
                    } else {
                        applyFunc(vmid.$id + "vmErrorCallBack", [textStatus]);
                        //1120临时修改
                        applyFunc("vmErrorCallBack", [textStatus]);
                    }

                    result = {status: 0, message: "ajax request error. "};
                }
            }
        });

        return result;
    }

    /**
     * 数据查询接口
     * @param dsName 数据源
     * @param tableName 数据表
     * @param columns 查询数据列
     * @param conditions 查询条件
     * @param viewModel vm (可选)
     * @returns {Array} 数据列
     */
    SingleTablePageModel.prototype.getData = function (dsName,tableName,columns,conditions,viewModel) {
        if (!dsName || !tableName || !columns || columns.length == 0) {
            return [];
        }

        var condition = {},
            dataRows = [],
            ormColumns = [],
            url = "";

        if (conditions && conditions.length > 0) {
            condition = generateCondition(conditions, "and");
        }

        $.each(columns, function (index, item) {
            ormColumns.push({cname: item});
        })

        url = getOperatorURL(dsName, tableName) + "?param=" +
            encodeURIComponent(JSON.stringify({
                columns: ormColumns,
                condition: condition
            }));

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            async: false,
            success: function (data, textStatus) {
                if (!$.bfd.pageCache.execOperationSuccessFuc(viewModel, tableName, "GET", dsName)) {
                    if (data != undefined && data.status != undefined && data.status == 1) {
                        dataRows = data.rows;
                    }
                    else {
                        console.error(data.message);
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (!$.bfd.pageCache.execOperationErrorFuc(viewModel, tableName, "GET", dsName)) {
                    console.log("textStatus " + textStatus + " errorThrown " + errorThrown + " url " + url);
                }
            }
        });

        return dataRows;
    }

    /**
     * 初始化单表表单数据
     * @param viewModel
     * @param tableName
     * @param dsname
     */
    SingleTablePageModel.prototype.initVMData = function (viewModel, tableName, dsname) {
        //只有在修改或者查看时才填充数据
        if (typeof(viewoperator) === "undefined" || viewoperator === "add" || !tableName) {
            return;
        }

        this._initORMVMData(viewModel, tableName, dsname);
    }

    /**
     * 提交单表数据
     * @param vmid
     * @param uri
     * @param method
     * @param dsname
     * @returns {*}
     */
    SingleTablePageModel.prototype.saveVMData = function (viewModel, tableName, method, dsname) {
        var method = "";
        if (viewoperator == "add") {
            method = "POST";
        } else if (viewoperator == "edit") {
            method = "PUT";
        }

        return this._saveOrmVMData(viewModel, tableName, method, dsname);
    }

    $.bfd = $.bfd || {};
    $.bfd.singleTablePageModel = new SingleTablePageModel();

}(jQuery,window))
