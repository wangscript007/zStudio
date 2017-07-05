(function($, global) {
	
	function ToolbarView() {
		
	};

	ToolbarView.prototype = {
		init: function() {
			this.eventRegister();
		},
		
		eventRegister : function() {
			this._registerButtonClickEvent_Save();
		},
		
		_registerButtonClickEvent_Save: function() {
			//保存数据绑定
			$("#btn-save").click(function() {
				global.designerView.saveFile();
			});
		}
	};
	
	global.toolbarView = new ToolbarView();
	
}(jQuery, window));