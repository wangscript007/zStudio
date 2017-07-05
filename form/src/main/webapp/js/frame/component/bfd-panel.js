/**
 * Created by 10177027 on 2016/9/23.
 */
;(function($,win) {
    var BfdPanelPlugin = function (rootContainer) {
        this.rootContainer = rootContainer;
    }

    /**
     * 保存前组件属性设置
     * */
    BfdPanelPlugin.prototype.clean = function () {
        var that = this;
        $(this.rootContainer).find("[type=bfd_panel] .bfd-panel-body").each(function (index, item) {
            that.destroyScroolBar(item);
        })
    }

    /**
     * 保存后组件属性还原
     * */
    BfdPanelPlugin.prototype.restore = function () {
        var that = this;
        $(this.rootContainer).find("[type=bfd_panel] .bfd-panel-body").each(function (index, item) {
            that.initScroolBar(item);
        })
    }

    /**
     * 初始化panel
     * */
    BfdPanelPlugin.prototype.init = function () {
        var that = this;
        $(this.rootContainer).find("[type=bfd_panel] .bfd-panel-body").each(function (index, item) {
            /**
             * 删除滚动条
             * */
            that.destroyScroolBar(item);

            /**
             * 初始化滚动条
             * */
            that.initScroolBar(item);
        })
    }

    /**
     * 初始化组件滚动条
     * */
    BfdPanelPlugin.prototype.initScroolBar = function (item) {
        var parent = $(item).parent();
        var panelHeight = $(parent).attr("bfd-panel-height"),
            scrollBarStyle = $(parent).attr("bfd-panel-scrollbar-style");
        if (panelHeight && scrollBarStyle) {
            $(item).mCustomScrollbar({
                setHeight: panelHeight,
                theme: scrollBarStyle
            });
        }
    }

    /**
     * 删除滚动条
     * */
    BfdPanelPlugin.prototype.destroyScroolBar = function (item) {
        $(item).mCustomScrollbar("destroy").css("height","");
    }

    $.fn.bfdPanel = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {

            var $this = $(this),
                data = $this.data('bfd.panel'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (!data) {
                    $this.data('bfd.panel', (data = new BfdPanelPlugin(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('bfd.panel');
                }
            }
        });

        return typeof value === 'undefined' ? this : value;
    }

}(jQuery,window))