/**
 * Created by 10112872 on 2016/12/02.
 */
(function($, win) {
    var REST_API = function() {
    };

    REST_API.prototype.isProjectDesignFileExists = function(filename) {
        var isExists = false;
        var param = new AjaxParameter();
        param.url = getContextPath() + "/jersey-services/layoutit/frame/html/validate/" + filename + "/";
        param.callBack = function(data) {
            if (data != undefined && data.data) {
                if (data.data != "success") {
                    isExists = true;
                }
            }
        };
        dsTool.saveData(param);
        return isExists;
    };

    REST_API.prototype.createFile = function(filename, callback) {
        var param = new AjaxParameter();
        param.url = getContextPath() + "/jersey-services/layoutit/frame/html/add/" + filename +"/";
        param.data = null;
        if (callback) {
            param.callBack = callback;
        }
        dsTool.saveData(param);
    };

    REST_API.prototype.renameFile = function(oldFilename, newFilename, callback) {
        var param = new AjaxParameter();
        param.url = getContextPath() + "/jersey-services/layoutit/frame/html/update/" + oldFilename + "/" + newFilename +"/";
        param.data = null;
        if (callback) {
            param.callBack = callback;
        }
        dsTool.saveData(param);
    };

    win.workbench = win.workbench || {};
    win.workbench.REST_API = win.workbench.REST_API || new REST_API();
}(jQuery, window));