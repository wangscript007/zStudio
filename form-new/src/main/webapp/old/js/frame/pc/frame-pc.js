/**
 * Created by 10089289 on 2016/9/18.
 */
;(function ($, win) {

    /*********pc端框架开始*************************/
    var PcFrame = function () {

    }
    PcFrame.prototype.cleanFrame = function () {
        $('.demo').bfdIframe('clean');
        $(".demo").bfdIcon('clean');
        $(".demo").bfdPanel("clean");
    };
    PcFrame.prototype.restoreFrame = function () {
        $('.demo').bfdIframe('restore');
        $(".demo").bfdIcon('restore');
        $(".demo").bfdPanel("restore");
    }

    win.bfdPc = new PcFrame();
    /*********pc端框架结束*************************/


    /*********按钮组组件*************************/


    var ButtonGroupPlugin = function(currentComponent) {
        this.currentComponent = $(currentComponent);
        this._updateHtml();
    };
    ButtonGroupPlugin.prototype._updateHtml = function () {
        console.log(this.currentComponent);
    };
    $.fn.buttonGroup = function() {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('iui.button.group');

            if (!data) {
                $this.data('iui.button.group', (data = new ButtonGroupPlugin(this)));
            }
        });
        return typeof value === 'undefined' ? this : value;
    }


})(jQuery, window);