/**
 * Created by 10089289 on 2016/5/14.
 * 移动端基础插件
 */
;(function($) {
    var MobileComponentPlugin = function(currentComponent) {
        this.currentComponent = $(currentComponent);
        this._updateHtml();
    };
    MobileComponentPlugin.prototype._updateHtml = function () {
        this.currentComponent.parent().parent().remove('class').attr('class','lyrow ui-draggable');
        this.currentComponent.attr('type', 'layout');
        var id = this.currentComponent.attr('compid');
        this.currentComponent.attr('compid', id.replace('m_complex_component', 'vm'));
        var name = this.currentComponent.attr('compname');
        this.currentComponent.attr('compname', name.replace('m_complex_component', 'vm'));
        //区域组件特殊处理
        if(this.currentComponent.find('.box:last .view div[type]').attr('type') == 'chinese_region') {
            var time = getCurrentTime(),
                value = 'chinese_region' + time,
                labelValue = 'label' + time;

            this.currentComponent.find('label').attr('id', labelValue).attr('name', labelValue).parent().attr('compid', labelValue).attr('compname', labelValue);

            this.currentComponent.find("input[name=areacode],input[name=areaname]").each(function(index,item){
                $(this).attr("ms-duplex-string",value+index).attr('compname', value+index);
                $(this).attr("id",value+index);
            });
            this.currentComponent.find('.box:last .view div[type]').attr('compid', value).attr('compname', value);
        }
        else {
            this.currentComponent.find("[id]").each(function(index,item){
                var container = $(item).parent();
                if(container) {
                    var id = $(container).attr("type") + getCurrentTime()+index;
                    $(container).attr("compid", id).attr("compname", id);
                    $(item).attr("id", id).attr("name", id);
                }
            });
        }

        this.currentComponent.trigger("click");
        initFrame();
    };
    $.fn.updateComplexComponent = function() {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('iui.update.complex.component');

            if (!data) {
                $this.data('iui.update.complex.component', (data = new MobileComponentPlugin(this)));
            }
        });
        return typeof value === 'undefined' ? this : value;
    }
})(jQuery);

;(function ($, win) {

    var MobileFrame = function () {

    }
    MobileFrame.prototype.cleanFrame = function () {
        $.productListCleanData();
        $.switchCleanData();
        $.shoppingCartCleanData();
    };
    MobileFrame.prototype.restoreFrame = function () {
        $.shoppingCartRestoreData();
        $.productListRestoreData();
        $.switchRestoreData();
    }

    win.bfdMobile = new MobileFrame();

})(jQuery, window);

$(window).resize(function() {
//    $(".demo_parent").css("min-height", $(window).height() - 160);
});

$(document).ready(function() {
//    $(".demo_parent").css("min-height", $(window).height() - 160);
    $('.box .preview').bind('dblclick', function() {
        var layout = $('.demo .lyrow:first-child .col-md-12:first'),
            component = $(this).parent().clone();
        layout.append(component);
        componentStop(component);
        //重新计算组件所在容器和原容器的高度
        layoutResize($(component).parent());

    });
    $("#zoomin").off('click').on('click', function () {
        var $editParent1 = $('.edit .demo_parent1'),
            pt = $editParent1.css('padding-top').replace('px',''),
            pl = $editParent1.css('padding-left').replace('px',''),
            $demoParent = $('.edit .demo_parent');
        $editParent1.css('padding-top', (parseInt(pt)+6) + 'px').css('padding-bottom', (parseInt(pt)+6) + 'px')
            .css('padding-left', (parseInt(pl)+2) + 'px').css('padding-right', (parseInt(pl)+2) + 'px')
            .css('height', $editParent1.outerHeight() + 50)
            .css('width', $editParent1.outerWidth() + 25);

        $demoParent.css('height', $demoParent.outerHeight() + 40)
            .css('width', $demoParent.outerWidth() + 20);

    });
    $("#zoomout").off('click').on('click', function () {
        var $editParent1 = $('.edit .demo_parent1'),
            pt = $editParent1.css('padding-top').replace('px',''),
            pl = $editParent1.css('padding-left').replace('px',''),
            $demoParent = $('.edit .demo_parent');
        $editParent1.css('padding-top', (parseInt(pt)-6) + 'px').css('padding-bottom', (parseInt(pt)-6) + 'px')
            .css('padding-left', (parseInt(pl)-2) + 'px').css('padding-right', (parseInt(pl)-2) + 'px')
            .css('height', $editParent1.outerHeight() - 50)
            .css('width', $editParent1.outerWidth() - 25);

        $demoParent.css('height', $demoParent.outerHeight() - 40)
            .css('width', $demoParent.outerWidth() - 20);

    });

    $("#reset").off('click').on('click', function () {
        var $editParent1 = $('.edit .demo_parent1'),
            $demoParent = $('.edit .demo_parent');
        $editParent1.css('padding-top', '70px').css('padding-bottom', '70px').css('padding-left', '16px').css('padding-right', '16px').css('height', 650).css('width', 325);
        $demoParent.css('height', 492).css('width', 295);

    });

});

