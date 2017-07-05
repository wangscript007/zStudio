

var viewoperator;
setOperator();
var vm1436342456227 = avalon.define({$id: 'vm1436342456227',
    name: '',
    name_form_disabled : false,
    status: '待发布',
    status_form_disabled : false,
    submit:function() {
        return formOperator(vm1436342456227, 'bcp_re_form', 'POST', 'bcp');
    },
    reset:function() {
        initVMProperties(vm1436342456227);
        updateVMForComponentStatus(vm1436342456227, viewoperator);
    }
});

setVMToMap(vm1436342456227);
var  vm1436342456227_attributes = {"attributes":[{"name":"type","value":"select_static","compid":"formstatus"},{"name":"init","value":"true","compid":"formstatus"},{"name":"compid","value":"formstatus","compid":"formstatus"},{"name":"compname","value":"select_static3","compid":"formstatus"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"formstatus"},{"name":"optionvalue","value":"   待发布:待发布\n已发布:已发布\n已禁用:已禁用   ","compid":"formstatus"},{"name":"fieldtype","value":"varchar","compid":"formstatus"},{"name":"field","value":"status","compid":"formstatus"},{"name":"defaultvalue","value":"待发布","compid":"formstatus"}]};
setCustomAttributes(vm1436342456227_attributes);

var  vm1436940816715_attributes = {"attributes":[]};
setCustomAttributes(vm1436940816715_attributes);




function getEditorItem() {
    var editors = new Array();
    editors.push({field:'name_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}})
    editors.push({field:'status_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}})
    return editors;
}
var getModelName = function(value, row, index){
	var data = $.designerOrmBase.query("data_model_info_table", '["name"]', {"cname" : "id","value" : value,"compare" : "="},true);
	var modelidArray = data.rows;
	//return '<a target="" href="data_model_detail.html?operator=view&modelId=' + value + '">' + modelidArray[0].name + '</a>';
	return '<p>' + modelidArray[0].name + '</p>';
}
$(document).ready(function(){
    var search = (pageParams == undefined?window.location.search:pageParams);
    var packageId = getUrlParam("packageId", search);
    $("#addForm").click(function(event) {
        showModalDialog('dialog1', '新增表单','bpm-form.html?operator=add&packageId='+packageId);
    });
	$("#editForm").click(function(event) {
		var rows = getTableSelectData("formlist_table");
		if(rows.length == 0) {
			bootbox.alert("请选择一条数据");
				return;
			}else if(rows.length > 1){
			bootbox.alert("有且只能选择一条数据修改");
				return;	
			}
		showModalDialog("dialog1", "修改表单", "bpm-form.html?operator=edit&formurl=" + rows[0]["formurl"]+'&packageId='+packageId);
       // showModalDialog('dialog1', '新增表单','bpm-form.html?operator=add&packageId='+packageId);
    });
    initVMData(vm1436342456227, 'bcp_re_form', 'bcp');
    initComponent('bcp',vm1436342456227);
    updateVMForComponentStatus(vm1436342456227, viewoperator)
    $("#button28").on('click', function() {
        getQueryCon("formlist_table")
    });
    visiableComponent();
    avalon.scan(document.getElementById("vm1436342456227"));
    var condition = {"cname" : "packageid","value" : packageId,"compare" : "="};
    var url = {"columns":[{"cname":"id"},{"cname":"name"},{"cname":"type"},{"cname":"formurl"},{"cname":"modelid"},{"cname":"status"},{"cname":"creator"},{"cname":"createTime"}],"orders":[],"condition":condition};
    table = bootstrapTable('formlist_table', adjustTableParam('formlist_table','bcp', 'bcp_re_form', {"method":"get","url":"http://10.74.216.19:8080/dataservice/orm/table/bcp_re_form?param="+encodeURIComponent(JSON.stringify(url)),"cache":false,"pagination":true,"pageSize":"20","pageList":[50,100,200],"height":"650","search":false,"showColumns":false,"showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"formlist_table","columns":[{"field":"state_form_disabled","checkbox":true},{"field":"id","title":"表单ID","width":"","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}},{"field":"name","title":"名称","width":"","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}},{"field":"formurl","title":"URL","width":"","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"showUrl","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}},{"field":"modelid","title":"数据模型","width":"10%","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"getModelName","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}},{"field":"status","title":"状态","width":"10%","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}},{"field":"creator","title":"创建者","width":"10%","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}},{"field":"createTime","title":"创建时间","width":"10%","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}},{"field":"type","title":"类型","width":"","align":"left","halign":"left","primarykey":false,"visible":true,"formatter":"","tableId":"formlist_table","searchcondition":{"checked":false,"condition":"","value":""}}]}));
    controlTableToolbar('formlist_table');
    $('#formlist_table').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('formlist_table')
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('formlist_table')
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('formlist_table')
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('formlist_table')
    });
    controlTableToolbar();
});


$(document).ready(function(){

})
