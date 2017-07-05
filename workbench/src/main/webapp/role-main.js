
var vm1449647616006 = avalon.define({$id: 'vm1449647616006',
    NAME: '', 
    NAME_form_disabled : false,
    DESC: '', 
    DESC_form_disabled : false,
    query:function() { 
        queryOperator(vm1449647616006, 'table_base1449647721791');
    }
});

function getVMData() {
    return vm1449647616006.$model;
}
    var  vm1449647616006_attributes = {"attributes":[]};
setCustomAttributes(vm1449647616006_attributes);



var viewoperator;
setOperator();
var vm1449825112639 = avalon.define({$id: 'vm1449825112639',
    submit:function() { 
        return formOperator(vm1449825112639, 'role', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1449825112639);
        updateVMForComponentStatus(vm1449825112639, viewoperator);
    }
});

setVMToMap(vm1449825112639);
var  vm1449825112639_attributes = {"attributes":[]};
setCustomAttributes(vm1449825112639_attributes);


function getEditorItem() {
    var editors = new Array();
    editors.push({field:'NAME_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'DESC_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
    initComponent('bcp',vm1449647616006);
    table = bootstrapTable('table_base1449647721791', adjustTableParam('table_base1449647721791','bcp', 'role', {"method":"get","contentType":null,"url":"oa/orm/table/role?param=%7B%22columns%22%3A%5B%7B%22cname%22%3A%22NAME%22%7D%2C%7B%22cname%22%3A%22ID%22%7D%2C%7B%22cname%22%3A%22DESC%22%7D%2C%7B%22cname%22%3A%22DISOPERATOR_KEYS%22%7D%5D%2C%22orders%22%3A%5B%5D%2C%22condition%22%3A%7B%7D%7D","cache":false,"pagination":true,"pageSize":"100","pageList":[10,20,50,100,200],"height":"500","search":false,"showColumns":false,"showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1449647721791","defaultcondition":[],"pk":["ID","ID"],"editable":true,"columns":[{"field":"state_form_disabled","checkbox":true},{"title":"角色名","field":"NAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1449647721791","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"ID","field":"ID","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":true,"visible":false,"formatter":"","tableId":"table_base1449647721791","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"说明","field":"DESC","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1449647721791","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"DISOPERATOR_KEYS","field":"DISOPERATOR_KEYS","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":false,"formatter":"","tableId":"table_base1449647721791","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}}]})); 
    controlTableToolbar('table_base1449647721791');
    $('#table_base1449647721791').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base1449647721791') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base1449647721791') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base1449647721791') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base1449647721791') 
    });
    $("#button1449647694316").on('click', function() {
        roleModule.queryRole();
    });
    controlTableToolbar();
    PageModelManage.initVMData('table_base1449647721791');
    PageModelManage.initModel('bcp');
    initVMData(vm1449825112639, 'role', 'bcp');
    initComponent('bcp',vm1449825112639);
    updateVMForComponentStatus(vm1449825112639, viewoperator)
    $('#vm1449825112639').bootstrapValidator({
        fields:{
            input_text1449825740672:{
                validators: {
                    notEmpty: {}
                }
            }   
        }
    });
    visiableComponent();
	$("#layout1449825496405").hide();
    avalon.scan(document.getElementById("vm1449825112639"));
});


$(document).ready(function(){

})
