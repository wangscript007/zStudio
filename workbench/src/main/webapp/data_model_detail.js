
var vm1481533389021 = avalon.define({$id: 'vm1481533389021',
    input_text14816271448120:'',
    input_text14816271425010:'',
    input_text14816271035490:'',
    input_text14828305407960:'',
    input_text14816271241310:'',
    input_text14816270916850:'',
    textarea14828304381390:'',
    input_text14816270931710:''
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
var table_base_local1481533395638 = bootstrapTable('table_base_local1481533395638', adjustTableParam('table_base_local1481533395638','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"200","pageList":[10,20,50,100,200],"height":"300","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1481533395638","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1481533395638","idField":"$id","pk":["$id"],"columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"ID","title":"数据项标识","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"NAME","title":"数据项名称","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"TYPE","title":"类型","formatter":"dataModelDesignCommon.dataItemColumnTypeFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"LENGTH","title":"长度","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"DECIMAL","title":"精度","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"COLUMN_KEY","title":"主键","formatter":"dataModelDesignCommon.dataItemColumnKeyFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"IS_NULL","title":"值为空","formatter":"dataModelDesignCommon.dataItemColumnIsNullFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"COMPONENT_TYPE","title":"组件类型","formatter":"dataModelDesignCommon.dataItemColumnComponentTypeFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"UI_VISIBLE","title":"可显示","formatter":"dataModelDesignCommon.dataItemUiVsibleFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"LAYOUT","title":"布局类型","formatter":"dataModelDesignCommon.dataItemLayoutFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""},{"field":"DATA_BLOCK","title":"面板分组","formatter":"dataModelDesignCommon.dataItemColumnDataBlockFormatter","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1481533395638","width":""}],"data":[]}));
    $('#vm1481533389021').bootstrapValidator({
        fields:{
            input_text14816270916850:{
                validators: {
                }
            }   ,
            input_text14816270931710:{
                validators: {
                }
            }   ,
            input_text14816271035490:{
                validators: {
                }
            }   ,
            input_text14816271241310:{
                validators: {
                }
            }   ,
            input_text14816271425010:{
                validators: {
                }
            }   ,
            input_text14816271448120:{
                validators: {
                }
            }   ,
            input_text14828305407960:{
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
    dataModelDetailLogic.init();
});


