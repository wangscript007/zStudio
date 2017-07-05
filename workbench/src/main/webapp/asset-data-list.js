

$(document).ready(function(){
	if(avalon && avalon.scan) {
		avalon.scan();
	}
	if (typeof(eval("window." + "pageDocumentReadyBefore")) === "function") {
		applyFunc("pageDocumentReadyBefore", [])
	}
	if(typeof $('div[type="m_switch"]').initializtionSwitch === 'function') {
		$('div[type="m_switch"]').initializtionSwitch('setSwitchValue');
	}
	if (typeof(eval("window." + "pageDocumentReadyAfter")) === "function") {
		applyFunc("pageDocumentReadyAfter", [])
	}
});


