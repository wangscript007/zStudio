(function(global) {
	var contextPath = getContextPath(),
		assetPrefix = contextPath + 'asset/',
		designerJsPrefix = contextPath + 'js/designer/';
	
	global.contextPath = contextPath;
	
		//配置数据
	global.config = {
		sence : 'develop', //开发场景develop 运行场景runtime
		defaultAppid : -1,
		product: 'ksy'
	};
	
	function getContextPath() {
		//场景分为开发和运行，运行场景下的js会进行压缩
		var contextPath = document.location.pathname, 
		index = contextPath.substr(1).indexOf("/");
		contextPath = contextPath.substr(0, index + 2);
		return contextPath;
	}
	
	function load() {
		var jsPaths = [];
		if (global.config.sence === 'develop') {
			jsPaths = [assetPrefix + 'js/jquery-ui.min.js',
					   assetPrefix + 'js/jquery.ui.touch-punch.min.js',
					   assetPrefix + 'js/jquery.tablednd.js',
					   assetPrefix + 'js/jquery.htmlClean.js',
					   assetPrefix + 'js/jquery.i18n.properties1.2.3.min.js',
					   assetPrefix + 'js/bootstrap.min.js',
					   //assetPrefix + 'js/bootbox.min.js',	// require 加载会出错，暂时屏蔽，或放到html中引入
					   assetPrefix + 'js/lodash.min.js',
					   assetPrefix + 'custom-scrollbar/jquery.mCustomScrollbar.concat.min.js',
					   assetPrefix + 'js/HTMLFormat.js',
					   designerJsPrefix + 'designer-tools.js',
					];
		}
		else {
			jsPaths = [assetPrefix + 'js/design-frame.min.js', 
					   designerJsPrefix + 'designer-tools.js'];
		}
		
		requirejs(jsPaths, function() {
			fetchData();
			/*
			setTimeout(function() {
				requirejs([designerJsPrefix + 'component-loader.js',
						   designerJsPrefix + 'views/component-view.js',
						   designerJsPrefix + 'component.js',
						   designerJsPrefix + 'page.js',
						   designerJsPrefix + 'views/property-view.js',
						   designerJsPrefix + 'views/designer-view.js',
						   contextPath + 'js/properties-controller/basic-control.js'
						   ], function() {
					global.componentLoader.load();
				});
			}, 1000);
			*/
		});
	}
	
	/**
	 * 通过应用id获取所需要的数据，如果应用id不存在则传入全局id值到服务端
	 */
	function fetchData_old() {
		var appid = _tools.getUrlParam('appid', global.location.search),
		file = _tools.getUrlParam('file', global.location.search);
		if(!file) {
			file = localStorage.getItem('design_file');
		};
		
		$.getJSON(contextPath + 'app/ksy/component-group.json', function(result) {
			global.componentGroup = result;
		});
		
		$.getJSON(contextPath + 'app/ksy/components/layout12/content-layout.json', function(result) {
			global.components = [{name: 'ksy-layout12',group:'layout', config: result}];
		});
		
		
		
		requirejs([contextPath + 'app/ksy/components/layout12/ksy-layout12_d.js', 
		           contextPath + 'app/ksy/components/layout12/ksy-layout12_r.js']);
		
		
		/*$.ajax({
			url: contextPath + _tools.fetchDataUrl,
			data: {appid: appid, file: file},
			async: false,
			cache: false,
			type: 'POST',
			dataType: "json",
			success: function (data) {
				//解析数据到window对象
				//模型数据
				global.model = '';
				//加载的页面数据
				global.pageData = '';
				//服务端返回的配置信息
				global.config = '';
				
				//组件数据，完成后加载组件js
				global.components = '';
				
				//国际化数据
				global.i18ns = '';
				
				//组件视图分组
				global.componentGroup = '';
				
				//商品类型
				global.config.product = 'ksy';
				
				
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
                console.error("请求服务[" + _tools.fetchDataUrl + "]出现错误：textStatus:" + textStatus + " errorThrown:" + errorThrown);
			}
		});*/
	};
	
	function fetchData() {
		var appid = _tools.getUrlParam('appid', global.location.search),
		file = _tools.getUrlParam('file', global.location.search);
		if(!file) {
			file = localStorage.getItem('design_file');
		};
		
		global.designerApp.fileName = file;
		
		$.ajax({
			url: contextPath + _tools.fetchDataUrl + '?file-name=' + file,
			//data: {appid: appid, file: file},
			async: true,
			cache: false,
			type: 'GET',
			contentType :'application/json; charset=UTF-8',
			dataType: 'json',
			success: function (data) {
				var designData = data.data;
				
				//解析数据到window对象
				//模型数据
				global.model = '';
				//加载的页面数据
				global.pageData = designData.drawingBoard.content || {};
				//服务端返回的配置信息
				global.config = designData.systemConfig;
				
				//组件数据，完成后加载组件js
				global.components = designData.component;
				
				//国际化数据
				global.i18ns = '';
				
				//组件视图分组
				global.componentGroup = designData.componentGroupList;
				
				//商品类型
				global.config.product = 'ksy';
				
				loadScripts();
				/*
				requirejs([contextPath + 'app/ksy/components/layout12/ksy-layout12_d.js', 
						   contextPath + 'app/ksy/components/layout12/ksy-layout12_r.js']);
				*/
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
                console.error("请求服务[" + _tools.fetchDataUrl + "]出现错误：textStatus:" + textStatus + " errorThrown:" + errorThrown);
			}
		});
	};
	
	function loadScripts() {
		var scripts = [];
		
		// 组件js
		$.each(global.components, function(index, item) {
			var path = contextPath + 'app/' + global.config.product + '/components/' + item.id + '/' + item.id;
			scripts.push(path + '_d.js');
			scripts.push(path + '_r.js');
		});
		
		//设计器js 
		// TODO xionghui：是否可以放到load()方法里加载这些设计器的js?
		scripts = scripts.concat([
			designerJsPrefix + 'views/component-view.js',
			designerJsPrefix + 'views/designer-view.js',
			designerJsPrefix + 'views/property-view.js',
			designerJsPrefix + 'views/toolbar-view.js',
			designerJsPrefix + 'component-loader.js',
			designerJsPrefix + 'component.js',
			designerJsPrefix + 'page.js',
			contextPath + 'js/properties-controller/basic-control.js'
		]);
		
		requirejs(scripts, function() {
			initDesigner();
		});
	}
	
	function initDesigner() {
		global.componentLoader.load();
		global.componentView.init();
		global.designerView.init();
		global.toolbarView.init();
		
		global.designerView.restoreDesignView(global.pageData);
	}
	
	global.designerApp = {
		run: function() {
			load();
		}
	}
}(window));

$(document).ready(function() {
	designerApp.run();
});