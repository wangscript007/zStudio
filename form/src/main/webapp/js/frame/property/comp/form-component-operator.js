/**
 * 设计器组件操作属性定义
 */

;(function($, win) {
	var FormComponentOperator = function() {
		this.selectedComp = ".form-component_active";
		this.formCompOperator = ".form-component-operator";
	};

	FormComponentOperator.OPERATOR = {
		"add-comp": {
			title: "添加",
			class: "add-comp",
			icon: "glyphicon glyphicon-plus-sign"
		},
		"delete-comp": {
			title: "删除",
			class: "delete-comp",
			icon: "glyphicon glyphicon-minus-sign"
		}
	};

	FormComponentOperator.prototype = {

		/**
		 * 操作面板组装
		 * @return {[type]} [description]
		 */
		_getHtml: function() {
			var html = [];

			html.push('<div class="form-component-operator" >');
			$.each(FormComponentOperator.OPERATOR, function(key, value) {
				html.push('<a class="' + value.class + '" title="' + value.title + '">');
				html.push('<i class="' + value.icon + '"></i></a>');
			});
			html.push("</div>");

			return html.join(" ");
		},


		/**
		 * 绑定操作事件
		 * @return {[type]} [description]
		 */
		_registerEvent: function() {
			var that = this;
			$(this.formCompOperator).unbind("click").on("click", ".delete-comp", function(e) {
					e.preventDefault();
					e.stopPropagation();

					bootbox.confirm("确认要删除当前组件吗？", function(result) {
						if (result) {
							var currentObject = $(that.selectedComp),
								parentObject = currentObject.parent().parent();							

							currentObject.parent().remove();
							layoutResize(parentObject);

							$(".form-layout-east .properties .form-panel-body").empty();
							if (!$(".demo .lyrow").length > 0) {
								clearDemo();
							}						
							
							if(parentObject.hasClass('demo')){
								that.hide();
								parentObject=$(".demo .lyrow:first .column:first");								
							}

							parentObject.trigger("click");
						}
					});
				})
				.on("click", ".add-comp", function(e) {
					e.preventDefault();
					e.stopPropagation();

					var newRow = $(that.selectedComp).parents(".lyrow:first").clone();

					$(newRow).find("[id]").each(function(index, item) {
						var container = $(newRow).find("[compid=" + $(item).attr("id") + "]:first");
						if (container && container.length > 0) {
							var id = $(container).attr("type") + getCurrentTime() + index;
							$(container).attr("compid", id).attr("compname", id);
							$(item).attr("id", id).attr("name", id);
						} else if ($(item).attr("type")) {
							var id = $(item).attr("type") + getCurrentTime() + index;
							$(item).attr("id", id).attr("name", id).attr("compid", id).attr("compname", id);
						}
					});

					/**
					 * 清除模型字段信息
					 */
					$.bfd.ViewModel.component.clearChildrenComponentDataField(newRow);
					$.bfd.ViewModel.component.clearMSController(newRow);

					//清除组件选中状态
					$(newRow).find(that.selectedComp).removeClass('form-component_active');

					//添加新行
					$(newRow).insertAfter($(that.selectedComp).parents(".lyrow:first"));

					$(newRow).find(".column:first").trigger('click');

					layoutResize($(newRow).find(".column:first"));

					//界面初始化时绑定sortable事件
					sortableComponent();
				});

		},


		/**
		 * 设置操作面板位置		
		 */
		_resetPosition: function() {
			// var $selectObject = $(this.selectedComp);
			// if (!$selectObject) {
			// 	return;
			// }

			// var left = $selectObject.offset().left,
			// 	top = $selectObject.offset().top,
			// 	width = $selectObject.outerWidth(),
			// 	height = $selectObject.outerHeight();

			// $(this.formCompOperator).css("left", left + width - 45).css("top", top - 20);
		},


		/**
		 * 显示操作面板		  
		 */
		show: function() {								
			var $compOperator = $(this.formCompOperator);
			$compOperator.remove();
			$(this._getHtml()).insertBefore($(this.selectedComp));
			this._registerEvent();
			//$(this.formCompOperator).show();
		},


		/**
		 * 隐藏操作面板
		 * 
		 */
		hide:function(){
			$(this.formCompOperator).hide();
		}
	};

	$.bfd = $.bfd || {};
	$.bfd.formCompOperator = new FormComponentOperator();

}(jQuery, window));