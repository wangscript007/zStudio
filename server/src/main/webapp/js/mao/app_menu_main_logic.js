;(function($,win){
    var AppListTable = function(){
        this.queryDataTableUrl = bcp + "table/tenant_menu";
        this.limit = 10000;
        this.totalId =  "menu_total";
        this.tableId = "menu_table";
        this.totalRecord = 0;
        this.key = '';
        this.dialogId = "dialogChildMenu";
        this.url = "app-child-menu-add.html";
        this.currentMenuKey = '';
        this.rootMenuName = '';
    };

    AppListTable.prototype = {
        init: function() {
            this.updateTableUI(this.getUIModel());
            this.initEvent();
        },
        updateTableUI: function (model) {
            $('#' + this.totalId).html(model.total);
            $('#' + this.tableId + ' tbody').html(this.getTableBody(model));
            this.resizeDiv();
        },

        initEvent: function(){
            var that = this;
            //点击一行事件处理
            $('tr').on('click', function(event){
               that.trClick(event.currentTarget);
            })
        },

        trClick: function (e) {
            var clz = $(e).attr('class');
            $('tr').attr('class', '');
            if(clz === 'info'){
            	this.currentMenuKey = '';
            } else {
                $(e).attr('class', 'info');
                this.currentMenuKey = $(e).attr('id');
            }
        },

        getUIModel: function (name) {
            var modelObj = {};
            modelObj.title = '菜单列表';
            modelObj.total = 0;
            modelObj.headDatas = [
                {field:'NAME', title:'菜单名称', width: "30%"},
	            {field:'PARENT_KEY', title:'父节点名称', width: "30%"},
	            {field:'TYPE', title:'类型', width: "20%"},
	            {field:'STATUS', title:'显示', width: "5%"},
	            {field:'operate', title:'操作', width: "15%"}
            ];

            var result;
            if (name == "" || name == undefined) {
            	result = this.getMenuDataInfo(this.key);
            } else {
            	result = this.getMenuDataInfo(this.key, name);
            }
            modelObj.total = result.total;
            this.totalRecord = result.total;
            return this.handleBodyData( modelObj, result, this.bodyDataBuilder_dataModel);
        },

        handleBodyData: function(model, result, bodyDataBuilder) {
            var datas = [];
            if (result.status == MaoOrmBase.STATUS_SUCCESS) {
                datas = result.rows;
            }
            var bodyDatas = [];
            for (var i = 0, len = datas.length; i < len; i++) {
                bodyDatas.push(bodyDataBuilder.call(this, datas[i], model));
            }
            model.bodyDatas = bodyDatas;
            return model;
        },

        /**
         * 根据KEY、NAME查询菜单信息
         */
        getMenuDataInfo: function (key, name) {
        	var condition = {
                "and" :[
                    {
                        "cname":"PARENT_KEY",
                        "value" : key,
                        "compare":"="
                    }
                ]
              };
        	if (name != undefined) {
        		condition.and.push({
        			"cname":"NAME",
                	"value" : encodeURIComponent('%' + name + '%'),
                	"compare":"like"
        		});
        	}
        	
            var param = {
                columns: [
                    {cname: 'KEY'},
                    {cname: 'NAME'},
                    {cname: 'PARENT_KEY'},
                    {cname: 'URL'},
                    {cname: 'TYPE'},
                    {cname: 'STATUS'},
                    {cname: 'ORDER'}
                ],
                isDistinct: true,
                condition: condition,
                orders: [
                    {
                        field: 'ORDER',
                        order: 'desc'
                    }
                ]
            };
            var urlAndParam = this.queryDataTableUrl;
            urlAndParam += '?param=' + JSON.stringify(param) + '&offset=0&limit=' + this.limit;
            return $.designerAjax('GET', urlAndParam);
        },
        
        bodyDataBuilder_dataModel : function(data, model) {
            var bodyData = {};
            bodyData.APPKEY = data.KEY;
            bodyData.NAME = this.handleName(data.NAME);
            bodyData.PARENT_KEY = this.handleName(this.rootMenuName);
            bodyData.TYPE = data.TYPE == 0 ? '系统预定义' : '用户自定义';
            bodyData.STATUS = data.STATUS == 1 ? '是' : '否';
            
            var operate = '';
            operate += this.getOperate('recordQuery', data);
            operate += this.getOperate('modify', data);
            operate += this.getOperate('delete', data);
            bodyData.operate = operate;
            return bodyData;
        },
        
        handleName(name, key) {
        	if (name) {
                var htmlStr = '<span class="app-valueToLong" title="' + name + '">';
                htmlStr += name;
                htmlStr += '</span>';
                return htmlStr;
            }
            return '';	
        },

        resizeDiv: function(){
            var bodyHeight = $(window).height() - 15;
            var $div = $('#' + this.tableId + ' tbody').parentsUntil('.row');
            if($div.hasClass("mCustomScrollbar")){
                $div.mCustomScrollbar("destroy");
            }
            //考虑换行：
            var  total = this.totalRecord;
            /*if(($(window).width()-70)*0.72 < 815){
                total = total * 2;
            }*/
            if(Math.floor((bodyHeight-110)/45) < total ){
                //加滚动条
                $div.mCustomScrollbar({ setHeight: (bodyHeight-90), theme: "dark" });
            }
            $('#' + this.tableId).css("height", "initial")
        },

        /**
         * 生成子菜单列表信息
         */
        getTableBody: function (model) {
            var bodyDatas = model.bodyDatas;
            if (bodyDatas.length == 0) {
                return "";
            }
            var htmlStr = '';
            var headDatas = model.headDatas;
            for (var i = 0, len = bodyDatas.length; i < len; i++) {
                var bodyData = bodyDatas[i];
                htmlStr += '<tr id="' + bodyData.APPKEY +'">';
                for (var j = 0, len2 = headDatas.length; j < len2; j++) {
                    var headData = headDatas[j];
                    for (var field in bodyData) {
                        if (field == headData.field) {
                            htmlStr += '<td style="border: 0;padding:0; line-height: 45px;text-align:left;';
                            var tdStyle = 'font-size:14px;';
                            if (j == 0) {
                                htmlStr += tdStyle;
                            }
                            htmlStr += '">';
                            htmlStr += bodyData[field];
                            htmlStr += '</td>';
                        }
                    }
                }
                htmlStr += '</tr>';
            }
            return htmlStr;
        },
		
        /**
         *
         */
        getOperate : function(operate, data) {
            var colorStr = '499FD6';
            var btn = 'blue';
            if (operate == 'delete') {
                colorStr = 'F47676';
                btn = 'red';
            }

            var title = '';
            if (operate == 'modify') {
                title = '编辑';
            } else if (operate == 'delete') {
                title = '删除';
            } else if (operate == 'recordQuery') {
            	title = '查看';
            }
            var htmlStr = '';
            htmlStr += '<span btn="' + btn + '" class="ict-' + operate + '" style="cursor:pointer;color: #' + colorStr + ';padding-right: 10px;padding-left: 10px;"';
            htmlStr += ' onclick="appListTable.operate(\'' + operate + '\',\'' + data.KEY + '\', \'' + data.TYPE + '\');"';
            htmlStr += ' title="' + title + '"';
            htmlStr += '>';
            htmlStr += '</span>';
            return htmlStr;
        },
        
        /**
         * 子菜单修改、查看、删除
         */
        operate: function(operate, key, type) {
            if (operate == 'modify') {
            	if (type == 0) {
            		tipBox.showMessage('不能修改系统预定义的菜单', 'error');
            		return;
            	}
            	showModalDialog(this.dialogId, "修改菜单", this.url + "?operator=edit&key=" + key + "&name=" + this.rootMenuName);
                return;
            }

            if (operate == 'delete') {
            	if (type == 0) {
            		tipBox.showMessage('不能删除系统预定义的菜单', 'error');
            		return;
            	}
                this.deleteChildMenu(key);
                return;
            }

            if(operate == 'recordQuery'){
                showModalDialog(this.dialogId, "查看菜单", this.url + "?operator=recordQuery&key=" + key + "&name=" + this.rootMenuName);
            }
            return false;
        },
        
        /**
         * 删除子菜单
         * @param key
         * @returns
         */
        deleteChildMenu: function(key) {
        	var that = this;
            bootbox.confirm(('确定要删除吗?'),function(result){
                if(result){
                    var condition = new QueryCondition();
                    condition.setCName('KEY');
                    condition.setValue(key);
                    condition.setCompare('=');
                    var result;
                    maoOrmBase.delete('tenant_menu', condition, function(data){
                    	result = data;
                    });

                    if (result.status == 1) {
                    	tipBox.showMessage("删除菜单成功。", 'info');
                    	//刷新子菜单页面
                    	that.init();
                    } else {
                    	tipBox.showMessage("删除菜单失败。原因：" + result.message, 'error');
                    }
                }
            });
        }, 
        
        /**
         * 根据菜单名称条件查询
         */
        queryMenuByCond: function(name) {
        	this.updateTableUI(this.getUIModel(name));
        },
        
        /**
         * 上移操作
         */
        currentMenuAsc: function() {
        	//菜单列表的第一条ORDER数据
        	var menuList = this.getMenus();
        	if (menuList == undefined) {
        		return;
        	} else {
        		var topMenuOrder = menuList[0].ORDER;
        	}
        	var currentMenu = this.getMenuInfo(this.currentMenuKey);
        	if (currentMenu == undefined) {
        		return;
        	} else {
        		var currentMenuOrder = currentMenu.ORDER;
        	}
        	//最顶部的菜单不能上移，直接返回
        	if (currentMenuOrder == topMenuOrder || menuList.length == 1) {
        		return;
        	}
        	
        	var currentMenuIndex = _.findIndex(menuList, function(menu) {
        		return menu.ORDER == currentMenuOrder;
        	});
        	
        	var preMenu = menuList[currentMenuIndex - 1];
        	this.updateBatchMenu(currentMenu, preMenu);
        },
        
        /**
         * 下移操作
         */
        currentMenuDesc: function() {
        	var menuList = this.getMenus();
        	if (menuList == undefined) {
        		return;
        	} else {
        		var bottomMenuOrder = menuList[menuList.length - 1].ORDER;
        	}
        	var currentMenu = this.getMenuInfo(this.currentMenuKey);
        	if (currentMenu == undefined) {
        		return;
        	} else {
        		var currentMenuOrder = currentMenu.ORDER;
        	}
        	//最底部的菜单不能下移，直接返回
        	if (currentMenuOrder == bottomMenuOrder || menuList.length == 1) {
        		return;
        	}
        	
        	var currentMenuIndex = _.findIndex(menuList, function(menu) {
        		return menu.ORDER == currentMenuOrder;
        	});
        	
        	var nextMenu = menuList[currentMenuIndex + 1];
        	this.updateBatchMenu(currentMenu, nextMenu);
        },
        
        /**
         * 排序操作校验并返回当前顶层菜单的子菜单信息
         */
        getMenus: function() {
        	if (this.currentMenuKey == '' || this.currentMenuKey == undefined) {
        		tipBox.showMessage('请选择要移动的菜单。', 'error');
        		return;
        	}
        	var menuList = this.getMenuDataInfo(this.key);
        	var menusLen = menuList.rows.length;
        	if (menuList.status == 1 && menusLen > 0) {
        		return menuList.rows;
        	} else {
        		tipBox.showMessage('查询菜单信息失败。', 'error');
        		return;
        	}
        },
        
        /**
         * 升序、降序操作
         */
        updateBatchMenu: function(currentMenu, otherMenu) {
        	var temp = currentMenu.ORDER;
        	currentMenu.ORDER = otherMenu.ORDER;
        	otherMenu.ORDER = temp;
    		var modules = [];
    		currentMenuModule = {"columns":{order : currentMenu.ORDER},
                                  "condition":{"and":[{
                                                "cname":"KEY",
                                                "compare":"=",
                                                "value":currentMenu.KEY
    											}]
    										}
                                };
    		otherMenuModule = {"columns":{order : otherMenu.ORDER},
                                  "condition":{"and":[{
                                                "cname":"KEY",
                                                "compare":"=",
                                                "value":otherMenu.KEY
    											}]
    										}
                                };
    		modules.push(currentMenuModule);
    		modules.push(otherMenuModule);
    		maoOrmBase.updateBatch("tenant_menu",{
                            "records":modules
                        },function(){});
    		this.init();
    		//将当前的子菜单选中
    		$($("#" + currentMenu.KEY)).attr('class', 'info');
        },
        
        /**
         * 查询当前选择的子菜单信息
         */
        getMenuInfo: function(key) {
            var param = {
                columns: [
                    {cname: 'KEY'},
                    {cname: 'ORDER'}
                ],
                condition: {
                	"and" :[
                        {
                            "cname":"KEY",
                            "value" : key,
                            "compare":"="
                        },
                        {
                        	"cname":"PARENT_KEY",
                        	"value" : this.key,
                        	"compare":"="
                        }
                    ]
                },
                orders: [
                ]
            };
            var urlAndParam = this.queryDataTableUrl;
            urlAndParam += '?param=' + JSON.stringify(param) + '&offset=0&limit=' + this.limit;
            var currentMenu = $.designerAjax('GET', urlAndParam);
        	if (currentMenu.status == 1 && currentMenu.rows.length > 0) {
        		return currentMenu.rows[0];
        	} else {
        		tipBox.showMessage('查询菜单信息失败。', 'error');
        		return;
        	}
        }
        
    };

    win.appListTable = new AppListTable();

    $(win).resize(function () {
        appListTable.resizeDiv();
    });
}(jQuery, window));

$(document).ready(function(){
    appListTable.init();
})