var operator_type ;
var DS_Id = null;
var connect_check = 0;
var connect_status = 0;
var datasource_baseURL = bcp+'table/';
var innerSourceId = "innerSource"
var initDataSource = function(){
			initBusinessServicePageView();
			$(".btn-link").click(function(){
				showDataSource($(this).val());
			})
			loadDataSourceList();
			$("#button1476236970297").val(innerSourceId);
			$("#button1476236970297").click();
			$("div[compid='bfd_icon1477392976169'] a").click(function(){
				operator_type = 1;
				edit();
				clear();
			})
			
			$("#button1477446629743").click(function(){
				testDataSource();
			})
			
			$("#button1476236192130").click(function(){
				connect_Flag = false;
				var isValid = false;
				var val_com = $("#bfd_panel1476235914143").data('bootstrapValidator');
				val_com.validate();
				if(val_com.isValid()){
					isValid = true;
				}
				var DS_flag=$(".help-block").css("display");
				if(DS_flag == "block" ){
					return;
				}else if(DS_flag == "none" && isValid == true){
					saveDataSource();
				}
			})
			
			$("#button1476236226510").click(function(){
				var val_com = $("#bfd_panel1476235914143").data('bootstrapValidator');
				val_com.resetForm();
				if(operator_type == 2){
					$("button[value="+DS_Id+"]").click();
				}else{
					$("#button1476236970297").click();
				}
			})
			
		}

var initBusinessServicePageView = function () {
	var headRow = $('#vm1478155202799');
	headRow.css('background-color', '#fff');
	headRow.css('margin-bottom', '20px');
	$('div[compid="bfd_panel1476236950282"]').css('min-height', '255px');
	
	$('div[class="container container-top"]').css('background-color','#fff');
//	$('.bfd-panel').css('box-shadow','0 0 0 #fff');
};

var showDataSource = function (dataSourceId){
	var val_com = $("#bfd_panel1476235914143").data('bootstrapValidator');
	val_com.resetForm();
	loadInfo(dataSourceId);
	readOnly();
	$(".btn-link").css("font-size","14px");
	$("button[value="+dataSourceId+"]").css("font-size","18px");
}

var loadInfo = function (dataSourceId){
	var url = datasource_baseURL+'data_source_info_table?param=' + encodeURIComponent(JSON.stringify({
		columns:[{cname:'ID'},{cname:'NAME'},{cname:'ADAPTER_TYPE'},{cname:'HOST'},{cname:'PORT'},{cname:'SCHEMA'},{cname:'USER'},{cname:'PASSWORD'}],
		condition:{"cname":"ID","compare":"=","value":dataSourceId},
		orders:[],
		isDistinct:true
	}))
	
	var result = $.designerAjax('get',url, undefined, undefined, undefined);
	if (result.status == 1 && result.rows.length > 0) {
	var row = result.rows[0];
	$('#input_text1476236059345').val(row.ID);
	$('#input_text1476236058391').val(row.NAME);
	if(row.ADAPTER_TYPE == 1){
		$('#select_dynamic1476255634792').val('orm')
	}
	$('#input_text1476236053143').val(row.HOST);
	$('#input_text1476236056609').val(row.PORT);
	$('#input_text1476236061861').val(row.SCHEMA);
	$('#input_text1476236134051').val(row.USER);
	$('#input_text1476255418310').val(row.PASSWORD);
	}
}

function readOnly(){
	$('#input_text1476236059345').attr('disabled','disabled');
	$('#input_text1476236058391').attr('disabled','disabled');
	$('#select_dynamic1476255634792').attr('disabled','disabled');
	$('#input_text1476236053143').attr('disabled','disabled');
	$('#input_text1476236056609').attr('disabled','disabled');
	$('#input_text1476236061861').attr('disabled','disabled');
	$('#input_text1476236134051').attr('disabled','disabled');
	$('#input_text1476255418310').attr('disabled','disabled');
	$('#layout1476236170524').hide();
}

function edit(){
	$('#input_text1476236059345').attr('disabled',false);
	$('#input_text1476236058391').attr('disabled',false);
	$('#select_dynamic1476255634792').attr('disabled',false);
	$('#input_text1476236053143').attr('disabled',false);
	$('#input_text1476236056609').attr('disabled',false);
	$('#input_text1476236061861').attr('disabled',false);
	$('#input_text1476236134051').attr('disabled',false);
	$('#input_text1476255418310').attr('disabled',false);
	$('#layout1476236170524').show();
}

function clear(){
	$('#input_text1476236059345').val("");
	$('#input_text1476236058391').val("");
	$('#input_text1476236053143').val("");
	$('#input_text1476236056609').val("");
	$('#input_text1476236061861').val("");
	$('#input_text1476236134051').val("");
	$('#input_text1476255418310').val("");
}

function loadDataSourceList(){
//	debugger;
	$("#layout1476236956943").empty();
	var url = datasource_baseURL+'data_source_info_table?param=' + encodeURIComponent(JSON.stringify({
		columns:[{cname:'ID'},{cname:'NAME'}],
		condition:{},
		orders:[],
		isDistinct:true
	}))
	var result = $.designerAjax('get',url, undefined, undefined, undefined);
	
	if (result.status == 1 && result.rows.length > 1) {
		for(var index = 0;index<result.rows.length;index++){
			if(result.rows[index].ID != innerSourceId){
				var p = '<div id="layout1476236956943" compid="layout1476236956943" type="layout">';
				p += '<div class="row clearfix">'
				p += '<div class="col-md-8 col-xs-8 col-sm-8 col-lg-8 column">'
				p += '<div class="layout-align-left" compid="button1476236973485" type="button">'
				p += '<button class="btn btn-link" onclick=showDataSource("'+result.rows[index].ID+'") i18nkey='+result.rows[index].NAME+' name="button1476236973485" id="button1476236973485" type="button" value='+result.rows[index].ID+'>'+result.rows[index].NAME+'</button>'
				p += '</div>'
				p += '</div>'
				p += '<div class="col-md-2 col-xs-2 col-sm-2 col-lg-2 column">'
				p += '<div class="layout-block-align-center" compid="bfd_icon1476237126151" type="bfd_icon">'
				p += '<a class="icon glyphicon glyphicon-edit" onclick=editDataSource("'+result.rows[index].ID+'")></a>'
				p += '</div>'
				p += '</div>'
				p += '<div class="col-md-2 col-xs-2 col-sm-2 col-lg-2 column">'
				p += '<div compid="bfd_icon1476237147415" type="bfd_icon">'
				p += '<a class="icon glyphicon glyphicon-remove" onclick=deleteDataSource("'+result.rows[index].ID+'")></a>'
				p += '</div>'
				p += '</div>'
				p += '</div>'
				$("#layout1476236956943").append(p)
			}
		}
	}
}

var deleteDataSource = function(dataSourceId){
	$("button[value="+dataSourceId+"]").click();
	 bootbox.confirm("确认删除该项数据源("+dataSourceId+")吗？",function (result) {
	        if(result){
	        	var url = datasource_baseURL+'data_source_info_table?param=' + encodeURIComponent(JSON.stringify({
	        		condition:{"and":[{"cname":"ID","compare":"=","value":dataSourceId}]},
	        	}))
	        	 var result = $.designerAjax('delete',url, undefined, undefined, undefined);
		        $("#button1476236970297").click()
		        loadDataSourceList();
	        }
	      })
}

var saveDataSource = function(){
	var url = datasource_baseURL+'data_source_info_table';
	var adapter_type ;
	if($("#select_dynamic1476255634792").val() == 'orm'){
		adapter_type = 1;
	}else{
		adapter_type = 2;
	}
	if(operator_type == 1){
		var bodydata = '{"columns":{"NAME":"'+$("#input_text1476236058391").val()+'","ID":"'+$("#input_text1476236059345").val()+'","HOST":"'+$("#input_text1476236053143").val()+'","PORT":"'+$("#input_text1476236056609").val()+'","SCHEMA":"'+$("#input_text1476236061861").val()+'","USER":"'+$("#input_text1476236134051").val()+'","PASSWORD":"'+$("#input_text1476255418310").val()+'","ADAPTER_TYPE":"'+adapter_type+'"}}'
		var result = $.designerAjax('post',url, bodydata, undefined, undefined);
		if(result.status == 1){
			bootbox.alert("保存成功！");
			loadDataSourceList();
			DS_Id=$("#input_text1476236059345").val();
			$("button[value="+DS_Id+"]").click();
		}else{
			bootbox.alert("保存失败,数据源标识不可重复！");
		}
	}else if(operator_type == 2){
		var bodydata = '{"columns":{"NAME":"'+$("#input_text1476236058391").val()+'","ID":"'+$("#input_text1476236059345").val()+'","HOST":"'+$("#input_text1476236053143").val()+'","PORT":"'+$("#input_text1476236056609").val()+'","SCHEMA":"'+$("#input_text1476236061861").val()+'","USER":"'+$("#input_text1476236134051").val()+'","PASSWORD":"'+$("#input_text1476255418310").val()+'","ADAPTER_TYPE":"'+adapter_type+'"},"condition":{"and":[{"cname":"ID","compare":"=","value":"'+DS_Id+'"}]}}'
		var result = $.designerAjax('put',url, bodydata, undefined, undefined);
		if(result.status == 1){
			bootbox.alert("保存成功！")
			loadDataSourceList();
			$("button[value="+DS_Id+"]").click();
		}else{
			bootbox.alert("保存失败！请联系系统管理员！")
		}
	}
}

var testDataSource = function(){
	
	var ip = $("#input_text1476236053143").val();
	var port = $("#input_text1476236056609").val();
	var uri = $("#input_text1476236061861").val();
	var testUrl ="http://"+ip+":"+port+uri+"/orm/metadata/tablenames";
	var ajaxTimeout = $.ajax({
		url:testUrl,
		async:true,
		type:"GET",
		dataType:"JSONP",
		timeout: 1000,
		jsonpCallback:"",
		success:function(data,status){
		},
		error:function(xhr,textStatus,errorThrown){
			if(xhr.status == 200 && xhr.readyState == 4){
				if(xhr.statusText == "success" || xhr.statusText == "OK"){
						connect_status = 1;
						bootbox.alert("数据源连接测试成功！");
						return true;
				}
			}else{
					connect_status = 0;
					bootbox.alert("数据源连接测试失败！请更改配置！");
					return false;
				ajaxTimeout.abort();
			}
		}

	})
}




var editDataSource = function(dataSourceId){
	operator_type = 2;
	$("button[value="+dataSourceId+"]").click();
	edit();
	DS_Id = dataSourceId;
}

var checkDataSourceId = function(value){
	if(operator_type == 1){
		var urlParam = {
	            columns : [ {
	                cname : 'ID'
	            }, {
	                cname : 'NAME'
	            } ],
	            isDistinct : true,
	            condition : {
	            	'cname':'ID',
	            	'compare':'=',
	            	'value':value
	            	}
	        };
	 var url = datasource_baseURL+'data_source_info_table?param=' + encodeURIComponent(JSON.stringify(urlParam));
	        var result = $.designerAjax('get',url, undefined, undefined, undefined);
	        if (result.status == 1 && result.rows.length > 0) {
	           return false;
	        }else{
	        	return true;
	        }
	 }
	 return true;
}

function pageDocumentReadyAfter(){
	initDataSource();
}