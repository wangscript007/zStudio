var AppChildMenuOperator = function() {
	this.tableName = 'tenant_menu';
	this.operator = getUrlParam("operator", pageParams);
	this.defaultType = '1';
	this.rootMenuName = '';
	this.rootMenuKey = '';
	this.childMenuKey = '';
};
AppChildMenuOperator.prototype = {
	
	init: function() {
		this.initPanel();
		this.initBtn();
		this.initValidator();
	},
	initPanel: function() {
		var key = getUrlParam("key", pageParams);
		this.rootMenuName = getUrlParam("name", pageParams);
		var menuInfo = this.getMenuByKey(key);
		$("#parent_key").val(this.rootMenuName);
		if (this.operator == "add") {
			this.rootMenuKey = key;
		} else if (this.operator == "edit") {
			this.childMenuKey = key;
			this.rootMenuKey = menuInfo.PARENT_KEY;
			this.showMenuInfo(menuInfo);
		} else if (this.operator == "recordQuery") {
			this.showMenuInfo(menuInfo);
			$("#child_menu_name").attr("disabled", true);
			$("#child_menu_code").attr("disabled", true);
			$("#select_status").attr("disabled", true);
			$("#url_addr").attr("disabled", true);
			$("#submitBtn").hide();
		}
	},
	initBtn: function() {
		$("#submitBtn").on('click', function() {
			appChildMenuOperator.saveMenu()
	    });
		$("#cancelBtn").on('click', function() {
			hideModalDialog('dialogChildMenu');
		});
	},
	showMenuInfo: function(menu) {
		$("#child_menu_name").val(menu.NAME);
		$("#child_menu_code").val(menu.KEY);
		$("#parent_key").val(this.rootMenuName);
		$("#select_status").val(menu.STATUS);
		$("#url_addr").val(menu.URL);
		$("#order_code").val(menu.ORDER);
	},
	initValidator: function() {
		$('#vm1469583980628').bootstrapValidator({
	        fields:{
	        	child_menu_name:{
	                validators: {
	                	notEmpty: {
	                        message: '请输入菜单名称'
	                    },
	                    stringLength: {/*长度提示*/
                            min: 1,
                            max: 20,
                            message: '菜单名称必须在1到20个字符之间'
                        },
                        callback: {
	                        message: '菜单名称不能重复',
	                        callback: function(value){
	                            return appChildMenuOperator.checkExistMenuName(value);
	                        }
	                    }
	                }
	            },
	            url_addr: {
	            	validators: {
	            		notEmpty: {
	                        message: '请输入菜单链接地址'
	                    },
	                    stringLength: {/*长度提示*/
                            min: 1,
                            max: 200,
                            message: '链接地址必须在1到200个字符之间'
                        },
                        regexp: {
                            regexp: /^[-a-zA-Z0-9_\/.;=?]+$/,
                            message: '链接地址只能是字母、数字、正斜杠、点号、问号、等于号、下划线和中划线'
                        },
	            	}
	            },
	        }
	    });
	},
	saveMenu : function() {
		var val_com = $("#vm1469583980628").data('bootstrapValidator');
        val_com.validate();
        if (!val_com.isValid()) {
        	return;
        }
		
		var columns = [ "NAME", "PARENT_KEY", "URL", "STATUS", 
				"RANGE", "TYPE", "ICON", "KEY", "ORDER" ];
		var columnsValues = [];
		columnsValues.push($("#child_menu_name").val());  //NAME
		columnsValues.push(this.rootMenuKey);             //PARENT_KEY
		columnsValues.push($("#url_addr").val());         //URL
		columnsValues.push($("#select_status").val());    //STATUS
		columnsValues.push(this.defaultType);             //RANGE
		columnsValues.push(this.defaultType);             //TYPE
		columnsValues.push("fa fa-comments");             //ICON
		
		var result;
		if (this.operator == "add") {
			columnsValues.push(getRandomKey());                    
			columnsValues.push(this.getChildMenuFirstOrder(this.rootMenuKey) + 1);                    
			result = maoOrmBase.insert(this.tableName, JSON.stringify(columns),
					JSON.stringify(columnsValues), function(data) {});
			this.showOperatorResult(result, '新增');
		} else if (this.operator == "edit") {
			columnsValues.push(this.childMenuKey);
			columnsValues.push($("#order_code").val());
			var condition = {
				cname : 'KEY',
				compare : '=',
				value : this.childMenuKey
			};
			result = maoOrmBase.update(this.tableName, JSON.stringify(columns),
					JSON.stringify(columnsValues), generateCondition([ condition ], 'and'), function(data) {});
			this.showOperatorResult(result, '修改');
		}
	},
	
	getMenuByKey : function(key) {
		var conditions = [ {
			cname : 'KEY',
			compare : '=',
			value : key
		} ];
		var result = maoOrmBase.query(this.tableName, '["KEY", "NAME", "PARENT_KEY", "URL", "STATUS", "TYPE", "ORDER"]',
				generateCondition(conditions, 'and'), null, null);
		if (result.status == 1 && result.rows.length > 0) {
			return result.rows[0];
		} else {
			console.log('查询错误，信息：' + result.message);
			tipBox.showMessage('查询菜单错误', 'error');
		}
	},
	
	/**
	 * 查询顶层菜单排序号最小的值
	 */
	getChildMenuFirstOrder : function(parentKey) {
		var conditions = [ {
			cname : 'PARENT_KEY',
			compare : '=',
			value : parentKey
		} ];
		var orders = [ {
			"field" : "ORDER",
			"order" : "desc"
		} ];
		var result = maoOrmBase.query(this.tableName, '["ORDER"]',
				generateCondition(conditions, 'and'), null, orders);
		if (result.status == 1) {
			if (result.rows.length == 0) {
				return 1;
			} else {
				return result.rows[0].ORDER;
			}
		}
	},
	
	checkExistMenuName: function(name) {
		if(this.operator == 'add') {
			var urlParam = {
					columns : [ {
						cname : 'NAME'
					} ],
					isDistinct : true,
					condition : {
						'cname':'NAME',
						'compare':'=',
						'value':name
					}
			};
			var url = bcp + 'table/tenant_menu?param=' + encodeURIComponent(JSON.stringify(urlParam));
			var result = $.designerAjax('get',url, undefined, undefined, undefined);
			if (result.status == 1 && result.rows.length > 0) {
				return false;
			} 
		}
		return true;
	},
	
	showOperatorResult: function(result, operator) {
		if (result.status == 1) {
			hideModalDialog('dialogChildMenu');
			tipBox.showMessage(operator + '子菜单成功。', 'info');
			setTimeout(function(){
				refreshMenu();
			}, 1000);
		} else {
			console.log(operator + '子菜单失败。' + result.message);
			tipBox.showMessage(operator + '子菜单失败', 'error');
		}
	}
};
var appChildMenuOperator = new AppChildMenuOperator();
$(document).ready(function() {
	appChildMenuOperator.init();
});
