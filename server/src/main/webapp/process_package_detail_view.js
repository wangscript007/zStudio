
var  vm1488943782533_attributes = {"attributes":[]};
var packageId = getUrlParam("packageId", pageParams);
var pre_chart = 'userforms/datavisual/';
var pre_form_list = 'userforms/form/';
setCustomAttributes(vm1488943782533_attributes);

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('bcp',vm1488943782533);

	setTimeout(loadTableData,100);

	var switchDiv = $('div[type="m_switch"]');
	if(typeof switchDiv.initializtionSwitch === 'function') {
		switchDiv.initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});

function table_base1488943799355TableParamConfig(param) {
	var url = param.url;
	var obj = JSON.parse(decodeURIComponent(url.substring(url.indexOf("param=") + 6)));
	var conditions = [];
	var condition = new QueryCondition();
	condition.setCName("packageid").setCompare("=").setValue(packageId);
	conditions.push(condition);
	obj.condition = generateCondition(conditions, "or");

	url = url.substring(0, url.indexOf("param=")) + "param=" + JSON.stringify(obj);
	param.url = url;
	//这里必须return
	return param;
}

function urlFormat(param, row) {
	debugger;
	if (row.type == '图表') {
		return pre_chart + param.replace('$', '/');
	} else if (row.type == '列表' || row.type == '表单') {
		return pre_form_list + param.replace('$', '/');
	} else {
		return param.replace('$', '/');
	}
}

function loadTableData() {
	var table_base1488943799355 = bootstrapTable('table_base1488943799355',
		adjustTableParam('table_base1488943799355','bcp', 'bcp_re_form',
			{"method":"get","contentType":null,"url":"http://:/dataservice/orm/table/bcp_re_form?param=%7b%22columns%22%3a%5b%7b%22cname%22%3a%22name%22%7d%2c%7b%22cname%22%3a%22type%22%7d%2c%7b%22cname%22%3a%22formurl%22%7d%2c%7b%22cname%22%3a%22createTime%22%7d%5d%2c%22orders%22%3a%5b%7b%22field%22%3a%22createTime%22%2c%22order%22%3a%22desc%22%7d%5d%2c%22condition%22%3a%7b%7d%7d",
				"cache":false,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"360","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base1488943799355",
				"showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1488943799355",
				"defaultcondition":[],"responseHandler":"tableResponseHandler","pk":[],"editable":true,
				"columns":[{"title":"页面名称","field":"name","width":"110","editable":false,
					"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1488943799355",
					"defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},
					{"title":"类型","field":"type","width":"50","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,
						"formatter":"","tableId":"table_base1488943799355", "defaultcondition":{"checked":false,"condition":"","value":""},
						"searchcondition":{"checked":false,"condition":"","value":""}},
					{"title":"链接地址","field":"formurl","width":"310","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,
						"formatter":"urlFormat","tableId":"table_base1488943799355","defaultcondition":{"checked":false,"condition":"","value":""},
						"searchcondition":{"checked":false,"condition":"","value":""}},
					{"title":"创建时间","field":"createTime","width":"130","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,
						"formatter":"","tableId":"table_base1488943799355", "defaultcondition":{"checked":false,"condition":"","value":""},
						"searchcondition":{"checked":false,"condition":"","value":""}}]}));
}


