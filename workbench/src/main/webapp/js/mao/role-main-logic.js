var PublicRoleControl = function() {};
	
PublicRoleControl.prototype = {
	mainId: 'vm1449647616006',
	operateId: 'vm1449825112639',
	goMain: function() {
		//$('#' + vm1449825112639.$id).data('bootstrapValidator').resetForm();
		$('#' + this.mainId).show();
		$('#' + this.operateId).hide();
	},
	goOperate: function() {
		$('#' + this.operateId).show();
		$('#' + this.mainId).hide();
	},
	showMainOROperate: function(showMain) {
		if (showMain) {
			$('#' + this.mainId).show();
			$('#' + this.operateId).hide();
		}
		else {
			$('#' + this.operateId).show();
			$('#' + this.mainId).hide();
		}
	}
};

var RoleModule = function() {};
RoleModule.prototype = {
	roleUrl: 'orm/table/role',
	getTableRole: function() {
		return getTableSelectData('table_base1449647721791');
	},
	queryRoleInfo: function() {
		var rows = this.getTableRole();
		if (rows != null && rows != undefined && rows.length == 1) {
			publicRoleControl.goOperate();
			roleOperateModule.isLook = true;
			roleOperateModule.isAdd = false;
			roleOperateModule.isOperateOrView(false, rows[0].ID);
		} else {
			bootbox.alert('请选择一个角色。');
		}
	},
	editRole: function() {
		var rows = this.getTableRole();
		if (rows != null && rows != undefined && rows.length == 1) {
			publicRoleControl.goOperate();
			roleOperateModule.isAdd = false;
			roleOperateModule.isLook = false;
			roleOperateModule.isOperateOrView(true, rows[0].ID);
		} else {
			bootbox.alert('请选择一个角色。');
		}
	},
	refreshRole: function() {
		this.queryRole();
	},
	queryRole: function() {
		var conditions = new Array();
		if (this.name != null && this.name.length > 0) {
			var conditionName = new QueryCondition();
			conditionName.setCName('NAME');
			conditionName.setCompare('like');
			conditionName.setValue('%' + name + '%');
			conditions.push(conditionName);
		}
		if (this.desc != null && this.desc.length > 0) {
			var conditionDesc = new QueryCondition();
			conditionDesc.setCName('DESC');
			conditionDesc.setCompare('like');
			conditionDesc.setValue('%' + desc + '%');
			conditions.push(conditionDesc);
		}
		queryRemoteTable('table_base1449647721791', conditions);
	},
	addRole: function() {
		publicRoleControl.goOperate();
		roleOperateModule.isAdd = true;
		roleOperateModule.isLook = false;
		roleOperateModule.isOperateOrView(true, '');
	},
	uniqueArray: function(data) {  
	   data = data || [];  
	   var a = {};  
	   for (var i = 0; i < data.length; i++) {  
		   var v = data[i];  
		   if (typeof(a[v]) == 'undefined'){  
				a[v] = 1;  
		   }  
	   };  
	   data.length=0;  
	   for (var i in a){  
			data[data.length] = i;  
	   }  
	   return data;  
	},
	haveUser: function(rows) {
		var conditions = {};
		var conditionsRole = {};
		if (rows.length > 1) {
			conditions.or = [];
			$.each(rows, function(index, value) {
				var condition = {};
				var conditionRole = {};
				condition.cname = 'ROLE_ID';
				condition.value = value.ID;
				condition.compare = '=';
				conditions.or.push(condition);
				conditionRole.cname = 'ID';
				conditionRole.value = value.ID;
				conditionRole.compare = '=';
				conditionsRole.or.push(condition);
			});
		}
		else {
			conditions.cname = 'ROLE_ID';
			conditions.value = rows[0]["ID"];
			conditions.compare = '=';
			
			conditionsRole.cname = 'ID';
			conditionsRole.value = rows[0]["ID"];
			conditionsRole.compare = '=';
		}
		$.ajax({
			type: "GET",
			url: 'orm/table/sm_user_table?param={"columns":[{"cname":"USERID"},{"cname":"ROLE_ID"}],"condition":' + JSON.stringify(conditions) + '}',
			datatype: 'json',
			contentType :'application/json; charset=UTF-8',
			async: false,
			success: function (data) {
				var resultdata = {};
				if ((typeof data == 'string')
						&& (data.constructor == String)) {
					resultdata = JSON.parse(data);
				} else {
					resultdata = data;
				}
				
				if (resultdata.status == 1) {
					if(resultdata.rows.length > 0) {
						var hasRolesNameArr = [];
						$.each(resultdata.rows, function(index, value) {
							$.each(rows, function(indexRole, valueRole) {
								if (value.ROLE_ID == valueRole.ID) {
									hasRolesNameArr.push(valueRole.NAME);
								}
							});
						});
						var strPrompt = '';
						$.each(roleModule.uniqueArray(hasRolesNameArr), function(index, value) {
							if (index != 0) {
								strPrompt += '，';
							}
							strPrompt += '“' + value + '”';
						});
						strPrompt += '，角色还有用户不能删除。';
						bootbox.alert(strPrompt);
					}
					else {
						roleModule.exeDeleteRole('?param={"condition":' + JSON.stringify(conditionsRole) + '}');
					}
				}
				else {
					bootbox.alert('请求数据失败。');
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				bootbox.alert('请求数据失败。');
			}
		});
	},
	exeDeleteRole: function(param) {
		$.ajax({
			type: "DELETE",
			url: this.roleUrl + param,
			datatype: 'json',
			contentType :'application/json; charset=UTF-8',
			async: false,
			success: function (data, textStatus) {
				bootbox.alert('删除数据成功。');
				roleModule.queryRole();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				bootbox.alert('删除数据失败。');
			}
		});
	},
	deleteRole: function() {
		var rows = this.getTableRole();
		if (rows != null && rows != undefined && rows.length > 0) {
			bootbox.confirm("确认要删除当前角色吗？", function(result) {
				if(result) {
					roleModule.haveUser(rows);
				}
			});
		}
		 else {
			bootbox.alert('请选择角色。');
		}
	}
};

var RoleOperateModule = function() {};
RoleOperateModule.prototype = {
	roleUrl: 'orm/table/role',
	functionUrl: 'orm/table/operator_res',
	//functionUrl: 'orm/table/tenant_menu',
	userUrl: 'orm/table/sm_user_table',
	getTree: function() {
		return $.fn.zTree.getZTreeObj(this.treeId);
	},
	idInputId: 'input_text1449825703041',
	viewRegionInputId: 'input_text14498257406721',
	functionKeyInputId: 'input_text1449825975718',
	nameInputId: 'input_text1449825740672',
	descInputId: 'textarea1449826032992',
	okBtnId: 'btn-1521521255-ok',
	userTableId: 'table_base1449912971006',
	viewTreeLanyId: 'layout1449825544691',
	isOperateOrView: function(istrue, id) {
		if (id != undefined && id != '') {
			this.queryRole(id);
			$('#' + this.userTableId).show();
			this.getTable();
		} else {
			this.setDisoperatorKeys('');
			this.setId('');
			this.setName('');
			this.setDesc('');
			$('#' + this.userTableId).hide();
		}
		this.initTree();
		var isDisabled = true;
		if (istrue) {
			isDisabled = false;
		}
		$('#' + this.nameInputId).attr("disabled",isDisabled);
		$('#' + this.descInputId).attr("disabled",isDisabled);
		if (istrue) {
			$('#' + this.okBtnId).show();
		}
		else {
			$('#' + this.okBtnId).hide();
		}
	},
	setDisoperatorKeys: function(functionKeys) {
		$('#'+ this.functionKeyInputId).val(functionKeys);
	},
	getDisoperatorKeys: function() {
		return $('#'+ this.functionKeyInputId).val();
	},
	setId: function(id) {
		$('#'+ this.idInputId).val(id);
	},
	getId: function() {
		return $('#'+ this.idInputId).val();
	},
	setName: function(name) {
		return $('#'+ this.nameInputId).val(name);
	},
	getName: function() {
		return $('#'+ this.nameInputId).val();
	},
	setDesc: function(dsec) {
		$('#'+ this.descInputId).val(dsec);
	},
	getDesc: function() {
		return $('#'+ this.descInputId).val();
	},
	selectHaveRoleFunction: function() {
		var conditionsRole = {};
		conditionsRole.cname = 'KEY';
		conditionsRole.value = this.getDisoperatorKeys().split(",");
		conditionsRole.compare = 'not in';
		var param = this.functionUrl + '?param={"columns":[{"cname":"KEY"}],"condition":' + JSON.stringify(conditionsRole) + '}';
		return this.selectData(param);
	},
	getAllFunction: function() {
		var param = {
			columns: [
			   {cname: 'KEY'},
			   {cname: 'NAME'},
			   {cname: 'PARENT_KEY'}
			]
		};
		
		return this.selectData(this.functionUrl + '?param=' + JSON.stringify(param));
	},
	getTreeData: function() {
		var data = [];
		var allFunction = this.getAllFunction();
		if (allFunction.status == 1) {
			var that = this;
			if (this.isAdd) {
				$.each(allFunction.rows, function(index, value) {
					if (value.PARENT_KEY == undefined || value.PARENT_KEY == '') {
						value.open = true;
					} else {
						value.open = false;
					}
					value.checked = false;
					data.push(value);
				});
			} else {
				var roleFunctions = this.selectHaveRoleFunction();
				$.each(allFunction.rows, function(index, value) {
					if (value.PARENT_KEY == undefined || value.PARENT_KEY == '') {
						value.open = true;
					} else {
						value.open = false;
					}
					value.checked = false;
					if (that.isLook) {
						value.chkDisabled = true;
					}
					$.each(roleFunctions.rows, function(indexKey, valueKey) {
						if (valueKey.KEY == value.KEY) {
							value.checked = true;
						}
					});
					data.push(value);
				});
			}
			
		}
		return data;
	},
	queryRole: function(id) {
		var param = {
			columns: [
					   {cname: 'ID'},
					   {cname: 'NAME'},
					   {cname: 'DESC'},
					   {cname: 'DISOPERATOR_KEYS'}
					],
			condition: {cname: 'ID', value: '', compare: '='}
		};
		param.condition.value = id;
		var role = this.selectData(this.roleUrl + '?param=' + JSON.stringify(param));
		if (role.status == 1 && role.rows.length > 0) {
			this.setName(role.rows[0].NAME);
			this.setDisoperatorKeys(role.rows[0].DISOPERATOR_KEYS);
			this.setId(role.rows[0].ID);
			this.setDesc(role.rows[0].DESC);
		}
		else {
			bootbox.alert('请求数据失败。');
		}
	},
	selectData: function(url) {
		return this.getDataMethod('GET', url, null);
	},
	getDataMethod: function(mothod, url, data) {
		var result;
		$.ajax({
			type: mothod,
			url: url,
			data: data,
			datatype: 'json',
			contentType :'application/json; charset=UTF-8',
			async: false,
			success: function (data) {
				if ((typeof data == 'string')
						&& (data.constructor == String)) {
					result = JSON.parse(data);
				} else {
					result = data;
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				result = {status: 0};
			}
		});
		return result;
	},
	getTable: function() {
		var tabaleData = '';
		var tableLayout = $('#layout1449825839007').children().children();
		tabaleData += '<div type="table_base" style="overflow-x: auto; overflow-y: auto;">';
		tabaleData += '<table id="' + this.userTableId + '">';
		tabaleData += '</table>';
		tabaleData += '</div>';
		
		tableLayout.empty(tabaleData);
		tableLayout.append(tabaleData);
		var param = {"columns":[{"cname":"USERNAME"},{"cname":"NICK_NAME"},{"cname":"MOBILE"},{"cname":"USERID"},{"cname":"EMAIL"}],"orders":[],"condition":{}};
		var condition = {cname: 'ROLE_ID', value: '', compare: '='};
		condition.value = this.getId();
		param.condition = condition;
		
		var tableInitData = {"method":"get","contentType":null,"url": "","cache":false,"pagination":true,"pageSize":"100","pageList":[10,20,50,100,200],"height":"500","search":false,"showColumns":false,"showRefresh":false,"sidePagination":"server","sortable":true,"clickToSelect":false,"advancedSearch":false,"searchcondition":[],"idTable":"table_base1449912971006","defaultcondition":[],"pk":["USERID"],"editable":true,"columns":[{"title":"用户名","field":"USERNAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1449912971006","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"昵称","field":"NICK_NAME","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1449912971006","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"手机号码","field":"MOBILE","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1449912971006","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"用户ID","field":"USERID","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":true,"visible":false,"formatter":"","tableId":"table_base1449912971006","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}},{"title":"邮箱","field":"EMAIL","editable":false,"validate":"","align":"left","halign":"left","valign":"middle","primarykey":false,"visible":true,"formatter":"","tableId":"table_base1449912971006","defaultcondition":{"checked":false,"condition":"","value":""},"searchcondition":{"checked":false,"condition":"","value":""}}]};
		tableInitData.url = this.userUrl + '?param=' + JSON.stringify(param);
		
		bootstrapTable(this.userTableId, adjustTableParam(this.userTableId,'bcp', 'sm_user_table', tableInitData)); 
	    controlTableToolbar(this.userTableId);
	    $('#' + this.userTableId).bootstrapTable().on('check.bs.table', function(event, row) {
	        controlTableToolbar(this.userTableId) 
	    }).on('uncheck.bs.table', function(event, row) {
	        controlTableToolbar(this.userTableId) 
	    }).on('check-all.bs.table', function(event) {
	        controlTableToolbar(this.userTableId) 
	    }).on('uncheck-all.bs.table', function(event) {
	        controlTableToolbar(this.userTableId) 
	    });
	},
	avalonRole: vm1449825112639,
	handleTreeNotCheckedValues: function() {
		var checkedNotNodes = this.getTree().getCheckedNodes(false);
		if (checkedNotNodes.length > 0) {
			var keys = '';
			for (var i = 0; i < checkedNotNodes.length; i++) {
				if (i != 0) {
					keys += ",";
				}
				keys += checkedNotNodes[i].KEY;
			}
			this.setDisoperatorKeys(keys);
		}
	},
	isAdd: false,
	isLook: false,
	saveRole: function() {
		if (this.getTree().getCheckedNodes(true).length > 0) {
			if (this.getName() != undefined && this.getName() != '') {
				this.handleTreeNotCheckedValues();
			var data = {};
			var columns = {};
			var method = 'POST';
			if (!this.isAdd) {
				method = 'PUT';
				var condition = {cname: 'ID', value: '', compare: '='};
				condition.value = this.getId();
				data.condition = condition;
			}
			columns.NAME = this.getName();
			columns.DESC = this.getDesc();
			columns.DISOPERATOR_KEYS = this.getDisoperatorKeys();
			data.columns = columns;
			
			var result = this.getDataMethod(method, this.roleUrl, JSON.stringify(data));
			if (result.status == 1) {
				bootbox.alert('保存成功。');
				publicRoleControl.showMainOROperate(true);
				roleModule.queryRole();
			} else {
				bootbox.alert('保存失败。');
			}
			} else {
				bootbox.alert('角色名不能为空。');
			}
			
		}
		else {
			bootbox.alert('请选择角色使用的功能。');
		}
	},
	treeSetting: function() {
		var setting = {  
		        data: {
		        	simpleData: {enable: true, idKey: "KEY", pIdKey: "PARENT_KEY"},
		    		key: {title: "NAME",name: "NAME"}
		    	},
		        check: {enable: true}
		    };
		return setting;
	},
	treeId: 'tree1449836824188',
	initTree: function() {
		//var treeLayout = $('#layout1449825544691').children().children();
		var treeLayout = $('#' + this.viewTreeLanyId);
		var tree = '';
		tree += '<div type="tree">';
		tree += '<ul class="ztree" id="' + this.treeId + '">';
		tree += '</ul>';
		tree += '</div>';
		treeLayout.empty();
		treeLayout.append(tree);
		$.fn.zTree.init($('#' + this.treeId), this.treeSetting(), this.getTreeData());
	}
};

var publicRoleControl = new PublicRoleControl();
var roleOperateModule = new RoleOperateModule();
var roleModule = new RoleModule();

$(document).ready(function() {
	publicRoleControl.showMainOROperate(true);
	$('#' + roleOperateModule.viewRegionInputId).click(function(){
		if ($('#' + roleOperateModule.viewRegionInputId).is(':visible')) {
			$('#' + roleOperateModule.viewTreeLanyId).show();
		}
	});
	$('#' + roleOperateModule.viewRegionInputId).attr("readonly",true);
});
$(document).on('click',function(e){ 
    var target  = $(e.target); 
    if(target.closest('#' + roleOperateModule.viewTreeLanyId).length == 0
    		&& target.closest('#' + roleOperateModule.viewRegionInputId).length == 0) {
    	if ($('#' + roleOperateModule.viewRegionInputId).is(':visible')) {
    		$('#' + roleOperateModule.viewTreeLanyId).fadeOut();
    	}
    }
}); 