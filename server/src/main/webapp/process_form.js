
var vm1470275533736 = avalon.define({$id: 'vm1470275533736',
    input_text1477965453864:''
});

function getVMData() {
    return vm1470275533736.$model;
}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1470275533736);
var table_base_local1470275538711 = bootstrapTable('table_base_local1470275538711',
        adjustTableParam('table_base_local1470275538711','undefined', 'undefined',
            {"striped":true,"pagination":true,"pageSize":"20","pageList":[10,20,50,100,200],"height":"500","search":false,
                "showColumns":false,"selectItemName":"btSelectItemtable_base_local1470275538711","showRefresh":false,
                "sidePagination":"client","sortable":true,"idTable":"table_base_local1470275538711","idField":"$id","pk":["$id"],"columns":[{"field":"state_form_disabled","radio":true},
                {"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},
                {"field":"process_packageName","title":"应用名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1470275538711","width":""},
                {"field":"import_userName","title":"导入用户","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1470275538711","width":""},
                {"field":"import_time","title":"导入时间","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1470275538711","width":""}],"data":[]}));
    $("#button1470276200107").on('click', function() {
        uiShowService.searchProcessInfo();
    });

    var switchDiv = $('div[type="m_switch"]');
	if(typeof switchDiv.initializtionSwitch === 'function') {
        switchDiv.initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


