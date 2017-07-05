(function($, win) {
	var hostname = window.location.hostname;
	var workbench_Url = 'http://' + hostname + ':8080/workbench/';
	
	if (hostname.indexOf('.com') > -1) {
		workbench_Url = 'http://wb.51ksy.com/workbench/';
	}
	
	function getHtmlFileName(designFileName) {
		if (designFileName && designFileName.indexOf("&pname=") > -1) {
			designFileName = designFileName.substr(0, designFileName.indexOf("&pname="));
		}
		return designFileName;
	}
	
	var KEEP_INTERVAL_MS = 5 * 60 * 1000;
	
	var DesignerLock = function () {
		
	};

	DesignerLock.prototype._requireLock = function(filename) {
		filename = getHtmlFileName(filename);
		
		/////////////
		var result = null;
		$.ajax({
			type: "GET",
			url: workbench_Url + 'lock/require?formUrl=' + filename,
			contentType :'application/json; charset=UTF-8',
			async: false,
			dataType: 'json',
			success: function (data, textStatus) {
				result = data;
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				result = {status : 0, message: '您的会话可能已失效，当前文件无法保存，请重新登录'}
			}
		});
		
		return result;
	}
	
	DesignerLock.prototype._releaseLock = function() {
		this._handleInvalidLock();
		
		var filename = this.lockingFileName;
		if (!filename) {
			return;
		}
		
		this.lockingFileName = "";
		filename = getHtmlFileName(filename);
		
		/////////////
		$.ajax({
			type: "GET",
			url: workbench_Url + 'lock/release?formUrl=' + filename,
			contentType :'application/json; charset=UTF-8',
			async: false,
			dataType: 'json',
			success: function (data, textStatus) {
				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			}
		});
	}
	
	DesignerLock.prototype._keepLock = function() {
		if (!this.hasLock) {
			return;
		}
		
		var filename = getHtmlFileName(this.lockingFileName);
		
		/////////////
		var that = this;
		$.ajax({
			type: "GET",
			url: workbench_Url + 'lock/keep?formUrl=' + filename,
			contentType :'application/json; charset=UTF-8',
			async: true,
			dataType: 'json',
			success: function (data, textStatus) {
				if (data.status != 1) {
					that._handleInvalidLock();
					alert(data.message);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				// 可能发生在workbench重启后，会话失效，workbench会发出重定向到登录页面的命令，
				// 重定向得到的html导致json解析错误，进入此方法
				
				that._handleInvalidLock();
				
				alert('您的会话已失效，请重新登录');
			}
		});
	};
	
	DesignerLock.prototype._handleInvalidLock = function() {
		this.hasLock = false;
		
		// TODO 锁过期/会话失效，禁用保存、预览等会修改设计文件的功能
		$("#button-share-modal").attr('disabled', 'true');
		$("#button-preview").attr('disabled', 'true');
		
		// 停止心跳
		clearInterval(this.keepTimerId);
	};
	
	DesignerLock.prototype._startKeepingLock = function(filename) {
		this.lockingFileName = filename;
		
		// 获取成功，添加心跳更新锁的时间戳
		this.hasLock = true;
		var that = this;
		this.keepTimerId = setInterval(function() {
			that._keepLock();
		}, KEEP_INTERVAL_MS);
	};
	
	win.DesignerLock = new DesignerLock();
	
	$(window).bind('beforeunload', function() {
		window.DesignerLock._releaseLock();
	});
}(jQuery, window));