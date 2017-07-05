;(function($,win) {
    /**
     * 用户自定义json增、删、改、查接口
     * @constructor
     */
    function CustomJsonPageModel() {
    }

    CustomJsonPageModel.prototype = new IPageModel();

    /**
     * 获取地址参数
     * @returns {string}
     */
    CustomJsonPageModel.prototype.getURLParameters = function () {
        var conditions = "";
        var uri = pageParams ? pageParams : location.search;
        var params = uri.substr(uri.indexOf("?") + 1).split("&");
        $.each(params, function (index, item) {
            var arr = item.split("=");
            if (arr[0] == "operator") {
                return true;
            }

            if (conditions) {
                conditions += "&";
            }
            conditions += item;
        });

        return conditions;
    }

    /**
     * 初始化模型表格数据
     * @param viewModel
     * @private
     */
    CustomJsonPageModel.prototype.initTableData = function (viewModel) {
        if (!viewModel) {
            return;
        }

        var that = this;
        $("#" + viewModel.$id).find("[type=table_base_local]").each(function (index, item) {
            var uriPath = $(item).attr("bfd-uri-path");
            if (!uriPath) {
                return;
            }

            var tableData = that.getViewModelDataByPath(viewModel, uriPath);
            var $table = $("#" + $(item).attr("compid"));
            $table.bootstrapTable('removeAll');
            $table.bootstrapTable("appendData", tableData);

            if (typeof(viewoperator) !== "undefined" && viewoperator === "view") {
                $table.bootstrapTable("updateTableEditable", {editable: false});
                $table.bootstrapTable("hideTableColumns", ["operator"]);
            }
        })
    }


    /**
     * 刷新模型数据
     * @param viewModel
     * @private
     */
    CustomJsonPageModel.prototype.refreshViewModelData = function (viewModel) {
        if (!viewModel) {
            return;
        }

        var that = this;
        $("#" + viewModel.$id).find("[type=table_base_local]").each(function (index, item) {
            var uriPath = $(item).attr("bfd-uri-path");
            if (!uriPath) {
                return;
            }

            /**
             * 过滤表格中多余的字段如-editable,-update等。
             */
            var tableData = $("#" + $(item).attr("compid")).bootstrapTable('getData'),
                modelData = that.getViewModelDataByPath(viewModel, uriPath),
                newData = [];
            if (modelData && modelData.length > 0 && tableData && tableData.length > 0) {
                for (var i = 0; i < tableData.length; i++) {
                    var data = {};

                    $.each(modelData[0], function (index, item) {
                        if (tableData[i][index]) {
                            data[index] = tableData[i][index];
                        }
                    })

                    newData.push(data);
                }
            }

            that.setViewModelDataByPath(viewModel, uriPath, newData);
        })
    }

    /**
     * 根据路径获取vm模型数据
     * @param viewModel
     * @param uriPath
     * @returns {*}
     */
    CustomJsonPageModel.prototype.getViewModelDataByPath = function (viewModel, uriPath) {
        var result = [];
        if (uriPath.indexOf(".") > -1) {
            var paths = uriPath.split("."),
                size = paths.length,
                tempData = new Map();

            result = viewModel.$model[paths[0]];
            tempData.put(0, viewModel.$model[paths[0]]);

            if (size > 1) {
                for (var i = 1; i < paths.length; i++) {
                    var parentData = tempData.get(i - 1);
                    tempData.put(i, parentData[paths[i]]);
                    result = parentData[paths[i]];
                }
            }
        } else {
            result = viewModel.$model[uriPath];
        }

        return result;
    }

    /**
     * 设置模型数据
     * @param viewModel
     * @param uriPath
     * @param data
     */
    CustomJsonPageModel.prototype.setViewModelDataByPath = function (viewModel, uriPath, data) {
        if (uriPath.indexOf(".") > -1) {
            var paths = uriPath.split("."),
                size = paths.length,
                tempData = new Map();

            tempData.put(0, viewModel.$model[paths[0]]);

            if (size > 1) {
                for (var i = 1; i < paths.length; i++) {
                    var parentData = tempData.get(i - 1);
                    tempData.put(i, parentData[paths[i]]);
                    if (i + 1 === size) {
                        parentData[paths[i]] = data;
                    }
                }
            }
        } else {
            viewModel.$model[uriPath] = data;
        }
    }

    /**
     * 解析服务端返回数据
     * @param viewModel
     * @param datas
     */
    CustomJsonPageModel.prototype.analyzeData = function (viewModel, datas) {
        if (!datas) {
            return;
        }

        var that = this;
        $.each(datas, function (index, item) {
            if (viewModel[index] != undefined) {
                if (typeof item === "object" && !$.isArray(item)) {
                    that.analyzeData(viewModel[index], item);
                } else {
                    viewModel[index] = datas[index];
                }
            }
        })
    }

    CustomJsonPageModel.prototype._initVMData = function (viewModel, tableName, dsname) {
        var that = this;
        var url = getOperatorURL(dsname, tableName) + "?" + this.getURLParameters();

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            async: false,
            success: function (data, textStatus) {
                if (!$.bfd.pageCache.execOperationSuccessFuc(viewModel, tableName, "GET", dsname)) {
                    that.analyzeData(viewModel.$model, data);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (!$.bfd.pageCache.execOperationErrorFuc(viewModel, tableName, "GET", dsname)) {
                    errorCallback(textStatus, errorThrown, url);
                    applyFunc(viewModel.$id + "ErrorCallBack", []);
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
    CustomJsonPageModel.prototype._saveVMData = function (viewModel, uri, method, dsname) {
        var result;
        if ($("#" + viewModel.$id).data('bootstrapValidator')) {
            $("#" + viewModel.$id).data('bootstrapValidator').resetForm();
            $("#" + viewModel.$id).bootstrapValidator('validate');
            if (!$("#" + viewModel.$id).data('bootstrapValidator').isValid()) {
                return {status: 0, message: "validate fail. "};
            }
        }

        //用户自定义验证方法
        if (typeof(eval("window." + viewModel.$id + "CustomerValidate")) !== "undefined") {
            var validateMsg = applyFunc(viewModel.$id + "CustomerValidate", [viewModel.$model]);
            if (validateMsg && !validateMsg.status) {
                bootbox.alert(validateMsg.msg);
                return validateMsg;
            }
        }

        var url = getOperatorURL(dsname, uri);
        var data = $.bfd.pageCache.getPostInModel(dsname, uri, viewModel.$model);
        if (viewoperator == "edit") {
            method = "PUT";
            data = $.bfd.pageCache.getPutInModel(dsname, uri, viewModel.$model);
            url += "?" + this.getURLParameters();
        }

        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            async: false,
            success: function (data, textStatus) {
                if (!$.bfd.pageCache.execOperationSuccessFuc(viewModel, uri, method, dsname)) {
                    if (typeof(eval("window." + viewModel.$id + "SuccessCallBack")) == "undefined") {
                        bootbox.alert("表单提交成功！");
                    } else {
                        applyFunc(viewModel.$id + "SuccessCallBack", [data]);
                    }

                    result = data;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (!$.bfd.pageCache.execOperationErrorFuc(viewModel, uri, method, dsname)) {
                    errorCallback(textStatus, errorThrown, url);
                    applyFunc(viewModel.$id + "ErrorCallBack", []);
                    result = {status: 0, message: "ajax request error. "};
                }
            }
        });

        return result;
    }

    /**
     * 初始化单表表单数据
     * @param viewModel
     * @param tableName
     * @param dsname
     */
    CustomJsonPageModel.prototype.initVMData = function (viewModel, tableName, dsname) {
        //只有在修改或者查看时才填充数据
        if (typeof(viewoperator) === "undefined" || viewoperator === "add") {
            return;
        }

        this._initVMData(viewModel, tableName, dsname);
        this.initTableData(viewModel);
    }

    /**
     * 提交单表数据
     * @param vmid
     * @param uri
     * @param method
     * @param dsname
     * @returns {*}
     */
    CustomJsonPageModel.prototype.saveVMData = function (viewModel, tableName, method, dsname) {
        this.refreshViewModelData(viewModel);
        return this._saveVMData(viewModel, tableName, method, dsname);
    }

    $.bfd = $.bfd || {};
    $.bfd.customJsonPageModel = new CustomJsonPageModel();
}(jQuery,window))

