/**
 * 高级选择插件
 *
 * Created by 10177027 on 2016/10/19.
 *
 */
;(function($,win) {
    var AdvancedSelectPlugin = function (el, options) {
        this.$el = el;
        this.options = options;
        this.bfdDataSetConfig = {};
        this.data = [];
        this.dialogId = "";
        this.shownFunctionBody = {};
        this.submitFunctionBody = {};
        this.operator = viewoperator || "view";

        //组件显示名称
        this.comp_name;
        //组件值
        this.comp_value;
        //组件关闭按钮
        this.comp_close;
        //组件提交按钮
        this.comp_submit;
        this.init();
    }

    AdvancedSelectPlugin.prototype = {
        init: function () {
            this.loadParams();
            this.initData();
            this.bindEvent();
        },


        /**
         * 加载插件参数
         */
        loadParams: function () {
            var config = $(this.$el).attr("bfd-dataset-config");
            if (config) {
                this.bfdDataSetConfig = JSON.parse(decodeURIComponent(config));
            }

            $(this.$el).removeAttr("bfd-dataset-config");
            this.dialogId = $(this.$el).find("[role=dialog]:first").attr("id");
            this.dialog_title = $(this.$el).attr("bfd-dialog-title");
            this.dialog_url = $(this.$el).attr("bfd-dialog-url");
            this.comp_name = $(this.$el).find(".advanced_select_text");
            this.comp_value = $(this.$el).find(".advanced_select_value");
            this.comp_submit = $(this.$el).find(".advanced_select_confirm");
            this.comp_close = $(this.$el).find(".advanced_select_close");
            this.comp_select_button = $(this.$el).find(".advanced_select_button");

            var event = $(this.$el).attr("componentevent");
            if (event) {
                var events = $.parseJSON(decodeURIComponent(event)).events;
                for (var i = 0; i < events.length; i++) {
                    var eventInfo = events[i];
                    if (!eventInfo) {
                        continue;
                    }

                    var functionBody = eventInfo.substring(eventInfo.indexOf(",value=") + 7);
                    if (eventInfo.indexOf("shown") > -1) {
                        this.shownFunctionBody = functionBody;
                    }

                    if (eventInfo.indexOf("submit") > -1) {
                        this.submitFunctionBody = functionBody;
                    }
                }
            }

        },


        /**
         * 初始化下拉选项数据
         */
        initData: function () {
            if (!this.bfdDataSetConfig || $.isEmptyObject(this.bfdDataSetConfig)) {
                return;
            }

            var columns = [];
            columns.push(this.bfdDataSetConfig.name);
            columns.push(this.bfdDataSetConfig.value);

            this.data = win.PageModelManage.getData(this.bfdDataSetConfig.dataSourceId,
                this.bfdDataSetConfig.dataSetId, columns, []);
        },


        /**
         * 获取组件值
         * @returns {Array}
         */
        getValues: function () {
            var result = [],
                selectValue = $(this.comp_value).val();

            if (!selectValue || !this.data) {
                return [];
            }

            if (!this.bfdDataSetConfig || $.isEmptyObject(this.bfdDataSetConfig)) {
                return [];
            }

            var values = selectValue.split(","),
                $that = this;
            $.each(this.data, function (index, item) {
                if (item[$that.bfdDataSetConfig.value] &&
                    $.inArray(item[$that.bfdDataSetConfig.value].toString(), values) > -1) {
                    result.push(item[$that.bfdDataSetConfig.value]);
                }
            })

            return result;
        },


        /**
         * 获取组件名称
         * @returns {Array}
         */
        setNames: function (selectValue) {
            var result = [];

            if (!selectValue || !this.data) {
                $(this.comp_name).html(result.join(","));
                return;
            }

            if (!this.bfdDataSetConfig || $.isEmptyObject(this.bfdDataSetConfig)) {
                $(this.comp_name).html(result.join(","));
                return;
            }

            var values = selectValue.split(","),
                $that = this;
            $.each(this.data, function (index, item) {
                if (item[$that.bfdDataSetConfig.value] &&
                    $.inArray(item[$that.bfdDataSetConfig.value].toString(), values) > -1) {
                    result.push(item[$that.bfdDataSetConfig.name]);
                }
            })

            $(this.comp_name).html(result.join(","));
        },

        /**
         * 获取表格列表ID
         * @returns {*}
         * @private
         */
        _getTableId: function () {
            var table = $("#" + this.dialogId).find("[type=table_base_local],[type=table_base]"),
                tableId;

            if (table) {
                tableId = $(table).attr("compid");
            }

            return tableId;
        },


        /**
         * 初始化选择项
         */
        initSelectedItem: function () {
            var tableId = this._getTableId();
            if (tableId && this.bfdDataSetConfig) {
                $("#" + tableId).bootstrapTable("checkBy",
                    {field: this.bfdDataSetConfig.value, values: this.getValues()}
                );
            }
        },


        /**
         * 获取选择项
         */
        setSelectedItem: function () {
            var tableId = this._getTableId(),
                values = [],
                $that = this;

            if (tableId && $that.bfdDataSetConfig) {
                var dataRows = $("#" + tableId).bootstrapTable("getSelections");
                if (dataRows && dataRows.length > 0) {
                    $.each(dataRows, function (index, item) {
                        values.push(item[$that.bfdDataSetConfig.value])
                    })
                }

                $(this.comp_value).val(values.join(","));
                this.setNames(values.join(","));
                $(this.comp_close).trigger("click");
            }
        },


        /**
         * 事件绑定
         */
        bindEvent: function () {
            var $that = this;

            $("#" + this.dialogId).off("shown.bs.modal").on("shown.bs.modal", function () {
                if (!$that.onDialogShown($that.getValues())) {
                    $that.initSelectedItem();
                }
            })

            $(this.comp_submit).off("click").on("click", function () {
                if (!$that.onDialogSubmit()) {
                    $that.setSelectedItem();
                }
            })

            if (this.operator !== "view") {
                $(this.comp_select_button).off("click").on("click", function () {
                    showModalDialog($that.dialogId, $that.dialog_title, $that.dialog_url);
                })
            }

            $(this.comp_close).off("click").on("click", function () {
                hideModalDialog($that.dialogId);
            })
        },

        /**
         * 对话框显示前事件，初始化列表选择数据
         * @param data
         */
        onDialogShown: function (data) {
            if (this.shownFunctionBody && !$.isEmptyObject(this.shownFunctionBody)) {
                eval("(function($){" + this.shownFunctionBody + "})(jQuery)");
                return true;
            }

            return false;
        },

        /**
         * 对话框提交事件
         */
        onDialogSubmit: function () {
            if (this.submitFunctionBody && !$.isEmptyObject(this.submitFunctionBody)) {
                var result = eval("(function($){" + this.submitFunctionBody + "})(jQuery)");
                if (result) {
                    $(this.comp_value).val(result.join(","));
                    this.setNames(result.join(","));
                    $(this.comp_close).trigger("click");
                }

                return true;
            }

            return false;
        }
    }

    $.fn.bfdAdvancedSelect = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('bfd.advanced.select'),
                options = $.extend({}, $this.data(),
                    typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (!data) {
                    $this.data('bfd.advanced.select', (data = new AdvancedSelectPlugin(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('bfd.advanced.select');
                }
            }

            if (!data) {
                $this.data('bfd.advanced.select', (data = new AdvancedSelectPlugin(this)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    }

}(jQuery,window))