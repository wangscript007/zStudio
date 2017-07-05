(function($, global) {
	function Component(name, type, componentConfig) {
		this.wrapperId = _.uniqueId("page_comp_");
		this.name = name;
		this.config = global.componentLoader.getConfig(name);
		this.designerCode = new global.appCompoent[global._tools.getCompClassName(name)]({}, componentConfig); //设计期使用的类
		this.runtimeCode = new global.appCompoent[global._tools.getCompClassName(name) + "R"]; //运行期使用的类
		this.type = type;
		this.childrenWrapper = [];
		this.parentWrapper;
		this.parentContainerId = componentConfig && componentConfig.parentContainerId;
		this.$comp;
	}
	
	Component.prototype = {
		getDesignerCode: function() {
			return this.designerCode;
		},
			
		getRuntimeCode: function() {
			return this.runtimeCode;
		}
	}
	

	// public method

	Component.prototype.initComponent = function(target, item) {
		//组件加载放到initComponent中
        var next = item.next();
        //删除由draggable的clone得到的dom，否则会在界面上显示类似左侧组件缩略图的html
        // remove必须放在此处，否则下面的insertBefore和appendChild时候计算容器高度时，会把ui.item的高度加上去，导致高度不正确
        item.remove();

        if (next.length > 0) {
            // draggable被拖拽到其他的component-wrapper之前的情况下，将新建的component-wrapper插入到该component-wrapper的前面
            this.insertBefore(next.data("component-wrapper"));
        } else {
            // draggable被拖拽到droppable-component容器中其他所有component-wrapper的后面时，
            // 将新建的component-wrapper插入droppable-component容器内部的末尾
			var component = target.data("component-wrapper") || target.parents(".comp-wrapper").data("component-wrapper");
        	component.appendChild(this, target);
        }
	};
	
	Component.prototype.getDesignHtml = function() {
		if (this.$comp) {
			return this.$comp;
		}
		
		// 构造设计界面中，组件选中时候的红色提示边框，以及右上角的删除按钮
		this.$comp = $('<div class="comp-wrapper"></div>');
		var compHtml = this.designerCode.getDesignHtml();
		if (typeof compHtml === 'string') {
			compHtml = $(compHtml);
		}
		this.$comp.append(compHtml);

		var that = this;
		this.$comp.on("click", function(e) {
			$(".form-component_active").removeClass("form-component_active");
			$(this).addClass("form-component_active");
			global.page.setActiveComponent(that);
			global.propertyView.init(that.name, that);
			e.stopPropagation();
		});
		this.$comp.data("component-wrapper", this);
		return this.$comp;
	};

	Component.prototype.focus = function () {
		this.$wrapper.trigger("click");
	};

	Component.prototype.resize = function () {
		// xh 暂时屏蔽
		//this.designerCode.resize();
		//this.getParentWrapper().resize();
	};

	/*
	// xh 暂时屏蔽，看后面怎么设计
	
	Component.prototype.redrawActiveComponentControlPanel = function() {
		this._showControlPanel();
	};

	Component.prototype.redrawActiveComponent = function() {
		this.component.redraw();
	};
	
	Component.prototype.redrawSelfAndChildren = function() {
		this.component.redraw();
		this.redrawChildrenWrappers();
	};

	Component.prototype.redrawChildrenWrappers = function() {
		if (this.childrenWrapper && this.childrenWrapper.length > 0) {

			this.childrenWrapper.forEach(function(childWrapper) {
				childWrapper.redrawSelfAndChildren();
			});
		}
	};
	*/
	
	/*
	// xh 暂时屏蔽，看后面怎么设计
	
	Component.prototype.switchToRuntimeHtml = function() {
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

	Component.prototype.switchToDesignHtml = function() {
		this.$wrapper.insertBefore(this.runtimeHolder);
		this.runtimeHolder.detach();
		this.$wrapperContainer.append(this.insideContainer);
		this.component.afterHandleForRuntimeHtml(this.insideContainer);
	};
	*/

	Component.prototype.getDesignFileContent = function() {
		var config = $.extend({}, this.designerCode.getDesignFileContent());

		if (this.childrenWrapper && this.childrenWrapper.length > 0) {
			config.childrenComponent = [];

			var icIds = this.designerCode.getInnerContainerIds();
			icIds.forEach(function(icId) {
				var wrappers = $("#" + icId).children(".comp-wrapper");

				for (var i = 0; i < wrappers.length; i++) {
					config.childrenComponent.push($(wrappers[i]).data("component-wrapper").getDesignFileContent());
				}
			});
		}

		config["parentContainerId"] = this.parentContainerId;

		return config;
	};

	Component.prototype.insertBefore = function(compWrapper) {
		this.getDesignHtml().insertBefore(compWrapper.getDesignHtml());
		
		/* xh 暂时屏蔽
		if (this.getParentWrapper()) {
			this.getParentWrapper().resize();
		}
		*/

		this.setParentContainerId(compWrapper.getParentContainerId());
		compWrapper.getParentWrapper().pushChild(this);
		
		//xh 暂时屏蔽
		//compWrapper.getParentWrapper().resize();
	};

	Component.prototype.appendChild = function(childCompWrapper, $droppableComponent) {
		$droppableComponent.append(childCompWrapper.getDesignHtml());
		
		/* xh 暂时屏蔽
		if (childCompWrapper.getParentWrapper()) {
			// 如果该组件是从别的布局容器组件中拖过来的话，在更新该组件的父子关系前，
			// 将其原来的父容器组件的大小resize
			childCompWrapper.getParentWrapper().resize();
		}
		*/

		childCompWrapper.setParentContainerId($droppableComponent.attr("id"));
		this.pushChild(childCompWrapper);
		
		//xh 暂时屏蔽
		//this.resize();
	};

	Component.prototype.pushChild = function(childCompWrapper) {
		this.removeChild(childCompWrapper);
		childCompWrapper.removeFromParent();

		this.childrenWrapper.push(childCompWrapper);
		childCompWrapper.setParentWrapper(this);
	};

	Component.prototype.removeChild = function(childCompWrapper) {
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

	Component.prototype.removeFromParent = function() {
		if (this.parentWrapper) {
			this.parentWrapper.removeChild(this);
		}
	};

	Component.prototype.getChildrenWrapper = function () {
		return this.childrenWrapper;
	};

	Component.prototype.setParentWrapper = function(parentWrapper) {
		this.parentWrapper = parentWrapper;
	};

	Component.prototype.getParentWrapper = function() {
		return this.parentWrapper;
	};

	Component.prototype.getWrapperId = function() {
		return this.wrapperId;
	};

	Component.prototype.getParentContainerId = function() {
		return this.parentContainerId;
	};

	Component.prototype.setParentContainerId = function(parentContainerId) {
		this.parentContainerId = parentContainerId;
	};

	//xh 暂时屏蔽
	/*
	Component.prototype.getComponent = function() {
		return this.component;
	};
	*/
	
	
	global.Component = Component;
}(jQuery, window));