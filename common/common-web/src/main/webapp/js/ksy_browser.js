; (function($, window, document) {
    if (!window.browser) {
        var userAgent = navigator.userAgent.toLowerCase(),
        uaMatch;
        window.browser = {}

        /**
         * 判断是否为谷歌浏览器
         */
        if (!uaMatch) {
            uaMatch = userAgent.match(/chrome\/([\d.]+)/);
            if (uaMatch != null) {
                window.browser['name'] = 'chrome';
                window.browser['version'] = uaMatch[1];
            }
        }
        /**
         * 判断是否为火狐浏览器
         */
        if (!uaMatch) {
            uaMatch = userAgent.match(/firefox\/([\d.]+)/);
            if (uaMatch != null) {
                window.browser['name'] = 'firefox';
                window.browser['version'] = uaMatch[1];
            }
        }
    }
    $(document).ready(function() {
        var version = parseInt(browser.version.split(".")[0]),
        subVersion = parseInt(browser.version.split(".")[2]);
        bootbox.setDefaults("locale", "zh_CN");
        if (browser.name != "firefox" && (browser.name == "chrome" && version <= 32)) {
            bootbox.alert("由于当前谷歌浏览器版本与系统有部分兼容问题,请下载推荐浏览器",
            function(result) {
                if (window.location.pathname.indexOf("workbench") > 0) {
                    window.location.href = portal_Url + "browser-validate.html";
                } else {
                    window.location.href = "browser-validate.html";
                }
            });
        }
    });
})(jQuery, window, document);