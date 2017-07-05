;(function($,win) {
    /**
     * 表单模型管理接口
     * @constructor
     */
    function IPageModel() {
        this.dsName = "";
    }

    IPageModel.prototype = {
        setDSName: function (dsName) {
            this.dsName = dsName;
        },
        getDSName: function () {
            return this.dsName;
        },
        initVMData: function () {
            return;
        },
        saveVMData: function () {
            return;
        },
        getData:function(){
            return [];
        },
        /**
         * 获取模型数据
         * @param viewModel
         * @returns {{}}
         */
        getModelData: function (viewModel) {
            return getModelData(viewModel);
        },
        /**
         * 设置avalon模型数据值
         * @param viewModel
         * @param data
         */
        setModelData: function (viewModel, data) {
            if (!data || data.length != 1) {
                return;
            }

            $.each(data[0], function (index, item) {
                viewModel[index] = item;
            })
        },
        ajaxGet: function (url, callback) {
            $.ajax({
                type: 'GET',
                url: url,
                dataType: 'json',
                async: false,
                success: function (data, textStatus) {
                    if (callback && data != undefined && data.status != undefined && data.status == 1) {
                        callback(data);
                    }
                    else {
                        console.error(data.message);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("textStatus " + textStatus + " errorThrown " + errorThrown + " url " + url);
                }
            });
        },
        ajaxPost: function (method, url, data) {
            var result;
            $.ajax({
                type: method,
                url: url,
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                async: false,
                success: function (data, textStatus) {
                    operatorCallBack(data, "表单提交成功。", "表单提交失败。");
                    result = data;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    errorCallback(textStatus, errorThrown, url);
                    result = {status: 0, message: "ajax request error. "};
                }
            });

            return result;
        },
        ajaxDelete: function (url) {
            var result;
            $.ajax({
                type: "DELETE",
                url: url,
                dataType: 'json',
                contentType: 'application/json; charset=UTF-8',
                async: false,
                success: function (data, textStatus) {
                    operatorCallBack(data, "表单删除成功。", "表单删除失败。");
                    result = data;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    errorCallback(textStatus, errorThrown, url);
                    result = {status: 0, message: "ajax request error. "};
                }
            });

            return result;
        }
    }


    /**
     * 页面模型管理
     * @type {{}}
     */
    var PageModelManage = {};
    PageModelManage.DSTYPE = {
        DataSet: "dataset",
        DataTable: "orm",
        JSON: "json"
    }



    /**
     * 默认为单表操作
     * @param dsName
     * @param viewModel
     * @param tableName
     */
    PageModelManage.initModel = function (dsName, viewModel, tableName) {
        var dsType = $("[dstype]:first").attr("dstype");
        if (viewModel) {
            dsType = $("#" + viewModel.$id).attr("dstype");
        }

        if (!dsType && $.bfd.pageCache) {
            dsType = $.bfd.pageCache.getDataSourceType(dsName, tableName);
        }

        if (!dsType) {
            dsType = PageModelManage.DSTYPE.DataTable;
        }

        switch (dsType) {
            case PageModelManage.DSTYPE.DataSet:
                PageModelManage.model = $.bfd.multiTablePageModel;
                $("#submit").unbind("click").on("click", function () {
                    PageModelManage.model.saveVMData("", "", "POST", dsName);
                });
                break;
            case PageModelManage.DSTYPE.JSON:
                PageModelManage.model = $.bfd.customJsonPageModel;
                break;
            default :
                PageModelManage.model = $.bfd.singleTablePageModel;
        }

        PageModelManage.model.setDSName(dsName);
    }



    /**
     * 页面回显时初始化
     * @param viewModel
     * @param tableName
     * @param dsname
     */
    PageModelManage.initVMData = function (viewModel, tableName, dsName) {
        PageModelManage.initModel(dsName, viewModel);
        PageModelManage.model.initVMData(viewModel, tableName, dsName);
    }


    /**
     * 页面数据提交
     * @param viewModel
     * @param tableName
     * @param method
     * @param dsname
     * @returns {*}
     */
    PageModelManage.saveVMData = function (viewModel, tableName, method, dsName) {
        if (typeof(eval("window." + viewModel.$id + "SubmitBefore")) === "function") {
            //回调用户自定义方法
            applyFunc(viewModel.$id + "SubmitBefore", [viewModel]);
        }

        PageModelManage.initModel(dsName, viewModel);
        return PageModelManage.model.saveVMData(viewModel, tableName, method, dsName);
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
    PageModelManage.getData = function (dsName, tableName, columns, conditions, viewModel) {
        PageModelManage.initModel(dsName, viewModel, tableName);
        return PageModelManage.model.getData(dsName, tableName, columns, conditions, viewModel);
    }


    win.IPageModel = IPageModel;
    win.PageModelManage = PageModelManage;
}(jQuery,window))


/*
 描述：页面回显时初始化viewmodel
 参数：viewModel：vm对象
 vmProperties：vm属性集合
 tableName：数据库表名
 返回值：无
 */
function initVMData(viewModel, tableName, dsName) {
    PageModelManage.initVMData(viewModel, tableName, dsName);
}

/**
 * 表单的添加、修改操作，使用同步ajax提交
 * @param vmid
 * @param uri
 * @param method
 * @param dsname
 * @return 返回状态
 */
function formOperator(viewModel, tableName, method, dsName) {
    return PageModelManage.saveVMData(viewModel, tableName, method, dsName);
}