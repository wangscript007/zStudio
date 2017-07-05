/**
 * Created by 10089289 on 2016/9/19.
 */
;(function ($, win) {
    var ButtonGroupPlugin = function(currentComponent) {
        this.children = new win.Map();
        this.currentComponent = $(currentComponent);

    };
    ButtonGroupPlugin.prototype.init = function () {
        var typelay = $(this.currentComponent.parent());
        //工具栏按钮，需要特殊处理
        if(typelay.data('type') === 'toolbar-button') {
            var layout = $(typelay.parent().parent().parent());
            layout.css('min-height', '50px');
            layout.attr('data-toolbar-layout', 'true');
            if(!layout.attr('id')) {
                layout.attr('id', 'groupLayout' + win.getCurrentTime());
            }
        }
    };

    ButtonGroupPlugin.prototype.sizeColor = function (currentComponent) {
        var $comp = $(currentComponent),
            classes = ['btn'];
        if($comp.attr('data-color')) {
            classes.push($comp.attr('data-color'));
        }
        else {
            classes.push('btn-primary');
        }

        var dataSize = $comp.attr('data-size');
        if(dataSize) {
            classes.push(dataSize);
            // if(dataSize === 'btn-lg') {
            //     $comp.parent().parent().parent().css('min-height', '60px');
            // }
            // else {
                 $comp.parent().parent().parent().css('min-height', '50px');
            // }
        }
        $comp.children().removeClass().addClass(classes.join(' '));
    };

    ButtonGroupPlugin.prototype.clean = function () {
        var that = this,
            toolbarLayout = $(".demo").find('div[data-toolbar-layout="true"]');

        //toolbar
        that.children = new win.Map();
        $.each(toolbarLayout, function (index, item) {
            var $item = $(item),
                lastChildId = $item.parent().children('div[data-toolbar-layout="true"]:last').attr('id'),
                floatHtml = '';

            if(!$item.find('button')[0]) {
                return true;
            }

            if($item.parent().children('div[data-toolbar-layout="true"]').length > 1 && lastChildId === $item.attr('id')) {
                floatHtml = ' style="float:right;" ';
            }

            //先缓存下来
            that.children.put($item.attr('id'), $item.children());
            var groups = ['<div class="btn-toolbar" role="toolbar"' + floatHtml +'><div class="btn-group">'];
            //button
            $.each($item.find('button'), function (index2, item2) {
                var $item2 = $(item2),
                    isSplit = $item2.parent().attr('data-split') === 'true';

                groups.push(item2.outerHTML);
                if(isSplit) {
                    groups.push('</div><div class="btn-group">')
                }
            });
            groups.push('</div></div>');                      
            $item.empty().append(groups.join(" "));            
        });
    };

    ButtonGroupPlugin.prototype.restore = function () {
        var that = this,
            keys = that.children.keySet();
        $.each(keys, function (index, item) {
            $("#"+item).empty().append(that.children.get(item));            
        });
    };


    $.fn.btnGroup = function(option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {

            var $this = $(this),
                data = $this.data('iui.btn.group'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (!data) {
                    $this.data('iui.btn.group', (data = new ButtonGroupPlugin(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('iui.btn.group');
                }
            }
        });
        return typeof value === 'undefined' ? this : value;
    }
})(jQuery, window);