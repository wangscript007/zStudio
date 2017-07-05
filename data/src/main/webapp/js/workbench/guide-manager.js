/**
 * Created by 10112872 on 2016/10/20.
 */

(function($, win) {
    var groupId2callbacks = {};

    var GuideManager = {
        register : function (pluginGroupId, callback) {
            groupId2callbacks[pluginGroupId] = callback;
        },

        getSteps: function (pluginGroupId, pluginId) {
            if (!groupId2callbacks[pluginGroupId]) {
                return null;
            }

            return groupId2callbacks[pluginGroupId](pluginId);
        }
    };

    win.workbench = win.workbench || {};
    win.workbench.ui = win.workbench.ui || {};
    win.workbench.ui.GuideManager = win.workbench.ui.GuideManager || GuideManager;
}(jQuery, window));