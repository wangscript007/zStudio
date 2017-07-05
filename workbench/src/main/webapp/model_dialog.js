
var viewoperator;
setOperator();
var vm1466510953660 = avalon.define({$id: 'vm1466510953660',
    input_text_name: '', 
    input_text_name_form_disabled : false,
    input_text_desc: '', 
    input_text_desc_form_disabled : false,
});

setVMToMap(vm1466510953660);
var  vm1466510953660_attributes = {"attributes":[]};
setCustomAttributes(vm1466510953660_attributes);


function getEditorItem() {
    var editors = new Array();
    editors.push({field:'input_text_name_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    editors.push({field:'input_text_desc_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
    initComponent('undefined',vm1466510953660);
    updateVMForComponentStatus(vm1466510953660, viewoperator)
    $('#vm1466510953660').bootstrapValidator({
        fields:{
            input_text_name:{
                validators: {
                    notEmpty: {}
                }
            }   ,
            input_text_desc:{
                validators: {
                }
            }   
        }
    });
    visiableComponent();
	$("#layout1466510976426").hide();
    avalon.scan(document.getElementById("vm1466510953660"));
});


$(document).ready(function(){

})
