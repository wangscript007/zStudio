
var viewoperator;
setOperator();
var vm1474957430162 = avalon.define({$id: 'vm1474957430162',
    image1474957478030:'', 
    image1474957478030_form_disabled : false,
});

setVMToMap(vm1474957430162);
var  vm1474957430162_attributes = {"attributes":[{"name":"type","value":"image","compid":"image1474957478030"},{"name":"init","value":"true","compid":"image1474957478030"},{"name":"compid","value":"image1474957478030","compid":"image1474957478030"},{"name":"compname","value":"image1474957478030","compid":"image1474957478030"},{"name":"imgalt","value":"图片","compid":"image1474957478030"},{"name":"zoomin","value":"true","compid":"image1474957478030"},{"name":"imgwidth","value":"150","compid":"image1474957478030"},{"name":"imgheight","value":"150","compid":"image1474957478030"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;pro_type.jpg","compid":"image1474957478030"}]};
setCustomAttributes(vm1474957430162_attributes);

var vm1474957450763 = avalon.define({$id: 'vm1474957450763',
    image1474959246135:'', 
    image1474959246135_form_disabled : false,
    textarea1474958368840:'', 
    textarea1474958368840_form_disabled : false,
    image1474959189310:'', 
    image1474959189310_form_disabled : false,
    image1474959218262:'', 
    image1474959218262_form_disabled : false,
});

function getVMData() {
    return vm1474957450763.$model;
}
    var  vm1474957450763_attributes = {"attributes":[{"name":"type","value":"image","compid":"image1474959189310"},{"name":"init","value":"true","compid":"image1474959189310"},{"name":"compid","value":"image1474959189310","compid":"image1474959189310"},{"name":"compname","value":"image1474959189310","compid":"image1474959189310"},{"name":"imgalt","value":"图片","compid":"image1474959189310"},{"name":"zoomin","value":"true","compid":"image1474959189310"},{"name":"imgwidth","value":"16","compid":"image1474959189310"},{"name":"imgheight","value":"16","compid":"image1474959189310"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;edit_icon.jpg","compid":"image1474959189310"},{"name":"type","value":"image","compid":"image1474959218262"},{"name":"init","value":"true","compid":"image1474959218262"},{"name":"compid","value":"image1474959218262","compid":"image1474959218262"},{"name":"compname","value":"image1474959218262","compid":"image1474959218262"},{"name":"imgalt","value":"图片","compid":"image1474959218262"},{"name":"zoomin","value":"true","compid":"image1474959218262"},{"name":"imgwidth","value":"16","compid":"image1474959218262"},{"name":"imgheight","value":"16","compid":"image1474959218262"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;edit_icon.jpg","compid":"image1474959218262"},{"name":"type","value":"image","compid":"image1474959246135"},{"name":"init","value":"true","compid":"image1474959246135"},{"name":"compid","value":"image1474959246135","compid":"image1474959246135"},{"name":"compname","value":"image1474959246135","compid":"image1474959246135"},{"name":"imgheight","value":"16","compid":"image1474959246135"},{"name":"imgalt","value":"图片","compid":"image1474959246135"},{"name":"zoomin","value":"true","compid":"image1474959246135"},{"name":"imgwidth","value":"16","compid":"image1474959246135"},{"name":"imgsrc","value":"img&#x2F;demo&#x2F;edit_icon.jpg","compid":"image1474959246135"},{"name":"type","value":"separator","compid":"separator1474958258252"},{"name":"init","value":"true","compid":"separator1474958258252"},{"name":"picklinecolor","value":"828282","compid":"separator1474958258252"},{"name":"compid","value":"separator1474958258252","compid":"separator1474958258252"},{"name":"compname","value":"separator1474958258252","compid":"separator1474958258252"},{"name":"picklineheight","value":"1px","compid":"separator1474958258252"},{"name":"separatortitle","value":"基本信息","compid":"separator1474958258252"},{"name":"type","value":"separator","compid":"separator1474958284352"},{"name":"init","value":"true","compid":"separator1474958284352"},{"name":"picklinecolor","value":"828282","compid":"separator1474958284352"},{"name":"compid","value":"separator1474958284352","compid":"separator1474958284352"},{"name":"compname","value":"separator1474958284352","compid":"separator1474958284352"},{"name":"picklineheight","value":"1px","compid":"separator1474958284352"},{"name":"separatortitle","value":"数据项","compid":"separator1474958284352"}]};
setCustomAttributes(vm1474957450763_attributes);




function getEditorItem() {
    var editors = new Array();
    editors.push({field:'textarea1474958368840_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}}) 
    return editors;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1474957430162);
    visiableComponent();
    avalon.scan(document.getElementById("vm1474957430162"));
    initComponent('undefined',vm1474957450763);
var table_base_local1474958302070 = bootstrapTable('table_base_local1474958302070', adjustTableParam('table_base_local1474958302070','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"300","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1474958302070","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1474958302070","idField":"$id","pk":["$id"],"columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"id","title":"标识","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474958302070","width":""},{"field":"name","title":"名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474958302070","width":""},{"field":"type","title":"类型","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474958302070","width":""},{"field":"length","title":"长度","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474958302070","width":""},{"field":"default","title":"缺省值","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474958302070","width":""},{"field":"isIndex","title":"索引","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474958302070","width":""},{"field":"isPublished","title":"发布","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1474958302070","width":""}],"data":[]})); 
    $('#table_base_local1474958302070').bootstrapTable().on('check.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474958302070') 
    }).on('uncheck.bs.table', function(event, row) {
        controlTableToolbar('table_base_local1474958302070') 
    }).on('check-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474958302070') 
    }).on('uncheck-all.bs.table', function(event) {
        controlTableToolbar('table_base_local1474958302070') 
    });
    controlTableToolbar();
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


