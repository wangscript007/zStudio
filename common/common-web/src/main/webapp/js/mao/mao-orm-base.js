/**
 * ORM的通用操作
 */
function MaoOrmBase() {
    this.ip = null;
    this.port = "8080";
    this.tableUrl = "orm/table/";
}
MaoOrmBase.STATUS_SUCCESS = 1;
MaoOrmBase.STATUS_FAIL = 0;
/**
 * 获取服务端IP
 */
MaoOrmBase.prototype.getIp = function () {
    if (this.ip == null) {
        this.ip = window.location.hostname;
    }
    return this.ip;
}

MaoOrmBase.prototype.getUrlPrefix = function () {
    return this.tableUrl;
}

/**
 * 删除表中的记录
 * @param tableId
 * @param con
 */
MaoOrmBase.prototype.deleteRecord = function (tableId, con) {
    var url = this.tableUrl + tableId;
    $.ajax({
        type: "DELETE",
        url: url,
        data: con,
        datatype: 'json',
        //contentType: 'text/plain;charset=UTF-8',
        contentType :'application/json; charset=UTF-8',
        async: false,
        success: function (data, textStatus) {
			tipBox.showMessage('删除数据成功。', 'info');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("textStatus " + textStatus + " errorThrown "
                + errorThrown + " url " + esbinfo + url);
			tipBox.showMessage('删除数据失败。', 'error');
        }
    });
}

/**
 * 获取表格选中的条件
 * @param tableId
 * @param keyColumn
 */
MaoOrmBase.prototype.getCondition = function (tableId, keyColumn) {
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
}

/**
 * 通用添加记录方法
 * @param tablename
 * @param columns
 * @param values
 */
MaoOrmBase.prototype.insert = function (tablename, columnsArray, values,callback) {
    var param = {};
    var columns = {};
    var result;
    var columnList = JSON.parse((columnsArray));
    var valueList = JSON.parse((values));
    if (columnList.length != valueList.length) {
		tipBox.showMessage('字段个数与取值个数不一致', 'error');
    } else {
        var i;
        for (i = 0; i < columnList.length; i++) {
            var str = "columns." + columnList[i] + "=valueList[i]";
            eval(str);
        }
        param.columns = columns;
        $.ajax({
            type: 'POST',
            dataType: 'JSON',
            contentType :'application/json; charset=UTF-8',
            async: false,
            url: this.getUrlPrefix() + tablename,
            data: JSON.stringify(param),
            success: function (data) {
                result = data;
				if(callback){
					callback(data);
				}else{
					if (data.status == MaoOrmBase.STATUS_SUCCESS) {
						tipBox.showMessage('操作成功', 'info');
					}else{
						tipBox.showMessage('操作失败', 'error');
                        console.error(data);
					}
				}                
            },
            error: function (XMLHttpRequest,
                             textStatus, errorThrown) {
                errorCallback(textStatus, errorThrown, tablename);
            }
        });
    }
    return result;
}

/**
 * 通用修改记录方法
 * @param tablename
 * @param columns
 * @param values
 */
MaoOrmBase.prototype.update = function (tablename, columnsArray, values, condition,callback) {
    var param = {};
    var columns = {};
    var result;
    var columnList = JSON.parse((columnsArray));
    var valueList = JSON.parse((values));
    if (columnList.length != valueList.length) {
		tipBox.showMessage('字段个数与取值个数不一致', 'error');
    } else {
        var i;
        for (i = 0; i < columnList.length; i++) {
            var str = "columns." + columnList[i] + "=valueList[i]";
            eval(str);
        }
        param.columns = columns;
        param.condition = condition;
        $.ajax({
            type: 'PUT',
            dataType: 'JSON',
            contentType :'application/json; charset=UTF-8',
            async: false,
            url: this.getUrlPrefix() + tablename,
            data: JSON.stringify(param),
            success: function (data) {
                result = data;
                if(callback){
					callback(data);
				}else{
					if (data.status == MaoOrmBase.STATUS_SUCCESS) {
						tipBox.showMessage('操作成功', 'info');
					}else{
						tipBox.showMessage('操作失败', 'error');
						console.error(data);
					}
				}  
            },
            error: function (XMLHttpRequest,
                             textStatus, errorThrown) {
                errorCallback(textStatus,errorThrown, tablename);
            }
        });
    }
    return result;
}
MaoOrmBase.prototype.updateBatch = function (tablename,param,successCallback,errorCallback) {
    var result = null;

        $.ajax({
            type: 'PUT',
            dataType: 'JSON',
            contentType :'application/json; charset=UTF-8',
            async: false,
            url: this.getUrlPrefix() + tablename,
            data: JSON.stringify(param),
            success: function (data) {
                result = data;
                if(successCallback){
                    successCallback(data);
                }else{
                    if (data.status == MaoOrmBase.STATUS_SUCCESS) {
                        tipBox.showMessage('操作成功', 'info');
					}else{
						tipBox.showMessage('操作失败', 'error');
                        console.error(data);
                    }
                }
            },
            error: function (XMLHttpRequest,
                             textStatus, errorThrown) {
                if(typeof errorCallback === "function"){
                    errorCallback(textStatus,errorThrown, tablename);
                }else{
                    console.log("请求服务错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
                }

            }
        });
    return result;
}


/**
 * 通用删除方法
 * @param tablename
 * @param condition
 */
MaoOrmBase.prototype.delete = function (tablename, condition,callback) {
    var result;
    var url = this.getUrlPrefix() + tablename + "?param="
        + encodeURIComponent(JSON.stringify({
            condition: condition
        }));
    $.ajax({
        type: 'DELETE',
		dataType: 'json',
        async: false,
        url: url,
        contentType: 'application/json; charset=UTF-8',
        success: function (data) {
            result = data;
			if(callback){
				callback(data);
			}else{
				if (data.status == MaoOrmBase.STATUS_SUCCESS) {
					tipBox.showMessage('操作成功', 'info');
				}else{
					tipBox.showMessage('操作失败', 'error');
                    console.error(data);
				}
			}     
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorCallback(textStatus, errorThrown, url);
        }
    });

    return result;
}

/**
 * 通用查询方法
 * @param tablename 表名
 * @param columns 返回字段
 * @param condition 查询条件
 * @param isDistinct 是否过滤重复数据
 * @param order 排序条件
 * @returns {*}
 */
MaoOrmBase.prototype.query = function (tablename, columns, condition, isDistinct,order) {
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
    if(isDistinct !== undefined && isDistinct) {
        paramObj.isDistinct = true;
    }
	if(order !== undefined){
		paramObj.orders = order;
	}
    var url_param = this.getUrlPrefix() + tablename + "?param=" + encodeURIComponent(JSON.stringify(paramObj));
    var data = null;
    $.ajax({
        url: url_param,
        type: 'get',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (json) {
            if(json.status === MaoOrmBase.STATUS_FAIL){
                tipBox.showMessage('查询失败。', 'error');
                console.error(json);
                json.rows = [];
            }
            data = json;
        },
        error: function (XMLHttpRequest,
                         textStatus, errorThrown) {
            errorCallback(textStatus, errorThrown, tablename);
        }
    });
    return data;
}

var maoOrmBase = new MaoOrmBase();
