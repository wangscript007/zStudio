var business_type;
(function(global, $){
	var BusinessTypeStartManage=function(){}
	BusinessTypeStartManage.prototype={
		getBussiness:function(){
			var businessType="";
			$.ajax({
				type: "GET",
				url: "mao/common/isSupportProcess",
				datatype: 'json',
				//contentType: 'text/plain;charset=UTF-8',
				contentType :'application/json; charset=UTF-8',
				async: false,
				success: function (data, textStatus) {
					var dataVar = $.parseJSON(data);
					if(dataVar.data){
						businessType = "process";//"business";
					}else{
						businessType = "business"; ////"business";
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log("textStatus " + textStatus + " errorThrown "
						+ errorThrown + " url " + esbinfo + url);
				}
			});
			return businessType;
		},
		generateCondition:function(conditions, operator) {
			if (conditions.length == 0) {
				return {};
			}
			//如果条件只有一个参数，直接返回条件对象
			if (conditions.length == 1) {
				return conditions[0];
			}
			//条件有多个参数，返回组合对象
			if (operator == "and") {
				return {and: conditions};
			}
			else {
				return {or: conditions};
			}
		},
		updateBusinessMenu:function(status){
			var conditions = new Array();
			var condition1 = {'cname': 'NAME', 'compare': 'in', 'value': ["我的申请","我的审批","流程管理"]};
			var condition2 = {'cname': 'URL', 'compare': '=', 'value': "#"};
			conditions.push(condition1);
			conditions.push(condition2);
			maoOrmBase.update("tenant_menu",'["STATUS"]','['+status+']',this.generateCondition(conditions,"and"),function(){});
		}
	};
	$(document).ready(function(){
		var businessTypeStartManage=new BusinessTypeStartManage();
		business_type=businessTypeStartManage.getBussiness();
		business_type=="business"?businessTypeStartManage.updateBusinessMenu(0):businessTypeStartManage.updateBusinessMenu(1);

		setTimeout(
			function() {
				$.ajax({
					type: "GET",
					url: global.workbench_Url + 'mao/common/login/check',
					contentType :'application/json; charset=UTF-8',
					async: true,
					dataType: 'json',
					success: function (data, textStatus) {
						if(data.status !== 1) {
							global.location.href = global.workbench_Url + 'user-page.html?page=log';
						}
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
					}

				});
			}, 30*1000
		);



	});

})(window, jQuery)
;(function($){
	var MenuDataManage = function(){
		this.data = [];
		this.sideBarContainer = $(".page-sidebar.navbar-collapse");
		this.rootBarContainer = $("#f_hormenu");
		this.logout = $("#trigger_logout");
		this.currentUser = $("#currentUser");
		this.init();
	}
	
	MenuDataManage.prototype = {
		init:function(){			
			this.initData();
			this.initRootMenu();
			this.initFrameSize();	
			this.initEvent();
		},
		initEvent:function(){
			$(this.logout).click(function(e){
				e.preventDefault();
				logout();
			})
		},
		initData:function(){
			this.currentUser.html(maoEnvBase.getCurrentUserName());
		
			this.data = [
				];
				var that = this;
				$.ajax({
                type: "GET",
                url: "mao/tenant/menu",
                contentType :'application/json; charset=UTF-8',
						dataType: "json",
                async: false,
                success: function (data, textStatus) {
                    that.data = data.data;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert('加载菜单数据失败!');
                }
            });
		},
		getMenuItemsByParentKey:function(parentKey){
			var items = [];
			$.each(this.data,function(index,item){
				if(parentKey === item.parent_key){
					items.push(item);
				}		
			})
			
			return items;
		},
		getMenuItemByKey:function(key){
			var menu = {};
			$.each(this.data,function(index,item){
				if(key === item.key){
					menu = item;
					return false;
				}		
			})			
			return menu;
		},
		getRootMenuHtml:function(menuItems){
			if(!menuItems || menuItems.length === 0){
				return "";
			}
			
			var html = [];
			$.each(menuItems,function(index,item){
				var url = item.url;
				if(url.indexOf('portal_Url') > -1){
					url = url.replace('portal_Url@',eval('portal_Url'));
				}

				var target = "page-mainIframefm";
				if(item.key == 'BCP_BPM_INDEX' || item.key == 'BCP_BPM_HELP' || item.key == 'BCP_BPM_SERVICE'){
					target = "_black";
				}
				html.push('<li class="mega-menu-dropdown iframe">');
				html.push('<a href="'+url+'" target="'+ target +'" class="iframe">');
				html.push('<span id="'+item.key+'" class="title">'+item.name+'</span>');
				/*html.push('<span class="selected"> </span>');
				html.push('<span class="arrow"> </span>');*/
				html.push("</a></li>");
			});
			
			var demoinfo = '<li class="mega-menu-dropdown iframe"> <a id="demo-data" href="javascript:void(0)" class="iframe"> <span id="BCP_BPM_SERVICE" class="title">演示环境</span> </a></li>',
			switchinfo = '<li class="mega-menu-dropdown iframe"> <a id="logout-demo-data" href="javascript:void(0)" class="iframe"> <span id="BCP_BPM_SERVICE" class="title">退出演示环境</span> </a></li>';
			
			if(maoEnvBase.user && !maoEnvBase.user.isDemo) {
				html.push(demoinfo);
			}
			else if(maoEnvBase.user && maoEnvBase.user.isDemo){
				html.push(switchinfo);
			}
			
			return html.join(" ");
		},
		/**
			获取左侧导航栏html
		*/
		getSideBarMenuHtml:function(menuItems){
			if(!menuItems || menuItems.length === 0){
				return "";
			}
			
			var html = [],that = this;
			html.push('<ul class="page-sidebar-menu" id="page-f-sidebar-menu" data-auto-scroll="true" data-slide-speed="200" style="display: block;">'+
					'<li class="sidebar-toggler-wrapper" style="display: block;">'+
						'<div class="sidebar-toggler hidden-xs hidden-sm"></div>'+
					'</li>');
			$.each(menuItems,function(index,item){
				html.push(that.getSideBarMenuItemHtml(item));
			})
			html.push("</ul>");
			
			return html.join(" ");
		},		
		getSideBarSubMenuHtml:function(menuItems){
			if(!menuItems || menuItems.length === 0){
				return "";
			}
			
			var html = [],that = this;
			html.push('<ul class="sub-menu" style="display:none;"> ');
			$.each(menuItems,function(index,item){
				html.push(that.getSideBarMenuItemHtml(item));
			})
			html.push("</ul>");
			
			return html.join(" ");			
		},
		getSideBarMenuItemHtml:function(menuItem){
			if(!menuItem){
				return "";
			}
			
			var html = [];
			html.push('<li class="iframe" style="display: block;">');
			var subMenuItems = this.getMenuItemsByParentKey(menuItem.key);	
			if(subMenuItems && subMenuItems.length>0){
				html.push('<a href="#">'+
				'<i class="fa fa-comments"> </i>'+
				'<span id="'+menuItem.key+'"  class="title">'+menuItem.name+'</span>'+
				'<span class="selected"></span>'+
				'<span class="arrow"></span>'+	
				'</a>' );
				html.push(this.getSideBarSubMenuHtml(subMenuItems));			
			}else{
				var url = menuItem.url;
				if(!url || url === "#"){
					url = "construction.html";
				}
				
				html.push('<a href="'+ url +'" target="page-mainIframefm">'+
				'<i class="fa fa-comments"> </i>'+
				'<span id="'+menuItem.key+'"  class="title">'+menuItem.name+'</span>'+
				'<span class="selected"></span>'+				
				'</a>' );
			}
			html.push("</li>");
			return html.join(" ");
		},
		setBreadcrumbHtml:function(){
			var html = [];
			
			$.each($("#f_hormenu,.page-sidebar-menu").find(".active"),function(index,item){
				var title = $(item).find("a>.title").html();				
				html.push('<a href="#"><span class="title">'+title+'</span></a>'+
						'<i class="fa fa-angle-right"></i>');
			});
			
			$(".page-content-body .page-breadcrumb").empty().append(html.join(" "));
		},
		setFrameContent:function(selectedMenu){
			if(!selectedMenu){
				selectedMenu = this.getSideBarFirstLeafMenu($(".page-sidebar-menu"));
			}
			var src = $(selectedMenu).find("a:first").attr("href");			
			$("#page-mainIframefm").attr("src",src);
		},
		initRootMenu:function(){
			var subMenus = this.getMenuItemsByParentKey("BCP_BPM");
			this.rootBarContainer.empty().append(this.getRootMenuHtml(subMenus));	
			this.bindRootMenuEvent();	
		},
		initSideBarMenu:function(parentKey){
			var subMenus = this.getMenuItemsByParentKey(parentKey);
			this.sideBarContainer.empty().append(this.getSideBarMenuHtml(subMenus));
			this.bindSideBarMenuEvent();
		},
		initFrameSize:function(){
			function resizeU() {
				var divkuangH = $(window).height();				
				$("#page-mainIframefm").height(divkuangH - 46);
			}
			resizeU();
			$(window).resize(resizeU);			
		},	
		bindRootMenuEvent:function(){
			var that = this;			
			$(".mega-menu-dropdown").click(function(){
				that.rootBarContainer.find(".active").removeClass("active");
				$(this).addClass("active");				
			})
			
			$(".mega-menu-dropdown:first").trigger("click");			
			//var firstPage= $(".mega-menu-dropdown:first>a").attr("href");
			var firstPage = $(".mega-menu-dropdown:has(span#BCP_BPM_DESIGN):first>a").attr('href');
			if(firstPage){
				$("#page-mainIframefm").attr("src",firstPage);
			}
		},
		getSideBarFirstLeafMenu:function(object){			
			var $firstMenuItem = $(object).find("li:not(.sidebar-toggler-wrapper):first");
			var $subMenu = $firstMenuItem.children(".sub-menu:first");
			if($subMenu.size() > 0){
				return this.getSideBarFirstLeafMenu($subMenu);
			}else{
				return $firstMenuItem;
			}
		},		
		bindSideBarMenuEvent:function(){
			var that = this;
			$(".page-sidebar-menu").on("click","li",function(e){				
				var childSize = $(this).children(".sub-menu").size();
				if(childSize > 0){
					if($(this).hasClass("open")){
						$(this).removeClass("open");	
						$(this).find("span.arrow").removeClass("open");
						$(this).children(".sub-menu").hide();
					}else{
						$(this).addClass("open");
						$(this).find("span.arrow").addClass("open");
						$(this).children(".sub-menu").show();
					}	
				}else{
					$(".page-sidebar-menu").find(".active").removeClass("active");
					$(this).addClass("active");
					$(this).parents("li").addClass("active");
					$(this).parents(".sub-menu").show();
					that.setBreadcrumbHtml();
					that.setFrameContent($(this));	
				}
				
				e.stopPropagation();	
			})
			
			this.bindSidebarTogglerEvent();
		},
		bindSidebarTogglerEvent:function(){	
			$(".sidebar-toggler-wrapper").click(function(e){
				if($("body").hasClass("page-sidebar-closed")){
					$("body").removeClass("page-sidebar-closed");
					$(".page-content").css("margin-left","225px");
				}else{
					$("body").addClass("page-sidebar-closed");
					$(".page-content").css("margin-left","35px");
				}
				e.stopPropagation();	
			})
		}
};
	
	$(document).ready(function(){		
		new MenuDataManage();
		
		if(maoEnvBase.user && maoEnvBase.user.isDemo) {
			$("#header_dropdown_user").empty();
		}
		
		$('#demo-data').on('click', function() {
			$.cookie("current-userame", maoEnvBase.user.username);
			$.cookie("current-password", maoEnvBase.user.password);
			logout(function() {
				login({
	                name: 'admin@demo',
	                password: ict_framework_func1('1')
	            });
			});
		});
		$('#logout-demo-data').on('click', function() {
			logout(function() {
				login({
					name: $.cookie("current-userame"),
					password: ict_framework_func1($.cookie("current-password"))
				});
			});
		});
	});
	
	function login(data) {
	    $.ajax({
	        type: "POST",
	        url: "mao/uap/login",
	        data: JSON.stringify(data),
	        dataType: "json",
	        contentType: 'application/json; charset=UTF-8',
	        async: false,
	        success: function (result, textStatus) {
	            if (result.status === 1) {
	                location.href = 'index.html';
	            } else {
	            	tipBox.showMessage(result.message, tipBox.ERROR);
	            }
	        },
	        error: function (result, textStatus) {
	            bootbox.alert("网络异常")
	        }
	    });
	}
	
	function logout(success) {
		var url = "mao/sso/user/loginout";
		var isDesigner = location.pathname.toLowerCase().indexOf('workbench') > -1 ? true : false;
		var cookie = document.cookie;
		var cookieArr = cookie.split("; ");
		var user_info = {};
		for (var i = 0; i < cookieArr.length; i++) {
			user_info[cookieArr[i].split("=")[0]] = cookieArr[i].split("=")[1];
		}
		$.ajax({
			type: "POST",
			url: url,
			contentType :'application/json; charset=UTF-8',
			async: true,
			data: JSON.stringify(user_info),
			success: function (data, textStatus) {
				if(success) {
					success();
				}
				else {
					if(isDesigner) {
						$.cookie("design_mao_user_token",null,{path:"/"});
						$.cookie("mock_mao_user_token",null,{path:"/"});
						window.location.href = "/workbench";
					}
					else {
						$.cookie("operation_mao_user_token",null,{path:"/"});
						window.location.href = "/server";
					}
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			}

		});
	}
}(jQuery))

