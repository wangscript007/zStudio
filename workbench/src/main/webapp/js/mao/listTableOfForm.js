/**
 *
 */

var envBase = new EnvBase();

function getQueryCon(tableid) {
    var conditions = new Array();
    var formname = $("#formname").val();
    var formstatus = $("#formstatus").val();
    if (formname != null && formname.length > 0) {
        conditions.push(condition("name", "like", formname));
    }
    if (formstatus != null && formstatus.length > 0) {
        conditions.push(condition("status", "=", formstatus));
    }
    queryLayoutitTable(tableid, conditions);
}

function deleteSome(tableId) {
    deleteFromLayoutitTable(tableId,"formurl");
}

function editRow() {
    var rows = getTableSelectData("formlist_table");
    if(rows.length == 0) {
        bootbox.alert("请选择一条数据");
        return;
    }
    showModalDialog("dialog1", "修改表单", "bpm-form.html?operator=edit&formurl=" + rows[0]["formurl"]);
}


var queryLayoutitTable = function (id, conditions) {
    queryRemoteTable(id, conditions);
}

/**
 * 删除Layoutit表格被选中的记录，适用于单一主键
 * @param tableId
 * @param clumnName 主键字段名(表格字段名需要一致)
 */
var condition = function (cname, compare, value) {
    var condition = new QueryCondition();
    if (compare == "like") {
        condition.setCName(cname).setCompare(compare).setValue("%" + value + "%");
    } else {
        condition.setCName(cname).setCompare(compare).setValue(value);
    }
    return condition;
}
var deleteFromLayoutitTable = function (tableId, clumnName) {
    var rows = getTableSelectData(tableId);
    if (rows.length > 0) {
        var conditions = new Array();
        $.each(rows, function (index, item) {
            conditions.push(condition(clumnName, "=", item[clumnName]));
        });
        deleteRemoteTableData(tableId, generateCondition(conditions, "or"));
    } else {
        bootbox.alert("请选择一条数据");
    }
}


/**
 * 字段格式化
 */
function showUrl(value, row) {
	var url = value+"&pname=default&version=1.0";
	var dataModelId = row.modelid;
	if(row.type === "表单" || row.type === "列表"){
			return '<a target="_black' + Math.random() + '" ' + '" href="http://' + envBase.getIp() + ':' + envBase.getFormDesignerPort() + '/designer/index.html?file='+encodeURIComponent(url)+'&dmid=' + dataModelId + '">' + value.split("$")[1] + '</a>';
	}else if(row.type === "报表"){
			return '<a target="_black' + Math.random() + '" ' + '" href="http://' + envBase.getIp() + ':' + envBase.getFormDesignerPort() + '/datavisual/index.html?file='+encodeURIComponent(url)+' ">' + value.split("$")[1] + '</a>';
		}
    
}
