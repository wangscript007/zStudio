
var viewoperator;
setOperator();
var vm1478155202799 = avalon.define({$id: 'vm1478155202799',
    image1476151699870:'',
});

setVMToMap(vm1478155202799);
var  vm1478155202799_attributes = {"attributes":[{"name":"imgheight","value":"100","compid":"image1476151699870"},{"name":"imgwidth","value":"100","compid":"image1476151699870"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;pro_type.jpg","compid":"image1476151699870"},{"name":"zoomin","value":"true","compid":"image1476151699870"},{"name":"imgalt","value":"图片","compid":"image1476151699870"},{"name":"compname","value":"image1476151699870","compid":"image1476151699870"},{"name":"compid","value":"image1476151699870","compid":"image1476151699870"},{"name":"type","value":"image","compid":"image1476151699870"},{"name":"init","value":"true","compid":"image1476151699870"},{"name":"alignstyle","value":"layout-align-center","compid":"image1476151699870"},{"name":"class","value":"layout-align-center","compid":"image1476151699870"}]};
setCustomAttributes(vm1478155202799_attributes);

var viewoperator;
setOperator();
var bfd_panel1476235914143 = avalon.define({$id: 'bfd_panel1476235914143',
    select_dynamic1476255634792:'',
    input_text1476236134051:'',
    input_text1476236053143:'',
    input_text1476236059345:'',
    input_text1476236056609:'',
    input_text1476236061861:'',
    input_text1476255418310:'',
    input_text1476236058391:'',
});

setVMToMap(bfd_panel1476235914143);
var  bfd_panel1476235914143_attributes = {"attributes":[{"name":"optionvalue","value":"     ORM数据源:orm","compid":"select_dynamic1476255634792"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic1476255634792"},{"name":"isormds","value":"true","compid":"select_dynamic1476255634792"},{"name":"compname","value":"select_dynamic1476255634792","compid":"select_dynamic1476255634792"},{"name":"compid","value":"select_dynamic1476255634792","compid":"select_dynamic1476255634792"},{"name":"type","value":"select_dynamic","compid":"select_dynamic1476255634792"},{"name":"init","value":"true","compid":"select_dynamic1476255634792"}]};
setCustomAttributes(bfd_panel1476235914143_attributes);


$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1478155202799);
    avalon.scan(document.getElementById("vm1478155202799"));
    initComponent('undefined',bfd_panel1476235914143);
    $('#bfd_panel1476235914143').bootstrapValidator({
        fields:{
            input_text1476236058391:{
                validators: {
                    notEmpty: {}
                }
            }   ,
            input_text1476236059345:{
                validators: {
                    notEmpty: {},
                    notEmpty: {
    	message: '请输入必填项'
},
regexp: {
		regexp: /^[a-zA-Z]\w*$/,
		message: '请输入以字母开头且只包含字母数字或下划线的标识'
},
callback: {
message: '数据源标识不能重复！',
callback: function(value, validator){
 return checkDataSourceId(value);
 }
}
                }
            }   ,
            input_text1476236053143:{
                validators: {
                    notEmpty: {},
                    ip:{}
                }
            }   ,
            input_text1476236056609:{
                validators: {
                    notEmpty: {},
                    integer:{}
                }
            }   ,
            input_text1476236061861:{
                validators: {
                    notEmpty: {}
                }
            }   ,
            input_text1476236134051:{
                validators: {
                    notEmpty: {}
                }
            }   ,
            input_text1476255418310:{
                validators: {
                    notEmpty: {
    	message: '该字段必填和不能为空'
},
regexp: {
		regexp: /^[a-zA-Z0-9_.]+$/,
		message: '该字段只能是字母、整数和下划线'
}
                }
            }   
        }
    });
    visiableComponent();
    avalon.scan(document.getElementById("bfd_panel1476235914143"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


