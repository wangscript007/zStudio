(function($, global) {
	
	function DesignerView() {
		
	}
	
	DesignerView.prototype = {
		init: function() {
			this.eventRegister();
			//this.restoreDesignView();
		},
		eventRegister: function() {
			$(".design-container").sortable({
				opacity: .35,
				connectWith: ".design-container",
				cursorAt: { left: 5 },
				cursor: "move",
				placeholder: 'bfd-placeholder',
				forcePlaceholderSize: true,
				forceHelperSize: true,
				dropOnEmpty: true,
		        start: function (event, ui) {
		            ui.helper.css("width", 100).css("height", 30).css("overflow", "hidden");
		            ui.placeholder.css("height", 30).css("overflow", "hidden");
		        },
		        stop: function (event, ui) {
		        	var target = $(event.target),    //设计区域中的droppable-component html对象
		            draggable = ui.item,    //由draggable的clone得到的dom，是左侧组件缩略图对应的html
		            compName = draggable.data("comp-name"), //组件名称 
		            compType = draggable.data("comp-type"); //组件类型
		        	//从组件视图拖动组件到设计视图
		        	if(compName) {
			            var compWrapper = new global.Component(compName, compType);
			            compWrapper.initComponent(target, draggable);
		        	}
		        	//设计视图内的组件拖动
		        	else {
		        		// 当设计区域内的组件被拖拽重新放置位置时的处理：
		                // 由于dom的append、remove操作等已经由sortable插件完成，所以这里只处理wrapper间的父子关系更新，以及相关
		                // 组件的resize
		                var draggable = ui.item;
		                var droppable = draggable.parent();
		                var droppableId = droppable.attr("id");
		                var fromParent = draggable.data("component-wrapper").getParentWrapper();
		
		                draggable.data("component-wrapper").setParentContainerId(droppableId);
						
						var component = droppable.data("component-wrapper") || droppable.parents(".comp-wrapper").data("component-wrapper");
		                component.pushChild(draggable.data("component-wrapper"));
		                //droppable.data("component-wrapper").redrawSelfAndChildren();
		
		                // 若是同一个布局组件内部的子组件位置变动，则不执行下面的resize，以避免同一个组件被重复的resize
		                /* xh 暂时屏蔽
						if (fromParent != droppable.data("component-wrapper")) {
		                    fromParent.resize();
		                }
		
		                droppable.data("component-wrapper").resize();
		                draggable.data("component-wrapper").trigger("click");
						*/
		        	}
					
					global.designerView.eventRegister();
		        }
		    });
		},
	
		restoreDesignView: function(data) {
	        this.componentWrappers = [];
	        this.rootComponentWrapper = new global.Page($("#design-view"));
	        global.page = this.rootComponentWrapper;
	
	        if (data.baseId) {
	            this.baseId = data.baseId;
	        } else {
	            this.baseId = 1;
	        }
			
	
	        if (data && data.page) {
	            _buildDesignView(this.rootComponentWrapper, data.page.childrenComponent);
	        }
	
	        this.eventRegister();
		},
		
		getDesignFileContent: function() {
			var data = {};
			data["page"] = this.rootComponentWrapper.getDesignFileContent();
			data["baseId"] = this.baseId;

			return JSON.stringify(data);
		},
		
		saveFile: function() {
			var fileData = this.getDesignFileContent();
			
			console.log(fileData);
			
			
			$.ajax({
				type: "POST",
				url: global.contextPath + "designer/file/save?file-name=" + global.designerApp.fileName,
				data: fileData,
				traditional: true,
				contentType :'application/json; charset=UTF-8',
				async: false,
				success: function (data, textStatus) {
					if (showMessage == undefined || showMessage) {
						if (data.data === "success") {
							bootbox.alert('保存成功。');
						} else {
							bootbox.alert('保存失败。');
						}
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					bootbox.alert('保存过程中发生了错误。');
				}
			});
		},
		
		newId: function() {
			this.baseId += 1;
			return "comp_container_" + this.baseId;
		}
	};
	
	global.designerView = new DesignerView();
	
	/*
	$(function() {
		global.designerView.eventRegister();
		global.designerView.restoreDesignView();
		
	});
	*/
	
	function _buildDesignView(componentWrapper, childrenWrapperConfigs) {
        if (childrenWrapperConfigs == undefined || childrenWrapperConfigs == null) {
            return;
        }

        for (var i = 0; i < childrenWrapperConfigs.length; i++) {
            childConfig = $.extend({}, childrenWrapperConfigs[i]);
            // 传给Component的childConfig最终会传给组件的构造函数，
            // childrenWrapper属性由框架管理，这里删除其中的childrenWrapper属性，避免组件误使用
            delete childConfig.childrenComponent;

            var childComponent = new global.Component(childConfig.name, childConfig.type, childConfig);
            childComponent.getDesignHtml();
            childComponent.appendChild(childComponent, $("#" + childComponent.getParentContainerId()));
            //childComponent.onComponentDrawn();

            //datavisual.pluginManager.addComponentWrapper(childComponent);

            if (childrenWrapperConfigs[i].childrenComponent) {
                _buildDesignView(childComponent, childrenWrapperConfigs[i].childrenComponent);
            }
        }
    }
}(jQuery, window));