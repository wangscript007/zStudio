/**
 *数据集选项配置
 *
 * Created by 10177027 on 2016/10/19.
 */

;(function($,win) {
    var DataSetOptionsConfigProp = function (componentObject) {
        this.componentObject = componentObject;

        this.compDataSourceId = "comp-datasource" + getCurrentTime();
        this.compDataSetId = "comp-dataset" + getCurrentTime();
        this.compParamType = "comp-param-type" + getCurrentTime();
        this.compOptionName = "comp-option-name" + getCurrentTime();
        this.compOptionValue = "comp-option-value" + getCurrentTime();

        this.registerEvent();
    }

    DataSetOptionsConfigProp.prototype = {
        getHtml: function () {
            var config = this.getProperty(),
                html = [];

            html.push('<div class="form-group">' +
                '<div class="input-group">' +
                '<div class="input-group-addon" style="color:white;border: 1px solid #5a5a5a;">数据源</div>' +
                '<select id="' + this.compDataSourceId + '" class="form-textbox form-combo col-md-12">'
                + this.getDataSourceOptions(config.dataSourceId).join(" ") + '</select>' +
                '</div>' +
                '</div>'
            );

            html.push('<div class="form-group">' +
                '<div class="input-group">' +
                '<div class="input-group-addon"  style="color:white;border: 1px solid #5a5a5a;">数据集</div>' +
                '<select id="' + this.compDataSetId + '" class="form-textbox form-combo col-md-12">' +
                this.getDataSetOptions(config.dataSourceId, config.dataSetId).join(" ") + '</select>' +
                '</div>' +
                '</div>'
            );

            html.push('<div class="form-group">' +
                '<div class="input-group">' +
                '<div class="input-group-addon" style="color:white;border: 1px solid #5a5a5a;">参数类型</div>' +
                '<select id="' + this.compParamType + '" class="form-textbox form-combo col-md-12 ">' +
                this.getParamOptions(config.paramType).join(" ") + '</select>' +
                '</div>' +
                '</div>'
            );

            html.push('<div class="form-group">' +
                '<div class="input-group">' +
                '<div class="input-group-addon" style="color:white;border: 1px solid #5a5a5a;">选项名</div>' +
                '<select id="' + this.compOptionName + '" class="form-textbox form-combo col-md-12">'
                + this.getDataFieldsOptions(config.dataSourceId, config.dataSetId, config.paramType, config.name).join(" ") + '</select>' +
                '</div>' +
                '</div>'
            );

            html.push('<div class="form-group">' +
                '<div class="input-group">' +
                '<div class="input-group-addon" style="color:white;border: 1px solid #5a5a5a;">选项值</div>' +
                '<select id= "' + this.compOptionValue + '"class="form-textbox form-combo col-md-12">'
                + this.getDataFieldsOptions(config.dataSourceId, config.dataSetId, config.paramType, config.value).join(" ") + '</select>' +
                '</div>' +
                '</div>'
            );

            return html.join(" ");
        },


        /**
         * 配置项事件注册
         */
        registerEvent: function () {
            var $that = this;
            $('.properties .form-panel-body')
                .off("change", "#" + this.compDataSourceId).on('change', "#" + this.compDataSourceId, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $("#" + $that.compDataSetId).empty().append($that.getDataSetOptions($(this).val()));
                    $("#" + $that.compOptionName).empty();
                    $("#" + $that.compOptionValue).empty();
                })

                .off("change", "#" + $that.compDataSetId).on("change", "#" + this.compDataSetId, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var dataSourceId = $("#" + $that.compDataSourceId).val(),
                        dataSetId = $(this).val(),
                        paramType = $("#" + $that.compParamType).val(),
                        fieldsOptions = $that.getDataFieldsOptions(dataSourceId, dataSetId, paramType);

                    $("#" + $that.compOptionName).empty().append(fieldsOptions);
                    $("#" + $that.compOptionValue).empty().append(fieldsOptions);
                })

                .off("change", "#" + $that.compParamType).on("change", "#" + $that.compParamType, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    var dataSourceId = $("#" + $that.compDataSourceId).val(),
                        dataSetId = $("#" + $that.compDataSetId).val(),
                        paramType = $(this).val(),
                        fieldsOptions = $that.getDataFieldsOptions(dataSourceId, dataSetId, paramType);

                    $("#" + $that.compOptionName).empty().append(fieldsOptions);
                    $("#" + $that.compOptionValue).empty().append(fieldsOptions);
                })

                .off("change", "#" + $that.compOptionName).on("change", "#" + $that.compOptionName, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $that.setProperty();
                })

                .off("change", "#" + $that.compOptionValue).on("change", "#" + $that.compOptionValue, function (e) {
                    e.stopPropagation();
                    e.preventDefault();

                    $that.setProperty();
                })
        },

        /**
         * 获取数据源选项
         * @param selectValue
         * @returns {string}
         */
        getDataSourceOptions: function (selectValue) {
            var dataSources = $.bfd.datasource().getDataSources(),
                options = ['<option><--请选择--></option>'];

            if (dataSources && dataSources.length > 0) {
                $.each(dataSources, function (index, item) {
                    var selected = "";
                    if (selectValue === item.id) {
                        selected = "selected";
                    }

                    options.push('<option value="' + item.id + '" ' + selected + ' >' + item.name + '</option>')
                })
            }

            return options;
        },

        /**
         * 获取数据集选项
         * @param selectValue
         * @returns {string}
         */
        getDataSetOptions: function (dataSourceId, selectValue) {
            var datasets = $.bfd.datasource().getDataSets(dataSourceId, dataSourceId),
                options = ['<option><--请选择--></option>'];

            if (datasets && datasets.length > 0) {
                $.each(datasets, function (index, item) {
                    var selected = "";
                    if (selectValue === item.name) {
                        selected = "selected";
                    }

                    options.push('<option value="' + item.name + '" ' + selected + ' >' + item.name + '</option>')
                })
            }

            return options;
        },

        /**
         * 获取数据集选项
         * @param selectValue
         * @returns {string}
         */
        getParamOptions: function (selectValue) {
            var params = [{"id": "in", "name": "入参"}, {"id": "out", "name": "出参"}],
                options = ['<option><--请选择--></option>'];

            $.each(params, function (index, item) {
                var selected = "";
                if (selectValue === item.id) {
                    selected = "selected";
                }

                options.push('<option value="' + item.id + '" ' + selected + ' >' + item.name + '</option>')
            })

            return options;
        },

        /**
         * 获取字段选项
         * @param dataSourceId
         * @param dataSetId
         * @param paramType
         * @param selectValue
         * @returns {string}
         */
        getDataFieldsOptions: function (dataSourceId, dataSetId, paramType, selectValue) {
            var dataFields = $.bfd.datasource().getDataSetFields(dataSourceId, dataSourceId, dataSetId, paramType),
                options = ['<option><--请选择--></option>'];

            if (dataFields && dataFields.length > 0) {
                $.each(dataFields, function (index, item) {
                    var selected = "";
                    if (selectValue === item.name) {
                        selected = "selected";
                    }

                    options.push('<option value="' + item.name + '" ' + selected + ' >' + item.name + '</option>')
                })
            }

            return options;
        },

        /**
         * 设置配置属性
         */
        setProperty: function () {
            var config = {};

            config.dataSourceId = $("#" + this.compDataSourceId).val();
            config.dataSetId = $("#" + this.compDataSetId).val();
            config.paramType = $("#" + this.compParamType).val();
            config.name = $("#" + this.compOptionName).val();
            config.value = $("#" + this.compOptionValue).val();

            var compId = $(this.componentObject).attr("compid"),
                parameters = $.bfd.datasource().getBFDOperationParam(
                    config.dataSourceId,
                    config.dataSourceId,
                    config.dataSetId,
                    compId);

            if ($.isEmptyObject(parameters)) {
                $(this.componentObject).removeAttr("bfd-operation-params")
                    .removeAttr("bfd-dataset-config");
            } else {
                $(this.componentObject).attr("bfd-dataset-config", encodeURIComponent(JSON.stringify(config)));
                $(this.componentObject).attr("bfd-operation-params", encodeURIComponent(JSON.stringify(parameters)));
            }
        },

        /**
         * 获取数据集配置属性
         * @returns {*}
         */
        getProperty: function () {
            var config = $(this.componentObject).attr("bfd-dataset-config");
            if (!config) {
                config = {};
                config.paramType = "in";
                config.dataSourceId = "";
                config.dataSetId = "";
                config.name = "";
                config.value = "";
            } else {
                config = $.parseJSON(decodeURIComponent(config));
            }

            return config;
        }
    }

    win.DesignerPropDefine.dataset = win.DesignerPropDefine.dataset || {};
    win.DesignerPropDefine.dataset.OptionsConfigProp = DataSetOptionsConfigProp;

}(jQuery,window))