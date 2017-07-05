/*
 描述：除布局组件、表格、按钮外增加属性“可编辑性”
 新增【可编辑/不可编辑 (默认可编辑)】
 修改【可编辑/不可编辑 (默认可编辑)】
 查看【可编辑/不可编辑 (默认不可编辑)】
 */
function ComponentEditableProperty(componentObject) {
    this.addID = "editable_add_" + getCurrentTime();
    this.viewID = "editable_view_" + getCurrentTime();
    this.modifyID = "editable_modify_" + getCurrentTime();
    this.id = this.addID + "," + this.viewID + "," + this.modifyID;
    /*
     描述：组件默认可编辑特性
     参数：无
     返回值:json对象
     */
    this.getDefaultEditable = function () {
        var editable = {};
        //添加
        editable.add = "checked";
        //查看
        editable.view = "";
        //修改
        editable.modify = "checked";
        //添加默认值
        $(componentObject).attr("editable", encodeURIComponent(JSON.stringify(editable)));

        return editable;
    }
    /*
     描述：返回属性配置面板html
     参数：无
     返回值：无		
     */
    this.getHtml = function () {
        var editable = this.getProperty();

        var html = [];
        html.push("<table class=\"table table-bordered\" style=\"margin:0px\">");
        html.push("<tr><td><div class=\"mt2 fl\"> 新增</div><input id=\"" + this.addID + "\" name=\"" + this.addID + "\" type=\"checkbox\" " + editable.add + "/></td>");
        html.push("<td><div class=\"mt2 fl\">查看</div><input id=\"" + this.viewID + "\" name=\"" + this.viewID + "\" type=\"checkbox\" " + editable.view + "/></td>");
        html.push("<td><div class=\"mt2 fl\">修改</div><input id=\"" + this.modifyID + "\" name=\"" + this.modifyID + "\" type=\"checkbox\" " + editable.modify + "/></td></tr>");
        html.push("</table>");
        return html.join(" ");
    }
    /*
     描述：保存URI属性到布局组上		
     参数：无
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var editable = this.getProperty();
            var value = document.getElementById(currentPropertyID).checked;
            if (value) {
                value = "checked";
            }
            else {
                value = "";
            }

            if (currentPropertyID == this.addID) {
                editable.add = value;
            }
            else if (currentPropertyID == this.viewID) {
                editable.view = value;
            }
            else if (currentPropertyID == this.modifyID) {
                editable.modify = value;
            }

            $(componentObject).attr("editable", encodeURIComponent(JSON.stringify(editable)));
        }
    }
    /*
     描述：获取可编辑属性,
     参数：无
     返回值：如果组件已经设置可编辑属性则返回已设置的属性json对象，否则返回默认值。		
     */
    this.getProperty = function () {
        var ret = {};
        var editableProperty = $(componentObject).attr("editable");
        if (editableProperty != undefined) {
            ret = $.parseJSON(decodeURIComponent(editableProperty));
        }
        else {
            ret = this.getDefaultEditable();
        }

        return ret;
    }

}

/*
 描述：除布局组件、标签、按钮、表格外需要增加事件支持，
 事件类型由下拉框选择，下拉框下面增加输入框，输入事件处理内容。
 */
function ComponentEventProperty(componentObject) {
    //事件选择容器ID
    this.eventBoxID = "component_event_box_" + getCurrentTime();
    //事件函数内容ID
    this.eventFunctionID = "component_event_function_" + getCurrentTime();
    //组件属性ID
    this.id = this.eventBoxID + "," + this.eventFunctionID;

    /*
     描述：返回属性配置面板html
     参数：无
     返回值：无		
     */
    this.getHtml = function () {
        var html = [];
        var events = encodeURIComponent(this.getProperty());
        html.push("<select id=\"" + this.eventBoxID + "\" class=\"form-textbox form-textbox-text col-md-12\" events=" + events + "/>");
        html.push("<textarea id=\"" + this.eventFunctionID + "\" class=\"form-textbox form-textbox-text col-md-12\" rows=\"4\" style=\"height:70px;overflow:auto;\">function example(){\r\t/*do something*/\r\t}</textarea>");
        html.push("<script> var eventDataBind=new ComponentEventDataBind(\"" + this.eventBoxID + "\",\"" + this.eventFunctionID + "\");");
        html.push("eventDataBind.eventBoxDataBind();");
        html.push("$(\"#" + this.eventBoxID + "\").change(function(){eventDataBind.eventBoxDataChange()});");
        html.push("</script>");

        return html.join(" ");
    }
    /*
     描述：保存URI属性到布局组上		
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var events = this.getProperty();
            var currentEventName = $("#" + this.eventBoxID).val();
            var currentEventFunction = $("#" + this.eventFunctionID).val();
            var jsonEvents = [];
            var isNewEvent = true;

            if (events != undefined && events != "") {
                jsonEvents = $.parseJSON(events);
                $.each(jsonEvents, function (index, element) {
                    if (element.eventName == currentEventName) {
                        element.eventFunction = currentEventFunction;
                        isNewEvent = false;
                    }
                });
            }

            if (isNewEvent) {
                var eventObject = {};
                eventObject.eventName = currentEventName;
                eventObject.eventFunction = currentEventFunction;
                jsonEvents.push(eventObject);
            }

            $(componentObject).attr("events", encodeURIComponent(JSON.stringify(jsonEvents)));
            $("#" + this.eventBoxID).attr("events", encodeURIComponent(JSON.stringify(jsonEvents)));
        }
    }
    /*
     描述：获取组件events属性
     参数：无
     返回值：json	
     */
    this.getProperty = function () {
        var events = $(componentObject).attr("events");
        if (events == undefined) {
            events = "";
        }
        return decodeURIComponent(events);
    }

}
/*
 描述：事件属性配置框数据绑定
 作者：xjl
 */
function ComponentEventDataBind(eventBoxID, eventFunctionID) {
    //事件选择容器对象
    this.eventBox = $("#" + eventBoxID);
    //事件函数对象
    this.eventFunction = $("#" + eventFunctionID);

    /*
     描述：事件下拉框数据绑定
     参数：无
     返回值：无	
     */
    this.eventBoxDataBind = function () {
        this.eventBox.append("<option value=\"\"><--请选择--></option>");
        this.eventBox.append("<option value=\"click\">click</option>");
        this.eventBox.append("<option value=\"change\">change</option>");
        this.eventBox.append("<option value=\"focus\">focus</option>");
        this.eventBox.append("<option value=\"keyup\">keyup</option>");
        this.eventBox.append("<option value=\"keydown\">keydown</option>");
        this.eventBox.append("<option value=\"load\">load</option>");
        this.eventBox.append("<option value=\"mousedown\">mousedown</option>");
    }
    this.eventBoxBindDefaultValue = function (events) {
        this.eventBox.attr("events", events);
    }
    /*
     描述：事件下拉框数据变化事件
     参数：无
     返回值：无
     */
    this.eventBoxDataChange = function () {
        this.eventBox.change(this.eventFunctionDataBind());
    }
    /*
     描述：事件函数绑定
     参数：无
     返回值：无
     */
    this.eventFunctionDataBind = function () {
        var eventName = this.eventBox.val();
        if (eventName == "") {
            var example = "function example(){\r\t/*do something*/\r\t}";
            this.eventFunction.val(example);
        }
        else {
            this.eventFunction.val(this.getPropertyByEventName(eventName));
        }
    }
    /*
     描述：获取事件内容
     参数：无
     返回值：事件函数体
     */
    this.getPropertyByEventName = function (eventName) {
        var events = this.eventBox.attr("events");
        var eventFunction = "";

        if (events != undefined && events != "") {
            var jsonEvents = $.parseJSON(decodeURIComponent(events));
            $.each(jsonEvents, function (index, element) {
                if (element.eventName == eventName) {
                    eventFunction = element.eventFunction;
                    return false;
                }
            });
        }

        return eventFunction;
    }
}
/*
 描述：动态下拉框、单选框增加通过脚本对象加载的方式（该对象必须是name、value类型的数组），
 增加属性输入js对象
 作者：xjl
 */
function ComponentDataSettingProperty(componentObject) {
    this.id = "component_datasetting_" + getCurrentTime();
    this.getHtml = function () {
        return "<textarea id=\"" + this.id + "\" class=\"form-textbox form-textbox-text col-md-12\" rows=\"4\" style=\"height:70px\">" + this.getProperty() + "</textarea>";
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "focusout") {
            var dataScript = $("#" + this.id).val();
            var jsonDataScript = {};
            jsonDataScript.script = dataScript;
            if (jsonDataScript.script == undefined || jsonDataScript.script.trim().length == 0) {
                $(componentObject).removeAttr("datasetting");
                return;
            }
            $(componentObject).attr("datasetting", encodeURIComponent(JSON.stringify(jsonDataScript)));
        }
    }
    this.getProperty = function () {
        var data = $(componentObject).attr("datasetting");
        if (data != undefined) {
            return ($.parseJSON(decodeURIComponent(data))).script;
        }
        else {
            return "";
        }
    }
}

function TableToolBarSettingProperty(componentObject) {

    this.addId = "toolbar_add_" + getCurrentTime();
    this.modifyId = "toolbar_modify_" + getCurrentTime();
    this.delId = "toolbar_del_" + getCurrentTime();
    this.refreshId = "toolbar_refresh_" + getCurrentTime();
    this.id = this.addId + "," + this.modifyId + "," + this.delId + "," + this.refreshId;
    /*
     描述：组件默认可编辑特性
     参数：无
     返回值:json对象
     */
    this.getDefaultEditable = function () {
        var editable = {};
        //添加
        editable.add = "";
        //修改
        editable.modify = "";
        //删除
        editable.del = "";
        //删除
        editable.refresh = "";
        //添加默认值
        $(componentObject).attr("tabletoolbar", encodeURIComponent(JSON.stringify(editable)));

        return editable;
    }
    /*
     描述：返回属性配置面板html
     参数：无
     返回值：无		
     */
    this.getHtml = function () {
        var editable = this.getProperty();

        var html = [];
        html.push('<table class="table table-bordered" style="margin:0px">');
        html.push('<tr><td><label class="label_font_normal"><input id="' + this.addId + '" name="tabletoolbar" type="checkbox" value="add" ' + editable.add + ' /> 新建</label></td>');
        html.push('<td><label class="label_font_normal"><input id="' + this.modifyId + '" name="tabletoolbar" type="checkbox" value="modify" ' + editable.modify + ' /> 修改 </label></td>');
        html.push('<td><label class="label_font_normal"><input id="' + this.delId + '" name="tabletoolbar" type="checkbox" value="del" ' + editable.del + ' /> 删除 </label></td></tr>');
        html.push('<tr><td><label class="label_font_normal"><input id="' + this.refreshId + '" name="tabletoolbar" type="checkbox" value="refresh" ' + editable.refresh + ' /> 刷新 </label></td><td></td><td></td></tr>');
        html.push("</table>");
        return html.join(" ");
    }
    /*
     描述：保存属性到布局组上		
     参数：无
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var editable = this.getProperty();
            var value = document.getElementById(currentPropertyID).checked;
            var isModal = function (editable, attr) {
                var tablemodel_val = $("#tablemodel").find("option:selected").val();
                var isChecked = $("#" + currentPropertyID).is(":checked");
                var columns = $("#" + componentObject.attr("compid")).bootstrapTable("getOptions")["columns"] || [];

                var isKey = false;

                $.each(columns, function (index, item) {
                    if (item["primarykey"]) {
                        isKey = true;
                        return;
                    }
                })


                if (tablemodel_val === "none" || !isKey) {
                    $("#" + currentPropertyID).attr("checked", false);
                    bootbox.alert("请选择表格模式或者设置主键!");
                    return;
                }
                editable[attr] = value;
            }
            if (value) {
                value = "checked";
            }
            else {
                value = "";
            }

            if (currentPropertyID == this.addId) {
                editable.add = value;
            }
            else if (currentPropertyID == this.delId) {
                //isModal(editable,"del");
                editable.del = value;
            }
            else if (currentPropertyID == this.modifyId) {
                //isModal(editable,"modify");
                editable.modify = value;
            } else if (currentPropertyID == this.refreshId) {
                editable.refresh = value;
            }

            $(componentObject).attr("tabletoolbar", encodeURIComponent(JSON.stringify(editable)));
            var tableId = $(componentObject).attr("compid"),
                param = $(componentObject).attr("parameter");

            if (param) {
                var toolbar = this.getToolBar(tableId),
                    $table = $('<table id="' + tableId + '" ></table>');
                if (!$.isEmptyObject(toolbar)) {
                    $(componentObject).empty().append(toolbar.join(""));
                    $(componentObject).append($table);
                    param = JSON.parse(decodeURIComponent(param));
                    param.toolbar = "#" + tableId + "toolbar";
                    $table.bootstrapTable(param);
                }

                $(componentObject).attr("toobarhtml", encodeURI(toolbar.join("")));

            }


        }
    }
    /**
     描述：获取可编辑属性,
     参数：无
     返回值：如果组件已经设置可编辑属性则返回已设置的属性json对象，否则返回默认值。
     */
    this.getProperty = function () {
        var ret = {};
        var editableProperty = $(componentObject).attr("tabletoolbar");
        if (editableProperty != undefined) {
            ret = $.parseJSON(decodeURIComponent(editableProperty));
        }
        else {
            ret = this.getDefaultEditable();
        }

        return ret;
    }
    this.getToolBar = function (tableid) {
        var
            tabletoolbar = $(componentObject).attr("tabletoolbar"),
            customToolBar = $(componentObject).attr("options");
        if (customToolBar) {
            customToolBar = JSON.parse(decodeURIComponent(customToolBar));
        } else {
            customToolBar = new Object();
        }

        if (tabletoolbar) {
            tabletoolbar = JSON.parse(decodeURIComponent(tabletoolbar));
        }
        var toolbars = new Array();

        if (tabletoolbar.add == "checked") {
            toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'新建\', \'' + $("#formuri").val() + '\')" id="' + tableid + 'AddBtn"> 新建</button>');
        }
        if (tabletoolbar.modify == "checked") {
            toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'修改\', \'' + $("#formuri").val() + '\')" id="' + tableid + 'ModifyBtn"> 修改</button>');
        }
        if (tabletoolbar.del == "checked") {
            toolbars.push('<button type="button" class="btn btn-primary" onclick="deleteServerTableRows(\'' + tableid + '\')" id="' + tableid + 'DeleteBtn"> 删除</button>');
        }
        if (tabletoolbar.refresh == "checked") {
            toolbars.push('<button type="button" class="btn btn-primary" onclick="refreshTable(\'' + tableid + '\')" id="' + tableid + 'RefreshBtn"> 刷新</button>');
        }


        if (!$.isEmptyObject(customToolBar)) {
            $.each(customToolBar, function (indec, item) {
                toolbars.push('<button type="button" class="btn btn-primary" onclick="' + item["clickfunction"].replace(/\"/g, "'") + '" id="btn' + getCurrentTime() + '"> ');
                toolbars.push(' <span class="' + item["icon"] + '" aria-hidden="true"></span>' + item["title"] + '</button>');
            })
        }
        if (toolbars.length > 0) {

            toolbars.push('<div class="modal fade" tabindex="-1" role="dialog" id="' + tableid + 'modal" aria-labelledby="myLargeModalLabel">');
            toolbars.push('<div class="modal-dialog modal-lg">');
            toolbars.push('<div class="modal-content">');
            toolbars.push('<div class="modal-header">');
            toolbars.push('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            toolbars.push('<h4 class="modal-title" id="gridSystemModalLabel"></h4>');
            toolbars.push('</div>');
            toolbars.push('<div class="modal-body">');
            toolbars.push('</div>');
            toolbars.push('<div class="modal-footer">');
            toolbars.push('</div>');
            toolbars.push('</div>');
            toolbars.push('</div>');
            toolbars.push('</div>');


        }

        if (!$.isEmptyObject(customToolBar) || toolbars.length > 0) {
            toolbars.unshift('<div id="' + tableid + 'toolbar" class="btn-group">');
            toolbars.push('</div>');
        }


        return toolbars;
    }
}
/**
 *    对话框是否添加modal-footer
 *    @author freedom
 *    @param componentObject 当前编辑组件
 *
 */
function ModalDialogFooterProperty(componentObject) {

    this.footerId = "footer_" + getCurrentTime();
    this.btnId = "footer_btn_" + getCurrentTime();
    this.btnEventId = "btn_event_" + getCurrentTime();
    this.id = this.footerId + "," + this.btnId + "," + this.btnEventId;

    this.getDefualtFooter = function () {
        var footer = {};
        footer.addfooter = false;
        footer.addbtn = false;
        footer.btnevent = undefined;

        $(componentObject).attr("footer", encodeURIComponent(JSON.stringify(footer)));

        return footer;
    }

    /*
     描述：返回属性配置面板html
     参数：无
     返回值：无		
     */
    this.getHtml = function () {
        var footer = this.getProperty();
        var html = [];
        html.push('<table class="table table-bordered" style="margin:0px">');
        html.push('<tr>');
        html.push('<td><label class="label_font_normal"><input id="' + this.footerId + '" name="modalfooter" type="checkbox" value="true"' + (footer.addfooter ? 'checked' : '') + ' /> 添加页脚</label></td>');
        html.push('<td><label class="label_font_normal"><input id="' + this.btnId + '" name="modalbtn" type="checkbox" value="true" ' + (footer.addfooter ? (footer.addbtn ? 'checked' : '') : 'disabled') + '/> 添加确认按钮 </label></td>');
        html.push('</tr>');
        html.push('<tr>');
        html.push('<td colspan="2" class="' + (footer.addbtn ? '' : 'hide') + '"><textarea id="' + this.btnEventId + '" name="btnevent" class="form-textbox col-md-12" rows="5">' + (typeof footer.btnevent === 'undefined' ? '按钮事件' : footer.btnevent) + '</textarea></td>');
        html.push('</tr>');
        html.push("</table>");
        return html.join(" ");
    }

    this.getProperty = function () {
        var ret = {};
        var footerProperty = $(componentObject).attr("footer");
        if (typeof footerProperty === "undefined") {
            ret = this.getDefualtFooter();
        }
        else {
            ret = $.parseJSON(decodeURIComponent(footerProperty));
        }

        return ret;
    }

    /*
     描述：保存属性到布局组上		
     参数：无
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        var footer = this.getProperty();
        var getModalFooterHtml = function (property) {
            var html = [];
            if (property.addfooter) {
                html.push('<div class="modal-footer">');
                if (property.addbtn) {
                    html.push('		<button type="button" class="btn btn-primary modalbtn" id="btn' + getCurrentTime() + '">确定</button>');
                }

                html.push('		<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>');
                html.push('</div>');
            }
            else {
                html.push('<div class="modal-footer">');
                html.push('</div>');
            }

            return html.join("");
        }

        if (currentPropertyID === this.footerId) {
            this.setFooterProperty(event, footer);
        } else if (currentPropertyID === this.btnId) {
            this.setBtnProperty(event, footer);
        } else if (currentPropertyID === this.btnEventId) {
            this.setBtnEventProperty(event, footer);
        }

        $(componentObject).attr("footer", encodeURIComponent(JSON.stringify(footer)));
        $(componentObject).find(".modal-footer").remove();
        $(componentObject).find(".modal-content").append(getModalFooterHtml(footer));

    }

    this.setFooterProperty = function (event, footer) {
        if (event.type === "change") {
            var $this = $(event.target);
            if ($this.is(':checked')) {
                $("#" + this.btnId).attr("disabled", false);
                if ($("#" + this.btnId).is(':checked')) {
                    $("#" + this.btnEventId).parent().removeClass("hide");
                }
                footer.addfooter = true;
            } else {
                $("#" + this.btnId).attr("disabled", true).attr("checked", false);
                $("#" + this.btnEventId).parent().addClass("hide");
                $("#" + this.btnEventId).text('按钮事件');
                footer.addfooter = false;
                footer.addbtn = false;
                footer.btnevent = undefined;

            }
        }
    }

    this.setBtnProperty = function (event, footer) {
        if (event.type === "change") {
            var $this = $(event.target);
            if ($this.is(':checked')) {
                $("#" + this.btnEventId).parent().removeClass("hide");
                footer.addbtn = true;
            } else {
                $("#" + this.btnEventId).parent().addClass("hide");
                $("#" + this.btnEventId).text('按钮事件');
                footer.addbtn = false;
                footer.btnevent = undefined;
            }
        }
    }

    this.setBtnEventProperty = function (event, footer) {
        if (event.type === "input") {
            var $this = $(event.target);
            footer.btnevent = $this.val();
        }
    }

}

/*
 用户自定义样式
 */
function ComponentStyleProperty(componentObject) {
    this.id = "component_style_" + getCurrentTime();
    this.getHtml = function () {
        return "<textarea id=\"" + this.id + "\" class=\"form-textbox form-textbox-text col-md-12\" rows=\"4\" style=\"height:70px\">" + this.getProperty() + "</textarea>";
    }
    this.validate = function (style) {
        var reg = new RegExp("([A-Za-z0-9-]+\\:[A-Za-z0-9- ]+\\;?\\n?)+", "g");
        var result = $.trim(style).replace(reg, "");
        if (result == "") {
            return true;
        } else {
            bootbox.alert("样式定义格式错误！");
        }

        return false;
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "focusout") {
            var style = $("#" + this.id).val();
            if (this.validate(style)) {
                $(componentObject).attr("customstyle", encodeURIComponent(style));
                var compid = $(componentObject).attr("compid");

                if ($("#" + compid).length > 0) {
                    $("#" + compid).attr("style", style);
                }
                //如果是布局组件，直接在布局组件上加style
                else if ($(componentObject).attr("type") == "layout") {
                    $(componentObject).attr("style", style);
                }
            }
        }
    }
    this.getProperty = function () {
        var data = decodeURIComponent($(componentObject).attr("customstyle"));
        if (data != "undefined") {
            return data;
        }
        else {
            return "";
        }
    }
}
/*
 按钮图标
 */
function ComponentButtonIconProperty(componentObject) {
    this.id = "component_buttonIcon_" + getCurrentTime();
    this.getHtml = function () {
        var html = [];
        html.push('<table>');
        html.push("<tr><td><input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.id + "\" placeholder=\"图标样式\" value=\"" + this.getProperty() + "\" /></td>");
        html.push("<td><a class=\"btn btn-default btn-sm\" id=\"button-icon-preview\"  role=\"button\" href=\"#\" data-toggle=\"modal\" data-target=\"#iconModal\"><span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>选择图标</a></td></tr>");
        html.push("</table>");
        html.push("<script>$(\"#button-icon-preview\").click(function(){showModalDialog(\"iconModal\",\"图标选择\",\"html/icon.html?id=" + this.id + "\");});</script>");
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "focusout") {
            var icon = $("#" + this.id).val();
            $(componentObject).attr("buttonicon", encodeURIComponent(icon));
            var compid = $(componentObject).attr("compid"),
                comType = $(componentObject).attr("type");
            var isButton = comType == "button" || comType == "toolbar-button"
            if (isButton) {
                $("#" + compid).find(".glyphicon").remove();
                var text = $("#" + compid).html();
                $("#" + compid).html("<span class=\"" + icon + "\" aria-hidden=\"true\"></span>" + text);
            } else if (comType == "bfd_icon") {
                $(componentObject).find("a").attr("class", "").addClass("icon " + icon);
            } else if(comType == "advanced_select") {
                $(componentObject).find(".advanced_select_button").attr("class", "").addClass(icon +" advanced_select_button");
            } else if(comType === 'dashboard-card') {
                $(componentObject).find('.dashboard-card .visual em').removeAttr('class').addClass(icon);
            }
            else {
                $("#" + compid).find(".icon").attr("class", "").addClass("icon " + icon);
            }
        }
    }
    this.getProperty = function () {
        var icon = decodeURIComponent($(componentObject).attr("buttonicon"));
        if (icon != "undefined") {
            return icon;
        }
        else {
            return "";
        }
    }

}
/*
 颜色选择器
 */
function ComponentColorPickProperty(componentObject) {
    this.id = "component_picklinecolor_" + getCurrentTime();
    this.getHtml = function () {
        var html = [];
        html.push("<input type=\"text\" class=\"pick-a-color form-control\" id=\"" + this.id + "\" placeholder=\"颜色\" value=\"" + this.getProperty() + "\" />");
        html.push("<script>pickColorInit();</script>");
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        var type = $(componentObject).attr("type");
        if(type === "separator"){
            if (event.type == "input") {
                var color = $("#" + this.id).val();
                $(componentObject).attr("picklinecolor", color);
                $(componentObject).find("ul").css("border-color", "#" + color);
            }
        }
        if(type === "label"){
            var compid = $(componentObject).attr("compid");
            if (event.type == "input") {
                var color = $("#" + this.id).val();
                $(componentObject).attr("labelfontcolor", color);
                $("#" + compid).css("color", "#" + color);
            }
        }
    }
    this.getProperty = function () {
        var type = $(componentObject).attr("type");
        if(type === "separator"){
            var color = $(componentObject).attr("picklinecolor");
        }
        if(type === "label"){
            var color = $(componentObject).attr("labelfontcolor");
        }
        if (color == undefined) {
            color = "";
        }
        return color;
    }
}
function pickColorInit() {
    $(".pick-a-color").pickAColor({
        showSpectrum: true,
        showSavedColors: true,
        saveColorsPerElement: true,
        fadeMenuToggle: true,
        showAdvanced: true,
        showBasicColors: true,
        showHexInput: true,
        allowBlank: true,
        inlineDropdown: true
    });
}
/**
 树组件，加载数据源。
 */
function ComponentTreeDataURLProperty(componentObject) {
    this.id = "component_treeNodeHost_" + getCurrentTime();
    this.getHtml = function () {
        var html = [];
//		html.push('<table>');
        html.push("<input type=\"text\" class=\"form-textbox form-textbox-text col-md-7\" style='margin-right:5px;' id=\"" + this.id + "\" placeholder=\"URI\" value=\"" + this.getProperty() + "\" />");
        html.push("<a class=\"btn btn-info btn-sm col-md-4\" id=\"button-icon-preview\" style='float: right;'  role=\"button\" href=\"#\"><span class=\"glyphicon glyphicon-download-alt\" aria-hidden=\"true\"></span>加载数据</a>");
//		html.push("</table>");
        html.push("<script>$(\"#button-icon-preview\").click(function(){var myTree=new zTree();	myTree.initTree(\"" + $(componentObject).attr("compid") + "\");});</script>");
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "input") {
            var host = $("#" + this.id).val();
            $(componentObject).attr("treeDataUrl", encodeURIComponent(host));
            var compid = $(componentObject).attr("compid");
            $("#" + compid).attr("treeDataUrl", encodeURIComponent(host));
        }
    }
    this.getProperty = function () {
        var host = decodeURIComponent($(componentObject).attr("treeDataUrl"));
        if (host != "undefined") {
            return host;
        }
        else {
            return "";
        }
    }

}

function ComponentI18nPath(componentObject){
    this.idTextArea = "component_TextArea_I18nPath_"+getCurrentTime();
    this.id = this.idTextArea;
    this.getHtml = function(){
        var html = [];
        html.push("<textarea id=\"" + this.idTextArea+ "\" class=\"form-textbox col-md-12\" rows=\"6\">" + this.getProperty() + "</textarea>");
        return html.join(" ");
    }
    this.setProperty = function(event,currentPropertyID){
        var compid = $(componentObject).attr("compid");
        if(event.type == "input"){
            var value = $("#"+this.idTextArea).val();
            $(componentObject).attr("i18npath",value);
        }
        if(event.type == "focusout"){
           var temppathArr = $("#" + this.idTextArea).val().split("\n");
            $.each(temppathArr,function(index,item){
                var temppath = item.replace(/\s+/g,"");
                if(temppath.indexOf("zh") === -1){
                    i18npath = temppath.substring(0,temppath.lastIndexOf("/")+1);
                    i18nFileName = temppath.substring(temppath.lastIndexOf("/")+1,temppath.indexOf("."));
                }
            });
        }
    }
    this.getProperty = function () {
        var value = $(componentObject).attr("i18npath");

        if (value != undefined) {
            return value;
        }
        else {
            return "";
        }
    }
}

function ComponentTextProperty(componentObject) {
    this.idText = "component_TextView_" + getCurrentTime();
   /// this.idI18N = "component_I18N_" + getCurrentTime();
    this.id = this.idText ;
        //+ "," + this.idI18N;
    this.getHtml = function () {
        var html = [];
        html.push("<input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.idText + "\" value=\"" + this.getProperty() + "\" />");
        //html.push("</td><td>");
        //html.push("<input type=\"checkbox\" id=\"" + this.idI18N + "\" style='cursor:pointer;'" + this.getIsI18nProperty() + "/>国际化")

        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        var type = $(componentObject).attr("type");
        var compid = $(componentObject).attr("compid");
        if (type === "label" || type === "button" || type === "toolbar-button") {
            if (event.type == "focusout") {
                var value = $("#" + this.idText).val();
                $("#" + compid).html(value);
                $(componentObject).attr("defaultvalue", encodeURIComponent(value));
                var i18nDataKey = getI18nKey();
                $("#" + compid).attr("i18nkey", value);
                $("#" + this.idText).autocomplete({
                    minLength: 0,
                    source: i18nDataKey,
                });
                $("#" + this.idText).on("autocompleteselect",function(eventType,ui){
                    $("#" + compid).attr("i18nkey", ui.item.value);
                    $("#" + compid).html(ui.item.value);
                    $(componentObject).attr("defaultvalue", encodeURIComponent(ui.item.value));
                });
                initI18NProperties(i18nFileName, i18npath, i18nLanguage);
            }
        }
        if(type === "separator"){
            if(event.type == "focusout"){
                var value = $("#" + this.idText).val();
                componentObject.find(".title").html(value);
                $(componentObject).attr("separatortitle",encodeURIComponent(value));
                var i18nDataKey = getI18nKey();
                componentObject.find(".title").attr("i18nkey", value);
                $("#" + this.idText).autocomplete({
                    minLength: 0,
                    source: i18nDataKey,
                });
                $("#" + this.idText).on("autocompleteselect",function(eventType,ui){
                    componentObject.find(".title").attr("i18nkey", ui.item.value);
                    componentObject.find(".title").html(ui.item.value);
                    $(componentObject).attr("separatortitle",encodeURIComponent(ui.item.value));
                });
                initI18NProperties(i18nFileName, i18npath, i18nLanguage);
            }
        }
        if(type === "input_text" || type === "textarea"){
            if (event.type == "focusout") {
                var value = $("#" + this.idText).val();
                $("#" + compid).val(value);
                $(componentObject).attr("defaultvalue", encodeURIComponent(value));
                var i18nDataKey = getI18nKey();
                $("#" + compid).attr("i18nkey", value);
                $("#" + this.idText).autocomplete({
                    minLength: 0,
                    source: i18nDataKey,
                });
                $("#" + this.idText).on("autocompleteselect",function(eventType,ui){
                    $("#" + compid).attr("i18nkey", ui.item.value);
                    $("#" + compid).val(ui.item.value);
                    $(componentObject).attr("defaultvalue", encodeURIComponent(ui.item.value));

                });
                initI18NProperties(i18nFileName, i18npath, i18nLanguage);
            }
        }
    }
    this.getProperty = function () {
        var type = $(componentObject).attr("type");
        var value;
        if(type === "separator") {
            value = decodeURIComponent($(componentObject).attr("separatortitle"));
        }
        if(type === "input_text" || type === "textarea" || type === "label" || type === "button" || type === 'toolbar-button'){
            value = decodeURIComponent($(componentObject).attr("defaultvalue"));
        }
        if (value != "undefined") {
            return value;
        }
        else {
            return "";
        }
    }
   // this.getIsI18nProperty = function () {
     //   var isI18n = $(componentObject).attr("isI18n");
      //  if (isI18n == undefined || isI18n === "false") {
       //     $(componentObject).attr("isI18n", "false");
        //    return ""
        //} else {
         //   return "checked = true"
       // }
   // }
}

function ComponentMenuSelectItemProperty(componentObject,panel) {
    this.idText = "component_text_" + getCurrentTime();
    this.idBtn = 'btn_'+getCurrentTime();
    this.id = this.idText +","+this.idBtn;
    this.componentObject = componentObject;
    this.panel = panel;
        //+ "," + this.idI18N;
    this.getHtml = function () {
        var html = [],
            value = this.componentObject.attr("data-selected-label")?this.componentObject.attr("data-selected-label"):"",
            that = this;
        html.push('<input class="form-textbox form-textbox-text" value="'+value+'" id="'+this.idText+'" /><button type="button" class="btn btn-primary" id="'+this.idBtn+'">菜单项</button>')
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        var that = this,
            type = this.componentObject.attr("type");
        var compid = this.componentObject.attr("compid");

        if(event.type == "change"){
            var $this = $(event.currentTarget);

            this.componentObject.attr("data-item",$this.find("option:selected").data("item"))
            this.componentObject.attr("data-selected-id",$this.find("option:selected").data("id"))
            this.componentObject.attr("data-selected-label",$this.find("option:selected").text())
            this.componentObject.find("li>a").text($this.find("option:selected").text())

        }
        if(event.type == "click"){
            $.ajax({
            url:"js/property/menu-item.json",
            type:"get",
            dataType: 'json',
            async: false,
            cache:true,
            success : function(data){
                if ($.isArray(data.menuItems)){
                   // var root = that.getRoot("null",data.menuItems);
                   //var zNodes =  that.getChildrens(root,data.menuItems);
                    var zNodes = that.getSimpleData(data.menuItems);
                    $("#treeModel").modal({
                        backdrop:false,
                        show:true
                    })
                    var zTreeObj;
                    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
                    var setting = {
                        check: {
                            enable: true,
                            chkStyle: "radio",
                            radioType: "level"
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        },
                        callback : {
                            onCheck : function(ev,id,obj){
                                console.log(arguments);

                                that.componentObject.attr("data-item",encodeURIComponent(JSON.stringify(obj.orignal)))
                                that.componentObject.attr("data-selected-id",obj.id)
                                that.componentObject.attr("data-selected-label",obj.name)
                                that.componentObject.find("li>a").text(obj.name)

                                $("#"+that.idText).val(obj.name);

                                $("#treeModel").modal("hide");
                            }
                        }

                    };
                    // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
                    //var zNodes = [
                    //    {name:"test1", open:true, children:[
                    //        {name:"test1_1"}, {name:"test1_2"}]},
                    //    {name:"test2", open:true, children:[
                    //        {name:"test2_1"}, {name:"test2_2"}]}
                    //];

                    $.fn.zTree.init($("#menuTree"), setting, zNodes);
                }
            }

        })



        }

    }

    this.getSimpleData = function(data){
        var newData = [],
            that = this;
        data.forEach(function(item,index){
            var checked = false;
            if(that.componentObject.attr("data-selected-id") == item.id){
                checked = true;
            }
             newData.push({
                 id : item.id,
                 pId : item.parentID,
                 name : item.label,
                 orignal : item,
                 checked : checked,
                 open : true
             })
        })
        return newData;
    }

    this.getRoot = function(parentID,data){
        var root = {
            id : "",
            name : "",
            open : true,
            children : []
        };
        data.forEach(function(item,index){
            if(item.parentID==parentID){
                root.name = item.label;
                root.id = item.id;
                return false;
            }
        })
        return root;
    }

    this.getChildrens = function(root,data){
        var that = this;



        data.forEach(function(item,index){
                if(item.parentID==root.id){
                    var node = {
                        id : item.id,
                        name : item.label,
                        open : true,
                        children : []
                    }
                    var child = that.getChildrens(node,data);
                    node ? root.children.push(child):"";
                }
            })
        return root;
    }

    this.getProperty = function () {
        console.log("ComponentMenuSelectItemProperty ..getProperty");
    }
}
//function ComponentMenuSelectItemProperty(componentObject) {
//    this.idText = "component_text_" + getCurrentTime();
//    this.id = this.idText ;
//        //+ "," + this.idI18N;
//    this.getHtml = function () {
//        console.log("ComponentMenuSelectItemProperty ..getHtml");
//        var html = [],
//            that = this;
//        html.push('<select class="form-textbox form-combo col-md-12" id="'+this.idText+'">');
//        html.push('<option data-id="null"></option>')
//        $.ajax({
//            url:"js/property/menu-item.json",
//            type:"get",
//            dataType: 'json',
//            async: false,
//            cache:true,
//            success : function(data){
//                if ($.isArray(data.menuItems)){
//                    data.menuItems.forEach(function(item,index){
//                        var parseItem = encodeURIComponent(JSON.stringify(item)),
//                            selected = "";
//                        if(componentObject.data("selected-id")==item.id){
//                            selected = "selected";
//                        }
//                        html.push('<option data-id="'+item.id+'" data-item = "'+parseItem+'" '+selected+'>'+item.label+'</option>')
//                    })
//                }
//            }
//
//        })
//
//        html.push('</select>');
//        return html.join(" ");
//    }
//    this.setProperty = function (event, currentPropertyID) {
//        var type = componentObject.attr("type");
//        var compid = componentObject.attr("compid");
//
//        if(event.type == "change"){
//            var $this = $(event.currentTarget);
//
//                componentObject.attr("data-item",$this.find("option:selected").data("item"))
//                componentObject.attr("data-selected-id",$this.find("option:selected").data("id"))
//                componentObject.attr("data-selected-label",$this.find("option:selected").text())
//                componentObject.find("li>a").text($this.find("option:selected").text())
//
//
//        }
//
//    }
//
//
//    this.getProperty = function () {
//        console.log("ComponentMenuSelectItemProperty ..getProperty");
//    }
//}
function ComponentMenuParentItemProperty(componentObject) {
    this.idText = "component_text_" + getCurrentTime();
    this.id = this.idText ;
        //+ "," + this.idI18N;
    this.getHtml = function () {

        var html = [],
            $lnav = componentObject.parents("div.lnav"),//水平菜单
            $vnav = componentObject.parents("div.vnav"),//垂直菜单
            that = this;
        html.push('<select class="form-textbox form-combo col-md-12" id="'+this.idText+'">');
        html.push('<option  value="null"></option>')
        if($lnav.length==0){
            $lnav = $vnav.prev();
            $lnav.find('div[type="li"]').each(function(index,item){
                var selected = "",
                    parentId = $(item).data("parent-id"),
                    text = $(item).data("selected-label"),
                    value = $(item).data("selected-id");

                if(parentId==value){
                    selected = "selected";
                }
                if(text){
                    html.push('<option '+selected+' value="'+value+'">'+text+'</option>')
                }
            })
        }
        html.push('</select>');
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        var type = componentObject.attr("type");
        var compid = componentObject.attr("compid");

        if(event.type == "change"){
            var $this = $(event.currentTarget);
                //当前点击对象是否是上级菜单
            componentObject.attr("data-parent-id",$this.find("option:selected").data("id"))
        }

    }
}
function ComponentForPlaceholderProperty(componentObject) {
    this.idText = "component_PlaceHolder_" + getCurrentTime();
    //this.idI18N = "component_PHI18N_" + getCurrentTime();
    this.id = this.idText ;
    this.getHtml = function () {
        var html = [];

        html.push("<input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.idText + "\" value=\"" + this.getProperty() + "\" />");
        //html.push("</td><td>");
        //html.push("<input type=\"checkbox\" id=\"" + this.idI18N + "\" style='cursor:pointer;'" + this.getIsI18nProperty() + "/>国际化")

        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        var compid = $(componentObject).attr("compid");
            if (event.type == "focusout") {
                var value = $("#" + this.idText).val();
                $("#" + compid).attr("placeholder",value);
                $(componentObject).attr("placeholder", encodeURIComponent(value));
                var i18nDataKey = getI18nKey();
                $("#" + compid).attr("i18nkeyforph",value);
                $("#" + this.idText).autocomplete({
                    minLength: 0,
                    source: i18nDataKey,

                });
                $("#" + this.idText).on("autocompleteselect",function(eventType,ui){
                    $("#" + compid).attr("i18nkeyforph", ui.item.value);
                    $("#" + compid).attr("placeholder",ui.item.value);
                    $(componentObject).attr("placeholder", encodeURIComponent(ui.item.value));
                });
                initI18NProperties(i18nFileName, i18npath, i18nLanguage);
            }
    }
    this.getProperty = function () {
        var value = decodeURIComponent($(componentObject).attr("placeholder"));

        if (value != "undefined") {
            return value;
        }
        else {
            return "";
        }
    }
}

function ComponentDataURLProperty(componentObject) {
    this.idURL = "component_DataURL_" + getCurrentTime();
    this.idDSType = "component_DSType_" + getCurrentTime();
    this.id = this.idURL + "," + this.idDSType;

    this.getHtml = function () {
        var html = [];
        html.push('<table>');
        html.push("<tr><td>");
        html.push("<textarea id=\"" + this.idURL + "\" class=\"form-textbox form-textbox-text col-md-12\" rows=\"4\" cols =\"100\" style=\"margin-right:5px;word-wrap:break-word;height:60px;\" placeholder=\"URL\">" + this.getProperty() + "</textarea>");
        html.push("</td><td>");
        html.push("<input type=\"checkbox\" id=\"" + this.idDSType + "\" style='cursor:pointer;'" + this.getIsOrmProperty() + "/>自定义URL")
        html.push("</td></tr>")
        html.push("</table>");

        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        var compid = $(componentObject).attr("compid");
        if (event.type == "focusout") {
            var host = $("#" + this.idURL).val();
            $(componentObject).attr(this.getAttributeName(), encodeURIComponent(host));
            $("#" + compid).attr(this.getAttributeName(), encodeURIComponent(host));
        }
        if (event.type == "change") {
            var isormds = "true";
            if (event.target.checked) {
                isormds = "false";
            }
            $("#" + compid).attr("isormds", isormds);
            $(componentObject).attr("isormds", isormds);
        }
    }
    this.getProperty = function () {
        var host = decodeURIComponent($(componentObject).attr(this.getAttributeName()));
        if (host != "undefined") {
            return host;
        }
        else {
            return "";
        }
    }
    this.getIsOrmProperty = function () {
        var isormds = $(componentObject).attr("isormds");
        if (isormds == undefined || isormds == "true") {
            $(componentObject).attr("isormds", "true");
            $("#" + $(componentObject).attr("compid")).attr("isormds", "true");
            return ""
        } else {
            return "checked = true "
        }
    }
    this.getAttributeName = function () {
        var componentType = $(componentObject).attr("type");
        var attrName = "dataurl";
        if (componentType == "tree") {
            attrName = "treedataurl";
        } else if (componentType == "select_dynamic") {
            attrName = "optionvurl";
        } else if (componentType == "input_fileinput") {
            attrName = "fileuploadurl";
        }
        return attrName;
    }
}
/*
 对齐方式
 */
function ComponentAlignProperty(componentObject) {
    this.idLeft = "component_align_left_" + getCurrentTime();
    this.idRight = "component_align_right_" + getCurrentTime();
    this.idCenter = "component_align_center_" + getCurrentTime();
    this.idJustify = "component_align_justify" + getCurrentTime();

    this.idLeftSpan = this.idLeft + "_span";
    this.idRightSpan = this.idRight + "_span";
    this.idCenterSpan = this.idCenter + "_span";

    this.id = this.idLeft + "," + this.idRight + "," + this.idCenter + "," + this.idJustify + ","
        + this.idLeftSpan + "," + this.idRightSpan + "," + this.idCenterSpan;

    this.getHtml = function () {
        var html = [];
        html.push("<div class=\"btn-group\">");
        html.push("<button id=\"" + this.idLeft + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"layout-align-left\"><i  class=\"glyphicon glyphicon-align-left\" aria-hidden=\"true\" id=\"" + this.idLeftSpan + "\"></i></button>");
        html.push("<button id=\"" + this.idCenter + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"layout-align-center\"><i class=\"glyphicon glyphicon-align-center\" aria-hidden=\"true\" id=\"" + this.idCenterSpan + "\"></i></button>");
        html.push("<button id=\"" + this.idRight + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"layout-align-right\"><i  class=\"glyphicon glyphicon-align-right\" aria-hidden=\"true\" id=\"" + this.idRightSpan + "\"></i></button>");
        html.push("</div>");
        html.push("");
        var selectStyle = this.getProperty();
        if (selectStyle != "") {
            var compid = $(componentObject).attr("compid");
            html.push("<script>");
            html.push("$(\"#" + compid + "\").parent().addClass(\"" + selectStyle + "\");");
            html.push("</script>");
        }
        return html.join(" ");
    }

    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "click") {
            currentPropertyID = currentPropertyID.replace("_span", "");
            var selectStyle = $("#" + currentPropertyID).attr("aria-label");
            $(componentObject).attr("alignstyle", encodeURIComponent(selectStyle));
            $(componentObject).removeClass("layout-align-left")
                .removeClass("layout-align-right")
                .removeClass("layout-align-center")
                .addClass(selectStyle);
            if ($(componentObject).attr("type") == "button_group") {
                $(componentObject).parent().removeClass("layout-align-left")
                    .removeClass("layout-align-right")
                    .removeClass("layout-align-center")
                    .addClass(selectStyle);
            }
        }
    }
    this.getProperty = function () {
        var data = decodeURIComponent($(componentObject).attr("alignstyle"));
        if (data != "undefined") {
            return data;
        }
        else {
            return "layout-align-right";
        }
    }
}

/**
 * 块组件对齐
 * */
function ComponentBlockAlignProperty(componentObject) {
    this.idLeft = "component_align_left_" + getCurrentTime();
    this.idRight = "component_align_right_" + getCurrentTime();
    this.idCenter = "component_align_center_" + getCurrentTime();
    this.idJustify = "component_align_justify" + getCurrentTime();

    this.idLeftSpan = this.idLeft + "_span";
    this.idRightSpan = this.idRight + "_span";
    this.idCenterSpan = this.idCenter + "_span";

    this.id = this.idLeft + "," + this.idRight + "," + this.idCenter + "," + this.idJustify + ","
        + this.idLeftSpan + "," + this.idRightSpan + "," + this.idCenterSpan;

    this.getHtml = function () {
        var html = [];
        html.push("<div class=\"btn-group\">");
        html.push("<button id=\"" + this.idLeft + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"layout-block-align-left\"><i class=\"glyphicon glyphicon-align-left\" aria-hidden=\"true\" id=\"" + this.idLeftSpan + "\"></i></button>");
        html.push("<button id=\"" + this.idCenter + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"layout-block-align-center\"><i class=\"glyphicon glyphicon-align-center\" aria-hidden=\"true\" id=\"" + this.idCenterSpan + "\"></i></button>");
        html.push("<button id=\"" + this.idRight + "\" type=\"button\" class=\"btn btn-default\" aria-label=\"layout-block-align-right\"><i class=\"glyphicon glyphicon-align-right\" aria-hidden=\"true\" id=\"" + this.idRightSpan + "\"></i></button>");
        html.push("</div>");

        return html.join(" ");
    }

    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "click") {
            currentPropertyID = currentPropertyID.replace("_span", "");
            var selectStyle = $("#" + currentPropertyID).attr("aria-label");
            $(componentObject).attr("alignstyle", encodeURIComponent(selectStyle));
            $(componentObject).parent().parent().removeClass("layout-block-align-right")
                .removeClass("layout-block-align-center")
                .removeClass("layout-block-align-left")
                .addClass(selectStyle);
        }
    }
    this.getProperty = function () {
        var data = decodeURIComponent($(componentObject).attr("alignstyle"));
        if (data != "undefined") {
            return data;
        }
        else {
            return "layout-block-align-left";
        }
    }
}

function SelectTypeProperty(componentObject) {
    this.idSingle = "select_type_single_" + getCurrentTime();
    this.idMultiple = "select_type_multiple_" + getCurrentTime();
    this.id = this.idSingle + "," + this.idMultiple;

    this.getHtml = function () {
        var selectType = this.getProperty();
        var singleChecked = "";
        var multipleChecked = "";
        if (selectType == "single") {
            singleChecked = "checked";
        } else {
            multipleChecked = "checked";
        }
        var html = [];
        html.push("<input type=\"radio\" id=\"" + this.idSingle + "\" name=\"selectType\"" + singleChecked + " >单选下拉框");
        html.push("<input type=\"radio\" id=\"" + this.idMultiple + "\" name=\"selectType\"" + multipleChecked + ">多选下拉框");
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var selectType = "single";
            var selectObject = $(componentObject).find("select");
            if (currentPropertyID == this.idMultiple) {
                selectType = "multiple";
                $(selectObject).attr("multiple", "multiple");
                $(selectObject).select2();
            } else {
                $(selectObject).removeAttr("multiple");
                $(selectObject).select2("destroy");
            }
            $(selectObject).attr("selecttype", selectType).attr("type", "select_dynamic");
            $(componentObject).attr("selecttype", selectType);
            $(event.target).parents("table").find("#").trigger("focusout");
            $(event.target).parents("table").find("#compdefaultvaluename").trigger("focusout");
            $(event.target).parents("table").find("#field").trigger("change");
        }
    }
    this.getProperty = function () {
        var data = decodeURIComponent($(componentObject).attr("selecttype"));
        if (data != "undefined") {
            return data;
        }
        else {
            return "single";
        }
    }
}

function OldComponentTabCollapseOptions(componentObject) {
    var btnGroup = false;
    this.idTitle = "options_title_" + getCurrentTime();
    this.idIcon = "options_icon_" + getCurrentTime();
    this.idTarget = "options_target_" + getCurrentTime();
    this.idButton = "options_btn_" + getCurrentTime();
    this.idBtnSpan = "options_btn_span_" + getCurrentTime();
    this.idOptions = "options_textarea_" + getCurrentTime();

    this.id = this.idTitle + "," + this.idIcon + "," + this.idTarget + "," + this.idButton + "," + this.idBtnSpan + "," + this.idOptions;

    this.getHtml = function () {
        var titleHtml = '',
            titlePlaceHolder = "标题",
            iconHtml = '',
            iconPlaceHolder = "Glyphicons 字体图标",
            targetIdHtml = '',
            targetIdPlaceHolder = "目标ID";
        if (tagType === "button_group" || tagType == "table_base") {
            btnGroup = true;
            titlePlaceHolder = "按钮名称";
            targetIdPlaceHolder = "函数";
        }
        if (btnGroup) {
            iconHtml = '<div class="col-lg-12"><div class="input-group"><input type="text" id="' + this.idIcon + '" placeholder="' + iconPlaceHolder + '" class="form-textbox form-textbox-text" />' +
                '<span class="input-group-btn"><a class=\"btn btn-info btn-sm\" id=\"button-icon-preview\"  role=\"button\" href=\"#\" data-toggle=\"modal\"><span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>图标</a></span></div></div>';
        }

        titleHtml = '<div class="col-lg-12"><input type="text" id="'+this.idTitle+'" placeholder="'+titlePlaceHolder+'" class="form-textbox form-textbox-text" /></div>';
        targetIdHtml = '<div class="col-lg-12"><div class="input-group"><input type="text" id="' + this.idTarget + '" placeholder="' + targetIdPlaceHolder + '" class="form-textbox form-textbox-text" />' +
            '<span class="input-group-btn"><button id="' + this.idButton + '" type="button" class="btn btn-default btn-sm"><span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span>添加</button></span></div></div>';

        return [
            '<div class="row">',
            titleHtml,
            iconHtml,
            targetIdHtml,
            '</div>',
            '<textarea id="', this.idOptions, '" class="form-textbox form-textbox-text" style="height: 100px;width:200px">', this.getProperty(), '</textarea>' ,
            "<script>$(\"#button-icon-preview\").click(function(){showModalDialog(\"iconModal\",\"图标选择\",\"html/icon.html?id=" + this.idIcon + "\");});</script>"
        ].join("");
    }
    this.setProperty = function (event, currentPropertyID) {
        switch (currentPropertyID) {
            case this.idBtnSpan:
                this.setOptions(event);
                break;
            case this.idButton:
                this.setOptions(event);
                break;
            case this.idTitle:
                this.setOptions(event);
                break;
            case this.idOptions:
                if (event.type = "focusout") {
                    if (tagType === "tab") {
                        this.setTabs(event);
                    } else if (tagType === "collapse") {
                        this.setCollapses(event);
                    } else if (tagType === "button_group") {
                        this.setButtons(event);
                    } else if (tagType === "table_base") {
                        this.setToolbar(event);
                    }
                    var option = $("#" + this.idOptions);
                    if(option[0]) {
                        $(componentObject).attr("options", encodeURIComponent($("#" + this.idOptions).val()));
                    }
                }
                break;
        }
    }

    this.setTabs = function (event) {
        var obj = $(event.target);
        var json = undefined,
            nav_tabs = $(componentObject).find("ul.nav"),
            nav_content = $(componentObject).find("div.tab-content"),
            value = obj.val(),
            existsTargets = [],
            targets = [];
        try {
            if(value !== undefined) {
                if(encodeURIComponent(value) === $(componentObject).attr('options')) {
                    return;
                }
            }
            $.each(nav_tabs.find('li'), function () {
                if(!$(this).hasClass('tab-toolbar')) {
                    $(this).remove();
                }
            });
            json = JSON.parse(value ? value : '[]');
            if (!$.isArray(json)) {
                bootbox.alert("请输入JSON格式数组!");
                return false;
            }

            $.each($(nav_content).children('.lyrow'), function () {
                $.each($(this).children('.view'), function () {
                    existsTargets.push($(this).find('div[compid]:eq(0)').attr('compid'));
                })
            });


            $.each(json, function (index, item) {
                nav_tabs.append('<li ' + (index == 0 ? 'class="active"' : '') + '><a href="#' + item.targetid + '" i18nkey="'+ item.title +'"  data-toggle="tab">' + item.title + '</a></li>')
                if($.inArray(item.targetid, existsTargets) === -1) {
                    initTabComponent(componentObject, item.targetid);
                }
                targets.push(item.targetid);
            });
            $.each(existsTargets, function (index, item) {
                var isExists = false;

                $.each(targets, function(index1, item1) {
                    if(item === item1) {
                        isExists = true;
                        return false;
                    }
                });
                //删除布局器
                if(!isExists) {
                    $("#" + item).parent().parent().remove();
                }
            });

            initI18NProperties(i18nFileName,i18npath,i18nLanguage);
        } catch (error) {
            bootbox.alert(error.message);
        }
        $(componentObject).attr('options', encodeURIComponent(value));
        clickDemoView($(componentObject).parent());
        tabCompVisiable($(componentObject).find('.nav li.active'));
        if (!json) {
            return;
        }
    }

    this.setCollapses = function (event) {
        var obj = $(event.target);
        var json = undefined,
            container = $(componentObject).find("div.panel-group"),
            getPanelHTML = function (index, title, targetid) {
                var html = [];
                html.push('<div class="panel panel-default">');
                html.push('<div class="panel-heading" role="tab">');
                html.push('<h4 class="panel-title">');
                html.push('<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + targetid + '" aria-expanded="true" aria-controls="' + targetid + '">');
                if (index == 0) {
                    html.push('<span class="glyphicon glyphicon-minus" aria-hidden="true">' + title + '</span>');
                } else {
                    html.push('<span class="glyphicon glyphicon-plus" aria-hidden="true">' + title + '</span>');
                }

                html.push('</a>');

                html.push('</h4>');
                html.push('</div>');
                html.push('</div>');
                html.push('</div>');
                return html.join(" ");
            };
        try {
            json = JSON.parse(obj.val() ? obj.val() : '[]');
            if (!$.isArray(json)) {
                bootbox.alert("请输入JSON格式数组!");
                return false;
            }
            container.empty();
            $.each(json, function (index, item) {
                var panel = getPanelHTML(index, item.title, item.targetid);
                container.append(panel);
            })
        } catch (error) {
            bootbox.alert(error.message);
        }
        if (!json) {
            return;
        }
    }
    this.setButtons = function (event) {
        var obj = $(event.target);
        var json = undefined,
            button_group = $(componentObject).empty();
        try {
            json = JSON.parse(obj.val() ? obj.val() : '[]');
            if (!$.isArray(json)) {
                bootbox.alert("请输入JSON格式数组。");
                return false;
            }
            $.each(json, function (index, item) {
                var btnStr = '<button type="button" class="btn btn-primary"';

                btnStr = btnStr + ' i18nkey = "' + item.title +'"';

                if (item.clickfunction) {
                    btnStr = btnStr + ' onclick="' + item.clickfunction.replace(/\"/g, "'") + '"';
                }

                btnStr += '>';
                if (item.icon) {
                    btnStr += "<span class=\"" + item.icon + "\" aria-hidden=\"true\"></span>";
                }
                btnStr += item.title + '</button>';
                button_group.append(btnStr);
                //nav_content.append('<div role="tabpanel" class="tab-pane '+(index == 0 ? 'active':'')+'" id="'+item.targetid+'">'+item.targetid+'</div>');
            })
            initI18NProperties(i18nFileName,i18npath,i18nLanguage);
        } catch (error) {
            bootbox.alert(error.message);
        }
        if (!json) {
            return;
        }
    }
    this.setToolbar = function (event) {

    }

    this.setOptions = function (event) {
        if (event.type == "click") {
            var options = JSON.parse(this.getProperty() ? this.getProperty() : '[]');
            if (btnGroup) {
                options.push({
                    title: $("#" + this.idTitle).val(),
                    icon: $("#" + this.idIcon).val(),
                    clickfunction: $("#" + this.idTarget).val()
                });
            } else {
                options.push({
                    title: $("#" + this.idTitle).val(),
                    targetid: $("#" + this.idTarget).val()
                });
            }

            var options_string = "[\n";
            $.each(options, function (index, item) {
                if (index == options.length - 1) {
                    options_string += JSON.stringify(item) + "\n";
                } else {
                    options_string += JSON.stringify(item) + ",\n";
                }

            })
            options_string += "]";
            $("#" + this.idOptions).val(options_string).text(options_string).trigger("focusout");

        }
        if(event.type === "input"){
            var i18nDataKey = getI18nKey();
            $("#" + this.idTitle).autocomplete({
                minLength: 0,
                source: i18nDataKey
            });
            $("#" + this.idTitle).on("autocompleteselect",function(eventType,ui){
               $("#" + this.idTitle).val(ui.item.value);
            });
        }
    }

    this.getProperty = function () {
        var options = $(componentObject).attr("options");
        if (typeof options != "undefined") {
            return decodeURIComponent(options);
        }
        else {
            return "";
        }
    }
}

/*
function ComponentTabCollapseOptions(componentObject) {
    this.componentObject = componentObject;
    this.options = $.extend(true, [], ComponentTabCollapseOptions.DEFAULTS.options);
    this.id = this.showModalBtnId = "btn_modal_" + getCurrentTime();
}
//options 中 以"_"开头的属性是自定义属性
ComponentTabCollapseOptions.DEFAULTS = {
    optionsParamName: "options",
    toolbarParamName: "toobarhtml",
    tableParamName : "parameter",
    options: [
        {
            clickfunction: "",
            icon: "",
            title: ""
        }
    ]
};


ComponentTabCollapseOptions.prototype = {
    constructor: ComponentTabCollapseOptions,
    //获取基础属性html
    getHtml: function () {
        this._init();
        return this.html;
    },
    //注册事件
    setProperty: function (event, currentPropertyID) {
        if (event.type == "click") {
            if (currentPropertyID == this.showModalBtnId) {

                this._initModal();

                this._appendModal();

                this._initEvents();

                this._showModal();
            }
        }
    },
    _init: function () {
        this._initData();
        this._initHtml();
    },
    _initData: function () {
        var that = this,
            advanceProperty = this._getParameter(ComponentTabCollapseOptions.DEFAULTS.optionsParamName),
            param = this._getParameter(ComponentTabCollapseOptions.DEFAULTS.tableParamName);

        if (advanceProperty) {
            $.extend(this.options, JSON.parse(decodeURIComponent(advanceProperty)));
        }

        if (param) {
            this.parameter = JSON.parse(decodeURIComponent(param));
        }


    },
    _initHtml: function () {
        this.html = [
            '<div class="zte-panel">',
            '<button class="btn btn-primary" type="button" id="', this.showModalBtnId, '">工具栏设置</button>',
            '</div>'
        ].join("");
    },
    _clear: function () {
        this.$advanceModal.remove();
    },
    _setParameter: function (name, param) {
        this.componentObject.attr(name, param);
    },
    _getParameter: function (name) {
        return this.componentObject.attr(name);
    },
    _initModal: function () {
        var param = this._getParameter(ComponentTabCollapseOptions.DEFAULTS.tableParamName);
        if (param) {
            this.parameter = JSON.parse(decodeURIComponent(param));
        }
        this.$advanceModal = $(this._getModalHtml());
        this.$showAdvanceModalBtn = $("#" + this.showModalBtnId);
        this.$options = this.$advanceModal.find("div.container-fluid");


        this.$confirmBtn = this.$advanceModal.find("button.confirm");
    },
    _appendModal: function () {
        $("body").append(this.$advanceModal);
    },
    _showModal: function () {
        this.$advanceModal.modal({
            show: true
        });
    },
    _hideModal: function () {
        this.$advanceModal.modal('hide');
    },
    _getModalHtml: function () {
        return [
            '<div  class="modal fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">',
            '<div class="modal-dialog modal-sm">',
            '<div class="modal-content">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span></button>',
            '<h4 class="modal-title">工具条设置</h4>',
            '</div>',
            '<div class="modal-body" style="max-height:400px; overflow: auto;">',
            '<div class="container-fluid">',
            this._getModalBodyHtml(),
            '</div>',
            '</div>',
            '<div class="modal-footer">',
            '<button type="button" class="btn btn-primary confirm">确定</button>',
            '<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>',
            '</div>',
            '</div>',
            '</div>',
            '</div>',
        ].join("");
    },
    _getModalBodyHtml: function () {
        var
            that = this,
            html = [];
        this.options.forEach(function (option, index) {
            html.push(that._getBodyHtml(option, index));
        });

        return html.join("");
    },
    _getBodyHtml: function (option, index) {
        return [
            '<div class="row" data-index = "', index, '">',
            '<div class="col-md-12" style="border: solid 1px #ddd;margin-bottom: 5px;">', this._getOptionsHtml(option, index), '</div>',
            '</div>',
        ].join("");
    },
    _getOptionsHtml: function (option, index) {

        var
            iconTextId = "iconBtn" + getCurrentTime() + "_" + index;
        return [
            '<form class="form-horizontal" style="margin-top: 5px">',
            '<div class="form-group">',
            '<label  class="col-md-2 control-label">名称</label>',
            '<div class="col-md-4">',
            '<input type="text" class="form-control btnName"  placeholder="按钮名称" value="', option.title, '">',
            '</div>',
            '<label  class="col-md-2 control-label">函数</label>',
            '<div class="col-md-4">',
            '<input type="text" class="form-control clickFun"  placeholder="点击函数" value="', option.clickfunction, '">',
            '</div>',
            '</div>',
            '<div class="form-group">',
            '<label  class="col-md-2 control-label">图标</label>',
            '<div class="col-md-4">',
            '<input type="text" disabled="disabled" class="form-control icon" id="', iconTextId, '"  placeholder="Glyphicon图标" value="', option.icon, '">',
            '</div>',
            '<div class="col-md-2" style="text-align: left">',
            '<a class="btn btn-info btn-sm showIcon" data-icon = "', iconTextId, '" role="button" href="#" data-toggle="modal">',
            '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>',
            '</a></div>',
            '<div class="col-md-4" style="text-align: right">',
            '<div class="btn-group"><button type="button" class="btn btn-success addOption"><span class="glyphicon glyphicon-plus"></span></button>',
            '<button type="button" class="btn btn-danger deleteOption"><span class="glyphicon glyphicon-minus"></span></button></div>',
            '</div>',
            '</div>',
            '</form>',
        ].join("");
    },
    _getToolBar: function () {
        var that = this,
            tableid = that.componentObject.attr("compid"),
            tabletoolbar = that.componentObject.attr("tabletoolbar"),
            customToolBar = that.componentObject.attr("options");
        if (customToolBar) {
            customToolBar = JSON.parse(decodeURIComponent(customToolBar));
        } else {
            customToolBar = new Object();
        }

        var toolbars = new Array();

        if (tabletoolbar) {
            tabletoolbar = JSON.parse(decodeURIComponent(tabletoolbar));

            if (tabletoolbar.add == "checked") {
                toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'新建\', \'' + $("#formuri").val() + '\')" id="' + tableid + 'AddBtn"> 新建</button>');
            }
            if (tabletoolbar.modify == "checked") {
                toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'修改\', \'' + $("#formuri").val() + '\')" id="' + tableid + 'ModifyBtn"> 修改</button>');
            }
            if (tabletoolbar.del == "checked") {
                toolbars.push('<button type="button" class="btn btn-primary" onclick="deleteServerTableRows(\'' + tableid + '\')" id="' + tableid + 'DeleteBtn"> 删除</button>');
            }
            if (tabletoolbar.refresh == "checked") {
                toolbars.push('<button type="button" class="btn btn-primary" onclick="refreshTable(\'' + tableid + '\')" id="' + tableid + 'RefreshBtn"> 刷新</button>');
            }
        }
        if (!$.isEmptyObject(customToolBar)) {
            $.each(customToolBar, function (indec, item) {
                toolbars.push('<button type="button" class="btn btn-primary" onclick="' + item["clickfunction"].replace(/\"/g, "'") + '" id="btn' + getCurrentTime() + '"> ');
                toolbars.push(' <span class="' + item["icon"] + '" aria-hidden="true"></span>' + item["title"] + '</button>');
            })
        }
        if (toolbars.length > 0) {

            toolbars.push('<div class="modal fade" tabindex="-1" role="dialog" id="' + tableid + 'modal" aria-labelledby="myLargeModalLabel">');
            toolbars.push('<div class="modal-dialog modal-lg">');
            toolbars.push('<div class="modal-content">');
            toolbars.push('<div class="modal-header">');
            toolbars.push('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
            toolbars.push('<h4 class="modal-title" id="gridSystemModalLabel"></h4>');
            toolbars.push('</div>');
            toolbars.push('<div class="modal-body">');
            toolbars.push('</div>');
            toolbars.push('<div class="modal-footer">');
            toolbars.push('</div>');
            toolbars.push('</div>');
            toolbars.push('</div>');
            toolbars.push('</div>');


        }

        if (!$.isEmptyObject(customToolBar) || toolbars.length > 0) {
            toolbars.unshift('<div id="' + tableid + 'toolbar" class="btn-group">');
            toolbars.push('</div>');
        }


        return toolbars;
    },
    _initEvents: function () {

        var that = this;

        this.$confirmBtn.off("click").on("click", function () {
            that._onClickApply();
        });

        this.$advanceModal.on("click", "button.addOption", function (e) {
            var $this = $(this),
                $parents = $this.parents("div[data-index]"),
                index = parseInt($parents.data("index")),
                nextIndex = index + 1;

            that._insertRow({
                index: nextIndex,
                row: $.extend({}, ComponentTabCollapseOptions.DEFAULTS.options[0])
            });

            that._resetView();


        }).on("click", "button.deleteOption", function (e) {
            var $this = $(this),
                $parents = $this.parents("div[data-index]"),
                index = parseInt($parents.data("index")),
                legends = that.options;

            if (legends.length > 1) {
                that._deleteRow(index);
                that._resetView();
            }
        }).on("blur", "input.btnName", function (e) {
            var $this = $(this),
                value = $this.val(),
                $parents = $this.parents("div[data-index]"),
                index = parseInt($parents.data("index"));

            that._updateBtnName(index, value);

        }).on("change", "input.icon", function (e) {
            var $this = $(this),
                value = $this.val(),
                $parents = $this.parents("div[data-index]"),
                index = parseInt($parents.data("index"));

            that._updateIcon(index, value);

        }).on("click", "a.showIcon", function (e) {
            var $this = $(this),
                iconTextId = $this.data("icon");
            $("#iconModal").css("z-index", 10000);
            showModalDialog("iconModal", "图标选择", "html/icon.html?id=" + iconTextId);
        }).on("blur", "input.clickFun", function (e) {
            var $this = $(this),
                value = $this.val(),
                $parents = $this.parents("div[data-index]"),
                index = parseInt($parents.data("index"));

            that._updateFun(index, value);
        });
        this.$advanceModal.off("hidden.bs.modal").on("hidden.bs.modal", function (e) {
            that._clear();
        });
        $("#iconModal").off("hidden.bs.modal").on("hidden.bs.modal", function (e) {
            that.$advanceModal.find("input.icon").trigger("change");
        });
    },

    _insertRow: function (params) {
        if (!params.hasOwnProperty('index') || !params.hasOwnProperty('row')) {
            return;
        }
        var
            index = params.index,
            row = params.row;

        this._insertOption(index, row);


    },
    _deleteRow: function (index) {
        this._deleteOption(index);
    },
    _insertOption: function (index, option) {
        this.options.splice(index, 0, option);
    },
    _deleteOption: function (index) {
        this.options.splice(index, 1);
    },
    _updateBtnName: function (index, vluae) {
        this.options[index].title = vluae;
    },
    _updateFun: function (index, vluae) {
        this.options[index].clickfunction = vluae;
    },
    _updateIcon: function (index, vluae) {
        this.options[index].icon = vluae;
    },
    _initComponent: function () {
        if (this.parameter) {
            this._clearComponent();
            this._initToolBar();
            this._initTable();
        }

    },
    _clearComponent: function () {
        this.componentObject.empty();
    },
    _initToolBar: function () {
        var $component = this.componentObject,
            toolbar = this._getToolBar();
        if (!$.isEmptyObject(toolbar)) {
            $component.append(toolbar.join(""));
        }
        $component.attr(ComponentTabCollapseOptions.DEFAULTS.toolbarParamName, encodeURI(toolbar.join(" ")));
    },
    _initTable: function () {

        var $component = this.componentObject,
            param = this.parameter,
            id = $component.attr("compid"),
            $table = $('<table id="' + id + '"></table>');
        $component.append($table);

        if (param["clickToSelect"]) {
            $table.bootstrapTable(param).on('load-success.bs.table', function () {
                $(this).find(".bs-checkbox").addClass("hide");
            })
        } else {
            $table.bootstrapTable(param);
        }
    },

    _resetView: function () {
        var that = this;
        this.$options.empty();
        this.$options.append(that._getModalBodyHtml());
    },
    _onClickApply: function () {
        var that = this;
        this._setParameter(ComponentTabCollapseOptions.DEFAULTS.optionsParamName, encodeURIComponent(JSON.stringify(that.options)));

        this._initComponent();
        this._hideModal();
    }
}
*/

/*
 设置TabCollapse选型高级属性
 */
function AdvanceComponentTabCollapseOptions(componentObject, advancePanelObject) {
    this.componentObject = componentObject;
    this.advancePanelObject = advancePanelObject;
    this.loadPanel = function () {

        var toolbar = [
                '<div id="toolbar">',
                '<button id="add" type="button" class="btn btn-primary">',
                '<i class="glyphicon glyphicon-plus"></i> 添加',
                '</button>',
                '<button id="delete" type="button" class="btn btn-danger">',
                '<i class="glyphicon glyphicon-minus"></i> 删除',
                '</button>',
                '<button id="apply" type="button" class="btn btn-success">',
                '<i class="glyphicon glyphicon-ok"></i> 应用',
                '</button>',
                '</div>'
            ].join(''),
            table = [
                '<table id="tab_collapse_options_table">',
                '</table>'
            ].join('');

        /**
         * 文本格式化
         * @param value
         * @param row
         * @param index
         * @returns {string}
         */
        var textFormatter = function (value, row, index) {
            return '<input type="text" data-field="' + this.field + '" class="form-control" value="' + value + '" />';
        }

        window.operateTabCollapseEvents = {
            'change :text': function (e, value, row, index) {
                var fieldName = $(this).data("field");
                var fieldValue = $(this).val();
                var table = $(e.target).parents("table");
                table.bootstrapTable("updateCell",
                    {
                        index: index,
                        field: fieldName,
                        value: fieldValue
                    }
                )
            }
        }

        this.advancePanelObject.empty();
        this.advancePanelObject.append(toolbar);
        this.advancePanelObject.append(table);

        var options = tagComponent.attr("options");
        if (typeof options === "undefined") {
            options = [];
        } else {
            options = JSON.parse(decodeURIComponent(options));
        }
        var columns = [
            {
                field: "state",
                align: 'center',
                valign: 'middle',
                checkbox: true
            },
            {
                field: 'id',
                visible: false
            },
            {
                title: '标题',
                field: 'title',
                align: 'center',
                valign: 'middle',
                formatter: textFormatter,
                events: operateTabCollapseEvents
            },
            {
                title: '目标ID',
                field: 'targetid',
                align: 'center',
                valign: 'middle',
                formatter: textFormatter,
                events: operateTabCollapseEvents
            }
        ];

        $("#tab_collapse_options_table").bootstrapTable({
            uniqueId: "id",
            toolbar: "#toolbar",
            height: 500,
            data: options,
            columns: columns
        });


        $("#toolbar").off('click', '#add').on('click', '#add', function () {
            var $table = $("#tab_collapse_options_table");
            var rows = $table.bootstrapTable("getData");
            $table.bootstrapTable("append", {
                id: rows.length,
                title: "",
                targetid: ""
            })
        }).off('click', '#delete').on('click', '#delete', function () {
            var $table = $("#tab_collapse_options_table");
            var ids = $.map($table.bootstrapTable('getSelections'), function (row) {
                return row.id;
            });
            $table.bootstrapTable('remove', {
                field: 'id',
                values: ids
            });
        }).off('click', '#apply').on('click', '#apply', function () {
            var $table = $("#tab_collapse_options_table"),
                rows = $table.bootstrapTable("getData");
            if (tagType === "tab") {
                var nav_tabs = tagComponent.find("ul.nav-tabs").empty(),
                    nav_content = tagComponent.find("div.tab-content").empty();


                $.each(rows, function (index, item) {
                    nav_tabs.append('<li role="presentation"' + (index == 0 ? 'class="active"' : '') + '><a href="#' + item.targetid + '" aria-controls="' + item.targetid + '" role="tab" data-toggle="tab">' + item.title + '</a></li>')
                })
            } else {
                var container = tagComponent.find("div.panel-group"),
                    getPanelHTML = function (index, title, targetid) {
                        var html = [];
                        html.push('<div class="panel panel-default">');
                        html.push('<div class="panel-heading" role="tab">');
                        html.push('<h4 class="panel-title">');
                        html.push('<a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + targetid + '" aria-expanded="true" aria-controls="' + targetid + '">');
                        if (index == 0) {
                            html.push('<span class="glyphicon glyphicon-minus" aria-hidden="true">' + title + '</span>');
                        } else {
                            html.push('<span class="glyphicon glyphicon-plus" aria-hidden="true">' + title + '</span>');
                        }

                        html.push('</a>');

                        html.push('</h4>');
                        html.push('</div>');
                        html.push('</div>');
                        html.push('</div>');
                        return html.join(" ");
                    };
                container.empty();
                $.each(rows, function (index, item) {
                    var panel = getPanelHTML(index, item.title, item.targetid);
                    container.append(panel);
                })
            }

            tagComponent.attr("options", encodeURIComponent(JSON.stringify(rows)));
        });


    }
}
/**
 组件是否显示
 */
function ComponentVisibilityProperty(componentObject) {
    this.id = "component_visibility_" + getCurrentTime();
    this.getHtml = function () {
        var checked = this.getProperty() == "true" ? "checked" : "";
        var html = [];
        html.push("<label style='cursor:pointer;'><input id=\"" + this.id + "\" type =\"checkbox\" " + checked + " />隐藏</label>");
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var checked = document.getElementById(currentPropertyID).checked;
            $(componentObject).attr("componentvisibility", checked);
        }
    }
    this.getProperty = function () {
        var visibility = decodeURIComponent($(componentObject).attr("componentvisibility"));
        if (visibility != "undefined") {
            return visibility;
        }
        else {
            return "false";
        }
    }
}
/**
 * 数据集配置
 * @param componentObject
 * @constructor
 */
function ComponentDatasetConfigProperty(componentObject) {
    this.uriId = "component_dataset_uri_" + getCurrentTime();
    this.dsId = "component_dataset_ds_" + getCurrentTime();
    this.dsFieldsId = "component_dataset_dsfields_" + getCurrentTime();
    this.id = this.uriId + "," + this.dsId + "," + this.dsFieldsId;

    this.getHtml = function () {
        var html = [];
        html.push("<div class=\"list-group\">");
        /**数据源下拉列表*/
        html.push(" <li class=\"list-group-item\">");
        html.push("<select class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.uriId + "\" />");
        html.push("</li>");
        /**数据集下拉列表*/
        html.push(" <li class=\"list-group-item\">");
        html.push("<select class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.dsId + "\" />");
        html.push("</li>");
        /**数据集字段列表*/
        html.push(" <li class=\"list-group-item\">");
        html.push("<div style=\"height:100px;overflow:auto\" id=\"" + this.dsFieldsId + "\"></div>")
        //html.push("<select multiple class=\"form-textbox form-textbox-text col-md-12\" id=\""+this.dsFieldsId+"\" />");
        html.push("</li>");
        html.push("</div>");

        html.push("<script>var datasetConfig = new ComponentDatasetConfigDataBind(\"" + this.uriId + "\",\"" + this.dsId + "\",\"" + this.dsFieldsId + "\");");
        var config = this.getProperty();
        html.push("datasetConfig.init(\"" + config.uri + "\",\"" + config.datasetname + "\");")
        html.push("$(\"#" + this.uriId + "\").change(function(){datasetConfig.onDatasourceChange();});");
        html.push("$(\"#" + this.dsId + "\").change(function(){datasetConfig.onDatasetChange();});");
        html.push("</script>");
        return html.join(" ");
    }

    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var datasetconfig = this.getProperty();
            if (currentPropertyID == this.uriId) {
                datasetconfig.uri = $("#" + this.uriId).val();
            } else if (currentPropertyID == this.dsId) {
                datasetconfig.datasetname = $("#" + this.dsId).val();
            }
            $(componentObject).attr("datasetconfig", encodeURIComponent(JSON.stringify(datasetconfig)));
        }
    }
    this.getProperty = function () {
        var datasetconfig = decodeURIComponent($(componentObject).attr("datasetconfig"));
        if (datasetconfig != "undefined") {
            return $.parseJSON(datasetconfig);
        } else {
            return {uri: "", datasetname: ""};
        }
    }
}

/**
 * 带key/value选项组件数据集配置（包括：下拉框组件、单选框组件等）
 * @param componentObject
 * @constructor
 */
function OptionComponentDatasetConfigProperty(componentObject) {
    this.configInfoId = "component_dataset_config_" + getCurrentTime();
    this.configBtnId = "component_dataset_config_btn_" + getCurrentTime();
    this.configClearBtnId = "component_dataset_config_clear_btn_" + getCurrentTime();
    this.id = this.configInfoId + "," + this.configBtnId + "," + this.configClearBtnId;

    this.getHtml = function () {
        var html = [];
        html.push("<div class=\"list-group\">");
        /**数据源下拉列表*/
        html.push(" <li class=\"list-group-item\">");
        html.push("<div id=\"" + this.configInfoId + "\">");
        html.push(this.getConfigInfo());
        html.push("</div>");
        html.push("</li>");

        /**数据集下拉列表*/
        html.push(" <li class=\"list-group-item\">");
        html.push("<div style=\"text-align: right\" role=\"group\" >");
        html.push("<button type=\"button\" class=\"btn  btn-primary\" id=\"" + this.configBtnId + "\">设置</button>");
        html.push("<button type=\"button\" class=\"btn  btn-primary\" id=\"" + this.configClearBtnId + "\">清空</button>");
        html.push("</div></li>");
        html.push("</div>");
        var compId = $(componentObject).attr("compid");
        html.push("<script>var optionDatasetConfig = new OptionComponentDatasetConfigDataBind(\"" + this.configInfoId + "\",\"" + this.configBtnId + "\",\"" + compId + "\",\"" + this.configClearBtnId + "\");");
        html.push("optionDatasetConfig.init();</script>");
        return html.join(" ");
    }

    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            return;
        }
    }
    this.getProperty = function () {
        var datasetconfig = decodeURIComponent($(componentObject).attr("datasetconfig"));
        if (datasetconfig != "undefined") {
            return $.parseJSON(datasetconfig);
        } else {
            return null;
        }
    }
    this.getConfigInfo = function () {
        var datasetConfigInfo = this.getProperty();
        var configDetailInfo = "数据集信息:未定义";
        if (datasetConfigInfo) {
            var componentType = $(componentObject).attr("type");
            switch (componentType) {
                case "tree":
                    configDetailInfo = "<p>数据源:" + datasetConfigInfo.datasource + "</p>" +
                        "<p>数据集:" + datasetConfigInfo.dataset + "</p>";
                    break;
                case "select_dynamic":
                case "input_radio":
                    configDetailInfo = "<p>数据源:" + datasetConfigInfo.datasource + "</p>" +
                        "<p>数据集:" + datasetConfigInfo.dataset + "</p>" +
                        "<p>选项名称:" + datasetConfigInfo.key + "</p>" +
                        "<p>选项值:" + datasetConfigInfo.value + "</p>";
                    break;
                case "table_base":
                    configDetailInfo = "<p>数据源:" + datasetConfigInfo.datasource + "</p>" +
                        "<p>数据集:" + datasetConfigInfo.dataset + "</p>";
                    break;
            }
        }
        return configDetailInfo;
    }
}
/**
 *  带key/value选项组件数据集配置（包括：下拉框组件、单选框组件等）
 * @constructor
 */
function OptionComponentDatasetConfigDataBind(configInfoId, configBtnId, compId, configClearBtnId) {
    this.init = function () {
        $("#" + configBtnId).click(function () {
            var src = "datasetConfig.html?time=" + getCurrentTime() + "&compId=" + compId;
            src += "&configInfoId=" + configInfoId;

            $("[name=datasetConfigFrame]").attr("src", src);
            $("#datasetConfigDialog").modal('show');
        })

        $("#" + configClearBtnId).click(function () {
            var currentObject = $("[compid=" + compId + "]");
            if (currentObject.attr("type") == "tree"
                && $(currentObject).attr("datasetconfig") != undefined) {
                $(currentObject).removeAttr("treenodename")
                    .removeAttr("treenodeid")
                    .removeAttr("treeparentnodeid")
                    .removeAttr("treenodetitle");

                $("#" + configInfoId).parents().find("table input").each(function () {
                    var id = $(this).attr("id");
                    if (id == "treenodename" || id == "treenodeid" ||
                        id == "treeparentnodeid" || id == "treenodetitle") {
                        $(this).val("");
                    }
                });
            }
            $(currentObject).removeAttr("datasetconfig").trigger("click");
            $("#" + configInfoId).html("数据集信息:未定义");
        })
    }
}

/**
 * 数据集数据绑定
 * @param uriId
 * @param datasetId
 * @param datasetFieldsId
 * @constructor
 */
function ComponentDatasetConfigDataBind(uriId, datasetId, datasetFieldsId) {
    /**
     * 初始化数据集组件内容
     * @param defaultDatasource
     * @param defaultDataset
     */
    this.init = function (defaultDatasource, defaultDataset) {
        /* 初始化组件值*/
        this.loadDatasourceInfo(defaultDatasource);
        this.loadDatasetInfo(defaultDatasource, defaultDataset);
        this.loadDatasetFields(defaultDatasource, defaultDataset);
    }
    /**
     * 加载数据源信息
     * @param selectedDatasource
     */
    this.loadDatasourceInfo = function (selectedDatasource) {
        var datasourceOptions = [];
        datasourceOptions.push("<option value=''><--请选择数据源--></option>");
        $.each(dataSourceDictionary.keySet(), function (index, item) {
            datasourceOptions.push("<option value=\"" + item + "\">" + item + "</option>");
        })
        $("#" + uriId).empty().append(datasourceOptions).val(selectedDatasource);
    }
    /**
     * 加载数据集信息
     * @param selectedDatasource
     * @param selectedDataset
     */
    this.loadDatasetInfo = function (selectedDatasource, selectedDataset) {
        var datasetLoadCallback = function (tables) {
            var options = [];
            options.push("<option value=''><--请选择数据集--></option>");
            $.each(tables, function (index, item) {
                options.push("<option value = " + item + ">" + item + "</option>");
            })
            $("#" + datasetId).empty().append(options).val(selectedDataset);
        }
        queryDatasetNames(selectedDatasource, datasetLoadCallback);
    }
    /**
     * 加载数据集字段
     * @param selectedDatasource
     * @param selectedDataset
     */
    this.loadDatasetFields = function (selectedDatasource, selectedDataset) {
        var fields = [];
        var datasetFieldsCallback = function (data) {
            $.each(data, function (index, item) {
                fields.push("<p>" + item.columnName + "</p>");
            })
            $("#" + datasetFieldsId).html(fields.join(" "));
        }
        queryDatasetFields(selectedDatasource, selectedDataset, datasetFieldsCallback);
    }
    /**
     * 数据源改变事件
     */
    this.onDatasourceChange = function () {
        $("#" + datasetId).empty();
        $("#" + datasetFieldsId).html("");

        this.loadDatasetInfo($("#" + uriId).val(), "");
    }
    /**
     * 数据集改变事件
     */
    this.onDatasetChange = function () {
        $("#" + datasetFieldsId).html("");
        this.loadDatasetFields($("#" + uriId).val(), $("#" + datasetId).val());
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
function ComponentDataFieldsManage(componentObject,parentDataField) {
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

/**
 * 图表title属性设置
 * @param componentObject
 * @constructor
 */
function ComponentChartTitleOptions(componentObject) {
    this.idIsShow = "options_title_isshow_" + getCurrentTime();
    this.idTitle = "options_title_title_" + getCurrentTime();
    this.idSubTitle = "options_title_subtitle_" + getCurrentTime();
    this.idHorizonAlign = "options_title_horizon_" + getCurrentTime();
    this.idVerticalAlign = "options_title_vertical_" + getCurrentTime();

    this.id = this.idIsShow + "," + this.idTitle + "," + this.idSubTitle + "," + this.idHorizonAlign + "," + this.idVerticalAlign;

    this.getHtml = function () {
        var isShowHtml = '',
            titleHtml = '',
            titlePlaceHolder = "标题",
            subtextHtml = '',
            subtextPlaceHolder = "副标题",
            horizontalAlignHtml = '',
            verticalAlignHtml = '';

        var titleProperty = this.getProperty();

        var option = {
            type: 'radio',
            name: '是否显示标题',
            id: this.idIsShow,
            options: [{
                text: '是',
                value: 'true',
                onclick: "$(\'#divChartTitle\').show();_changeProperty('chartstitle','" + this.idIsShow + "');"
            }, {
                text: '否',
                value: 'false',
                onclick: "$(\'#divChartTitle\').hide();_changeProperty('chartstitle','" + this.idIsShow + "');"
            }]
        };
        if (titleProperty.isShow == "true") {
            option.options[0].checked = "checked";
        } else {
            option.options[1].checked = "checked";
        }
        isShowHtml = getRadioInputsHtml(option);

        titleHtml = '<div class="col-lg-12"><input type="text" id="' + this.idTitle + '" placeholder="' + titlePlaceHolder + '" class="form-textbox form-textbox-text col-md-12" value="' + titleProperty.title + '" /></div>';

        subtextHtml = '<div class="col-lg-12"><input type="text" id="' + this.idSubTitle + '" placeholder="' + subtextPlaceHolder + '" class="form-textbox form-textbox-text col-md-12" value="' + titleProperty.subtitle + '" /></div>';

        option = {
            type: 'radio',
            name: '水平位置',
            id: this.idHorizonAlign,
            options: [{
                text: '左',
                value: 'left',
                onclick: "_changeProperty('chartstitle','" + this.idHorizonAlign + "');"
            }, {
                text: '中',
                value: 'center',
                onclick: "_changeProperty('chartstitle','" + this.idHorizonAlign + "');"
            }, {text: '右', value: 'right', onclick: "_changeProperty('chartstitle','" + this.idHorizonAlign + "');"}]
        };
        if (titleProperty.x == "left") {
            option.options[0].checked = "checked";
        } else if (titleProperty.x == "center") {
            option.options[1].checked = "checked";
        } else {
            option.options[2].checked = "checked";
        }
        horizontalAlignHtml = getRadioInputsHtml(option);

        option = {
            type: 'radio',
            name: '垂直位置',
            id: this.idVerticalAlign,
            options: [{
                text: '上',
                value: 'top',
                checked: 'checked',
                onclick: "_changeProperty('chartstitle','" + this.idVerticalAlign + "');"
            }, {
                text: '中',
                value: 'center',
                onclick: "_changeProperty('chartstitle','" + this.idVerticalAlign + "');"
            }, {text: '下', value: 'bottom', onclick: "_changeProperty('chartstitle','" + this.idVerticalAlign + "');"}]
        };
        if (titleProperty.y == "top") {
            option.options[0].checked = "checked";
        } else if (titleProperty.y == "center") {
            option.options[1].checked = "checked";
        } else {
            option.options[2].checked = "checked";
        }
        verticalAlignHtml = getRadioInputsHtml(option);

        var rtnHtml = [];
        rtnHtml.push('<div class="row">');
        rtnHtml.push(isShowHtml);
        if (titleProperty.isShow == "true") {
            rtnHtml.push('<div id="divChartTitle" style="display:block">');
        } else {
            rtnHtml.push('<div id="divChartTitle" style="display:none">');
        }
        rtnHtml.push(titleHtml);
        rtnHtml.push(subtextHtml);
        rtnHtml.push(horizontalAlignHtml);
        rtnHtml.push(verticalAlignHtml);
        rtnHtml.push('</div></div>');
        return rtnHtml.join("");
    }

    /*
     描述：保存属性到布局组上
     参数：无
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change" || event.type == "focusout") {
            var chartTitleProperty = $.parseJSON(decodeURIComponent($(componentObject).attr("chartstitle")));
            if (currentPropertyID == this.idTitle) {
                chartTitleProperty.title = $("#" + currentPropertyID).val();
            } else if (currentPropertyID == this.idSubTitle) {
                chartTitleProperty.subtitle = $("#" + currentPropertyID).val();
            } else if (currentPropertyID.indexOf(this.idIsShow) > -1) {
                chartTitleProperty.isShow = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idHorizonAlign) > -1) {
                chartTitleProperty.x = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idVerticalAlign) > -1) {
                chartTitleProperty.y = $("#" + currentPropertyID + ":checked").val();
            }
            $(componentObject).attr("chartstitle", encodeURIComponent(JSON.stringify(chartTitleProperty)));

            _initEchartsComponent("chartstitle", chartTitleProperty);
        }
    }
    /**
     描述：获取可编辑属性,
     参数：无
     返回值：如果组件已经设置可编辑属性则返回已设置的属性json对象，否则返回默认值。
     */
    this.getProperty = function () {
        var ret = "";
        var chartTitleProperty = $(componentObject).attr("chartstitle");
        if (chartTitleProperty != undefined) {
            ret = $.parseJSON(decodeURIComponent(chartTitleProperty));
        }
        else {
            ret = this.getDefaultProperty();
        }
        return ret;
    }
    this.getDefaultProperty = function () {
        var defaultProperty = {};
        //是否显示
        defaultProperty.isShow = "true";
        //标题
        defaultProperty.title = "标题";
        //副标题
        defaultProperty.subtitle = "副标题";
        //水平位置
        defaultProperty.x = "left";
        //垂直位置
        defaultProperty.y = "top";
        //添加默认值
        $(componentObject).attr("chartstitle", encodeURIComponent(JSON.stringify(defaultProperty)));
        return defaultProperty;
    }
}

/**
 * 图表legend属性设置
 * @param componentObject
 * @constructor
 */
function ComponentChartLegendOptions(componentObject) {
    this.idIsShow = "options_legend_isshow_" + getCurrentTime();
    this.idOrient = "options_legend_orient_" + getCurrentTime();
    this.idHorizonAlign = "options_legend_horizon_" + getCurrentTime();
    this.idVerticalAlign = "options_legend_vertical_" + getCurrentTime();

    this.id = this.idIsShow + "," + this.idOrient + "," + this.idHorizonAlign + "," + this.idVerticalAlign;

    this.getHtml = function () {
        var isShowHtml = '',
            orientHtml = '',
            horizontalAlignHtml = '',
            verticalAlignHtml = '';

        var legendProperty = this.getProperty();
        var option = {
            type: 'radio',
            name: '是否显示图例',
            id: this.idIsShow,
            options: [{
                text: '是',
                value: 'true',
                onclick: "$(\'#divChartLegend\').show();_changeProperty('chartslegend','" + this.idIsShow + "');"
            }, {
                text: '否',
                value: 'false',
                onclick: "$(\'#divChartLegend\').hide();_changeProperty('chartslegend','" + this.idIsShow + "');"
            }]
        };
        if (legendProperty.isShow == "true") {
            option.options[0].checked = "checked";
        } else {
            option.options[1].checked = "checked";
        }
        isShowHtml = getRadioInputsHtml(option);

        option = {
            type: 'radio',
            name: '布局方式',
            id: this.idOrient,
            options: [{
                text: '水平',
                value: 'horizontal',
                onclick: "_changeProperty('chartslegend','" + this.idOrient + "');"
            }, {text: '垂直', value: 'vertical', onclick: "_changeProperty('chartslegend','" + this.idOrient + "');"}]
        };
        if (legendProperty.orient == "horizontal") {
            option.options[0].checked = "checked";
        } else {
            option.options[1].checked = "checked";
        }
        orientHtml = getRadioInputsHtml(option);

        option = {
            type: 'radio',
            name: '水平位置',
            id: this.idHorizonAlign,
            options: [{
                text: '左',
                value: 'left',
                onclick: "_changeProperty('chartslegend','" + this.idHorizonAlign + "');"
            }, {
                text: '中',
                value: 'center',
                onclick: "_changeProperty('chartslegend','" + this.idHorizonAlign + "');"
            }, {text: '右', value: 'right', onclick: "_changeProperty('chartslegend','" + this.idHorizonAlign + "');"}]
        };
        if (legendProperty.x == "left") {
            option.options[0].checked = "checked";
        } else if (legendProperty.x == "center") {
            option.options[1].checked = "checked";
        } else {
            option.options[2].checked = "checked";
        }
        horizontalAlignHtml = getRadioInputsHtml(option);

        option = {
            type: 'radio',
            name: '垂直位置',
            id: this.idVerticalAlign,
            options: [{
                text: '上',
                value: 'top',
                onclick: "_changeProperty('chartslegend','" + this.idVerticalAlign + "');"
            }, {
                text: '中',
                value: 'center',
                onclick: "_changeProperty('chartslegend','" + this.idVerticalAlign + "');"
            }, {text: '下', value: 'bottom', onclick: "_changeProperty('chartslegend','" + this.idVerticalAlign + "');"}]
        };
        if (legendProperty.y == "top") {
            option.options[0].checked = "checked";
        } else if (legendProperty.y == "center") {
            option.options[1].checked = "checked";
        } else {
            option.options[2].checked = "checked";
        }
        verticalAlignHtml = getRadioInputsHtml(option);
        var rtnHtml = [];
        rtnHtml.push('<div class="row">');
        rtnHtml.push(isShowHtml);
        if (legendProperty.isShow == "true") {
            rtnHtml.push('<div id="divChartLegend" style="display:block">');
        } else {
            rtnHtml.push('<div id="divChartLegend" style="display:none">');
        }
        rtnHtml.push(orientHtml);
        rtnHtml.push(horizontalAlignHtml);
        rtnHtml.push(verticalAlignHtml);
        rtnHtml.push('</div></div>');
        return rtnHtml.join("");
    }

    /*
     描述：保存属性到布局组上
     参数：无
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var chartLegendProperty = $.parseJSON(decodeURIComponent($(componentObject).attr("chartslegend")));
            if (currentPropertyID.indexOf(this.idIsShow) > -1) {
                chartLegendProperty.isShow = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idOrient) > -1) {
                chartLegendProperty.orient = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idHorizonAlign) > -1) {
                chartLegendProperty.x = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idVerticalAlign) > -1) {
                chartLegendProperty.y = $("#" + currentPropertyID + ":checked").val();
            }
            $(componentObject).attr("chartslegend", encodeURIComponent(JSON.stringify(chartLegendProperty)));
        }
    }
    /**
     描述：获取可编辑属性,
     参数：无
     返回值：如果组件已经设置可编辑属性则返回已设置的属性json对象，否则返回默认值。
     */
    this.getProperty = function () {
        var ret = "";
        var chartLegendProperty = $(componentObject).attr("chartslegend");
        if (chartLegendProperty != undefined) {
            ret = $.parseJSON(decodeURIComponent(chartLegendProperty));
        }
        else {
            ret = this.getDefaultProperty();
        }
        return ret;
    }
    this.getDefaultProperty = function () {
        var defaultProperty = {};
        //是否显示
        defaultProperty.isShow = "true";
        //标题
        defaultProperty.orient = "horizontal";
        //水平位置
        defaultProperty.x = "center";
        //垂直位置
        defaultProperty.y = "top";
        //添加默认值
        $(componentObject).attr("chartslegend", encodeURIComponent(JSON.stringify(defaultProperty)));
        return defaultProperty;
    }
}

/**
 * 图表tooltip属性设置
 * @param componentObject
 * @constructor
 */
function ComponentChartTooltipOptions(componentObject) {
    this.idIsShow = "options_tooltip_isshow_" + getCurrentTime();
    this.idTrigger = "options_tooltip_trigger_" + getCurrentTime();

    this.id = this.idIsShow + "," + this.idTrigger;

    this.getHtml = function () {
        var isShowHtml = '',
            triggerHtml = '';

        var tooltipProperty = this.getProperty();
        var option = {
            type: 'radio',
            name: '是否显示提示框',
            id: this.idIsShow,
            options: [{
                text: '是',
                value: 'true',
                onclick: "$(\'#divChartTooltip\').show();_changeProperty('chartstooltip','" + this.idIsShow + "');"
            }, {
                text: '否',
                value: 'false',
                onclick: "$(\'#divChartTooltip\').hide();_changeProperty('chartstooltip','" + this.idIsShow + "');"
            }]
        };
        if (tooltipProperty.isShow == "true") {
            option.options[0].checked = "checked";
        } else {
            option.options[1].checked = "checked";
        }
        isShowHtml = getRadioInputsHtml(option);

        option = {
            type: 'radio',
            name: '触发类型',
            id: this.idTrigger,
            options: [{
                text: '数据',
                value: 'item',
                onclick: "_changeProperty('chartstooltip','" + this.idTrigger + "');"
            }, {text: '坐标', value: 'axis', onclick: "_changeProperty('chartstooltip','" + this.idTrigger + "');"}]
        };
        if (tooltipProperty.trigger == "item") {
            option.options[0].checked = "checked";
        } else {
            option.options[1].checked = "checked";
        }
        triggerHtml = getRadioInputsHtml(option);

        var rtnHtml = [];
        rtnHtml.push('<div class="row">');
        rtnHtml.push(isShowHtml);
        if (tooltipProperty.isShow == "true") {
            rtnHtml.push('<div id="divChartTooltip" style="display:block">');
        } else {
            rtnHtml.push('<div id="divChartTooltip" style="display:none">');
        }
        rtnHtml.push(triggerHtml);
        rtnHtml.push('</div></div>');
        return rtnHtml.join("");
    }

    /*
     描述：保存属性到布局组上
     参数：无
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var chartTooltipProperty = $.parseJSON(decodeURIComponent($(componentObject).attr("chartstooltip")));
            if (currentPropertyID.indexOf(this.idIsShow) > -1) {
                chartTooltipProperty.isShow = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idTrigger) > -1) {
                chartTooltipProperty.trigger = $("#" + currentPropertyID + ":checked").val();
            }
            $(componentObject).attr("chartstooltip", encodeURIComponent(JSON.stringify(chartTooltipProperty)));
        }
    }
    /**
     描述：获取可编辑属性,
     参数：无
     返回值：如果组件已经设置可编辑属性则返回已设置的属性json对象，否则返回默认值。
     */
    this.getProperty = function () {
        var ret = "";
        var chartTooltipProperty = $(componentObject).attr("chartstooltip");
        if (chartTooltipProperty != undefined) {
            ret = $.parseJSON(decodeURIComponent(chartTooltipProperty));
        }
        else {
            ret = this.getDefaultProperty();
        }
        return ret;
    }
    this.getDefaultProperty = function () {
        var defaultProperty = {};
        //是否显示
        defaultProperty.isShow = "true";
        //触发类型
        defaultProperty.trigger = "item";

        $(componentObject).attr("chartstooltip", encodeURIComponent(JSON.stringify(defaultProperty)));
        return defaultProperty;
    }
}

/**
 * 图表Toolbox属性设置
 * @param componentObject
 * @constructor
 */
function ComponentChartToolboxOptions(componentObject) {
    this.idIsShow = "options_toolbox_isshow_" + getCurrentTime();
    this.idOrient = "options_toolbox_orient_" + getCurrentTime();
    this.idHorizonAlign = "options_toolbox_horizon_" + getCurrentTime();
    this.idVerticalAlign = "options_toolbox_vertical_" + getCurrentTime();

    this.idMark = "options_toolbox_toolbox_" + getCurrentTime();
    this.idDataview = "options_toolbox_dataview_" + getCurrentTime();
    this.idmagicType = "options_toolbox_magicType_" + getCurrentTime();
    this.idRestore = "options_toolbox_restore_" + getCurrentTime();
    this.idSaveAsImage = "options_toolbox_saveasimage_" + getCurrentTime();
    this.idDatazoom = "options_toolbox_datazoom_" + getCurrentTime();

    this.id = this.idIsShow + "," + this.idOrient + "," + this.idHorizonAlign + "," + this.idVerticalAlign + "," + this.idMark;//+","+this.idDataview+","+this.idmagicType+","+this.idRestore+","+this.idSaveAsImage+","+this.idDatazoom;

    this.getHtml = function () {
        var isShowHtml = '',
            orientHtml = '',
            horizontalAlignHtml = '',
            verticalAlignHtml = '',
            featureHtml = '',
//            markHtml = '',
//            zoomHtml = '',
//            dataViewHtml = '',
//            switchHtml = '',
//            restoreHtml='',
//            saveHtml = '';
            toolHtml = '';

        var toolboxProperty = this.getProperty();
        var option = {
            type: 'radio',
            name: '是否显示工具箱',
            id: this.idIsShow,
            options: [{
                text: '是',
                value: 'true',
                onclick: "$(\'#divChartToolbox\').show();_changeProperty('chartstoolbox','" + this.idIsShow + "');"
            }, {
                text: '否',
                value: 'false',
                onclick: "$(\'#divChartToolbox\').hide();_changeProperty('chartstoolbox','" + this.idIsShow + "');"
            }]
        };
        if (toolboxProperty.isShow == "true") {
            option.options[0].checked = "checked";
        } else {
            option.options[1].checked = "checked";
        }
        isShowHtml = getRadioInputsHtml(option);

        var option = {
            type: 'radio',
            name: '布局方式',
            id: this.idOrient,
            options: [{
                text: '水平',
                value: 'horizontal',
                onclick: "_changeProperty('chartstoolbox','" + this.idOrient + "');"
            }, {text: '垂直', value: 'vertical', onclick: "_changeProperty('chartstoolbox','" + this.idOrient + "');"}]
        };
        if (toolboxProperty.orient == "horizontal") {
            option.options[0].checked = "checked";
        } else {
            option.options[1].checked = "checked";
        }
        orientHtml = getRadioInputsHtml(option);

        option = {
            type: 'radio',
            name: '水平位置',
            id: this.idHorizonAlign,
            options: [{
                text: '左',
                value: 'left',
                onclick: "_changeProperty('chartstoolbox','" + this.idHorizonAlign + "');"
            }, {
                text: '中',
                value: 'center',
                onclick: "_changeProperty('chartstoolbox','" + this.idHorizonAlign + "');"
            }, {text: '右', value: 'right', onclick: "_changeProperty('chartstoolbox','" + this.idHorizonAlign + "');"}]
        };
        if (toolboxProperty.x == "left") {
            option.options[0].checked = "checked";
        } else if (toolboxProperty.x == "center") {
            option.options[1].checked = "checked";
        } else {
            option.options[2].checked = "checked";
        }
        horizontalAlignHtml = getRadioInputsHtml(option);

        option = {
            type: 'radio',
            name: '垂直位置',
            id: this.idVerticalAlign,
            options: [{
                text: '上',
                value: 'top',
                checked: 'checked',
                onclick: "_changeProperty('chartstoolbox','" + this.idVerticalAlign + "');"
            }, {
                text: '中',
                value: 'center',
                onclick: "_changeProperty('chartstoolbox','" + this.idVerticalAlign + "');"
            }, {
                text: '下',
                value: 'bottom',
                onclick: "_changeProperty('chartstoolbox','" + this.idVerticalAlign + "');"
            }]
        };
        if (toolboxProperty.y == "top") {
            option.options[0].checked = "checked";
        } else if (toolboxProperty.y == "center") {
            option.options[1].checked = "checked";
        } else {
            option.options[2].checked = "checked";
        }
        verticalAlignHtml = getRadioInputsHtml(option);
        option = {
            type: 'checkbox',
            name: '显示工具',
            id: this.idMark,
            options: [{
                text: '辅助线',
                value: 'mark',
                onclick: "_changeCheckBoxProperty('chartstoolbox','" + this.idMark + "','" + this.idMark + "',0);"
            }, {
                text: '框选区域缩放',
                value: 'datazoom',
                onclick: "_changeCheckBoxProperty('chartstoolbox','" + this.idDatazoom + "','" + this.idMark + "',1);"
            }, {
                text: '数据视图',
                value: 'dataview',
                onclick: "_changeCheckBoxProperty('chartstoolbox','" + this.idDataview + "','" + this.idMark + "',2);"
            }, {
                text: '动态类型切换',
                value: 'magictype',
                onclick: "_changeCheckBoxProperty('chartstoolbox','" + this.idmagicType + "','" + this.idMark + "',3);"
            }, {
                text: '还原',
                value: 'restore',
                onclick: "_changeCheckBoxProperty('chartstoolbox','" + this.idRestore + "','" + this.idMark + "',4);"
            }, {
                text: '保存图片',
                value: 'saveasimage',
                onclick: "_changeCheckBoxProperty('chartstoolbox','" + this.idSaveAsImage + "','" + this.idMark + "',5);"
            }]
        };
        if (toolboxProperty.mark == "true") {
            option.options[0].checked = "checked";
        }
        if (toolboxProperty.zoom == "true") {
            option.options[1].checked = "checked";
        }
        if (toolboxProperty.dataview == "true") {
            option.options[2].checked = "checked";
        }
        if (toolboxProperty.switch == "true") {
            option.options[3].checked = "checked";
        }
        if (toolboxProperty.restore == "true") {
            option.options[4].checked = "checked";
        }
        if (toolboxProperty.save == "true") {
            option.options[5].checked = "checked";
        }
        toolHtml = getRadioInputsHtml(option);

        var rtnHtml = [];
        rtnHtml.push('<div class="row">');
        rtnHtml.push(isShowHtml);
        if (toolboxProperty.isShow == "true") {
            rtnHtml.push('<div id="divChartToolbox" style="display:block">');
        } else {
            rtnHtml.push('<div id="divChartToolbox" style="display:none">');
        }
        rtnHtml.push(orientHtml);
        rtnHtml.push(horizontalAlignHtml);
        rtnHtml.push(verticalAlignHtml);
        rtnHtml.push(toolHtml);
        rtnHtml.push('</div></div>');
        return rtnHtml.join("");
    }

    /*
     描述：保存属性到布局组上
     参数：无
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var chartToolboxProperty = $.parseJSON(decodeURIComponent($(componentObject).attr("chartstoolbox")));
            if (currentPropertyID.indexOf(this.idIsShow) > -1) {
                chartToolboxProperty.isShow = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idOrient) > -1) {
                chartToolboxProperty.orient = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idHorizonAlign) > -1) {
                chartToolboxProperty.x = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idVerticalAlign) > -1) {
                chartToolboxProperty.y = $("#" + currentPropertyID + ":checked").val();
            } else if (currentPropertyID.indexOf(this.idMark) > -1) {
                var selectedValue = [];
                $("input:checkbox[name*='" + this.idMark + "']:checked").each(function () {
                    selectedValue.push($(this).val());
                });
                if (selectedValue.indexOf("mark") > -1) {
                    chartToolboxProperty.mark = "true";
                } else {
                    chartToolboxProperty.mark = "false";
                }
                if (selectedValue.indexOf("datazoom") > -1) {
                    chartToolboxProperty.zoom = "true";
                } else {
                    chartToolboxProperty.zoom = "false";
                }
                if (selectedValue.indexOf("dataview") > -1) {
                    chartToolboxProperty.dataview = "true";
                } else {
                    chartToolboxProperty.dataview = "false";
                }
                if (selectedValue.indexOf("magictype") > -1) {
                    chartToolboxProperty.switch = "true";
                } else {
                    chartToolboxProperty.switch = "false";
                }
                if (selectedValue.indexOf("restore") > -1) {
                    chartToolboxProperty.restore = "true";
                } else {
                    chartToolboxProperty.restore = "false";
                }
                if (selectedValue.indexOf("saveasimage") > -1) {
                    chartToolboxProperty.save = "true";
                } else {
                    chartToolboxProperty.save = "false";
                }
            }
            $(componentObject).attr("chartstoolbox", encodeURIComponent(JSON.stringify(chartToolboxProperty)));
        }
    }
    /**
     描述：获取可编辑属性,
     参数：无
     返回值：如果组件已经设置可编辑属性则返回已设置的属性json对象，否则返回默认值。
     */
    this.getProperty = function () {
        var ret = "";
        var chartTooltipProperty = $(componentObject).attr("chartstoolbox");
        if (chartTooltipProperty != undefined) {
            ret = $.parseJSON(decodeURIComponent(chartTooltipProperty));
        }
        else {
            ret = this.getDefaultProperty();
        }
        return ret;
    }
    this.getDefaultProperty = function () {
        var defaultProperty = {};
        defaultProperty.isShow = "true";
        defaultProperty.orient = "horizontal";
        defaultProperty.x = "right";
        defaultProperty.y = "top";
        defaultProperty.mark = "true";
        defaultProperty.zoom = "false";
        defaultProperty.dataview = "false";
        defaultProperty.switch = "true";
        defaultProperty.restore = "true";
        defaultProperty.save = "true";

        $(componentObject).attr("chartstoolbox", encodeURIComponent(JSON.stringify(defaultProperty)));
        return defaultProperty;
    }
}

function getRadioInputsHtml(option) {
    var html = [];
    html.push('<div class="col-lg-12">');//是否显示标题：&nbsp;&nbsp;')
    html.push(option.name);
    html.push("：&nbsp;&nbsp;");
    for (var i = 0; i < option.options.length; i++) {
        // html.push('<label style="cursor:pointer;">');
        html.push('<input name="');
        html.push(option.id);
        html.push('" id="');
        html.push(option.id);
        html.push('_');
        html.push(i);
        html.push('" type="');
        html.push(option.type);
        html.push('" value="');
        html.push(option.options[i]["value"]);
        html.push('"');
        if (option.options[i]["onclick"] != null) {
            html.push(' onclick="');
            html.push(option.options[i]["onclick"]);
            html.push('"');
        }
        if (option.options[i]["checked"] != null) {
            html.push(' checked="checked">');
        } else {
            html.push('>');
        }
        html.push('<span>');
        html.push(option.options[i]["text"]);
        html.push('&nbsp;&nbsp;&nbsp;&nbsp;</span>');
        //html.push('</label>');
    }
    html.push("</div>");
    return html.join("");
}


function _initEchartsComponent(name, param) {
    var PARAM = {
            optionsParamName: "chartoption",
            titleParamName: "chartstitle",
            legendParamName: "chartslegend",
            tooltipParamName: "chartstooltip",
            toolboxParamName: "chartstoolbox"
        },
        $component = tagComponent,
        chartoption = $component.attr(PARAM.optionsParamName);

    if (chartoption) {

        chartoption = JSON.parse(decodeURIComponent(chartoption));

        var filterOption = chartoption._type === "multi" ? chartoption.option[0] : chartoption;

        if (PARAM.titleParamName === name) {
            $.extend(filterOption.title, _filterParams(name, param));
        } else if (PARAM.legendParamName === name) {
            $.extend(filterOption.legend, _filterParams(name, param));
        } else if (PARAM.legendParamName === name) {
            $.extend(filterOption.legend, _filterParams(name, param));
        } else if (PARAM.tooltipParamName === name) {
            $.extend(filterOption.tooltip, _filterParams(name, param));
        } else if (PARAM.toolboxParamName === name) {
            $.extend(filterOption.toolbox, _filterParams(name, param));
        }

        $component.attr(PARAM.optionsParamName, encodeURIComponent(JSON.stringify(chartoption)));

        if (tagType === "imgConnect") {

            var jsonResult = {},
                imgCount = chartoption.imgCount,
                $multiChart = $component.find("div.showImg"),
                imgMap = [];

            jsonResult = _getAjaxResult(chartoption._uri);

            for (var i = 0; i < imgCount; i++) {
                var option = chartoption.option[i];
                option.xAxis[0].data = jsonResult[chartoption._xAxis] || [];
                var yAxisUrl = option.series[0]._uri;
                jsonResult = _getAjaxResult(yAxisUrl);

                option.series[0].data = jsonResult[option.series[0]._yAxis] || [];
                option.tooltip.formatter = function (params) {
                    var res = params[0].name;
                    res += '<br/>' + params[0].seriesName;
                    res += ' : ' + params[0].value;
                    return res;
                }

                var myChart = echarts.init($multiChart[i]);
                myChart.setOption(option);
                imgMap.push(myChart);
            }
            //设置关联
            for (var i = 0; i < imgMap.length; i++) {
                var tempImgMap = imgMap[i];
                var tempConnectMap = [];
                for (var j = 0; j < imgMap.length; j++) {
                    if (j != i) {
                        tempConnectMap.push(imgMap[j]);
                    }
                }
                tempImgMap.connect(tempConnectMap);
            }

        } else {
            var myChart = echarts.init($component.find('.showImg')[0]);
            myChart.setOption(chartoption);
        }


    }

    function _getAjaxResult(url) {
        var jsonResult = {};
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            cache: false,
            async: false,
            contentType: 'application/json; charset=UTF-8',
            success: function (json) {
                jsonResult = json;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("In startProcess : \n error:" + textStatus + "|errorThrown:" + errorThrown);
            }
        });
        return jsonResult;
    }


}
function _filterParams(name, params) {
    for (var param in params) {

        if (params[param] === "true") {
            params[param] = true;
        } else if (params[param] === "false") {
            params[param] = false;
        }

        if (param == "isShow") {
            params["show"] = params["isShow"];
            delete params.isShow;
        }

        if (param == "title") {
            params["text"] = params["title"];
            delete params.title;
        }

        if (param == "subtitle") {
            params["subtext"] = params["subtitle"];
            delete params.subtitle;
        }
    }

    if (name == "chartstoolbox") {
        params.feature = $.extend(true, {}, ChartsConfigProperty.DEFAULTS.options.toolbox.feature);
        params.feature.dataView.show = params.dataview;
        delete params.dataview;
        params.feature.dataZoom.show = params.zoom;
        delete params.zoom;
        params.feature.mark.show = params.mark;
        delete params.mark;
        params.feature.restore.show = params.restore;
        delete params.restore;
        params.feature.magicType.show = params.switch;
        delete params.switch;
        params.feature.saveAsImage.show = params.save;
        delete params.save;
    }

    return params;
}

function _changeProperty(attrStr, id) {
    var attrProperty = $.parseJSON(decodeURIComponent(tagComponent.attr(attrStr)));
    if (id.indexOf("options_title_isshow_") > -1) {
        attrProperty.isShow = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_title_horizon_") > -1) {
        attrProperty.x = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_title_vertical_") > -1) {
        attrProperty.y = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_legend_isshow_") > -1) {
        attrProperty.isShow = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_legend_orient_") > -1) {
        attrProperty.orient = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_legend_horizon_") > -1) {
        attrProperty.x = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_legend_vertical_") > -1) {
        attrProperty.y = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_tooltip_isshow_") > -1) {
        attrProperty.isShow = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_tooltip_trigger_") > -1) {
        attrProperty.trigger = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_toolbox_isshow_") > -1) {
        attrProperty.isShow = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_toolbox_orient_") > -1) {
        attrProperty.orient = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_toolbox_horizon_") > -1) {
        attrProperty.x = $("[name*=" + id + "]:checked").val();
    } else if (id.indexOf("options_toolbox_vertical_") > -1) {
        attrProperty.y = $("[name*=" + id + "]:checked").val();
    }
    tagComponent.attr(attrStr, encodeURIComponent(JSON.stringify(attrProperty)));

    _initEchartsComponent(attrStr, attrProperty);
}

function _changeCheckBoxProperty(attrStr, id, targetId, num) {
    ////  辅助线    框选区域缩放    数据视图    动态类型切换    还原    保存图片
    var attrProperty = $.parseJSON(decodeURIComponent(tagComponent.attr(attrStr)));
    if ($("[id*=" + targetId + "_" + num + "]").attr("checked") == undefined) {
        $("[id*=" + targetId + "_" + num + "]").attr("checked", "checked");
    } else {
        $("[id*=" + targetId + "_" + num + "]").removeAttr("checked");
    }
    if (id.indexOf("options_toolbox_toolbox_") > -1) {
        attrProperty.mark = $("[id*=" + targetId + "_" + num + "]").attr("checked") == undefined ? "false" : "true";
    } else if (id.indexOf("options_toolbox_datazoom_") > -1) {
        attrProperty.zoom = $("[id*=" + targetId + "_" + num + "]").attr("checked") == undefined ? "false" : "true";
    } else if (id.indexOf("options_toolbox_dataview_") > -1) {
        attrProperty.dataview = $("[id*=" + targetId + "_" + num + "]").attr("checked") == undefined ? "false" : "true";
    } else if (id.indexOf("options_toolbox_magicType_") > -1) {
        attrProperty.switch = $("[id*=" + targetId + "_" + num + "]").attr("checked") == undefined ? "false" : "true";
    } else if (id.indexOf("options_toolbox_restore_") > -1) {
        attrProperty.restore = $("[id*=" + targetId + "_" + num + "]").attr("checked") == undefined ? "false" : "true";
    } else if (id.indexOf("options_toolbox_saveasimage_") > -1) {
        attrProperty.save = $("[id*=" + targetId + "_" + num + "]").attr("checked") == undefined ? "false" : "true";
    }
    tagComponent.attr(attrStr, encodeURIComponent(JSON.stringify(attrProperty)));
    _initEchartsComponent(attrStr, attrProperty);
}
/**
 * 路标导航节点属性配置
 * @param componentObject
 * @constructor
 */
function WaypointSettingProperty(componentObject) {
    this.configId = "waypointSettingProperty" + getCurrentTime();
    this.targetId = "waypoint_targetId";
    this.name = "waypoint_name";
    this.icon = "waypoint_icon";
    this.status = "waypoint_status";
    this.initStatusIcon = "waypoint_initStatusIcon";
    this.saveStatusIcon = "waypoint_saveStatusIcon";
    this.buttonId = "waypoint_button_" + getCurrentTime();
    this.id = this.configId + "," + this.targetId + "," + this.name
        + "," + this.icon + "," + this.status + ","
        + this.initStatusIcon + "," + this.saveStatusIcon;
    this.node = {
        targetId: this.targetId, name: this.name, icon: this.icon, status: this.status,
        initStatusIcon: this.initStatusIcon, saveStatusIcon: this.saveStatusIcon
    };

    this.getHtml = function () {
        var html = [];
        html.push("<table id=\"tableWaypointConfig\" class=\"table table-bordered\" style=\"margin:0px\">");
        html.push("<tr><td><input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.targetId + "\" placeholder=\"目标ID\" /></td></tr>");
        html.push("<tr><td><input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.name + "\" placeholder=\"路标名称\" /></td></tr>");
        html.push("<tr><td><input type=\"number\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.status + "\" placeholder=\"默认状态\"/></td></tr>");
        html.push("<tr><td><input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.icon + "\" placeholder=\"图标路径\" /></td></tr>");
        html.push("<tr><td><input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.initStatusIcon + "\" placeholder=\"未编辑状态图标路径\" /></td></tr>");
        html.push("<tr><td><input type=\"text\" class=\"form-textbox form-textbox-text col-md-12\" id=\"" + this.saveStatusIcon + "\" placeholder=\"已编辑状态图标路径\" /></td></tr>");
        html.push("<tr><td style=\"text-align: right\"><button type=\"button\" class=\"btn btn-primary btn-sm\" id=\"" + this.buttonId + "\" node=\"" + encodeURIComponent(JSON.stringify(this.node)) + "\" onclick ='WaypointSettingProperty.addConfig(this,\"" + $(componentObject).attr("compid") + "\",\"" + this.configId + "\")'>添加</button></td></tr>");
        html.push("</table>");
        html.push("<textarea id=\"" + this.configId + "\" class=\"form-textbox form-textbox-text col-md-12\"  style=\"height:150px\">" + this.getProperty() + "</textarea>");
        return html.join(" ");
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type === "focusout" && currentPropertyID === this.configId) {
            var dataSetting = $("#" + currentPropertyID).val();
            if (dataSetting) {
                $(componentObject).attr("waypointsetting", encodeURIComponent(dataSetting));
                initWaypoint($(componentObject).attr("compid"));
            } else {
                $(componentObject).removeAttr("waypointsetting");
            }
        }
    }
    this.getProperty = function () {
        var setting = $(componentObject).attr("waypointsetting");
        if (setting) {
            return escape2Html(decodeURIComponent($(componentObject).attr("waypointsetting")));
        } else {
            return JSON.stringify(this.defaultData);
        }
    }
    this.defaultData = [
        {
            targetId: "step1",
            name: "step1",
            icon: "",
            status: 0,
            initStatusIcon: "img/waypoint/process.png",
            saveStatusIcon: "img/waypoint/process-grey.png"
        },
        {
            targetId: "step2",
            name: "step2",
            icon: "",
            status: 0,
            initStatusIcon: "img/waypoint/user-grey.png",
            saveStatusIcon: "img/waypoint/user.png"
        },
        {
            targetId: "step3",
            name: "step3",
            icon: "",
            status: 0,
            initStatusIcon: "img/waypoint/user-grey.png",
            saveStatusIcon: "img/waypoint/user.png"
        }
    ]
}
/**
 *  添加配置
 * @param node
 * @param compid
 * @param configId
 */
WaypointSettingProperty.addConfig = function (object, compid, configId) {
    /**
     * 获取对象输入值
     */
    var setting = WaypointSettingProperty.getSetting(compid);
    var nodeObject = $.parseJSON(decodeURIComponent($(object).attr("node")));
    for (var index in nodeObject) {
        nodeObject[index] = $("#" + nodeObject[index]).val();
    }

    /**
     * 输入验证
     */
    if (nodeObject.targetId === "") {
        bootbox.alert("目标ID不能为空！");
        return;
    }

    if (nodeObject.name === "") {
        bootbox.alert("路标名称不能为空！");
        return;
    }

    setting.push(nodeObject);
    /**
     *
     * 格式化
     * @type {string}
     */
    var formatedSetting = "[";
    $.each(setting, function (index, item) {
        if (index > 0) {
            formatedSetting += ",";
        }
        formatedSetting += "\n" + JSON.stringify(item);
    })
    formatedSetting += "]";

    $("#" + configId).val(formatedSetting).trigger("focusout");
}
/**
 * 获取配置
 */
WaypointSettingProperty.getSetting = function (compid) {
    var component = $("[compid=" + compid + "]");
    var setting = component.attr("waypointsetting");
    if (setting) {
        return $.parseJSON(escape2Html(decodeURIComponent(component.attr("waypointsetting"))));
    }
    return [];
}
/**
 * 输入配置验证
 * @param node
 * @returns {boolean}
 */
WaypointSettingProperty.initValidate = function (node) {
    if (!node) {
        return false;
    }
    var nodeObject = $.parseJSON(decodeURIComponent(node));
    var fields = {};
    fields[nodeObject.targetId] = {
        validators: {
            notEmpty: {
                message: '该字段必填且不能为空'
            },
            regexp: {
                regexp: /^[a-zA-Z0-9_.]+$/,
                message: '该字段只能是字母、整数、点和下划线'
            }
        }
    }
    fields[nodeObject.name] = {
        validators: {
            notEmpty: {
                message: '该字段必填且不能为空'
            },
            regexp: {
                regexp: /^[a-zA-Z0-9_.]+$/,
                message: '该字段只能是字母、整数、点和下划线'
            }
        }
    }
    fields[nodeObject.status] = {
        validators: {
            notEmpty: {
                message: '该字段必填且不能为空'
            },
            regexp: {
                regexp: /^[-0-9]+$/,
                message: '该字段只能是整数'
            }
        }
    }
    $('#tableWaypointConfig').bootstrapValidator({fields: fields});
}

/**
 * 输入验证
 * @returns {boolean}
 */
WaypointSettingProperty.validate = function () {
    $("#tableWaypointConfig").data('bootstrapValidator').resetForm();
    $("#tableWaypointConfig").bootstrapValidator('validate');
    if ($("#tableWaypointConfig").data('bootstrapValidator').isValid()) {
        $("#tableWaypointConfig").data('bootstrapValidator').resetForm();
        return true;
    }
    return false;
}


/**
 * 区域组件ID字段绑定
 * @param componentObject
 * @constructor
 */
function ChineseRegionBindFieldIDProperty(componentObject) {
    this.id = "chinese-region-bind-id" + getCurrentTime();
    this.txtChineseRegionId = $(componentObject).find("input:eq(0)");

    this.getHtml = function () {
        var html = [];
        html.push('<select class="form-textbox form-combo col-md-12" id="'+this.id+'">');
        html.push(bindField2(componentObject,this.getProperty()));
        html.push("</select>")
        return html.join(' ');
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var field = $("#" + currentPropertyID).val();
            if (field !== "") {
                this.txtChineseRegionId.attr("field", field)
                    .attr("ms-duplex", field);
            } else {
                this.txtChineseRegionId.removeAttr("field")
                    .removeAttr("ms-duplex")
            }
        }
    }
    this.getProperty = function () {
        return this.txtChineseRegionId.attr("field");
    }
}
/**
 * 区域组件名称字段绑定
 * @param componentObject
 * @constructor
 */
function ChineseRegionBindFieldNameProperty(componentObject) {
    this.id = "chinese-region-bind-Name" + getCurrentTime();
    this.txtChineseRegionId = $(componentObject).find("input:eq(1)");

    this.getHtml = function () {
        var html = [];
        html.push('<select class="form-textbox form-combo col-md-12" id="'+this.id+'">');
        html.push(bindField2(componentObject,this.getProperty()));
        html.push("</select>")
        return html.join(' ');
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var field = $("#" + currentPropertyID).val();
            if (field !== "") {
                this.txtChineseRegionId.attr("field", field).attr("ms-duplex", field);
            } else {
                this.txtChineseRegionId.removeAttr("field").removeAttr("ms-duplex");
            }
        }
    }
    this.getProperty = function () {
        return this.txtChineseRegionId.attr("field");
    }
}

/**
 * 区域组件名称字段绑定
 * @param componentObject
 * @constructor
 */
function ImageBindSrcFieldProperty(componentObject) {
    this.id = "image" + getCurrentTime();
    this.img = $(componentObject).find("img");

    this.getHtml = function () {
        var html = [];
        html.push('<select class="form-textbox form-combo col-md-12" id="'+this.id+'">');
        html.push(bindField2(componentObject,this.getProperty()));
        html.push("</select>")
        return html.join(' ');
    }
    this.setProperty = function (event, currentPropertyID) {
        if (event.type == "change") {
            var field = $("#" + currentPropertyID).val();
            if (field !== "") {
                this.img.attr("field", field).attr("srcfield",field);
                $(this.img).parent().attr("field", field).attr("srcfield",field);

            } else {
                this.img.removeAttr("srcfield").removeAttr("field");
                $(this.img).parent().removeAttr("srcfield").removeAttr("field");
            }
        }
    }
    this.getProperty = function () {
        return this.img.attr("srcfield");
    }
}

/*
 描述：除布局组件、标签、按钮、表格外需要增加事件支持，
 事件类型由下拉框选择，下拉框下面增加输入框，输入事件处理内容。
 作者：xjl
 */
function ProductListPaginationProperty(componentObject) {
    //事件选择容器ID
    this.isPagingCompId = "is_paging_comp_id_" + getCurrentTime();
    //事件函数内容ID
    this.pageSizeCompId = "page_size_comp_id" + getCurrentTime();
    //组件属性ID
    this.id = this.isPagingCompId + "," + this.pageSizeCompId;

    /*
     描述：返回属性配置面板html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        var html = [];
        var params = this.getProperty();
        html.push('<form class="form-horizontal">');

        html.push('<div class="form-group">');
        html.push("<label for=\"" + this.isPagingCompId + "\" class=\"col-sm-4 control-label\">是否分页</label>");
        html.push('<div class="col-sm-8">');
        html.push("<select id=\"" + this.isPagingCompId + "\" class=\"form-textbox form-textbox-text col-md-12\" >");
        html.push(this.getIsPagingOptions(params.pagination.isPaging));
        html.push("</select>");
        html.push("</div>");
        html.push("</div>");

        html.push('<div class="form-group">');
        html.push('<label for=' + this.pageSizeCompId + ' class="col-sm-4 control-label">每页条数</label>');
        html.push('<div class="col-sm-8">');
        html.push("<select id=\"" + this.pageSizeCompId + "\" class=\"form-textbox form-textbox-text col-md-12\" >");
        html.push(this.getPageSizeOptions(params.pagination.pageSize));
        html.push("</div>");
        html.push("</div>");

        html.push("</div>");
        return html.join(" ");
    }

    this.getIsPagingOptions = function(selectedValue) {
        var options = [];
        if (selectedValue) {
            options.push("<option value='true' selected >分页</option>");
            options.push("<option value='false' >不分页</option>");
        } else {
            options.push("<option value='true'  >分页</option>");
            options.push("<option value='false' selected >不分页</option>");
        }

        return options.join(" ");
    }

    this.getPageSizeOptions = function(selectedValue) {
        var options = [];
        for (var i = 1; i <= 10; i++) {
            if ((i + 1) % 2 === 0 && i !== 1) {
                continue;
            }

            var size = i * 5, selected = "";
            if (size === selectedValue) {
                selected = " selected";
            }
            options.push("<option value='" + size + "' " + selected + ">" + size + "</option>")
        }

        return options.join(" ");
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type !== "change") {
            return;
        }

        var params = this.getProperty();
        if (currentPropertyID === this.isPagingCompId) {
            var isPaging = true;
            if ($("#" + currentPropertyID).val() === "false") {
                isPaging = false;
            }
            params.pagination.isPaging = isPaging;
        } else if (currentPropertyID === this.pageSizeCompId) {
            params.pagination.pageSize = $("#" + currentPropertyID).val();
        }

        $(componentObject).attr("data-params", encodeURIComponent(JSON.stringify(params)));
    }
    /*
     描述：获取组件events属性
     参数：无
     返回值：json
     */
    this.getProperty = function () {
        var params = JSON.parse(decodeURIComponent($(componentObject).attr("data-params") || '{}')),
            isEmpty = false;

        if (!params.pagination) {
            params.pagination = {};
            isEmpty = true;
        }

        if (!params.pagination.isPaging) {
            params.pagination.isPaging = false;
        }

        if (!params.pagination.pageSize) {
            params.pagination.pageSize = 5;
        }
        /**
         * 如果参数为空，设置默认值.
         */
        if (isEmpty) {
            $(componentObject).attr("data-params", encodeURIComponent(JSON.stringify(params)));
        }

        return params;
    }

}

function ExtendFieldsSelectProperty(componentObject) {
    //组件属性ID
    this.id = "extend-field-select-"+getCurrentTime();

    /*
     描述：返回属性配置面板html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        var html = [];
        var params = this.getProperty();
        html.push('<div type="extend-field-select" style="height:100px;overflow:auto">');
        var vmDataFieldsManage = new VMDataFieldsManage(componentObject);
        if (vmDataFieldsManage.isSetVMURI()) {
            var dataColumns = vmDataFieldsManage.getVMAllFlagFields("field");
            for (var i in dataColumns) {
                var checked = "";
                if (!$.isEmptyObject(params) &&
                    $.inArray(dataColumns[i].columnName, params.columns) > -1) {
                    checked = "checked";
                }

                html.push('<label style="cursor:pointer;"><input id="' + this.id + '" type="checkbox" value="' + dataColumns[i].columnName + '" ' + checked + ' />'
                    + dataColumns[i].columnName + '</label>');
            }
        }

        html.push('</div>')
        return html.join(" ");
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        if (event.type !== "change") {
            return;
        }

        var dataColumns = this.getProperty();
        var columnName = $(event.target).val();
        if ($.isEmptyObject(dataColumns)) {
            dataColumns.columns = [];
        }

        if ($.inArray(columnName, dataColumns) === -1) {
            dataColumns.columns.push(columnName);
            $(componentObject).attr("data-columns", encodeURIComponent(JSON.stringify(dataColumns)));
        }
    }
    /*
     描述：获取组件events属性
     参数：无
     返回值：json
     */
    this.getProperty = function () {
        return JSON.parse(decodeURIComponent($(componentObject).attr("data-columns") || '{}'));
    }
}

function ToolbarOptionsProperty(componentObject) {

    //无组件id，事件注册不由框架管理，采用自行注册方式。

    /*
     描述：返回工具栏html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        var toolbar = new ToolBarOptionsProp(componentObject);
        return toolbar.getHtml();
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
    }
}

function ToolbarActiveProperty(componentObject) {

    //无组件id，事件注册不由框架管理，采用自行注册方式。

    /*
     描述：返回工具栏html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        var toolbar = new ToolbarActiveProp(componentObject);
        return toolbar.getHtml();
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
    }
}

/**
 * 布局器显示比例配置
 * @param componentObject
 * @constructor
 */
function LayoutRatioProperty(componentObject) {
    this.ratioProp = new LayoutRatioProp(componentObject);
    this.id = this.ratioProp.id;

    //无组件id，事件注册不由框架管理，采用自行注册方式。

    /*
     描述：返回工具栏html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        return this.ratioProp.getHtml();
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        this.ratioProp.setProperty(event, currentPropertyID);
    }
}

/**
 * 布局器显示比例配置
 * @param componentObject
 * @constructor
 */
function LayoutURIProperty(componentObject) {
    this.uriProp = new LayoutDataSourceProp(componentObject);
    this.id = this.uriProp.id;

    //无组件id，事件注册不由框架管理，采用自行注册方式。

    /*
     描述：返回工具栏html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        return this.uriProp.getHtml();
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
        this.uriProp.setProperty(event, currentPropertyID);
    }
}

/**
 * 布局器显示比例配置
 * @param componentObject
 * @constructor
 */
function ButtonOperationBindProperty(componentObject) {
    this.btnProp = new ButtonOperationBindProp(componentObject);

     /*
     描述：返回工具栏html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        return this.btnProp.getHtml();
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
    }
}

function TabToolbarOptionsProperty(componentObject) {

    //无组件id，事件注册不由框架管理，采用自行注册方式。

    /*
     描述：返回工具栏html
     参数：无
     返回值：无
     */
    this.getHtml = function () {
        var toolbar = new TabToolBarOptionsProp(componentObject);
        return toolbar.getHtml();
    }

    /*
     描述：保存URI属性到布局组上
     参数：currentPropertyID:当前属性的ID编号
     返回值：无
     */
    this.setProperty = function (event, currentPropertyID) {
    }
}

;(function($, win){
    win.DesignerPropDefine = function () {
    }

})(jQuery, window);






