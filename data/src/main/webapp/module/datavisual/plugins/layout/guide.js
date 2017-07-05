/**
 * Created by 10112872 on 2017/3/20.
 */
(function($, win) {
    var LOCAL_STORAGE_KEY_GUIDE_ATTR = 'guide_data_layout_attr';

    function getGuide(pluginId) {
        var steps = [];

        if (storage.isStorage && !storage.get(LOCAL_STORAGE_KEY_GUIDE_ATTR)) {
            steps.push({
                type: cranberry.TYPE_TIP,
                target: '#zstudio-east-tabs',
                text: '在<span class="guide-highlight">属性</span>中修改组件的设置'
            });

            if (storage.isStorage) {
                storage.put(LOCAL_STORAGE_KEY_GUIDE_ATTR, true);
            }
        }

        return steps;
    }

    win.workbench.ui.GuideManager.register("layout", getGuide);
}(jQuery, window));