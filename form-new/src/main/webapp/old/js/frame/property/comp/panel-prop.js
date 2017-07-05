/**
 * Created by 10177027 on 2016/9/21.
 */
;(function($,win) {

    /**
     * ====================================================================
     * 组件高度属性
     * */
    var PanelBodyHeightProp = function (componentObject) {
        this.componentObject = componentObject;
        this.registerEvent();
    }

    PanelBodyHeightProp.prototype = {
        /**
         * 组件属性配置
         * */
        getHtml: function () {
            return '<input type="number" class="form-control bfd-panel-height" ' +
                ' value="' + this._getProperty() +
                '" placeholder="面板高度(px),如：100">';
        },


        /**
         * 设置组件属性
         * */
        registerEvent: function () {
            var $that = this;
            $('.properties .form-panel-body').off("input", ".bfd-panel-height")
                .on('input', '.bfd-panel-height', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $that.componentObject.attr("bfd-panel-height", $(this).val());
                    $($that.componentObject.parent()).bfdPanel("init");
                })
        },


        /**
         * 获取组件属性
         * */
        _getProperty: function () {
            var height = this.componentObject.attr("bfd-panel-height");
            if (!height) {
                height = "";
            }

            return height;
        }

    }


    /**
     * ====================================================================
     * 面板标题栏是否显示
     * */
    var PanelHeadingProp = function (componentObject) {
        this.componentObject = componentObject;
        this.registerEvent();
    }

    PanelHeadingProp.prototype = {
        /**
         * 组件属性配置
         * */
        getHtml: function () {
            return '<input type="checkbox" class="chk-bfd-panel-heading-visible mt12" ' + this._getProperty() + '>';
        },


        /**
         * 设置组件属性
         * */
        registerEvent: function () {
            var $that = this;
            $('.properties .form-panel-body').off("change", ".chk-bfd-panel-heading-visible")
                .on('change', '.chk-bfd-panel-heading-visible', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if ($(this).prop("checked")) {
                        $that.componentObject.attr("bfd-panel-heading", "checked");
                    } else {
                        $that.componentObject.attr("bfd-panel-heading", "unchecked");
                    }

                    $that.componentObject.children(".bfd-panel-heading").slideToggle();
                })
        },


        /**
         * 获取组件属性
         * */
        _getProperty: function () {
            var heading = this.componentObject.attr("bfd-panel-heading");
            if (!heading) {
                heading = "checked";
                this.componentObject.attr("bfd-panel-heading", "checked");
            }

            return heading;
        }
    }


    /**
     * ====================================================================
     * 面板组件是否可拉动
     * */
    var PanelSortableProp = function (componentObject) {
        this.componentObject = componentObject;
        this.registerEvent();
    }

    PanelSortableProp.prototype = {
        /**
         * 组件属性配置
         * */
        getHtml: function () {
            return '<input type="checkbox" class="chk-bfd-panel-sortable mt12" ' + this._getProperty() + '>';
        },


        /**
         * 设置组件属性
         * */
        registerEvent: function () {
            var $that = this;
            $('.properties .form-panel-body').off("change", ".chk-bfd-panel-sortable")
                .on('change', '.chk-bfd-panel-sortable', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    if ($(this).prop("checked")) {
                        $that.componentObject.attr("bfd-panel-sortable", "checked");
                        $that.componentObject.addClass("bfd-panel-sortable");
                    } else {
                        $that.componentObject.attr("bfd-panel-sortable", "unchecked");
                        $that.componentObject.removeClass("bfd-panel-sortable");
                    }
                })
        },


        /**
         * 获取组件属性
         * */
        _getProperty: function () {
            var sortable = this.componentObject.attr("bfd-panel-sortable");
            if (!sortable) {
                sortable = "checked";
                this.componentObject.attr("bfd-panel-sortable", "checked");
                this.componentObject.addClass("bfd-panel-sortable")
            }

            return sortable;
        }
    }



    /**
     * ====================================================================
     * 组件滚动条样式属性
     * */
    var PanelScrollBarStyleProp = function (componentObject) {
        this.componentObject = componentObject;
        this.registerEvent();
    }


    /**
     * 滚动条默认样式
     * */
    PanelScrollBarStyleProp.Style = ["dark","inset-dark","rounded-dark","3d-dark"];


    /**
     * 滚动条样式设置配置
     * */
    PanelScrollBarStyleProp.prototype = {

        /**
         * 获取组件html
         * */
        getHtml: function () {
            var html = ['<select id="scroll_bar_style" class="form-textbox form-textbox-text col-md-12">'],
                selectedStyle = this._getProperty();

            $.each(PanelScrollBarStyleProp.Style, function (index, item) {
                var selected = "";
                if (selectedStyle === item) {
                    selected = "selected";
                }

                html.push('<option value="' + item + '" ' + selected + '>' + item + '</option>');
            })

            html.push("</div>");
            return html.join(" ");
        },


        /**
         * 设置组件属性
         * */
        registerEvent: function () {
            var $that = this;
            $('.properties .form-panel-body').off("change", "#scroll_bar_style")
                .on('change', "#scroll_bar_style", function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $that.componentObject.attr("bfd-panel-scrollbar-style", $(this).val());
                    $($that.componentObject.parent()).bfdPanel("init");
                })
        },


        /**
         * 获取组件属性
         * */
        _getProperty: function () {
            var style = this.componentObject.attr("bfd-panel-scrollbar-style");
            if (!style) {
                style = "dark";
                this.componentObject.attr("bfd-panel-scrollbar-style", style);
            }

            return style;
        }
    }




    /**
     * ====================================================================
     * 面板样式属性
     * */
    var PanelBodyStyleProp = function (componentObject) {
        this.componentObject = componentObject;
        this.registerEvent();
    }

    /**
     * 面板样式
     * */
    PanelBodyStyleProp.Style = {
        default: {},
        panel_alert_top: {
            "bfd-panel": ["bfd-panel-alert", "bfd-panel-border", "top"]
        },
        panel_alert_body: {
            "bfd-panel": ["bfd-panel-alert"],
            "bfd-panel-body": ["fill"],
            "bfd-panel-heading": ["bfd-panel-title"]
        },
        panel_info_top: {
            "bfd-panel": ["bfd-panel-info", "bfd-panel-border", "top"]
        },
        panel_info_body: {
            "bfd-panel": ["bfd-panel-info"],
            "bfd-panel-body": ["fill"],
            "bfd-panel-heading": ["bfd-panel-title"]
        },
        panel_primary_top: {
            "bfd-panel": ["bfd-panel-primary", "bfd-panel-border", "top"]
        },
        panel_primary_body: {
            "bfd-panel": ["bfd-panel-primary"],
            "bfd-panel-body": ["fill"],
            "bfd-panel-heading": ["bfd-panel-title"]
        },
        panel_warning_top: {
            "bfd-panel": ["bfd-panel-warning", "bfd-panel-border", "top"]
        },
        panel_warning_body: {
            "bfd-panel": ["bfd-panel-warning"],
            "bfd-panel-body": ["fill"],
            "bfd-panel-heading": ["bfd-panel-title"]
        },
        panel_danger_top: {
            "bfd-panel": ["bfd-panel-danger", "bfd-panel-border", "top"]
        },
        panel_danger_body: {
            "bfd-panel": ["bfd-panel-danger"],
            "bfd-panel-body": ["fill"],
            "bfd-panel-heading": ["bfd-panel-title"]
        },
        panel_success_top: {
            "bfd-panel": ["bfd-panel-success", "bfd-panel-border", "top"]
        },
        panel_success_body: {
            "bfd-panel": ["bfd-panel-success"],
            "bfd-panel-body": ["fill"],
            "bfd-panel-heading": ["bfd-panel-title"]
        },
        panel_light_info_top: {
            "bfd-panel": ["bfd-panel-light-info", "bfd-panel-border", "top"]
        },
        panel_light_info_body: {
            "bfd-panel": ["bfd-panel-light-info"],
            "bfd-panel-body": ["fill"],
            "bfd-panel-heading": ["bfd-panel-title"]
        }
    };


    /**
     * 面板样式配置
     * */
    PanelBodyStyleProp.prototype = {

        /**
         * 获取组件html
         * */
        getHtml: function () {
            var html = ['<select id="panel_body_style" class="form-textbox form-textbox-text col-md-12">'],
                selectedStyle = this._getProperty();

            $.each(PanelBodyStyleProp.Style, function (index, item) {
                var selected = "";
                if (selectedStyle === index) {
                    selected = "selected";
                }

                html.push('<option value="'+index+'" '+selected+'>'+index+'</option>');
            })

            html.push("</select>");
            return html.join(" ");
        },


        /**
         * 设置组件属性
         * */
        registerEvent: function () {
            var $that = this;
            $('.properties .form-panel-body').off("change", "#panel_body_style")
                .on('change', '#panel_body_style', function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $that.setPanelStyle($(this).val(), $that.componentObject.attr("bfd-panel-body-style"));
                    $that.componentObject.attr("bfd-panel-body-style", $(this).val());
                })
        },


        /**
         * 设置组件样式
         * */
        setPanelStyle:function(selectStyle,oldStyle){
            var that = this;
            /**
             * 删除原有样式
             * */
            var oldStyleObject = PanelBodyStyleProp.Style[oldStyle];
            if(oldStyle && oldStyleObject) {
                $.each(oldStyleObject, function (key, values) {
                    var selectObject = that.componentObject.parent().find("." + key);
                    $.each(values, function (index, item) {
                        $(selectObject).toggleClass(item);
                    })
                })
            }

            /**
             * 添加新新式
             * */
            var newStyleObject = PanelBodyStyleProp.Style[selectStyle];
            if(selectStyle && newStyleObject) {
                $.each(newStyleObject, function (key, values) {
                    var selectObject = that.componentObject.parent().find("." + key);
                    $.each(values, function (index, item) {
                        $(selectObject).toggleClass(item);
                    })
                })
            }
        },

        /**
         * 获取组件属性
         * */
        _getProperty: function () {
            var style = this.componentObject.attr("bfd-panel-body-style");
            if (!style) {
                style = "";
                this.componentObject.attr("bfd-panel-body-style", style);
            }

            return style;
        }
    }


    win.DesignerPropDefine.panel = win.DesignerPropDefine.panel || {};
    /**
     * 面板组件高度属性
     * */
    win.DesignerPropDefine.panel.PanelBodyHeightProp = PanelBodyHeightProp;
    /**
     * 面板组件滚动条样式属性
     * */
    win.DesignerPropDefine.panel.PanelScrollBarStyleProp = PanelScrollBarStyleProp;
    /**
     * 面板组件样式属性
     * */
    win.DesignerPropDefine.panel.PanelBodyStyleProp = PanelBodyStyleProp;
    /**
     * 面板标题栏是否可显示属性
     * */
    win.DesignerPropDefine.panel.PanelHeadingProp = PanelHeadingProp;
    /**
     * 面板是否可拉动属性
     * */
    win.DesignerPropDefine.panel.PanelSortableProp = PanelSortableProp;

}(jQuery,window))