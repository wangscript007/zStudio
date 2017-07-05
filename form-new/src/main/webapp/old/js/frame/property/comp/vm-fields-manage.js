/**
 * vm 模型操作管理
 * @constructor
 */
;(function($) {

    /**
     * 设计页面模型管理
     * @constructor
     */
    var VMOperationManage = function () {
    }
    VMOperationManage.prototype = {
        /**
         * 获取用户自定义函数
         */
        getCustomOperations: function (vmid) {
            var operations = [];

            $("[bfd-operation-params]").each(function (index, item) {
                if ($(this).attr("ms-controller") !== vmid) {
                    return;
                }

                var params = $.parseJSON(decodeURIComponent($(item).attr("bfd-operation-params")) || '{}');
                operations = params.operations;
                return false;
            })

            return operations;
        },

        /**
         * 获取模型默认操作
         * @param url
         * @returns {Array}
         */
        getDefaultOperations: function (url) {
            var defaultOperations = [];
            defaultOperations.push({method: "POST", submit: "formOperator", url: url, name: "add"});
            defaultOperations.push({method: "PUT", submit: "formOperator", url: url, name: "update"});
            defaultOperations.push({method: "DELETE", submit: "delete", url: url, name: "delete"});
            defaultOperations.push({method: "GET", submit: "initVMData", url: url, name: "query"});
            return defaultOperations;
        }
    }


    /**
     * 设计页面组件管理
     * @constructor
     */
    var ComponentManage = function () {
    };
    ComponentManage.prototype = {
        /**
         * 获取所有VM组件
         * @returns {Array}
         */
        getMSController: function () {
            var controller = [];

            $("[ms-controller]").each(function (index, item) {
                var vmInfo = {};
                vmInfo.model = $(this).attr("ms-controller");
                vmInfo.service = $(this).attr("dsname");
                vmInfo.set = $(this).attr("uri");
                vmInfo.name = decodeURIComponent($(this).attr("compname"));

                var isExist = false;
                for (var i = 0; i < controller.length; i++) {
                    if (controller[i].model === vmInfo.model) {
                        isExist = true;
                    }
                }

                if (!isExist) {
                    controller.push(vmInfo);
                }
            })

            return controller;
        },


        /**
         * 获取对话框
         * @returns {Array}
         */
        getDialogs: function () {
            var result = [];
            var dialogs = $(".footer-bg [role=dialog]");
            $.each(dialogs, function (index, item) {
                var dialog = {};
                dialog.title = $(item).attr("bfd_dialog_title");
                dialog.id = $(item).attr("id");
                result.push(dialog);
            })

            return result;
        },


        /**
         * 获取设计页面下的远程表格
         * @returns {Array}
         */
        getTables: function () {
            var result = [];
            var tables = $(".demo [type=table_base]");
            $.each(tables, function (index, item) {
                var table = {};
                table.id = $(item).attr("compid");
                table.name = $(item).attr("compname");
                result.push(table);
            })

            return result;
        },


        /**
         * 清除对象数据源和模型信息
         * @param $layout
         */
        clearChildrenComponentDataField: function ($layout) {
            $layout.removeAttr("dsname").removeAttr("uri")
                .removeAttr("dstype").removeAttr("bfd_set_type")
                .removeAttr("bfd_parent_uri");

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

            return this;
        },


        /**
         * 清除模型信息
         * @param $layout
         */
        clearMSController: function ($layout) {
            $layout.find("[ms-controller][bfd-operation-params]").removeAttr("bfd-operation-params");
            $layout.find("[ms-controller]").removeAttr("ms-controller");

            return this;
        },


        /**
         * 是否绑定了数据源
         * @param $componentObject
         */
        isBindDataFields: function ($componentObject) {
            if ($componentObject.find("[field]").size() > 0) {
                return true;
            }

            return false;
        },

        /**
         * 获取表单设计器定义的组件对象
         * @param $componentObject
         */
        getBFDComponent: function ($componentObject) {
            var compType = $componentObject.attr("type"),
                $bfdComponent;

            /**
             * 查找设计器可识别的jquery对象
             */
            if (compType && $componentObject.prop("tagName") === "DIV") {
                $bfdComponent = $componentObject;
            } else {
                $bfdComponent = $componentObject.find("div[type]:first");
            }

            return $bfdComponent;
        },


        /**
         * 获取对象数据源层次
         * @param $componentObject
         */
        getComponentDataSourceLevel: function ($componentObject) {
            var dsLevel,
                $bfdComponent;

            $bfdComponent = this.getBFDComponent($componentObject);
            if (!$bfdComponent) {
                return dsLevel;
            }

            if ($bfdComponent.attr("uri")) {
                dsLevel = "self";
            } else if ($bfdComponent.parents("[uri]:first").length > 0) {
                dsLevel = "top";
            } else {
                dsLevel = "none";
            }

            return dsLevel;
        },


        /**
         * 获取布局组件数据源信息
         * @param dsLayout
         * @returns {{}}
         */
        getDSLayoutDataSourceInfo: function (dsLayout) {
            var dataSourceInfo = {};

            if (!dsLayout || dsLayout.length === 0) {
                return dataSourceInfo;
            }

            dataSourceInfo.uri = dsLayout.attr("uri");
            dataSourceInfo.dsname = dsLayout.attr("dsname");
            dataSourceInfo.dsType = dsLayout.attr("dsType");
            dataSourceInfo.bfd_parent_uri = dsLayout.attr("bfd_parent_uri");
            if (!dataSourceInfo.bfd_parent_uri) {
                dataSourceInfo.bfd_parent_uri = dataSourceInfo.uri;
            }

            return dataSourceInfo;
        },


        /**
         * 获取组件数据源信息
         * @param componentObject
         */
        getComponentDataSource: function ($componentObject) {
            var dataSourceInfo = {},
                $bfdComponent,
                dsLayout;

            /**
             * 如果未找到设计器可识别的对象，则返回。
             */
            $bfdComponent = this.getBFDComponent($componentObject);
            if (!$bfdComponent) {
                return dataSourceInfo;
            }


            /**
             * 查找包含量数据源信息的jquery对象
             */
            if ($bfdComponent.attr("uri")) {
                dsLayout = $bfdComponent;
            } else {
                dsLayout = $bfdComponent.parents("[uri]:first");
            }

            return this.getDSLayoutDataSourceInfo(dsLayout);
        },


        /**
         * 获取组件父级数据源信息
         * @param $componentObject
         * @returns {*|{}}
         */
        getComponentParentDataSource: function ($componentObject) {
            var dataSourceInfo = {},
                dsLayout = $componentObject.parents("[uri]:first");

            return this.getDSLayoutDataSourceInfo(dsLayout);
        },


        /**
         * 比较数据源是否相同
         * @param firstComponent
         * @param secondComponent
         * @param dsLevel（self：被比较对象本层包含数据源；top：被比较对象父级包含数据源;none:被比较对象不包含数据源)
         */
        compareDataSource: function (firstDataSource, secondDataSource, dsLevel) {
            /**
             * 数据源为空时
             */
            if ($.isEmptyObject(firstDataSource) && $.isEmptyObject(secondDataSource)) {
                return true;
            }

            if ($.isEmptyObject(firstDataSource) || $.isEmptyObject(secondDataSource)) {
                return false;
            }

            /**
             * 数据源不同时
             */
            if (firstDataSource.dsname !== secondDataSource.dsname) {
                return false;
            }

            /**
             * 父节点数据源不一致时
             */
            if (firstDataSource.bfd_parent_uri !== secondDataSource.bfd_parent_uri) {
                return false;
            }

            /**
             * 被比较对象本身包含数据源时，父级数据源相同，则认为数据源相同。
             */
            if (dsLevel && dsLevel === "self") {
                return true;
            }

            /**
             * 数据源不一致时
             */
            if (firstDataSource.uri !== secondDataSource.uri) {
                return false;
            }

            return true;
        }
    }

    $.bfd = $.bfd || {};
    $.bfd.ViewModel = $.bfd.ViewModel || {};
    $.bfd.ViewModel.operation = new VMOperationManage();
    $.bfd.ViewModel.component = new ComponentManage();
}($))


/**
 * 模型字段管理
 * @param componentObject
 * @constructor
 */
function VMDataFieldsManage(componentObject) {
    /**
     描述：获取当前组件所在的根布局器
     参数：无
     返回：根布局器
     */
    this.getRootLayout = function () {
        //var layout;
        //$(".demo>.lyrow").each(function () {
        //    var child = $(this).find(componentObject);
        //    if (child.length > 0) {
        //        layout = $(this).find(".row:first");
        //        return false;
        //    }
        //});
        //
        //return layout;

        return $(componentObject).parents("[ms-controller]:first");
    }


    /*
     描述：获取当前组件URI属性
     参数：无
     返回值：uri,dsname
     */
    this.getVMURI = function () {
        var parentLayout = {};
        $(componentObject).parents("[type=layout],[type=bfd_panel]").each(function (index, item) {
            parentLayout.uri = $(item).attr("uri");
            parentLayout.dsname = $(item).attr("dsname");
            parentLayout.dsType = $(item).attr("dsType");
            parentLayout.definitionName = $(item).attr("definitionName");
            parentLayout.bfd_parent_uri = $(item).attr("bfd_parent_uri");
            parentLayout.bfd_set_type = $(item).attr("bfd_set_type");
            parentLayout.relationmodel = $(item).attr("relationmodel");
            parentLayout.bfd_set_param_type = $(item).attr("bfd_set_param_type");
            if (parentLayout.uri) {
                return false;
            }
        })

        return parentLayout;
    }

    /**
     * 获取嵌套数据源路径
     */
    this.getURIPath = function () {
        var datasource = this.getVMURI(),
            parentUri = "";

        if (datasource.bfd_parent_uri) {
            parentUri = datasource.uri;
            if (datasource.bfd_parent_uri.indexOf(".") > -1) {
                parentUri = datasource.bfd_parent_uri.substring(datasource.bfd_parent_uri.indexOf(".") + 1);
                parentUri = parentUri + "." + datasource.uri;
            }
            parentUri += ".";
        }

        return parentUri;
    }
    /*
     描述：判断布局器是否设置了数据源
     参数：无
     返回值：uri
     */
    this.isSetVMURI = function () {
        var datasource = this.getVMURI();
        if (datasource.uri == undefined) {
            return false;
        }
        else {
            return true;
        }
    }

    /**
     * 获取当前URI下的所有字段
     * @param parentDataField 指定父级字段
     * @returns {Array} DataColumn 数组对象
     */
    this.getAllFields = function (parentDataField) {
        var ret = [];
        var datasource = this.getVMURI();
        if (datasource.dsType && datasource.dsType == "dataset" && datasource.relationmodel) {
            var model = $.parseJSON(decodeURIComponent(datasource.relationmodel)),
                fields = [];
            if (model.tableName === datasource.uri) {
                fields = model.fields;
            } else {
                $.each(model.slaveTables, function (index, slaveTable) {
                    if (slaveTable.tableName === datasource.uri) {
                        fields = model.fields;
                        return false;
                    }
                })
            }

            $.each(fields, function (index, item) {
                ret.push(new DataColumn(item.column_name, item.data_type, item.length));
            })
        } else if (datasource.uri != undefined) {
            var serviceName = datasource.dsname,
                parentUri = "",
                uri = datasource.uri;

            if (datasource.bfd_parent_uri) {
                serviceName = datasource.dsname + "." + datasource.bfd_parent_uri;
                parentUri = datasource.uri;
                if (datasource.bfd_parent_uri.indexOf(".") > -1) {
                    parentUri = datasource.bfd_parent_uri.substring(datasource.bfd_parent_uri.indexOf(".") + 1);
                    parentUri = parentUri + "." + datasource.uri;
                }
            }

            if (parentDataField) {
                uri += "." + parentDataField;
                parentUri += "." + parentDataField;
            }

            var fields = $.bfd.datasource().getDataSetFields(datasource.dsname, serviceName,
                uri, datasource.bfd_set_param_type);
            $.each(fields, function (index, item) {
                ret.push(new DataColumn(item.name, item.type, item.length, parentUri,item.displayName));
            })
        }

        return ret;
    }
    /*
     描述：获取当前组件所在VM中已使用的字段
     参数：无
     返回值：DataColumn 数组
     */
    this.getVMUsedFields = function () {
        var ret = [];
        var layout = this.getRootLayout();
        if (layout != undefined) {
            var dataColumns = this.getAllFields();
            layout.find("[ms-duplex]").each(function () {
                var fieldName = $(this).attr("ms-duplex");
                for (var i = 0; i < dataColumns.length; i++) {
                    if (dataColumns[i].columnName == fieldName &&
                        $(componentObject).attr("id") != $(this).attr("id"))
                        ret.push(dataColumns[i]);
                }
            });
        }

        return ret;
    }
    /*
     描述：获取当前组件所在VM中已使用并标记的字段
     参数：无
     返回值：DataColumn 数组
     */
    this.getVMAllFlagFields = function (attrField) {
        var dataColumns = [];
        var layout = this.getRootLayout();
        if (layout != undefined) {
            dataColumns = this.getAllFields();
            if ($.isArray(dataColumns)) {
                //解决上次绑定后删除组件属性未更新问题
                for (var i = 0; i < dataColumns.length; i++) {
                    dataColumns[i].setFlag(false);
                }

                var fields = layout.find("div[" + attrField + "]");

                if (fields.length > 0) {
                    fields.each(function () {
                        var fieldName = $(this).attr(attrField);
                        for (var i = 0; i < dataColumns.length; i++) {
                            var columnValue = dataColumns[i].columnName;
                            if (dataColumns[i].parentUri) {
                                columnValue = dataColumns[i].parentUri + "." + columnValue;
                            }

                            if (columnValue === fieldName) {
                                dataColumns[i].setFlag(true);
                            }
                        }
                    });
                }
            } else {
                dataColumns = [];
            }
        }

        return dataColumns;
    }
    /*
     描述：获取字段定义
     参数：字段名称
     返回值：DataColumn对象
     */
    this.getColumnByName = function (fieldName, dataColumns) {
        if (dataColumns != undefined) {
            for (var i = 0; i < dataColumns.length; i++) {
                if (dataColumns[i].columnName == fieldName)
                    return dataColumns[i];
            }
        }
    }

    /*
     描述：获取vm中未使用的字段
     参数：无
     返回值：DataColumn对象
     */
    this.getVMUnusedFields = function () {
        var ret = [];
        var allFields = this.getAllFields();
        var usedFields = this.getVMUsedFields();
        if (allFields != undefined) {
            if (usedFields == undefined) {
                ret = allFields;
            }
            else {
                for (var i = 0; i < allFields.length; i++) {
                    var isUsed = false;
                    for (var j = 0; j < usedFields.length; j++) {
                        if (usedFields[j].columnName == allFields[i].columnName) {
                            isUsed = true;
                            break;
                        }
                    }

                    if (!isUsed) {
                        ret.push(allFields[i]);
                    }
                }
            }
        }

        return ret;
    }

    /**
     * 清除数据字段属性定义
     * @param componentObject
     */
    this.clearDataFieldAttr = function () {
        $(componentObject).find("[ms-duplex]").removeAttr("ms-duplex");
        $(componentObject).find("[ms-duplex-number]").removeAttr("ms-duplex-number");
        $(componentObject).find("[ms-duplex-string]").removeAttr("ms-duplex-string");
        $(componentObject).find("[field]").removeAttr("field");
        $(componentObject).find("[fieldtype]").removeAttr("fieldtype");
    }
}