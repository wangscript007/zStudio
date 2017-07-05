; (function ($, win) {

	/**
	 * 应用管理
	 */
	var AppManage = function () {
		this.url = "add_package_info.html";
		this.dialogId = "dialogApp";
		this.appTable = "bcp_re_processpackage";
		this.appReportTable = "view_app_report_form_count";

		this.init();
	};

	AppManage.prototype = {
		init: function () {
			this.initAppMenuList();

			var appId = getUrlParam("appid",location.search);
			if(!appId){
				appId = getUrlParam("appid",parent.location.search); 
			}

			if(appId){
				this.selectApp($(".app-menu-body .list-group-item[appid=" + appId + "]"));
			}else{
				this.selectApp($(".app-menu-body a:first"));	
			}			
		},

		initAppInfo: function (appId) {
			var disabled = true,
				appInfo = {
					"PACKAGENAME": "",
					"CREATOR": "",
					"CREATETIME": "",
					"MODIFYTIME": "",
					"DESC": ""
				};

			if (appId) {
				appInfo = this.getAppInfo(appId);
				disabled = false;
			}

			$("#testApp").prop("disabled", disabled);
			$("#appName").html(appInfo["PACKAGENAME"]);
			$("#appCreator").html(appInfo["CREATOR"]);
			$("#appCreateTime").html(appInfo["CREATETIME"]);
			$("#appModifyTime").html(appInfo["MODIFYTIME"]);
			$("#appDesc").html("描述: 无");
			if (appInfo["DESC"]) {
				$("#appDesc").attr("title", appInfo["DESC"]).html("描述: "+appInfo["DESC"]);
			}
		},

		initAppMenuList: function () {
			var result = maoOrmBase.query(this.appTable,
					JSON.stringify(["ID", "PACKAGENAME"]),
					generateCondition([], 'and'),
					true,
					[{"field": "CREATETIME", "order": "desc"}]),
				total = 0, rows = [];

			if (!result) {
				console.error("加载应用列表异常");
				tipBox.showMessage('加载应用列表异常', 'error');
				return;
			}

			if (result.status === 0) {
				console.error("加载应用列表失败:" + result.message);
				tipBox.showMessage('加载应用列表失败', 'error');
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

		refreshAppMenu: function (appId) {
			if (!appId) {
				return;
			}
			var $menuItem = $(".app-menu-body .list-group-item[appid=" + appId + "]"),
				appInfo = this.getAppInfo(appId);
			if ($menuItem.length > 0) {
				$menuItem.find("span:first").html(appInfo["PACKAGENAME"]);
				$menuItem.attr("title",appInfo["PACKAGENAME"]);
			} else {
				$(".app-menu-body").prepend($(this.generateAppMenuItem(appInfo)));
			}
		},

		selectApp: function (menuItem) {
			$(".app-menu-body .selected").removeClass("selected");
			$(".app-menu-body .operator").hide();
			$(menuItem).addClass("selected");
			$(menuItem).find(".operator").show();

			var appId = $(menuItem).attr('appid');
			this.initAppInfo(appId);

			mainIndexLogic.packageId = appId;
			mainIndexLogic.init();
			model_DataModel.init();
		},

		generateAppMenuItem: function (menuItem) {
			var html = [];
			if (menuItem) {
				html.push('<a href="#" class="list-group-item" appid="' + menuItem["ID"]
					+ '" title="' + menuItem["PACKAGENAME"] + '">' +
					'<span class="title">' + menuItem["PACKAGENAME"] + '</span>' +
					'<span class="ict-delete pull-right operator" title="删除"></span>' +
					'<span class="ict-modify pull-right operator" title="编辑"></span>' +
					//'<span class="ict-export pull-right operator" param="' + menuItem["ID"] + "||" + menuItem["PACKAGENAME"] + '" title="导出"></span>' +
					//'<span class="ict-userDispatch pull-right operator" title="在线测试"></span>' +
					'</a>');
			}
			return html.join("");
		},

		getAppInfo: function (appId) {
			var result = maoOrmBase.query(this.appTable,
					JSON.stringify(["ID", "PACKAGENAME", "CREATOR", "CREATETIME", "MODIFYTIME", "DESC"]),
					generateCondition([{"cname": "ID", "value": appId, "compare": "="}], 'and')),
				appInfo = {};

			if (!result) {
				console.error("加载应用详情异常");
				tipBox.showMessage('加载应用详情异常', 'error');
				return;
			}

			if (result.status === 0) {
				console.error("加载应用详情失败:" + result.message);
				tipBox.showMessage('加载应用详情失败', 'error');
				return;
			}

			if (result.status === 1 && result.rows) {
				appInfo = result.rows[0];
			}

			return appInfo;
		},

		getAppReport: function (appId) {
			var result = maoOrmBase.query(this.appReportTable,
					JSON.stringify(["ID", "FORM_TOTAL", "LIST_TOTAL", "CHART_TOTAL", "MODEL_TOTAL"]),
					generateCondition([{"cname": "ID", "value": appId, "compare": "="}], 'and')),
				appReport = {FORM_TOTAL: 0, LIST_TOTAL: 0, CHART_TOTAL: 0, MODEL_TOTAL: 0};

			if (!result) {
				console.error("加载应用报表异常");
				tipBox.showMessage('加载应用报表异常', 'error');
				return appReport;
			}

			if (result.status === 0) {
				console.error("加载应用报表失败:" + result.message);
				tipBox.showMessage('加载应用报表失败', 'error');
				return appReport;
			}

			if (result.status === 1 && result.rows) {
				appReport = result.rows[0];
			}

			return appReport;
		},

		add: function () {
			if (maoEnvBase.isCurrentDemoTenant()) {
				tipBox.showMessage(TIP_MSG_DEMO_TENANT_LIMITED, 'info');
				return;
			}
			
			showModalDialog(this.dialogId, "新增应用", this.url + "?operator=add");
		},

		update: function (appId) {
			if (maoEnvBase.isCurrentDemoTenant()) {
				tipBox.showMessage(TIP_MSG_DEMO_TENANT_LIMITED, 'info');
				return;
			}
			
			showModalDialog(this.dialogId, "编辑应用", this.url + "?operator=edit&ID=" + appId);
		},

		delete: function (appId) {
			if (maoEnvBase.isCurrentDemoTenant()) {
				tipBox.showMessage(TIP_MSG_DEMO_TENANT_LIMITED, 'info');
				return;
			}
			
			var that = this, appReport = this.getAppReport(appId);
			if (appReport.FORM_TOTAL > 0 || appReport.LIST_TOTAL > 0
				|| appReport.CHART_TOTAL > 0 || appReport.MODEL_TOTAL > 0) {
				tipBox.showMessage('应用中包含模型或页面，请先删除模型和页面后再删除应用。', 'error');
				return;
			}

			bootbox.confirm(('确定要删除吗?'), function (result) {
				if (result) {
					var callback = function (data) {
						if (data && data.status === 1) {
							$(".app-menu-body .list-group-item[appid=" + appId + "]").remove();
							that.selectApp($(".app-menu-body a:first"));
							that.refreshTotalAppInfo(-1, "delete");

							tipBox.showMessage('删除成功', 'info');
						} else {
							console.error("应用删除失败:" + data.message);
							tipBox.showMessage('应用删除失败:' + data.message, 'error');
						}
					};
					maoOrmBase.delete(that.appTable, {"cname": "ID", "value": appId, "compare": "="}, callback);
				}
			});
		}
	};



	/**
	 * 重设菜单高度
	 */
	function resetMenuHeight() {
		var bodyHeight = $(window).height() - 10;
		$("#appMenu").height(bodyHeight);
		var $appExtRow = $(".app-row-ext");
		if((bodyHeight - 151) / 2 > 180){
			$appExtRow.height((bodyHeight - 151) / 2);
		}else{
			$appExtRow.height(180);
		}

		var $appMenuBody = $(".app-menu-container");
		if ($appMenuBody.hasClass("mCustomScrollbar")) {
			$appMenuBody.mCustomScrollbar("destroy");
		}
		$appMenuBody.mCustomScrollbar({setHeight: bodyHeight - 80, theme: "dark"});
	}

	$(win).resize(function () {
		resetMenuHeight();
	});

	

	/**
	 * 应用引导功能	
	 */
	var AppGuideManage = function(){
		this.appCranberryKey = "guide-workbench-app";
	};

	AppGuideManage.prototype = {

		/**
		 * 设置应用引导缓存		
		 */
		_setCranberryStorage:function(){
			if(!storage.isStorage){
				return ;
			}

			storage.put(this.appCranberryKey,true);
		},

		/**
		 * 获取应用引导缓存	
		 */
		_getCranberryStorage:function(){
			if(!storage.isStorage){
				return false ;
			}

			return storage.get(this.appCranberryKey);
		},

		/**
		 * 绑定引导信息		
		 */
		_initCranberry:function(){
			var $model = $("#appModel"),$appList = $("#appForm"),
				mPosition = {
					top: $model.offset().top,
					left: $model.offset().left
				},
				mPosition2 = {
					top: $model.offset().top + 100,
					left: $model.offset().left + 150
				},
				mPosition3 = {
					top: $appList.offset().top ,
					left: $appList.offset().left + 150 
				};
			
			cranberry([{
				type: cranberry.TYPE_MULTIPLE,
				targets: ["#appMenu"],
				tipPosition: mPosition,
				tipWidth: '200px',
				tipBackgroundColor:"rgba(93, 93, 93, 0.9)",
				text: '<div class="guide-title">第一步</div><div class="guide-body">新增应用</div>'
			}, {
				type: cranberry.TYPE_TIP,
				target: "#appModel",
				tipWidth: '200px',
				tipBackgroundColor:"rgba(93, 93, 93, 0.9)",
				text: '<div class="guide-title">第二步</div><div class="guide-body">新增数据模型</div>'
			}, {
				type: cranberry.TYPE_MULTIPLE,
				targets: ["#appForm", "#appList", "#appChart"],
				tipPosition: mPosition2,
				tipWidth: '250px',
				tipBackgroundColor:"rgba(93, 93, 93, 0.9)",
				text: '<div class="guide-title">第三步</div><div class="guide-body">新增表单、列表或图表</div>'				
			},{
				type: cranberry.TYPE_MULTIPLE,
				targets: ["#testApp"],	
				tipPosition: mPosition3,			
				tipWidth: '200px',
				tipBackgroundColor:"rgba(93, 93, 93, 0.9)",
				text: '<div class="guide-title">第四步</div><div class="guide-body">测试部署</div>'
			}]).start();
		},

		/**
		 * 绑定引导功能
		 */
		bindCranberry: function() {

			//如果浏览器不支持缓存，不显示引导功能。
			if (!storage.isStorage) {
				return;
			}

			//如果上次已经显示了引导信息，则不在显示
			if (this._getCranberryStorage()) {
				return;
			}

			//初始化引导功能
			this._initCranberry();

			//设置浏览缓存
			this._setCranberryStorage();
		}

	};

	

	var appManage = new AppManage(),
		appGuide = new AppGuideManage();

	$(document).ready(function () {
		//设置窗口名称
		parent.window.name = "应用管理";
		
		//页面事件绑定
		$("#addNewApp").on("click", function() {
			appManage.add();
		});

		//在线测试
		$("#testApp").on("click", function() {
			var href = $("#BCP_BPM_TEST",parent.document).parent().attr("href");
			if(href){
				var appId = $(".app-menu-body .selected").attr("appid");
				if(appId){
					$("#page-mainIframefm",parent.document).attr("src",href+"?appid=" + appId);
				} else {
					$("#page-mainIframefm",parent.document).attr("src",href);
				}
			}
		});

		$(".app-menu-body").on("click", ".ict-delete", function() {
			appManage.delete($(this).parent().attr("appid"));
		}).on("click", ".ict-modify", function() {
			appManage.update($(this).parent().attr("appid"));
		}).on("click", ".list-group-item", function() {
			appManage.selectApp(this);
		});

		//初始完成后，重设界面高度
		resetMenuHeight();

		//绑定引导功能
		appGuide.bindCranberry();

	});

	win.zStudioAppManage = appManage;
} (jQuery, window));


/**
 * 应用提交回调函数
 * @param data
 */
function vm1487320279839SuccessCallBack(data) {
	if (data && data.status === 1) {
		var appId = "", operation = "update";
		if (data.primaryKey && data.primaryKey.id) {
			appId = data.primaryKey.id[0];
			operation = "add";
		}

		if (!appId) {
			appId = $(".app-menu-body .selected").attr("appid");
		}

		if (!appId) {
			return;
		}

		zStudioAppManage.refreshAppMenu(appId);
		zStudioAppManage.selectApp($(".app-menu-body .list-group-item[appid=" + appId + "]"));
		zStudioAppManage.refreshTotalAppInfo(1, operation);

		hideModalDialog('dialogApp');
		tipBox.showMessage('应用提交成功。', 'info');
	} else {
		tipBox.showMessage('应用提交失败。', 'error');
	}
}


/**
 * 添加应用时添加用户信息
 * @param vm
 * @returns {*}
 */
function vm1487320279839ParameterFilterCallBack(vm){
	var currentUserInfo = maoEnvBase.getCurrentUser();
	vm.columns.CREATOR = currentUserInfo.username;
	return vm;
}

