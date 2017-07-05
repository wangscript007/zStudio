
var vm1484017160882 = avalon.define({$id: 'vm1484017160882',
    select_dynamic14840163855010:'',
    select_dynamic14840314039130:'',
    select_dynamic14840164376660:'',
    input_text14840379778070:'',
    select_dynamic14840164392730:'',
    select_dynamic14840163885580:'',
});

function getVMData() {
    return vm1484017160882.$model;
}
    var  vm1484017160882_attributes = {"attributes":[{"name":"type","value":"select_dynamic","compid":"select_dynamic14840163855010"},{"name":"init","value":"true","compid":"select_dynamic14840163855010"},{"name":"compid","value":"select_dynamic14840163855010","compid":"select_dynamic14840163855010"},{"name":"compname","value":"select_dynamic14840163855010","compid":"select_dynamic14840163855010"},{"name":"isormds","value":"true","compid":"select_dynamic14840163855010"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic14840163855010"},{"name":"optionvalue","value":"","compid":"select_dynamic14840163855010"},{"name":"type","value":"select_dynamic","compid":"select_dynamic14840163885580"},{"name":"init","value":"true","compid":"select_dynamic14840163885580"},{"name":"compid","value":"select_dynamic14840163885580","compid":"select_dynamic14840163885580"},{"name":"compname","value":"select_dynamic14840163885580","compid":"select_dynamic14840163885580"},{"name":"isormds","value":"true","compid":"select_dynamic14840163885580"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic14840163885580"},{"name":"optionvalue","value":"","compid":"select_dynamic14840163885580"},{"name":"type","value":"select_dynamic","compid":"select_dynamic14840314039130"},{"name":"init","value":"true","compid":"select_dynamic14840314039130"},{"name":"compid","value":"select_dynamic14840314039130","compid":"select_dynamic14840314039130"},{"name":"compname","value":"select_dynamic14840314039130","compid":"select_dynamic14840314039130"},{"name":"isormds","value":"true","compid":"select_dynamic14840314039130"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic14840314039130"},{"name":"optionvalue","value":"","compid":"select_dynamic14840314039130"},{"name":"type","value":"select_dynamic","compid":"select_dynamic14840164376660"},{"name":"init","value":"true","compid":"select_dynamic14840164376660"},{"name":"compid","value":"select_dynamic14840164376660","compid":"select_dynamic14840164376660"},{"name":"compname","value":"select_dynamic14840164376660","compid":"select_dynamic14840164376660"},{"name":"isormds","value":"true","compid":"select_dynamic14840164376660"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic14840164376660"},{"name":"optionvalue","value":"","compid":"select_dynamic14840164376660"},{"name":"type","value":"select_dynamic","compid":"select_dynamic14840164392730"},{"name":"init","value":"true","compid":"select_dynamic14840164392730"},{"name":"compid","value":"select_dynamic14840164392730","compid":"select_dynamic14840164392730"},{"name":"compname","value":"select_dynamic14840164392730","compid":"select_dynamic14840164392730"},{"name":"isormds","value":"true","compid":"select_dynamic14840164392730"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"select_dynamic14840164392730"},{"name":"optionvalue","value":"","compid":"select_dynamic14840164392730"}]};
setCustomAttributes(vm1484017160882_attributes);




$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initComponent('undefined',vm1484017160882);
var table_base_local1484016794244 = bootstrapTable('table_base_local1484016794244', adjustTableParam('table_base_local1484016794244','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"200","pageList":[10,20,50,100,200],"height":"300","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1484016794244","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1484016794244","idField":"$id","pk":["$id"],"columns":[{"field":"state_form_disabled","checkbox":true},{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"column","title":"列名","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1484016794244","width":"216"},{"field":"alias","title":"别名","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1484016794244","width":""}],"data":[]})); 
var table_base_local1484016652433 = bootstrapTable('table_base_local1484016652433', adjustTableParam('table_base_local1484016652433','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"200","pageList":[10,20,50,100,200],"height":"300","search":false,"showColumns":false,"selectItemName":"btSelectItemtable_base_local1484016652433","showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_local1484016652433","idField":"$id","pk":["$id"],"columns":[{"field":"state_form_disabled","checkbox":true},{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"column","title":"列名","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1484016652433","width":"216"},{"field":"alias","title":"别名","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_local1484016652433","width":""}],"data":[]})); 
    $('#vm1484017160882').bootstrapValidator({
        fields:{
            input_text14840379778070:{
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


