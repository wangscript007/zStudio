/**
 * Created by 10177027 on 2016/7/5.
 */

/**
 * 页面缓存管理
 */
;(function() {
    /**
     * 模型数据格式化
     * @param viewModel
     * @returns {{}}
     */
    function formatViewModel(viewModel) {
        var newModel = {}, that = this;
        $.each(viewModel, function (index, item) {
            if (typeof(item) == "function" ||
                index.indexOf("_form_disabled") > -1 ||
                index.indexOf("_form_compute") > -1) {
                return;
            }
            newModel[index] = viewModel[index];
            if (typeof item === "object") {
                if ($.isArray(viewModel[index])) {
                    var arrDatas = [];
                    for (var i = 0; i < viewModel[index].length; i++) {
                        arrDatas.push(formatViewModel(viewModel[index][i]))
                    }
                    newModel[index] = arrDatas;
                } else {
                    newModel[index] = formatViewModel(viewModel[index]);
                }
            }
        })

        return newModel;
    }


    var PageCacheManage = function () {
        this.data = new Map();
    }

    PageCacheManage.OPERATIONS = {
        /**
         * 操作方法：POST,PUT,DELETE,GET
         */
        METHOD: "method",
        /**
         * 操作URL
         */
        URL: "url",
        /**
         * 自定义获取URL函数
         */
        GETURL: "getUrl",
        /**
         * 自定义提交函数
         */
        SUBMIT: "submit",
        /**
         * 操作成功回调函数
         */
        SUCCESS: "success",
        /**
         * 操作失败回调函数
         */
        ERROR: "error"
    }
    PageCacheManage.OPERATION_PARAMS_TYPE = {
        /**
         * 操作定义参数
         */
        OPERATION: "operations",
        /**
         * 新增输入参数
         */
        POST_IN: "post_in",
        /**
         * 修改输入参数
         */
        PUT_IN: "put_in",
        /**
         * 查询输出参数
         */
        GET_OUT: "get_out"
    }

    /**
     * 缓存类型定义
     * @type {{operation: string}}
     */
    PageCacheManage.CACHETYPE = {
        OPERATION:"operation"
    }

    PageCacheManage.prototype = {
        /**
         * 初始化操作项
         */
        initOperations: function () {
            var $this = this;
            $("[bfd-operation-params]").each(function (index, item) {
                var operation = $.parseJSON(decodeURIComponent($(item).attr("bfd-operation-params")) || '{}');
                $this.setOperationItem(operation);
            })
        },
        /**
         * 设置操作项缓存
         * @param operation
         */
        setOperationItem: function (operation) {
            if ($.isEmptyObject(operation)) {
                return;
            }

            var key = PageCacheManage.CACHETYPE.OPERATION + "_" + operation.service + "_" + operation.set;
            this.data.put(key+"_model",operation);
            this.data.put(key, operation[PageCacheManage.OPERATION_PARAMS_TYPE.OPERATION]);
            this.data.put(key + "_" + PageCacheManage.OPERATION_PARAMS_TYPE.POST_IN, operation[PageCacheManage.OPERATION_PARAMS_TYPE.POST_IN]);
            this.data.put(key + "_" + PageCacheManage.OPERATION_PARAMS_TYPE.PUT_IN, operation[PageCacheManage.OPERATION_PARAMS_TYPE.PUT_IN]);
            this.data.put(key + "_" + PageCacheManage.OPERATION_PARAMS_TYPE.GET_OUT, operation[PageCacheManage.OPERATION_PARAMS_TYPE.GET_OUT]);
        },
        removeAttr: function () {
            var $this = this;
            $("[bfd-operation-params]").each(function (index, item) {
                $(item).removeAttr("bfd-operation-params");
            })
        },
        /**
         * 获取数据源类型
         * @param service
         * @param set
         * @returns {string}
         */
        getDataSourceType:function(service, set) {
            var key = PageCacheManage.CACHETYPE.OPERATION + "_" + service + "_" + set + "_model";
            var dataSourceObject = this.data.get(key);
            var dsType = "";

            if (dataSourceObject) {
                dsType = dataSourceObject.dsType;
                if (!dsType && dataSourceObject.model) {
                    dsType = $("#" + dataSourceObject.model).attr("dstype");
                }
            }

            if (!dsType) {
                dsType = "orm";
            }

            return dsType;
        },
        hasOperationItem: function (service, set, method) {
            var operations = this.data.get(PageCacheManage.CACHETYPE.OPERATION + "_" + service + "_" + set);
            if (!operations) {
                return false;
            }

            var operation = {};
            $.each(operations, function (index, item) {
                if (item[PageCacheManage.OPERATIONS.METHOD] === method) {
                    operation = item;
                }
            })

            if ($.isEmptyObject(operation)) {
                return false;
            }

            return true;
        },
        /**
         * 获取操作项
         * @param service
         * @param set
         * @param method
         * @returns {{}}
         */
        getOperationItem: function (service, set, method) {
            var operations = this.data.get(PageCacheManage.CACHETYPE.OPERATION + "_" + service + "_" + set);
            if (!operations) {
                return {};
            }

            var result = {};
            $.each(operations, function (index, item) {
                if (item[PageCacheManage.OPERATIONS.METHOD] === method) {
                    result = item;
                }
            })

            return result;
        },
        /**
         * 获取自定义url
         * @param service
         * @param set
         * @param method
         * @returns {string}
         */
        getOperationUrl: function (service, set, method) {
            var url = "";
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return url;
            }

            url = operationItem[PageCacheManage.OPERATIONS.URL];
            if (!url) {
                url = "";
            }

            return url;
        },
        /**
         * 通过函数获取自定义url
         * @param service
         * @param set
         * @param method
         * @returns {string}
         */
        execOperationUrlFuc: function (service, set, method, param) {
            var result = "";
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var urlFuc = operationItem[PageCacheManage.OPERATIONS.GETURL];
            if (urlFuc && urlFuc !== "") {
                result = applyFunc(urlFuc, [service, set, method, param]);
            }

            return result;
        },
        /**
         * 执行自定义提交
         * @param service
         * @param set
         * @param method
         * @param viewModel
         * @returns {boolean}
         */
        execOperationSubmitFuc: function (viewModel, set, method, service) {
            var result = false;
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var submitFuc = operationItem[PageCacheManage.OPERATIONS.SUBMIT];
            if (submitFuc && submitFuc !== "") {
                return applyFunc(submitFuc, arguments);
            }

            return result;
        },
        /**
         * 执行成功回调
         * @param service
         * @param set
         * @param method
         * @param viewModel
         * @returns {boolean}
         */
        execOperationSuccessFuc: function (viewModel, set, method, service) {
            var result = false;
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var successFuc = operationItem[PageCacheManage.OPERATIONS.SUCCESS];
            if (successFuc && successFuc !== "") {
                return applyFunc(successFuc, arguments);
            }

            return result;
        },
        /**
         * 执行异常回调
         * @param service
         * @param set
         * @param method
         * @param viewModel
         * @returns {boolean}
         */
        execOperationErrorFuc: function (viewModel, set, method, service) {
            var result = false;
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var errorFuc = operationItem[PageCacheManage.OPERATIONS.ERROR];
            if (errorFuc && errorFuc !== "") {
                return applyFunc(errorFuc, arguments);
            }

            return result;
        },
        /**
         * 移除操作后重新更新操作集缓存
         * @param service
         * @param set
         */
        refreshOperationItem: function (service, set) {
            this.initOperations();
        },
        /**
         * 获取添加模型
         * @param service
         * @param set
         * @param method
         * @param viewModel
         */
        getPostInModel: function (service, set, viewModel) {
            if (!viewModel || $.isEmptyObject(viewModel)) {
                return {};
            }

            var key = PageCacheManage.CACHETYPE.OPERATION + "_" + service + "_" + set + "_" + PageCacheManage.OPERATION_PARAMS_TYPE.POST_IN;
            var postInFields = this.data.get(key);
            if (!postInFields || postInFields.length === 0) {
                return this.formatViewModel(viewModel);
            }

            return this.getFilteredModel(postInFields, viewModel);
        },
        /**
         * 获取修改模型
         * @param service
         * @param set
         * @param method
         * @param viewModel
         */
        getPutInModel: function (service, set, viewModel) {
            if (!viewModel || $.isEmptyObject(viewModel)) {
                return {};
            }
            var key = PageCacheManage.CACHETYPE.OPERATION + "_" + service + "_" + set + "_" + PageCacheManage.OPERATION_PARAMS_TYPE.PUT_IN;
            var putInfields = this.data.get(key);
            if (!putInfields || putInfields.length === 0) {
                return this.formatViewModel(viewModel);
            }

            return this.getFilteredModel(putInfields, viewModel);
        },
        /**
         * 获取输出模型
         * @param service
         * @param set
         * @param method
         * @param viewModel
         */
        getOutFieldsModel: function (service, set, viewModel) {
            if (!viewModel || $.isEmptyObject(viewModel)) {
                return {};
            }

            var key = PageCacheManage.CACHETYPE.OPERATION + "_" + service + "_" + set + "_" + PageCacheManage.OPERATION_PARAMS_TYPE.GET_OUT;
            var outFields = this.data.get(key);
            if (!outFields || outFields.length === 0) {
                return this.formatViewModel(viewModel);
            }

            return this.getFilteredModel(outFields, viewModel);
        },
        /**
         * 获取过滤后的模型
         * @param fields
         * @param model
         * @param newModel
         */
        getFilteredModel: function (fields, oldmodel) {
            var newModel = {};
            var that = this;

            if(!fields){
                return newModel;
            }
            $.each(fields, function (index, item) {
                if (oldmodel[item.name]) {
                    newModel[item.name] = oldmodel[item.name];
                    if (item.type === "object") {
                        newModel[item.name] = that.getFilteredModel(item.properties, oldmodel[item.name]);
                    }

                    if (item.type === "array" && $.isArray(oldmodel[item.name])) {
                        var arrDatas = [];
                        for (var i = 0; i < oldmodel[item.name].length; i++) {
                            arrDatas.push(that.getFilteredModel(item.properties, oldmodel[item.name][i]));
                        }

                        newModel[item.name] = arrDatas;
                    }
                }
            })

            return newModel;
        },
        formatViewModel: function (viewModel) {
            return formatViewModel(viewModel);
        }
    }




    /**
     * 查询条件缓存管理
     * @constructor
     */
    var QueryConditionCache = function(){
        this.data = new Map();
    }

    /**
     * 默认查询操作
     * @type {string}
     */
    QueryConditionCache.DEFAULT_QUERY_OPERATION = "eq";
    QueryConditionCache.QUERY_OPERATION = {
        eq:"=",
        gt: ">",
        lt: "<",
        gte: ">=",
        lte: "<=",
        ne: "<>",
        like: "like"
    }

    /**
     * 查询操作key
     */
    QueryConditionCache.CACHETYPE = "query_operation";
    QueryConditionCache.prototype = {
        /**
         * 查询条件配置初始化
         */
        initQueryConditionConfig: function () {
            var queryConfigs = {};
            $("[ms-controller]").each(function (index, vm) {
                var modelId = $(vm).attr("ms-controller");
                queryConfigs[modelId] = {};

                $("[bfd-query-operation]").each(function (subIndex, comp) {
                    var field = $(comp).attr("field");
                    queryConfigs[modelId][field] = $(comp).attr("bfd-query-operation");
                })
            })

            this.data.put(QueryConditionCache.CACHETYPE, queryConfigs);
        },
        /**
         * 获取查询配置
         * @param modelId
         * @param field
         * @returns {*}
         */
        getQueryConditionConfig: function (modelId, field) {
            var operation = QueryConditionCache.DEFAULT_QUERY_OPERATION;
            var config = this.data.get(QueryConditionCache.CACHETYPE);
            if (config) {
                operation = config[modelId][field];
            }

            if (!operation) {
                operation = QueryConditionCache.DEFAULT_QUERY_OPERATION;
            }

            return QueryConditionCache.QUERY_OPERATION[operation];
        },
        /**
         * 删除组件属性
         */
        removeAttr: function () {
            $("[bfd-query-operation]").each(function (subIndex, comp) {
                $(comp).removeAttr("bfd-query-operation");
            })
        },

        /**
         * 获取orm查询类型条件
         * @param viewModel
         * @returns {Array}
         * @private
         */
        getOrmQueryConditions: function (viewModel) {
            var conditions = [];
            if (!viewModel) {
                return conditions;
            }

            var modelData = formatViewModel(viewModel.$model),
                $this = this;

            $.each(modelData, function (key, value) {
                if (!value) {
                    return true;
                }

                var condition = new QueryCondition(),
                    operation = $this.getQueryConditionConfig(viewModel.$id, key),
                    formatedValue = value;

                if (operation === QueryConditionCache.QUERY_OPERATION.like) {
                    formatedValue = '%' + formatedValue + '%';
                }

                condition.setCName(key).setCompare(operation).setValue(formatedValue);
                conditions.push(condition);
            })

            return conditions;
        },

        /**
         * 获取json类型查询条件
         * @param viewModel
         * @private
         */
        getJSONTypeQueryConditions: function (viewModel) {
            var conditions = "";
            if (!viewModel) {
                return conditions;
            }

            var modelData = formatViewModel(viewModel.$model);
            $.each(modelData, function (key, value) {
                if (!value) {
                    return true;
                }

                if (conditions) {
                    conditions += "&";
                }

                conditions += key + "=" + value;
            })

            return conditions;
        }
    }

    $.bfd = $.bfd || {};
    $.bfd.pageCache = $.bfd.pageCache || {};
    $.bfd.pageCache = new PageCacheManage();
    $.bfd.pageCache.queryCondition = new QueryConditionCache();

    $.bfd.pageCache.OPERATIONS = PageCacheManage.OPERATIONS;

})(jQuery)