setOperator();
var vm1469583900494 = avalon.define({$id: 'vm1469583900494'});

setVMToMap(vm1469583900494);
var  vm1469583900494_attributes = {"attributes":[]};
setCustomAttributes(vm1469583900494_attributes);

var viewoperator;
setOperator();
var vm1469583980628 = avalon.define({$id: 'vm1469583980628',
    ORDER:'', 
    ORDER_form_disabled : false,
    STATUS:'1', 
    STATUS_form_disabled : false,
    ICON:'fa fa-comments', 
    ICON_form_disabled : false,
    PARENT_KEY:'', 
    PARENT_KEY_form_disabled : false,
    TYPE:'', 
    TYPE_form_disabled : false,
    KEY:'', 
    KEY_form_disabled : false,
    URL:'', 
    URL_form_disabled : false,
    NAME:'', 
    NAME_form_disabled : false,
    reset:function() { 
        initVMProperties(vm1469583980628);
        updateVMForComponentStatus(vm1469583980628, viewoperator);
    }
});

setVMToMap(vm1469583980628);
var  vm1469583980628_attributes = {"attributes":[
         {"name":"type","value":"separator","compid":"separator1469584179896"},
         {"name":"init","value":"true","compid":"separator1469584179896"},
         {"name":"picklinecolor","value":"828282","compid":"separator1469584179896"},
         {"name":"compid","value":"separator1469584179896","compid":"separator1469584179896"},
         {"name":"compname","value":"separator1469584179896","compid":"separator1469584179896"},
         {"name":"picklineheight","value":"1px","compid":"separator1469584179896"},
         {"name":"buttonicon","value":"glyphicon glyphicon-th-list","compid":"separator1469584179896"},
         {"name":"separatortitle","value":"基础属性","compid":"separator1469584179896"},
         {"name":"type","value":"separator","compid":"separator1469753076725"},
         {"name":"init","value":"true","compid":"separator1469753076725"},
         {"name":"picklinecolor","value":"828282","compid":"separator1469753076725"},
         {"name":"compid","value":"separator1469753076725","compid":"separator1469753076725"},
         {"name":"compname","value":"separator1469753076725","compid":"separator1469753076725"},
         {"name":"picklineheight","value":"1px","compid":"separator1469753076725"},
         {"name":"separatortitle","value":"功能属性","compid":"separator1469753076725"},
         {"name":"buttonicon","value":"glyphicon glyphicon-th-list","compid":"separator1469753076725"},
         {"name":"type","value":"input_radio","compid":"input_radio1475131113134"},
         {"name":"init","value":"true","compid":"input_radio1475131113134"},
         {"name":"class","value":"form-control","compid":"input_radio1475131113134"},
         {"name":"compid","value":"input_radio1475131113134","compid":"input_radio1475131113134"},
         {"name":"compname","value":"input_radio1475131113134","compid":"input_radio1475131113134"},
         {"name":"optionvalue","value":"是:1\n否:0","compid":"input_radio1475131113134"},
         {"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"input_radio1475131113134"},
         {"name":"field","value":"STATUS","compid":"input_radio1475131113134"},
         {"name":"defaultvalue","value":"1","compid":"input_radio1475131113134"}
      ]};
setCustomAttributes(vm1469583980628_attributes);


function getEditorItem() {
    var editors = [];
    editors.push({field:'NAME_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}});
    editors.push({field:'KEY_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}});
    editors.push({field:'PARENT_KEY_form_disabled',editable:{"add":"","view":"","modify":""}});
    editors.push({field:'TYPE_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}});
    editors.push({field:'STATUS_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}});
    editors.push({field:'ICON_form_disabled',editable:{"add":"","view":"","modify":""}});
    editors.push({field:'URL_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}});
    editors.push({field:'ORDER_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}});
    return editors;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1469583900494);
    avalon.scan(document.getElementById("vm1469583900494"));
    initVMData(vm1469583980628, 'tenant_menu', 'bcp');
    initComponent('bcp',vm1469583980628);
    updateVMForComponentStatus(vm1469583980628, viewoperator);
    visiableComponent();
    avalon.scan(document.getElementById("vm1469583980628"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


