
var viewoperator;
setOperator();
var vm1475892201536 = avalon.define({$id: 'vm1475892201536',
    NAME:'', 
    NAME_form_disabled : false,
    ID:'', 
    ID_form_disabled : false,
    submit:function() { 
        return formOperator(vm1475892201536, 'asset_area', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1475892201536);
        updateVMForComponentStatus(vm1475892201536, viewoperator);
    }
});

setVMToMap(vm1475892201536);
var  vm1475892201536_attributes = {"attributes":[]};
setCustomAttributes(vm1475892201536_attributes);

var viewoperator;
setOperator();
var vm1475892268221 = avalon.define({$id: 'vm1475892268221',
    NAME:'', 
    NAME_form_disabled : false,
    ID:'', 
    ID_form_disabled : false,
    submit:function() { 
        return formOperator(vm1475892268221, 'asset_inst_base', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1475892268221);
        updateVMForComponentStatus(vm1475892268221, viewoperator);
    }
});

setVMToMap(vm1475892268221);
var  vm1475892268221_attributes = {"attributes":[]};
setCustomAttributes(vm1475892268221_attributes);


function getEditorItem() {
    var editors = new Array();
    editors.push({field:'ID_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'NAME_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'ID_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'NAME_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initVMData(vm1475892201536, 'asset_area', 'bcp');
    initComponent('bcp',vm1475892201536);
    updateVMForComponentStatus(vm1475892201536, viewoperator)
    $('#vm1475892201536').bootstrapValidator({
        fields:{
            input_text1475892224292:{
                validators: {
                }
            }   ,
            input_text1475892234475:{
                validators: {
                }
            }   
        }
    });
    avalon.scan(document.getElementById("vm1475892201536"));
    initVMData(vm1475892268221, 'asset_inst_base', 'bcp');
    initComponent('bcp',vm1475892268221);
    updateVMForComponentStatus(vm1475892268221, viewoperator)
    $('#vm1475892268221').bootstrapValidator({
        fields:{
            input_text1475892298753:{
                validators: {
                }
            }   ,
            input_text1475892303632:{
                validators: {
                }
            }   
        }
    });
    visiableComponent();
    avalon.scan(document.getElementById("vm1475892268221"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


