
var viewoperator;
setOperator();
var vm1474960852390 = avalon.define({$id: 'vm1474960852390',
    image1474961026753:'', 
    image1474961026753_form_disabled : false,
});

setVMToMap(vm1474960852390);
var  vm1474960852390_attributes = {"attributes":[{"name":"type","value":"image","compid":"image1474961026753"},{"name":"init","value":"true","compid":"image1474961026753"},{"name":"compid","value":"image1474961026753","compid":"image1474961026753"},{"name":"compname","value":"image1474961026753","compid":"image1474961026753"},{"name":"imgalt","value":"图片","compid":"image1474961026753"},{"name":"zoomin","value":"true","compid":"image1474961026753"},{"name":"imgwidth","value":"150","compid":"image1474961026753"},{"name":"imgheight","value":"150","compid":"image1474961026753"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;pro_type.jpg","compid":"image1474961026753"}]};
setCustomAttributes(vm1474960852390_attributes);

    var  vm1474960853661_attributes = {"attributes":[{"name":"type","value":"separator","compid":"separator1474961858275"},{"name":"init","value":"true","compid":"separator1474961858275"},{"name":"picklinecolor","value":"828282","compid":"separator1474961858275"},{"name":"compid","value":"separator1474961858275","compid":"separator1474961858275"},{"name":"compname","value":"separator1474961858275","compid":"separator1474961858275"},{"name":"picklineheight","value":"1px","compid":"separator1474961858275"},{"name":"separatortitle","value":"数据模型","compid":"separator1474961858275"},{"name":"type","value":"separator","compid":"separator1474962081856"},{"name":"init","value":"true","compid":"separator1474962081856"},{"name":"picklinecolor","value":"828282","compid":"separator1474962081856"},{"name":"compid","value":"separator1474962081856","compid":"separator1474962081856"},{"name":"compname","value":"separator1474962081856","compid":"separator1474962081856"},{"name":"picklineheight","value":"1px","compid":"separator1474962081856"},{"name":"separatortitle","value":"类型","compid":"separator1474962081856"},{"name":"type","value":"separator","compid":"separator1474962698361"},{"name":"init","value":"true","compid":"separator1474962698361"},{"name":"picklinecolor","value":"828282","compid":"separator1474962698361"},{"name":"compid","value":"separator1474962698361","compid":"separator1474962698361"},{"name":"compname","value":"separator1474962698361","compid":"separator1474962698361"},{"name":"picklineheight","value":"1px","compid":"separator1474962698361"},{"name":"separatortitle","value":"流程模型","compid":"separator1474962698361"}]};
setCustomAttributes(vm1474960853661_attributes);




$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1474960852390);
    visiableComponent();
    avalon.scan(document.getElementById("vm1474960852390"));
    initComponent('undefined',vm1474960853661);
var table_base_local1474961932940 = bootstrapTable('table_base_local1474961932940', adjustTableParam('table_base_local1474961932940','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"400","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1474961932940","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1474961932940","idField":"$id","pk":["$id"],"columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"id","title":"表单标识","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474961932940","width":""},{"field":"name","title":"表单名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474961932940","width":""},{"field":"pro_model","title":"流程模型","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474961932940","width":""},{"field":"pro_package","title":"业务应用包","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474961932940","width":""},{"field":"data_model","title":"数据模型","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474961932940","width":""},{"field":"status","title":"状态","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474961932940","width":""},{"field":"modify_time","title":"修改时间","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474961932940","width":""}],"data":[]})); 
    $('#table_base_local1474961932940').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474961932940') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474961932940') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474961932940') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474961932940') 
    });
var table_base_local1474962136794 = bootstrapTable('table_base_local1474962136794', adjustTableParam('table_base_local1474962136794','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"400","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1474962136794","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1474962136794","idField":"$id","pk":["$id"],"columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"id","title":"表单标识","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962136794","width":""},{"field":"name","title":"表单名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962136794","width":""},{"field":"pro_model","title":"流程模型","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962136794","width":""},{"field":"pro_package","title":"业务应用包","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962136794","width":""},{"field":"data_model","title":"数据模型","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962136794","width":""},{"field":"status","title":"状态","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962136794","width":""},{"field":"modify_time","title":"修改时间","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962136794","width":""}],"data":[]})); 
    $('#table_base_local1474962136794').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474962136794') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474962136794') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474962136794') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474962136794') 
    });
var table_base_local1474962771099 = bootstrapTable('table_base_local1474962771099', adjustTableParam('table_base_local1474962771099','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"400","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1474962771099","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1474962771099","idField":"$id","pk":["$id"],"columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"id","title":"表单标识","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962771099","width":""},{"field":"name","title":"表单名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962771099","width":""},{"field":"pro_model","title":"流程模型","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962771099","width":""},{"field":"pro_package","title":"业务应用包","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962771099","width":""},{"field":"data_model","title":"数据模型","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962771099","width":""},{"field":"status","title":"状态","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962771099","width":""},{"field":"modify_time","title":"修改时间","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474962771099","width":""}],"data":[]})); 
    $('#table_base_local1474962771099').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474962771099') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474962771099') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474962771099') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474962771099') 
    });
    controlTableToolbar();
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


