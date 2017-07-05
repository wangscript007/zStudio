
var vm1481504888659 = avalon.define({$id: 'vm1481504888659',
    input_text14815062554490:'',
    input_text14815062680360:'',
});
;

function getVMData() {
    return vm1481504888659.$model;
}
    var  vm1481504888659_attributes = {"attributes":[]};
setCustomAttributes(vm1481504888659_attributes);
(function($, win){
	var DataModelTable = function(){};
	DataModelTable.prototype.operation = function(value, row, index){
		var data = encodeURIComponent(JSON.stringify(row));
		return '<button type="button" data=' + data + ' class="btn btn-primary btn-sm" id="releaseForm" name="releaseForm" style="margin-right:2px" onclick="dataModelTable.rowOperation(this)">表单发布</button><button type="button"  data=' + data + ' class="btn btn-primary btn-sm" id="releaseTable" name="releaseTable" style="margin-right:2px" onclick="dataModelTable.rowOperation(this)">列表发布</button><button type="button"  data=' + data + ' class="btn btn-primary btn-sm" id="releaseReportForm" name="releaseReportForm" style="margin-right:2px" onclick="dataModelTable.rowOperation(this)">报表发布</button>'
	}
	var createEmptyDpf = function (fileName,processid,modelid,tenantid){
		var dataInfo = {
				"frameContent":'',

				"meta":"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">",
				"titile":"",
				"css":[],
				"js":[],
				"body":"<div id=\"chart\" style=\"width: 100%;height:100%;\"></div>",
				"jscode":""
			};

		$.designerAjax('post','/datavisual/jersey-services/layoutit/frame/html/save/'+tenantid+'$'+fileName+'.html&pname=default&version=1.0/',JSON.stringify(dataInfo),sucessFrameFileCallBack,errorFrameFileCallBack);
		$.designerOrmBase.delete("bcp_re_form", {"cname" : "id","value" : processid+"-"+modelid+"-datavisual","compare" : "="}, function(data){if(data.status == 1){createDatavisual(fileName,processid,modelid,tenantid)}}, undefined);
		
		
	}
	var createDatavisual = function(fileName,processid,modelid,tenantid){
		var date = new Date();
		var time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
		var formData = {"columns":{"id":processid+"-"+modelid+"-datavisual","name":processid+"-"+modelid+"-datavisual","type":"报表","status":"已发布","formurl":tenantid+"$"+processid+"-"+modelid+"-datavisual.html","createtime":time,"packageid":processid,"creator":maoEnvBase.getCurrentUserName().split('@')[0],"modelid":modelid}};
		$.designerAjax("post","orm/table/bcp_re_form",JSON.stringify(formData),sucessCallBack,errorCallBack);
	}
	DataModelTable.prototype.rowOperation = function(obj){
		var releaseId = JSON.parse(decodeURIComponent($(obj).attr("data"))).ID;
		var releaseType = obj.id.split("release")[1];
		var search = (pageParams == undefined?window.location.search:pageParams);
		var processid = getUrlParam("packageId", search);
		var tenantid = maoEnvBase.getCurrentTenantId();
		if(releaseType === "Form" || releaseType === "Table"){
			var releaseObj = {};
			releaseObj.modelid = releaseId;
			releaseObj.type = releaseType;
			releaseObj.tenantid = tenantid;
			releaseObj.processid = processid;
			processTools.initForm(releaseObj);
		}else if(releaseType === "ReportForm"){
			var fileName = processid + "-" + releaseId + "-datavisual";
			createEmptyDpf(fileName,processid,releaseId,tenantid);
		}
		
		bootbox.alert("发布成功。");
	}
	DataModelTable.prototype.oneKeyRelease = function(obj){
		var rows = getTableSelectData("table_base1481504947474");
		if(rows.length === 0){
			bootbox.alert("请至少选择一条数据。");
			return;
		}
		var modelid = "";
		var search = (pageParams == undefined?window.location.search:pageParams);
		var processid = getUrlParam("packageId", search);
		var tenantid = maoEnvBase.getCurrentTenantId();
		var type = "";
		if(obj.id === "toolbar-button14815062040920"){
			type = "Form";
			for(var i = 0;i<rows.length;i++){
				modelid = rows[i].ID;
				var itemObj = getItemObj(modelid,type,tenantid,processid);
				processTools.initForm(itemObj);
			}
		}else if(obj.id === "toolbar-button14815062063420"){
			type = "Table";
			for(var i = 0;i<rows.length;i++){
				modelid = rows[i].ID;
				var itemObj = getItemObj(modelid,type,tenantid,processid);
				processTools.initForm(itemObj);
			}
		}else if(obj.id === "toolbar-button14815062084590"){
			for(var i = 0;i<rows.length;i++){
				modelid = rows[i].ID;
				var fileName = processid + "-" + modelid + "-datavisual";
				createEmptyDpf(fileName,processid,modelid,tenantid);
			}
			
		}else if(obj.id === "toolbar-button14815062103300"){
			type = "Both";
			for(var i = 0;i<rows.length;i++){
				modelid = rows[i].ID;
				var itemObj = getItemObj(modelid,type,tenantid,processid);
				processTools.initForm(itemObj);
				var fileName = processid + "-" + modelid + "-datavisual";
				createEmptyDpf(fileName,processid,modelid,tenantid);
			}
		}
		bootbox.alert("发布成功。");
	}
	var getItemObj = function(modelid,type,tenantid,processid){
		var itemObj = {};
		itemObj.modelid = modelid;
		itemObj.type = type;
		itemObj.tenantid = tenantid;
		itemObj.processid = processid;
		return itemObj;
	}
		var sucessCallBack = function(obj){
		if(obj.status == 1){
		}else{
			bootbox.alert("保存信息有误。");
			
		}
	}
	var errorCallBack = function(textStatus, errorThrown, urlAndParam){
		bootbox.alert("保存信息失败。");
		console.log(message = "textStatus " + textStatus + " errorThrown "
						+ errorThrown + " url " + urlAndParam);
		
	}
	var sucessFrameFileCallBack = function(obj){
		if(obj.status == 0){
		}else{
			bootbox.alert("保存数据可视化设计文件有误。");
			
		}
	}
	var errorFrameFileCallBack = function(textStatus, errorThrown, urlAndParam){
		bootbox.alert("保存数据可视化设计文件失败。");
		console.log(message = "textStatus " + textStatus + " errorThrown "
						+ errorThrown + " url " + urlAndParam);
		
	}
	DataModelTable.prototype.getQueryReleaseTable = function (tableid) {
		var conditions = new Array();
		var formname = $("#input_text14815062554490").val();
		var formtype = $("#input_text14815062680360").val();
		if (formname != null && formname.length > 0) {
			conditions.push(bcpBase.condition("name", "=", formname));
		}
		if (formtype != null && formtype.length > 0) {
			conditions.push(bcpBase.condition("bind_table_name", "=", formtype));
		}
		bcpBase.queryLayoutitTable(tableid, conditions);
	}
	win.dataModelTable = new DataModelTable();
})(jQuery, window);
$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('bcp',vm1481504888659);
var table_base1481504947474 = bootstrapTable('table_base1481504947474', adjustTableParam('table_base1481504947474','bcp', 'data_model_info_table', {"method":"get","contentType":null,"url":"http://10.74.65.13:8080/dataservice/orm/table/data_model_info_table?param=%7B%22columns%22%3A%5B%7B%22cname%22%3A%22NAME%22%7D%2C%7B%22cname%22%3A%22ID%22%7D%2C%7B%22cname%22%3A%22BIND_TABLE_NAME%22%7D%2C%7B%22cname%22%3A%22UPDATE_TIME%22%7D%2C%7B%22cname%22%3A%22DESCRIPTION%22%7D%2C%7B%22cname%22%3A%22%22%7D%5D%2C%22orders%22%3A%5B%5D%2C%22condition%22%3A%7B%7D%7D","cache":false,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"500","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base1481504947474","showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1481504947474","defaultcondition":[],"responseHandler":"tableResponseHandler","pk":["ID","ID","ID","ID","ID"],"editable":true,"columns":[{"field":"state_form_disabled","checkbox":true},{"title":"名称","field":"NAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1481504947474","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"ID","field":"ID","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":true,"visible":false,"formatter":"","tableId":"table_base1481504947474","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"绑定表名","field":"BIND_TABLE_NAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1481504947474","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"更新时间","field":"UPDATE_TIME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1481504947474","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"操作","field":"","editable":false,"validate":"","initData":{"defaultValue":"","data":[]},"align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"dataModelTable.operation","tableId":"table_base1481504947474","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}}]})); 
    $('#vm1481504888659').bootstrapValidator({
        fields:{
            input_text14815062554490:{
                validators: {
                }
            }   ,
            input_text14815062680360:{
                validators: {
                }
            }   
        }
    });
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
	$("#button14815062758720").on('click', function() {
        dataModelTable.getQueryReleaseTable("table_base1481504947474");
    });
});


