
var vm1481533389021 = avalon.define({$id: 'vm1481533389021',
    input_text14815329095180:''
});

function getVMData() {
    return vm1481533389021.$model;
}
    var  vm1481533389021_attributes = {"attributes":[]};
setCustomAttributes(vm1481533389021_attributes);




$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1481533389021);
var table_base_local1481533395638 = bootstrapTable('table_base_local1481533395638', adjustTableParam('table_base_local1481533395638','undefined', 'undefined',
    {"striped":true,"pagination":true,"pageSize":"200","pageList":[10,20,50,100,200],"height":"300","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1481533395638","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1481533395638","idField":"$id","pk":["$id"],
        "columns":[
            {"field":"state_form_disabled","checkbox":true},
            {"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},
            {"field":"ID","title":"数据项标识","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"NAME","title":"数据项名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"TYPE","title":"类型","formatter":"dataModelDesignLogic.dataItemColumnTypeFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"LENGTH","title":"长度","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"DECIMAL","title":"精度","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"DEFAULT","title":"默认值","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"COLUMN_KEY","title":"主键","formatter":"dataModelDesignLogic.dataItemColumnKeyFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"IS_NULL","title":"值为空","formatter":"dataModelDesignLogic.dataItemColumnIsNullFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"COMPONENT_TYPE","title":"组件类型","formatter":"dataModelDesignLogic.dataItemColumnComponentTypeFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"UI_VISIBLE","title":"可显示","formatter":"dataModelDesignLogic.dataItemUiVsibleFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"LAYOUT","title":"布局类型","formatter":"dataModelDesignLogic.dataItemLayoutFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"DATA_BLOCK","title":"面板域","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},
            {"field":"operate","title":"操作","formatter":"dataModelDesignLogic.dataItemOperatorFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""}
        ],
        "data":[]
    }));
    $('#vm1481533389021').bootstrapValidator({
        fields:{
            input_text14815329095180:{
                validators: {
                }
            }   
        }
    });
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


