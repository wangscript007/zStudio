
var viewoperator;
setOperator();
var vm1481598122807 = avalon.define({$id: 'vm1481598122807',
	input_radio1481598375006:'',
	select_dynamic14815988531620:'',
	textarea14815961544470:'',
	input_radio1481598345687:'',
	input_text14815961208543:'',
	input_text14815961208541:'',
	input_radio1481598190087:'1'
});

setVMToMap(vm1481598122807);
var  vm1481598122807_attributes = {"attributes":[
	{"name":"type","value":"separator","compid":"separator14816083309040"},
	{"name":"init","value":"true","compid":"separator14816083309040"},
	{"name":"picklinecolor","value":"828282","compid":"separator14816083309040"},
	{"name":"compid","value":"separator14816083309040","compid":"separator14816083309040"},
	{"name":"compname","value":"separator14816083309040","compid":"separator14816083309040"},
	{"name":"picklineheight","value":"1px","compid":"separator14816083309040"},
	{"name":"type","value":"input_radio","compid":"input_radio1481598190087"},
	{"name":"init","value":"true","compid":"input_radio1481598190087"},
	{"name":"class","value":"form-control","compid":"input_radio1481598190087"},
	{"name":"compid","value":"input_radio1481598190087","compid":"input_radio1481598190087"},
	{"name":"compname","value":"input_radio1481598190087","compid":"input_radio1481598190087"},
	{"name":"optionvalue","value":"绑定已有表:1","compid":"input_radio1481598190087"},
	{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"input_radio1481598190087"},
	{"name":"defaultvalue","value":"1","compid":"input_radio1481598190087"},
	{"name":"type","value":"select_dynamic","compid":"select_dynamic14815988531620"},
	{"name":"init","value":"true","compid":"select_dynamic14815988531620"},
	{"name":"compid","value":"select_dynamic14815988531620","compid":"select_dynamic14815988531620"},
	{"name":"compname","value":"select_dynamic14815988531620","compid":"select_dynamic14815988531620"},
	{"name":"isormds","value":"true","compid":"select_dynamic14815988531620"},
	{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic14815988531620"},
	{"name":"selecttype","value":"single","compid":"select_dynamic14815988531620"},
	{"name":"type","value":"input_radio","compid":"input_radio1481598345687"},
	{"name":"init","value":"true","compid":"input_radio1481598345687"},
	{"name":"class","value":"form-control","compid":"input_radio1481598345687"},
	{"name":"compid","value":"input_radio1481598345687","compid":"input_radio1481598345687"},
	{"name":"compname","value":"input_radio1481598345687","compid":"input_radio1481598345687"},
	{"name":"optionvalue","value":"在线设计:2","compid":"input_radio1481598345687"},
	{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"input_radio1481598345687"},
	{"name":"style","value":"margin-bottom:6px","compid":"input_radio1481598345687"},
	{"name":"type","value":"input_radio","compid":"input_radio1481598375006"},
	{"name":"init","value":"true","compid":"input_radio1481598375006"},
	{"name":"class","value":"form-control","compid":"input_radio1481598375006"},
	{"name":"compid","value":"input_radio1481598375006","compid":"input_radio1481598375006"},
	{"name":"compname","value":"input_radio1481598375006","compid":"input_radio1481598375006"},
	{"name":"optionvalue","value":"自定义SQL:3","compid":"input_radio1481598375006"},
	{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"input_radio1481598375006"}
]};
setCustomAttributes(vm1481598122807_attributes);


$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
	if(avalon && avalon.scan) {
		avalon.scan();
	}
	initComponent('undefined',vm1481598122807);
	visiableComponent();
	avalon.scan(document.getElementById("vm1481598122807"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


