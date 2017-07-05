var ApplicationRootMenuOperator = function() {
	this.table_name = 'tenant_menu';
	this.operator = getUrlParam("operator", pageParams);
	this.defaultType = '1';
	this.key = '';
};
ApplicationRootMenuOperator.prototype = {
	
	init: function() {
		this.initPanel();
		this.initBtn();
		this.initValidator();
	},
	initPanel : function() {
		$("#url_addr").val("#");
		if (this.operator == "edit") {
			this.key = getUrlParam("key", pageParams);
			var menuInfo = this.getMenuInfo(this.key);
			$("#order_code").val(menuInfo.ORDER);
		}
	},
	initBtn: function() {
		$("#submitBtn").on('click', function() {
	        applicationRootMenuOperator.saveRootMenu()
	    });
		$("#cancelBtn").on('click', function() {
			hideModalDialog('dialogMenu');
		});
	},
	initValidator: function() {
		$('#vm1490766924874').bootstrapValidator({
	        fields:{
	            menu_name:{
	                validators: {
	                	notEmpty: {
	                        message: '请输入菜单名称'
	                    },
	                    stringLength: {
                            min: 1,
                            max: 20,
                            message: '菜单名称必须在1到20个字符之间'
                        },
                        callback: {
                        	message: '菜单名称不能重复',
	                        callback: function(value){
	                            return applicationRootMenuOperator.checkExistMenuName(value);
	                        }
                        }
	                }
	            }
	        }
	    });
	},
	saveRootMenu : function() {
		var val_com = $("#vm1490766924874").data('bootstrapValidator');
        val_com.validate();
        if (!val_com.isValid()) {
        	return;
        }
		
		var columns = [ "NAME", "PARENT_KEY", "URL", "STATUS", 
				"RANGE", "TYPE", "ICON", "KEY", "ORDER" ];
		var columnsValues = [];
		columnsValues.push($("#menu_name").val());        //NAME
		columnsValues.push("BCP_BPM");                    //PARENT_KEY
		columnsValues.push("#");                          //URL
		columnsValues.push($("#select_status").val());    //STATUS
		columnsValues.push(this.defaultType);             //RANGE
		columnsValues.push(this.defaultType);             //TYPE
		columnsValues.push("fa fa-comments");             //ICON
		var result;
		if (this.operator == "add") {
			columnsValues.push(getRandomKey()); 
			columnsValues.push(this.getLastMenuOrder() - 1);
			result = maoOrmBase.insert(this.table_name, JSON.stringify(columns),
					JSON.stringify(columnsValues), function(data) {});
			this.showOperatorResult(result, '新增');
		} else if (this.operator == "edit") {
			columnsValues.push(this.key);
			columnsValues.push($("#order_code").val());
			var condition = {
				cname : 'KEY',
				compare : '=',
				value : this.key
			};
			result = maoOrmBase.update(this.table_name, JSON.stringify(columns),
					JSON.stringify(columnsValues), generateCondition([ condition ], 'and'), function(data) {});
			this.showOperatorResult(result, '修改');
		}
	},
	
	/**
	 * 根据KEY查询当前菜单信息
	 */
	getMenuInfo : function(key) {
		var conditions = [ {
			cname : 'KEY',
			compare : '=',
			value : key
		} ];
		var columns = ["KEY", "NAME", "PARENT_KEY", "URL", "STATUS", "TYPE", "ORDER"]
		var result = maoOrmBase.query(this.table_name, '["KEY", "NAME", "PARENT_KEY", "URL", "STATUS", "TYPE", "ORDER"]',
				generateCondition(conditions, 'and'), null, null);
		if (result.status == 1 && result.rows.length > 0) {
			return result.rows[0];
		} else {
			console.log('查询错误，信息：' + result.message)
			tipBox.showMessage('查询错误菜单信息错误');
		}
	},
	
	/**
	 * 查询顶层菜单排序号最小的值
	 */
	getLastMenuOrder : function() {
		var conditions = [ {
			cname : 'PARENT_KEY',
			compare : '=',
			value : "BCP_BPM"
		} ];
		var orders = [ {
			"field" : "ORDER",
			"order" : "asc"
		} ];
		var result = maoOrmBase.query(this.table_name, '["ORDER"]',
				generateCondition(conditions, 'and'), null, orders);
		if (result.status == 1) {
			if (result.rows.length == 0) {
				return 32766;
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
			hideModalDialog('dialogMenu');
			tipBox.showMessage(operator + '菜单成功。', 'info');
			setTimeout(function(){
				refreshMenu();
			}, 1000);
		} else {
			console.log(operator + '菜单失败。' + result.message);
			tipBox.showMessage(operator + '菜单失败', 'error');
		}
	}
};
var applicationRootMenuOperator = new ApplicationRootMenuOperator();
$(document).ready(function() {
	applicationRootMenuOperator.init();
});
