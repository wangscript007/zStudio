
var viewoperator;
setOperator();
var vm1474531931934 = avalon.define({$id: 'vm1474531931934',
    CREATOR:maoEnvBase.getCurrentUserName(),
    submit:function() {
        return formOperator(vm1474531931934, 'bcp_re_form', 'POST', 'bcp');
    },
    reset:function() { 
        initVMProperties(vm1474531931934);
        updateVMForComponentStatus(vm1474531931934, viewoperator);
    }
});

setVMToMap(vm1474531931934);
var  vm1474531931934_attributes = {"attributes":[]};
setCustomAttributes(vm1474531931934_attributes);


function getEditorItem() {
    var editors = new Array();
    editors.push({field:'TYPENAME_form_disabled',editable:{"add":"checked","view":"","modify":"checked"}})
    return editors;
}


function initModelSelect(){
    var selectItem = $('#select_dynamic14871255964280').empty();
    var columns = ["ID","NAME"];
    var conditions = new Array();
    var condition = new QueryCondition();
    condition.setCName('PACKAGE_ID');
    condition.setCompare('=');
    condition.setValue(getUrlParam('packageId',pageParams));
    conditions.push(condition);
    selectItem.append('<option value="">请选择数据模型</option>')  ;
    var obj = maoOrmBase.query("data_model_info_table",JSON.stringify(columns),generateCondition(conditions, 'and'));
    $.each(obj.rows,function(i,v){
        selectItem.append('<option value="'+ v.ID+'">'+ v.NAME+'</option>')  ;
    })
}

function getItemObj(modelid,type,tenantid,processid,fileName,name){
    var itemObj = {};
    itemObj.modelid = modelid;
    itemObj.type = type;
    itemObj.tenantid = tenantid;
    itemObj.processid = processid;
    itemObj.filename =fileName;
	itemObj.name = name;
    return itemObj;
}

 function createDatavisual(fileName,processid,modelid,tenantid,name){
    var date = new Date();
    var time = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
    var formData = {"columns":{"name":name,"type":"图表","status":"已发布","formurl":tenantid+"$"+fileName,"createtime":time,"packageid":processid,"creator":maoEnvBase.getCurrentUserName().split('@')[0],"modelid":modelid}};
    $.designerAjax("post","orm/table/bcp_re_form",JSON.stringify(formData),sucessCallBack,errorCallBack);
}

function errorCallBack(textStatus, errorThrown, urlAndParam){
    console.log(message = "textStatus " + textStatus + " errorThrown "
        + errorThrown + " url " + urlAndParam);
    return false;

    }
function sucessFrameFileCallBack(obj){
    if(obj.status == 0){
        return true;
    }else{
        return false;

    }
}

function sucessCallBack(obj){
    return true;
}

function errorFrameFileCallBack(textStatus, errorThrown, urlAndParam){
    console.log("textStatus " + textStatus + " errorThrown "
        + errorThrown + " url " + urlAndParam);
    return false;
}

function createEmptyDpf(fileName,processid,modelid,tenantid,name){
    var dataInfo = {
        "frameContent":'',
        "meta":"    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">",
        "titile":"",
        "css":["runtime/datavisual/css/datavisual.css"],
        "js":["runtime/datavisual/js/lib/jquery/jquery.min.js"],
        "body":"",
        "jscode":""
    };

    $.designerAjax('post','/datavisual/jersey-services/layoutit/frame/html/save/'+tenantid+'$'+fileName+'&pname=default&version=1.0/',JSON.stringify(dataInfo),sucessFrameFileCallBack,errorFrameFileCallBack);
    $.designerOrmBase.delete("bcp_re_form", {"cname" : "formurl","value" : tenantid+'$'+fileName,"compare" : "="}, function(data){if(data.status == 1){createDatavisual(fileName,processid,modelid,tenantid,name)}}, undefined);
}
function checkValueExist(value,type) {
    var conditions = [],
		typeMark = getUrlParam('type',pageParams);
	var con = new QueryCondition();
			var conType = new QueryCondition();
            if(type == 'name'){
				con.setCName("name").setCompare("=").setValue(value);
				conditions.push(con);
			}else{
				con.setCName("formurl").setCompare("like").setValue("%" + value + "%");
				conditions.push(con);
			}
    var obj = maoOrmBase.query("bcp_re_form",'["type"]', generateCondition(conditions,"or"));
    if(obj && obj.rows.length > 0){
		return false;
    }else{
		return true;
	}
}
function validateVM1474531931934(){
	$('#vm1474531931934').bootstrapValidator({
        fields:{
            input_text1474531957273:{
                validators: {
                    notEmpty: {
                        message: '名称不能为空'
                    },
					stringLength: {
						min: 1,
						max: 20,
						message: '名称长度不能超过20个字符'
				   },
                    regexp: {
                        regexp:/^(?!_)(?!.*?_$)[-a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                        message: '不能使用特殊字符或下划线开头结尾',
                    },
                    callback: {
                        callback: function(value, validator){
                            if(value && value.trim().length >=1) {
								return checkValueExist(value,"name");
                            }
                            return true;
                        },
						message: '名称已被使用'
                    }
                }
            },
			input_text1474531957274:{
                validators: {
                    notEmpty: {
                        message: '文件名不能为空'
                    },
					stringLength: {
						min: 1,
						max: 20,
						message: '文件名长度不能超过20个字符'
				   },
                    regexp: {
                        regexp: /^[-a-zA-Z0-9_]+$/,
                        message: '文件名只能是字母、数字、下划线和中划线'
                    },
                    callback: {
                        callback: function(value, validator){
                            if(value && value.trim().length >=1) {
                                var formurl = "$" + value + $("#suffix").text();
								return checkValueExist(formurl,"formurl");
								}
                            return true;
                        },
						message: '文件名已被使用'
						
                    }
                }
            },
            select_dynamic14871255964280:{
                validators: {
                    callback: {
                        message: '数据模型不能为空',
                        callback: function () {
                            var dataModel = $('#select_dynamic14871255964280').val();
                            if(dataModel == null || dataModel == ""){
                                return false;
                            }else{
                                return true;
                            }
                        }
                    }
                }
            },
            checkbox1487128020556:{
                validators: {
                    notEmpty: {
                        message: '页面类型不能为空'
                    }
                }
            }
        }
    });
}

function pageDocumentReadyAfter(){
    if(viewoperator == 'view'){
        var columns = ["name","type","formurl","modelid"],
			conditions = [],
			condition = new QueryCondition();
        condition.setCName("id").setCompare("=").setValue(getUrlParam("id",pageParams));
        conditions.push(condition);
        var obj = maoOrmBase.query("bcp_re_form",JSON.stringify(columns),generateCondition(conditions, 'and'));
        if(obj.rows.length>0){
            $('#input_text1474531957274').val(obj.rows[0]["formurl"].split('$')[1].split('.')[0]).attr('disabled','disabled');
            $('#input_text1474531957273').val(obj.rows[0]['name']).attr('disabled','disabled');
            $('#select_dynamic14871255964280').val(obj.rows[0]['modelid']);
            $('#button1474533166516').hide();
        }
    }
}

function submitPage(){
     var pageName = $('#input_text1474531957273').val();
        var bootstrapValidator = $("#vm1474531931934").data('bootstrapValidator');
        bootstrapValidator.validate();
        if(bootstrapValidator.isValid()){
            hideModalDialog("dialogApp");
            var dataPageType = [];
            $("[type=checkbox]:checked").each(function() {
                dataPageType.push($(this).val());
            });
            //调接口，生成文件
            var dataModel = $('#select_dynamic14871255964280').val(),
                tenantId = maoEnvBase.getCurrentTenantId(),
                mark = "",
                type = '',
                createFormResult = true,
                createListResult = true,
                createChartResult = true,
                url = $("#input_text1474531957274").val() + $("#suffix").text(),
                name = $("#input_text1474531957273").val();
            mark = getUrlParam("type",pageParams);
            packageId = getUrlParam("packageId",pageParams);
            var fileName = url;
            if(mark ==='two'){
                //表单
                type = 'Form';
                var itemObj = getItemObj(dataModel,type,tenantId,packageId,fileName,name);
                createFormResult = processTools.initForm(itemObj);
            }else if(mark ==='three'){
                //列表
                type = "Table";
                var itemObj = getItemObj(dataModel,type,tenantId,packageId,fileName,name);
                createListResult = processTools.initForm(itemObj);
            }else{
                //报表
                createChartResult = createEmptyDpf(fileName,packageId,dataModel,tenantId,name);
            }

            if(createFormResult== false){
                tipBox.showMessage('创建表单失败。','error');
            }else if(createListResult == false){
                tipBox.showMessage('创建列表失败。','info');
            }else if(createChartResult == false){
                tipBox.showMessage('创建图表失败。','info');
            }else{
                tipBox.showMessage('创建页面成功。','info');
            }
            mainIndexLogic.mark2table[mark].updateTableUI(mainIndexLogic.getUIModel(mark),mainIndexLogic.initEvent);
            return true;

        } else{
            return false;
        }
}

function submitPageAndGoDesign(){
    //确定并设计事件
    if(submitPage()){
        mainIndexLogic.designClick($('#select_dynamic14871255964280').val(),
                                    maoEnvBase.getCurrentTenantId() + '$' + $('#input_text1474531957274').val() + '.html',
                                    getUrlParam("type",pageParams));
    }

}

$(document).ready(function(){
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
    initVMData(vm1474531931934, 'bcp_re_form', 'bcp');
    initComponent('bcp',vm1474531931934);
    updateVMForComponentStatus(vm1474531931934, viewoperator)
    $("#button1474533168929").on('click', function() {
        hideModalDialog("dialogApp");
    });
    validateVM1474531931934();
    visiableComponent();
	 $('input[name="checkbox1487128020556"]:checked').off("click").on("click", function () {
		$('#input_text1474531957273').trigger("input");
		$('#input_text1474531957274').trigger("input");
    });
    avalon.scan(document.getElementById("vm1474531931934"));
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
    initModelSelect();
    //注册确定按钮事件
    $('#button1474533166516').on('click',function(){
        submitPage();
    });
    if(viewoperator == 'view'){
        $('#button14919595968970').hide();
    }
    $('#button14919595968970').on('click',function(){
        submitPageAndGoDesign();
    })
    if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
        applyFunc("pageDocumentReadyAfter", [])
    }
});




