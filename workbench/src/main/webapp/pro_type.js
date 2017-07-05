
var viewoperator;
setOperator();
var vm1471931793993 = avalon.define({$id: 'vm1471931793993',
    creator:'', 
    creator_form_disabled : false,
    create_time:'', 
    create_time_form_disabled : false,
    image1471932810545:'', 
    image1471932810545_form_disabled : false,
    pro_type_name:'类型名称', 
    pro_type_name_form_disabled : false,
    input_text1475044273821:'', 
    input_text1475044273821_form_disabled : false,
    submit:function() { 
        return formOperator(vm1471931793993, 'pro_type', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1471931793993);
        updateVMForComponentStatus(vm1471931793993, viewoperator);
    }
});

setVMToMap(vm1471931793993);
var  vm1471931793993_attributes = {"attributes":[{"name":"type","value":"image","compid":"image1471932810545"},{"name":"init","value":"true","compid":"image1471932810545"},{"name":"compid","value":"image1471932810545","compid":"image1471932810545"},{"name":"compname","value":"image1471932810545","compid":"image1471932810545"},{"name":"imgalt","value":"图片","compid":"image1471932810545"},{"name":"zoomin","value":"true","compid":"image1471932810545"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;pro_type.jpg","compid":"image1471932810545"},{"name":"imgheight","value":"150","compid":"image1471932810545"},{"name":"imgwidth","value":"150","compid":"image1471932810545"},{"name":"type","value":"separator","compid":"separator1471939580494"},{"name":"init","value":"true","compid":"separator1471939580494"},{"name":"picklinecolor","value":"828282","compid":"separator1471939580494"},{"name":"compid","value":"separator1471939580494","compid":"separator1471939580494"},{"name":"compname","value":"separator1471939580494","compid":"separator1471939580494"},{"name":"picklineheight","value":"1px","compid":"separator1471939580494"},{"name":"separatortitle","value":"类型管理","compid":"separator1471939580494"},{"name":"buttonicon","value":"glyphicon glyphicon-th-list","compid":"separator1471939580494"}]};
setCustomAttributes(vm1471931793993_attributes);

var viewoperator;
setOperator();
var vm1471918735005 = avalon.define({$id: 'vm1471918735005',
    submit:function() { 
        return formOperator(vm1471918735005, 'pro_type', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1471918735005);
        updateVMForComponentStatus(vm1471918735005, viewoperator);
    }
});

setVMToMap(vm1471918735005);
var  vm1471918735005_attributes = {"attributes":[]};
setCustomAttributes(vm1471918735005_attributes);

    var  vm1471930720718_attributes = {"attributes":[]};
setCustomAttributes(vm1471930720718_attributes);




function getEditorItem() {
    var editors = new Array();
    editors.push({field:'input_text1475044273821_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'creator_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'create_time_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initVMData(vm1471931793993, 'pro_type', 'bcp');
    initComponent('bcp',vm1471931793993);
    updateVMForComponentStatus(vm1471931793993, viewoperator)
    $('#vm1471931793993').bootstrapValidator({
        fields:{
            input_text1475044273821:{
                validators: {
                }
            }   ,
            input_text1471932156273:{
                validators: {
                }
            }   ,
            input_datetime1471932473169:{
                validators: {
                    date:{format: 'YYYY-MM-DD'}
                }
            }   
        }
    });
//$('#input_datetime1471932473169').data('DateTimePicker').format('YYYY-MM-DD');
    avalon.scan(document.getElementById("vm1471931793993"));
    initVMData(vm1471918735005, 'pro_type', 'bcp');
    initComponent('bcp',vm1471918735005);
    $("#button1475043971646").on('click', function() {
        searchClick();
    });
    visiableComponent();
    avalon.scan(document.getElementById("vm1471918735005"));
    initComponent('bcp',vm1471930720718);
var table_base1471930724131 = bootstrapTable('table_base1471930724131', adjustTableParam('table_base1471930724131','bcp', 'bcp_re_processtype', {"method":"get","contentType":null,"url":"http://10.74.65.161:9080/dsp/orm/table/bcp_re_processtype?param=%7B%22columns%22%3A%5B%7B%22cname%22%3A%22ID%22%7D%2C%7B%22cname%22%3A%22TYPENAME%22%7D%2C%7B%22cname%22%3A%22CREATOR%22%7D%2C%7B%22cname%22%3A%22CREATETIME%22%7D%2C%7B%22cname%22%3A%22DESC%22%7D%5D%2C%22orders%22%3A%5B%5D%2C%22condition%22%3A%7B%7D%7D","cache":false,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"300","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base1471930724131","showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1471930724131","defaultcondition":[],"responseHandler":"tableResponseHandler","pk":[],"editable":true,"columns":[{"field":"state_form_disabled","checkbox":true},{"title":"类型ID","field":"ID","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":false,"formatter":"","tableId":"table_base1471930724131","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"类型名称","field":"TYPENAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1471930724131","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"创建人","field":"CREATOR","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1471930724131","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"创建时间","field":"CREATETIME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1471930724131","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"类型描述","field":"DESC","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1471930724131","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}}]})); 
    $('#table_base1471930724131').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base1471930724131') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base1471930724131') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base1471930724131') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base1471930724131') 
    });
    controlTableToolbar();
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


