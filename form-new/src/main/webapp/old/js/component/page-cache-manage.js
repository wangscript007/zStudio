/**
 * Created by 10177027 on 2016/6/15.
 */

;(function() {
    var PageCacheManage = function () {
        this.data = new Map();
    }

    PageCacheManage.OPERATIONS = {
        METHOD: "method",
        URL: "url",
        GETURL: "getUrl",
        SUBMIT: "submit",
        SUCCESS: "success",
        ERROR: "error"
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
            $("[dsOperation]").each(function (index, item) {
                var operation = $.parseJSON(decodeURIComponent($(item).attr("dsOperation")) || '{}');
                if (!$.isEmptyObject(operation)) {
                    var key = PageCacheManage.CACHETYPE.OPERATION + "_" + operation.service + "_" + operation.set;
                    $this.data.put(key, operation.operations);
                }
            })
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

            if($.isEmptyObject(operation)){
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
        getOperationUrl:function(service, set, method) {
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
        execOperationUrlFuc:function(service, set, method) {
            var result = "";
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var urlFuc = operationItem[PageCacheManage.OPERATIONS.GETURL];
            if (urlFuc && urlFuc !== "") {
                result = applyFunc(urlFuc, [service, set, method]);
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
        execOperationSubmitFuc:function(service, set, method,viewModel) {
            var result = false;
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var submitFuc = operationItem[PageCacheManage.OPERATIONS.SUBMIT];
            if (submitFuc && submitFuc !== "") {
                result = true;
                applyFunc(submitFuc, [service, set, method, viewModel]);
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
        execOperationSuccessFuc:function(service, set, method,viewModel) {
            var result = false;
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var successFuc = operationItem[PageCacheManage.OPERATIONS.SUCCESS];
            if (successFuc && successFuc !== "") {
                result = true;
                applyFunc(successFuc, [service, set, method, viewModel]);
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
        execOperationErrorFuc:function(service, set, method,viewModel) {
            var result = false;
            var operationItem = this.getOperationItem(service, set, method);
            if ($.isEmptyObject(operationItem)) {
                return result;
            }

            var errorFuc = operationItem[PageCacheManage.OPERATIONS.ERROR];
            if (errorFuc && errorFuc !== "") {
                result = true;
                applyFunc(errorFuc, [service, set, method, viewModel]);
            }

            return result;
        },
        /**
         * 设置操作项
         * @param service
         * @param set
         * @param operations
         */
        setOperationItem: function (service, set, operations) {
            this.data.put(PageCacheManage.CACHETYPE.OPERATION + "_" +service + "_" + set, operations);
        },
        /**
         * 移除操作后重新更新操作集缓存
         * @param service
         * @param set
         */
        refreshOperationItem: function (service, set) {
            this.initOperations();
        }
    }

    $.bfd = $.bfd || {};
    $.bfd.pageCache = $.bfd.pageCache || {};
    $.bfd.pageCache = new PageCacheManage();
    $.bfd.pageCache.OPERATIONS = PageCacheManage.OPERATIONS;

    /**
     * 组件加载后初始化操作
     */
    $(document).ready(function () {
        $.bfd.pageCache.initOperations();
    })

})(jQuery)