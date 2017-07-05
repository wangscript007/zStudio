
(function($, win) {

	var ComponentWrapper = function(pluginId, option) {
		this.wrapperId = _.uniqueId("compwrapper_");

		this.component = datavisual.pluginManager.getPluginInstanceById(pluginId, option);
		this.component.setComponentWrapper(this);

		this.childrenWrapper = [];
		this.parentWrapper = null;

		if (option) {
			this.parentContainerId = option.parentContainerId;
		}
	};

	// private method

	/**
	 * @private
	 */
	ComponentWrapper.prototype._showControlPanel = function() {
		//清除之前的控制面板内容，并设置新选择的插件的控制面板html内容
		var html = this.component.getControlPanel();
		if (html == null || html == undefined ||
			(typeof html == 'string' && html == '')) {
			var tip = '<div class="alert alert-info" role="alert" style="margin:10px 10px; text-align:center;">当前选中组件不支持拖拽设置</div>';
			window.workbench.ui.UIManager.setControlPanelContent(tip);
		} else {
			window.workbench.ui.UIManager.setControlPanelContent(html);
			this.component.onControlPanelDrawn();
		}
	};

	/**
	 * @private
	 */
	ComponentWrapper.prototype._showEastTabs = function () {
		window.workbench.ui.UIManager.removeAllEastTab();

		var tabs = this.component.getEastTabs();
		window.workbench.ui.UIManager.addEastTab(tabs);
	};

	// public method

	ComponentWrapper.prototype.getDesignHtml = function() {
		if (this.$wrapper) {
			return this.$wrapper;
		}

		// 构造设计界面中，组件选中时候的红色提示边框，以及右上角的删除按钮
		var html = [];
		html.push('<div class="comp-wrapper">');
		html.push('	<a href="#close" class="remove label label-danger"><i class="glyphicon-remove glyphicon"></i> </a>');
		html.push('	<div class="comp-wrapper-container">');
		html.push('	</div>');
		html.push('</div>');
		this.$wrapper = $(html.join(""));

		var compHtml = this.component.getDesignHtml();
		if (typeof compHtml == 'string') {
			compHtml = $(compHtml);
		}
		this.$wrapperContainer = this.$wrapper.find("div.comp-wrapper-container");
		this.$wrapperContainer.append(compHtml);
		this.$wrapperRemove = this.$wrapper.find("a.remove");

		var that = this;
		this.$wrapper.on("click", function(e) {
			$(".form-component_active").removeClass("form-component_active");
			$(this).addClass("form-component_active");

			$(".showRemove").removeClass("showRemove");
			that.$wrapperRemove.addClass("showRemove");

			window.datavisual.pluginManager.setActiveComponentWrapper(that);

			// 显示组件的控制面板内容
			that._showControlPanel();
			// 显示组件的右侧设置tab面板的内容
			that._showEastTabs();

			e.stopPropagation();
		});

		this.$wrapperRemove.on("click", function(e) {
			bootbox.confirm("确认要删除当前组件吗？", function(result) {
				if(result) {
					var parentWrapper = that.getParentWrapper();
					that.removeFromParent();
					that.$wrapper.remove();
					// that.component.dispose();	// TODO 定义组件销毁方法??
					window.datavisual.pluginManager.removeComponentWrapper(that);

					parentWrapper.resize();

					// 由于删除组件处于选中状态，需要清除被删除组件对应的controlPanel和右侧tabPanel的内容
					window.workbench.ui.UIManager.setControlPanelContent("");
					window.workbench.ui.UIManager.removeAllEastTab();
				}
			});
		});

		this.$wrapper.data("component-wrapper", this);

		return this.$wrapper;
	};

	ComponentWrapper.prototype.focus = function () {
		this.$wrapper.trigger("click");
	};

	ComponentWrapper.prototype.resize = function () {
		this.component.resize();
		this.getParentWrapper().resize();
	};

	ComponentWrapper.prototype.redrawActiveComponentWrapperControlPanel = function() {
		this._showControlPanel();
	};

	ComponentWrapper.prototype.redrawActiveComponentWrapper = function() {
		this.component.redraw();
	};

	ComponentWrapper.prototype.redrawSelfAndChildren = function() {
		this.component.redraw();
		this.redrawChildrenWrappers();
	};

	ComponentWrapper.prototype.redrawChildrenWrappers = function() {
		// TODO
		if (this.childrenWrapper && this.childrenWrapper.length > 0) {

			this.childrenWrapper.forEach(function(childWrapper) {
				childWrapper.redrawSelfAndChildren();
			});
		}
	};

	ComponentWrapper.prototype.switchToRuntimeHtml = function() {
		this.insideContainer = this.$wrapperContainer.children().detach();

		if (this.component.outputRuntimeHtmlSameAsDesign()) {
			this.component.handleForRuntimeHtml(this.insideContainer);

			this.insideContainer.insertBefore(this.$wrapper);
			this.runtimeHolder = this.insideContainer;
		} else {
			var compHtml = this.component.getRuntimeHtml();
			if (typeof compHtml == 'string') {
				compHtml = $(compHtml);
			}

			compHtml.insertBefore(this.$wrapper);
			this.runtimeHolder = compHtml;
		}

		this.runtimeHolder.addClass(this.component.getCssClass());

		// 将双引号替换成单引号，避免了双引号被转义成&quot;，方便在生成的html中查看
		var zdataOption = JSON.stringify(this.component.getRuntimeConfig()).replace(/"/g, "'");
		this.runtimeHolder.attr("data-zdata-option", zdataOption);

		this.$wrapper.detach();
	};

	ComponentWrapper.prototype.switchToDesignHtml = function() {
		this.$wrapper.insertBefore(this.runtimeHolder);
		this.runtimeHolder.detach();
		this.$wrapperContainer.append(this.insideContainer);
		this.component.afterHandleForRuntimeHtml(this.insideContainer);
	};

	ComponentWrapper.prototype.getDesignFileContent = function() {
		var config = $.extend({}, this.component.getDesignFileContent());

		if (this.childrenWrapper && this.childrenWrapper.length > 0) {
			config.childrenWrapper = [];

			var icIds = this.component.getInnerContainerIds();
			icIds.forEach(function(icId) {
				var wrappers = $("#" + icId).children(".comp-wrapper");

				for (var i = 0; i < wrappers.length; i++) {
					config.childrenWrapper.push($(wrappers[i]).data("component-wrapper").getDesignFileContent());
				}
			});
		}

		config["parentContainerId"] = this.parentContainerId;

		return config;
	};

	ComponentWrapper.prototype.onComponentDrawn = function() {
		this.component.onComponentDrawn();
		this.focus();
	};

	ComponentWrapper.prototype.insertBefore = function(compWrapper) {
		this.getDesignHtml().insertBefore(compWrapper.getDesignHtml());
		if (this.getParentWrapper()) {
			this.getParentWrapper().resize();
		}

		this.setParentContainerId(compWrapper.getParentContainerId());
		compWrapper.getParentWrapper().pushChild(this);
		compWrapper.getParentWrapper().resize();
	};

	ComponentWrapper.prototype.appendChild = function(childCompWrapper, $droppableComponent) {
		$droppableComponent.append(childCompWrapper.getDesignHtml());
		if (childCompWrapper.getParentWrapper()) {
			childCompWrapper.getParentWrapper().resize();
		}

		childCompWrapper.setParentContainerId($droppableComponent.attr("id"));
		this.pushChild(childCompWrapper);
		this.resize();
	};

	ComponentWrapper.prototype.pushChild = function(childCompWrapper) {
		this.removeChild(childCompWrapper);
		childCompWrapper.removeFromParent();

		this.childrenWrapper.push(childCompWrapper);
		childCompWrapper.setParentWrapper(this);
	};

	ComponentWrapper.prototype.removeChild = function(childCompWrapper) {
		var childWrapperId = "";
		if (typeof childCompWrapper == 'string') {
			childWrapperId = childCompWrapper;
		} else {
			childWrapperId = childCompWrapper.getWrapperId();
		}

		// 查找是否在childrenWrapper中
		var index = -1;
		for (var i = 0; i < this.childrenWrapper.length; i++) {
			if (this.childrenWrapper[i].getWrapperId() == childWrapperId) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			// 移除
			this.childrenWrapper.splice(index, 1);
		}
	};

	ComponentWrapper.prototype.removeFromParent = function() {
		if (this.parentWrapper) {
			this.parentWrapper.removeChild(this);
		}
	};

	ComponentWrapper.prototype.getChildrenWrapper = function () {
		return this.childrenWrapper;
	};

	ComponentWrapper.prototype.setParentWrapper = function(parentWrapper) {
		this.parentWrapper = parentWrapper;
	};

	ComponentWrapper.prototype.getParentWrapper = function() {
		return this.parentWrapper;
	};

	ComponentWrapper.prototype.getWrapperId = function() {
		return this.wrapperId;
	};

	ComponentWrapper.prototype.getParentContainerId = function() {
		return this.parentContainerId;
	};

	ComponentWrapper.prototype.setParentContainerId = function(parentContainerId) {
		this.parentContainerId = parentContainerId;
	};

	ComponentWrapper.prototype.getComponent = function() {
		return this.component;
	};

	win.datavisual = win.datavisual || {};
	win.datavisual.ui = win.datavisual.ui || {};
	win.datavisual.ui.ComponentWrapper = win.datavisual.ui.ComponentWrapper || ComponentWrapper;
}(jQuery, window));


(function($, win) {

	var RootComponentWrapper = function($wrapper) {
		this.wrapperId = _.uniqueId("compwrapper_");

		this.$wrapper = $wrapper;
		this.$wrapper.data("component-wrapper", this);

		this.childrenWrapper = [];
	};

	RootComponentWrapper.prototype.getDesignHtml = function() {
		return this.$wrapper;
	};

	RootComponentWrapper.prototype.getDesignFileContent = function() {
		var config = {
			childrenWrapper: []
		};

		if (this.childrenWrapper) {
			var wrappers = this.$wrapper.children(".comp-wrapper");

			for (var i = 0; i < wrappers.length; i++) {
				config.childrenWrapper.push($(wrappers[i]).data("component-wrapper").getDesignFileContent());
			}
		}

		return config;
	};

	RootComponentWrapper.prototype.resize = function () {
	};

	RootComponentWrapper.prototype.redrawSelfAndChildren = function() {
		this.redrawChildrenWrappers();
	};

	RootComponentWrapper.prototype.redrawChildrenWrappers = function() {
		// TODO
		if (this.childrenWrapper && this.childrenWrapper.length > 0) {

			this.childrenWrapper.forEach(function(childWrapper) {
				childWrapper.redrawSelfAndChildren();
			});
		}
	};

	RootComponentWrapper.prototype.appendChild = function(childCompWrapper, $droppableComponent) {
		$droppableComponent.append(childCompWrapper.getDesignHtml());
		childCompWrapper.setParentContainerId($droppableComponent.attr("id"));
		this.pushChild(childCompWrapper);
	};

	RootComponentWrapper.prototype.pushChild = function(childCompWrapper) {
		this.removeChild(childCompWrapper);
		childCompWrapper.removeFromParent();

		this.childrenWrapper.push(childCompWrapper);
		childCompWrapper.setParentWrapper(this);
	};

	RootComponentWrapper.prototype.removeChild = function(childCompWrapper) {
		var childWrapperId = "";
		if (typeof childCompWrapper == 'string') {
			childWrapperId = childCompWrapper;
		} else {
			childWrapperId = childCompWrapper.getWrapperId();
		}

		// 查找是否在childrenWrapper中
		var index = -1;
		for (var i = 0; i < this.childrenWrapper.length; i++) {
			if (this.childrenWrapper[i].getWrapperId() == childWrapperId) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			// 移除
			this.childrenWrapper.splice(index, 1);
		}
	};

	RootComponentWrapper.prototype.getWrapperId = function() {
		return this.wrapperId;
	};

	win.datavisual = win.datavisual || {};
	win.datavisual.ui = win.datavisual.ui || {};
	win.datavisual.ui.RootComponentWrapper = win.datavisual.ui.RootComponentWrapper || RootComponentWrapper;
}(jQuery, window));
