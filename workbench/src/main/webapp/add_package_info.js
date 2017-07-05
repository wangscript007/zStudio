var viewoperator;
setOperator();
var vm1487320279839 = avalon.define({$id: 'vm1487320279839',
    PACKAGENAME:'',
    DESC:'',
    MODIFYTIME:'',
    CREATETIME:'',
    submit:function() {
        var date = new Date();
        var dateNow = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
        vm1487320279839.MODIFYTIME = dateNow;
        if(viewoperator == 'add'){
            vm1487320279839.CREATETIME = dateNow;
        }
        return formOperator(vm1487320279839, 'bcp_re_processpackage', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1487320279839);
        updateVMForComponentStatus(vm1487320279839, viewoperator);
    }
});

setVMToMap(vm1487320279839);
var  vm1487320279839_attributes = {"attributes":[]};
setCustomAttributes(vm1487320279839_attributes);

function checkAppName(value){
    var condition = new QueryCondition();
    condition.setCName("PACKAGENAME");
    condition.setValue($('#input_text14873211687290').val());
    condition.setCompare("=");
    var obj = maoOrmBase.query("bcp_re_processpackage",'["id"]',condition);
    if(obj.status !== 1 || !obj.rows){
        console.error("查询应用信息异常:" + obj.message);
        tipBox.showMessage('查询应用信息异常。', 'error');
        return false;
    }
    
    if(obj.rows.length > 0 && viewoperator === "add" ||
            obj.rows.length > 1 && viewoperator === "edit" ){
       return false;
    }

    return true;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initVMData(vm1487320279839, 'bcp_re_processpackage', 'bcp');
	if(avalon && avalon.scan) {
		avalon.scan();
	}
    initComponent('bcp',vm1487320279839);
   
    $('#vm1487320279839').bootstrapValidator({
        fields: {
            input_text14873211687290: {
                validators: {
                    notEmpty: {
                        message: '应用名称不能为空'
                    },
                    stringLength: {min: 1,max: 20},
                    callback: {
                        message: '应用名称已存在',
                        callback: function (value, validator) {
                            if (value) {
                                return checkAppName(value);
                            }
                            return true;
                        }
                    }
                }
            }
        }
    });
   
    visiableComponent();
    avalon.scan(document.getElementById("vm1487320279839"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
    $('#button14873211465030').on('click',function(){			
        hideModalDialog('dialogApp');
    })
});


