/**
 * 布局器显示比例属性
 * @param componentObject
 * @constructor
 */
var LayoutRatioProp = function(componentObject){
    this.componentObject = componentObject;
    this.id = "input_ratio_" + getCurrentTime();
}

LayoutRatioProp.prototype = {
    /**
     *输入数据验证
     *@param 无
     *@return 无
     */
    validateValue: function () {
        //验证返回结果
        var ret = false;
        //用户输入的比例值
        var value = $("#" + this.id).val();
        if (value != undefined) {
            //用户输入比例以“,”号分隔
            var columns = value.split(",");
            //验证用户输入的总列数是否大于0小于12，且不能包含非数字字符。
            var totalColumns = 0;
            for (var i = 0; i < columns.length; i++) {
                totalColumns += parseInt(columns[i]);
            }
            if (isNaN(totalColumns) || totalColumns < 0 || totalColumns > 12) {
                ret = false;
            }
            else {
                ret = true;
            }
        }

        return ret;
    },

    /**
     * 判断数据列中是否包含子集
     * @param columns
     * @param startIndex
     */
    isColumnsHasChildItem:function(columns,startIndex) {
        var hasChildItem = false;
        if (!columns || columns.length < startIndex) {
            return hasChildItem;
        }

        for (var i = startIndex; i < columns.length; i++) {
            if ($(columns[i]).children().length > 0) {
                hasChildItem = true;
                break;
            }
        }

        return hasChildItem;
    },


    /**
     * 返回属性配置面板html
     *@param 无
     *@return 无
     */
    getHtml: function () {
        var placeholder = "分隔比例以逗号分隔和为12";
        //判断是否有子元素，如果有则不允许修改布局器比例
        var disabled = "";
        if (this.hasChildComponent()) {
            disabled = "";
        }

        return "<input id=\"" + this.id + "\" type=\"text\" value=\""
            + this.getProperty() + "\" placeholder=\"" + placeholder
            + "\" " + disabled + " class=\"form-textbox form-textbox-text col-md-12\"/>";
    },


    /**
     *保存组件布局比例属性,并重新生成组件布局
     *@param 无
     *@return无
     */
    setProperty: function (event, currentPropertyID) {
        if (event.type == "focusout") {
            var value = $("#" + this.id).val();
            if (!value) {
                return;
            }

            if (!this.validateValue()) {
                bootbox.alert("布局器分隔比例配置错误！分隔比例为0-12之间的数值，分隔比例之和大于0小于12，比例值之间以逗号分隔；如：6,6。");
                return;
            }

            var that = this,
                oldColumns = $(this.componentObject).find(".row:first").children(),
                oldColumnSize = oldColumns.length,
                columns = value.split(","),
                newColumnSize = columns.length;

            if (oldColumnSize > newColumnSize
                && this.isColumnsHasChildItem(oldColumns, newColumnSize)) {
                bootbox.confirm("布局调整后第[" + newColumnSize + "]列后的数据会丢失，确认继续吗？", function (result) {
                    if (result) {
                        that.resetColumns(columns);
                    } else {
                        $("#" + that.id).val($(that.componentObject).attr("ratio"));
                    }
                })
            } else {
                that.resetColumns(columns);
            }
        }
    },


    /**
     * 重置数据列
     */
    resetColumns: function (columns) {
        if(!columns || columns.length == 0){
            return ;
        }

        /**
         * 构造新的数据列
         */
        var oldColumns = $(this.componentObject).find(".row:first").children().clone(true),
            oldColumnSize = oldColumns.length,
            newColumns,
            html = "";

        for (var i = 0; i < columns.length; i++) {
            html += "<div class=\"col-md-" + parseInt(columns[i]) +
                " col-xs-" + parseInt(columns[i]) +
                " col-sm-" + parseInt(columns[i]) +
                " col-lg-" + parseInt(columns[i]) + " column\"></div>";
        }

        $(this.componentObject).find(".row:first").html(html);


        /**
         * 数据列调整后，将原数据列下的组件添加到新数据列中
         * @type {*|jQuery}
         */
        newColumns = $(this.componentObject).find(".row:first").children();
        if(newColumns && newColumns.length > 0) {
            /**
             * 将原有列中的元素放到新列中
             */
            $.each(newColumns, function (index, item) {
                if (index > oldColumnSize) {
                    return false;
                }

                $(item).append($(oldColumns[index]).children());
            })

            /**
             * 重新计算数据列高
             */
            layoutResize($(newColumns[newColumns.length - 1]));


            /**
             *注册数据列sortable事件
             */
            sortableComponent();


            /**
             * 保存布局比例值
             */
            $(this.componentObject).attr("ratio", columns.join(","));
        }
    },


    /**
     *获取组件当前属性
     *@param 无
     *@return 布局器比例属性值
     */
    getProperty: function () {
        var ratio = $(this.componentObject).attr("ratio");
        if (ratio == undefined)
            ratio = "";
        return ratio;
    },


    /**
     *描述：判断自定义布局器是否有子元素
     *@param 无
     *@return true:有子元素；false:无子元素。
     */
    hasChildComponent: function () {
        var children = $(this.componentObject).find(".column>*");
        if (children.length == 0)
            return false;
        else
            return true;
    }
}





/**
 * 数据源属性配置
 * @param componentObject
 * @constructor
 */
var LayoutDataSourceProp = function(componentObject){
    this.componentObject = componentObject;
    //uri属性选择下拉框ID
    this.dataSetId = "input_dataset_" + getCurrentTime();
    //uri属性对应字段容器组件ID
    this.dataFieldsId = "input_datafields_" + getCurrentTime();
    //数据源ID
    this.dataSourceId = "input_datasource_" + getCurrentTime();
    //多表数据集名称定义
    this.multiDsID = "input_uri_multi_ds_" + getCurrentTime();

    this.dataParamTypeId = "input_dataparamtype_" + getCurrentTime();

    //当前属性的ID编号
    this.id = "";//this.dataSetId + "," + this.dataFieldsId+","+this.dataParamTypeId;
    /**
     * 注册html事件
     */
    this.registerEvent();
}

LayoutDataSourceProp.prototype = {
    /**
     * 布局器数据源属性配置html
     * @returns {string}
     */
    getHtml: function () {
        /**
         * 获取组件上次设置的URI值,如果没有设置值则继承父级布局器配置 。
         * @type {{}}
         */
        var selectedValue = this.getProperty(),
            disabled = "", parentProperty;
        parentProperty = this.getParentLayoutProperty();

        if (!selectedValue.uri || !selectedValue.dsname) {
            selectedValue = parentProperty;
        }

        if (this.isBindField()) {
            disabled = " disabled ";
        }

        /**
         * 如果布局器上未配置数据源信息，则默认选中第一个数据源。
         */
        if (!selectedValue.dsname) {
            var dataSources = $.bfd.datasource().getDataSources();
            if (dataSources && dataSources.length > 0) {
                selectedValue.dsname = dataSources[0].id;
            }
        }

        /**
         * 根据数据源类型生成属性配置面板
         */
        if (selectedValue && selectedValue.dsType === "dataset") {
            return this.getDataSetLayoutConfigHtml(selectedValue, disabled);
        } else {
            return this.getDefaultLayoutConfigHtml(selectedValue, disabled, parentProperty);
        }
    },

    /**
     * 绑定事件
     */
    registerEvent: function () {
        var that = this;
        $('.properties .form-panel-body')
            .on("change", "[name=" + that.dataSourceId + "]", function (e) {
                var selectedProperty = {};
                selectedProperty.dsname = $(this).val();

                $("#" + that.dataSetId).empty().append(
                    that.getDataSetHtml(selectedProperty, that.getParentLayoutProperty()));

                $(".data-set-param").empty();
                $("#" + that.dataFieldsId).empty();
            })

            .on("change", "#" + that.dataSetId, function (e) {
                that.setProperty(e);

                var selectedProperty = that.getProperty(),
                    parentProperty = that.getParentLayoutProperty(),
                    disabled = false;

                if (!selectedProperty.bfd_set_param_type) {
                    selectedProperty.bfd_set_param_type = parentProperty.bfd_set_param_type;
                    if (selectedProperty.bfd_set_param_type) {
                        disabled = true;
                    }
                }

                if ($(this).val() && (!selectedProperty.uri || !selectedProperty.dsname)) {
                    selectedProperty = parentProperty;
                }

                $(".data-set-param").empty().append(
                    that.getDataSetParamTypeHtml(selectedProperty, parentProperty, disabled));
                $("#" + that.dataFieldsId).empty();
                $("[name=" + that.dataParamTypeId + "]").trigger("change");
            })

            .on("change", "[name=" + that.dataParamTypeId + "]", function (e) {
                that.setProperty(e);

                var selectedProperty = that.getProperty(),
                    parentProperty = that.getParentLayoutProperty();

                if (!selectedProperty.uri || !selectedProperty.dsname) {
                    selectedProperty = parentProperty;
                }

                $("#" + that.dataFieldsId).empty().append(that.getDataFieldsHtml(selectedProperty, parentProperty));
            })
    },

    /**
     * 获取多表数据集属性配置html
     * @param selectedValue
     * @param disabled
     * @returns {string}
     */
    getDataSetLayoutConfigHtml: function (selectedValue, disabled) {
        var html = [];
        html.push("<ul class=\"list-group\">");
        html.push(this.getDataSourceHtml(selectedValue.dsname, disabled));
        html.push("<li href=\"#\" class=\"list-group-item\">");
        html.push("<select class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.dataSetId + "\"  " + disabled + " >");
        html.push("<option>" + selectedValue.uri + "</option>");
        html.push("</select>");
        html.push("</li>");
        html.push("</ul>");

        if (selectedValue.relationmodel) {
            var model = $.parseJSON(decodeURIComponent(selectedValue.relationmodel)),
                fields = [];
            if (model.tableName === selectedValue.uri) {
                fields = model.fields;
            } else {
                $.each(model.slaveTables, function (index, slaveTable) {
                    if (slaveTable.tableName === selectedValue.uri) {
                        fields = model.fields;
                        return false;
                    }
                })
            }

            var fieldsHtml = [];
            fieldsHtml.push("<table class=\"table table-bordered\">");
            for (var i = 0; i < fields.length; i++) {
                fieldsHtml.push("<tr><td>" + fields[i].column_name + "</td><td>" + fields[i].data_type + "</td></tr>");
            }
            fieldsHtml.push("</table>");
            html.push("<div id=\"" + this.dataFieldsId + "\">" + fieldsHtml.join(" ") + "</div>");
        }

        return html.join(" ");
    },

    /**
     * 获取默认布局器配置html
     * @param selectedValue
     * @param disabled
     * @returns {string}
     */
    getDefaultLayoutConfigHtml: function (selectedValue, disabled, parentProperty) {
        var html = [];
        html.push("<ul class=\"list-group\">");
        html.push(this.getDataSourceHtml(selectedValue, disabled));

        var tooltip = "";
        if (selectedValue && selectedValue.uri) {
            tooltip = selectedValue.uri;
        }

        if (selectedValue && selectedValue.bfd_set_ref) {
            tooltip = selectedValue.uri + "(" + selectedValue.bfd_set_ref + ")";
        }

        html.push("<li href=\"#\" class=\"list-group-item\" style=\"cursor:pointer;\" title=\"" + tooltip + "\">");
        html.push("<select class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.dataSetId + "\"  " + disabled + " >");
        html.push(this.getDataSetHtml(selectedValue, parentProperty));
        html.push("</select>");
        html.push("</li>");

        html.push(this.getDataSetParamTypeHtml(selectedValue,parentProperty,disabled));

        html.push("</ul>");

        html.push("<div id=\"" + this.dataFieldsId + "\">");
        html.push(this.getDataFieldsHtml(selectedValue, parentProperty));
        html.push("</div>");

        return html.join(" ");
    },

    /**
     * 获取数据源选择html
     * @param selectedValue
     * @param disabled
     * @returns {string}
     */
    getDataSourceHtml: function (selectedProperty, disabled) {
        var selectedValue = selectedProperty.dsname;
        var html = ["<li href=\"#\" class=\"list-group-item\" >"],
            that = this;

        var dataSources = $.bfd.datasource().getDataSources();
        if (!this.isRootLayout()) {
            disabled = " disabled ";
        }

        $.each(dataSources, function (index, item) {
            var checked = "";
            if (selectedValue != undefined && item.id == selectedValue) {
                checked = "checked";
            }

            html.push("<input dstype=\"" + item.dsType + "\" name=\"" + that.dataSourceId + "\" type=\"radio\" value=\""
                + item.id + "\" " + checked + " " + disabled + "/>" + item.name);
        })

        html.push("</li>");

        return html.join(" ");
    },

    /**
     * 获取数据集html
     * @param dataSourceName
     * @param selectedDataSet
     * @param parentLayoutProperty
     * @returns {*}
     */
    getDataSetHtml: function (selectedProperty, parentLayoutProperty) {
        var dataSourceName = selectedProperty.dsname,
            dataSetName = selectedProperty.uri;

        if (!dataSourceName) {
            return "";
        }

        var serviceName = dataSourceName;
        if (parentLayoutProperty && parentLayoutProperty.uri) {
            serviceName = dataSourceName + "." + parentLayoutProperty.uri;
            if (parentLayoutProperty.bfd_parent_uri) {
                serviceName = dataSourceName + "." + parentLayoutProperty.bfd_parent_uri;
                if (parentLayoutProperty.bfd_parent_uri.indexOf(parentLayoutProperty.uri) === -1) {
                    serviceName = dataSourceName + "." + parentLayoutProperty.bfd_parent_uri + "." + parentLayoutProperty.uri;
                }
            }
        }

        var dataSets = $.bfd.datasource().getDataSets(dataSourceName, serviceName);
        var options = ["<option value=\"\"><--请选择数据集--></option>"];
        var parentDataSetName = "";
        if (parentLayoutProperty && parentLayoutProperty.uri) {
            var selected = "",
                parentDataSetName = parentLayoutProperty.uri;
            if (dataSetName === parentLayoutProperty.uri || !dataSetName) {
                selected = "selected";
            }

            var bfd_set_type = "";
            if (parentLayoutProperty.bfd_set_type) {
                bfd_set_type = parentLayoutProperty.type;
            }

            var bfd_set_ref = "";
            if (parentLayoutProperty.bfd_set_ref) {
                bfd_set_ref = parentLayoutProperty.bfd_set_ref;
            }

            if (bfd_set_ref) {
                options.push("<option bfd_set_type=\"" + bfd_set_type
                    + "\" bfd_set_ref=\"" + bfd_set_ref
                    + "\" value=\"" + parentLayoutProperty.uri + "\" " + selected + " >"
                    + parentLayoutProperty.uri + "(" + bfd_set_ref + ")</option>");
            } else {
                options.push("<option bfd_set_type=\"" + bfd_set_type + "\" value=\"" + parentLayoutProperty.uri + "\" " + selected + " >"
                    + parentLayoutProperty.uri + "</option>");
            }
        }

        if (dataSets && dataSets.length > 0) {
            $.each(dataSets, function (index, item) {
                if (item.name === parentDataSetName) {
                    return;
                }

                var selected = "";
                if (item.name === dataSetName) {
                    selected = "selected";
                }

                var bfd_set_type = "";
                if (item.type) {
                    bfd_set_type = item.type;
                }

                var bfd_set_ref = "";
                if (item.$ref) {
                    bfd_set_ref = item.$ref;
                }

                if (bfd_set_ref) {
                    options.push("<option bfd_set_type=\"" + bfd_set_type
                        + "\" bfd_set_ref=\"" + bfd_set_ref
                        + "\" value=\"" + item.name + "\" " + selected + " >"
                        + item.name + "(" + bfd_set_ref + ")</option>");
                } else {
                    options.push("<option bfd_set_type=\"" + bfd_set_type
                        + "\" value=\"" + item.name + "\" " + selected + " >"
                        + item.name + "</option>");
                }
            })
        }

        return options.join(" ");
    },
    /**
     * 获取数据集参数类型
     * @param selectedProperty
     * @param disabled
     * @returns {string}
     */
    getDataSetParamTypeHtml: function (selectedProperty,parentProperty,disabled) {
        var paramHtml = [],checked = "",
            selectedValue = selectedProperty.bfd_set_param_type,
            parentParamType = parentProperty.bfd_set_param_type;

        selectedProperty.bfd_set_param_type = "in";
        var inFields = this.getDataFields(selectedProperty, parentProperty);
        if (inFields && inFields.length > 0) {
            if ((selectedValue && selectedValue === "in") || !selectedValue) {
                checked = " checked ";
            }

            if (!parentParamType || parentParamType === "in") {
                paramHtml.push('<input ' + checked + " " + disabled + ' name="' + this.dataParamTypeId + '" type="radio" value="in">入参</input>');
            }
        }

        selectedProperty.bfd_set_param_type = "out";
        var outFields = this.getDataFields(selectedProperty, parentProperty);
        if (outFields && outFields.length > 0) {
            if (!checked) {
                checked = " checked ";
            }else{
                checked = "";
            }

            if (!parentParamType || parentParamType === "out") {
                paramHtml.push('<input ' + checked + " " + disabled + ' name="' + this.dataParamTypeId + '" type="radio" value="out">出参</input>');
            }
        }

        selectedProperty.bfd_set_param_type = selectedValue;

        if(paramHtml.length === 0){
            paramHtml.push("数据集本层参数为空！");
        }

        var dsType = selectedProperty.dsType;
        if(!dsType){
            dsType = parentProperty.dsType;
        }
        var display = '';
        if(dsType === "orm"){
            display = 'style = "display:none"';
        }

        return '<li href="#" '+display+' class="list-group-item data-set-param" >' + paramHtml.join(" ") + '</li>';
    },
    /**
     * 获取数据字段
     * @param selectedProperty
     * @param parentLayoutProperty
     * @returns {*}
     */
    getDataFields:function(selectedProperty, parentLayoutProperty) {
        var dataSourceName = selectedProperty.dsname,
            dataSetName = selectedProperty.uri,
            paramType = selectedProperty.bfd_set_param_type;
        if (!dataSourceName || !dataSetName) {
            return "";
        }

        var serviceName = dataSourceName;
        if (parentLayoutProperty && parentLayoutProperty.uri) {
            if (dataSetName !== parentLayoutProperty.uri) {
                serviceName = dataSourceName + "." + parentLayoutProperty.uri;
                if (parentLayoutProperty.bfd_parent_uri) {
                    serviceName = dataSourceName + "." + parentLayoutProperty.bfd_parent_uri;
                    if (parentLayoutProperty.bfd_parent_uri.indexOf(parentLayoutProperty.uri) === -1) {
                        serviceName = dataSourceName + "." + parentLayoutProperty.bfd_parent_uri + "." + parentLayoutProperty.uri;
                    }
                }
            } else if (dataSetName === parentLayoutProperty.uri &&
                    parentLayoutProperty.bfd_parent_uri) {
                /*
                 var parentUri = parentLayoutProperty.bfd_parent_uri;
                 if (parentUri === dataSetName || parentUri.lastIndexOf("."+dataSetName) > -1) {
                 parentUri = parentUri.substring(0, parentUri.lastIndexOf(dataSetName) + dataSetName.length);
                 if (parentUri.lastIndexOf("." + dataSetName) > 0) {
                 parentUri = parentUri.substring(0, parentUri.lastIndexOf("." + dataSetName));
                 }
                 }*/

                serviceName = dataSourceName + "." + parentLayoutProperty.bfd_parent_uri;
            }
        }

        return $.bfd.datasource().getDataSetFields(dataSourceName, serviceName, dataSetName, paramType);
    },

    /**
     * 生成字段列表html
     * @param dataSourceName
     * @param dataSetName
     * @param parentLayoutProperty 父级点布局器属性
     * @returns {*}
     */
    getDataFieldsHtml: function (selectedProperty, parentLayoutProperty) {
        var fields = this.getDataFields(selectedProperty,parentLayoutProperty);
        if (!fields || fields.length <= 0) {
            return "";
        }

        //根据数据字段生成html内容
        var html = [];
        html.push("<table class=\"table table-bordered\">");
        for (var i = 0; i < fields.length; i++) {
            html.push("<tr><td>" + fields[i].name + "</td><td>" + fields[i].type + "</td></tr>");
        }
        html.push("</table>");

        return html.join(" ");
    },

    /**
     * 保存URI属性到布局组上
     * @param event
     * @param currentPropertyID
     */
    setProperty: function (event, currentPropertyID) {
        if (event.type !== "change") {
            return;
        }

        //数据集变化后清除子元素字段绑定
        var currentURI = $("#" + this.dataSetId).val();
        var property = this.getProperty();
        if (property.uri !== currentURI) {
            this.clearChildrenComponentDataField($(this.componentObject));
        }

        //设置uri
        var parentProperty = this.getParentLayoutProperty();
        if(!currentURI || parentProperty.uri === currentURI){
            return;
        }

        $(this.componentObject).attr("uri", currentURI);

        //设置数据集名称
        var $dsNameComp = $("[name=" + this.dataSourceId + "]:checked");
        var dsName = $dsNameComp.val();

        $(this.componentObject).attr("dsname", dsName);
        $(this.componentObject).attr("dstype", $dsNameComp.attr("dstype"));

        //数据集类型设置 array,object
        $(this.componentObject).removeAttr("bfd_set_type");
        var $compDataSet = $("#" + this.dataSetId + " option:selected");
        var bfd_set_type = $compDataSet.attr("bfd_set_type");
        if (bfd_set_type) {
            $(this.componentObject).attr("bfd_set_type", bfd_set_type);
        }

        var bfd_set_ref = $compDataSet.attr("bfd_set_ref");
        if (bfd_set_ref) {
            $(this.componentObject).attr("bfd_set_ref", bfd_set_ref);
        }

        //数据集参数类型
        var dsParamType = $("[name=" + this.dataParamTypeId + "]:checked").val();
        if (dsParamType) {
            $(this.componentObject).attr("bfd_set_param_type", dsParamType);
        }

        //添加父容器数据集
        this.setParentUriProperty(currentURI);

        if (this.isRootLayout()) {
            var model = $(this.componentObject).attr("ms-controller");
            var parameters = $.bfd.datasource().getBFDOperationParam(dsName, dsName, currentURI,model);

            if (!$.isEmptyObject(parameters)) {
                $(this.componentObject).attr("bfd-operation-params", encodeURIComponent(JSON.stringify(parameters)));
                $.bfd.pageCache.setOperationItem(parameters);
            } else {
                $(this.componentObject).removeAttr("bfd-operation-params");
                $.bfd.pageCache.refreshOperationItem();
            }

            /**
             * 添加avalon模型ms-controller属性
             * */
            var msController = $(this.componentObject).attr("ms-controller");
            if (!msController) {
                $(this.componentObject).parents("[ms-controller]").each(function (index, item) {
                    $(item).removeAttr("ms-controller");
                })

                var vmid = $(this.componentObject).attr("compid");
                $(this.componentObject).attr("ms-controller", vmid).attr("id", vmid).attr("compid", vmid).attr("compname", vmid);
            }
        }
    },

    /**
     * 设置容器父级数据集
     * @param currentUri
     */
    setParentUriProperty: function (currentUri) {
        var parentProperty = this.getParentLayoutProperty();
        /**
         * parentProperty.uri 为空时继承上层数据源，不设置父uri
         * 当前选择uri与父uri一致时，不设置父uri
         */
        if (!currentUri || !parentProperty.uri || currentUri === parentProperty.uri) {
            return;
        }

        $(this.componentObject).attr("bfd_parent_uri", this.getParentLayoutURI());
    },


    /**
     * URI数据变化时，清空布局组件下所有绑定数据字段的组件的数据字段属性。
     * @param $layout
     */
    clearChildrenComponentDataField: function ($layout) {
        $layout.removeAttr("dsname").removeAttr("uri")
            .removeAttr("dstype").removeAttr("bfd_set_type")
            .removeAttr("bfd_parent_uri")
            .removeAttr("bfd-operation-params");

        $layout.find("[ms-duplex]").removeAttr("ms-duplex");
        $layout.find("[ms-duplex-number]").removeAttr("ms-duplex-number");
        $layout.find("[ms-duplex-string]").removeAttr("ms-duplex-string");
        $layout.find("[field]").removeAttr("field");

        $layout.find("[uri]").removeAttr("uri");
        $layout.find("[dsname]").removeAttr("dsname");
        $layout.find("[dstype]").removeAttr("dstype");
        $layout.find("[bfd_set_type]").removeAttr("bfd_set_type");
        $layout.find("[bfd_parent_uri]").removeAttr("bfd_parent_uri");
        $layout.find("[bfd_set_param_type]").removeAttr("bfd_set_param_type");
        $layout.find("[ms-controller][bfd-operation-params]").removeAttr("bfd-operation-params");
        $layout.find("[ms-controller]").removeAttr("ms-controller");
    },

    /**
     * 获取容器属性配置
     * @returns {{}}
     */
    getProperty: function () {
        var property = {};
        property.uri = $(this.componentObject).attr("uri");
        property.dsname = $(this.componentObject).attr("dsname");
        property.dsType = $(this.componentObject).attr("dsType");
        property.definitionName = $(this.componentObject).attr("definitionName");
        property.relationmodel = $(this.componentObject).attr("relationmodel");
        property.bfd_parent_uri = $(this.componentObject).attr("bfd_parent_uri");
        property.bfd_set_ref = $(this.componentObject).attr("bfd_set_ref");
        property.bfd_set_param_type = $(this.componentObject).attr("bfd_set_param_type");
        if (!property.bfd_set_param_type) {
            property.bfd_set_param_type = "in";
        }

        return property;
    },

    /**
     * 获取父容器配置
     * @returns {{}}
     */
    getParentLayoutProperty: function () {
        var parentLayout = {};
        $(this.componentObject).parents("[type=layout],[type=bfd_panel]").each(function (index, item) {
            parentLayout.uri = $(item).attr("uri");
            parentLayout.dsname = $(item).attr("dsname");
            parentLayout.dsType = $(item).attr("dsType");
            parentLayout.definitionName = $(item).attr("definitionName");
            parentLayout.bfd_parent_uri = $(item).attr("bfd_parent_uri");
            parentLayout.bfd_set_type = $(item).attr("bfd_set_type");
            parentLayout.bfd_set_ref = $(item).attr("bfd_set_ref");
            parentLayout.bfd_set_param_type = $(item).attr("bfd_set_param_type");
            if (!parentLayout.bfd_set_param_type) {
                parentLayout.bfd_set_param_type = "in";
            }
            if (parentLayout.uri) {
                return false;
            }
        })

        return parentLayout;
    },
    /**
     * 获取父级容器uri
     * @returns {*}
     */
    getParentLayoutURI: function () {
        var selectedValue = this.getParentLayoutProperty(),
            bfd_parent_uri;
        if (selectedValue && selectedValue.uri) {
            bfd_parent_uri = selectedValue.uri;
            if (selectedValue.bfd_parent_uri) {
                bfd_parent_uri = selectedValue.bfd_parent_uri + "." + selectedValue.uri;
            }
        }

        return bfd_parent_uri;
    },

    /**
     * 是否是根布局器
     *
     * 修改：2016-9-18 如果父级布局器未绑定数据源，则当前布局器为根布局器具有avalon模型属性。
     */
    isRootLayout: function () {
        var isRoot = false;
        var parentLayout = this.getParentLayoutProperty();
        if (!parentLayout.uri) {
            isRoot = true;
        }

        return isRoot;
    },
    /**
     * 获取根布局器
     * @returns {*}
     */
    getRootLayout: function () {
        var rootLayout,that = this;
        $(".demo>.lyrow").each(function () {
            var child = $(this).find(that.componentObject);
            if (child.length > 0) {
                rootLayout = $(this).find("div[type]:first");
            }
        });

        return rootLayout;
    },

    /**
     * 判断当前布局器是否绑定字段
     * @returns {boolean}
     */
    isBindField:function() {
        if ($(this.componentObject).find("[field]").size() > 0) {
            return true;
        }

        return false;
    }
}