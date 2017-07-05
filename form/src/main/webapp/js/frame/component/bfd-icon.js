/**
 * Created by 10177027 on 2016/9/22.
 */
;(function(){
    var BfdIconPlugin = function(rootContainer){
        this.root = rootContainer
    }

    /**
     * 保存前组件属性设置
     * */
    BfdIconPlugin.prototype.clean = function() {
        $(this.root).find("[type=bfd_icon][alignstyle]").each(function (index, item) {
            $(item).addClass($(item).attr("alignstyle"));
        })
    }

    /**
     * 保存后组件属性还原
     * */
    BfdIconPlugin.prototype.restore = function(){
        $(this.root).find("[type=bfd_icon][alignstyle]").each(function (index, item) {
            $(item).removeClass($(item).attr("alignstyle"));
        })
    }


    $.fn.bfdIcon = function(option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {

            var $this = $(this),
                data = $this.data('bfd.icon'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (!data) {
                    $this.data('bfd.icon', (data = new BfdIconPlugin(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('bfd.icon');
                }
            }
        });

        return typeof value === 'undefined' ? this : value;
    }
}())