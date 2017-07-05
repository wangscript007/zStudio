/**
 * Created by 10089289 on 2016/5/31.
 * 标题栏组件js
 */

;(function($, win) {
    var PageNavigation = function(currentComponent) {
        this.currentComponent = $(currentComponent);
        this.initUI();
    }

    PageNavigation.prototype.initUI = function () {
        $('.bfd-header-icon-back').empty().append('<span></span>');
        $(".bfd-header-icon-back").bind('click', function () {
            win.history.back();
        });
    }

    $.fn.pageNavigation = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('page.navigation'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('page.navigation');
                }
            }

            if (!data) {
                $this.data('page.navigation', (data = new PageNavigation(this)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $(function () {
        if(location.pathname === '/designer/index-m.html') {
            return;
        }
        $('div[type="m_header"]').pageNavigation();
    });

})(jQuery, window);
