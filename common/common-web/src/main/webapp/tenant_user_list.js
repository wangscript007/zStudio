function TenantUserList(){
	
}
TenantUserList.formatOperator = function(value,row){
	return "<input type=\"radio\" name=\"radio\" login_name=\""+row.login_name+"\">";
}
TenantUserList.formatDetail = function(value,row){
	var login_name = row.login_name.split("@")[0];
	return "<a  href=\"tenant_user_detail.html?time="+getCurrentTime()
		+"&operator=view&login_name="+row.login_name+"\">"+login_name+"</a>";
}
TenantUserList.formatStatus = function(value,row){
	var checked = "";
	if(value !== 1){
		checked = "checked";
	}
	return "<input type=\"checkbox\" "+checked+" disabled/>";
}
TenantUserList.prototype = {
	getSelectedItem:function(){
		return $("[type=radio]:checked").attr("login_name");
	},
	loadData:function(){
		var login_name = $("#login_name").val(); 
		if(!login_name){
			login_name = "";
		}
		
		var param=new AjaxParameter();
        param.url="mao/tenant/users?login_name="+login_name;
        param.callBack=function(data){
            $('#table_base_users').bootstrapTable('removeAll');
			if(data && data.status === 1 && data.data){ 
				$.each(data.data,function(index,item){
					for(var subIndex in item){
						if(item[subIndex] === null){
							item[subIndex] = "";
						}
					}
				});
				
				$('#table_base_users').bootstrapTable("appendData",data.data);
            }
        };
        param.async = true;
        dsTool.getData(param);
	},
	delete:function(){
		var login_name = this.getSelectedItem();
		if(!login_name){
			bootbox.alert("请选择要删除的用户数据！");
			return;
		}
		
		var that = this;
		bootbox.confirm("确认要删除所选用户吗？", function(result) {
			if(result){
				var param=new AjaxParameter();
				param.url="mao/tenant/users/delete/"+login_name;
				param.callBack=function(data){
					if(data && data.status === 1){
						bootbox.alert("删除成功！");
						that.loadData();
					}else{
						bootbox.alert("删除失败！");
					}
				};
				param.async = true;			
				dsTool.deleteData(param);
			}			
		});		
	},
	update:function(){
		var login_name = this.getSelectedItem();
		if(!login_name){
			bootbox.alert("请选择要修改的用户数据！");
			return;
		}
		
		window.location.href = "tenant_user_detail.html?time="+getCurrentTime()+"&login_name="+login_name+"&operator=update";
	},
	add:function(){
		window.location.href = "tenant_user_detail.html?login_name=&operator=add";
	}
}


$(document).ready(function(){    
    var table = bootstrapTable('table_base_users', adjustTableParam('table_base_users','undefined', 'undefined', 
	{"striped":true,"pagination":true,"pageSize":"100","pageList":[10,20,50,100,200],"height":"480","search":false,"showColumns":false,"showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_users","idField":"$id","pk":["$id"],
	"columns":[{"field":"$id","visible":false,"title":"","width":50,"class":"td-word-wrap"},
	{"field":"tenant_id","title":"","formatter":"TenantUserList.formatOperator", "width":50,"class":"td-word-wrap"},
	{"field":"login_name","title":"用户名","formatter":"TenantUserList.formatDetail","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""},
	{"field":"fullname","title":"用户全名","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""},
	{"field":"mobile","title":"电话","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""},
	{"field":"email","title":"邮箱","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""}	
	]})); 
	
	var tUser = new TenantUserList();
	tUser.loadData();
	
	$("#btnSearch,#btnRefresh").click(function(){
		tUser.loadData();
	});
	
	$("#btnAdd").click(function(){
		tUser.add();
	});
	
	$("#btnUpdate").click(function(){
		tUser.update();
	});
	
    $("#btnDelete").click(function(){
		tUser.delete();
	});	
	
	
});

