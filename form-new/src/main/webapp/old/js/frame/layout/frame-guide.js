;(function($, win) {

	/**
	 * 页面设计器框架引导功能	 
	 */
	var FrameGuide = function() {
		this.key = "guide-form-frame";
	};


	FrameGuide.prototype = {

		/**
		 * key		
		 */
		getKey: function() {
			return this.key;
		},


		/**
		 * 引导参数		
		 */
		getGuideParam: function() {
			var steps = [],
				pageHeight = $(window).height();

				var d = $(".demo");
		        var w = d.width();
		        var h = d.height();
		        var t = d.offset().top;
		        var l = d.offset().left;

		        var x = l + w / 2;
		        var y = t + h / 2;

		        w = w * 0.6;
		        h = h * 0.6;

		        x = x - w / 2;
		        y = y - h / 2;
		        var to_d = {
		            x : x,
		            y : y,
		            width : w,
		            height: h
		        };

			steps.push({
				type: cranberry.TYPE_TIP,
				target: ".navbar-header",
				text: '这里是<span class="guide-highlight">工具视图</span>'
			});

			steps.push({
				type: cranberry.TYPE_MULTIPLE,
				targets: [".form-layout-west"],
				tipPosition: {
					top: pageHeight / 2,
					left: 200
				},
				text: '这里是<span class="guide-highlight">组件视图</span>，是存放页面设计器组件的面板'
			});

			steps.push({
				type: cranberry.TYPE_MULTIPLE,
				targets: ["#layoutCompPanel"],
				tipPosition: {
					top: pageHeight / 2,
					left: 200
				},
				text: '这里是<span class="guide-highlight">布局组件</span>，是存放其它组件的容器，请先将布局组件拖曳到设计区后再拖曳其它组件',
				beforeShow: function() {
					$("#layoutCompPanel").prev(".body").hide();
					$("#layoutCompPanel .body").show();
					$("#baseCompPanel .body").hide();
					$("#hiddenCompPanel .body").hide();
				}
			});

			steps.push({
				type: cranberry.TYPE_MULTIPLE,
				targets: ["#baseCompPanel"],
				tipPosition: {
					top: pageHeight / 2,
					left: 200
				},
				text: '这里是<span class="guide-highlight">基础组件</span>，包含页面设计过程中的常用组件',
				beforeShow: function() {
					$("#layoutCompPanel").prev(".body").hide();
					$("#layoutCompPanel .body").hide();
					$("#baseCompPanel .body").show();
					$("#hiddenCompPanel .body").hide();
				}
			});

			steps.push({
				type: cranberry.TYPE_MULTIPLE,
				targets: ["#hiddenCompPanel"],
				tipPosition: {
					top: pageHeight / 2,
					left: 200
				},
				text: '这里是<span class="guide-highlight">隐藏组件</span>，此类组件在运行期会被调用执行',
				beforeShow: function() {
					$("#layoutCompPanel").prev(".body").hide();
					$("#layoutCompPanel .body").hide();
					$("#baseCompPanel .body").hide();
					$("#hiddenCompPanel .body").show();
				}
			});

			steps.push({
				type: cranberry.TYPE_TIP,
				target: ".demo",
				text: '这里是<span class="guide-highlight">设计区视图</span>，请将组件拖曳到此区域'
			});

			steps.push({
				type: cranberry.TYPE_TIP,
				target: ".footer-bg",
				text: '这里是<span class="guide-highlight">隐藏组件区视图</span>，请将隐藏组件拖曳到此区域'
			});

			steps.push({
				type: cranberry.TYPE_TIP,
				target: ".form-layout-east",
				text: '这里是<span class="guide-highlight">属性视图</span>,是设置组件属性的区域',
				beforeShow: function() {
					var $firstObject = $(".demo .box .view:first");
					if ($firstObject.length > 0) {
						clickDemoView($firstObject);
					}
				}
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".form-layout-west",
				to: to_d,
				text: '试试把<span class="guide-highlight">组件</span>拖到页面中吧！',
				beforeShow: function() {
					$("#layoutCompPanel").prev(".body").show();
					$("#layoutCompPanel .body").show();
					$("#baseCompPanel .body").show();
					$("#hiddenCompPanel .body").show();
				}
			});

			return steps;
		}
	};



	/**
	 * 表单布局器组件功能导航
	 */
	var FormLayout = function() {
		this.key = "guide-form-layout";
	};

	FormLayout.prototype = {
		/**
		 * key		
		 */
		getKey: function() {
			return this.key;
		},

		getGuideParam: function() {
			var steps = [];
			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(布局比例)",
				text: '第一步:设置<span class="guide-highlight">布局比例</span>'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(数据源)",
				text: '第二步:绑定<span class="guide-highlight">数据源</span>，布局组件可多层嵌套，如果在其中一层绑定了数据源，则其子组件将会继承父组件数据源'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: "#baseCompPanel",
				to: ".demo .form-component_active",
				text: '第三步:拖曳组件到<span class="guide-highlight">布局组件</span>中'
			});

			return steps;
		}
	};



	/**
	 * 表格组件功能导航
	 */
	var FormTable = function() {
		this.key = "guide-form-table";
	};

	FormTable.prototype = {
		/**
		 * key		
		 */
		getKey: function() {
			return this.key;
		},

		getGuideParam: function() {
			var steps = [];

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(列定制)",
				text: '表格<span class="guide-highlight">列定制</span>,请先配置父级布局组件数据源后再进行<span class="guide-highlight" >列定制</span>。)'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: ".form-layout-east",
				text: '配置表格其它属性'
			});

			return steps;
		}
	};



	/**
	 * 树组件功能导航
	 */
	var FormTree = function() {
		this.key = "guide-form-tree";
	};

	FormTree.prototype = {
		/**
		 * key		
		 */
		getKey: function() {
			return this.key;
		},

		getGuideParam: function() {
			var steps = [];

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(节点ID)",
				text: '配置树<span class="guide-highlight">节点ID</span>对应的字段'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(节点名称)",
				text: '配置树<span class="guide-highlight">节点名称</span>对应的字段'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(父节点ID)",
				text: '配置<span class="guide-highlight">父节点ID</span>对应的字段'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(节点提示)",
				text: '配置树<span class="guide-highlight">节点提示</span>对应的字段'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(URL)",
				text: '配置<span class="guide-highlight">URL</span>，树数据源接口URL地址'
			});


			return steps;
		}
	};



	/**
	 * 按钮组件功能导航
	 */
	var FormButton = function() {
		this.key = "guide-form-button";
	};

	FormButton.prototype = {
		/**
		 * key		
		 */
		getKey: function() {
			return this.key;
		},

		getGuideParam: function() {
			var steps = [];

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".demo .form-component_active",
				to: "tr:contains(按钮类型)",
				text: '根据开发需要可以配置按钮类型为<span class="guide-highlight">提交</span><span class="guide-highlight">批量提交</span><span class="guide-highlight">重置</span><span class="guide-highlight">查询</span><span class="guide-highlight">对话框</span><span class="guide-highlight">超链接</span><span class="guide-highlight">自定义</span>等多种类型中的一种。'
			});

			return steps;
		}
	};


	/**
	 * js脚本组件导航
	 */
	var FormScript = function() {
		this.key = "guide-form-script";
	};

	FormScript.prototype = {
		/**
		 * key		
		 */
		getKey: function() {
			return this.key;
		},

		getGuideParam: function() {
			var steps = [];

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".footer-bg .form-component_active",
				to: "tr:contains(文件路径)",
				text: '配置<span class="guide-highlight">文件引用路径</span>，引用文件路径是应用目录的相对路径，如：js/common/xxx.js'
			});

			return steps;
		}
	};



	/**
	 * 表格组件功能导航
	 */
	var FormDialog = function() {
		this.key = "guide-form-dialog";
	};

	FormDialog.prototype = {
		/**
		 * key		
		 */
		getKey: function() {
			return this.key;
		},

		getGuideParam: function() {
			var steps = [];

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".footer-bg .form-component_active",
				to: ".form-layout-east",
				text: '<span class="guide-highlight">对话框配置</span>，按钮对话框才需要进行如下配置，如果是函数调用显示的对话框不需要进行下列配置'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".footer-bg .form-component_active",
				to: ".form-layout-east tr:contains(标题)",
				text: '配置<span class="guide-highlight">对话框标题</span>'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".footer-bg .form-component_active",
				to: ".form-layout-east tr:contains(URL)",
				text: '配置对话框显示页面<span class="guide-highlight">URL</span>如：xxx.html'
			});


			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".footer-bg .form-component_active",
				to: ".form-layout-east tr:contains(宽度)",
				text: '配置对话框<span class="guide-highlight">宽度</span>'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".footer-bg .form-component_active",
				to: ".form-layout-east tr:contains(高度)",
				text: '配置对话框<span class="guide-highlight">高度</span>'
			});

			steps.push({
				type: cranberry.TYPE_FROM_TO,
				from: ".footer-bg .form-component_active",
				to: ".form-layout-east tr:contains(支持HTML)",
				text: '配置静态对话框<span class="guide-highlight">HTML</span>,对话框URL与HTML只能配置其中一项'
			});

			return steps;
		}
	};



	/**
	 * 表单引导功能
	 */
	var FormGuideManage = function() {};

	FormGuideManage.prototype = {

		/**
		 * 设置引导缓存		
		 */
		_setCranberryStorage: function(key) {
			if (!storage.isStorage) {
				return;
			}

			storage.put(key, true);
		},

		/**
		 * 获取引导缓存	
		 */
		_getCranberryStorage: function(key) {
			if (!storage.isStorage) {
				return false;
			}

			return storage.get(key);
		},

		/**
		 * 绑定引导信息		
		 */
		_initCranberry: function(params) {
			cranberry(params).start();
		},

		/**
		 * 绑定引导功能
		 */
		bindCranberry: function(guide) {

			//如果浏览器不支持缓存，不显示引导功能。
			if (!storage.isStorage || !guide) {
				return;
			}

			//如果上次已经显示了引导信息，则不在显示
			if (this._getCranberryStorage(guide.getKey())) {
				return;
			}

			//如果未创建文件，则不显示引导功能
			if (!currentFile) {
				return;
			}

			//初始化引导功能
			this._initCranberry(guide.getGuideParam());

			//设置浏览缓存
			this._setCranberryStorage(guide.getKey());
		}

	};


	$.bfd = $.bfd || {};
	$.bfd.guide = new FormGuideManage();
	$.bfd.guide.frame = new FrameGuide();
	$.bfd.guide.layout = new FormLayout();
	$.bfd.guide.table = new FormTable();
	$.bfd.guide.tree = new FormTree();
	$.bfd.guide.button = new FormButton();
	$.bfd.guide.script = new FormScript();
	$.bfd.guide.dialog = new FormDialog();

}(jQuery, window));