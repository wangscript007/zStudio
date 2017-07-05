(function($, global) {
	
	function ComponentView() {
		
	};

	ComponentView.prototype = {
		init: function() {
			this.loadViewGroup();
			this.loadComponents();
			this.eventRegister();
		},
		
		loadViewGroup : function() {
			var html = [];
			$.each(global.componentGroup, function(index, item) {
				html.push('<div id="'+item.id+'" class="form-panel">');
				html.push('  <div class="title"><em class="glyphicon glyphicon-th-large icon1"></em> <span>'+item.name+'</span></div>');
				html.push('  <div class="body"></div>');
				html.push('</div>');
			});
			$('.comp-view .form-panel:first').append(html.join(' '));
		},
		
		loadComponents : function() {
			$.each(global.components, function (index, item) {
				//var config = item;	//.config,
	        	var base = item.attribute.base,
					name = item.id,
					iconPath = '';
	        	if(global.config.product === global._tools.PRODUCT_KSY) {
	        		iconPath = global.contextPath + 'app/ksy/asset/icon/';
	        	}
	        	
	        	var location = $('#' + base.group + ' .body'),
	        	html = ['<div class="preview" data-comp-name="'+name+'">',
	        	'    <div class="img-left"><img src="'+iconPath + base.icon +'"></div>' + base.name,
	        	'</div>'];
	        	location.append(html.join(' '));
			});
		},
		
		eventRegister : function() {
			// 注册组件缩略图的拖拽事件
	        $('.comp-view').find(".preview").draggable({
	            connectToSortable: ".design-container",
	            helper: "clone",
	            cursor: "move",
	            cursorAt: {left: 5, top: 5},
	            start: function (event, ui) {
	                // 修改helper的width、height，避免出现placeholder同时出现在两个droppable-component中的bug
	                ui.helper.removeClass("preview").css("width", 30).css("height", 30).css("overflow", "hidden").css("border", "1px solid red");
	            },
	            drag: function (e, t) {
	                //t.helper.width(100);
	            },
	            stop: function (e, t) {
	            }
	        });

	        // 注册组件分组面板的收缩展开事件
	        $('.comp-view').find(".title").off('click').on('click', function () {
	            var $this = $(this);
	            $this.next().slideToggle("normal");
	        });
		}
	};
	global.componentView = new ComponentView();
	
	/*
	$(function() {
		global.componentView.loadViewGroup();
		global.componentView.loadComponents();
		global.componentView.eventRegister();
	});
	*/
}(jQuery, window));