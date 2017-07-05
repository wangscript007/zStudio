
var viewoperator;
setOperator();
var vm1474959854303 = avalon.define({$id: 'vm1474959854303',
    image1474959873917:'', 
    image1474959873917_form_disabled : false,
});

setVMToMap(vm1474959854303);
var  vm1474959854303_attributes = {"attributes":[{"name":"type","value":"image","compid":"image1474959873917"},{"name":"init","value":"true","compid":"image1474959873917"},{"name":"compid","value":"image1474959873917","compid":"image1474959873917"},{"name":"compname","value":"image1474959873917","compid":"image1474959873917"},{"name":"imgalt","value":"图片","compid":"image1474959873917"},{"name":"zoomin","value":"true","compid":"image1474959873917"},{"name":"imgwidth","value":"150","compid":"image1474959873917"},{"name":"imgheight","value":"150","compid":"image1474959873917"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;pro_type.jpg","compid":"image1474959873917"}]};
setCustomAttributes(vm1474959854303_attributes);

var vm1474959861596 = avalon.define({$id: 'vm1474959861596',
    select_dynamic1474960559976:'1', 
    select_dynamic1474960559976_form_disabled : false,
});

function getVMData() {
    return vm1474959861596.$model;
}
    var  vm1474959861596_attributes = {"attributes":[{"name":"type","value":"separator","compid":"separator1474960019405"},{"name":"init","value":"true","compid":"separator1474960019405"},{"name":"picklinecolor","value":"828282","compid":"separator1474960019405"},{"name":"compid","value":"separator1474960019405","compid":"separator1474960019405"},{"name":"compname","value":"separator1474960019405","compid":"separator1474960019405"},{"name":"picklineheight","value":"1px","compid":"separator1474960019405"},{"name":"separatortitle","value":"数据源","compid":"separator1474960019405"},{"name":"type","value":"select_dynamic","compid":"select_dynamic1474960559976"},{"name":"init","value":"true","compid":"select_dynamic1474960559976"},{"name":"compid","value":"select_dynamic1474960559976","compid":"select_dynamic1474960559976"},{"name":"compname","value":"select_dynamic1474960559976","compid":"select_dynamic1474960559976"},{"name":"isormds","value":"true","compid":"select_dynamic1474960559976"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic1474960559976"},{"name":"optionvalue","value":"已发布:1;\n编辑中:2","compid":"select_dynamic1474960559976"},{"name":"defaultvalue","value":"1","compid":"select_dynamic1474960559976"}]};
setCustomAttributes(vm1474959861596_attributes);




function getEditorItem() {
    var editors = new Array();
    editors.push({field:'select_dynamic1474960559976_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1474959854303);
    visiableComponent();
    avalon.scan(document.getElementById("vm1474959854303"));
    initComponent('undefined',vm1474959861596);
var table_base_local1474960150258 = bootstrapTable('table_base_local1474960150258', adjustTableParam('table_base_local1474960150258','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"350","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1474960150258","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1474960150258","idField":"$id","pk":["$id"],"columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"id","title":"模型标识","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474960150258","width":""},{"field":"name","title":"模型名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474960150258","width":""},{"field":"status","title":"模型状态","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474960150258","width":""},{"field":"datasource","title":"数据源","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474960150258","width":""},{"field":"modifytime","title":"修改时间","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474960150258","width":""},{"field":"createtime","title":"创建时间","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474960150258","width":""}],"data":[]})); 
    $('#table_base_local1474960150258').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474960150258') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474960150258') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474960150258') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474960150258') 
    });
    controlTableToolbar();
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


