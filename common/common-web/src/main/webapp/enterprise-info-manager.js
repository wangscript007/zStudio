
var viewoperator;
setOperator();
var vm1450086018892 = avalon.define({$id: 'vm1450086018892',
    ENTERPRISE: '', 
    ENTERPRISE_form_disabled : false,
    LEGAL_PERSON: '', 
    LEGAL_PERSON_form_disabled : false,
    EMPLOYEES: '', 
    EMPLOYEES_form_disabled : false,
    DEVICES: '', 
    DEVICES_form_disabled : false,
    CONTACT_NAME: '', 
    CONTACT_NAME_form_disabled : false,
    CONTACT_NUMBER: '', 
    CONTACT_NUMBER_form_disabled : false,
    TAG: '', 
    TAG_form_disabled : false,
    INDUSTRY: '', 
    INDUSTRY_form_disabled : false,
    ADDRESS: '', 
    ADDRESS_form_disabled : false,
    POSTCODE: '', 
    POSTCODE_form_disabled : false,
    LOGO: '', 
    LOGO_form_disabled : false,
    BUSINESS_SCOPE: '', 
    BUSINESS_SCOPE_form_disabled : false,
    INTRODUCE: '', 
    INTRODUCE_form_disabled : false,
    submit:function() { 
        return formOperator(vm1450086018892, 'enterprise_info', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1450086018892);
        updateVMForComponentStatus(vm1450086018892, viewoperator);
    }
});

setVMToMap(vm1450086018892);
var  vm1450086018892_attributes = {"attributes":[]};
setCustomAttributes(vm1450086018892_attributes);


function getEditorItem() {
    var editors = new Array();
    editors.push({field:'ENTERPRISE_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'LEGAL_PERSON_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'EMPLOYEES_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'DEVICES_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'CONTACT_NAME_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'CONTACT_NUMBER_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'TAG_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'INDUSTRY_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'ADDRESS_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'POSTCODE_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'LOGO_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'BUSINESS_SCOPE_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'INTRODUCE_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
    PageModelManage.initModel('bcp');
    initVMData(vm1450086018892, 'enterprise_info', 'bcp');
    initComponent('bcp',vm1450086018892);
    updateVMForComponentStatus(vm1450086018892, viewoperator)
    $('#vm1450086018892').bootstrapValidator({
        fields:{
            input_text1450086556584:{
                validators: {
                    notEmpty: {},
                    stringLength: {min: 1,max: 200}
                }
            }   ,
            input_text1450086566243:{
                validators: {
                    notEmpty: {},
                    stringLength: {min: 1,max: 100}
                }
            }   ,
            input_text1450086558907:{
                validators: {
                    notEmpty: {},
                    integer:{}
                }
            }   ,
            input_text1450086568645:{
                validators: {
                    notEmpty: {},
                    integer:{}
                }
            }   ,
            input_text1450086561179:{
                validators: {
                    notEmpty: {},
                    stringLength: {min: 0,max: 50}
                }
            }   
        }
    });
    visiableComponent();
    avalon.scan(document.getElementById("vm1450086018892"));
});


$(document).ready(function(){

})
