function ReferenceManage(){		
	this.data = (function($){
		var result;
		$.ajax({
				async: false,
				cache: false,
				type: "GET",
				dataType: "json",								
				url: "js/frame/referenceConfig.json",
				success: function (data) {
					result = data;
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log("请求服务错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
				}
			}
		);
		return result;
		
	})(jQuery);
}
ReferenceManage.prototype = {
	getJS:function(){
		var that = this;
		if(!that.data){
			return [];
		}
		
		var result = new Map();
		var components = this.getComponentTypes();
		$.each(components,function(index,item){
			if(!that.data[item]){
				return;	
			}
			
			var jses = that.data[item].js;
			if(jses && jses.length > 0){
				$.each(jses,function(subIndex,subItem){
					result.put(subItem,subItem);
				})	
			}
		})
		
		return result.keySet();
	},
	getCSS:function(){
		var that = this;
		if(!that.data){
			return [];
		}
		
		var result = new Map();
		var components = this.getComponentTypes();
		$.each(components,function(index,item){
			if(!that.data[item]){
				return;	
			}
			
			var csses = that.data[item].css;
			if(csses && csses.length > 0){
				$.each(csses,function(subIndex,subItem){
					result.put(subItem,subItem);
				})	
			}
		})
		
		return result.keySet();
	},
	getComponentTypes:function(){
		var componentTypes = new Map();
		componentTypes.put("base","base");
		$("#container_data div[type]").each(function(index,item){
			var type = $(item).attr("type");
			componentTypes.put(type,type);
		});		
		componentTypes.put("base_end","base_end");
		return componentTypes.keySet();
	}		
} 