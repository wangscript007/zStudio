
function DesignFileInfo(runtimeReference) {
	this.meta = 	'    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
					'    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
	this.csses = runtimeReference.getCSS();
	this.jses = runtimeReference.getJS();

	/*
	this.jscode = "var runtimeConfig = " + JSON.stringify(runtimeConfig);
	this.jsdoccode = "$(document).ready(function(){\n" +
		"var workset = window.runtime.workset.DataVisual();\n" +
		"workset.showChart(runtimeConfig);\n" +
		"})\n";
		*/
}

DesignFileInfo.prototype.getHtmlObject = function(designFileContent, runtimeHtml) {
	return {
		"frameContent" : designFileContent,
		"meta": this.meta,
		"titile": "",
		"css" : this.csses,
		"js": this.jses,
		"body": runtimeHtml,
		"jscode": "",
		"jsdoccode": ""
	};
};

/**
 * 获取js对象
 * @returns {Array}

DesignFileInfo.prototype.getJsObject = function() {
	var jses = new Array();//{jspath:'', jscode:''};
	$.each($(".footer-bg").find("div[type='jsscript']"), function(index, item) {
		var jscode = '';
		if($(item).attr("jsscript") != undefined) {
			jscode = decodeURIComponent($(item).attr("jsscript")) + "\n";
		}
		var jspath = '';
		if($(item).attr("jspath") != undefined) {
			jspath = escape2Html(decodeURIComponent($(item).attr("jspath")));
		}
		var jsdoccode = '';
		if($(item).attr("jsdoccode") != undefined) {
			jsdoccode = escape2Html(decodeURIComponent($(item).attr("jsdoccode")) + "\n");
		}
		jses.push({jspath: jspath, jscode: jscode,jsdoccode:jsdoccode});
	});
	return jses;
}
 */

