var viewoperator;
setOperator();
var vm1490766924874 = avalon.define({$id: 'vm1490766924874',
    STATUS:1,
    PARENT_KEY:'',
    KEY:'',
    URL:'',
    NAME:'',
    reset:function() { 
        initVMProperties(vm1490766924874);
        updateVMForComponentStatus(vm1490766924874, viewoperator);
    }
});

setVMToMap(vm1490766924874);
var  vm1490766924874_attributes = {"attributes":[{"name":"type","value":"separator","compid":"separator14908566012410"},{"name":"init","value":"true","compid":"separator14908566012410"},{"name":"picklinecolor","value":"828282","compid":"separator14908566012410"},{"name":"compid","value":"separator14908566012410","compid":"separator14908566012410"},{"name":"compname","value":"separator14908566012410","compid":"separator14908566012410"},{"name":"picklineheight","value":"1px","compid":"separator14908566012410"},{"name":"separatortitle","value":"基础属性","compid":"separator14908566012410"},{"name":"buttonicon","value":"glyphicon glyphicon-list","compid":"separator14908566012410"},{"name":"type","value":"separator","compid":"separator14908567931130"},{"name":"init","value":"true","compid":"separator14908567931130"},{"name":"picklinecolor","value":"828282","compid":"separator14908567931130"},{"name":"compid","value":"separator14908567931130","compid":"separator14908567931130"},{"name":"compname","value":"url_addr","compid":"separator14908567931130"},{"name":"picklineheight","value":"1px","compid":"separator14908567931130"},{"name":"separatortitle","value":"功能属性","compid":"separator14908567931130"},{"name":"buttonicon","value":"glyphicon glyphicon-list","compid":"separator14908567931130"},{"name":"type","value":"select_dynamic","compid":"select_dynamic14910090882010"},{"name":"init","value":"true","compid":"select_dynamic14910090882010"},{"name":"compid","value":"select_dynamic14910090882010","compid":"select_dynamic14910090882010"},{"name":"compname","value":"select_dynamic14910090882010","compid":"select_dynamic14910090882010"},{"name":"isormds","value":"true","compid":"select_dynamic14910090882010"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic14910090882010"},{"name":"optionvalue","value":"是:1\n否:0","compid":"select_dynamic14910090882010"},{"name":"defaultvalue","value":"1","compid":"select_dynamic14910090882010"},{"name":"fieldtype","value":"int","compid":"select_dynamic14910090882010"},{"name":"field","value":"STATUS","compid":"select_dynamic14910090882010"}]};
setCustomAttributes(vm1490766924874_attributes);


$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initVMData(vm1490766924874, 'tenant_menu', 'bcp');
	if(avalon && avalon.scan) {
		avalon.scan();
	}
    initComponent('bcp',vm1490766924874);
    visiableComponent();
    avalon.scan(document.getElementById("vm1490766924874"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});