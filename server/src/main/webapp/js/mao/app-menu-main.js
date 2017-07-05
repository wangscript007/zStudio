; (function ($, win) {

	/**
	 * 应用菜单管理
	 */
	var AppManage = function () {
		this.rootMenuUrl = "app-root-menu-add.html";
		this.childMenuUrl = "app-child-menu-add.html";
		this.rootMenudialogId = "dialogMenu";
		this.childMenudialogId = "dialogChildMenu";
		this.appTable = "tenant_menu";
		this.key = "";
		this.name = "";

		this.init();
	};

	AppManage.prototype = {
		init: function () {
			this.initAppMenuList();

			var appId = getUrlParam("appid",location.search);
			if(!appId){
				appId = getUrlParam("appid",parent.location.search); 
			}

			if(appId) {
				this.selectApp($(".app-menu-body .list-group-item[appid=" + appId + "]"));
			} else {
				this.selectApp($(".app-menu-body a:first"));	
			}			
		},

		initAppMenuList: function () {
			var result = maoOrmBase.query(this.appTable,
					JSON.stringify(["KEY", "NAME", "TYPE", "STATUS"]),
					generateCondition([{"cname": "PARENT_KEY", "value": 'BCP_BPM', "compare": "="}], 'and'),
					true,
					[{"field": "ORDER", "order": "asc"}]),
					total = 0, rows = [];

			if (!result) {
				console.error("加载菜单列表异常");
				tipBox.showMessage('加载菜单列表异常', 'error');
				return;
			}

			if (result.status === 0) {
				console.error("加载菜单列表失败:" + result.message);
				tipBox.showMessage('加载菜单列表失败', 'error');
				return;
			}

			if (result.status === 1 && result.rows) {
				rows = result.rows;
				total = result.rows.length || 0;
				var html = [], that = this;
				$.each(rows, function (index, item) {
					html.push(that.generateAppMenuItem(item));
				});

				$(".app-menu-body").empty().append(html.join(""));

				this.refreshTotalAppInfo(total);
			}
		},

		refreshTotalAppInfo: function (totalApps, operation) {
			var total = totalApps, $totalApps = $("#totalApps");
			if (operation) {
				total = parseInt($totalApps.html()) || 0;
				if (operation === "add") {
					total += 1;
				} else if (operation === "delete") {
					total -= 1;
				}
			}

			$totalApps.html(total);
		},

		selectApp: function (menuItem) {
			$(".app-menu-body .selected").removeClass("selected");
			$(".app-menu-body .operator").hide();
			$(menuItem).addClass("selected");
			$(menuItem).find(".operator").show();

			var key = $(menuItem).attr('appid');
			var name = $(menuItem).attr('title');
			this.key = key;
			this.name = name;
			appListTable.key = key;
			appListTable.rootMenuName = name;
			appListTable.init();
		},

		generateAppMenuItem: function (menuItem) {
			var html = [];
			if (menuItem) {
				var status = menuItem["STATUS"];
				if (status == 0) {
					var htmlStr = '<a href="#" class="list-group-item" style="background-color: #E5E5E5;" appid="' + menuItem["KEY"];
				} else {
					var htmlStr = '<a href="#" class="list-group-item" appid="' + menuItem["KEY"];
				}
				htmlStr += '" title="' + menuItem["NAME"] + '">'
						+ '<span class="title">' + menuItem["NAME"] + '</span>';
				
				var type = menuItem["TYPE"];
				if (type == 1) {
					htmlStr += '<span class="ict-delete pull-right operator" title="删除"></span>'
						+ '<span class="ict-modify pull-right operator" title="编辑"></span>';
				}
				htmlStr += '</a>';
				html.push(htmlStr);
			}
			return html.join("");
		},

		add: function () {
			showModalDialog(this.rootMenudialogId, "新增菜单", this.rootMenuUrl + "?operator=add");
		},
		
		addChildMenu: function (key, name) {
			showModalDialog(this.childMenudialogId, "新增子菜单", this.childMenuUrl + "?operator=add&key=" + key + "&name=" + name);
		},

		update: function (appId) {
			showModalDialog(this.rootMenudialogId, "编辑菜单", this.rootMenuUrl + "?operator=edit&key=" + appId);
		},

		delete: function (key) {
			var that = this;
			bootbox.confirm(('确定要删除吗?'), function (result) {
				if (result) {
					//自创建的菜单
					var callback = function (data) {
						if (data && data.status === 1) {
							tipBox.showMessage('删除菜单成功。', 'info');
							setTimeout(function(){
								refreshMenu();
							}, 1000);
						} else {
							console.error("删除菜单失败:" + data.message);
							tipBox.showMessage('删除菜单失败:' + data.message, 'error');
						}
					};
					
					maoOrmBase.delete(that.appTable, {"cname": "PARENT_KEY", "value": key, "compare": "="}, function(data) {});
					maoOrmBase.delete(that.appTable, {"cname": "KEY", "value": key, "compare": "="}, callback);
				}
			});
		}
		
	};

	/**
	 * 重设菜单高度
	 */
	function resetMenuHeight() {
		var bodyHeight = $(window).height() - 15;
		$("#appMenu").height(bodyHeight);
		$(".app-row-ext").height(bodyHeight - 20);

		var $appMenuBody = $(".app-menu-container");
		if ($appMenuBody.hasClass("mCustomScrollbar")) {
			$appMenuBody.mCustomScrollbar("destroy");
		}
		$appMenuBody.mCustomScrollbar({setHeight: bodyHeight - 80, theme: "dark"});
	}

	$(win).resize(function () {
		resetMenuHeight();
	});


	var appManage = new AppManage();

	$(document).ready(function () {
		//主菜单新增
		$("#addNewRootMenu").on("click", function() {
			appManage.add();
		});
		//子菜单新增
		$("#addNewChildMenu").on("click", function() {
			appManage.addChildMenu(appManage.key, appManage.name);
		});
		//查询
		$("#childMenuQuery").on("click", function() {
			var menuName = $("#queryCond").val();
			appListTable.queryMenuByCond(menuName);
		});
		//升序
		$("#sortAsc").on("click", function() {
			appListTable.currentMenuAsc();
		});
		//降序
		$("#sortDesc").on("click", function() {
			appListTable.currentMenuDesc();
		});

		$(".app-menu-body").on("click", ".ict-delete", function() {
			var key = $(this).parent().attr("appid");
			appManage.delete(key);
		}).on("click", ".ict-modify", function() {
			appManage.update($(this).parent().attr("appid"));
		}).on("click", ".list-group-item", function() {
			appManage.selectApp(this);
		});

		//初始完成后，重设界面高度
		resetMenuHeight();

	});
} (jQuery, window));

function getRandomKey() {
	//x上限，y下限
    var x = 10000000000;
    var y = 1;
    return String.fromCharCode(Math.floor( Math.random() * 26) 
    		+ "a".charCodeAt(0)) 
    		+ parseInt(Math.random() * (x - y + 1) + y) 
    		+ String.fromCharCode(Math.floor( Math.random() * 26) 
    		+ "a".charCodeAt(0));
}

function refreshMenu() {
	var menuDataManage = parent.menuDataManage;
    menuDataManage.initData();
    menuDataManage.initRootMenu();
    parent.$("#BCP_BPM_SYS").click();
}
