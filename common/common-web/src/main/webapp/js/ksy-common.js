/**
 * Created by 10089289 on 2017/3/2.
 */
;(function ($, win) {
    var hostname = win.location.hostname;
    win.workbench_Url = 'http://' + hostname + ':8080/workbench/';
    win.portal_Url = 'http://' + hostname + "/";
    win.server_Url = 'http://' + hostname + ':9080/server/';
    if(hostname.indexOf('.com')> -1) {
        win.workbench_Url = 'http://wb.51ksy.com/workbench/';
        win.portal_Url = 'http://www.51ksy.com/';
        win.server_Url = 'http://server.51ksy.com/server/';
    }

    win.openOnlineTestPlatform = function(packageName) {
        var currentUserInfo = maoEnvBase.getCurrentUser();
        var url = win.server_Url + 'mock-login.html?username=' + currentUserInfo.username;
        url += '&password=' + ict_framework_func1(currentUserInfo.password);

        if(packageName) {
            url = url + '&packageName=' + encodeURIComponent(packageName)
        }

        window.open(url, '自动登录到在线测试平台');
    }

	
	//演示账号提示信息
	window.TIP_MSG_DEMO_TENANT_LIMITED = '演示账号仅有查看权限。请注册新账号，即可使用完整功能。'
})(jQuery, window);