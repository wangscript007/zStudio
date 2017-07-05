(function($, global) {
	
	function ComponentLoader() {
		this.componentsMap = new global.Map();
	}
	
	ComponentLoader.prototype = {
		load : function() {
			var that = this;
	        $.each(global.components, function (index, item) {
	        	that.componentsMap.put(item.id, {config: item.attribute});
	        });
		},
		getConfig : function(id) {
			return this.componentsMap.get(id);
		}
	};
	
	
	global.componentLoader = new ComponentLoader();
	
}(jQuery, window));