/**
 * Created by 10089289 on 2016/5/11.
 */
;(function($) {
    var ValueProp = function(currentObject) {
        this.currentObject = currentObject;
        this.id = "input_text_" + new Date().getTime();
    };

    ValueProp.prototype.getShowName = function() {
        return "ÏÔÊ¾ÎÄ±¾";
    };

    ValueProp.prototype.getHtml = function(value) {
        var $html = $('<input type="text" class="form-textbox form-textbox-text col-md-12" id="'+this.id+'" value="'+value+'">');
        var that = this;
        $html.on('input', function () {
            var val = $("#" + that.id).val();
            that.currentObject.attr("defaultvalue", val);
            that.currentObject.find('label').text(val);
        });
        return $html;
    };

    ValueProp._event = function (that) {

    };

    var Label = function (element, options) {
        this.options = options;
        this.element = $(element);
        this.init();
    };


    Label.DEFAULT_OPTIONS = {
        id:'',
        name:'',
        value:'def_value',
        alignStyle:'layout-align-left',
        i18n:'',
    };
    Label.prototype.init = function() {
        this.element.append('<label class="control-label" id="'+this.options.id+'" name="'+this.options.name+'" i18nkey="'+this.options.i18n+'">'+this.options.value+'</label>');
    }

    Label.prototype.properties = function() {
        return [new ValueProp(this.element)];
    };

    var allowedMethods = ['properties'];

    $.fn.label = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('iui.label'),
                options = $.extend({}, Label.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + option);
                }

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);
            }

            if (!data) {
                $this.data('iui.label', (data = new Label(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.label.Constructor = Label;
    $.fn.label.defaults = Label.DEFAULT_OPTIONS;
    $.fn.label.methods = allowedMethods;

    $(function () {
        $('[data-type="label"]').label();
    });

})(jQuery);

