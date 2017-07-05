$(document).ready(function() {
	//$("body").css("min-height", $(window).height() - 140);
	//$(".demo").css("min-height", $(window).height() - 210);

	window.workbench.worksetManager.loadWorksets();	// 加载工作功能集
	window.workbench.worksetManager.setCurrentActiveWorkset("datavisual");
});