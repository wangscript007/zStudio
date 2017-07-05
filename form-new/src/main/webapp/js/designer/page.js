;(function($, global) {
	var Page = function($wrapper) {
		this.wrapperId = _.uniqueId("page_comp_");
		this.$wrapper = $wrapper;
		this.$wrapper.data("component-wrapper", this);
		this.childrenWrapper = [];
		this.activeComponent;
	};
	
	Page.prototype = {
		getDesignHtml : function() {
			return this.$wrapper;
		},
		setActiveComponent : function(activeComponent) {
			this.activeComponent = activeComponent;
		},
		getDesignFileContent : function() {
			var config = {
				childrenComponent: []
			};

			if (this.childrenWrapper) {
				var wrappers = this.$wrapper.children(".comp-wrapper");

				for (var i = 0; i < wrappers.length; i++) {
					config.childrenComponent.push($(wrappers[i]).data("component-wrapper").getDesignFileContent());
				}
			}

			return config;
		},
		resize : function () {
		},
		/*
		redrawChildrenWrappers : function() {
			if (this.childrenWrapper && this.childrenWrapper[0]) {

				this.childrenWrapper.forEach(function(childWrapper) {
					childWrapper.redrawSelfAndChildren();
				});
			}
		},
		*/
		appendChild : function(childCompWrapper, $droppableComponent) {
			$droppableComponent.append(childCompWrapper.getDesignHtml());
			childCompWrapper.setParentContainerId($droppableComponent.attr("id"));
			this.pushChild(childCompWrapper);
		},
		pushChild : function(childCompWrapper) {
			this.removeChild(childCompWrapper);
			childCompWrapper.removeFromParent();

			this.childrenWrapper.push(childCompWrapper);
			childCompWrapper.setParentWrapper(this);
		},
		removeChild : function(childCompWrapper) {
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
		},
		getWrapperId : function() {
			return this.wrapperId;
		}
	};
	
	global.Page = Page;
	
}(jQuery, window));