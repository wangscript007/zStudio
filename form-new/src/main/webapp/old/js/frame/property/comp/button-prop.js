/**
 * 按钮用户自定义函数属性绑定
 * @constructor
 */
var ButtonOperationBindCustomProp = function(componentObject){
    this.componentObject = componentObject;
    this.tableId = "button_operations_table";
    this._registerEvent();
}

ButtonOperationBindCustomProp.prototype = {
    getHtml: function () {
        var html = [];
        html.push('<table id="' + this.tableId + '" style="width: 100%;margin-top:5px">');
        html.push(this._getConfigRow(this._getProperty()));
        html.push("</table>");
        return html.join(' ');
    },
    /**
     * 移除属性
     */
    removeProperty: function () {
        $(this.componentObject).removeAttr("bfd-button-operations");
    },

    /**
     * 获取属性
     * @returns {*|jQuery}
     * @private
     */
    _getProperty: function () {
        var property = $(this.componentObject).attr("bfd-button-operations");
        if (property) {
            property = $.parseJSON(decodeURIComponent(property));
        } else {
            property = [{model: "", method: ""}];
        }

        return property;
    },

    /**
     * 注册事件
     * @private
     */
    _registerEvent: function () {
        var $that = this;

        $('.properties .form-panel-body')
            .off('click', '.toolbar-btn-row-add').on('click', '.toolbar-btn-row-add', function () {
                var options = [{model: "", method: ""}];
                $("#" + $that.tableId).append($that._getConfigRow(options));
            })
            .off('click', '.toolbar-btn-row-remove').on('click', '.toolbar-btn-row-remove', function (e) {
                $(this).parent().parent().remove();
                $that._setButtonOperationProperty();
                e.stopPropagation();
            })
            .off('change', '.btn-config-vm-select').on('change', '.btn-config-vm-select', function (e) {
                $(this).parent().next().empty().append($that._getVMOperations($(this).val(), ""));
                $that._setButtonOperationProperty();
                e.stopPropagation();
            })
            .off('change', '.btn-config-method-select').on('change', '.btn-config-method-select', function (e) {
                $that._setButtonOperationProperty();
                e.stopPropagation();
            })
    },

    /**
     * 获取配置行html
     * @param options
     * @returns {*}
     * @private
     */
    _getConfigRow: function (options) {
        if (!options) {
            return "";
        }

        var html = [], $that = this;
        $.each(options, function (index, item) {
            html.push("<tr><td style='width:40%'>");
            html.push($that._getVMOptions(item.model));
            html.push("</td>");

            html.push("<td style='width:40%'>");
            html.push($that._getVMOperations(item.model, item.method));
            html.push("</td>");

            html.push("<td>");
            html.push('<button type="button" style="margin-right: 2px;" class="btn btn-info btn-xs toolbar-btn-row-add col-md-5">+</button>');
            html.push('<button type="button" class="btn btn-danger btn-xs toolbar-btn-row-remove col-md-5">-</span></button>');
            html.push("</td></tr>");
        })

        return html.join(" ");
    },


    /**
     * 获取vm模型
     * @param selectedVM
     * @returns {string}
     * @private
     */
    _getVMOptions: function (selectedVM) {
        var html = [];
        html.push('<select class="form-textbox form-textbox-text col-md-12 btn-config-vm-select">');
        html.push('<option value=""><-选择对象-></option>');

        var viewModels = $.bfd.ViewModel.component.getMSController();
        if (viewModels && viewModels.length > 0) {
            $.each(viewModels, function (index, item) {
                if(!item.set){
                    return;
                }

                var selected = "";
                if (selectedVM === item.model) {
                    selected = "selected";
                }

                html.push('<option service ="' + item.service + '" set= "' + item.set + '" '
                    + selected + ' value="' + item.model + '">' + item.name + '</option>');
            })
        }

        html.push("</select>");
        return html.join(" ");
    },


    /**
     * 获取自定义函数
     * @param selectedVM
     * @param selectedMethod
     * @returns {string}
     * @private
     */
    _getVMOperations: function (selectedVM, selectedMethod) {
        var html = [];
        html.push('<select class="form-textbox form-textbox-text col-md-12 btn-config-method-select">');
        var operations = $.bfd.ViewModel.operation.getCustomOperations(selectedVM);
        html.push('<option value=""><-选择函数-></option>');
        if (operations && operations.length > 0) {
            $.each(operations, function (index, item) {
                if (!item.method) {
                    return;
                }

                var selected = "";
                if (selectedMethod === item.method) {
                    selected = "selected";
                }

                html.push('<option method ="' + item.method + '" ' + selected + ' value="' + item.submit + '">' + item.name + '</option>');
            })
        }

        html.push("</select>");
        return html.join(" ");
    },

    /**
     * 设置按钮操作属性
     * @private
     */
    _setButtonOperationProperty: function () {
        var operation = [];

        $("#" + this.tableId + " tr").each(function (index, item) {
            var $vmOption = $(item).find(".btn-config-vm-select option:selected"),
                $fnOption = $(item).find(".btn-config-method-select option:selected");

            var model = $vmOption.val(),
                submit = $fnOption.val(),
                service = $vmOption.attr("service"),
                set = $vmOption.attr("set"),
                method = $fnOption.attr("method");

            if (model && submit) {
                var isSelected = false;
                $.each(operation, function (index, item) {
                    if (item.model === model && item.submit === submit && item.method === method) {
                        isSelected = true;
                        return false;
                    }
                })

                if (isSelected) {
                    $(item).find(".btn-config-method-select").val("");
                    bootbox.alert("已经选择了模型:[" + model + "]方法:[" + submit + "],不能重复选择！");
                } else {
                    operation.push({model: model, submit: submit, service: service, set: set, method: method});
                }
            }
        })

        if (operation.length > 0) {
            $(this.componentObject).attr("bfd-button-operations", encodeURIComponent(JSON.stringify(operation)));
            $(this.componentObject).find('button:first').attr("bfd-button-operations", encodeURIComponent(JSON.stringify(operation)));
        } else {
            $(this.componentObject).removeAttr("bfd-button-operations");
        }
    }
}





/**
 * 对话框按钮绑定
 * @constructor
 */
var ButtonDialogBindCustomProp = function(componentObject){
    this.componentObject = componentObject;
    this.tableId = "button_operations_table";
    this._registerEvent();
}

ButtonDialogBindCustomProp.prototype = {
    getHtml: function () {
        var html = [];
        html.push('<table id="' + this.tableId + '" style="width: 100%;margin-top:5px">');
        html.push("<tr><td>");
        html.push(this._getDialogOptions(this._getProperty()));
        html.push("</td>");
        html.push("</tr></table>");
        return html.join(' ');
    },
    /**
     * 移除属性
     */
    removeProperty: function () {
        $(this.componentObject).removeAttr("bfd-button-dialog");
        $(this.componentObject).find('button:first').removeAttr("bfd-button-dialog");
    },

    /**
     * 获取属性
     * @returns {*|jQuery}
     * @private
     */
    _getProperty: function () {
       return $(this.componentObject).find('button:first').attr("bfd-button-dialog");
    },

    /**
     * 注册事件
     * @private
     */
    _registerEvent: function () {
        var $that = this;

        $('.properties .form-panel-body').off("change", ".btn-config-dialog-select")
            .on('change', '.btn-config-dialog-select', function (e) {
                e.stopPropagation();
                e.preventDefault();

                var dialogId = $(this).val();
                if (dialogId) {
                    $that.componentObject.attr("bfd-button-dialog", $(this).val());
                    $that.componentObject.find('button:first').attr("bfd-button-dialog", $(this).val());
                } else {
                    $that.componentObject.removeAttr("bfd-button-dialog");
                    $that.componentObject.find('button:first').removeAttr("bfd-button-dialog");
                }
            })
    },

    /**
     * 获取对话框
     * @param selectedVM
     * @returns {string}
     * @private
     */
    _getDialogOptions: function (selectedDialog) {
        var html = [];
        html.push('<select class="form-textbox form-textbox-text col-md-12 btn-config-dialog-select">');
        html.push('<option value=""><-选择对话框-></option>');

        var dialogs = $.bfd.ViewModel.component.getDialogs();
        if (dialogs && dialogs.length > 0) {
            $.each(dialogs, function (index, item) {
                var selected = "";
                if (selectedDialog === item.id) {
                    selected = "selected";
                }

                var title = item.title;
                if (!title) {
                    title = item.id;
                }

                html.push('<option ' + selected + '  value="' + item.id + '">' + title + '</option>');
            })
        } else {
            bootbox.alert("请先添加对话框组件后，再关联按钮对话框！");
        }

        html.push("</select>");
        return html.join(" ");
    }
}


/**
 * 对话框按钮绑定
 * @constructor
 */
var ButtonLinkBindCustomProp = function(componentObject){
    this.componentObject = componentObject;
    this.tableId = "button_operations_table";
    this._registerEvent();
}

ButtonLinkBindCustomProp.prototype = {
    getHtml: function () {
        var $comp = $(this.componentObject),
            value = $comp.attr('bfd-button-link');
        if(!value) {
            value = '';
        }
        var html = [];
        html.push('<table id="' + this.tableId + '" style="width: 100%;margin-top:5px">');
        html.push("<tr><td>");
        html.push('<input type="text" class="form-textbox form-textbox-text col-md-12 btn-config-link-input" value="'+value+'" />');
        html.push("</td>");
        html.push("</tr></table>");
        return html.join(' ');
    },
    /**
     * 移除属性
     */
    removeProperty: function () {
        $(this.componentObject).removeAttr("bfd-button-link");
        $(this.componentObject).find('button:first').removeAttr("bfd-button-link");
    },

    /**
     * 获取属性
     * @returns {*|jQuery}
     * @private
     */
    _getProperty: function () {
        return $(this.componentObject).find('button:first').attr("bfd-button-link");
    },

    /**
     * 注册事件
     * @private
     */
    _registerEvent: function () {
        var $that = this;
        $('.properties .form-panel-body').off("input", ".btn-config-link-input")
            .on('input', '.btn-config-link-input', function (e) {
                e.stopPropagation();
                $that.componentObject.attr("bfd-button-link", $(this).val());
                $that.componentObject.find('button:first').attr("bfd-button-link", $(this).val());
            })
    },
}




/**
 * 查询绑定
 * @constructor
 */
var ButtonQueryBindCustomProp = function(componentObject){
    this.componentObject = componentObject;
    this.tableId = "button_operations_table";
    this._registerEvent();
}

ButtonQueryBindCustomProp.prototype = {
    getHtml: function () {
        var html = [];
        html.push('<table id="' + this.tableId + '" class="table table-bordered" style="width: 100%;margin-top:5px;"><tr>');

        var property = this._getProperty();
        html.push('<tr><td style="width: 20%;">表单:</td>');
        html.push("<td>" + this._getVMOptions(property.modelId) + "</td></tr>");

        html.push('<tr><td style="width:20%;">表格:</td>');
        html.push("<td>" + this._getTableOptions(property.tableId) + "</td></tr>");

        html.push("</table>");
        return html.join(' ');
    },
    /**
     * 移除属性
     */
    removeProperty: function () {
        $(this.componentObject).removeAttr("bfd-button-query");
        $(this.componentObject).find('button:first').removeAttr("bfd-button-query");
    },

    /**
     * 获取属性
     * @returns {*|jQuery}
     * @private
     */
    _getProperty: function () {
        var property = $(this.componentObject).find('button:first').attr("bfd-button-query");
        if (!property) {
            property = {tableId: "", modelId: ""};
        } else {
            property = JSON.parse(decodeURIComponent(property));
        }

        return property;
    },

    /**
     * 注册事件
     * @private
     */
    _registerEvent: function () {
        var $that = this;

        $('.properties .form-panel-body')
            .off("change", ".btn-config-table-select,.btn-config-vm-select")
            .on('change', '.btn-config-table-select,.btn-config-vm-select', function (e) {
                e.stopPropagation();
                e.preventDefault();

                $that._setProperty();
            })
    },
    _setProperty:function(){
        var property = {};
        property.tableId = $(".btn-config-table-select").val();
        property.modelId = $(".btn-config-vm-select").val();
        $(this.componentObject).attr("bfd-button-query",encodeURIComponent(JSON.stringify(property)));
        $(this.componentObject).find('button:first').attr("bfd-button-query",encodeURIComponent(JSON.stringify(property)));
    },

    /**
     * 获取表格
     * @param selectedVM
     * @returns {string}
     * @private
     */
    _getTableOptions: function (selectedTableId) {
        var html = [];
        html.push('<select class="form-textbox form-textbox-text col-md-12 btn-config-table-select">');
        html.push('<option value=""><-选择表格-></option>');

        var dialogs = $.bfd.ViewModel.component.getTables();
        if (dialogs && dialogs.length > 0) {
            $.each(dialogs, function (index, item) {
                var selected = "";
                if (selectedTableId === item.id) {
                    selected = "selected";
                }

                html.push('<option ' + selected + '  value="' + item.id + '">' + item.name + '</option>');
            })
        } else {
            bootbox.alert("请先添加远程表格组件后，再关联查询对话框！");
        }

        html.push("</select>");
        return html.join(" ");
    },
    _getVMOptions: function (selectedVM) {
        var html = [];
        html.push('<select class="form-textbox form-textbox-text col-md-12 btn-config-vm-select">');
        html.push('<option value=""><-选择表单模型-></option>');

        var dialogs = $.bfd.ViewModel.component.getMSController();
        if (dialogs && dialogs.length > 0) {
            $.each(dialogs, function (index, item) {
                if (!item.set) {
                    return;
                }

                var selected = "";
                if (selectedVM === item.model) {
                    selected = "selected";
                }

                html.push('<option ' + selected + '  value="' + item.model + '">' + item.name + '</option>');
            })
        } else {
            bootbox.alert("请先添加表单模型后，再关联查询按钮！");
        }

        html.push("</select>");
        return html.join(" ");
    }
}




/**
 * 按钮操作属性绑定框架
 * @param componentObject
 * @constructor
 */
var ButtonOperationBindProp = function(componentObject) {
    this.componentObject = componentObject;
    this.buttonTypeId = "button_type_select";
    this.extendContainerId = "button_extend_container";

    this._registerEvent();
}

/**
 * 按钮类型
 * @type {*[]}
 */
ButtonOperationBindProp.ButtonType = {
    submit: {
        name: "提交",
        msclick: "submit"
    },
    batchSubmit: {
        name: "批量提交",
        msclick: "batchSubmit"
    },
    reset: {
        name: "重置",
        msclick: "reset"
    },
    query: {
        name: "查询",
        class: ButtonQueryBindCustomProp
    },
    dialog: {
        name: "对话框",
        class: ButtonDialogBindCustomProp
    },
    link: {
        name: "超链接",
        class: ButtonLinkBindCustomProp
    },
    userdefine: {
        name: "自定义",
        class: ButtonOperationBindCustomProp
    }
}


ButtonOperationBindProp.prototype = {
    /**
     * 获取配置项html
     */
    getHtml: function () {
        var property = this._getProperty();
        var html = [];
        html.push(this._getButtonTypeHtml(property));
        html.push(this._getExtendContainerHtml(property));
        return html.join(' ');
    },

    /**
     * 获取扩展html
     * @param type
     * @returns {*}
     * @private
     */
    _getExtendHtml: function (type) {
        var extendObject = ButtonOperationBindProp.ButtonType[type];
        if (extendObject && extendObject.class) {
            return (new extendObject.class(this.componentObject)).getHtml();
        }

        return "";
    },
    /**
     * 移除扩展属性
     * @param type
     * @returns {*|string}
     * @private
     */
    _removeExtendProperty: function (type) {
        var extendObject = ButtonOperationBindProp.ButtonType[type];
        if (extendObject && extendObject.class) {
            return (new extendObject.class(this.componentObject)).removeProperty();
        }
    },

    /**
     * 获取按钮类型选项
     * @param selectType
     */
    _getButtonTypeHtml: function (type) {
        var html = ['<select id="' + this.buttonTypeId
        + '" class="form-textbox form-textbox-text col-md-12">'];
        html.push('<option value=""><-选择类型-></option>');
        $.each(ButtonOperationBindProp.ButtonType, function (index, item) {
            var selected = "";
            if (type === index) {
                selected = "selected";
            }

            html.push('<option  value="' + index + '" ' + selected + '>'
                + item.name + '</option>');
        })

        html.push("</select>");
        return html.join(" ");
    },

    /**
     * 获取扩展html
     * @param type
     * @returns {string}
     * @private
     */
    _getExtendContainerHtml: function (type) {
        var html = this._getExtendHtml(type);
        return '<div id="' + this.extendContainerId + '">' + html + '</div>';
    },

    /**
     * 获取配置选项
     */
    _getProperty: function () {
        return $(this.componentObject).attr("buttontype");
    },

    /**
     * 注册事件
     */
    _registerEvent: function () {
        var that = this;
        $('.properties .form-panel-body').off('change', '#' + this.buttonTypeId)
            .on('change', '#' + this.buttonTypeId, function () {
                that._removeExtendProperty(that._getProperty());
                $("#" + that.extendContainerId).empty().append(that._getExtendHtml($(this).val()));
                that._setProperty($(this).val());
            })
    },
    /**
     * 设置组件属性
     * @param buttonType
     * @private
     */
    _setProperty: function (buttonType) {
        var $component = $(this.componentObject);
        var msClick = ButtonOperationBindProp.ButtonType[buttonType].msclick;
        if (msClick) {
            $component.find("button:first").attr("ms-click", buttonType);
        } else {
            $component.find("button:first").removeAttr("ms-click");
        }

        $component.attr("buttontype", buttonType);
    }
}



