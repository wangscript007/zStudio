;
(function ($, win) {
    /**
     * ORM的通用操作
     */
    var DesignerOrmBase = function (appname) {
        this.baseUrl = appname;
        if(!this.baseUrl) {
            this.baseUrl = $base_url;
        }
        this.tableUrl = "/" + this.baseUrl + "/orm/table/";

    };
    DesignerOrmBase.prototype = {
        /**
         * 删除表中的记录
         * @param tableId
         * @param con
         */
        deleteRecord : function (tableId, con) {
            var url = this.tableUrl + tableId;
            $.ajax({
                type: "DELETE",
                url: url,
                data: con,
                datatype: 'json',
                //contentType: 'text/plain;charset=UTF-8',
                contentType: 'application/json; charset=UTF-8',
                async: false,
                success: function (data, textStatus) {
                    bootbox.alert('删除数据成功。');
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("textStatus " + textStatus + " errorThrown "
                        + errorThrown + " url " + esbinfo + url);
                    bootbox.alert('删除数据失败。');
                }
            });
        },

        /**
         * 获取表格选中的条件
         * @param tableId
         * @param keyColumn
         */
        getCondition : function (tableId, keyColumn) {
            var rows = getTableSelectData(tableId);
            var conditions = new Array();
            $.each(rows, function (index, item) {
                var condition = new QueryCondition();
                condition.setCName(keyColumn).setCompare("=").setValue(item[keyColumn]);
                conditions.push(condition);
            });
            return JSON.stringify({
                condition: generateCondition(conditions, "or")
            });
        },
        /**
         * 通用请求方法
         * @param method 访问方法
         * @param urlAndParam url和参数
         * @param bodyData body数据 可以为undefined
         * @returns {*}
         */
        CommonOrmAjax : function (method, urlAndParam, bodyData, successCallback, errorCallback,isAsyn) {
            var result = {};
            var bodyDataAjax = '';
            if (bodyData == undefined || typeof bodyData == 'string') {
                bodyDataAjax = bodyData;
            } else {
                bodyDataAjax = JSON.stringify(bodyData);
            }
            var isAsync ;
            if(isAsyn == undefined){
            	isAsync = false;
            }else{
            	isAsync = isAsyn;
            }
            $.ajax({
                type: method,
                url: urlAndParam,
                data: bodyDataAjax,
                datatype: 'json',
                //beforeSend:function(){},
                contentType: 'application/json; charset=UTF-8',
                async: isAsync,
                success: function (data, textStatus) {
                    if (typeof data == 'string') {
                        data = JSON.parse(data);
                    }
                    if (successCallback) {
                        successCallback(data);
                    } else {
                        result = data;
                    }

                },
                //complete:function(){},
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (typeof errorCallback === "function") {
                        errorCallback(textStatus, errorThrown, urlAndParam);
                    } else {
                        result.status = 0;
                        result.message = "textStatus " + textStatus + " errorThrown "
                            + errorThrown + " url " + urlAndParam;
                    }

                }
            });
            return result;
        },

        /**
         * 通用添加记录方法
         * @param tablename
         * @param columns
         * @param values
         */
        insert : function (tablename, columnsArray, values, callback) {
            var param = {};
            var columns = {};
            var result;
            var columnList = JSON.parse((columnsArray));
            var valueList = JSON.parse((values));
            if (columnList.length != valueList.length) {
                bootbox.alert("字段个数与取值个数不一致");
            } else {
                var i;
                for (i = 0; i < columnList.length; i++) {
                    var str = "columns." + columnList[i] + "=valueList[i]";
                    eval(str);
                }
                param.columns = columns;
                result = this.CommonOrmAjax("POST", this.tableUrl + tablename, param, callback, undefined);
            }
            return result;
        },


        insertBatch : function (tablename, columnValues, callback) {
            var param = {}, result;
            param.columns = columnValues;
            result = this.CommonOrmAjax("POST", this.tableUrl + tablename, param, callback, undefined);
            return result;
        },
        /**
         * 通用删除方法
         * @param tablename
         * @param condition
         */
        delete : function (tablename, condition, callback) {
            var result;
            var url = this.tableUrl + tablename + "?param="
                + encodeURIComponent(JSON.stringify({
                    condition: condition
                }));
            result = this.CommonOrmAjax("DELETE", url, undefined, callback, undefined);
            return result;
        },
        /**
         * 通用修改记录方法
         * @param tablename
         * @param columns
         * @param values
         */
        update : function (tablename, columnsArray, values, condition, callback) {
            var param = {};
            var columns = {};
            var result;
            var columnList = JSON.parse((columnsArray));
            var valueList = JSON.parse((values));
            if (columnList.length != valueList.length) {
                bootbox.alert("字段个数与取值个数不一致");
            } else {
                var i;
                for (i = 0; i < columnList.length; i++) {
                    var str = "columns." + columnList[i] + "=valueList[i]";
                    eval(str);
                }
                param.columns = columns;
                param.condition = condition;
                result = this.CommonOrmAjax("PUT", this.tableUrl + tablename, param, callback, undefined);
            }
            return result;
        },

        updateBatch : function (tablename, param, successCallback, errorCallback) {
            var result = null;
            result = this.CommonOrmAjax("PUT", this.tableUrl + tablename, param, successCallback, errorCallback);
            return result;
        },
        /**
         * 通用查询方法
         * @param tablename 表名
         * @param columns 返回字段
         * @param condition 查询条件
         * @param isDistinct 是否过滤重复数据
         * @param order 排序条件
         * @returns {*}
         */
        query : function (tablename, columns, condition, isDistinct, order) {
            var clumnList = JSON.parse((columns));
            var cnameList = [];
            var i;
            for (i = 0; i < clumnList.length; i++) {
                var cname = {};
                cname.cname = clumnList[i];
                cnameList.push(cname);
            }
            var paramObj = {};
            paramObj.columns = cnameList;
            paramObj.condition = condition;
            if (isDistinct !== undefined && isDistinct) {
                paramObj.isDistinct = true;
            }
            if (order !== undefined) {
                paramObj.orders = order;
            }
            var url_param = this.tableUrl + tablename + "?param=" + encodeURIComponent(JSON.stringify(paramObj));
            var data = null;
            data = this.CommonOrmAjax("GET", url_param, undefined, undefined, undefined);
            return data;
        }
    }
    $.designerOrmBase = new DesignerOrmBase();
    win.DesignerOrmBase = DesignerOrmBase;
    $.designerAjax = $.designerOrmBase.CommonOrmAjax;
})(jQuery, window)