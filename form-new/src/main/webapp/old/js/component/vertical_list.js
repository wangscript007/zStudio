

;(function($) {
    'use strict';


    /**
     * 面板组件构造函数
     * */
    var VerticalList = function (el, options) {
        this.$el = el;
        this.options = options;
        this.init();
    }


    /**
     * 初始化面板组件
     * */
    VerticalList.prototype.init = function () {
        this.initEvent();
    }

    /**
     * 注册事件
     * */
    VerticalList.prototype.initEvent = function () {
        var that = this;

        $("body").off('click', '.verticallist-controls > a')
            .on('click', '.verticallist-controls > a', function (e) {
                e.preventDefault();
                that.eventHandler.call(this, that.options);
            });
    }



    /**
     * 事件句柄
     * */
    VerticalList.prototype.eventHandler = function (e) {
        var $btn = $(this),
            $verticallist = $(this).parents('div[type="vertical_list"]:first');

        /**
         * 最小化
         * */
        if ($btn.attr("id") === "verticallistCollapse") {
            $btn.toggleClass("glyphicon-plus")
                .toggleClass("glyphicon-minus");

            $verticallist.children(".jquery-accordion-menu").slideToggle("fast", function () {
                return;//todo 缓存
            })
        }


    }


    $.fn.verticalList = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('vertical.list'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (!data) {
                    $this.data('vertical.list', (data = new VerticalList(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('vertical.list');
                }
            }

            if (!data) {
                $this.data('vertical.list', (data = new VerticalList(this)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    }

    /**
     * 初始化面板组件
     * */

    $(document).ready(function(){
        if ($(".vertical_list").length > 0) {
            $(".container").verticalList();
        }
    })

}(jQuery))