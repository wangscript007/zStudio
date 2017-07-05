function TenantUserList(){
	this.currentPageNumber = "";
	this.currentPageRows = "";
}
TenantUserList.formatDetail = function(value,row){
	var login_name = row.login_name.split("@")[0];
	this.currentPageNumber = $('#table_base_users').bootstrapTable('getOptions').pageNumber;
	this.currentPageRows = $('#table_base_users').bootstrapTable('getOptions').pageSize;
	return "<a  href=\"tenant_user_detail.html?time=" + getCurrentTime()
		+ "&operator=view&login_name=" + row.login_name 
		+ "&pageNum=" + this.currentPageNumber 
		+ "&pageRows=" + this.currentPageRows + "\">"+login_name+"</a>";
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
		console.debug($('#table_base_users').bootstrapTable('getSelections')[0]);
		var selectedItem = $('#table_base_users').bootstrapTable('getSelections')[0];
		if(!selectedItem){
			return undefined;
		}
		return selectedItem.login_name;
	},
	loadData:function(){
		var login_name = $("#login_name").val(); 
		if(!login_name){
			login_name = "";
		}
		
		var href = window.location.href;
		if(getUrlParam("currentPageNum", href)){
			this.currentPageNumber = getUrlParam("currentPageNum", href);
		} else {
			this.currentPageNumber = 1;
		}
		
		if(getUrlParam("currentPageRows", href)){
			this.currentPageRows = getUrlParam("currentPageRows", href);
		} else {
			this.currentPageRows = 10;
		}
		
		var that = this;
		var param=new AjaxParameter();
        param.url="mao/tenant/users?login_name=" + login_name;
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
				
				$('#table_base_users').bootstrapTable("appendData", data.data);
				$('#table_base_users').bootstrapTable("selectPage", that.currentPageNumber);
            }
        };
        param.async = true;
        dsTool.getData(param);
	},
	loadFilterData:function(){
		var login_name = $("#login_name").val(); 
		if(!login_name){
			login_name = "";
		}
		
		var that = this;
		var param=new AjaxParameter();
		param.url="mao/tenant/filter/users?login_name=" + login_name;
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
				
				$('#table_base_users').bootstrapTable("appendData", data.data);
			}
		};
		param.async = true;
		dsTool.getData(param);
	},
	delete:function(){
		var login_name = this.getSelectedItem();
		if(!login_name){
			tipBox.showMessage('请选择要删除的用户数据。','error');
			return;
		}
		if(login_name.indexOf("admin@") === 0){
			tipBox.showMessage('admin用户不允许删除。','error');
			return;
		}
		var that = this;
		bootbox.setDefaults("locale","zh_CN");
		$(document).find('body').addClass("modal-open");
		bootbox.confirm("确认要删除所选用户吗？", function(result) {
			if(result){
				var param=new AjaxParameter();
				param.url="mao/tenant/users/delete/"+login_name;
				param.callBack=function(data){
					if(data && data.status === 1){
						tipBox.showMessage('删除成功。','info')
						that.loadData();
					}else{
						tipBox.showMessage('删除失败。','error');
					}
				};
				param.async = true;			
				dsTool.deleteData(param);
			}			
		});		
	},
	update:function(){
		var login_name = this.getSelectedItem();
		this.currentPageNumber = $('#table_base_users').bootstrapTable('getOptions').pageNumber;
		this.currentPageRows = $('#table_base_users').bootstrapTable('getOptions').pageSize;
		if(!login_name){
			$('#frmTipBox').empty();
			tipBox.showMessage('请选择要修改的用户数据。','error');
			return;
		}
		if(login_name.indexOf("admin@") === 0){
			tipBox.showMessage('admin用户不允许修改。','error');
			return;
		}
		window.location.href = "tenant_user_detail.html?time="+getCurrentTime()
			+ "&login_name="+login_name 
			+ "&pageNum=" + this.currentPageNumber
			+ "&pageRows=" + this.currentPageRows + "&operator=update";
	},
	add:function(){
		this.currentPageNumber = $('#table_base_users').bootstrapTable('getOptions').pageNumber;
		this.currentPageRows = $('#table_base_users').bootstrapTable('getOptions').pageSize;
		window.location.href = "tenant_user_detail.html?login_name=" + "&pageNum=" 
			+ this.currentPageNumber + "&pageRows=" + this.currentPageRows + "&operator=add";
	}
}


$(document).ready(function(){
    var table = bootstrapTable('table_base_users', adjustTableParam('table_base_users','undefined', 'undefined', 
	{"striped":true,"pagination":true,"pageSize":"10","pageList":[10,20,50,100,200],"height":"500","selectItemName":"radio","clickToSelect":true,"search":false,"showColumns":false,"showRefresh":false,"sidePagination":"client","sortable":true,"idTable":"table_base_users","idField":"$id","pk":["$id"],
	"columns":[{"field":"$id","visible":false,"title":"","width":50,"class":"td-word-wrap"},
	{"field":"tenant_id","title":"","radio":"true", "width":50, "class":"td-word-wrap"},
	{"field":"login_name","title":"用户名","formatter":"TenantUserList.formatDetail","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""},
	{"field":"fullname","title":"用户全名","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""},
	{"field":"mobile","title":"电话","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""},
	{"field":"email","title":"邮箱","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""},
	{"field":"create_time","title":"创建时间","formatter":"","editable":false,"visible":true,"validate":"","valign":"middle","class":"td-word-wrap","tableId":"table_base_users","width":""}	
	]})); 
	
	var tUser = new TenantUserList();
	tUser.loadData();
	
	$("#btnSearch,#btnRefresh").click(function(){
		tUser.loadFilterData();
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

