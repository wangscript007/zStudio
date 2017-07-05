function showProjectModal(operator, moduleType) {
    var currentProject = window.workbench.projectManager.getCurrentProject();
	var src = "html/project.html?fileName=" + getCurrentTime() + "&projectName=" + currentProject;
	if (operator != undefined) {
		src += "&operator=" + operator;
	}
	if (moduleType != undefined) {
		src += "&moduleType=" + moduleType;
	}
	$("[name=projectFrame]").attr("src",src);
	$("#projectModal").modal('show');
}

function showOpenFrameDialog(){
	//refreshTable("frameFileTable",{url:"jersey-services/layoutit/frame/files/info"});
    bootstrapTable('frameFileTable', {
        "method": "get",
		"contentType":"application/json; charset=UTF-8",
        "url": "jersey-services/layoutit/frame/files/info?"+getCurrentTime(),
        "cache": false,
        "pagination": false,
        "pageList": [
            10,
            20,
            50,
            100,
            200
        ],
        "height": 500,
        "search": true,
        "showColumns": false,
        "showRefresh": false,
        "sidePagination": "server",
        "sortable": true,
        "clickToSelect": false,
        "advancedSearch": false,
        "searchcondition": [],
        "idTable": "frameFileTable",
        "defaultcondition": [],
        "pk": [],
        "editable": true,
        "columns": [
            {
                "field": "state",
                "radio": true
            },
            {
                "title": "文件名",
                "field": "fileName",
                "editable": false,
                "validate": "",
                "align": "left",
                "halign": "left",
                "valign": "middle",
                "primarykey": false,
                "visible": true,
                "formatter": "",
                "tableId": "table_base1446108470399",
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
            },
			{
				"title": "类型",
				"field": "fileType",
				"editable": false,
				"validate": "",
				"align": "left",
				"halign": "left",
				"valign": "middle",
				"primarykey": false,
				"visible": true,
				"formatter": "",
				"tableId": "table_base1446108470399",
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
			},
			{
				"title": "组件名",
				"field": "componentName",
				"editable": false,
				"validate": "",
				"align": "left",
				"halign": "left",
				"valign": "middle",
				"primarykey": false,
				"visible": true,
				"formatter": "",
				"tableId": "table_base1446108470399",
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
			},
            {
                "title": "工程名称",
                "field": "projectName",
                "editable": false,
                "validate": "",
                "align": "left",
                "halign": "left",
                "valign": "middle",
                "primarykey": false,
                "visible": true,
                "formatter": "",
                "tableId": "table_base1446108470399",
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
            },
            {
                "title": "文件生成路径",
                "field": "filePath",
                "editable": false,
                "validate": "",
                "align": "left",
                "halign": "left",
                "valign": "middle",
                "primarykey": false,
                "visible": true,
                "formatter": "",
                "tableId": "table_base1446108470399",
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
            },
            {
                "title": "最后修改时间",
                "field": "modifyTime",
                "editable": false,
                "validate": "",
                "align": "left",
                "halign": "left",
                "valign": "middle",
                "primarykey": false,
                "visible": true,
                "formatter": "",
                "tableId": "table_base1446108470399",
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
            }
        ]
    });
    //调整表格宽度为462，不然会导致无法对齐
    $("#openFrameDialog").find(".fixed-table-body").css({height: "462px"});
    $("#openFrameDialog").modal('show');
}

function selectProjectFile(){
	var param=new AjaxParameter();
	param.url="jersey-services/layoutit/frame/files/info";
	param.callBack=function(data) {
		if (data && data.rows && data.rows.length > 0) {
			showOpenFrameDialog();
		} else {
			showProjectModal(ProjectManagerUI.OPERATOR_ADD, ProjectManagerUI.MODULE_TYPE_DESIGNFILE);
		}
	}
	dsTool.getData(param);
}



