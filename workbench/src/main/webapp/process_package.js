
var vm1474426515308 = avalon.define({$id: 'vm1474426515308',
    image1471947010479:'', 
    image1471947010479_form_disabled : false,
    input_text1474426328061:'', 
    input_text1474426328061_form_disabled : false,
});

function getVMData() {
    return vm1474426515308.$model;
}
    var  vm1474426515308_attributes = {"attributes":[{"name":"type","value":"image","compid":"image1471947010479"},{"name":"init","value":"true","compid":"image1471947010479"},{"name":"compid","value":"image1471947010479","compid":"image1471947010479"},{"name":"compname","value":"image1471947010479","compid":"image1471947010479"},{"name":"imgalt","value":"图片","compid":"image1471947010479"},{"name":"zoomin","value":"true","compid":"image1471947010479"},{"name":"imgwidth","value":"100","compid":"image1471947010479"},{"name":"imgheight","value":"100","compid":"image1471947010479"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;pro_type.jpg","compid":"image1471947010479"},{"name":"type","value":"separator","compid":"separator1471945693165"},{"name":"init","value":"true","compid":"separator1471945693165"},{"name":"picklinecolor","value":"828282","compid":"separator1471945693165"},{"name":"compid","value":"separator1471945693165","compid":"separator1471945693165"},{"name":"compname","value":"separator1471945693165","compid":"separator1471945693165"},{"name":"picklineheight","value":"1px","compid":"separator1471945693165"},{"name":"separatortitle","value":"业务应用包管理","compid":"separator1471945693165"},{"name":"buttonicon","value":"glyphicon glyphicon-th","compid":"separator1471945693165"}]};
setCustomAttributes(vm1474426515308_attributes);




function getEditorItem() {
    var editors = new Array();
    editors.push({field:'input_text1474426328061_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('bcp',vm1474426515308);
var table_base1474433182558 = bootstrapTable('table_base1474433182558', adjustTableParam('table_base1474433182558','bcp', 'bcp_re_processpackage', {"method":"get","contentType":null,"url":"http://10.74.65.161:9080/dsp/orm/table/bcp_re_processpackage?param=%7B%22columns%22%3A%5B%7B%22cname%22%3A%22PACKAGENAME%22%7D%2C%7B%22cname%22%3A%22HASDATAMODE%22%7D%2C%7B%22cname%22%3A%22HASFORM%22%7D%2C%7B%22cname%22%3A%22HASPROCESS%22%7D%2C%7B%22cname%22%3A%22HASPUBLISHED%22%7D%2C%7B%22cname%22%3A%22ID%22%7D%2C%7B%22cname%22%3A%22DESC%22%7D%5D%2C%22orders%22%3A%5B%5D%2C%22condition%22%3A%7B%7D%7D","cache":false,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"500","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base1474433182558","showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1474433182558","defaultcondition":[],"responseHandler":"tableResponseHandler","pk":[],"editable":true,"columns":[{"field":"state_form_disabled","checkbox":true},{"title":"名称","field":"PACKAGENAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"nameFormatter","tableId":"table_base1474433182558","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"数据模型","field":"HASDATAMODE","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"bitHasFormatter","tableId":"table_base1474433182558","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"表单","field":"HASFORM","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"bitHasFormatter","tableId":"table_base1474433182558","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"流程","field":"HASPROCESS","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"bitHasFormatter","tableId":"table_base1474433182558","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"是否发布到模拟平台","field":"HASPUBLISHED","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"bitFormatter","tableId":"table_base1474433182558","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"ID","field":"ID","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":false,"formatter":"","tableId":"table_base1474433182558","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"操作","field":"DESC","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"operFormatter","tableId":"table_base1474433182558","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}}]})); 
    $('#table_base1474433182558').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base1474433182558') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base1474433182558') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base1474433182558') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base1474433182558') 
    });
    $("#button1475046205281").on('click', function() {
        searchPackage();
    });
    $('#vm1474426515308').bootstrapValidator({
        fields:{
            input_text1474426328061:{
                validators: {
                }
            }   
        }
    });
    controlTableToolbar();
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


