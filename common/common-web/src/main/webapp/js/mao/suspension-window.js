(function($) {
	var _options = {};
	jQuery.fn.suspensionWindow = function(options) {
		var id = $(this).attr("id");
		_options[id] = $.extend({}, $.fn.suspensionWindow.defaults, options);
		var obj = $(this);
		_scroll($(document).scrollTop(),_options[id].scrolltop);
		$(window).scroll( function() {
			_scroll($(document).scrollTop(),_options[id].scrolltop);
		});
		function _scroll(browserScrollTop,customScrollTop){
			addFixed(obj,_options[id]);
		}
	}
	function addFixed(obj,option){
		obj.addClass("divfixed");
		obj.css({"top":option.top,"bottom":option.bottom,"left":option.left,"right":option.right,"opacity":option.opacity});
	}
	function divAny(browserScrollTop,customScrollTop,obj,option){
		if(customScrollTop){
				if(browserScrollTop>customScrollTop){
					obj.removeClass("divabsolute");
					addFixed(obj,option);
				}else if(browserScrollTop<customScrollTop && _options[id].parentid){
					$("#"+_options[id].parentid).css({"position":"relative"});
					obj.addClass("divabsolute");
					obj.css({"top":_options[id].parenttop,"right":_options[id].parentright});
				}else{
					obj.removeClass("divfixed");
				}
			}else{
				addFixed(obj,option);
			}
	}
})(jQuery);