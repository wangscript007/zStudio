/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {
    var ID = "IWorkset";

    var IWorkset = function() {
    };

    /**
     * api
     */
    IWorkset.prototype.init = function() {

    };

    /**
     * api
     */
    IWorkset.prototype.onInitFrame = function() {

    };

    /**
     * api
     */
    IWorkset.prototype.getSaveData = function() {
        return {
            worksetId: ID,
            data: ""
        }
    };

    win.workbench = win.workbench || {};
    win.workbench.workset = win.workbench.workset || {};
    win.workbench.workset.IWorkset = win.workbench.workset.IWorkset || function () {
            return new IWorkset();
        };
}(jQuery, window));