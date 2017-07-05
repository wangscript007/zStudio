/**
 * Created by 10112872 on 2016/10/20.
 */

(function($, win) {
    var FUNCTION_NEW = "new";
    var FUNCTION_EDIT = "edit";
    var FUNCTION_EXPORT = "export";
    var FUNCTION_PROJECT = "project";
	var FUNCTION_BACK = "back";
	var FUNCTION_SERVICE_ONLINE = "service_online";
	var FUNCTION_HELP_ONLINE = "help_online";

    var UIManager = function() {
        this.westLayoutConfig = {
            marginLeft : 191,   //body 初使右边距
            marginRight : 300,  //body 初始右边距
            eastWidth : 300,    //右侧布局器默认宽度
            westWidth : 180,    //左侧布局器宽度
            eastSplitLeft : 0,
            isResize : false
        };
    };

    UIManager.prototype.init = function(disabledFunctions) {
        this._initWestLayout();
        this.$componentPanel    = $("#zstudio-component");
        this.$eastTabs          = $("#zstudio-east-tabs");
        this.$controlPanel      = $("#zstudio-control-panel");


        this.setControlPanelContent();
        this._initDesignPanel();
        this._registerButtonActions(disabledFunctions);
    };

    /**
     * @public
     */
    UIManager.prototype.getComponentPanel = function() {
        return this.$componentPanel;
    };

    /**
     * @public
     */
    UIManager.prototype.setComponentPanelContent = function(html) {
        this.$componentPanel.html("").append(html);
    };

    /**
     * @public
     */
    UIManager.prototype.addEastTab = function(tabs) {
        tabs = tabs || [];
        if (!_.isArray(tabs)) {
            return;
        }

        var that = this;
        tabs.forEach(function (tab) {
            var tabHeadHtml = '<li>' +
                '<a href="javascript:void(0)" class="tabs-inner" style="height: 25px; line-height: 25px;">' +
                '<span class="tabs-title">' + tab.title + '</span>' +
                '</a>' +
                '</li>';
            tabHeadHtml = $(tabHeadHtml);

            var tabPanel = $('<div class="panel hide height100">');
            tabPanel.append(tab.panel);

            tabHeadHtml.data("tab-panel-target", tabPanel);

            //右侧面板上tab的点击切换事件
            tabHeadHtml.click(function(){
                $(this).addClass("tabs-selected");
                $(this).siblings().removeClass("tabs-selected");
                var panel = $(this).data("tab-panel-target");
                $(panel).removeClass("hide");
                $(panel).siblings().addClass("hide");
            });

            that.$eastTabs.find("ul.tabs").append(tabHeadHtml);
            that.$eastTabs.find("div.tabs-panels").append(tabPanel);
            tabPanel.mCustomScrollbar({theme: 'light'});    // 给tabPanel增加滚动条
        });

        //默认选中第一个tab
        this.$eastTabs.find("ul.tabs>li:first").trigger("click");
    };

    /**
     * @public
     */
    UIManager.prototype.removeAllEastTab = function() {
        this.$eastTabs.find("ul.tabs").html("");
        this.$eastTabs.find("div.tabs-panels").html("");
    };

    /**
     * @public
     */
    UIManager.prototype.setControlPanelContent = function (html) {
        html = html || '<div class="alert alert-info" role="alert" style="margin:10px 10px; text-align:center;">选中组件后，拖拽组件的设置项到此处</div>';

        this.$controlPanel.html("").append(html);
    };
	
	UIManager.prototype.disableBtnSave = function() {
		$("#btn-save").attr('disabled', 'true');
	};
	
	UIManager.prototype.disableBtnPreview = function() {
		$("#btn-preview").attr('disabled', 'true');
	};

    /**
     * @private
     */
    UIManager.prototype._initDesignPanel = function () {
        $('.demo').mCustomScrollbar({
            theme: '3d-dark',
            // 设置设计区域滚动条始终可见，以解决加载设计文件后，因为动态出现滚动条导致的chart宽度超过可见区域的bug
            alwaysShowScrollbar: 1
        });
    };

    /**
     * @private
     */
    UIManager.prototype._initWestLayout = function() {
        // 显示组件面板
        var that = this;
        $(".form-layout-expand-west").click(function () {
            if ($(".form-layout-west").is(":hidden")) {
                that._showWestLayout();
            } else {
                that._hideWestLayout();
            }
        });

        //左侧菜单栏布局拖动效果
        $(".form-layout-west").resizable({
            handles: "e",
            animateDuration: "fast",
            maxWidth: 340,
            minWidth: 180
            //ghost:true
        }).resize(function (event, ui) {
            that.westLayoutConfig.marginLeft = that.westLayoutConfig.marginLeft + (ui.size.width - that.westLayoutConfig.westWidth);
            $("body").css("margin-left", that.westLayoutConfig.marginLeft);
            that.westLayoutConfig.westWidth = ui.size.width;
            $(".form-layout-expand-west").css("left", that.westLayoutConfig.marginLeft - 10);
        });
    };

    /**
     * 显示左侧布局面板
     * @private
     */
    UIManager.prototype._showWestLayout = function() {
        $("body").removeClass("devpreview sourcepreview");
        $("body").css("margin-left", this.westLayoutConfig.marginLeft);
        $(".form-layout-west").show({
            complete: function () {
                workbench.worksetManager.onDesignViewResized();
            }
        });
        $(".form-layout-expand-west").css("left", this.westLayoutConfig.marginLeft - 10);
    };

    /**
     * 隐藏左侧布局面板
     * @private
     */
    UIManager.prototype._hideWestLayout = function() {
        $(".form-layout-expand-west").css("left", 0);
        $("body").css("margin-left", 10);
        $(".form-layout-west").hide({
            complete: function () {
                workbench.worksetManager.onDesignViewResized();
            }
        });
    };

    // 新建
    UIManager.prototype._registerButtonClickAction_New = function(disabled) {
        if (disabled) {
            $("#new").remove();
            return;
        } else {
			$("#new").show();
		}

        $("#new").click(function () {
            showProjectModal(ProjectManagerUI.OPERATOR_ADD, ProjectManagerUI.MODULE_TYPE_DESIGNFILE);
        });
    };

    // 打开
    UIManager.prototype._registerButtonClickAction_Edit = function(disabled) {
        if (disabled) {
            $("#edit").remove();
            return;
        } else {
			$("#edit").show();
		}

        $("#edit").click(function() {
            showOpenFrameDialog();
        });

        $("#frameFileTable").on("dbl-click-row.bs.table",function(event,row,$element){
            $(this).bootstrapTable("check",$element.data("index"));
            $("#confirmFrameBtn").trigger("click");
        })

        //编辑对话框确定按钮事件
        $("#confirmFrameBtn").click(function() {
            var rows = getTableSelectData("frameFileTable");
            if (rows.length == 0) {
                bootbox.alert("表格行数据没有被选中。");
            } else {
                window.workbench.projectManager.loadProjectFile(rows[0]["projectName"], rows[0]["fullInfo"]);
                hideModalDialog("openFrameDialog");
            }
        });
    };

    // 保存
    UIManager.prototype._registerButtonClickAction_Save = function() {
		$("#btn-save").show();
		
        //保存数据绑定
        $("#btn-save").click(function() {
            window.workbench.projectManager.saveFile();
        });
    };

    // 工程管理
    UIManager.prototype._registerButtonClickAction_Project = function(disabled) {
        if (disabled) {
            $("#project").remove();
            return;
        } else {
			$("#project").show();
		}

        $("#project").click(function() {
            if (window.workbench.projectManager.isEditingFile()) {
                window.workbench.projectManager.saveFile(false);
            }

            showProjectModal();
        });
    };

    UIManager.prototype._registerButtonClickAction_Export = function(disabled) {
        if (disabled) {
            $("#export").remove();
            return;
        } else {
			$("#export").show();
		}

        //导出功能实现
        $("#export_war").bind('click', function() {
            if($(this).is(':checked') == true) {
                $("#export_contain_orm").removeAttr('disabled','false');
                $("#export_contain_designer").removeAttr('disabled','false');
            }
            else {
                $("#export_contain_orm").attr('checked', false);
                $("#export_contain_designer").attr('checked', false);
                $("#export_contain_orm").attr('disabled','true');
                $("#export_contain_designer").attr('disabled','true');
            }
        });

        $("#btnExportConfirm").bind('click', function() {
            if($('#txtExportName').val().trim() == "") {
                bootbox.alert("请输入导出名称。");
                return;
            }

            if(!$('#export_frame').is(':checked') && !$('#export_war').is(':checked')) {
                bootbox.alert("请选择导出页面文件或者设计文件选项。");
                return;
            }

            $.ajax({
                    async: false,
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify({name:$('#txtExportName').val(),
                        isFrameFile:$('#export_frame').is(':checked'),
                        isWar:$('#export_war').is(':checked'),
                        isContainOrm:$('#export_contain_orm').is(':checked')
                    }),
                    url: 'jersey-services/layoutit/frame/export',
                    contentType :'application/json; charset=UTF-8',
                    success: function (data) {
                        window.location=data.path;
                        $('#export').modal('hide');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error("请求服务[" + ajaxParameter.url + "]错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
                    }
                }
            );
        });
    };

    UIManager.prototype._registerButtonClickAction_Preview = function() {
		$("#btn-preview").show();
		
        //预览时先保存当前文件然后发布一次工程，最后生成预览界面。
        $("#btn-preview").click(function() {
            window.workbench.projectManager.saveFile(false);

            var param = new AjaxParameter();
            param.url = "jersey-services/layoutit/frame/project/publish/" + window.workbench.projectManager.getCurrentProject();
            dsTool.saveData(param);
        });
    };
	
	UIManager.prototype._registerButtonClickAction_Back = function(disabled) {
		if (disabled) {
            $("#btn-back").remove();
            return;
        } else {
			$("#btn-back").show();
		}
		
		/**
		 * 返回设计平台
		 * 在云平台模式下,用户可以从表单设计器返回到云平台页面下。	 
		 */
		$("#btn-back").click(function() {
			var url = "/workbench/index.html",
				appId = getUrlParam("appid", location.search);
			if (appId) {
				url += "?appid=" + appId;
			}

			window.close();
			window.open(url, "应用管理");
				
			/*
			if (isFormDataChanged()) {
				bootbox.confirm("页面内容已修改，要保存吗？", function(result) {
					if (result) {
						save("");
					}

					window.close();
					window.open(url, "应用管理");
				});
			} else {
				window.close();
				window.open(url, "应用管理");
			}
			
			*/
		});
    };
	
	UIManager.prototype._registerButtonClickAction_ServiceOnline = function(disabled) {
		if (disabled) {
            $("#serviceOnline").remove();
            return;
        } else {
			$("#serviceOnline").show();
		}
		
		$("#serviceOnline").attr("href", "http://"+window.location.hostname+"/client/service.html");
	};
	
	UIManager.prototype._registerButtonClickAction_HelpOnline = function(disabled) {
		if (disabled) {
            $("#helpOnline").remove();
            return;
        } else {
			$("#helpOnline").show();
		}
		
		$("#helpOnline").attr("href", "http://"+window.location.hostname+"/client/help.html");
	};

    UIManager.prototype._registerButtonActions = function(disabledFunctions) {
        this._registerButtonClickAction_New(disabledFunctions.indexOf(FUNCTION_NEW) > -1);
        this._registerButtonClickAction_Edit(disabledFunctions.indexOf(FUNCTION_EDIT) > -1);
        this._registerButtonClickAction_Save();
        this._registerButtonClickAction_Export(disabledFunctions.indexOf(FUNCTION_EXPORT) > -1);
        this._registerButtonClickAction_Preview();
        this._registerButtonClickAction_Project(disabledFunctions.indexOf(FUNCTION_PROJECT) > -1);
		this._registerButtonClickAction_Back(disabledFunctions.indexOf(FUNCTION_BACK) > -1);
		this._registerButtonClickAction_ServiceOnline(disabledFunctions.indexOf(FUNCTION_SERVICE_ONLINE) > -1);
		this._registerButtonClickAction_HelpOnline(disabledFunctions.indexOf(FUNCTION_HELP_ONLINE) > -1);
    };

    win.workbench = win.workbench || {};
    win.workbench.ui = win.workbench.ui || {};
    win.workbench.ui.UIManager = win.workbench.ui.UIManager || new UIManager();
}(jQuery, window));