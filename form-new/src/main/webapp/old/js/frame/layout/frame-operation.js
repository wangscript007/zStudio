/**
 * 当前打开的工程
 */
var currentProject = "default";
/**
 * 国际化语言定义
 * @type {string}
 */
var i18nLanguage = "zh";
/**
 * 国际化文件名字
 * @type {string}
 */
var i18nFileName = "";
/**
 * 当前工程国际化数据
 */
var isI18n ="";
/**
 * 当前工程国际化路径
 * @type {string}
 */
var i18npath = "";
/**
 * 当前工程的发布路径
 * @type {string}
 */
var currentProjectLocalPath = "";
/**
* 当前打开的文件（包括路径）
* */
var currentFile = "";
/*
* 当前打开的文件名称
* */
var currentFileName = "";
/**
 * 预览路径
 * */
var previewPath = "";
/**
 * 页面是否已加载，如果页面是第一次加载，则判断地址栏中是否包含文件名信息，如果有则从地址栏中获取。
 * 加载完成后此标志改为true,此后文件信息从打开的文件列表中获取。
 * 如果地址栏中没有文件名信息，则显示“打开”文件列表功能，如果文件列表中无数据，则打开“工程管理”让用户新增文件。
 * */
var isFramePageInited = false;

/**
 * 自定义组件管理
 * @type {UserDefinedComponent}
 */
var userDefinedComponents;

/**
 *从地址栏获取文件工程信息
 * @param  filePath 文件信息
 * */
function loadFramePageParam(filePath){
	if(filePath){
		currentFile = filePath;

		currentProject = "default";
		if(currentFile.indexOf("pname=")>-1 ){
			currentProject =currentFile.substr(currentFile.indexOf("pname=")+6);
			if(currentProject.indexOf("&")>-1){
				currentProject = currentProject.substring(0,currentProject.indexOf("&"));
			}
		}

		if(currentFile.indexOf("$")>-1){
			currentFileName = currentFile.substring(currentFile.lastIndexOf("$")+1);
		}
		if(currentFileName.indexOf("&") > -1){
			currentFileName = currentFileName.substring(0,currentFileName.indexOf("&"));
		}
	}else{
		//先从缓存中加载设计文件信息，如果缓存不存在，则让用户选择设计文件或新建设计文件
		if(!loadProjectInfoFromLocalStorage()){
			selectProjectFile();
		}
	}
}




/**
 * 获取缓存主键
 * @returns {string}
 */
function getProjectLocalStorageKey() {
	var key = "projectInfo";
	if (location.pathname.indexOf("index-m.html") > -1) {
		key = "m-projectInfo";
	}
	return key;
}
/**
 * 缓存当前项目信息
 */
function setCurrentProjectInfoToLocalStorage(){
	if(!storage.isStorage){
		return ;
	}
	var projectInfo={};
	projectInfo.currentProject = currentProject;
	projectInfo.currentFileName = currentFileName;
	projectInfo.currentFile = currentFile;
	projectInfo.currentProjectLocalPath = currentProjectLocalPath;
	storage.put(getProjectLocalStorageKey(),JSON.stringify(projectInfo));
}
/**
 * 从缓存中加载工程信息
 */
function loadProjectInfoFromLocalStorage(){
	if(!storage.isStorage){
		return false;
	}
	var projectInfo = storage.get(getProjectLocalStorageKey());
	if(projectInfo != null){
		var project = $.parseJSON(projectInfo);
		currentProject = project.currentProject ;
		currentFileName = project.currentFileName;
		currentFile = project.currentFile;
		currentProjectLocalPath = project.currentProjectLocalPath;
		return true;
	}
	return false;
}

/**
 * 从缓存中清除工程信息
 */
function removeProjectInfoFromLocalStorage(){
	if(!storage.isStorage){
		return false;
	}
	storage.remove(getProjectLocalStorageKey());
}

function showProjectModal(operator,moduleType){
	var src = "html/project.html?fileName="+getCurrentTime()+"&projectName="+currentProject;
	if(operator != undefined){
		src += "&operator="+operator;
	}
	if(moduleType != undefined){
		src += "&moduleType="+moduleType;
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
			showProjectModal("addFile", "designfile");
		}
	}
	dsTool.getData(param);
}

function setProjectPreviewPath(project){
	if(project == undefined){
		return;
	}
	//文件预览路径
	if(project.previewPrefix == undefined){
		project.previewPrefix = "8080";
	}
	if(project.previewPrefix == undefined){
		project.previewPrefix = "";
	}
	var host = window.location.host.replace(window.location.port,"");
	if(!window.location.port){
		host += ":";
	}
	previewPath =getURLConcatPath("http://"+host+project.previewPort,project.previewPrefix);
	var filePath = currentFile.substring(0,currentFile.lastIndexOf("$")).replace("@",":").split("$").join("/");
	filePath = getURLConcatPath(filePath,"");
	var projectLocalPath =getURLConcatPath(project.localPath,"");
	var relativePath = filePath.replace(projectLocalPath,"");
	previewPath =getURLConcatPath(previewPath,relativePath);
	previewPath =getURLConcatPath(previewPath,currentFileName)+"?operator=add";
	$("#button-preview").attr("href",previewPath);
	$("#button-preview-m").attr("href","preview-m.html?url="+previewPath);
}

/**
 * 设置当前工程的发布路径
 * @param project
 */
function setCurrentProjectLocalPath(project){
	if(project == undefined){
		return;
	}
	if(project.localPath == undefined){
		return;
	}
	currentProjectLocalPath = project.localPath;
}

/**
 *从服务端加载工程信息
 * */
function loadCurrentProject(){
	//工程加载成功禁用以下按钮
	$("#button-preview,#button-preview-m,#button-share-modal,#btnSaveAsMenu").attr("disabled","disabled");
	//清空布局器容器
	$(".demo").html("");
	$("#container_data>div.footer-bg").html('');
	//属性配置面板重新初始化
	$(".form-layout-east .properties .form-panel-body").empty();

	//从url路径或缓存中加载工程信息
	if(!isFramePageInited){
		var filePath = getUrlParam("file", window.location.search);
		loadFramePageParam(filePath);
		isFramePageInited = true;
	}
	//如果文件不存在则不执行后续操作
	if(currentFileName == ""){
		$(".form-layout-east .file").html("未打开文件。");
		return;
	}
	//加载工程信息
	var param=new AjaxParameter();
	param.url="jersey-services/layoutit/frame/projects/get/"+currentProject;
	param.async = true;
	param.callBack=function(data){
		if(data != undefined && data != null){
			var project = data;
			$(".form-layout-east .file").html(currentFileName);
			$("#button-preview,#button-preview-m,#button-share-modal,#btnSaveAsMenu").removeAttr("disabled");
			//设置工程预览路径
			setProjectPreviewPath(project);
			//设置工程保存路径
			setCurrentProjectLocalPath(project);
			//加载是否国际化属性
			isI18n = data.isI18n;
			if(isI18n === "false"){
				$("#i18nChange").hide();
			}else{
				$("#i18nChange").show();
			}
			//加载设计文件内容
			restoreData();
			//工程加载成功添加缓存信息
			setCurrentProjectInfoToLocalStorage();
		}else{
			bootbox.alert("工程【"+currentProject+"】不存在，请先配置工程信息！");
			$(".form-layout-east .file").html("工程"+currentProject+"不存在！");
			currentProject = "default";
			//工程加载不成功，清除缓存信息。
			removeProjectInfoFromLocalStorage();
		}
	}
	dsTool.getData(param);
}

/**
 * 重新加载工程信息
 * @param projectName
 * @param fileFullPath
 * @param fileName
 */
function reloadCurrentProjectParam(projectName,fileFullPath,fileName,compName) {
	currentProject = projectName;
	currentFile = fileFullPath;
	currentFileName = fileName;

	if (getUrlParam('file', location.search) || currentFile) {
		loadCurrentProject();
		if (compName) {
			userDefinedComponents.refreshComponent(compName, fileFullPath);
		}
	} else {
		removeProjectInfoFromLocalStorage();
		window.location.reload();
	}
}

$(document).ready(function(){
	//新建
	$("#new").click(function() {
		showProjectModal("addFile","designfile");
	});

	//工程管理
	$("#project").click(function() {
		if(currentFile){
			save(false);
		}

		showProjectModal();
	});

	$("#i18nChange").click(function(){
		if(i18nLanguage === "zh"){
			i18nLanguage = "en"
		}else{
			i18nLanguage = "zh";
		}
		initI18NProperties(i18nFileName,i18npath,i18nLanguage);
	});

	//打开
	 $("#edit").click(function() {
         showOpenFrameDialog();
    });

	//保存数据绑定
	$("[data-target=#shareModal]").click(function(e) {
		e.preventDefault();
		save();
	});

	$("#frameFileTable").on("dbl-click-row.bs.table",function(event,row,$element){
		$(this).bootstrapTable("check",$element.data("index"));
		$("#confirmFrameBtn").trigger("click");
	})

	//编辑对话框确定按钮事件
	$("#confirmFrameBtn").click(function() {
		var rows = getTableSelectData("frameFileTable");
		if(rows.length == 0) {
			bootbox.alert("表格行数据没有被选中。");
		}
		else {
			reloadCurrentProjectParam(rows[0]["projectName"],rows[0]["fullInfo"],rows[0]["fileName"]);
			/*
			var full = rows[0]["fullInfo"];
			var href= window.location.href;
			window.location = href.substring(0, href.indexOf("?")) + '?path=' + full;
			*/
            hideModalDialog("openFrameDialog");
		}
	});


	$("#backup").click(function(){
		var param=new AjaxParameter();
		param.url="jersey-services/layoutit/frame/project/backup/"+currentProject+"/"+currentFile+"/";
		param.callBack=function(data){
			if(data != undefined && data.data){
				if(data.data == "success"){
					bootbox.alert("备份成功！"); 
				}else{
					bootbox.alert("备份失败！"); 			
				}
			} 
		}
		dsTool.saveData(param);
	});

	//预览时先保存当前文件然后发布一次工程，最后生成预览界面。
	$("#button-preview").click(function(){
		save(false);
		var param=new AjaxParameter();
		param.url="jersey-services/layoutit/frame/project/publish/"+currentProject;
		dsTool.saveData(param);
	});

	//组件另存为
	$("#btnSaveASComponent").click(function() {
		var compName = $("#txtUserComponentName").val();
		if (!compName) {
			bootbox.alert("请输入组件名称！");
			return;
		}

		if (userDefinedComponents.isComponentExist(compName)) {
			bootbox.alert("组件名称重复，请修改后重试！");
			return;
		}

		if (currentFile.indexOf("cname") !== -1) {
			currentFile = currentFile.substring(0, currentFile.indexOf("&cname"));
			var oldCname = currentFile.substring(currentFile.indexOf("&cname") + 1);
			if (oldCname.indexOf("&") > -1) {
				currentFile += oldCname.substring(oldCname.indexOf("&"));
			}
		}
		currentFile += "&cname=" + compName;
		//更新缓存信息
		setCurrentProjectInfoToLocalStorage();
		//保存框架文件
		save();
		//添加组件到主页面板
		userDefinedComponents.addComponentToContainer(compName, currentFile);

		dragComponent();

		$('#saveASModal').modal('hide');
		$("#txtUserComponentName").val("");
	});

	//用户自定义组件加载
	userDefinedComponents = new UserDefinedComponent();
	userDefinedComponents.init();

	//导出功能实现
	$("#export_war").off('click').on('click', function() {

		if($(this).is(':checked') == true) {
			$("#export_contain_orm, #export_docker_images").prop('disabled',false);
		}
		else {
			$("#export_contain_orm, #export_docker_images").prop('checked', false).prop('disabled',true)
		}
	});

	$("#export_contain_orm").off('click').on('click', function() {

		if($(this).is(':checked') == true) {
			$("#export_docker_images").prop('disabled',false);
		}
		else {
			$("#export_docker_images").prop('checked', false).prop('disabled',true)
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
					isContainOrm:$('#export_contain_orm').is(':checked'),
					isDockerImages:$('#export_docker_images').is(':checked'),
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


	/**
	 * 返回设计平台
	 * 在云平台模式下,用户可以从表单设计器返回到云平台页面下。	 
	 */
	$("#button-back").click(function() {
		var url = "/workbench/index.html",
			appId = getUrlParam("appid", location.search);
		if (appId) {
			url += "?appid=" + appId;
		}

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
	});
});
