/**
 * Created by 10177027 on 2015/12/8.
 */
var vm1449483622439 = avalon.define({$id: 'vm1449483622439',
	tenant_id:0,	    
	role_id:-1,
	status:1,
	login_name: '', 
    login_name_form_disabled : false,
    fullname: '', 
    fullname_form_disabled : false,
    password: '888888', 
    password_form_disabled : false,
    nick_name: '', 
    nick_name_form_disabled : false,
    real_name: '', 
    real_name_form_disabled : false,
    birth_date: '', 
    birth_date_form_disabled : false,
    tag: '', 
    tag_form_disabled : false,
    mobile: '', 
    mobile_form_disabled : false,
    email: '', 
    email_form_disabled : false,
    description: '', 
    description_form_disabled : false,
	username:'',
	ispasswordchanged:false
});

/**
 租户用户管理
 */
function TenantUser(){
    this.login_name = "";
	this.operator = "";
	this.oldPassword = "";
	this.currentPageNum = "";
	this.currentPageRows = "";
}

TenantUser.prototype = {
	init:function(){
		this.operator = "add";			
		/**
			获取url参数
		*/
		var href = window.location.href;
		if(getUrlParam("login_name", href)){
			this.login_name = getUrlParam("login_name", href);
		}
		
		if(getUrlParam("operator", href)){
			this.operator = getUrlParam("operator", href);
		}
		
		if(getUrlParam("pageNum", href)){
			this.currentPageNum = getUrlParam("pageNum", href);
		}
		
		if(getUrlParam("pageRows", href)){
			this.currentPageRows = getUrlParam("pageRows", href);
		}
		
		/**
			加载角色元数据
		*/
		this.loadRoleData();
		
		this.setBreadcrumbHtml();
		
		/**
			加载用户数据	
		*/
		initComponent('bcp',vm1449483622439);
		
		this.loadData();
		
		/**
			设置表单可编辑性
		*/
		this.setViewStatus();		
	},
	loadData:function(){
		if(!this.login_name || this.login_name === ""){
			return;
		}
		
		var that = this;
		var param=new AjaxParameter();
        param.url="mao/tenant/users?login_name="+this.login_name;		
        param.callBack=function(data){
            if(data && data.status === 1 && data.data){
                $.each(data.data,function(index,item){					
					for(var subIndex in item){
						vm1449483622439[subIndex] = item[subIndex];
						if(subIndex === "role_id"){
							$("[type=radio][value="+item[subIndex]+"]").attr("checked",true);
						}
						if(subIndex === "login_name"){
							vm1449483622439[subIndex] = item[subIndex].split("@")[0];							
						}
						if(subIndex === "status" && item.status !== 1){
							$("#chkStatus").attr("checked",true);
						}
					}
				});	
				that.oldPassword = vm1449483622439.password;
            }
        };
        param.async = true;
        dsTool.getData(param);
	},
	loadRoleData:function(){		
		var param = {"columns":[{"cname":"ID"},{"cname":"NAME"}],"orders":[],"condition":{}};
		var url = "orm/table/role?param="+JSON.stringify(param);
		var param=new AjaxParameter();
        param.url=url;
        param.callBack=function(data){
			var html = [];
            if(data && data.status === 1 && data.rows){
                $.each(data.rows,function(index,item){					
					html.push("<label style=\"margin-right:10px;cursor:pointer\"><input  name=\"role\" type=\"radio\" value=\""+item.ID+"\">"+item.NAME+"</label>"); 
				});
            }
			$("#divRoleBox").html(html.join(" "));	
        };
        param.async = false;
        dsTool.getData(param);			
	},
	setViewStatus:function(){
		if(this.operator === "update"){
			vm1449483622439.login_name_form_disabled = true; 
		}else if(this.operator === "view"){
			vm1449483622439.login_name_form_disabled = true;
			vm1449483622439.email_form_disabled = true;
			vm1449483622439.mobile_form_disabled = true;
			vm1449483622439.password_form_disabled = true;
			vm1449483622439.fullname_form_disabled = true;
			vm1449483622439.nick_name_form_disabled = true;
			vm1449483622439.real_name_form_disabled = true;
			vm1449483622439.birth_date_form_disabled = true;
			vm1449483622439.tag_form_disabled = true;
			vm1449483622439.sub_company_id_form_disabled = true;
			vm1449483622439.description_form_disabled = true;	
			$("#btnSubmit").hide();
			$("[type=radio],#chkStatus").attr("disabled","disabled");
		}	
	},	
    getModelData:function(viewModel){
        var newmodel = {};
		vm1449483622439["username"] = vm1449483622439["login_name"] ;
		var roleId = $("[type=radio]:checked").val();
		if(roleId){
			vm1449483622439["role_id"] = roleId;
		}
		
		vm1449483622439["status"] = 1;
		if($("#chkStatus:checked").length > 0){
			vm1449483622439["status"] = 0; 
		}
		
        for(var pro in viewModel.$model) {
            if(pro.indexOf("form_disabled") > -1||pro.lastIndexOf("_form_compute")>-1) {
                continue;
            }
            newmodel[pro] = viewModel.$model[pro];
        }
        return newmodel;
    },
	resetValidationStatus:function(){
		$("#vm1449483622439").data('bootstrapValidator').resetForm();
	},
    validate:function(){
		this.resetValidationStatus();
		$("#vm1449483622439").bootstrapValidator('validate');
		if($("#vm1449483622439").data('bootstrapValidator').isValid()) {
			this.resetValidationStatus();
			return true;
		}
		return false;	
    },
    isUserExist:function(value){
		var existObj = {},
        	param=new AjaxParameter(),
			userName = maoEnvBase.getCurrentUserName();
        param.url="mao/tenant/users/check/" + value + "@" + userName.split("@")[1];
        param.callBack=function(data){
			existObj = data;
        };
		param.errorBack==function(){
			existObj.status = MaoOrmBase.STATUS_FAIL;
		};
        param.async = false;
        param.data = null;
        dsTool.saveData(param);
        if (existObj.status == MaoOrmBase.STATUS_SUCCESS && existObj.data) {
        	return false;
        } else {
        	return true;
        }
    },
    add:function(){
		if(!this.validate()){			
			return;	
		}
		
		var that = this;
        var param=new AjaxParameter();
        param.url="mao/tenant/users/add";		
        param.callBack=function(data){
            if(data && data.status === 1){
				tipBox.showMessage('用户添加成功。',tipBox.INFO);
				that.redirectToList(); 
            }else{
				tipBox.showMessage('用户添加失败。',tipBox.ERROR);
				console.error(data.message);
			}
        };
		param.errorBack==function(){
			tipBox.showMessage('请求数据错误，请联系管理员。','error');
		};
        param.async = true;
		var model = this.getModelData(vm1449483622439);
		model.password = ict_framework_func1(model.password);
        param.data = JSON.stringify(model);
        dsTool.saveData(param);
    },
    update:function(){
		if(!this.validate()){			
			return;	
		}
		
		var that = this;
        var param=new AjaxParameter();
        param.url="mao/tenant/users/update";
        param.callBack=function(data){
            if(data && data.status === 1){
				tipBox.showMessage('用户修改成功。',tipBox.INFO);
				that.redirectToList();      
            }else{
				tipBox.showMessage('用户更新失败。',tipBox.ERROR);
				console.error(data.message);
				
			}
        };
		param.errorBack==function(){
			tipBox.showMessage('请求数据错误，请联系管理员。','error');
		};
        param.async = true;	
		
		var model = this.getModelData(vm1449483622439);
		if(this.oldPassword	!== model.password){
			model.ispasswordchanged = true;
			model.password = ict_framework_func1(model.password);
		}else{
			model.ispasswordchanged = false;			
		}
        param.data = JSON.stringify(model);
        dsTool.updateData(param);
    },
	redirectToList:function(){
		window.setTimeout("window.location.href='tenant_user_list.html'",1000);
	},
	setBreadcrumbHtml:function(){
		var html = [];
		
		html.push('<p class="fz20">');
		html.push('<b>');
		html.push('<span class="title"">用户管理</span>'+' > ');
		if (this.operator == 'add') {
			html.push('<span class="title">新增用户</span>'+'<i class="fa fa-angle-right"></i>');
		} else if (this.operator == 'update') {
			html.push('<span class="title">修改用户</span>'+'<i class="fa fa-angle-right"></i>');
		} else if (this.operator == 'view') {
			html.push('<span class="title">查看用户</span>'+'<i class="fa fa-angle-right"></i>');
		}
		html.push('</b>');
		html.push('</p>');
		
		$(".page-navigation").empty().append(html.join(" "));
	},
	cancel: function() {
		window.location.href = "tenant_user_list.html?operator=&currentPageNum=" + this.currentPageNum + "&currentPageRows=" + this.currentPageRows;
	}
}

$(document).ready(function(){
	$("#select_dynamic1461122416364").append('<option value=0>无</option>');
	vm1449483622439.sub_company_id = 0;
    var tUser = new TenantUser();
	tUser.init();
    $("#btnSubmit").click(function(){        
		if(tUser.operator === "add"){
			tUser.add();	
		}else if(tUser.operator === "update"){
			tUser.update();
		}		
    });
	$("#btnCancel").click(function(){
		tUser.cancel();
	})
	$('#birth_date').data('DateTimePicker').format('YYYY-MM-DD');
	$('#vm1449483622439').bootstrapValidator({
        fields:{
            login_name:{
                validators: {
					notEmpty: {
						message: '用户名不能为空'
					},
					regexp: {
						regexp: /^[-a-zA-Z0-9_]+$/,
						message: '该字段只能是字母、整数、中划线和下划线'
					},
					callback: {
						message: '用户名已存在',
						callback: function(value) {
							return tUser.isUserExist(value);
						}
					}
				}
            },
            password:{
                validators: {
                    notEmpty: {
                    	message: '密码不能为空'
                    }
                }
            },
            mobile:{
                validators: {
					notEmpty: {
						message: '电话不能为空'
					},	
                    phone:{country:'CN'}
                }
            },
			birth_date:{
				validators: {
					notEmpty: {
						message: '用户生日不能为空'
					},
					date:{format: 'YYYY-MM-DD'}
                }
			},
            email:{
                validators: {
					notEmpty: {
						message: '邮箱不能为空'
					},	
                    emailAddress:{}
                }
            },
			real_name:{
				validators: {
					notEmpty: {
						message: '用户真实名称不能为空'
					}
                }
			}				
        }
    });
})