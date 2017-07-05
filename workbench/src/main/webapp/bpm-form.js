
var viewoperator;
setOperator();
var vm1476253718194 = avalon.define({$id: 'vm1476253718194',
	name:'',
	name_form_disabled : false,
    packageid:'',
    packageid_form_disabled : false,
    createTime:'',
    createTime_form_disabled : false,
    description:'',
    description_form_disabled : false,
    type:'',
    type_form_disabled : false,
    creator:'',
    creator_form_disabled : false,
    status:'',
    status_form_disabled : false,
    formurl:'',
    formurl_form_disabled : false,
    id:'',
    id_form_disabled : false,
	modelid:'',
    modelid_form_disabled : false,
    submit:function() {
		debugger;
		if($('#input_text1476253945536').val() != ""){
			vm1476253718194.formurl = maoEnvBase.getCurrentTenantId()+"$"+$('#input_text1476253945536').val();
		}
		vm1476253718194.modelid = $("#select_dynamic1476253895566").val();
        return formOperator(vm1476253718194, 'bcp_re_form', 'POST', 'bcp');
    },
    reset:function() {
        initVMProperties(vm1476253718194);
        updateVMForComponentStatus(vm1476253718194, viewoperator);
    }
});

setVMToMap(vm1476253718194);
var  vm1476253718194_attributes = {"attributes":[{"name":"type","value":"select_dynamic","compid":"input_text1476253894757"},{"name":"init","value":"true","compid":"input_text1476253894757"},{"name":"compid","value":"input_text1476253894757","compid":"input_text1476253894757"},{"name":"compname","value":"input_text1476253894757","compid":"input_text1476253894757"},{"name":"isormds","value":"true","compid":"input_text1476253894757"},{"name":"editable","value":"{\"add\":\"checked\",\"view\":\"\",\"modify\":\"checked\"}","compid":"input_text1476253894757"},{"name":"fieldtype","value":"string","compid":"input_text1476253894757"},{"name":"field","value":"type","compid":"input_text1476253894757"}]};
setCustomAttributes(vm1476253718194_attributes);


function getEditorItem() {
    var editors = new Array();
    editors.push({field:'type_form_disabled',editable:{"add":"checked","view":"","modify":""}})
    editors.push({field:'packageid_form_disabled',editable:{"add":"","view":"","modify":""}})
    editors.push({field:'description_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}})
    editors.push({field:'status_form_disabled',editable:{"add":"checked","view":"","modify":""}})
    editors.push({field:'createTime_form_disabled',editable:{"add":"checked","view":"","modify":""}})
    editors.push({field:'creator_form_disabled',editable:{"add":"","view":"","modify":""}})
    editors.push({field:'formurl_form_disabled',editable:{"add":"","view":"","modify":""}})
    editors.push({field:'id_form_disabled',editable:{"add":"checked","view":"","modify":""}})
	editors.push({field:'modelid_form_disabled',editable:{"add":"checked","view":"","modify":""}})
    return editors;
}
function getData(){
	if($("#input_text1476253868793").val() == ""){
             return;
        }
   // var data = vm1476253718194.$model.id;
   // vm1476253718194.$model.formurl = data;
	var data = '';
	if($('#input_text1476253868793').val().indexOf($('#input_text1476253868795').val()) > -1
	 && $('#input_text1476253868793').val() != $('#input_text1476253868795').val()){
		 var array = $('#input_text1476253868793').val().split('-');
		 if(array.length > 2){
			 for(var i = 1;i<array.length;i++){
				 if(i != 1){
					 data  = data + "-" +array[i];
				 }else{
					 data = array[i];
				 }
			 }
		 }else{
			 data = $('#input_text1476253868793').val().split('-')[1];
		 }
	}else{
		data = $('#input_text1476253868793').val();
	}
	//$('#input_text1476253868793').val('');
	$('#input_text1476253868793').val($('#input_text1476253868795').val()+"-"+ data);
    $('#input_text1476253945536').val($('#input_text1476253868793').val()+".html");
}

function vm1476253718194SuccessCallBack(){
	hideModalDialog('dialog1474531840414');
	cardTypeUlDesign.initUl();
}
/*function vm1476253718194SuccessCallBack(){

 //
	var fileName = vm1476253718194.$model.id;
	var type = $("#select_dynamic1476253894759").val();
	var modelid = $("#select_dynamic1476253895566").val();
	var search = (pageParams == undefined?window.location.search:pageParams);
	var tenantid = maoEnvBase.getCurrentTenantId();
	var processid = getUrlParam("packageId", search);
    if( type == "表单" || type == "列表"){
		var releaseType = "";
		if(type == "表单"){
			releaseType = "Form";
		}else if(type == "列表"){
			releaseType = "Table";
		}
		var newObj = {};
		newObj.modelid = modelid;
		newObj.type = releaseType;
		newObj.tenantid = tenantid;
		newObj.processid = processid;
		newObj.filename = fileName;
		processTools.initForm(newObj);
	}else if(type == "报表"){
		debugger;
		var tableInfo = $.designerOrmBase.query("data_model_info_table", '["bind_table_name"]', {"cname" : "id","value" : modelid,"compare" : "="},true);
		var modelidArray = tableInfo.rows;
		var data_source_id = modelidArray[0].data_source_id;
		var bind_table_name = modelidArray[0].bind_table_name;
		var dataInfo = {
				"frameContent":'{\"datasource\":{\"id\":\"innerSource\"},\"dataset\":{\"name\":\"' + bind_table_name + '\"}}',

				"meta":"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">",
				"titile":"",
				"css":[],
				"js":[],
				"body":"<div id=\"chart\" style=\"width: 100%;height:100%;\"></div>",
				"jscode":""
			};
		$.designerAjax('post','/datavisual/jersey-services/layoutit/frame/html/save/'+tenantid+'$'+fileName+'.html&pname=default&version=1.0/',JSON.stringify(dataInfo),sucessSaveDatavisualCallBack,errorSaveDatavisualCallBack);
		
	}
    bootbox.alert("提交成功！");
	refreshTable('formlist_table');
	hideModalDialog('dialog1');

}*/
/*var sucessSaveDatavisualCallBack = function(data){
		if(data.status == 0){
		}else{
			bootbox.alert("保存数据可视化框架文件有误,请检查!");
		}
	}
var errorSaveDatavisualCallBack = function(textStatus, errorThrown, urlAndParam){
		bootbox.alert("保存数据可视化框架文件失败!");
		console.log(message = "textStatus " + textStatus + " errorThrown "
						+ errorThrown + " url " + urlAndParam);
	}*/
var getTableName = function(packageId){
	var data = $.designerOrmBase.query("data_model_info_table", '["id","name"]', {},true);
	var modelidArray = data.rows;
	for(var i = 0;i < modelidArray.length;i++){
		var modelid = modelidArray[i].id;
		tableName = modelidArray[i].name;
		$("#select_dynamic1476253895566").append('<option value="' + modelid + '">' + tableName + '</option>');
		
	}
}
$(document).ready(function(){
    if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
        applyFunc("pageDocumentReadyBefore", [])
    }
    initVMData(vm1476253718194, 'bcp_re_form', 'bcp');
    initComponent('bcp',vm1476253718194);
    updateVMForComponentStatus(vm1476253718194, viewoperator)
    $('#vm1476253718194').bootstrapValidator({
        fields:{
			input_text1476253868793:{
                validators: {
					notEmpty: {}
                }
            }   ,
			input_text1476253868797:{
                validators: {
					notEmpty: {}
                }
            }   ,
            input_text1476253868794:{
                validators: {
                }
            }   ,
            input_text1476253945536:{
                validators: {
                }
            }   ,
            input_text1476254014304:{
                validators: {
                }
            }   ,
            input_text1476254051826:{
                validators: {
                }
            }   ,
            input_datetime1476254069827:{
                validators: {
                    date:{format: 'YYYY-MM-DD h:m:s'}
                }
            }
        }
    });
    $('#input_datetime1476254069827').data('DateTimePicker').format('YYYY-MM-DD HH:mm:ss');
    visiableComponent();
    avalon.scan(document.getElementById("vm1476253718194"));
    if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
        $('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
    }
    if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
        applyFunc("pageDocumentReadyAfter", [])
    }
    $('#input_text1476254051826').val(maoEnvBase.getCurrentUserName().split('@')[0]);
    var search = (pageParams == undefined?window.location.search:pageParams);
    var packageId = getUrlParam("packageId", search);
    var date = new Date();
    var time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	if(getUrlParam("operator", search) == 'add') {
		vm1476253718194.status = '已发布';
		vm1476253718194.type = '表单';
	} else {
		vm1476253718194.formurl = vm1476253718194.formurl.split("$")[1];
		$("#select_dynamic1476253895566").attr("disabled", 'false');
	}
	getTableName(packageId);
    $('#input_text1476253868795').val(packageId);
    $('#input_datetime1476254069827').val(time);
});


