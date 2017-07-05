;(function($, window, document,undefined){
	var VersionCompatible = function(){};
	VersionCompatible.prototype.getDailog = function(){
			var modalDialog = '<div id="browservalidate" class="modal fade" >';
				  modalDialog += '<div class="modal-dialog" >';
				  modalDialog += '<div class="modal-content">';
				  modalDialog += '<div class="modal-header">';
				  modalDialog += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>';
				  modalDialog += '<h4 class="modal-title">温馨提示</h4>';
				  modalDialog += '</div>';
				  modalDialog += '<div class="modal-body">';
				  modalDialog += '<div id="text" class="text-center" style="font-size:16px"></div>';
				  modalDialog += '</div>';
				  modalDialog += '<div class="modal-footer">';
				  modalDialog += '<button type="button" class="btn btn-primary" onclick="versionCompatible.closeDailog()">确定</button>';
				  modalDialog += '</div>';
				  modalDialog += '</div>';
				  modalDialog += '</div>';
				  modalDialog += '</div>';
			$("body").append(modalDialog);
			var version = parseInt(browser.version.split(".")[0]),
				subVersion = parseInt(browser.version.split(".")[2]),
				hrefAdress = window.location.host + ":80/portal/resources/download/chrome_50.0.2661.102.exe";
			if(browser.name == "chrome" && ((version >53 || version <= 41) || (version === 53 && subVersion > 2747))){
				$("#text").append('<p>由于当前谷歌浏览器版本与系统有部分兼容问题会导致显示或者存储数据有误，为了更好的体验请到<a href=' + hrefAdress + '  style="text-decoration:none;color:blue;cursor:pointer;">本地</a>或者<a href="http://dl.pconline.com.cn/download/503340-1.html" style="text-decoration:none;color:blue;cursor:pointer;">外部</a>链接下载推荐浏览器！</p>');
				$('#browservalidate').modal({
					show: true,
					backdrop: 'static',
					keyboard: false
				});
			}
			
		}
	VersionCompatible.prototype.closeDailog = function(){
				$('#browservalidate').modal('hide');
			}
		window.versionCompatible = new VersionCompatible();
})(jQuery, window, document);