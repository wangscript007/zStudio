
    var  vm1475890587222_attributes = {"attributes":[]};
setCustomAttributes(vm1475890587222_attributes);



    var  vm1475890635178_attributes = {"attributes":[]};
setCustomAttributes(vm1475890635178_attributes);



var viewoperator;
setOperator();
var vm1475912541457 = avalon.define({$id: 'vm1475912541457',
});

setVMToMap(vm1475912541457);
var  vm1475912541457_attributes = {"attributes":[]};
setCustomAttributes(vm1475912541457_attributes);


$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('bcp',vm1475890587222);
var table_base1475890591243 = bootstrapTable('table_base1475890591243', adjustTableParam('table_base1475890591243','bcp', 'asset_area', {"method":"get","contentType":null,"url":"http://10.74.216.90:8080/dataservice/orm/table/asset_area?param=%7B%22columns%22%3A%5B%7B%22cname%22%3A%22ID%22%7D%2C%7B%22cname%22%3A%22NAME%22%7D%5D%2C%22orders%22%3A%5B%5D%2C%22condition%22%3A%7B%7D%7D","cache":false,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"200","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base1475890591243","showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1475890591243","defaultcondition":[],"responseHandler":"tableResponseHandler","pk":[],"editable":true,"columns":[{"field":"state_form_disabled","radio":true},{"title":"ID","field":"ID","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1475890591243","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"NAME","field":"NAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1475890591243","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}}]})); 
    $('#table_base1475890591243').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base1475890591243') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base1475890591243') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base1475890591243') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base1475890591243') 
    });
    initComponent('bcp',vm1475890635178);
var table_base1475890644611 = bootstrapTable('table_base1475890644611', adjustTableParam('table_base1475890644611','bcp', 'asset_inst_base', {"method":"get","contentType":null,"url":"http://10.74.216.90:8080/dataservice/orm/table/asset_inst_base?param=%7B%22columns%22%3A%5B%7B%22cname%22%3A%22ID%22%7D%2C%7B%22cname%22%3A%22NAME%22%7D%2C%7B%22cname%22%3A%22TYPE%22%7D%5D%2C%22orders%22%3A%5B%5D%2C%22condition%22%3A%7B%7D%7D","cache":false,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"200","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base1475890644611","showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1475890644611","defaultcondition":[],"responseHandler":"tableResponseHandler","pk":[],"editable":true,"columns":[{"field":"state_form_disabled","radio":true},{"title":"ID","field":"ID","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1475890644611","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"NAME","field":"NAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1475890644611","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"TYPE","field":"TYPE","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1475890644611","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}}]})); 
    $('#table_base1475890644611').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base1475890644611') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base1475890644611') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base1475890644611') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base1475890644611') 
    });
    controlTableToolbar();
    initComponent('undefined',vm1475912541457);
    $("#button1475894529098").on('click', function() {
        showDetail();
    });
    visiableComponent();
    avalon.scan(document.getElementById("vm1475912541457"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


