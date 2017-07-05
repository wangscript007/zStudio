/**
 * Created by 10112872 on 2017/3/20.
 */
(function($, win) {
    var LOCAL_STORAGE_KEY_GUIDE_DS = 'guide_data_chart_ds';
    var LOCAL_STORAGE_KEY_GUIDE_ATTR = 'guide_data_chart_attr';

    function _getDimMetricRegion() {
        if ($('.data-dimension').length == 0 || $('.data-metric') == 0) {
            return null;
        }

        var dim = $('.data-dimension').parent();
        var metr = $('.data-metric').parent();

        var t = dim.offset().top;
        var l = dim.offset().left;

        var w = dim.outerWidth();
        var h = dim.outerHeight() + metr.outerHeight();

        return {
            x : l,
            y : t,
            width : w,
            height: h
        }
    }

    function getGuide(pluginId) {
        var steps = [];
        if (storage.isStorage && !storage.get(LOCAL_STORAGE_KEY_GUIDE_DS)) {
            var from_MM = _getDimMetricRegion();
            if (from_MM) {
                steps.push({
                    type: cranberry.TYPE_FROM_TO,
                    from: from_MM,
                    to: "#zstudio-control-panel",
                    text: '把数据模型的<span class="guide-highlight">维度</span>、<span class="guide-highlight">度量</span>拖到这里，设置图表',
                    beforeShow : function () {
                        var li = $('#zstudio-east-tabs ul.tabs li');
                        if (li.length > 0) {
                            $(li[0]).trigger('click');
                        }
                    }

                });
            }

            if (storage.isStorage) {
                storage.put(LOCAL_STORAGE_KEY_GUIDE_DS, true);
            }
        }

        if (storage.isStorage && !storage.get(LOCAL_STORAGE_KEY_GUIDE_ATTR)) {
            steps.push({
                type: cranberry.TYPE_TIP,
                target: '#zstudio-east-tabs',
                text: '切换到<span class="guide-highlight">属性</span>可设置图表样式',
                beforeShow : function () {
                    var li = $('#zstudio-east-tabs ul.tabs li');
                    if (li.length > 1) {
                        $(li[1]).trigger('click');
                    }
                },
                beforeShowNext : function () {
                    var li = $('#zstudio-east-tabs ul.tabs li');
                    if (li.length > 0) {
                        $(li[0]).trigger('click');
                    }
                }
            });

            if (storage.isStorage) {
                storage.put(LOCAL_STORAGE_KEY_GUIDE_ATTR, true);
            }
        }

        return steps;
    }

    win.workbench.ui.GuideManager.register("charts", getGuide);
}(jQuery, window));