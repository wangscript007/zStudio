/**
 * Created by 10089289 on 2016/8/12.
 */
;(function ($, win) {
    function Iframe() {
        this.children = new Map();
    }
    Iframe.prototype.clean = function() {
        var that = this;
        $.each($(".demo").find('iframe'), function(index, item) {
            var $item = $(item),
                parent = $item.parent(),
                ishidden = parent.attr('data-hide-iframe') === 'true' ? true : false;
            if(ishidden) {
                var url = $item.attr('src');
                parent.attr('data-url', url);
                $item.remove();
                that.children.put(parent.attr('compid'), $item);
            }
        });
    }

    Iframe.prototype.restore = function() {
        var that = this;
        $.each($(".demo").find("div[type='iframe']"), function(index, value) {
            var id = $(value).attr("compid"),
                iframe = that.children.get(id);
            if(iframe) {
                $(value).append(iframe);
                that.children.remove(id);
            }
        });
    }

    $.fn.bfdIframe = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
            var $this = $(this),
                data = $this.data('bfd-iframe'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if (!data) {
                    $this.data('bfd-iframe', (data = new Iframe()));
                }
                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('shopping.cart');
                }
            }

            if (!data) {
                $this.data('bfd-iframe', (data = new Iframe()));
            }
        });

        return typeof value === 'undefined' ? this : value;
    }

    $(function() {
        $.each($("div[type='iframe']"), function(index, item) {
            var iframe = $(item).find('iframe'),
                url = $(item).attr('compsrc');

            if(url && !iframe[0]) {
                $(item).dialogLoad(url);
            }
        });
    });
})
(jQuery, window);