var frameHtmlObj = {};
var downloadlayout = $('<div id="download-layout"><div class="container"></div></div>')

function getFormatCode() {
    $(frameHtmlObj).find(".column").each(function(index, el) {
        layoutResize($(el));
    });

    var tableComponent = new TableComponent();
    tableComponent.sourceCodeOperatorBefore($(frameHtmlObj));

    var fileUpload = new FileUploadComponent();
    fileUpload.sourceCodeOperatorBefore($(frameHtmlObj));
    var multiSelect = new MultipleSelectComponent();
    multiSelect.sourceCodeOperatorBefore($(frameHtmlObj));
    $(frameHtmlObj).btnGroup('clean');
    $(frameHtmlObj).bfdIcon('clean');
    $(frameHtmlObj).bfdPanel("clean");
    //pc端代码清理
    if (typeof (bfdPc) !== 'undefined') {
        bfdPc.cleanFrame();
    }

    $(downloadlayout).children().empty();
    $(downloadlayout).children().html($(frameHtmlObj).find(".demo").html());

    var t = adjustCss();

    t.addClass("container-top");
    t.find('div[ms-controller]').each(function () {
        var $this = $(this);
        $this.addClass("form-horizontal");
        //布局器的样式判断和保存
        if ($this.attr("layoutstyle") != undefined && $this.attr("layoutstyle") != "") {
            var customStyle = $this.attr("layoutstyle");
            $this.addClass(customStyle);
        }

        $this.find('div[type="layout"]').each(function () {
            var $layout = $(this);
            $layout.attr("id", $layout.attr("compid"));
            $layout.addClass("form-group");
            //判断无title时上移10px分隔栏
            $layout.find('div[type="separator"]').each(function () {
                var $separator = $(this);
                var separVal = $separator.find(".title").html().trim();
                if (separVal == "" || separVal == undefined) {
                    $layout.css("height", "10px");
                    $separator.children().css("height", "10px");
                }
            });
            //增加布局器样式
            if ($layout.attr("layoutstyle") != undefined && $layout.attr("layoutstyle") != "") {
                var customStyle = $layout.attr("layoutstyle");
                $layout.addClass(customStyle);
            }
        });
        $this.find('div.form-group>.row').each(function () {
            var $this = $(this);

            var group = [];

            $this.find("input").each(function () {
                $(this).attr("data-bv-group", ".group").parent().addClass("group");
            });

            for (var i in group) {
                $(this).append(group[i]);
            }

        });

        $this.find(".row").each(function () {
            //$(this).addClass("layout-row-width");
            $(this).removeClass("clearfix column ui-droppable");
        });

    });

    var code = $.htmlClean($(downloadlayout).html(), {
        format: true,
        allowedAttributes: [
            ["compid"],
            ["id"],
            ["class"],
            ["placeholder"],
            ["data-toggle"],
            ["data-target"],
            ["data-parent"],
            ["role"],
            ["data-dismiss"],
            ["data-ly-params"],
            ["aria-labelledby"],
            ["data-bv-group"],
            ["aria-hidden"],
            ["data-slide-to"],
            ["data-slide"],
            ["ms-controller"],
            ["ms-duplex"],
            ["ms-attr-value"],
            ["ms-click"],
            ["ms-duplex-number"],
            ["ms-duplex-string"],
            ["ms-repeat-e1"],
            ["ms-attr-disabled"],
            ["fileuploadurl"],
            ["type"],
            ["allowedfileextensions"],
            ["data-show-preview"],
            ["i18nkey"],
            ["i18nkeyforph"],
            ["style"],
            ["href"],
            ["onclick"],
            ["width"],
            ["height"],
            ["src"],
            ["dstype"],
            ["definitionname"],
            ["relationmodel"],
            ["waypointsetting"],
            ["data-submit-type"],
            ["data-min-level"],
            ["data-max-level"],
            ["readonly"],
            ["srcfield"],
            ['submit-event'],
            ['data-products'],
            ["data-params"],
            ["data-switchsize"],
            ["data-switchcolor"],
            ["switch-event"],
            ["data-defaultvalue"],
            ["field"],
            ["bfd-button-dialog"],
            ["bfd-button-query"],
            ["bfd-operation-params"],
            ["bfd-button-operations"],
            ["bfd-query-operation"],
            ["bfd-uri-path"],
            ["data-mobile"],
            ["ms-text"],
            ["compsrc"],
            ["componentevent"],
            ["data-function"],
            ["relatedatrrbutes"],
            ["bfd-button-link"],
            ["bfd-panel-height"],
            ["bfd-panel-scrollbar-style"]
        ],
        removeTags: []
    });
    tableComponent.sourceCodeOperatorAfter($(frameHtmlObj)); 
    //tableComponent.sourceCodeOperatorAfter($(frameHtmlObj));
    fileUpload.sourceCodeOperatorAfter($(frameHtmlObj));
    //treeComponent.sourceCodeOperatorAfter($(frameHtmlObj));
    multiSelect.sourceCodeOperatorAfter($(frameHtmlObj));
    //chartsComponent.sourceCodeOperatorAfter($(frameHtmlObj));
    $(frameHtmlObj).btnGroup('restore');
    //$(frameHtmlObj).bfdIcon('restore');
    $(frameHtmlObj).bfdPanel("restore");

    if (typeof (bfdMobile) !== 'undefined') {
        bfdMobile.restoreFrame();
    }

    //pc端代码清理
    if (typeof (bfdPc) !== 'undefined') {
        bfdPc.restoreFrame();
    }

    var imgageComponent = new ImageComponent();
    code = imgageComponent.sourceCodeOperator($(code));
    var tabComponent = new TabComponent();
    code = tabComponent.sourceCodeOperator($(code));
    var collapseComponent = new CollapseComponent();
    code = collapseComponent.sourceCodeOperator($(code));
    return code;
}

function ReferenceManage() {
    this.data = (function ($) {
        var result;
        $.ajax({
            async: false,
            cache: false,
            type: "GET",
            dataType: "json",
            url: "/designer/js/frame/referenceConfig.json",
            success: function (data) {
                    result = data;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log("请求服务错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
                }
        });
        return result;

    })(jQuery);
}
ReferenceManage.prototype = {
    getJS: function () {
            var that = this;
            if (!that.data) {
                return [];
            }

            var result = new Map();
            var components = this.getComponentTypes();
            $.each(components,
                function (index, item) {
                    if (!that.data[item]) {
                        return;
                    }

                    var jses = that.data[item].js;
                    if (jses && jses.length > 0) {
                        $.each(jses,
                            function (subIndex, subItem) {
                                result.put(subItem, subItem);
                            })
                    }
                })

            return result.keySet();
        },
        getCSS: function () {
            var that = this;
            if (!that.data) {
                return [];
            }

            var result = new Map();
            var components = this.getComponentTypes();
            $.each(components,
                function (index, item) {
                    if (!that.data[item]) {
                        return;
                    }

                    var csses = that.data[item].css;
                    if (csses && csses.length > 0) {
                        $.each(csses,
                            function (subIndex, subItem) {
                                result.put(subItem, subItem);
                            })
                    }
                })

            return result.keySet();
        },
        getComponentTypes: function () {
            var componentTypes = new Map();
            componentTypes.put("base", "base");
            $("#container_data div[type]").each(function (index, item) {
                var type = $(item).attr("type");
                componentTypes.put(type, type);
            });
            componentTypes.put("base_end", "base_end");
            return componentTypes.keySet();
        }
}

function getPageVM() {
    var vms = $(frameHtmlObj).find("div[ms-controller]");
    var result = new Array();
    $.each(vms,
        function (index, item) {
            var vmid = $(item).attr("ms-controller");
            // form类型的vm
            var vmType = "form";
            if ($(item).find("div[type='table_base'],div[type='table_base_local']").size() > 0) {
                vmType = "table";
            }

            if ($(item).find("div[type='table_base_local']").parents("[type=layout][bfd_set_type=array]").size() > 0) {
                vmType = "form";
            }

            if ($(item).find("div[type='imgBar'],div[type='imgPie'],div[type='imgLine'],div[type='imgConnect'],div[type='imgMap']").size() > 0) {
                vmType = "chart";
            }

            if ($(item).find("div[type=product_list]").size() > 0) {
                vmType = "display";
            }

            //获取字段
            var fields = "fields=form_field="; //这里存在传入多个参数的情况
            var valid = "componentvalid=";
            var fieldCounter = 0;
            $.each($(item).find("div[type='input_text'],div[type='textarea'],div[type='select_static'],div[type='select_dynamic'],div[type='input_radio'],div[type='checkbox'],div[type='input_datetime'],div[type='input_fileinput'],div[type=chinese_region]>div>[compname],div[type=image],div[type=m_switch],div[type='label'],div[type=advanced_select]"),
                function (index, value) {
                    var field = $(value);
                    var hasValid = false;
                    var tmpValid = "";
                    var id = getFieldid(field);
                    if (!id) {
                        return;
                    }
                    var type = field.attr("fieldtype");
                    if (type == undefined) {
                        type = "string";
                    }

                    fields = fields + "id=" + id + ",type=" + type + ",";
                    if (typeof field.attr("defaultvalue") !== "undefined") {
                        //处理多值绑定问题，属性默认值从服务端解码。
                        fields += "defaultvalue=" + escape2Html(field.attr("defaultvalue"));
                    } else {
                        fields += "defaultvalue=";
                    }
                    fields += ",componenttype=" + getComponentType(field);

                    var $parentUri = $(field).parents("[uri]:first"),
                        parenttype = "";
                    if ($parentUri) {
                        parenttype = $parentUri.attr("bfd_set_type");
                    }
                    if (parenttype) {
                        fields += ",parenttype=" + parenttype + "@";
                    } else {
                        fields += ",parenttype=@";
                    }

                    if (field.attr("vnotempty") != undefined) {
                        hasValid = true;
                        tmpValid = tmpValid + "vnotempty=" + field.attr("vnotempty");
                    }
                    if (field.attr("vstringlength") != undefined) {
                        if (hasValid) {
                            tmpValid = tmpValid + ",";
                        }
                        hasValid = true;
                        tmpValid = tmpValid + "vstringlength=" + field.attr("vstringlength");
                    }
                    if (field.attr("vtype") != undefined) {
                        if (hasValid) {
                            tmpValid = tmpValid + ",";
                        }
                        hasValid = true;
                        tmpValid = tmpValid + "vtype=" + field.attr("vtype") + ",vcontent=" + encodeURIComponent(escape2Html(decodeURIComponent(field.attr("vcontent"))));
                    }
                    if (hasValid) {
                        valid += "name=" + field.attr("compname") + "," + tmpValid + "@";
                    }
                    fieldCounter++;

                });

            //处理form中包含表格的情况，当本地表格绑定的是数组对象时，则将其放在表单模型中生成vm对象。
            var tableParams = "tableParams=";
            if (vmType === "form") {
                $(item).find("div[type='table_base_local']").each(function (index, table) {
                    fieldCounter++;
                    var tableColumns = $(table).attr("field");
                    if (tableColumns) {
                        fields += decodeURIComponent(tableColumns);
                        tableParams += "querycolumns=" + $(table).attr("querycolumns") + ",";
                        tableParams += "tableid=" + $(table).attr("compid") + ",";
                        tableParams += "parameter=" + $(table).attr("parameter") + ",";
                        tableParams += "formuri=" + $(table).attr("formuri") + "@";
                    }
                })
            }

            //树组件
            $(item).find("div[type=tree]").each(function (index, tree) {
                fieldCounter++;
            })

            //获取事件
            var event = "componentevent=";
            $.each($(item).find("div[componentevent]"),
                function (index, value) {
                    event = event + $(value).attr("componentevent") + "@";
                });

            if (fieldCounter == 0 && vmType == "form" && event == "componentevent=") {
                return true;
            }

            //获取需要初始化的组件的属性值
            var customAttrbutes = "customAttrbutes=" + getCustomAttributes($(item));

            //获取组件是否可编辑信息
            //var editor = getEditable($(item));
            //获取日期组件
            var datetimes = getDateTimePicker($(item));

            //获取组件可显示属性
            var visibility = getComponentVisibility($(item));

            //参数完毕使用分号，参数内部嵌套使用逗号分割，fields内部多个之间使用#号分隔，每个参数内部使用@符号
            if (vmType == "form") {
                var vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + $(item).attr("dsname") + ";uri=" + $(item).attr("uri") + ";method=POST;";
                result.push(vmInfo + fields + ";" + event + ";" + valid + ";" + customAttrbutes + ";" + datetimes + ";" + visibility + tableParams);
            }

            //table类型的vm
            else if (vmType == "table") {
                var vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + $(item).attr("dsname") + ";uri=" + $(item).attr("uri") + ";method=GET;";
                var datasourceInfo = new ComponentDataFieldsManage($(item).find("div[type='table_base'],div[type='table_base_local']"));
                if (datasourceInfo.isSetDataSourceInfo()) {
                    vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + datasourceInfo.getDataSourceName() + ";uri=" + datasourceInfo.getUri() + ";method=GET;";
                }

                var tableParams = "tableParams=";
                $(item).find("div[type='table_base'],div[type='table_base_local']").each(function (index, table) {
                    tableParams += "querycolumns=" + $(table).attr("querycolumns") + ",";
                    tableParams += "tableid=" + $(table).attr("compid") + ",";
                    tableParams += "parameter=" + $(table).attr("parameter") + ",";
                    tableParams += "formuri=" + $(table).attr("formuri") + "@";
                })

                result.push(vmInfo + fields + ";" + event + ";" + valid + ";" + customAttrbutes + ";" + datetimes + ";" + visibility + tableParams);
            }

            //chart类型的vm
            else if (vmType == "chart") {
                var chartItem = $(item).find("div[type='imgBar'],div[type='imgPie'],div[type='imgLine'],div[type='imgConnect'],div[type='imgMap']");
                for (var i = 0; i < chartItem.length; i++) {
                    var opt = $(chartItem[i]).attr("chartoption");
                    var imgId = $(chartItem[i]).attr("compid");
                    var vmInfo = "vmtype=" + vmType + ";vmid=" + imgId + ";;;;;customAttrbutes=" + opt + ";option=" + opt;
                    result.push(vmInfo);
                }
            }
            //数据列表展示组件
            else if (vmType == "display") {
                var vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + $(item).attr("dsname") + ";uri=" + $(item).attr("uri") + ";method=GET;";
                var datasourceInfo = new ComponentDataFieldsManage($(item).find("div[type='product_list']"));
                if (datasourceInfo.isSetDataSourceInfo()) {
                    vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + datasourceInfo.getDataSourceName() + ";uri=" + datasourceInfo.getUri() + ";method=GET;";
                }
                var compid = "compid=" + $(item).find("div[type='product_list']").attr("compid") + ";";
                result.push(vmInfo + fields + ";" + event + ";" + valid + ";" + customAttrbutes + ";" + datetimes + ";" + visibility + compid);
            }

        });
    return result;
}

/**
 * 调整生成代码的css，去掉不需要的css
 */
function adjustCss() {
   var t = $(downloadlayout).children();
    t.find(".preview, .configuration, .drag, .remove").remove();
    t.find(".lyrow").addClass("removeClean");
    t.find(".box-element").addClass("removeClean");
    _adjustOrder(t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean"));
    _adjustOrder(t.find(".lyrow .lyrow .lyrow .lyrow .removeClean"));
    _adjustOrder(t.find(".lyrow .lyrow .lyrow .removeClean"));
    _adjustOrder(t.find(".lyrow .lyrow .removeClean"));
    _adjustOrder(t.find(".lyrow .removeClean"));
    _adjustOrder(t.find(".removeClean"));
    t.find(".removeClean").remove();
    //$("#download-layout .column").removeClass("ui-sortable");
    $(downloadlayout).find(".column").removeClass("ui-sortable");
    //$("#download-layout .column").css("padding-bottom","");
    $(downloadlayout).find(".column").css("padding-bottom", "");

    //$("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
    $(downloadlayout).find(".row-fluid").removeClass("clearfix").children().removeClass("column");
    //$("#download-layout .container")
    if ($(downloadlayout).find(".container").length > 0) {
        changeStructure("row-fluid", "row")
    }
    return t;
}

function _adjustOrder(selectElement) {
    var boxarr = [],
        lyrow = [];

    $.each(selectElement, function () {
        if ($(this).hasClass('box')) {
            boxarr.push(this);
        }
        else {
            lyrow.push(this);
        }
    });

    var hasExecuteLyrow = [];
    $.each(boxarr, function () {
        var that = this;
        if ($(that).find('div[type="tab"]').length > 0) {
            //布局器代码需要从前往后执行，发现组件本身包含布局组件时，先顺序执行布局组件代码。
            $.each(lyrow, function () {
                var compid = $(this).find('.view>div[type="layout"],.view>div[type="bfd_panel"]').attr('compid');
                if ($(that).has('div[compid="' + compid + '"]').length > 0) {
                    cleanHtml(this);
                    hasExecuteLyrow.push(this);
                }
            });         
        }
    });

    $.each(hasExecuteLyrow, function () {
        selectElement.splice(jQuery.inArray(this, selectElement), 1);
    });

    $.each(selectElement, function () {
        cleanHtml(this);
    });
}

function changeStructure(e, t) {
    //$("#download-layout ." + e).removeClass(e).addClass(t)
    $(downloadlayout).find("." + e).removeClass(e).addClass(t)
}

/**
 *获取块的信息，为生成数据权限
 */
function getPieces() {
    var panels = $(frameHtmlObj).find('div[type="bfd_panel"]'),
        pieces = [];
    $.each(panels,
        function (index, item) {
            var title = $(item).find("label:first").text().trim(),
                array = [];
            $.each($(item).find("div[type='input_text'],div[type='textarea'],div[type='select_static'],div[type='select_dynamic'],div[type='input_radio'],div[type='checkbox'],div[type='input_datetime'],div[type='input_fileinput'],div[type=chinese_region]>div>[compname],div[type=image],div[type=m_switch],div[type='label']"),
                function (index, value) {
                    var field = $(value),
                        column = getFieldid(field);
                    if (!column) {
                        return;
                    }
                    array.push('"' + column + '"');
                });

            pieces.push('{"title":' + '"' + title + '","columns":' + '[' + array.join(",") + ']}');
        });
    return pieces.join(",")
}

function MultipleSelectComponent() {
    this.sourceCodeOperatorBefore = function (container) {
        $.each(container.find("select[multiple]"),
            function (index, value) {
                $(this).select2("destroy").attr("multiple", "multiple");
            });
    }

    this.sourceCodeOperatorAfter = function (container) {
        $.each(container.find("select[multiple]"),
            function (index, value) {
                $(this).select2();
            });
    }

}

function TableComponent(){
    var children = new Map();
    this.sourceCodeOperatorBefore = function(container) {
        $.each(container.find("div[type='table_base'],div[type='table_base_local']"), function(index, value) {
            var tableid = $(value).attr("compid");
            var toobarhtml = $(value).attr("toobarhtml");
            children.put(tableid, $(value).children());
            var table = '<table id="'+tableid+'" style="width:100%"></table>';
            $(value).empty();
            if(toobarhtml != undefined && toobarhtml.length > 0) {
                $(value).append(decodeURI(toobarhtml),"","");
            }
            $(value).append(table);
        });
    }
    this.sourceCodeOperatorAfter = function(container) {
        $.each(container.find("div[type='table_base'],div[type='table_base_local']"), function(index, value) {
            var id = $(value).attr("compid");
            $(value).empty();
            $(value).append(children.get(id));
            children.remove(id);
        });
    }
}

/**
 * 上传组件在生成源码前清理无用代码和生成源码后的恢复所见即所得代码。
 * @constructor
 */
function FileUploadComponent() {
    var children = new Map();
    this.sourceCodeOperatorBefore = function (container) {
        $.each(container.find("div[type=input_fileinput]"),
            function (index, value) {
                var fileid = $(value).attr("compid");
                var url = $(value).attr("fileuploadurl");
                var ext = $(value).attr("allowedFileExtensions");
                var field = $(value).attr("field");

                if (url == undefined) url = "";
                if (ext == undefined) ext = "";
                if (field == undefined) field = $(value).attr("compname");

                children.put(fileid, $(value).children());
                var file = "<input id=\"" + fileid + "\" fileuploadurl=\"" + url + "\" allowedFileExtensions=\"" + ext + "\" type=\"file\" name=\"file\" class=\"file\" data-show-preview=\"false\" />" + "<input id=\"" + fileid + "_serverPath\" type=\"text\" style=\"display:none\" ms-duplex-string=\"" + field + "\"/>";
                $(value).empty();
                $(value).append(file);
            });
    }
    this.sourceCodeOperatorAfter = function (container) {
        $.each(container.find("div[type=input_fileinput]"),
            function (index, value) {
                var id = $(value).attr("compid");
                $(value).empty();
                $(value).append(children.get(id));
                children.remove(id);
            });
    }
}

function layoutResize(selectColumn, selectComponentHeight) {
    if (selectColumn && !selectColumn.hasClass("demo") &&
        selectColumn.hasClass("column")) {
        var maxHeight = 40,
            maxHeightColumn, $selectView;

        if (!selectComponentHeight) {
            $selectView = $(selectColumn).find(".form-component_active");
            $selectView.toggleClass('form-component_active');
        }

        $(selectColumn).parent().children().each(function() {
            var minHeight = $(this).css("min-height");
            $(this).css("padding-top", 0).css("padding-bottom", 0);
            $(this).css("min-height", 0);

            var columnHeight = $(this).outerHeight();
            if (maxHeight < columnHeight) {
                maxHeight = columnHeight;
                maxHeightColumn = $(this);
            }

            $(this).css("min-height", minHeight);
        });

        $(selectColumn).parent().children().each(function() {
            $(this).css("padding-top", 5).css("padding-bottom", 5);
            if ($(this).hasClass('col-sm-12')) {
                $(this).css("min-height", 40);
            } else {
                $(this).css("min-height", maxHeight + 10);
            }
        });

        if (!selectComponentHeight) {
            $selectView.toggleClass('form-component_active');
        }

        //重新计算父容器列高
        var parentLayout = $(selectColumn).parents(".column:first");
        if (parentLayout.length > 0) {
            layoutResize(parentLayout);
        }
    }
}

/**
 * Created by 10089289 on 2016/9/18.
 */
;
(function ($, win) {

    /*********pc端框架开始*************************/
    var PcFrame = function () {

    }
    PcFrame.prototype.cleanFrame = function () {
        $(frameHtmlObj).bfdIcon('clean');
        $(frameHtmlObj).bfdPanel("clean");
    };
    PcFrame.prototype.restoreFrame = function () {
        $(frameHtmlObj).bfdIcon('restore');
        $(frameHtmlObj).bfdPanel("restore");
    }

    win.bfdPc = new PcFrame();
    /*********pc端框架结束*************************/

    /*********按钮组组件*************************/

    var ButtonGroupPlugin = function (currentComponent) {
        this.currentComponent = $(currentComponent);
        this._updateHtml();
    };
    ButtonGroupPlugin.prototype._updateHtml = function () {
        console.log(this.currentComponent);
    };
    $.fn.buttonGroup = function () {
        var value, args = Array.prototype.slice.call(arguments, 1);

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

/**
 * Created by 10177027 on 2016/9/22.
 */
;
(function () {
    var BfdIconPlugin = function (rootContainer) {
        this.root = rootContainer
    }

    /**
     * 保存前组件属性设置
     * */
    BfdIconPlugin.prototype.clean = function () {
        $(this.root).find("[type=bfd_icon][alignstyle]").each(function (index, item) {
            $(item).addClass($(item).attr("alignstyle"));
        })
    }

    /**
     * 保存后组件属性还原
     * */
    BfdIconPlugin.prototype.restore = function () {
        $(this.root).find("[type=bfd_icon][alignstyle]").each(function (index, item) {
            $(item).removeClass($(item).attr("alignstyle"));
        })
    }

    $.fn.bfdIcon = function (option) {
        var value, args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {

            var $this = $(this),
                data = $this.data('bfd.icon'),
                options = $.extend({},
                    $this.data(), typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (!data) {
                    $this.data('bfd.icon', (data = new BfdIconPlugin(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('bfd.icon');
                }
            }
        });

        return typeof value === 'undefined' ? this : value;
    }
}())

/**
 * Created by 10177027 on 2016/9/23.
 */
;
(function ($, win) {
    var BfdPanelPlugin = function (rootContainer) {
        this.rootContainer = rootContainer;
    }

    /**
     * 保存前组件属性设置
     * */
    BfdPanelPlugin.prototype.clean = function () {
        var that = this;
        $(this.rootContainer).find("[type=bfd_panel] .bfd-panel-body").each(function (index, item) {
            that.destroyScroolBar(item);
        })
    }

    /**
     * 保存后组件属性还原
     * */
    BfdPanelPlugin.prototype.restore = function () {
        var that = this;
        $(this.rootContainer).find("[type=bfd_panel] .bfd-panel-body").each(function (index, item) {
            that.initScroolBar(item);
        })
    }

    /**
     * 初始化panel
     * */
    BfdPanelPlugin.prototype.init = function () {
        var that = this;
        $(this.rootContainer).find("[type=bfd_panel] .bfd-panel-body").each(function (index, item) {
            /**
             * 删除滚动条
             * */
            that.destroyScroolBar(item);

            /**
             * 初始化滚动条
             * */
            that.initScroolBar(item);
        })
    }

    /**
     * 初始化组件滚动条
     * */
    BfdPanelPlugin.prototype.initScroolBar = function (item) {
        var parent = $(item).parent();
        var panelHeight = $(parent).attr("bfd-panel-height"),
            scrollBarStyle = $(parent).attr("bfd-panel-scrollbar-style");
        if (panelHeight && scrollBarStyle) {
            $(item).mCustomScrollbar({
                setHeight: panelHeight,
                theme: scrollBarStyle
            });
        }
    }

    /**
     * 删除滚动条
     * */
    BfdPanelPlugin.prototype.destroyScroolBar = function (item) {
        $(item).mCustomScrollbar("destroy").css("height", "");
    }

    $.fn.bfdPanel = function (option) {
        var value, args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {

            var $this = $(this),
                data = $this.data('bfd.panel'),
                options = $.extend({},
                    $this.data(), typeof option === 'object' && option);
            if (typeof option === 'string') {
                if (!data) {
                    $this.data('bfd.panel', (data = new BfdPanelPlugin(this)));
                }
                value = data[option].apply(data, args);
                if (option === 'destroy') {
                    $this.removeData('bfd.panel');
                }
            }
        });

        return typeof value === 'undefined' ? this : value;
    }

}(jQuery, window))

/**
 * Created by 10089289 on 2016/9/19.
 */
;
(function ($, win) {
    var ButtonGroupPlugin = function (currentComponent) {
        this.children = new win.Map();
        this.currentComponent = $(currentComponent);

    };
    ButtonGroupPlugin.prototype.init = function () {
        var typelay = $(this.currentComponent.parent());
        //工具栏按钮，需要特殊处理
        if (typelay.data('type') === 'toolbar-button') {
            var layout = $(typelay.parent().parent().parent());
            layout.css('min-height', '50px');
            layout.attr('data-toolbar-layout', 'true');
            if (!layout.attr('id')) {
                layout.attr('id', 'groupLayout' + win.getCurrentTime());
            }
        }
    };

    ButtonGroupPlugin.prototype.sizeColor = function (currentComponent) {
        var $comp = $(currentComponent),
            classes = ['btn'];
        if ($comp.attr('data-color')) {
            classes.push($comp.attr('data-color'));
        } else {
            classes.push('btn-primary');
        }

        var dataSize = $comp.attr('data-size');
        if (dataSize) {
            classes.push(dataSize);
            if (dataSize === 'btn-lg') {
                $comp.parent().parent().parent().css('min-height', '60px');
            } else {
                $comp.parent().parent().parent().css('min-height', '50px');
            }
        }
        $comp.children().removeClass().addClass(classes.join(' '));
    };

    ButtonGroupPlugin.prototype.clean = function () {
        var that = this,
            //toolbarLayout = $(".demo").find('div[data-toolbar-layout="true"]');
            toolbarLayout = $(frameHtmlObj).find('div[data-toolbar-layout="true"]')

        //toolbar
        $.each(toolbarLayout,
            function (index, item) {
                var $item = $(item),
                    lastChildId = $item.parent().children('div[data-toolbar-layout="true"]:last').attr('id'),
                    floatHtml = '';

                if (!$item.find('button')[0]) {
                    return true;
                }

                if ($item.parent().children('div[data-toolbar-layout="true"]').length > 1 && lastChildId === $item.attr('id')) {
                    floatHtml = ' style="float:right;" ';
                }

                //先缓存下来
                that.children.put($item.attr('id'), $item.children());
                var groups = ['<div class="btn-toolbar" role="toolbar"' + floatHtml + '><div class="btn-group">'];
                //button
                $.each($item.find('button'),
                    function (index2, item2) {
                        var $item2 = $(item2),
                            isSplit = $item2.parent().attr('data-split') === 'true';

                        groups.push(item2.outerHTML);
                        if (isSplit) {
                            groups.push('</div><div class="btn-group">')
                        }
                    });
                groups.push('</div></div>');
                $item.css('min-height', '').empty().append(groups.join(" "));
            });
    };

    ButtonGroupPlugin.prototype.restore = function () {
        var that = this,
            keys = that.children.keySet();
        $.each(keys,
            function (index, item) {
                $("#" + item).css('min-height', '50px').empty().append(that.children.get(item));
            });
    };

    $.fn.btnGroup = function (option) {
        var value, args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {

            var $this = $(this),
                data = $this.data('iui.btn.group'),
                options = $.extend({},
                    $this.data(), typeof option === 'object' && option);
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

/*
 HTML Clean for jQuery
 Anthony Johnston
 http://www.antix.co.uk

 version 1.3.1

 $Revision$

 requires jQuery http://jquery.com

 Use and distibution http://www.opensource.org/licenses/bsd-license.php

 2010-04-02 allowedTags/removeTags added (white/black list) thanks to David Wartian (Dwartian)
 2010-06-30 replaceStyles added for replacement of bold, italic, super and sub styles on a tag
 2012-04-30 allowedAttributes added, an array of attributed allowed on the elements
 2013-02-25 now will push non-inline elements up the stack if nested in an inline element
 2013-02-25 comment element support added, removed by default, see AllowComments in options
 */
(function ($) {
    $.fn.htmlClean = function (options) {
        // iterate and html clean each matched element
        return this.each(function () {
            var $this = $(this);
            if (this.value) {
                this.value = $.htmlClean(this.value, options);
            } else {
                this.innerHTML = $.htmlClean(this.innerHTML, options);
            }
        });
    };

    // clean the passed html
    $.htmlClean = function (html, options) {
        options = $.extend({},
            $.htmlClean.defaults, options);

        var tagsRE = /(<(\/)?(\w+:)?([\w]+)([^>]*)>)|<!--(.*?--)>/gi;
        var attrsRE = /([\w\-]+)=(".*?"|'.*?'|[^\s>]*)/gi;

        var tagMatch;
        var root = new Element();
        var stack = [root];
        var container = root;
        var protect = false;

        if (options.bodyOnly) {
            // check for body tag
            if (tagMatch = /<body[^>]*>((\n|.)*)<\/body>/i.exec(html)) {
                html = tagMatch[1];
            }
        }
        html = html.concat("<xxx>"); // ensure last element/text is found
        var lastIndex;

        while (tagMatch = tagsRE.exec(html)) {
            var tag = tagMatch[6] ? new Tag("--", null, tagMatch[6], options) : new Tag(tagMatch[4], tagMatch[2], tagMatch[5], options);

            // add the text
            var text = html.substring(lastIndex, tagMatch.index);
            if (text.length > 0) {
                var child = container.children[container.children.length - 1];
                if (container.children.length > 0 && isText(child = container.children[container.children.length - 1])) {
                    // merge text
                    container.children[container.children.length - 1] = child.concat(text);
                } else {
                    container.children.push(text);
                }
            }
            lastIndex = tagsRE.lastIndex;

            if (tag.isClosing) {
                // find matching container
                if (popToTagName(stack, [tag.name])) {
                    stack.pop();
                    container = stack[stack.length - 1];
                }
            } else {
                // create a new element
                var element = new Element(tag);

                // add attributes
                var attrMatch;
                while (attrMatch = attrsRE.exec(tag.rawAttributes)) {

                    // check style attribute and do replacements
                    if (attrMatch[1].toLowerCase() == "style" && options.replaceStyles) {

                        var renderParent = !tag.isInline;
                        for (var i = 0; i < options.replaceStyles.length; i++) {
                            if (options.replaceStyles[i][0].test(attrMatch[2])) {

                                if (!renderParent) {
                                    tag.render = false;
                                    renderParent = true;
                                }
                                container.children.push(element); // assumes not replaced
                                stack.push(element);
                                container = element; // assumes replacement is a container
                                // create new tag and element
                                tag = new Tag(options.replaceStyles[i][1], "", "", options);
                                element = new Element(tag);
                            }
                        }
                    }

                    if (tag.allowedAttributes != null && (tag.allowedAttributes.length == 0 || $.inArray(attrMatch[1], tag.allowedAttributes) > -1)) {
                        element.attributes.push(new Attribute(attrMatch[1], attrMatch[2]));
                    }
                }
                // add required empty ones
                $.each(tag.requiredAttributes,
                    function () {
                        var name = this.toString();
                        if (!element.hasAttribute(name)) element.attributes.push(new Attribute(name, ""));
                    });

                // check for replacements
                for (var repIndex = 0; repIndex < options.replace.length; repIndex++) {
                    for (var tagIndex = 0; tagIndex < options.replace[repIndex][0].length; tagIndex++) {
                        var byName = typeof (options.replace[repIndex][0][tagIndex]) == "string";
                        if ((byName && options.replace[repIndex][0][tagIndex] == tag.name) || (!byName && options.replace[repIndex][0][tagIndex].test(tagMatch))) {

                            // set the name to the replacement
                            tag.rename(options.replace[repIndex][1]);

                            repIndex = options.replace.length; // break out of both loops
                            break;
                        }
                    }
                }

                // check container rules
                var add = true;
                if (!container.isRoot) {
                    if (container.tag.isInline && !tag.isInline) {
                        if (add = popToContainer(stack)) {
                            container = stack[stack.length - 1];
                        }
                    } else if (container.tag.disallowNest && tag.disallowNest && !tag.requiredParent) {
                        add = false;
                    } else if (tag.requiredParent) {
                        if (add = popToTagName(stack, tag.requiredParent)) {
                            container = stack[stack.length - 1];
                        }
                    }
                }

                if (add) {
                    container.children.push(element);

                    if (tag.toProtect) {
                        // skip to closing tag
                        while (tagMatch2 = tagsRE.exec(html)) {
                            var tag2 = new Tag(tagMatch2[3], tagMatch2[1], tagMatch2[4], options);
                            if (tag2.isClosing && tag2.name == tag.name) {
                                element.children.push(RegExp.leftContext.substring(lastIndex));
                                lastIndex = tagsRE.lastIndex;
                                break;
                            }
                        }
                    } else {
                        // set as current container element
                        if (!tag.isSelfClosing && !tag.isNonClosing) {
                            stack.push(element);
                            container = element;
                        }
                    }
                }
            }
        }

        // render doc
        return $.htmlClean.trim(render(root, options).join(""));
    };

    // defaults
    $.htmlClean.defaults = {
        // only clean the body tagbody
        bodyOnly: true,
        // only allow tags in this array, (white list), contents still rendered
        allowedTags: [],
        // remove tags in this array, (black list), contents still rendered
        removeTags: ["basefont", "center", "dir", "font", "frame", "frameset", "iframe", "isindex", "menu", "noframes", "s", "strike", "u"],
        // array of [attributeName], [optional array of allowed on elements] e.g. [["id"], ["style", ["p", "dl"]]] // allow all elements to have id and allow style on 'p' and 'dl'
        allowedAttributes: [],
        // array of attribute names to remove on all elements in addition to those not in tagAttributes e.g ["width", "height"]
        removeAttrs: [],
        // array of [className], [optional array of allowed on elements] e.g. [["aClass"], ["anotherClass", ["p", "dl"]]]
        allowedClasses: [],
        // format the result
        format: false,
        // format indent to start on
        formatIndent: 0,
        // tags to replace, and what to replace with, tag name or regex to match the tag and attributes
        replace: [
            [
                ["b", "big"], "strong"
            ],
            [
                ["i"], "em"
            ]
        ],
        // styles to replace with tags, multiple style matches supported, inline tags are replaced by the first match blocks are retained
        replaceStyles: [
            [/font-weight:\s*bold/i, "strong"],
            [/font-style:\s*italic/i, "em"],
            [/vertical-align:\s*super/i, "sup"],
            [/vertical-align:\s*sub/i, "sub"]
        ],
        allowComments: false
    };

    function applyFormat(element, options, output, indent) {
        if (!element.tag.isInline && output.length > 0) {
            output.push("\n");
            for (i = 0; i < indent; i++) output.push("\t");
        }
    }

    function render(element, options) {
        var output = [],
            empty = element.attributes.length == 0,
            indent;

        if (element.tag.isComment) {
            if (options.allowComments) {
                output.push("<!--");
                output.push(element.tag.rawAttributes);
                output.push(">");

                if (options.format) applyFormat(element, options, output, indent - 1);
            }
        } else {

            var openingTag = this.name.concat(element.tag.rawAttributes == undefined ? "" : element.tag.rawAttributes);

            // don't render if not in allowedTags or in removeTags
            var renderTag = element.tag.render && (options.allowedTags.length == 0 || $.inArray(element.tag.name, options.allowedTags) > -1) && (options.removeTags.length == 0 || $.inArray(element.tag.name, options.removeTags) == -1);

            if (!element.isRoot && renderTag) {

                // render opening tag
                output.push("<");
                output.push(element.tag.name);
                $.each(element.attributes,
                    function () {
                        if ($.inArray(this.name, options.removeAttrs) == -1) {
                            var m = RegExp(/^(['"]?)(.*?)['"]?$/).exec(this.value);
                            var value = m[2];
                            var valueQuote = m[1] || "'";

                            // check for classes allowed
                            if (this.name == "class" && options.allowedClasses.length > 0) {
                                value = $.grep(value.split(" "),
                                    function (c) {
                                        return $.grep(options.allowedClasses,
                                            function (a) {
                                                return a == c || (a[0] == c && (a.length == 1 || $.inArray(element.tag.name, a[1]) > -1));
                                            }).length > 0;
                                    }).join(" ");
                            }

                            if (value != null && (value.length > 0 || $.inArray(this.name, element.tag.requiredAttributes) > -1)) {
                                output.push(" ");
                                output.push(this.name);
                                output.push("=");
                                output.push(valueQuote);
                                output.push(value);
                                output.push(valueQuote);
                            }
                        }
                    });
            }

            if (element.tag.isSelfClosing) {
                // self closing
                if (renderTag) output.push(" />");
                empty = false;
            } else if (element.tag.isNonClosing) {
                empty = false;
            } else {
                if (!element.isRoot && renderTag) {
                    // close
                    output.push(">");
                }

                var indent = options.formatIndent++;

                // render children
                if (element.tag.toProtect) {
                    var outputChildren = $.htmlClean.trim(element.children.join("")).replace(/<br>/ig, "\n");
                    output.push(outputChildren);
                    empty = outputChildren.length == 0;
                } else {
                    var outputChildren = [];
                    for (var i = 0; i < element.children.length; i++) {
                        var child = element.children[i];
                        var text = $.htmlClean.trim(textClean(isText(child) ? child : child.childrenToString()));
                        if (isInline(child)) {
                            if (i > 0 && text.length > 0 && (startsWithWhitespace(child) || endsWithWhitespace(element.children[i - 1]))) {
                                outputChildren.push(" ");
                            }
                        }
                        if (isText(child)) {
                            if (text.length > 0) {
                                outputChildren.push(text);
                            }
                        } else {
                            // don't allow a break to be the last child
                            if (i != element.children.length - 1 || child.tag.name != "br") {
                                if (options.format) applyFormat(child, options, outputChildren, indent);
                                outputChildren = outputChildren.concat(render(child, options));
                            }
                        }
                    }
                    options.formatIndent--;

                    if (outputChildren.length > 0) {
                        if (options.format && outputChildren[0] != "\n") applyFormat(element, options, output, indent);
                        output = output.concat(outputChildren);
                        empty = false;
                    }
                }

                if (!element.isRoot && renderTag) {
                    // render the closing tag
                    if (options.format) applyFormat(element, options, output, indent - 1);
                    output.push("</");
                    output.push(element.tag.name);
                    output.push(">");
                }
            }

            // check for empty tags
            if (!element.tag.allowEmpty && empty) {
                return [];
            }
        }

        return output;
    }

    // find a matching tag, and pop to it, if not do nothing
    function popToTagName(stack, tagNameArray) {
        return pop(stack,
            function (element) {
                return $.inArray(element.tag.nameOriginal, tagNameArray) > -1
            });
    }

    function popToContainer(stack) {
        return pop(stack,
            function (element) {
                return element.isRoot || !element.tag.isInline;
            });
    }

    function pop(stack, test, index) {
        index = index || 1;
        var element = stack[stack.length - index];
        if (test(element)) {
            return true;
        } else if (stack.length - index > 0 && pop(stack, test, index + 1)) {
            stack.pop();
            return true;
        }
        return false;
    }

    // Element Object
    function Element(tag) {
        if (tag) {
            this.tag = tag;
            this.isRoot = false;
        } else {
            this.tag = new Tag("root");
            this.isRoot = true;
        }
        this.attributes = [];
        this.children = [];

        this.hasAttribute = function (name) {
            for (var i = 0; i < this.attributes.length; i++) {
                if (this.attributes[i].name == name) return true;
            }
            return false;
        };

        this.childrenToString = function () {
            return this.children.join("");
        };

        return this;
    }

    // Attribute Object
    function Attribute(name, value) {
        this.name = name;
        this.value = value;

        return this;
    }

    // Tag object
    function Tag(name, close, rawAttributes, options) {
        this.name = name.toLowerCase();
        this.nameOriginal = this.name;
        this.render = true;

        this.init = function () {
            if (this.name == "--") {
                this.isComment = true;
                this.isSelfClosing = true;
            } else {
                this.isComment = false;
                this.isSelfClosing = $.inArray(this.name, tagSelfClosing) > -1;
                this.isNonClosing = $.inArray(this.name, tagNonClosing) > -1;
                this.isClosing = (close != undefined && close.length > 0);

                this.isInline = $.inArray(this.name, tagInline) > -1;
                this.disallowNest = $.inArray(this.name, tagDisallowNest) > -1;
                this.requiredParent = tagRequiredParent[$.inArray(this.name, tagRequiredParent) + 1];
                this.allowEmpty = $.inArray(this.name, tagAllowEmpty) > -1;

                this.toProtect = $.inArray(this.name, tagProtect) > -1;
            }
            this.rawAttributes = rawAttributes;
            this.requiredAttributes = tagAttributesRequired[$.inArray(this.name, tagAttributesRequired) + 1];

            if (options) {
                if (!options.tagAttributesCache) options.tagAttributesCache = [];
                if ($.inArray(this.name, options.tagAttributesCache) == -1) {
                    var cacheItem = tagAttributes[$.inArray(this.name, tagAttributes) + 1].slice(0);

                    // add extra ones from options
                    for (var i = 0; i < options.allowedAttributes.length; i++) {
                        var attrName = options.allowedAttributes[i][0];
                        if ((options.allowedAttributes[i].length == 1 || $.inArray(this.name, options.allowedAttributes[i][1]) > -1) && $.inArray(attrName, cacheItem) == -1) {
                            cacheItem.push(attrName);
                        }
                    }

                    options.tagAttributesCache.push(this.name);
                    options.tagAttributesCache.push(cacheItem);
                }

                this.allowedAttributes = options.tagAttributesCache[$.inArray(this.name, options.tagAttributesCache) + 1];
            }
        }

        this.init();

        this.rename = function (newName) {
            this.name = newName;
            this.init();
        };

        return this;
    }

    function startsWithWhitespace(item) {
        while (isElement(item) && item.children.length > 0) {
            item = item.children[0]
        }
        if (!isText(item)) return false;
        var text = textClean(item);
        return text.length > 0 && $.htmlClean.isWhitespace(text.charAt(0));
    }

    function endsWithWhitespace(item) {
        while (isElement(item) && item.children.length > 0) {
            item = item.children[item.children.length - 1]
        }
        if (!isText(item)) return false;
        var text = textClean(item);
        return text.length > 0 && $.htmlClean.isWhitespace(text.charAt(text.length - 1));
    }

    function isText(item) {
        return item.constructor == String;
    }

    function isInline(item) {
        return isText(item) || item.tag.isInline;
    }

    function isElement(item) {
        return item.constructor == Element;
    }

    function textClean(text) {
        return text.replace(/&nbsp;|\n/g, " ").replace(/\s\s+/g, " ");
    }

    // trim off white space, doesn't use regex
    $.htmlClean.trim = function (text) {
        return $.htmlClean.trimStart($.htmlClean.trimEnd(text));
    };
    $.htmlClean.trimStart = function (text) {
        return text.substring($.htmlClean.trimStartIndex(text));
    };
    $.htmlClean.trimStartIndex = function (text) {
        for (var start = 0; start < text.length - 1 && $.htmlClean.isWhitespace(text.charAt(start)); start++);
        return start;
    };
    $.htmlClean.trimEnd = function (text) {
        return text.substring(0, $.htmlClean.trimEndIndex(text));
    };
    $.htmlClean.trimEndIndex = function (text) {
        for (var end = text.length - 1; end >= 0 && $.htmlClean.isWhitespace(text.charAt(end)); end--);
        return end + 1;
    };
    // checks a char is white space or not
    $.htmlClean.isWhitespace = function (c) {
        return $.inArray(c, whitespace) != -1;
    };

    // tags which are inline
    var tagInline = ["a", "abbr", "acronym", "address", "b", "big", "br", "button", "caption", "cite", "code", "del", "em", "font", "hr", "i", "input", "img", "ins", "label", "legend", "map", "q", "s", "samp", "select", "option", "param", "small", "span", "strike", "strong", "sub", "sup", "tt", "u", "var"];
    var tagDisallowNest = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "th", "td", "object"];
    var tagAllowEmpty = ["th", "td"];
    var tagRequiredParent = [null, "li", ["ul", "ol"], "dt", ["dl"], "dd", ["dl"], "td", ["tr"], "th", ["tr"], "tr", ["table", "thead", "tbody", "tfoot"], "thead", ["table"], "tbody", ["table"], "tfoot", ["table"], "param", ["object"]];
    var tagProtect = ["script", "style", "pre", "code"];
    // tags which self close e.g. <br />
    var tagSelfClosing = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
    // tags which do not close
    var tagNonClosing = ["!doctype", "?xml"];
    // attributes allowed on tags
    var tagAttributes = [
        ["class"], // default, for all tags not mentioned
        "?xml", [], "!doctype", [], "a", ["accesskey", "class", "href", "name", "title", "rel", "rev", "type", "tabindex"], "abbr", ["class", "title"], "acronym", ["class", "title"], "blockquote", ["cite", "class"], "button", ["class", "disabled", "name", "type", "value"], "del", ["cite", "class", "datetime"], "form", ["accept", "action", "class", "enctype", "method", "name"], "input", ["accept", "accesskey", "alt", "checked", "class", "disabled", "ismap", "maxlength", "name", "size", "readonly", "src", "tabindex", "type", "usemap", "value"], "img", ["alt", "class", "height", "src", "width"], "ins", ["cite", "class", "datetime"], "label", ["accesskey", "class", "for"], "legend", ["accesskey", "class"], "link", ["href", "rel", "type"], "meta", ["content", "http-equiv", "name", "scheme", "charset"], "map", ["name"], "optgroup", ["class", "disabled", "label"], "option", ["class", "disabled", "label", "selected", "value"], "q", ["class", "cite"], "script", ["src", "type"], "select", ["class", "disabled", "multiple", "name", "size", "tabindex"], "style", ["type"], "table", ["class", "summary"], "th", ["class", "colspan", "rowspan"], "td", ["class", "colspan", "rowspan"], "textarea", ["accesskey", "class", "cols", "disabled", "name", "readonly", "rows", "tabindex"], "param", ["name", "value"], "embed", ["height", "src", "type", "width"]
    ];
    var tagAttributesRequired = [
        [], "img", ["alt"]
    ];
    // white space chars
    var whitespace = [" ", " ", "\t", "\n", "\r", "\f"];

})(jQuery);

function cleanHtml(e) {
    $(e).parent().append($(e).children().html());
    $(e).remove();
}

/**
 * 图片上传组件
 * @constructor
 */
function ImageComponent() {
    this.sourceCodeOperator = function (container) {
        $.each(container.find('div[type="image"]'),
            function (index, item) {
                var $this = $(this),
                    _$this = $this.clone(),
                    imgId = $this.attr("compid"),
                    zoomIn = $this.attr("zoomin");

                if (zoomIn == "true") {
                    var $img = _$this.find("img").attr("id", imgId),
                        src = $img.attr("src"),
                        $a = $('<a class="fancybox" href=' + src + ' title="">');
                    $this.empty();
                    $this.append($a.append($img));
                }

            });

        return container.prop("outerHTML");
        //return container;
    }

}

function TabComponent() {
    this.sourceCodeOperator = function (container) {
        $.each(container.find("div[type='tab']"),
            function (index, item) {
                var nav_tabs = $(item).find("ul.nav")[0];
                var tab_content = $(item).find("div.tab-content")[0];

                $.each($(nav_tabs).find("li>a"),
                    function (i, m) {
                        var $a = $(m);
                        var targetId = $a.attr("href");
                        //role="tabpanel" class="tab-pane active"
                        var target = container.find(targetId);
                        if (!$.isEmptyObject(target)) {
                            //默认选中第一个tab
                            if (i == 0) {
                                $(m).parent().addClass("active");
                                target.addClass("active");
                            } else {
                                $(m).parent().removeClass("active");
                                target.removeClass("active");
                            }
                            $(tab_content).append(target.attr("role", "tabpanel").addClass("tab-pane").prop("outerHTML"));
                            target.remove();
                        }
                    })
            });

        return container.prop("outerHTML");
    }
}

function CollapseComponent() {

    this.sourceCodeOperator = function (container) {
        $.each(container.find("div[type='collapse']"),
            function (index, item) {
                var panels = $(item).find("div.panel");

                $.each(panels,
                    function (i, m) {
                        var $panel = $(m);
                        var $panel_heading = $panel.find("div.panel-heading");
                        var targetId = $panel_heading.find("h4>a").attr("href");
                        var target = container.find(targetId);
                        if (!$.isEmptyObject(target)) {
                            //默认选中第一个tab
                            if (i == 0) {
                                target.addClass("in");
                            }
                            $panel.append(target.attr("role", "tabpanel").addClass("panel-collapse collapse").prop("outerHTML"));
                            target.remove();
                        }
                    })
            });

        return container.prop("outerHTML");
    }
}

function getFieldid(object) {
    var id = object.attr("field");
    if (!id && object.attr("type") !== "label") {
        id = object.attr("compname");
    }
    //做解码操作
    if (id != undefined) {
        id = decodeURIComponent(escape2Html(id));
    }
    return id;
}

/**
 * 获取组件类型
 * */
function getComponentType(component) {
    if (component == undefined) {
        return "";
    }
    var type = $(component).attr("type");
    if (type != undefined && type == "select_dynamic") {
        var selectType = $(component).attr("selecttype");
        if (selectType != undefined && selectType == "multiple") {
            type = "multipleselect";
        }
    }

    return type;
}

/*
 获取VM下自定义属性
 */
function getCustomAttributes(vmObject) {
    var objects = [];
    $.each($(vmObject).find("div[init]"),
        function (index, item) {
            var attrs = $(item).get(0).attributes;
            var compid = $(item).attr("compid");
            for (var i = 0; i < attrs.length; i++) {
                var jsonObjectAttrs = {};
                jsonObjectAttrs.name = attrs[i].name;
                jsonObjectAttrs.value = decodeURIComponent(attrs[i].value);
                jsonObjectAttrs.compid = compid;
                objects.push(jsonObjectAttrs);
            }
        });
    var result = {};
    result.attributes = objects;
    return encodeURIComponent(JSON.stringify(result));
}

//获取日期组件
function getDateTimePicker($item) {
    var datetimes = $item.find("div[type='input_datetime']");
    var datetime = ["datetime="];
    if (datetimes.length > 0) {
        $item.find("div[type='input_datetime']").each(function () {
            var $this = $(this);
            if (typeof $this.attr("datetimeformat") !== "undefined") {
                datetime.push('format=' + $this.attr("datetimeformat") + ",");
            } else {
                datetime.push("format=YYYY-MM-DD%20HH%3Amm%3Ass,");
            }
            datetime.push("id=" + $this.attr("compid") + "@");
        });
    }
    return datetime.join("");

}

/**
 * 获取隐藏属性为“true”的所有组件
 * @param vmObject
 */
function getComponentVisibility(vmObject) {
    var visibility = "";
    if (vmObject.attr("componentvisibility") != undefined) {
        visibility += vmObject.attr("id") + "=" + vmObject.attr("componentvisibility");
    }
    $.each(vmObject.find("[componentvisibility]"),
        function (index, item) {
            if (visibility != "") {
                visibility += "@";
            }
            visibility += $(this).attr("id") + "=" + $(this).attr("componentvisibility");
        })
    return "componentvisibility=" + visibility + ";";
}

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
            } else {
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
                        $.each(model.slaveTables,
                            function (index, slaveTable) {
                                if (slaveTable.tableName === datasource.uri) {
                                    fields = model.fields;
                                    return false;
                                }
                            })
                    }

                    $.each(fields,
                        function (index, item) {
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

                    var fields = $.bfd.datasource().getDataSetFields(datasource.dsname, serviceName, uri, datasource.bfd_set_param_type);
                    $.each(fields,
                        function (index, item) {
                            ret.push(new DataColumn(item.name, item.type, item.length, parentUri, item.displayName));
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
                            if (dataColumns[i].columnName == fieldName && $(componentObject).attr("id") != $(this).attr("id")) ret.push(dataColumns[i]);
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
                    if (dataColumns[i].columnName == fieldName) return dataColumns[i];
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
                } else {
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
    /**
     * 组件数据集字段管理接口
     * @param componentObject
     * @constructor
     */

function ComponentDatasetFieldsManage(componentObject) {
        this.datasetConfigInfo = undefined;
        /**
         * 是否设置数据集信息
         * @returns {boolean}
         */
        this.isSetDatasetInfo = function () {
                var configInfo = this.getDatasetConfigInfo();
                if (configInfo) {
                    this.datasetConfigInfo = configInfo;
                    return true;
                }
                return false;
            }
            /**
             * 获取数据源名
             * @returns {string|*}
             */
        this.getDatasetDSname = function () {
                return this.datasetConfigInfo.datasource;
            }
            /**
             * 获取数据集名
             * @returns {string|*|DOMStringMap}
             */
        this.getDatasetName = function () {
                return this.datasetConfigInfo.dataset;
            }
            /**
             * 获取数据集列名
             * @returns {*}
             */
        this.getDatasetFields = function () {
                return this.datasetConfigInfo.columns;
            }
            /**
             * 获取数据集配置信息
             * @returns {*}
             */
        this.getDatasetConfigInfo = function () {
            var compid = $(componentObject).attr("compid");
            if (compid == undefined) {
                compid = $(componentObject).attr("id");
            }
            var componentContainer = $("[compid=" + compid + "]");
            if (componentContainer) {
                var configData = componentContainer.attr("datasetconfig");
                if (configData) {
                    return $.parseJSON(decodeURIComponent(configData));
                }
            }
            return undefined;
        }
    }
    /**
     * 整合vm数据源与数据集接口
     * @param componentObject
     * @constructor
     */

function ComponentDataFieldsManage(componentObject, parentDataField) {
    this.uri = undefined;
    this.dsname = undefined;
    this.type = undefined;
    this.dataColumns = undefined;
    this.componentObject = componentObject;
    this.parentDataField = parentDataField;
}
ComponentDataFieldsManage.prototype = {
    isSetDataSourceInfo: function () {
            var datasetFieldsManage = new ComponentDatasetFieldsManage(this.componentObject);
            if (datasetFieldsManage.isSetDatasetInfo()) {
                this.uri = datasetFieldsManage.getDatasetName();
                this.dsname = datasetFieldsManage.getDatasetDSname();
                this.dataColumns = datasetFieldsManage.getDatasetFields();
                return true;
            }

            var vmDataFieldsManage = new VMDataFieldsManage(this.componentObject);
            if (vmDataFieldsManage.isSetVMURI()) {
                this.uri = vmDataFieldsManage.getVMURI().uri;
                this.dsname = vmDataFieldsManage.getVMURI().dsname;
                this.dataColumns = vmDataFieldsManage.getAllFields(this.parentDataField);
                return true;
            }

            return false;
        },
        getUri: function () {
            return this.uri;
        },
        getDataSourceName: function () {
            return this.dsname;
        },
        getDataColumns: function () {
            return this.dataColumns;
        }
}

function ComponentDataFieldsManage(componentObject, parentDataField) {
    this.uri = undefined;
    this.dsname = undefined;
    this.type = undefined;
    this.dataColumns = undefined;
    this.componentObject = componentObject;
    this.parentDataField = parentDataField;
}
ComponentDataFieldsManage.prototype = {
    isSetDataSourceInfo: function () {
            var datasetFieldsManage = new ComponentDatasetFieldsManage(this.componentObject);
            if (datasetFieldsManage.isSetDatasetInfo()) {
                this.uri = datasetFieldsManage.getDatasetName();
                this.dsname = datasetFieldsManage.getDatasetDSname();
                this.dataColumns = datasetFieldsManage.getDatasetFields();
                return true;
            }

            var vmDataFieldsManage = new VMDataFieldsManage(this.componentObject);
            if (vmDataFieldsManage.isSetVMURI()) {
                this.uri = vmDataFieldsManage.getVMURI().uri;
                this.dsname = vmDataFieldsManage.getVMURI().dsname;
                //this.dataColumns = vmDataFieldsManage.getAllFields(this.parentDataField);
                return true;
            }

            return false;
        },
        getUri: function () {
            return this.uri;
        },
        getDataSourceName: function () {
            return this.dsname;
        },
        getDataColumns: function () {
            return this.dataColumns;
        }
}

;
(function ($, win) {

    var ProcessTools = function () {

        }
        /*生成默认表单*/
    ProcessTools.prototype.initForm = function (nodeObj) {
        //这里为最简单的一个系统数据项和流程数据项，所以用流程数据项的id来拼接设计文件的名字
        /***********************************************************/
        var modelid = nodeObj.modelid,
            type = nodeObj.type,
            name = nodeObj.name,
            dataSourcePath = "",
            swaggerData = "",
            modelData = [],
            bfdOperationParamsObj = {},
            dataMap = new Map(),
            metaDataColumns = [],
            processid = nodeObj.processid,
            bind_table = "",
            formUrl = "",
            tenantid = nodeObj.tenantid;
        var fileName = nodeObj.filename;
        var currentFile = "",
            currentFileList = "";
        if (fileName != undefined) {
            currentFile = fileName + "&pname=default&version=1.0";
            currentFileList = fileName + "&pname=default&version=1.0";
            formUrl = tenantid + "$" + fileName;
        } else {
            currentFile = processid + "-" + modelid + "-form.html&pname=default&version=1.0";
            currentFileList = processid + "-" + modelid + "-list.html&pname=default&version=1.0";
        }
        /*请求数据模型数据*/
        commonAjax("get", "model/api/def?model-id=" + modelid, undefined,
            function (data) {
                modelData = dataStructure(data);
                if (data && $.isArray(data)) {
                    metaDataColumns = data[0].metadata;
                    bind_table = data[0].bind_table;
                }
            });
        bfdOperationParamsObj.dsType = "orm";
        bfdOperationParamsObj.source = "bcp";
        bfdOperationParamsObj.service = "bcp";
        bfdOperationParamsObj.set = bind_table;
        bfdOperationParamsObj.operations = [{
            "method": "POST",
            "submit": "formOperator",
            "url": "/dataservice/orm/table/" + bind_table,
            "name": "add"
        }, {
            "method": "PUT",
            "submit": "formOperator",
            "url": "/dataservice/orm/table/" + bind_table,
            "name": "update"
        }, {
            "method": "DELETE",
            "submit": "delete",
            "url": "/dataservice/orm/table/" + bind_table,
            "name": "delete"
        }, {
            "method": "GET",
            "submit": "initVMData",
            "url": "/dataservice/orm/table/" + bind_table,
            "name": "query"
        }];
        bfdOperationParamsObj.post_in = [];
        bfdOperationParamsObj.put_in = [];
        bfdOperationParamsObj.get_out = [];
        dataMap.put("processdata", bfdOperationParamsObj);

        var typeid = "";
        var typename = "";
        var processPackageCondition = {
            "columns": [{
                "cname": "TYPEID"
            }],
            "isDistinct": true,
            "condition": {
                "cname": "id",
                "value": processid,
                "compare": "="
            }
        };
        /*根据流程包id查询流程包类型id*/
        commonAjax("get", "orm/table/bcp_re_processpackage?param=" + encodeURIComponent(JSON.stringify(processPackageCondition)), undefined,
            function (data) {
                if (data.rows.length > 0) {
                    typeid = data.rows[0].TYPEID;
                }
            }) 
			var processTypeCondition = {
            "columns": [{
                "cname": "TYPENAME"
            }],
            "isDistinct": true,
            "condition": {
                "cname": "id",
                "value": typeid,
                "compare": "="
            }
        };
        /*根据流程包类型id查询流程包类型*/
        commonAjax("get", "orm/table/bcp_re_processtype?param=" + encodeURIComponent(JSON.stringify(processTypeCondition)), undefined,
            function (data) {
                if (data.rows.length > 0) {
                    typename = data.rows[0].TYPENAME;
                }
            })

        var generateForm = getFormObject(modelData, dataMap, processid),
            formName = "";
        if (fileName.indexOf("list") > 0) {
            formName = fileName.replace("list", "form") + ".html";
        }
        generateTable = getTableObject(formName, bfdOperationParamsObj, metaDataColumns, processid);

        /*if (fileName == undefined) {*/
        if (type === "Form") {
            commonAjax("post", "/designer/jersey-services/layoutit/frame/html/save/" + tenantid + "$" + currentFile + "/", JSON.stringify(generateForm), insertBcpReForm(formUrl, modelid, tenantid, name, processid), errorFrameFileCallBack, true);
        } else if (type === "Table") {
            commonAjax("post", "/designer/jersey-services/layoutit/frame/html/save/" + tenantid + "$" + currentFileList + "/", JSON.stringify(generateTable), insertBcpReList(formUrl, modelid, tenantid, name, processid), errorFrameFileCallBack, true);
        } else if (type === "Both") {
            commonAjax("post", "/designer/jersey-services/layoutit/frame/html/save/" + tenantid + "$" + currentFile + "/", JSON.stringify(generateForm), insertBcpReForm(formUrl, modelid, tenantid, name, processid), errorFrameFileCallBack, true);
            commonAjax("post", "/designer/jersey-services/layoutit/frame/html/save/" + tenantid + "$" + currentFileList + "/", JSON.stringify(generateTable), insertBcpReList(formUrl, modelid, tenantid, name, processid), errorFrameFileCallBack, true);
        }
    };
    var sucessCallBack = function (obj) {
        if (obj.status == 1) {
            return true;
        } else {
            return false;

        }
    }
    var errorCallBack = function (textStatus, errorThrown, urlAndParam) {
        console.log(message = "textStatus " + textStatus + " errorThrown " + errorThrown + " url " + urlAndParam);
        return false;
    }
    var sucessFrameFileCallBack = function (obj) {
        if (obj.status == 0) {
            return true;
        } else {
            return false;

        }
    }
    var errorFrameFileCallBack = function (textStatus, errorThrown, urlAndParam) {
        console.log(message = "textStatus " + textStatus + " errorThrown " + errorThrown + " url " + urlAndParam);
        return false;

    }
    var getFormObject = function (modelData, dataMap, processid) {
        var nodeArry = [];
        if (modelData.length > 1) {
            nodeArry = nodeArry.concat(modelData)
        } else {
            nodeArry = modelData;
        }
        var frameHtml = _nodesHtml(nodeArry, dataMap).join(" ");

        frameHtmlObj = $(frameHtml.split('<div class="footer-bg ui-sortable"></div>')[0]);
        var refer = new ReferenceManage();
        var generateForm = {};
        generateForm.meta = '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        generateForm.css = refer.getCSS();
        /*加入一些必要的css文件*/
        generateForm.css.push("css/component/m-layout.css");
        generateForm.css.push("css/component/myAdmin.css");
        generateForm.css.push("css/lib/mCustomScrollbar/jquery.mCustomScrollbar.min.css");
        generateForm.css.push("css/lib/jquery-ui.min.css");
        generateForm.css.push("css/component/m-label.css");
        generateForm.css.push("css/bootstrap/fileinput/css/fileinput.css");
        generateForm.css.push("css/bootstrap/bootstrap-datetimepicker.min.css");
        generateForm.js = refer.getJS();
        /*加入一些必要的js文件*/
        generateForm.js.push("js/component/m-layout.js");
        generateForm.js.push("js/component/panel.js");
        generateForm.js.push("js/component/m-label.js");
        generateForm.js.push("js/lib/fileinput/fileinput.js");
        generateForm.js.push("js/lib/fileinput/fileinput_locale_zh.js");
        generateForm.pageVM = getPageVM();
        generateForm.body = getFormatCode() + "\n";
        generateForm.pieces = getPieces();
        generateForm.frameContent = frameHtml;
        generateForm.processid = processid + "";
        generateForm.titile = "titile";
        generateForm.jsdoccode = "$(document).ready(function(){ })";
        generateForm.jscode = "";
        generateForm.modaldialog = [];
        generateForm.selfjs = [];
        generateForm.selfcss = [];
        generateForm.selfi18n = [];

        return generateForm;
    }

    var getTableObject = function (formName, bfdOperationParamsObj, metaDataColumns, processid) {
        var frameHtml = $.bfd.tableListAPI.getTableListHTML(formName, bfdOperationParamsObj, metaDataColumns);

        frameHtmlObj = $(frameHtml.split('<div class="footer-bg ui-sortable"></div>')[0]);
        $(frameHtmlObj).find('div[type="layout"]').addClass("form-group");
        var refer = new ReferenceManage();
        var generateForm = {};
        generateForm.meta = '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + '    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
        generateForm.css = refer.getCSS();
        /*加入一些必要的css文件*/
        generateForm.css.push("css/component/m-layout.css");
        generateForm.css.push("css/component/myAdmin.css");
        generateForm.css.push("css/lib/mCustomScrollbar/jquery.mCustomScrollbar.min.css");
        generateForm.css.push("css/lib/jquery-ui.min.css");
        generateForm.css.push("css/component/m-label.css");
        generateForm.css.push("css/bootstrap/fileinput/css/fileinput.css");
        generateForm.css.push("css/bootstrap/bootstrap-datetimepicker.min.css");
        generateForm.css.push("css/bootstrap/bootstrap-table.min.css");

        generateForm.js = refer.getJS();
        /*加入一些必要的js文件*/
        generateForm.js.push("js/component/m-layout.js");
        generateForm.js.push("js/component/panel.js");
        generateForm.js.push("js/component/m-label.js");
        generateForm.js.push("js/lib/fileinput/fileinput.js");
        generateForm.js.push("js/lib/fileinput/fileinput_locale_zh.js");

        generateForm.js.push("js/lib/bootstrap-table.min.js");
        generateForm.js.push("js/lib/bootstrap-table-editable.js");
        generateForm.js.push("js/lib/bootstrap-table-zh-CN.min.js");
        generateForm.js.push("js/lib/bootstrap-table-toolbar.js");
        generateForm.js.push("js/page/layoutitPageTable.js");
        generateForm.pageVM = getPageVM();
        generateForm.body = getFormatCode() + "\n";
        generateForm.pieces = getPieces();
        generateForm.frameContent = frameHtml;
        generateForm.processid = processid + "";
        generateForm.titile = "titile";
        generateForm.jsdoccode = "$(document).ready(function(){ })";
        generateForm.jscode = "";
        generateForm.modaldialog = [];
        generateForm.selfjs = [];
        generateForm.selfcss = [];
        generateForm.selfi18n = [];

        return generateForm;
    }

    var insertBcpReForm = function (formUrl, modelid, tenantid, name, processid) {
        commonAjax("DELETE", "orm/table/bcp_re_form?param=" + encodeURIComponent(JSON.stringify({
                condition: {
                    "cname": "formurl",
                    "value": formUrl,
                    "compare": "="
                }
            })), undefined,
            function (data) {
                if (data.status == 1) {
                    createBcpReForm(formUrl, modelid, tenantid, name, processid)
                }
            },
            undefined);

    }
    var createBcpReForm = function (formUrl, modelid, tenantid, name, processid) {
        var date = new Date();
        var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        var formData = {
            "columns": {
                "name": name,
                "type": "表单",
                "status": "已发布",
                "formurl": formUrl,
                "createtime": time,
                "packageid": processid,
                "creator": maoEnvBase.getCurrentUserName().split('@')[0],
                "modelid": modelid
            }
        };
        commonAjax("post", "orm/table/bcp_re_form", JSON.stringify(formData), sucessCallBack, errorCallBack);
    }
    var insertBcpReList = function (formUrl, modelid, tenantid, name, processid) {
        commonAjax("DELETE", "orm/table/bcp_re_form?param=" + encodeURIComponent(JSON.stringify({
                condition: {
                    "cname": "formurl",
                    "value": formUrl,
                    "compare": "="
                }
            })), undefined,
            function (data) {
                if (data.status == 1) {
                    createBcpReLis(formUrl, modelid, tenantid, name, processid)
                }
            },
            undefined);
    }

    var createBcpReLis = function (formUrl, modelid, tenantid, name, processid) {
            var date = new Date();
            var time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            var formData = {
                "columns": {
                    "name": name,
                    "type": "列表",
                    "status": "已发布",
                    "formurl": formUrl,
                    "createtime": time,
                    "packageid": processid,
                    "creator": maoEnvBase.getCurrentUserName().split('@')[0],
                    "modelid": modelid
                }
            };
            commonAjax("post", "orm/table/bcp_re_form", JSON.stringify(formData), sucessCallBack, errorCallBack);
        }
        /*公共ajax*/
    var commonAjax = function (method, url, data, successCallback, errorCallback, traditional) {
            if (traditional == undefined) {
                traditional = false;
            }
            $.ajax({
                type: method,
                url: url,
                data: data,
                datatype: 'json',
                traditional: traditional,
                contentType: 'application/json; charset=UTF-8',
                async: false,
                success: function (data, textStatus) {
                        if (typeof data == 'string') {
                            data = JSON.parse(data);
                        }
                        if (successCallback) {
                            successCallback(data);
                        } else {
                            result = data;
                        }

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (typeof errorCallback === "function") {
                            errorCallback(textStatus, errorThrown, urlAndParam);
                        } else {
                            result.status = 0;
                            result.message = "textStatus " + textStatus + " errorThrown " + errorThrown + " url " + urlAndParam;
                        }

                    }
            });

        }
        /*拼接默认表单前后两节代码*/
    var _nodesHtml = function (nodes, dataMap) {
        var layoutId = 'layout' + new Date().getTime() + parseInt(100 * Math.random()),
            buttonId = 'button' + new Date().getTime() + parseInt(100 * Math.random());
        var bfdOperationParamsObj = {};
        var vmId = "vm" + new Date().getTime();
        if (nodes[0][0].type == "processdata") {
            bfdOperationParamsObj = dataMap.get("processdata");
        } else {
            bfdOperationParamsObj = dataMap.get("systemdata");
        }
        bfdOperationParamsObj.model = vmId;
        var attrStr = 'input_dataset_' + vmId + '="' + nodes[0][0].id + '" uri="' + bfdOperationParamsObj.set + '" dsname="' + bfdOperationParamsObj.service + '" dstype="' + bfdOperationParamsObj.dsType + '" bfd_set_param_type="in"';
        var bfdOperationParams = 'bfd-operation-params="' + encodeURIComponent(JSON.stringify(bfdOperationParamsObj)) + '"';
        var html = [];
        html.push('<div class="demo_parent" style="margin: 0px;padding: 0px;background-color: #ffffff;position: relative;word-wrap: break-word;height: 645px;overflow: auto;">');
        html.push('<div class="demo ui-sortable">');
        html.push('<div class="lyrow ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger">');
        html.push('<i class="glyphicon-remove glyphicon"></i>');
        html.push('</a>');
        html.push('<div class="preview">');
        html.push('<div class="img-left">');
        html.push('<img src="img/frame/icon/ly-12.png" class="mCS_img_loaded"></div>12/自定义</div>');
        html.push('<div class="view form-component_active draggableHandle">');
        html.push('<div type="layout" class="layout layout-white" layout-body-style="layout-white" ratio="12" compid="' + vmId + '" compname="' + vmId + '" layoutstyle="" ms-controller="' + vmId + '" id="' + vmId + '" ' + bfdOperationParams + ' ' + attrStr + '>');
        html.push('<div class="row clearfix">');
        html.push('<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column ui-sortable">');
        //拼接表单内容
        for (var i = 0; i < nodes.length; i++) {
            html.push(_createDataHtml(nodes[i], dataMap));            
        }
        
        //拼接提交按钮
        html.push('<div class="box box-element ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger showRemove"><i class="glyphicon-remove glyphicon"></i></a>');
        html.push('<div class="preview"><div class="img-left"><img src="img/frame/icon/button.png" class="mCS_img_loaded"></div>按钮</div>');
        html.push('<div class="view draggableHandle">');
        html.push('<div type="button" data-color="btn-primary" data-size="btn-sm" compid="' + buttonId + '" compname="' + buttonId + '" class="layout-align-right bc-white" button_type_select="submit" buttontype="submit" defaultvalue="%E7%A1%AE%E5%AE%9A">');
        html.push('<button type="button" class="btn btn-primary btn-sm" style="margin-right:10px;margin-bottom:10px;" id="' + buttonId + '" name="' + buttonId + '" ms-click="submit" i18nkey="确定">确定</button>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        
        //后半段拼接的html代码
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');
        html.push('<div class="footer-bg ui-sortable">');
        html.push('</div>');
        return html;
    }

    /*创建整个默认表单的整体页面的代码*/
    var _createDataHtml = function (nodeArry, dataMap) {

        var html = [],
            exchange = encodeURIComponent(nodeArry[0].name),
            vmId = "vm" + new Date().getTime(),
            panelId = "bfd_panel" + new Date().getTime() + parseInt(100 * Math.random()),
            labelId = "label" + new Date().getTime() + parseInt(100 * Math.random()),
            //拼接绑定数据源的需要的div属性片段
            columnStr = '',
            columnArray = [];
        //建立一个二维数组去对数据源的对象重新编排，保证后面拼接样式的错乱
        //array = new Array(),
        //tArray = new Array();
        var bfdOperationParamsObj = {};
        if (nodeArry[0].type == "processdata") {
            bfdOperationParamsObj = dataMap.get("processdata");
        } else {
            bfdOperationParamsObj = dataMap.get("systemdata");
        }
        bfdOperationParamsObj.model = vmId;
        var attrStr = 'input_dataset_' + vmId + '="' + nodeArry[0].id + '" uri="' + bfdOperationParamsObj.set + '" dsname="' + bfdOperationParamsObj.service + '" dstype="' + bfdOperationParamsObj.dsType + '" bfd_set_param_type="in"';
        var bfdOperationParams = 'bfd-operation-params="' + encodeURIComponent(JSON.stringify(bfdOperationParamsObj)) + '"';
        $.each(Array,
            function (i, value) {
                columnArray.push('{"name":"' + value.column + '","type":"' + value.colType + '","length":"' + value.length + '"}');
            });
        columnStr = columnArray.join(",");
        var vmodelId = 'layout' + new Date().getTime() + parseInt(100 * Math.random());
        // html.push('<div class="lyrow ui-draggable" style="display: block;">');
        // html.push('<a href="#close" class="remove label label-danger showRemove">');
        // html.push('<i class="glyphicon-remove glyphicon"></i></a>');
        // html.push('<div class="preview">12/自定义</div>');
        // html.push('<div class="view">');
        // html.push('<div type="layout" class="layout" ratio="12" compid="' + vmodelId + '" compname="' + vmodelId + '" layoutstyle="" id="' + vmodelId + '" >');
        // html.push('<div class="row clearfix">');
        // html.push('<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column ui-sortable" style="padding-bottom: 5px;">');
        
        html.push('<div class="lyrow ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger showRemove"><i class="glyphicon-remove glyphicon"></i></a>');
        html.push('<div class="preview">panel</div>');
        html.push('<div class="view">');
        html.push('<div type="bfd_panel" class="bfd-panel sort-disable mb50 bfd-panel-sortable" id="p3" data-panel-color="false" data-panel-remove="false" data-panel-title="false" data-panel-collapse="false" compid="' + panelId + '" compname="' + panelId + '" bfd-panel-heading="checked" bfd-panel-body-style="default" bfd-panel-scrollbar-style="dark" bfd-panel-sortable="checked" panel_body_style="default">');
        html.push('<div class="bfd-panel-heading">');
        html.push('<div class="row clearfix">');
        html.push('<div class="col-md-6 col-xs-6 col-sm-6 col-lg-6 column ui-sortable">');
        html.push('<div class="box box-element ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger"><i class="glyphicon-remove glyphicon"></i></a>');
        html.push('<div class="preview">标题</div>');
        html.push('<div class="view draggableHandle">');
        html.push('<div type="label" lablefontsize="16" labelfontweight="true" labelfontcolor="" class="layout-align-left layout-align-right" compid="' + labelId + '" compname="' + labelId + '" defaultvalue="' + encodeURIComponent(nodeArry[0].name) + '">');
        html.push('<label class="control-label" id="' + labelId + '" name="' + labelId + '" i18nkey="' + nodeArry[0].name + '">' + nodeArry[0].name + '</label>');
        html.push('</div></div></div></div>');
        html.push('<div class="col-md-6 col-xs-6 col-sm-6 col-lg-6 column ui-sortable">');
        html.push('<div class="box box-element layout-block-align-right ui-draggable">');
        html.push('<a href="#close" class="remove label label-danger"><i class="glyphicon-remove glyphicon"></i></a>');
        html.push('<div class="preview">图标</div>');
        html.push('<div class="view">');
        html.push('<div type="bfd_icon" alignstyle="layout-block-align-right" class="bfd-panel-default-controls">');
        html.push('<a id="btnCollapse" class="icon glyphicon glyphicon-minus"></a>');
        html.push('</div></div></div></div></div><hr /></div>');
        html.push('<div class="bfd-panel-body">');
        html.push('<div class="row clearfix">');
        html.push('<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column ui-sortable">');
        var displayArray = [],
            visibleArray = [];
        for (var i = 1; i < nodeArry.length; i++) {
            if (nodeArry[i].visible == false) {
                displayArray.push(nodeArry[i]);
            } else if (nodeArry[i].visible == true) {
                visibleArray.push(nodeArry[i]);
            }
        }
        var displayTArray = createTwoDA(displayArray);
        var visibleTArray = createTwoDA(visibleArray);

        if (displayTArray.length != 0) {
            html.push(splitLayoutStyle(displayTArray, true));
        }
        html.push(splitLayoutStyle(visibleTArray, false));

        //html.push('</div></div></div></div></div>');       
        html.push('</div></div></div></div></div></div>');      

        return html.join(" ");
    }

    //遍历这个二维数组并拼接对应布局器的样式进去
    var splitLayoutStyle = function (tArray, visibleFlag) {
        var copmid = new Date().getTime() + parseInt(100 * Math.random()),
            html = [];
                
        for (var i = 0; i < tArray.length; i++) {
            if (tArray[i].length == 1) {
                /*if(tArray[i][0].companentType !='文本域' && tArray[i][0].companentType !='上传'){*/
                if (tArray[i][0].layout != 1) {
                    html.push(_segmentationRow(tArray[i][0], undefined,visibleFlag));
                } else {
                    html.push(_entireRow(tArray[i][0],visibleFlag));
                }
            } else {
                if ((JSON.stringify(tArray[i][1]) == "{}")) {
                    html.push(_segmentationRow(tArray[i][0], undefined,visibleFlag));
                } else {
                    html.push(_segmentationRow(tArray[i][0], tArray[i][1],visibleFlag));
                }

            }

        }
        
        return html.join(" ");
    }

    //创建二维数组方法
    var createTwoDA = function (nodeArry) {
            var array = new Array(),
                tArray = new Array();
            for (var i = 0; i < nodeArry.length; i++) {
                /*if(nodeArry[i].companentType !='文本域' && nodeArry[i].companentType !='上传' && nodeArry[i].layout !=1){*/
                if (nodeArry[i].layout != 1) {
                    array.push(nodeArry[i]);
                    if ((i == nodeArry.length - 1 || nodeArry[i + 1].layout == 2) && array.length == 1) {
                        array.push({});
                    } else {
                        if (array.length == 1 && (nodeArry[i + 1].layout == 1 || nodeArry[i].layout == 2)) {
                            array.push({});
                        }
                    }

                } else {
                    tArray.push([nodeArry[i]]);
                }
                if (array.length == 2) {
                    tArray.push(array);
                    array = [];
                }
            }
            return tArray;
        }
        /**
         * 读取数据模型json文件
         */
    var readDataModelJson = function (jsonPath) {
            var bfdOperationParams = {};
            $.ajax({
                type: "get",
                url: jsonPath,
                async: false,
                success: function (data) {
                    var dsname = data[0].name,
                        uri = data[0].services[0].sets[0].set_path;
                    if (uri.split("/").length == 3) {
                        uri = data[0].services[0].sets[1].set_path;
                    }
                    var url = data[0].app_path + uri;
                    bfdOperationParams.dsType = "json";
                    bfdOperationParams.source = dsname;
                    bfdOperationParams.service = dsname;
                    bfdOperationParams.set = uri;
                    bfdOperationParams.operations = [{
                        "method": "POST",
                        "submit": "formOperator",
                        "url": url,
                        "name": "add"
                    }, {
                        "method": "PUT",
                        "submit": "formOperator",
                        "url": url,
                        "name": "update"
                    }, {
                        "method": "DELETE",
                        "submit": "delete",
                        "url": url,
                        "name": "delete"
                    }, {
                        "method": "GET",
                        "submit": "initVMData",
                        "url": url,
                        "name": "query"
                    }];
                }
            });
            return bfdOperationParams;
        }
        /**
         * 循环遍历数据项字段生成表单可用的数据结构
         */

    var dataStructure = function (data) {
        var array = [];
        $.each(data, function (index, value) {
            var datacolumn = value.metadata,
                groupMap = value.groupMap,
                modelid = value.id,
                dataBlockArray = [];
            dataBlockArray = removeDuplicatedItem(datacolumn);
            for (var i = 0; i < dataBlockArray.length; i++) {
                var arr = [],
                    startArray = [],
                    endArray = [],
                    blockId = dataBlockArray[i],
                    blockProperty = blockId + "";
                for (var j = 0; j < datacolumn.length; j++) {
                    if (blockId == datacolumn[j].dataBlock) {
                        var dataBlock = datacolumn[j].dataBlock,
                            columnname = datacolumn[j].item_id,
                            name = datacolumn[j].item_name,
                            visible = datacolumn[j].ui_visible,
                            enumerateType = dataModelColumnDataMapping.itemColumnTypeDataMappingValue(datacolumn[j].item_type),
                            compType = dataModelColumnDataMapping.itemCompanentCompanentTypeDataMappingValue(datacolumn[j].component_type),
                            colType = "",
                            companentType = "",
                            defaultVal = datacolumn[j].item_default,
                            layout = datacolumn[j].layout;
                        if (defaultVal == null) {
                            defaultVal = "";
                        }
                        if (enumerateType == '整数') {
                            companentType = getCompType("文本框", compType);
                            colType = "int";
                        } else if (enumerateType == '浮点型') {
                            companentType = getCompType("文本框", compType);
                            colType = "double";
                        } else if (enumerateType == '短文本') {
                            companentType = getCompType("文本框", compType);
                            colType = "string";
                        } else if (enumerateType == '长文本') {
                            companentType = getCompType("文本域", compType);
                            colType = "string";
                        } else if (enumerateType == '日期') {
                            companentType = getCompType("日期", compType);
                            colType = "date";
                        } else if (enumerateType == '逻辑型') {
                            companentType = getCompType("下拉框", compType);
                            colType = "boolean";
                        }
                        var length = datacolumn[j].item_lenth,
                            id = new Date().getTime() + parseInt(100 * Math.random()),
                            required = datacolumn[j].required,
                            columnObj = {
                                "id": id,
                                "pId": modelid,
                                "name": name,
                                "column": columnname,
                                "companentType": companentType,
                                "colType": colType,
                                "length": length,
                                "required": required,
                                "defaultVal": defaultVal,
                                "visible": visible,
                                "layout": layout,
                                "dataBlock": dataBlock
                            };

                        if (visible) {
                            startArray.push(columnObj);
                        } else {
                            endArray.push(columnObj);
                        }
                    }

                }
                //不将隐藏数据项添加到默认生成的表单
                arr = startArray.concat(endArray);
                arr.unshift({
                    "id": modelid,
                    "name": groupMap[blockProperty],
                    "type": "processdata",
                    "open": false
                });
                array.push(arr);
            }

        });
        return array;
    }

    /*数组去重方法*/
    var removeDuplicatedItem = function (ar) {
        var tmp = {},
            ret = [];

        for (var i = 0,
            j = ar.length; i < j; i++) {
            if (!tmp[ar[i].dataBlock]) {
                tmp[ar[i].dataBlock] = 1;
                ret.push(ar[i].dataBlock);
            }
        }

        return ret.sort();
    }

    var getCompType = function (defaultCompType, compType) {
        if (compType == "") {
            return defaultCompType;
        } else {
            switch (compType) {
            case 'label':
                return '标签';
                break;
            case 'input_text':
                return '文本框';
                break;
            case 'textarea':
                return '文本域';
                break;
            case 'select_dynamic':
                return '下拉框';
                break;
            case 'input_radio':
                return '单选框';
                break;
            case 'checkbox':
                return '多选框';
                break;
            case 'input_datetime':
                return '日期';
                break;
            case 'input_fileinput':
                return '上传';
                break;
            default:
                previewIcon = '';
            }
        }
    }
    var _getLabel = function (node) {
        var html = [],
            name = node.name,
            ecodeName = encodeURIComponent(name),
            labelId = "label_title_" + node.column;
        html.push('<div class="box box-element ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger">');
        html.push('<i class="glyphicon-remove glyphicon"></i>');
        html.push('</a>');
        html.push('<div class="preview">标签</div>');
        html.push('<div class="view draggableHandle">');
        html.push('<div type="label" compid="' + labelId + '" compname="' + labelId + '" lablefontsize="16" labelfontweight="是" labelfontcolor="" class="layout-align-right" defaultvalue="' + ecodeName + '">');
        html.push('<label class="control-label" id="' + labelId + '" name="' + labelId + '" i18nkey="' + name + '">' + name + '</label></div>');
        html.push('</div>');
        html.push('</div>');
        return html.join(" ");
    }
    var _getComponent = function (node) {
        var html = [],
            colType = node.colType,
            visible = node.visible,
            compStyle = node.companentType,
            layout = node.layout,
            layoutId = "layout" + new Date().getTime() + parseInt(1000 * Math.random()),
            divAttr = 'editable="%7B%22add%22%3A%22checked%22%2C%22view%22%3A%22%22%2C%22modify%22%3A%22checked%22%7D" fieldtype="' + node.colType + '" field="' + node.column + '" defaultvalue="' + node.defaultVal + '" vnotempty=' + node.required + '',
            compAttr = ' ms-duplex-string="' + node.column + '" i18nkey="' + node.defaultVal + '" ',
            checkboxAttr = ' type="checkbox"  ms-duplex-number="' + node.column + '_form_compute"';
        html.push('<div class="box box-element ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger">');
        html.push('<i class="glyphicon-remove glyphicon"></i>');
        html.push('</a>');
        html.push('<div class="preview">' + compStyle + '</div>');
        html.push('<div class="view draggableHandle">');
        if (compStyle == '文本框') {
            var dataValidate = "";
            if (colType == "int" || colType == "long") {
                dataValidate = 'vnotempty="true" vcontent="integer%3A%7B%7D" vtype="integer"';
            } else if (colType == "double" || colType == "float") {
                dataValidate = 'vnotempty="true" vcontent="numeric%3A%7B%7D" vtype="numeric"';
            }
            html.push('<div ' + dataValidate + 'type="input_text" compid="input_text_' + node.column + '" compname="input_text_' + node.column + '" ' + divAttr + ' ><input type="text" class="form-control" id="input_text_' + node.column + '" name="input_text_' + node.column + '"' + compAttr + '></div>');
        } else if (compStyle == '文本域') {
            html.push('<div type="textarea" compid="textarea_' + node.column + '" compname="textarea_' + node.column + '" ' + divAttr + '><textarea class="form-control" rows="2" id="textarea_' + node.column + '" name="textarea_' + node.column + '" ' + compAttr + '></textarea></div>');
        } else if (compStyle == '下拉框') {
            html.push('<div type="select_dynamic" init="true" compid="select_dynamic_' + node.column + '" compname="select_dynamic_' + node.column + '" ' + divAttr + '>');
            html.push('<select style="display : inline;width:100%;" class="form-control" id="select_dynamic_' + node.column + '" name="select_dynamic_' + node.column + '"' + compAttr + '><option>下拉框选项1</option><option>下拉框选项2</option></select></div>');
        } else if (compStyle == '单选框') {
            html.push('<div type="input_radio" optionvalue="%E5%90%8C%E6%84%8F%3A1%0A%E4%B8%8D%E5%90%8C%E6%84%8F%3A0" init="true" class="form-control" compid="input_radio_' + node.column + '" compname="input_radio_' + node.column + '" ' + divAttr + '>');
            html.push('<input type="radio" value="1"  class=".pr10" name="input_radio_' + node.column + '"' + compAttr + '/>同意<input type="radio" value="0"  name="input_radio_' + node.column + '"' + compAttr + '/>不同意</div>');
        } else if (compStyle == '多选框') {
            html.push('<div type="checkbox" init="true" class="form-control" compid="checkbox_' + node.column + '" compname="checkbox_' + node.column + '" ' + divAttr + '>');
            html.push('<input ' + checkboxAttr + ' value="football"  name="checkbox_' + node.column + '" /><span>选项1</span>');
            html.push('<input ' + checkboxAttr + ' value="basketball" name="checkbox_' + node.column + '" /><span>选项2</span><input ' + checkboxAttr + ' value="baseball" name="checkbox_' + node.column + '"/><span>选项3</span></div>');
        } else if (compStyle == '日期') {
            var dateValidate = 'vcontent="date%3A%7Bformat%3A%20' + '\'' + 'YYYY-MM-DD%20h%3Am%3As' + '\'' + '%7D" datetimeformat="YYYY-MM-DD%20HH%3Amm%3Ass" vtype="datetime" ';
            /*if(colType = "date"){
				dateValidate = 'vcontent="date%3A%7Bformat%3A%20'+'\''+'YYYY-MM-DD'+'\''+'%7D" datetimeformat="YYYY-MM-DD" vtype="date" ';
			}else if(colType = "datetime"){
				dateValidate = 'vcontent="date%3A%7Bformat%3A%20'+'\''+'YYYY-MM-DD%20h%3Am%3As'+'\''+'%7D" datetimeformat="YYYY-MM-DD%20HH%3Amm%3Ass" vtype="datetime" ';
			}*/
            html.push('<div type="input_datetime" ' + dateValidate + ' compid="input_datetime_' + node.column + '" compname="input_datetime_' + node.column + '" ' + divAttr + '>');
            html.push('<input class="form-control form_time" placeholder="YYYY-MM-DD HH:mm:ss" datetimeformat="YYYY-MM-DD%20HH%3Amm%3Ass" vcontent="date%3A%7Bformat%3A%20' + '\'' + 'YYYY-MM-DD%20h%3Am%3As' + '\'' + '%7D" vtype="datetime" type="text" id="input_datetime_' + node.column + '" name="input_datetime_' + node.column + '"' + compAttr + '></div>');
        } else if (compStyle == '上传') {
            html.push('<div type="input_fileinput"  init="true" compid="input_fileinput_' + node.column + '" compname="input_fileinput_' + node.column + '" ' + divAttr + '>');
            html.push('<input type="file" class="file"  data-show-preview="false" id="textarea_' + node.column + '" name="textarea_' + node.column + '" /></div>');
        } else if (compStyle == '标签') {
            html.push('<div type="label" lablefontsize="16" labelfontweight="是" labelfontcolor="" class="layout-align-left" compid="label_' + node.column + '" alignstyle="layout-align-left" defaultvalue="' + encodeURIComponent("${" + node.column + "}") + '" compname="label_' + node.column + '" ' + divAttr + ' ><label class="control-label" id="label_' + node.column + '" name="label_' + node.column + '"' + compAttr + '>${' + node.column + '}</label></div>');
        }
        html.push('</div>');
        html.push('</div>');
        return html.join(" ");

    }

    /*布局器2,10布局的页面代码拼接*/
    var _entireRow = function (node,visible) {
        var html = [],
            layoutId = "layout" + new Date().getTime() + parseInt(1000 * Math.random());
        html.push('<div class="lyrow ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger">');
        html.push('<i class="glyphicon-remove glyphicon"></i>');
        html.push('</a>');
        html.push('<div class="preview">12/自定义</div>');
        html.push('<div class="view">');
        if(visible){
            html.push('<div type="layout" componentvisibility="true" ratio="2,10" compid="' + layoutId + '" compname="' + layoutId + '" layoutstyle="" id="' + layoutId + '" >');    
        }else{
            html.push('<div type="layout" ratio="2,10" compid="' + layoutId + '" compname="' + layoutId + '" layoutstyle="" id="' + layoutId + '" >');
        }
        
        html.push('<div class="row clearfix">');
        html.push('<div class="col-md-2 col-xs-2 col-sm-2 col-lg-2 column ui-sortable" style="padding-bottom: 5px;">');
        html.push(_getLabel(node));
        html.push('</div>');
        html.push('<div class="col-md-10 col-xs-10 col-sm-10 col-lg-10 column ui-sortable" style="padding-bottom: 5px;">');
        html.push(_getComponent(node));
        html.push('</div>');
        html.push('</div></div></div></div>');
        return html.join(" ");
    }

    /*布局器2,4,2,4布局的页面代码拼接*/
    var _segmentationRow = function (node, nodeNext,visible) {
        var html = [],
            layoutId = "layout" + new Date().getTime() + parseInt(1000 * Math.random());
        html.push('<div class="lyrow ui-draggable" style="display: block;">');
        html.push('<a href="#close" class="remove label label-danger">');
        html.push('<i class="glyphicon-remove glyphicon"></i>');
        html.push('</a>');
        html.push('<div class="preview">12/自定义</div>');
        html.push('<div class="view">');
        
        if(visible){
            html.push('<div type="layout" componentvisibility="true" ratio="2,4,2,4" compid="' + layoutId + '" compname="' + layoutId + '" layoutstyle="" id="' + layoutId + '" >');
        }else{
            html.push('<div type="layout" ratio="2,4,2,4" compid="' + layoutId + '" compname="' + layoutId + '" layoutstyle="" id="' + layoutId + '" >');
        }

        html.push('<div class="row clearfix">');
        html.push('<div class="col-md-2 col-xs-2 col-sm-2 col-lg-2 column ui-sortable" style="padding-bottom: 5px;">');
        html.push(_getLabel(node));
        html.push('</div>');
        html.push('<div class="col-md-4 col-xs-4 col-sm-4 col-lg-4 column ui-sortable" style="padding-bottom: 5px;">');
        html.push(_getComponent(node));
        html.push('</div>');
        if (nodeNext != undefined) {
            html.push('<div class="col-md-2 col-xs-2 col-sm-2 col-lg-2 column ui-sortable" style="padding-bottom: 5px;">');
            html.push(_getLabel(nodeNext));
            html.push('</div>');
            html.push('<div class="col-md-4 col-xs-4 col-sm-4 col-lg-4 column ui-sortable" style="padding-bottom: 5px;">');
            html.push(_getComponent(nodeNext));
            html.push('</div>');
        } else {
            html.push('<div class="col-md-2 col-xs-2 col-sm-2 col-lg-2 column ui-sortable" style="padding-bottom: 5px;">');
            html.push('</div>');
            html.push('<div class="col-md-4 col-xs-4 col-sm-4 col-lg-4 column ui-sortable" style="padding-bottom: 5px;">');
            html.push('</div>');
        }
        html.push('</div></div></div></div>');
        return html.join(" ");
    }

    var initDataSourceInfo = function (dsName) {
        /**
         * 追加自定义数据源
         */
        var jsonDatas = $.bfd.datasource.datasourceForJson.buildDataSource('default', dsName);
        $.bfd.datasource().appendData(jsonDatas);
    }
    win.processTools = new ProcessTools();

    /*********************************************************************************
     * 生成列表API
     * @constructor
     *********************************************************************************/
    var TableListAPI = function () {
        this.tableId = 'table_base1479283560423';
        this.tableRows = [];
        this.tableURL = "";
    }

    TableListAPI.prototype = {
        /**
         * 初始化表格列表
         * @param bfdOperationParams
         * @param dataColumns
         */
        getTableListHTML: function (formName, bfdOperationParams, metaColumns) {
                var demoObject = $(this._getQueryHTML(formName, bfdOperationParams));
                this.setTableParams(bfdOperationParams);
                this._generateTable($(demoObject).find("div[type=table_base]"), metaColumns);
                return $(demoObject).html();
            },

            /**
             * 设置表格参数
             * @param bfdOperationParams
             */
            setTableParams: function (bfdOperationParams) {
                if (!bfdOperationParams || !bfdOperationParams.operations) {
                    return;
                }

                var that = this;
                $.each(bfdOperationParams.operations,
                    function (index, item) {
                        if (item.method === "GET") {
                            that.tableURL = item.url;
                        }
                    })
            },

            /**
             * 获取查询区域html
             * @returns {string}
             */
            _getQueryHTML: function (formName, bfdOperationParams) {
                return '<div><div class="demo_parent" style="margin: 0px;padding: 0px;background-color: #ffffff;position: relative;word-wrap: break-word;height: 645px;overflow: auto;">' + '<div class="demo ui-sortable">' + '<div class="lyrow ui-draggable" style="display: block;">' + '<a href="#close" class="remove label label-danger showRemove">' + '<i class="glyphicon-remove glyphicon">' + '</i>' + '</a>' + '<div class="preview">' + '	<div class="img-left">' + '		<img src="img/frame/icon/ly-12.png" class="mCS_img_loaded">' + '	</div>' + '	12/自定义' + '</div>' + '<div class="view draggableHandle form-component_active">' + '	<div type="layout" class="layout layout-white" ratio="4,3,3,2" compid="vm1479283428212" compname="vm1479283428212" layout-body-style="layout-white" ms-controller="vm1479283428212" id="vm1479283428212" uri="' + bfdOperationParams.set + '" ' + '   dsname="' + bfdOperationParams.source + '" dstype="' + bfdOperationParams.dsType + '" bfd-operation-params="' + encodeURIComponent(JSON.stringify(bfdOperationParams)) + '" bfd_set_param_type="in" >' + '		<div class="row clearfix">' + '			<div class="col-md-4 col-xs-4 col-sm-4 col-lg-4 column ui-sortable" style="padding-bottom: 0px; min-height: 50px;" data-toolbar-layout="true" id="groupLayout1479283452718"><div class="box box-element fl ui-draggable" style="display: block;">' + '					<a href="#close" class="remove label label-danger">' + '						<i class="glyphicon-remove glyphicon">' + '						</i>' + '					</a>' + '					<div class="preview">' + '						<div class="img-left">' + '							<img src="img/frame/icon/toolbar-button.png" class="mCS_img_loaded">' + '						</div>' + '						工具栏按钮' + '					</div>' + '					<div class="view draggableHandle">' + '						<div type="toolbar-button" data-type="toolbar-button" data-split="false" data-color="btn-primary" data-size="btn-sm" compid="button-add" compname="button-add" defaultvalue="%20%E6%96%B0%E5%A2%9E" buttonicon="glyphicon%20glyphicon-plus" componentevent="%7B%22type%22%3A%22toolbar-button%22%2C%22id%22%3A%22button-add%22%2C%22events%22%3A%5B%5D%7D" eventrowdata="%5B%7B%22title%22%3A%22%3Cselect%20class%3D%5C%22form-textbox%20form-combo%20col-md-12%5C%22%20id%3D%5C%22selecttitle0%5C%22%3E%3Coption%20value%3D%5C%22%5C%22%20param%3D%5C%22%5C%22%3E%E8%AF%B7%E9%80%89%E6%8B%A9%3C%2Foption%3E%20%3Coption%20value%3D%5C%22click%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%20selected%3D%5C%22selected%5C%22%3Eclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22change%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Echange%3C%2Foption%3E%20%3Coption%20value%3D%5C%22blur%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eblur%3C%2Foption%3E%20%3Coption%20value%3D%5C%22dblclick%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Edblclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keydown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeydown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keypress%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeypress%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keyup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeyup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mousedown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emousedown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mouseup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emouseup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22ready%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eready%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unbind%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunbind%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unload%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunload%3C%2Foption%3E%3C%2Fselect%3E%22%2C%22event%22%3A%22%3Ctextarea%20class%3D%5C%22form-textbox%20form-textbox-text%20col-md-12%5C%22%20id%3D%5C%22tableevent0%5C%22%20style%3D%5C%22height%3A%2080px%3B%5C%22%20defaultvalue%3D%5C%22%E8%BE%93%E5%85%A5%E5%87%BD%E6%95%B0%E5%86%85%E5%AE%B9%EF%BC%8C%E5%8F%82%E6%95%B0%E4%B8%BA%3A%20%E6%97%A0%5C%22%20event%3D%5C%22click%5C%22%3E%3C%2Ftextarea%3E%22%7D%2C%7B%22title%22%3A%22%3Cselect%20class%3D%5C%22form-textbox%20form-combo%20col-md-12%5C%22%20id%3D%5C%22selecttitle1%5C%22%3E%3Coption%20value%3D%5C%22%5C%22%20param%3D%5C%22%5C%22%20selected%3D%5C%22selected%5C%22%3E%E8%AF%B7%E9%80%89%E6%8B%A9%3C%2Foption%3E%20%3Coption%20value%3D%5C%22click%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22change%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Echange%3C%2Foption%3E%20%3Coption%20value%3D%5C%22blur%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eblur%3C%2Foption%3E%20%3Coption%20value%3D%5C%22dblclick%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Edblclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keydown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeydown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keypress%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeypress%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keyup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeyup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mousedown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emousedown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mouseup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emouseup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22ready%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eready%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unbind%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunbind%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unload%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunload%3C%2Foption%3E%3C%2Fselect%3E%22%2C%22event%22%3A%22%3Ctextarea%20class%3D%5C%22form-textbox%20form-textbox-text%20col-md-12%5C%22%20id%3D%5C%22tableevent1%5C%22%20style%3D%5C%22height%3A%2080px%3B%5C%22%3E%3C%2Ftextarea%3E%22%7D%2C%7B%22title%22%3A%22%3Cselect%20class%3D%5C%22form-textbox%20form-combo%20col-md-12%5C%22%20id%3D%5C%22selecttitle2%5C%22%3E%3Coption%20value%3D%5C%22%5C%22%20param%3D%5C%22%5C%22%20selected%3D%5C%22selected%5C%22%3E%E8%AF%B7%E9%80%89%E6%8B%A9%3C%2Foption%3E%20%3Coption%20value%3D%5C%22click%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22change%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Echange%3C%2Foption%3E%20%3Coption%20value%3D%5C%22blur%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eblur%3C%2Foption%3E%20%3Coption%20value%3D%5C%22dblclick%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Edblclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keydown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeydown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keypress%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeypress%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keyup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeyup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mousedown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emousedown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mouseup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emouseup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22ready%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eready%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unbind%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunbind%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unload%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunload%3C%2Foption%3E%3C%2Fselect%3E%22%2C%22event%22%3A%22%3Ctextarea%20class%3D%5C%22form-textbox%20form-textbox-text%20col-md-12%5C%22%20id%3D%5C%22tableevent2%5C%22%20style%3D%5C%22height%3A%2080px%3B%5C%22%3E%3C%2Ftextarea%3E%22%7D%2C%7B%22title%22%3A%22%3Cselect%20class%3D%5C%22form-textbox%20form-combo%20col-md-12%5C%22%20id%3D%5C%22selecttitle3%5C%22%3E%3Coption%20value%3D%5C%22%5C%22%20param%3D%5C%22%5C%22%20selected%3D%5C%22selected%5C%22%3E%E8%AF%B7%E9%80%89%E6%8B%A9%3C%2Foption%3E%20%3Coption%20value%3D%5C%22click%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22change%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Echange%3C%2Foption%3E%20%3Coption%20value%3D%5C%22blur%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eblur%3C%2Foption%3E%20%3Coption%20value%3D%5C%22dblclick%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Edblclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keydown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeydown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keypress%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeypress%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keyup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeyup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mousedown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emousedown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mouseup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emouseup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22ready%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eready%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unbind%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunbind%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unload%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunload%3C%2Foption%3E%3C%2Fselect%3E%22%2C%22event%22%3A%22%3Ctextarea%20class%3D%5C%22form-textbox%20form-textbox-text%20col-md-12%5C%22%20id%3D%5C%22tableevent3%5C%22%20style%3D%5C%22height%3A%2080px%3B%5C%22%3E%3C%2Ftextarea%3E%22%7D%2C%7B%22title%22%3A%22%3Cselect%20class%3D%5C%22form-textbox%20form-combo%20col-md-12%5C%22%20id%3D%5C%22selecttitle4%5C%22%3E%3Coption%20value%3D%5C%22%5C%22%20param%3D%5C%22%5C%22%20selected%3D%5C%22selected%5C%22%3E%E8%AF%B7%E9%80%89%E6%8B%A9%3C%2Foption%3E%20%3Coption%20value%3D%5C%22click%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22change%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Echange%3C%2Foption%3E%20%3Coption%20value%3D%5C%22blur%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eblur%3C%2Foption%3E%20%3Coption%20value%3D%5C%22dblclick%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Edblclick%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keydown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeydown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keypress%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeypress%3C%2Foption%3E%20%3Coption%20value%3D%5C%22keyup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Ekeyup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mousedown%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emousedown%3C%2Foption%3E%20%3Coption%20value%3D%5C%22mouseup%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Emouseup%3C%2Foption%3E%20%3Coption%20value%3D%5C%22ready%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eready%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unbind%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunbind%3C%2Foption%3E%20%3Coption%20value%3D%5C%22unload%5C%22%20param%3D%5C%22%E6%97%A0%5C%22%3Eunload%3C%2Foption%3E%3C%2Fselect%3E%22%2C%22event%22%3A%22%3Ctextarea%20class%3D%5C%22form-textbox%20form-textbox-text%20col-md-12%5C%22%20id%3D%5C%22tableevent4%5C%22%20style%3D%5C%22height%3A%2080px%3B%5C%22%3E%3C%2Ftextarea%3E%22%7D%5D">' + '						</div>' + '					</div>' + '				</div><div class="box box-element fl ui-draggable" style="display: block;">' + '					<a href="#close" class="remove label label-danger">' + '						<i class="glyphicon-remove glyphicon">' + '						</i>' + '					</a>' + '					<div class="preview">' + '						<div class="img-left">' + '							<img src="img/frame/icon/toolbar-button.png" class="mCS_img_loaded">' + '						</div>' + '						工具栏按钮' + '					</div>' + '					<div class="view draggableHandle">' + '						<div type="toolbar-button" data-type="toolbar-button" data-split="false" data-color="btn-primary" data-size="btn-sm" compid="button-refresh" compname="button-refresh" defaultvalue="%20%E5%88%B7%E6%96%B0" buttonicon="glyphicon%20glyphicon-refresh" bfd-button-query="%7B%22tableId%22%3A%22table_base1479283560423%22%2C%22modelId%22%3A%22vm1479283428212%22%7D">' + '							<button type="button" class="btn btn-primary btn-sm" id="button-refresh" name="button-refresh" i18nkey="刷新" ms-duplex-string="button-refresh" bfd-button-query="%7B%22tableId%22%3A%22table_base1479283560423%22%2C%22modelId%22%3A%22vm1479283428212%22%7D"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> 刷新</button>' + '						</div>' + '					</div>' + '				</div></div>' + '			<div class="col-md-3 col-xs-3 col-sm-3 col-lg-3 column ui-sortable" style="padding-bottom: 4px;">' + '			</div>' + '			<div class="col-md-3 col-xs-3 col-sm-3 col-lg-3 column ui-sortable" style="padding-bottom: 4px;">' + '				<div class="box box-element ui-draggable" style="display: block;">' + '					<a href="#close" class="remove label label-danger">' + '						<i class="glyphicon-remove glyphicon">' + '						</i>' + '					</a>' + '					<div class="preview">' + '						<div class="img-left">' + '							<img src="img/frame/icon/text-area.png" class="mCS_img_loaded">' + '						</div>' + '						文本框' + '					</div>' + '					<div class="view draggableHandle">' + '						<div type="input_text" compid="input_text14792834809732" compname="input_text14792834809732" editable="%7B%22add%22%3A%22checked%22%2C%22view%22%3A%22%22%2C%22modify%22%3A%22checked%22%7D" textboxtype="text" vnotempty="true">' + '							<input type="text" class="form-control" id="input_text14792834809732" name="input_text14792834809732">' + '						</div>' + '					</div>' + '				</div>' + '			</div>' + '			<div class="col-md-2 col-xs-2 col-sm-2 col-lg-2 column ui-sortable" style="padding-bottom: 6px;">' + '				<div class="box box-element ui-draggable" style="display: block;">' + '					<a href="#close" class="remove label label-danger">' + '						<i class="glyphicon-remove glyphicon">' + '						</i>' + '					</a>' + '					<div class="preview">' + '						<div class="img-left">' + '							<img src="img/frame/icon/button.png" class="mCS_img_loaded">' + '						</div>' + '						按钮' + '					</div>' + '					<div class="view draggableHandle">' + '						<div type="button" data-color="btn-primary" data-size="btn-sm" compid="button_query" compname="button_query" class="layout-align-right" button_type_select="query" buttontype="query" bfd-button-query="%7B%22tableId%22%3A%22table_base1479283560423%22%2C%22modelId%22%3A%22vm1479283428212%22%7D" defaultvalue="%E6%9F%A5%E8%AF%A2" buttonicon="glyphicon%20glyphicon-search">' + '							<button type="button" class="btn btn-primary btn-sm" id="button_query" name="button_query" bfd-button-query="%7B%22tableId%22%3A%22table_base1479283560423%22%2C%22modelId%22%3A%22vm1479283428212%22%7D" i18nkey="查询" ms-duplex-string="button_query"><span class="glyphicon glyphicon-search" aria-hidden="true"></span>' + '								查询' + '							</button>' + '						</div>' + '					</div>' + '				</div>' + '			</div>' + '		</div>' + '	</div>' + '</div>' + '</div>' +

                    '<div class="lyrow ui-draggable" style="display: block;">' + '	<a href="#close" class="remove label label-danger showRemove">' + '		<i class="glyphicon-remove glyphicon">' + '		</i>' + '	</a>' + '	<div class="preview">' + '		<div class="img-left">' + '			<img src="img/frame/icon/ly-12.png" class="mCS_img_loaded">' + '		</div>' + '		12/自定义' + '	</div>' + '	<div class="view draggableHandle">' + '		<div type="layout" class="layout layout-white" ratio="12" compid="vm1479283555848" compname="vm1479283555848" layout-body-style="layout-white" ms-controller="vm1479283555848" id="vm1479283555848" uri="' + bfdOperationParams.set + '" ' + '   dsname="' + bfdOperationParams.source + '" dstype="' + bfdOperationParams.dsType + '" bfd-operation-params="' + encodeURIComponent(JSON.stringify(bfdOperationParams)) + '" bfd_set_param_type="in">' + '			<div class="row clearfix">' + '				<div class="col-md-12 col-xs-12 col-sm-12 col-lg-12 column ui-sortable" style="padding-bottom: 0px;">' + '					<div class="box box-element ui-draggable" style="display: block;">' + '						<a href="#close" class="remove label label-danger">' + '							<i class="glyphicon-remove glyphicon">' + '							</i>' + '						</a>' + '						<div class="preview">' + '							<div class="img-left">' + '								<img src="img/frame/icon/remotely-table.png" class="mCS_img_loaded">' + '							</div>' + '							远程表格' + '						</div>' + '						<div class="view draggableHandle">' + '							<div type="table_base"  pagesize="20" tableheight="500" tablemodel="none" tableheaderalign="left" tablecolumnalign="left" compid="table_base1479283560423" compname="table_base1479283560423" hidebox="false">' + '								<table id="table_base1479283560423"></table>' + '							</div>' + '						</div>' + '					</div>' + '				</div>' + '			</div>' + '		</div>' + '	</div>' + '</div>' + '</div>' + '</div>' +

                    '<div class="footer-bg ui-sortable"></div>' + '</div>';
            },
            /**
             * 生成表格参数
             * @param componentObject
             */
            _generateTable: function (componentObject, metaColumns) {
                var that = this,
                    tableid = this.tableId,
                    pageSize = 20,
                    dataField = 'rows',
                    totalRowsField = 'total',
                    columns = that.getTableColumns(metaColumns);

                if (columns.length == 0) {
                    tipBox.showMessage("请选择字段!", 'info');
                    return;
                }

                var queryColumns = new Array();
                $.each(columns,
                    function (index, value) {
                        if (value.field == "state_form_disabled") {
                            return true;
                        }

                        var isFieldExist = false;
                        for (var i = 0; i < queryColumns.length; i++) {
                            if (queryColumns[i].cname === value.field) {
                                isFieldExist = true;
                                break;
                            }
                        }

                        if (!isFieldExist) {
                            queryColumns.push({
                                cname: value.field
                            });
                        }
                    });

                var param = {
                    method: 'get',
                    contentType: null,
                    cache: false,
                    pagination: true,
                    pageSize: pageSize,
                    pageList: [10, 20, 50, 100, 200],
                    height: 500,                    
                    search: false,
                    showColumns: false,
                    selectItemName: 'btSelectItem' + tableid,
                    showRefresh: false,
                    sidePagination: 'server',
                    sortable: true,
                    clickToSelect: false,
                    advancedSearch: false,
                    searchcondition: [],
                    idTable: tableid,
                    defaultcondition: [],
                    responseHandler: "tableResponseHandler",
                    pk: [],
                    editable: true,
                    columns: columns
                };

                /**
                 * 生成表格内容
                 */
                $(componentObject).find("#" + that.tableId).bootstrapTable(param);

                /**
                 * 生成表格参数
                 */
                $(componentObject).attr("rowdata", encodeURIComponent(JSON.stringify(this.tableRows))).attr("parameter", encodeURIComponent(JSON.stringify(param))).attr("querycolumns", encodeURIComponent(JSON.stringify({
                    columns: queryColumns
                })));
            },
            /**
             * 获取表格列
             * @param metaColumns
             * @returns {Array}
             */
            getTableColumns: function (metaColumns) {
                var result = [],
                    that = this;

                if (!metaColumns || !$.isArray(metaColumns)) {
                    return result;
                }

                this.tableRows = [],
                    $.each(metaColumns,
                        function (index, column) {
                            result.push({
                                title: column.item_name,
                                field: column.item_id,
                                editable: false,
                                validate: '',
                                align: 'left',
                                halign: 'left',
                                valign: "middle",
                                primarykey: false,
                                visible: true,
                                formatter: '',
                                tableId: that.tableId,
                                "defaultcondition": {
                                    "checked": false,
                                    "condition": "",
                                    "value": ""
                                },
                                "searchcondition": {
                                    "checked": false,
                                    "condition": "",
                                    "value": ""
                                }
                            });

                            that.tableRows.push({
                                "$id": index,
                                "title": column.item_name,
                                "field": column.item_id,
                                "order": "asc",
                                "hide": false,
                                "primarykey": false,
                                "editable": false,
                                "validate": "",
                                "formatter": "",
                                "defaultcondition": {
                                    "checked": false,
                                    "condition": "",
                                    "value": ""
                                },
                                "searchcondition": {
                                    "checked": false,
                                    "condition": "",
                                    "value": ""
                                },
                                "state": true
                            })
                        })

                return result;
            }
    }

    $.bfd = $.bfd || {};
    $.bfd.tableListAPI = new TableListAPI();

})(jQuery, window);