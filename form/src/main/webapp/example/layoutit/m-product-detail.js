
var viewoperator;
setOperator();
var vm1467103504651 = avalon.define({$id: 'vm1467103504651',
    GOODS_IMG_URL: '', 
    GOODS_IMG_URL_form_disabled : false,
    GOODS_NAME: '产品名称', 
    GOODS_NAME_form_disabled : false,
    GOODS_PRICE: '价格', 
    GOODS_PRICE_form_disabled : false,
    GOODS_PROVIDER: '供货商', 
    GOODS_PROVIDER_form_disabled : false,
    submit:function() { 
        return formOperator(vm1467103504651, 'goods', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1467103504651);
        updateVMForComponentStatus(vm1467103504651, viewoperator);
    }
});

setVMToMap(vm1467103504651);
var  vm1467103504651_attributes = {"attributes":[{"name":"type","value":"image","compid":"image1467103522458"},{"name":"init","value":"true","compid":"image1467103522458"},{"name":"compid","value":"image1467103522458","compid":"image1467103522458"},{"name":"compname","value":"image1467103522458","compid":"image1467103522458"},{"name":"imgalt","value":"图片","compid":"image1467103522458"},{"name":"zoomin","value":"true","compid":"image1467103522458"},{"name":"field","value":"GOODS_IMG_URL","compid":"image1467103522458"},{"name":"ms-attr-disabled","value":"GOODS_IMG_URL_form_disabled","compid":"image1467103522458"},{"name":"ms-duplex","value":"GOODS_IMG_URL","compid":"image1467103522458"},{"name":"srcfield","value":"GOODS_IMG_URL","compid":"image1467103522458"},{"name":"type","value":"separator","compid":"separator1467104019182"},{"name":"init","value":"true","compid":"separator1467104019182"},{"name":"picklinecolor","value":"f5f5f5","compid":"separator1467104019182"},{"name":"compid","value":"separator1467104019182","compid":"separator1467104019182"},{"name":"compname","value":"separator1467104019182","compid":"separator1467104019182"},{"name":"picklineheight","value":"1px","compid":"separator1467104019182"},{"name":"type","value":"separator","compid":"separator1467104609439"},{"name":"init","value":"true","compid":"separator1467104609439"},{"name":"picklinecolor","value":"f5f5f5","compid":"separator1467104609439"},{"name":"compid","value":"separator1467104609439","compid":"separator1467104609439"},{"name":"compname","value":"separator1467104609439","compid":"separator1467104609439"},{"name":"picklineheight","value":"1px","compid":"separator1467104609439"},{"name":"type","value":"separator","compid":"separator1467104653736"},{"name":"init","value":"true","compid":"separator1467104653736"},{"name":"picklinecolor","value":"f5f5f5","compid":"separator1467104653736"},{"name":"compid","value":"separator1467104653736","compid":"separator1467104653736"},{"name":"compname","value":"separator1467104653736","compid":"separator1467104653736"},{"name":"picklineheight","value":"1px","compid":"separator1467104653736"}]};
setCustomAttributes(vm1467103504651_attributes);


$(document).ready(function(){
    PageModelManage.initModel('bcp');
    initVMData(vm1467103504651, 'goods', 'bcp');
    initComponent('bcp',vm1467103504651);
    visiableComponent();
    avalon.scan(document.getElementById("vm1467103504651"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
});


$(document).ready(function(){

})
