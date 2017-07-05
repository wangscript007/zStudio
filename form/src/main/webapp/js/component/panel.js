/**
 * Created by 10177027 on 2016/9/21.
 */

;(function($) {
    'use strict';


    /**
     * 面板组件构造函数
     * */
    var Panel = function (el, options) {
        this.$el = el;
        this.options = options;
        this.rootContainer = "body";
        this.positionsKey = 'bfd-panel-positions_' + location.pathname;
        this.init();
    }


    /**
     * 初始化面板组件
     * */
    Panel.prototype.init = function () {
        this.initEvent();
        this.initScrollBar();
        this.initSortable();
        this.initPanelPosition();
    }


    /**
     * 获取组件缓存位置
     * */
    Panel.prototype.getPanelPositionStorage = function () {
        return storage.get(this.positionsKey);
    }


    /**
     * 设置组件位置缓存
     * */
    Panel.prototype.setPanelPositionStorage = function () {
        var grids = $(this.rootContainer).find(".column");
        var gridsArr = {};

        // Find present panels
        grids.each(function (index, ele) {
            var panels = $(ele).children();
            var panelArr = [];

            panels.each(function (i, e) {
                var panelID = $(e).attr('compid');
                panelArr.push(panelID);
            });

            gridsArr[$(ele).attr('grid-id')] = panelArr;
        });

        var storageInfo = {length: grids.length, data: gridsArr};
        storage.put(this.positionsKey, JSON.stringify(storageInfo));
    }


    /**
     * 设置组件位置
     * */
    Panel.prototype.initPanelPosition = function () {
        var panelGrids = $(this.rootContainer).find(".column");
        $.each(panelGrids, function (index, ele) {
            $(ele).attr('grid-id', 'grid-' + index);
        })

        /**
         * 初次加载无缓存时，不设置面板位置
         * */
        var localPositions = this.getPanelPositionStorage();
        if (!localPositions) {
            return;
        }

        /**
         * 页面内容变化后，之前的缓存失效。
         * */
        var parsePosition = JSON.parse(localPositions);
        if (parsePosition.length !== panelGrids.length) {
            return;
        }

        for (var key in parsePosition.data) {
            var rowID = $('[grid-id=' + key + ']');

            $.each(parsePosition.data[key], function (index, ele) {
                $('[compid=' + ele + "]").appendTo(rowID);
            });
        }

        $.each(panelGrids, function (index, ele) {
            if($(ele).children().length === 0){
                $(ele).css("height","5px");
            }
        })
    }


    /**
     * 注册事件
     * */
    Panel.prototype.initEvent = function () {
        var that = this;

        $("body").off('click', '.bfd-panel-default-controls > a')
            .on('click', '.bfd-panel-default-controls > a', function (e) {
                e.preventDefault();
                that.eventHandler.call(this, that.options);
            });
    }


    /**
     * 组件排序
     * */
    Panel.prototype.initSortable = function () {
        var that = this,
            $originalContainer,
            $originalVM;

        $(this.rootContainer).find(".bfd-panel").parent().sortable({
            items: $(this.rootContainer).find('.bfd-panel.bfd-panel-sortable'),
            connectWith: ".column",
            cursor: 'default',
            revert: 250,
            handle: '.bfd-panel-heading',
            opacity: 1,
            delay: 100,
            tolerance: "pointer",
            scroll: true,
            placeholder: 'bfd-panel-placeholder',
            forcePlaceholderSize: true,
            forceHelperSize: true,
            dropOnEmpty: true,
            start: function (e, ui) {
                $('body').addClass('ui-drag-active');
                ui.placeholder.height(ui.helper.outerHeight() - 4);

                /**
                 * 拖动开始时在原容器定义标记对象，当不满足条件时在此标记对象后插入拖动对象。
                 * */
                var originalContainernxt = "originalContainernxt" + getCurrentTime();
                $(ui.item).after('<div class="' + originalContainernxt + '"></div>');
                $originalContainer = $(ui.item).parent().find("." + originalContainernxt);

                $originalVM = $(ui.item).attr("avalonctrl");
                if (!$originalVM) {
                    $originalVM = $(ui.item).parents("[avalonctrl]:first").attr("avalonctrl");
                }
            },
            stop: function (event, ui) {
                var updateStorage = true;

                /**
                 * 当拖动对象不是vm模型时，只能在本容器中拖动。
                 * */
                var $currentVM = $(ui.item).attr("avalonctrl");
                if (!$currentVM) {
                    $currentVM = $(ui.item).parents("[avalonctrl]:first").attr("avalonctrl");
                    if ($currentVM !== $originalVM) {
                        setTimeout(function () {
                            $originalContainer.after($(ui.item));
                            $originalContainer.remove();
                        }, 10);

                        updateStorage = false;
                    }
                }


                /**
                 * 更新页面缓存
                 * */
                if (updateStorage) {
                    that.setPanelPositionStorage();
                    if ($originalContainer.parent().children().length === 1) {
                        $originalContainer.parent().height(5);
                    } else {
                        $(ui.item).parent().css("height", "");
                    }

                    $originalContainer.remove();
                }


                $('body').removeClass('ui-drag-active');
            }
        });
    }


    /**
     * 事件句柄
     * */
    Panel.prototype.eventHandler = function (e) {
        var $btn = $(this),
            $bfdPanel = $(this).parents(".bfd-panel:first");

        /**
         * 最小化
         * */
        if ($btn.attr("id") === "btnCollapse") {
            $btn.toggleClass("glyphicon-plus")
                .toggleClass("glyphicon-minus");

            $bfdPanel.children(".bfd-panel-body").slideToggle("fast", function () {
                return;//todo 缓存
            })
        }


        /**
         * 删除面板组件
         * */
        if ($btn.hasClass("glyphicon-remove")) {
            bootbox.confirm("确认要删除吗?", function (e) {
                if (e) {
                    setTimeout(function () {
                        $bfdPanel.addClass('bfd-panel-removed').hide();
                    }, 200);
                }
            });
        }

    }


    /**
     * 初始化滚动条
     * */
    Panel.prototype.initScrollBar = function () {
        var panels = $(this.rootContainer).find(".bfd-panel");
        $.each(panels, function (index, item) {
            var panelHeight = $(item).attr("bfd-panel-height"),
                scrollBarStyle = $(item).attr("bfd-panel-scrollbar-style");
            if (panelHeight && scrollBarStyle) {
                $(item).children(".bfd-panel-body").mCustomScrollbar({
                    setHeight: panelHeight,
                    theme: scrollBarStyle
                });
            }
        })
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
                    $this.data('bfd.panel', (data = new Panel(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('bfd.panel');
                }
            }

            if (!data) {
                $this.data('bfd.panel', (data = new Panel(this)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    }

    /**
     * 初始化面板组件
     * */

    $(document).ready(function(){
        if ($(".bfd-panel").length > 0) {
            $(".container").bfdPanel();
        }
    })

}(jQuery))