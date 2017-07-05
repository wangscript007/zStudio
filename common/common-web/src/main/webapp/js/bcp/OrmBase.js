
/**
 * ORM的通用操作
 */
function OrmBase() {
    this.ip = null;
    this.port = null;
    this.tableUrl = "/bpm/orm/table/";
}

/**
 * 获取服务端IP
 */
OrmBase.prototype.getIp = function () {
    if (this.ip == null) {
        this.ip = window.location.hostname;
    }
    return this.ip;
}

/**
 * 获取服务端ORM端口
 */
OrmBase.prototype.getPort = function () {
    if (this.port == null) {
        this.port = window.location.port;
    }
    return this.port;
}

OrmBase.prototype.getUrlPrefix = function () {
    var url = "http://" + this.getIp();
	//分布式部署后，没有加端口号
	if(this.getPort() != ""){
		url += ":" + this.getPort();
	}
	url += this.tableUrl;
	return url;
}

/**
 * 删除表中的记录
 * @param tableId
 * @param con
 */
OrmBase.prototype.deleteRecord = function (tableId, con) {
    var url = "/bpm/orm/table/" + tableId;
    $.ajax({
        type: "DELETE",
        url: url,
        data: con,
        datatype: 'json',
        //contentType: 'text/plain;charset=UTF-8',
        contentType :'application/json; charset=UTF-8',
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
}

/**
 * 获取表格选中的条件
 * @param tableId
 * @param keyColumn
 */
OrmBase.prototype.getCondition = function (tableId, keyColumn) {
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
OrmBase.prototype.insert = function (tablename, columnsArray, values) {
    var param = {};
    var columns = {};
    var columnList = JSON.parse((columnsArray));
    var valueList = JSON.parse((values));
    var returnObj;
    if (columnList.length != valueList.length) {
        bootbox.alert("字段个数与取值个数不一致");
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
                returnObj = data;
                if (data.status == 1) {
                    //bootbox.alert("操作成功");
                }else{
                    bootbox.alert("插入数据失败")
                }
            },
            error: function (XMLHttpRequest,
                             textStatus, errorThrown) {
                errorCallback(textStatus,
                    errorThrown,
                    this.getUrlPrefix() + tablename);
            }
        });
    }
    return returnObj;
}

/**
 * 通用修改记录方法
 * @param tablename
 * @param columns
 * @param values
 */
OrmBase.prototype.update = function (tablename, columnsArray, values, condition) {
    var param = {};
    var columns = {};
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
        $.ajax({
            type: 'PUT',
            dataType: 'JSON',
            contentType :'application/json; charset=UTF-8',
            async: false,
            url: this.getUrlPrefix() + tablename,
            data: JSON.stringify(param),
            success: function (data) {
                if (data.status == 1) {
                    bootbox.alert("操作成功");
                }else{
                    bootbox.alert("操作失败")
                }
            },
            error: function (XMLHttpRequest,
                             textStatus, errorThrown) {
                errorCallback(textStatus,
                    errorThrown,
                    this.getUrlPrefix() + tablename);
            }
        });
    }
}

/**
 * 通用删除方法
 * @param tablename
 * @param condition
 */
OrmBase.prototype.delete = function (tablename, condition) {
    var url = this.getUrlPrefix() + tablename + "?param="
        + encodeURIComponent(JSON.stringify({
            condition: condition
        }));
    $.ajax({
        type: 'DELETE',
        async: false,
        url: url,
        contentType: 'application/json; charset=UTF-8',
        success: function (data) {

        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorCallback(textStatus, errorThrown, url);
        }
    });
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
OrmBase.prototype.query = function (tablename, columns, condition, isDistinct,order) {
	var that = this;
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
		paramObj.order = order;
	}
    var url_param = that.getUrlPrefix() + tablename + "?param=" + encodeURIComponent(JSON.stringify(paramObj));
    var data = null;
    $.ajax({
        url: url_param,
        type: 'get',
        dataType: 'json',
        cache: false,
        async: false,
        success: function (json) {
            currentNode = json.rows;
            data = json;
        },
        error: function (XMLHttpRequest,
                         textStatus, errorThrown) {
            errorCallback(textStatus,
                errorThrown,
                that.getUrlPrefix() + tablename);
        }
    });
    return data;
}

var ormBase = new OrmBase();
