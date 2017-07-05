function ProjectDataModel(){
}
ProjectDataModel.projectInfo = {};
ProjectDataModel.designFiles = {};

ProjectDataModel.formatProjectData =function(data){
	var result = [];
	if(data) {
		$.each(data, function (index, item) {
			var node = {};
			node.id = item.projectName;
			node.pId = 0;
			node.name = item.projectName;
			node.previewPrefix = getFormatedProjectPath(item.previewPrefix);
			node.previewPort = item.previewPort;
			node.publishPath = getFormatedProjectPath(item.publishPath);
			node.commonjsPath = getFormatedProjectPath(item.commonjsPath);
			node.commoncssPath = getFormatedProjectPath(item.commoncssPath);
			node.localPath = getFormatedProjectPath(item.localPath);
			node.moduleType = "project";
			node.projectName = item.projectName;
			node.currentNodeID = item.projectName;
			node.sourceItem = item.sourceList;
			node.isI18n = item.isI18n;
			result.push(node);
		});
	}
	return result;
}

ProjectDataModel.formatDataSourceData = function(data,projectName){
	var result = [];
	if(data){
		$.each(data,function(index,dsItem){
			if(dsItem.type && dsItem.type !== "orm"){
				return;
			}

			var childNode = {};
			childNode.id = projectName+"_$module_root_"+dsItem.sourceName;
			childNode.currentNodeID = childNode.id;
			childNode.pId =projectName+"_$module_root";
			childNode.name = dsItem.displayName;
			childNode.ip = dsItem.ip;
			childNode.port = dsItem.port;
			childNode.uriPrefix =getFormatedProjectPath(dsItem.uriPrefix);
			childNode.moduleType = "datasource";
			childNode.projectName = projectName;
			childNode.sourceName = dsItem.sourceName;
			result.push(childNode);
		});
	}
	return result;
}

ProjectDataModel.formatDesignFileData = function(data){
	var result = [];
	if(data) {
		$.each(data.rows, function (index, item) {
			var node = {};
			node.id = item.fullInfo;
			node.currentNodeID = node.id;
			node.name = item.fileName;
			node.modifyTime = item.modifyTime;
			node.fileName = item.fileName.replace(".html", "");
			node.fullInfo = item.fullInfo;
			node.filePath = item.filePath;
			/*根据文件路径和工程路径计算文件相对路径*/
			node.fileRelativePath = item.filePath;
			node.pId = item.projectName+"_$module_root_design_file" ;
			node.moduleType = "designfile";
			node.projectName = item.projectName;
			node.componentName = item.componentName;
			node.fileType = item.fileType;
			result.push(node);
		});
	}

	return result;
}

ProjectDataModel.prototype={
	init:function(){
		this.loadProjectData();
		this.loadDesignFileData();
	},
	getData : function(url,param,async,callback){
		var param=new AjaxParameter();
		param.url=url;
		param.callBack=callback;
		param.async = async;
		dsTool.getData(param);
	},
	saveData:function(url,param,async,callback){
		var param=new AjaxParameter();
		param.url=url;
		param.callBack=callback;
		param.async = async;
		dsTool.saveData(param);
	},
 	loadProjectData:function(){
		var url = getContextPath() + "/jersey-services/layoutit/frame/projects/info/";
		var callback = function(data){
			if(data){
				ProjectDataModel.projectInfo = ProjectDataModel.formatProjectData(data);
			}
		}
		this.getData(url,undefined,false,callback);
	},
	getProjectData:function(){
		return 	ProjectDataModel.projectInfo;
	},
	getProjectInfo : function(currentProjectName){
		var result ;
		if(ProjectDataModel.projectInfo){
			$.each(ProjectDataModel.projectInfo,function(index,item){
				if(item.projectName == currentProjectName){
					result = item;
					return false;
				}
			})
		}
		return result;
	},
	loadDesignFileData:function(){
		var url = getContextPath() + "/jersey-services/layoutit/frame/files/info";
		var callback = function(data){
			if(data){
				ProjectDataModel.designFiles = ProjectDataModel.formatDesignFileData(data);
			}
		}
		this.getData(url,undefined,false,callback);
	},
	getDataSourceList:function(currentProject){
		var result;
		if(ProjectDataModel.projectInfo){
			$.each(ProjectDataModel.projectInfo,function(index,item){
				if(item.name == currentProject){
					result =ProjectDataModel.formatDataSourceData(item.sourceItem,currentProject);
					return false;
				}
			})
		}
		return result;
	},
	getDataSourceInfo:function(currentProject,datasourceId){
		var result;
		var dataSources = this.getDataSourceList(currentProject);
		if(dataSources){
			$.each(dataSources,function(index,item){
				if(item.sourceName == datasourceId){
					result = item;
					return false;
				}
			})
		}
		return result;
	},
	getProjectDesignFileList:function(currentProject){
		var result = [];
		if(ProjectDataModel.designFiles){
			var project = this.getProjectInfo(currentProject);
			$.each(ProjectDataModel.designFiles,function(index,item) {
				if (item.projectName != currentProject) {
					return;
				}
				item.fileRelativePath = getFormatedProjectPath(item.fileRelativePath).replace(getFormatedProjectPath(project.localPath),"");
				item.filePath = project.localPath;
				result.push(item);
			})
		}
		return result;
	},
	getDesignFileInfo:function(currentProject,fileFullInfo){
		var result;
		var files = this.getProjectDesignFileList(currentProject);
		if(files.length > 0){
			$.each(files,function(index,item){
				if(item.fullInfo == fileFullInfo){
					result = item;
					return false;
				}
			})
		}
		return result;
	}
}


/**
 * avalon 模型
 */
var vm1438050062200 = avalon.define({$id: 'vm1438050062200',
	input_text_project_name: 'default',
	input_text_project_name_form_disabled : true,
	input_text_project_local_path: 'asdf',
	input_text_project_local_path_form_disabled : true,
	input_text_project_publish_path: 'aa',
	input_text_project_publish_path_form_disabled : true,
	input_text_project_common_js_path:'js/common',
	input_text_project_common_js_path_form_disabled:true,
	input_text_project_common_css_path:'css/common',
	input_text_project_common_css_path_form_disabled:true,
	input_text_preview_port: '8080',
	input_text_preview_port_form_disabled : true,
	input_text_ds_name: '',
	input_text_ds_name_form_disabled : true,
	input_text_ds_displayName: '',
	input_text_ds_displayName_form_disabled : true,
	input_text_ds_ip: '',
	input_text_ds_ip_form_disabled : true,
	input_text_ds_port: '',
	input_text_ds_port_form_disabled : true,
	input_text_ds_uriPrefix: '',
	input_text_ds_uriPrefix_form_disabled : true,
	input_text_fileName: '',
	input_text_fileName_form_disabled : true,
	input_text_filePath: '',
	input_text_filePath_form_disabled : true,
	input_text_file_relative_path: '',
	input_text_file_relative_path_form_disabled : true,
	input_checkbox_is_i18n:false,
	input_checkbox_is_i18n_disabled : true,
	currentNodeID:"default",
	fileOldFullName:''
});

/**
 * 格式化工程路径
 * @param path
 */
function getFormatedProjectPath(path){
	if(path == undefined){
		return;
	}
	/*路径格式转换 */
	if(path.indexOf("\\")>-1){
		path = path.split("\\").join("/");
	}
	/*替换末尾的"/"且转换成小写*/
	var reg=new RegExp("[//]$","gi");
	return path.replace(reg,"");
}

/**
 * 格式化路径
 * @param path
 */
function getFormatedFilePath(path){
	if(path == undefined){
		return "";
	}
	path = getFormatedProjectPath(path);
	path = path.replace(new RegExp("/","g"),"$").replace(":","@");
	return path;
}


/**
 * 视图管理类
 * @constructor
 */
function ProjectConfigViewManager(){
	this.moduleType = "project";
	this.operator = "view";
	this.projectName = "default";
	this.currentView = {};
	this.currentViewData = {};
}
ProjectConfigViewManager.prototype.init = function() {
	var href = window.location.href;
	if(getUrlParam("moduleType", href)){
		this.moduleType = getUrlParam("moduleType", href);
	}
	if(getUrlParam("operator", href)){
		this.operator = getUrlParam("operator", href);
	}
	if(getUrlParam("projectName",href)){
		this.projectName = getUrlParam("projectName",href);
	}
	this.setCurrentView(this.moduleType,this.operator,this.projectName);
}
/**
 * 设置当前视图
 * @param moduleType
 * @param operator
 * @param projectName
 * @param nodeId
 */
ProjectConfigViewManager.prototype.setCurrentView = function(moduleType,operator,projectName,nodeId){
	this.moduleType = moduleType;
	this.operator = operator;
	this.projectName = projectName;
	var projectInfo = projectModel.getProjectInfo(projectName);
	switch (this.moduleType){
		case "project":
			this.currentView = new ProjectView(this.operator);
			this.currentViewData = projectInfo;
			break;
		case "datasourcelist":
			this.currentView = new ProjectDataSourceListView(projectName,operator);
			this.currentViewData = projectModel.getDataSourceList(projectName);
			break;
		case "datasource":
			this.currentView = new ProjectDataSourceView(projectName,operator);
			this.currentViewData = projectModel.getDataSourceInfo(projectName,nodeId);
			break;
		case "designfilelist":
			this.currentView = new ProjectDesignFileListView(projectName,operator);
			this.currentViewData = projectModel.getProjectDesignFileList(projectName);
			break;
		case "designfile":
			this.currentView = new projectDesignFileView(projectName,operator);
			this.currentViewData = projectModel.getDesignFileInfo(projectName,nodeId);
			break;
	}
	this.setGlobalVisibility();
	this.currentView.init(this.currentViewData,projectInfo);
}
/**
 * 视图添加
 * @param callback
 */
ProjectConfigViewManager.prototype.save = function(callback){
	this.currentView.save(callback);
}
/**
 * 保存并打开
 * @param callback
 */
ProjectConfigViewManager.prototype.saveAndOpen = function(callback){
	this.currentView.saveAndOpen(callback);
}
/**
 * 视图删除
 * @param callback
 */
ProjectConfigViewManager.prototype.delete = function(params,callback){
	this.currentView.delete(params,callback);
}
/**
 * 视图编辑（增删改）后，重新刷新视图
 * @param projectName
 * @param nodeId
 */
ProjectConfigViewManager.prototype.refreshView = function(){
	/*重新加载父页面信息*/
	this.reloadParentProjectParam(
		this.currentView.getParentPageProjectParam()
	);
	/*重新加载工程信息*/
	projectModel.init();
	/*重新刷新视图*/
	this.setCurrentView (
		this.currentView.getNextViewType(),
		"view",
		this.currentView.getProjectName(),
		this.currentView.getCurrentNodeID()
	);
}
/**
 * 重新加载父页面信息
 * @param parentPageProjectParam.currentProject 父页面的当前工程
 * @param parentPageProjectParam.currentFile 父页面当前编辑的文件
 * @param parentPageProjectParam.currentFileName 父页面当前编辑的文件名
 */
ProjectConfigViewManager.prototype.reloadParentProjectParam = function(parentPageProjectParam){
	if(parentPageProjectParam == undefined){
		return;
	}
	if(!parentPageProjectParam.reload){
		return;
	}
	/*判断当前设计页面是否在所修改的工程下，如果是才对父页面进行刷新*/
	if(window.parent.currentProject != parentPageProjectParam.currentProject){
		return;
	}
	/*重新加载父页面参数*/
	window.parent.reloadCurrentProjectParam(parentPageProjectParam.currentProject,
		parentPageProjectParam.currentFile,parentPageProjectParam.currentFileName
		,parentPageProjectParam.componentName);
}

ProjectConfigViewManager.prototype.getCurrentProjectName = function(callback){
	return this.projectName;
}

ProjectConfigViewManager.prototype.setGlobalVisibility = function(){
	/*datasource*/
	$("#divDataSourceInfo").hide();
	$("#datasourceButtonGroup").hide();
	$("#divDataSourceList").hide();
	$("#btnDataSourceUpdate").hide();
	$("#btnDataSourceAdd").hide();
	/*design file*/
	$("#divDesignFileInfo").hide();
	$("#divFileInfo").hide();
	$("#designfileButtonGroup").hide();
	$("#btnDesignFileAdd").hide();
	/*project*/
	$("#divProjectInfo").hide();
	$("#projectButtonGroup").hide();
	/*other*/
	$("#btnSaveAndOpen").hide();
	$("#btnSave").hide();
	$("#btnSaveOpenTemplate").hide();
}


/**
 * 工程导航树
 * @constructor
 */
function ProjectNavigation(){
	this.ztreeNodes = [];
	this.project_treeObj=new zTree();
}
ProjectNavigation.prototype.init = function(){
	this.setTreeNodes();
	this.initZtree();
}
ProjectNavigation.prototype.setTreeNodes = function(){
	var treeNodes = [];
	var projectInfo = projectModel.getProjectData();
	$.each(projectInfo,function(index,item){
		/** 工程信息*/
		treeNodes.push(item);
		/**数据源信息*/
		treeNodes.push({id:item.name+"_$module_root",
			pId:item.name,name:"数据源",
			moduleType:"datasourcelist",
			projectName:item.name,
			currentNodeID:item.name+"_$module_root"});
		/**设计文件信息*/
		var rootFileId = item.name+"_$module_root_design_file" ;
		treeNodes.push({id:rootFileId,
			pId:item.name,name:"设计文件",
			moduleType:"designfilelist",
			projectName:item.name,
			currentNodeID:item.name+"_$module_root_design_file",
			filePath:getFormatedProjectPath(item.localPath),
			fileRelativePath:""});
	})
	this.ztreeNodes = treeNodes;
}

ProjectNavigation.prototype.initZtree = function(){
	this.project_treeObj.zNodes = this.ztreeNodes;
	this.project_treeObj.callback.onClick = function(event,treeId,treeNode) {
		projectConfigViewManager.setCurrentView(treeNode.moduleType,"view",treeNode.projectName,treeId);
	};
	this.project_treeObj.initTree("tree_project");
	/*选中当前编辑节点*/
	this.selectTreeNode();
	/*隐藏二级子节点*/
	this.hideTreeNode();
	/*展开所有树节点*/
	this.project_treeObj.expandAll(true);
}

ProjectNavigation.prototype.treeNodeFilter = function(node){
	return (node.level == 2);
}

ProjectNavigation.prototype.selectTreeNode = function(){
	var node = this.project_treeObj.getNodeByParam("currentNodeID",vm1438050062200.currentNodeID,null);
	this.project_treeObj.selectNode(node);
}

ProjectNavigation.prototype.hideTreeNode = function(){
	this.project_treeObj.hideNodes(this.project_treeObj.getNodesByFilter(this.treeNodeFilter,false));
}


/**
 * 工程管理视图
 * @param operator
 * @constructor
 */
function ProjectView(operator){
	this.operator = operator;
}
ProjectView.prototype = {
	init:function(data){
		this.setVisibility();
		this.setEditableStatus();
		this.setData(data);
	},
	setVisibility:function(){
		$("#divProjectInfo").show();
		$("#projectButtonGroup").show();
		$("#btnProjectUpdate").show();
		$("#btnProjectAdd").show();
		$("#btnSave").show();
		if(this.operator == "view"){
			$("#btnSave").hide();
		}
		//框架配置，如果不打开添加功能，则不显示添加按钮
		if(!parent.window.isFrameProjectAddEnable){
			$("#btnProjectAdd").hide();
		}
		//框架配置，如果删除功能不打开，则不显示删除按钮
		if(!parent.window.isFrameProjectDeleteEnable){
			$("#btnProjectDelete").hide();
		}
	},
	setEditableStatus:function(){
		var flag = false;
		if(this.operator == "view"){
			flag = true;
		}
		vm1438050062200.input_text_project_local_path_form_disabled =flag;
		vm1438050062200.input_text_project_publish_path_form_disabled = flag;
		vm1438050062200.input_text_project_common_js_path_form_disabled = flag;
		vm1438050062200.input_text_project_common_css_path_form_disabled = flag;
		vm1438050062200.input_text_preview_port_form_disabled = flag;
		vm1438050062200.input_checkbox_is_i18n_disabled = flag;

		if(this.operator == "add"){
			vm1438050062200.input_text_project_name_form_disabled = false;
		}else{
			vm1438050062200.input_text_project_name_form_disabled = true;
		}
	},
	setData:function(data){
		if(data && this.operator != "add"){
			vm1438050062200.currentNodeID =  data.projectName;
			vm1438050062200.input_text_project_name = data.projectName;
			vm1438050062200.input_text_project_local_path = data.localPath;
			vm1438050062200.input_text_preview_port = data.previewPort;
			vm1438050062200.input_text_project_publish_path	= data.publishPath;
			vm1438050062200.input_text_project_common_js_path = data.commonjsPath;
			vm1438050062200.input_text_project_common_css_path = data.commoncssPath;
			if(data.isI18n === "true"){
				vm1438050062200.input_checkbox_is_i18n = true;
			}else {
				vm1438050062200.input_checkbox_is_i18n = false;
			}
		}else{
			vm1438050062200.input_text_project_name = "";
			vm1438050062200.input_text_project_local_path ="";
			vm1438050062200.input_text_preview_port = "";
			vm1438050062200.input_text_project_publish_path	= "";
			vm1438050062200.input_text_project_common_js_path = "";
			vm1438050062200.input_text_project_common_css_path = "";
			vm1438050062200.input_checkbox_is_i18n = false;
		}
	},
	save:function(callback){
		if(!this.validate()){
			return ;
		}
		var project ={};
		project.projectName = vm1438050062200.input_text_project_name;
		project.localPath =getFormatedProjectPath(vm1438050062200.input_text_project_local_path);
		project.previewPrefix =getFormatedProjectPath(vm1438050062200.input_text_project_publish_path);
		var webAppIndex = project.previewPrefix.indexOf("/webapps/");
		if(webAppIndex > -1 ){
			project.previewPrefix = getURLConcatPath(project.previewPrefix.substr(webAppIndex+8),"");
		}else{
			project.previewPrefix = "designer/layoutit";
		}
		project.previewPort = vm1438050062200.input_text_preview_port;
		project.publishPath = getFormatedProjectPath(vm1438050062200.input_text_project_publish_path);
		project.commonjsPath =getFormatedProjectPath(vm1438050062200.input_text_project_common_js_path);
		project.commoncssPath =getFormatedProjectPath(vm1438050062200.input_text_project_common_css_path);
		project.isI18n = vm1438050062200.input_checkbox_is_i18n;
		vm1438050062200.currentNodeID = project.projectName;
		var msg = "工程【"+vm1438050062200.input_text_project_name+"】";

		var param=new AjaxParameter();
		param.url= getContextPath() + "/jersey-services/layoutit/frame/project/"+this.operator;
		param.data = JSON.stringify(project);
		if(param.data == "{}"){
			param.data= null;
		}
		param.callBack=function(data){
			if(data != undefined && data.data){
				if(data.data == "success"){
					if(callback){
						callback(data);
					}
					bootbox.alert(msg+"提交成功！");
				}else{
					bootbox.alert(msg+"提交失败！");
				}
			}
		}
		dsTool.saveData(param);
	},

	delete:function(projectName,callback){
		if(vm1438050062200.input_text_project_name == "default"){
			bootbox.alert("不能删除默认工程！");
			return;
		}

		if(vm1438050062200.input_text_project_name == ""){
			bootbox.alert("请选择要删除的工程！");
			return;
		}

		bootbox.confirm("确认要删除所选工程吗？", function(result){
			if(result) {
				var param = new AjaxParameter();
				param.url = getContextPath() + "/jersey-services/layoutit/frame/project/delete/" + vm1438050062200.input_text_project_name;
				param.callBack = function (data) {
					if (data != undefined && data.data) {
						if (data.data == "success") {
							if(callback){
								callback(data);
							}
							vm1438050062200.currentNodeID = "default";
							bootbox.alert("工程删除成功！");
						} else {
							bootbox.alert("工程删除失败！");
						}
					}
				}
				dsTool.deleteData(param);
			}
		});
	},
	validate:function(){
		//重置验证状态
		this.resetValidationStatus();
		$("#divProjectInfo").bootstrapValidator('validate');
		if($("#divProjectInfo").data('bootstrapValidator').isValid()) {
			this.resetValidationStatus();
			return true;
		}
		return false;
	},
	getParentPageProjectParam:function(){
		var parentPageProjectParam = {};
		parentPageProjectParam.currentProject = vm1438050062200.input_text_project_name;
		parentPageProjectParam.currentFile = window.parent.currentFile;
		parentPageProjectParam.currentFileName = window.parent.currentFileName;
		parentPageProjectParam.currentIsI18n = window.parent.isI18n;
		parentPageProjectParam.reload = false;
		var changedFileName =  this.getChangedProjectDesignFileName();
		if(parentPageProjectParam.currentFile != changedFileName){
			parentPageProjectParam.currentFile = changedFileName;
			parentPageProjectParam.reload = true;
		}
		if(parentPageProjectParam.currentIsI18n != vm1438050062200.input_checkbox_is_i18n){
			parentPageProjectParam.reload = true;
		}
		return parentPageProjectParam;
	},
	getChangedProjectDesignFileName:function(){
		var fileFullName =window.parent.currentFile;
		if(fileFullName == ""){
			return "";
		}
		fileFullName = fileFullName;
		var newLocalPath =getFormatedFilePath(vm1438050062200.input_text_project_local_path);
		var oldLocalPath =getFormatedFilePath(window.parent.currentProjectLocalPath);
		return newLocalPath+fileFullName.replace(oldLocalPath,"");
	},
	resetValidationStatus:function(){
		$("#divProjectInfo").data('bootstrapValidator').resetForm();
	},
	getNextViewType:function(){
		return "project";
	},
	getCurrentNodeID:function(){
		return vm1438050062200.currentNodeID;
	},
	getProjectName:function(){
		return vm1438050062200.currentNodeID;
	}
}


/**
 * 数据源详情视图
 * @param operator
 * @constructor
 */
function ProjectDataSourceView(projectName,operator){
	this.projectName = projectName;
	this.operator = operator;
}
ProjectDataSourceView.prototype = {
	init:function(data){
		this.setVisibility();
		this.setEditableStatus();
		this.setData(data);
	},
	setVisibility:function(){
		$("#divDataSourceInfo").show();
		$("#datasourceButtonGroup").show();
		$("#btnSave").show();
		if(this.operator == "view"){
			$("#btnSave").hide();
		}
	},
	setEditableStatus:function(){
		var flag = false;
		if(this.operator == "view"){
			flag = true;
		}
		vm1438050062200.input_text_ds_displayName_form_disabled = flag;
		vm1438050062200.input_text_ds_ip_form_disabled = flag;
		vm1438050062200.input_text_ds_port_form_disabled  = flag;
		vm1438050062200.input_text_ds_uriPrefix_form_disabled  = flag;

		if(this.operator == "add"){
			vm1438050062200.input_text_ds_name_form_disabled = false;
		}else{
			vm1438050062200.input_text_ds_name_form_disabled = true;
		}
	},
	setData:function(data){
		if(data && this.operator != "add"){
			vm1438050062200.input_text_ds_name = data.sourceName;
			vm1438050062200.input_text_ds_displayName = data.name;
			vm1438050062200.input_text_ds_ip = data.ip;
			vm1438050062200.input_text_ds_port = data.port;
			vm1438050062200.input_text_ds_uriPrefix = data.uriPrefix;
			vm1438050062200.currentNodeID = data.sourceName;
		}else{
			vm1438050062200.input_text_ds_name = "";
			vm1438050062200.input_text_ds_displayName = "";
			vm1438050062200.input_text_ds_ip = "";
			vm1438050062200.input_text_ds_port = "";
			vm1438050062200.input_text_ds_uriPrefix = "";
		}
	},
	save:function(callback){
		if(!this.validate()){
			return ;
		}
		var project = {};
		project.type = "orm";
		project.sourceName = vm1438050062200.input_text_ds_name;
		project.displayName = vm1438050062200.input_text_ds_displayName;
		project.ip = vm1438050062200.input_text_ds_ip;
		project.port = vm1438050062200.input_text_ds_port;
		project.uriPrefix = vm1438050062200.input_text_ds_uriPrefix;
		vm1438050062200.currentNodeID = vm1438050062200.input_text_ds_name;
		var msg = "工程【"+this.projectName+"】数据源【"+vm1438050062200.input_text_ds_name+"】";

		var param=new AjaxParameter();
		param.url= getContextPath() + "/jersey-services/layoutit/frame/project/datasource/"+this.operator+"/"+this.projectName;
		param.data = JSON.stringify(project);
		if(param.data == "{}"){
			param.data= null;
		}
		param.callBack=function(data){
			if(data != undefined && data.data){
				if(data.data == "success"){
					if(callback){
						callback(data);
					}
					bootbox.alert(msg+"提交成功！");
				}else{
					bootbox.alert(msg+"提交失败！");
				}
			}
		}
		dsTool.saveData(param);
	},
	validate:function(){
		//重置验证状态
		this.resetValidationStatus();
		$("#divDataSourceInfo").bootstrapValidator('validate');
		if($("#divDataSourceInfo").data('bootstrapValidator').isValid()) {
			this.resetValidationStatus();
			return true;
		}
		return false;
	},
	getParentPageProjectParam:function(){
		var parentPageProjectParam = {};
		parentPageProjectParam.currentProject = this.projectName;
		parentPageProjectParam.currentFile = window.parent.currentFile;
		parentPageProjectParam.currentFileName = window.parent.currentFileName;
		parentPageProjectParam.reload = true;
		return parentPageProjectParam;
	},
	resetValidationStatus:function(){
		$("#divDataSourceInfo").data('bootstrapValidator').resetForm();
	},
	getNextViewType:function(){
		return "datasource";
	},
	getCurrentNodeID:function(){
		return vm1438050062200.currentNodeID;
	},
	getProjectName:function(){
		return this.projectName;
	}
}


/**
 * 数据源列表视图
 * @param operator
 */
function ProjectDataSourceListView(projectName,operator){
	this.projectName = projectName;
	this.operator = operator;
}

ProjectDataSourceListView.dataSourceDeleteRowFormat=function(value,row){
	return "<div style=\"width:60px\"><a class=\"remove\" href=\"javascript:void(0)\" title=\"修改\" onclick='ProjectDataSourceListView.updateProjectDataSourceSetting(\""+row.projectName+"\",\""+row.sourceName+"\")'><i class=\"glyphicon glyphicon-pencil\"></i></a>"+"&nbsp;&nbsp;"+
		"<a class=\"remove\" href=\"javascript:void(0)\" title=\"删除\" onclick='ProjectDataSourceListView.deleteDataSource(\""+row.projectName+"\",\""+row.sourceName+"\")'><i class=\"glyphicon glyphicon-remove\"></i></a></div>";
}

ProjectDataSourceListView.updateProjectDataSourceSetting = function(projectName,dsName){
	projectConfigViewManager.setCurrentView("datasource","update",projectName,dsName);
}

ProjectDataSourceListView.deleteDataSource = function(projectName,dsName){
	var callback = function(){
		projectConfigViewManager.refreshView();
	}
	projectConfigViewManager.delete(dsName,callback);
}

ProjectDataSourceListView.prototype={
	init:function(data){
		this.setVisibility();
		this.setData(data);
	},
	setVisibility:function(){
		$("#divDataSourceList").show();
		$("#datasourceButtonGroup").show();
		$("#btnDataSourceAdd").show();
	},
	setData:function(data){
		$('#table_base_local_datasource').bootstrapTable('removeAll');
		if(data){
			addRowtoLocalTable("table_base_local_datasource",data);
		}
	},
	getParentPageProjectParam:function(){
		var parentPageProjectParam = {};
		parentPageProjectParam.currentProject = this.projectName;
		parentPageProjectParam.currentFile = window.parent.currentFile;
		parentPageProjectParam.currentFileName = window.parent.currentFileName;
		parentPageProjectParam.reload = true;
		return parentPageProjectParam;
	},
	delete:function(dsName,callback){
		var projectName = this.projectName;
		bootbox.confirm("<p style='color: red'><b>数据源删除后将会导致关联页面数据字段绑定不可用！！</b></p><br/>确认要删除所选数据源吗？", function(result){
			if(result) {
				var msg = "工程【" + projectName + "】数据源【" + dsName + "】";
				var param = new AjaxParameter();
				param.url = getContextPath() + "/jersey-services/layoutit/frame/project/datasource/delete/" + projectName + "/" + dsName;
				param.callBack = function (data) {
					if (data && data.data) {
						if (data.data == "success") {
							if(callback){
								callback();
							}
							bootbox.alert(msg + "删除成功！");
						} else {
							bootbox.alert(msg + "删除失败！");
						}
					}
				}
				dsTool.deleteData(param);
			}
		})
	},
	getNextViewType:function(){
		return "datasourcelist";
	},
	getCurrentNodeID:function(){
		return this.projectName;
	},
	getProjectName:function(){
		return this.projectName;
	}
}


/**
 *设计文件列表视图
 * @param operator
 */
function ProjectDesignFileListView(projectName,operator){
	this.projectName = projectName;
	this.operator = operator;
}

ProjectDesignFileListView.designFileDeleteRowFormat = function(value,row){
	return "<div style=\"width:60px\"><a class=\"remove\" href=\"javascript:void(0)\" title=\"修改\" onclick='ProjectDesignFileListView.updateProjectFileSetting(\""+row.projectName+"\",\""+row.currentNodeID+"\")'><i class=\"glyphicon glyphicon-pencil\"></i></a>"+"&nbsp;&nbsp;"+
		"<a class=\"remove\" href=\"javascript:void(0)\" title=\"删除\" onclick='ProjectDesignFileListView.deleteDesignFile(\""+row.fullInfo+"\")'><i class=\"glyphicon glyphicon-remove\"></i></a></div>";
}

ProjectDesignFileListView.designFileDateTimeRowFormat = function(value,row){
	return "<div style=\"width:150px\">"+value+"</div>";
}

ProjectDesignFileListView.updateProjectFileSetting = function(projectName,fileId){
	projectConfigViewManager.setCurrentView("designfile","update",projectName,fileId);
}

ProjectDesignFileListView.deleteDesignFile = function(fileId){
	vm1438050062200.currentNodeID = fileId;
	var callback = function() {
		projectConfigViewManager.refreshView();
		if (fileId.indexOf("cname") > -1) {
			parent.window.userDefinedComponents.deleteComponentFromContainer(fileId);
		}
	}
	projectConfigViewManager.delete(fileId,callback);
}

ProjectDesignFileListView.prototype={
	init:function(data){
		this.setVisibility();
		this.setData(data);
	},
	setVisibility:function(){
		$("#divDesignFileInfo").show();
		$("#designfileButtonGroup").show();
		$("#btnDesignFileAdd").show();
	},
	setData:function(data){
		$('#table_base_local_design_file').bootstrapTable('removeAll');
		if(data){
			addRowtoLocalTable("table_base_local_design_file",data);
		}
	},
	getParentPageProjectParam:function(){
		var parentPageProjectParam = {};
			parentPageProjectParam.currentProject =this.projectName;
			parentPageProjectParam.currentFile = window.parent.currentFile;
			parentPageProjectParam.reload = false;
			if(vm1438050062200.currentNodeID == parentPageProjectParam.currentFile){
				parentPageProjectParam.reload = true;
				parentPageProjectParam.currentFile = "";
				parentPageProjectParam.currentFileName = "";
			}
		return parentPageProjectParam;
	},
	delete:function(fileId,callback){
		if(fileId == window.parent.currentFile){
			bootbox.alert("当前文件已打开，不能删除！");
			return false;
		}

		bootbox.confirm("确认要删除所选文件吗？", function(result) {
			if (result) {
				var fileName = fileId.substring(fileId.lastIndexOf("$")+1);
				fileName = fileName.substring(0,fileName.indexOf(".html"));
				var msg = "文件【" + fileName + "】";
				var param = new AjaxParameter();
				param.url = getContextPath() + "/jersey-services/layoutit/frame/html/delete/" + fileId+"/";
				param.callBack = function (data) {
					if (data && data.data) {
						if (data.data == "success") {
							if (callback) {
								callback();
							}
							bootbox.alert(msg + "删除成功！");
						} else {
							bootbox.alert(msg + "删除失败！");
						}
					}
				}
				dsTool.deleteData(param);
			}
		});
	},
	getNextViewType:function(){
		return "designfilelist";
	},
	getCurrentNodeID:function(){
		return this.projectName;
	},
	getProjectName:function(){
		return this.projectName;
	}
}


/**
 * 设计文件详情视图
 * @param operator
 * @constructor
 */
function projectDesignFileView(projectName,operator){
	this.projectName = projectName;
	this.operator = operator;
	this.componentName = "";
}
projectDesignFileView.prototype = {
	init:function(data,projectInfo){
		this.setVisibility();
		this.setEditableStatus();
		this.setData(data,projectInfo);
	},
	setVisibility:function(){
		$("#divFileInfo").show();
		$("#designfileButtonGroup").show();
		$("#btnSaveAndOpen").show();
		$("#btnSave").show();
		$("#btnSaveOpenTemplate").show();
		if(this.operator == "view"){
			$("#btnSave").hide();
			$("#btnSaveAndOpen").hide();
			$("#btnSaveOpenTemplate").hide();
		}
		if(this.operator == "update"){
			$("#btnSaveOpenTemplate").hide();
		}
	},
	setEditableStatus:function(){
		var flag = false;
		if(this.operator == "view"){
			flag = true;
		}
		vm1438050062200.input_text_fileName_form_disabled = flag;
		vm1438050062200.input_text_file_relative_path_form_disabled = flag;
		vm1438050062200.input_text_filePath_form_disabled = true;
	},
	setData:function(data,projectInfo){
		if(data && this.operator != "add"){
			vm1438050062200.input_text_fileName = data.fileName;
			vm1438050062200.input_text_filePath = data.filePath;
			vm1438050062200.input_text_file_relative_path = data.fileRelativePath;
			vm1438050062200.currentNodeID = this.projectName+"_$module_root_"+data.sourceName;
			vm1438050062200.fileOldFullName = data.fullInfo;
			this.componentName = data.componentName;
		}else{
			vm1438050062200.input_text_fileName = "";
			vm1438050062200.input_text_filePath = projectInfo.localPath;
			vm1438050062200.input_text_file_relative_path = "";
		}
	},
	getProjectDesignFileName : function(){
		var filePath =getURLConcatPath("",vm1438050062200.input_text_file_relative_path);
		filePath =getURLConcatPath(filePath,vm1438050062200.input_text_fileName);
		if(filePath.indexOf(".html") == -1){
			filePath += ".html";
		}
		filePath +="&pname="+this.projectName;
		if(this.componentName) {
			filePath += "&cname=" + this.componentName;
		}
		filePath += "&version=1.0";

		return getFormatedFilePath(filePath);
	},
	isProjectDesignFileExists:function(){
		var fileFullName = this.getProjectDesignFileName();
		var isExists = false;
		var param=new AjaxParameter();
		param.url = getContextPath() + "/jersey-services/layoutit/frame/html/validate/"+this.getProjectDesignFileName()+"/";
		param.callBack=function(data){
			if(data != undefined && data.data){
				if(data.data != "success"){
					isExists = true;
				}
			}
		};
		dsTool.saveData(param);
		return isExists;
	},
	save:function(callback){
		if(!this.validate()){
			return ;
		}
		var project = {};
		//验证是否存在同名设计文件
		if(this.operator == "add"){
			if(this.isProjectDesignFileExists()){
				bootbox.alert("添加失败，存在同名设计文件，请修改后重试！");
				return ;
			}
		}
		var url = getContextPath() + "/jersey-services/layoutit/frame/html/add/"+this.getProjectDesignFileName()+"/";
		if(this.operator == "update"){
			url = getContextPath() + "/jersey-services/layoutit/frame/html/update/"+vm1438050062200.fileOldFullName+"/"+this.getProjectDesignFileName()+"/";
		}
		vm1438050062200.currentNodeID =this.getProjectDesignFileName();
		var msg = "工程【"+vm1438050062200.input_text_project_name+"】文件【"+vm1438050062200.input_text_fileName+"】";

		var param=new AjaxParameter();
		param.url= url;
		param.data = JSON.stringify(project);
		if(param.data == "{}"){
			param.data= null;
		}
		param.callBack=function(data){
			if(data != undefined && data.data){
				if(data.data == "success"){
					if(callback){
						callback(data);
					}
					bootbox.alert(msg+"提交成功！");
				}else{
					bootbox.alert(msg+"提交失败！");
				}
			}
		}
		dsTool.saveData(param);
	},
	saveAndOpen:function(callback) {
		var pname = this.projectName,
			fileFullPath = this.getProjectDesignFileName(),
			compName = this.componentName,
			fileName = vm1438050062200.input_text_fileName;

		if (fileName.indexOf(".html") < 0) {
			fileName += ".html";
		}

		var eventhandler = function () {
			if (callback) {
				callback();
			}
			window.parent.reloadCurrentProjectParam(pname, fileFullPath, fileName,compName);
			$(window.parent.document).find("[id=closeProjectDialog]").trigger("click");
		}
		this.save(eventhandler);
	},
	validate:function(){
		//重置验证状态
		this.resetValidationStatus();
		$("#divFileInfo").bootstrapValidator('validate');
		if($("#divFileInfo").data('bootstrapValidator').isValid()) {
			this.resetValidationStatus();
			return true;
		}
		return false;
	},
	getParentPageProjectParam:function(){
		var parentPageProjectParam = {};
		parentPageProjectParam.currentProject = this.projectName;
		parentPageProjectParam.currentFile = window.parent.currentFile;
		parentPageProjectParam.currentFileName = window.parent.currentFileName;
		parentPageProjectParam.componentName = this.componentName;
		parentPageProjectParam.reload = false;
		//当父页面打开的设计文件与当前编辑的文件相同时，需要刷新父页面参数。
		if(vm1438050062200.fileOldFullName == parentPageProjectParam.currentFile){
			parentPageProjectParam.currentFile =this.getProjectDesignFileName();
			parentPageProjectParam.currentFileName = vm1438050062200.input_text_fileName+".html";
			if(parentPageProjectParam.currentFile != vm1438050062200.fileOldFullName){
				parentPageProjectParam.reload = true;
			}
		}
		return parentPageProjectParam;
	},
	resetValidationStatus:function(){
		$("#divFileInfo").data('bootstrapValidator').resetForm();
	},
	getNextViewType:function(){
		return "designfile";
	},
	getCurrentNodeID:function(){
		return vm1438050062200.currentNodeID;
	},
	getProjectName:function(){
		return this.projectName;
	}
}


var projectModel = new ProjectDataModel();
var projectConfigViewManager = new ProjectConfigViewManager();
var projectNavigation = new ProjectNavigation();

$(document).ready(function(){
	projectModel.init();
	projectConfigViewManager.init();
	projectNavigation.init();

	$("#btnProjectAdd").click(function(){
		bootbox.confirm("如果只有一个工程，请使用默认工程！点击【取消】按钮取消添加操作！", function(result){
			if(result) {
				projectConfigViewManager.setCurrentView("project","add","");
				$("#btnProjectAdd").hide();
			}
		});
	})

	$("#btnProjectUpdate").click(function(){
		projectConfigViewManager.setCurrentView("project","update",vm1438050062200.currentNodeID);
		$(this).hide();
	});

	$("#btnProjectDelete").click(function(){
		projectConfigViewManager.delete();
		projectConfigViewManager.refreshView();
		projectNavigation.init();
	});

	$("#btnDataSourceAdd").click(function(){
		projectConfigViewManager.setCurrentView(
			"datasource",
			"add",
			projectConfigViewManager.getCurrentProjectName()
		);
		$(this).hide();
	})

	$("#btnDesignFileAdd").click(function(){
		projectConfigViewManager.setCurrentView(
			"designfile",
			"add",
			projectConfigViewManager.getCurrentProjectName()
		);
		$(this).hide();
	})

	$("#btnSave").click(function(){
		var callback = function(){
			projectConfigViewManager.refreshView();
			projectNavigation.init();
		}
		projectConfigViewManager.save(callback);
	});

	$("#btnSaveAndOpen").click(function(){
		projectConfigViewManager.saveAndOpen();
	});

	$("#btnSaveOpenTemplate").click(function(){
		var callback = function(){
			window.parent.hideModalDialog("projectModal");
			window.parent.showModalDialog("templateConfigDialog","模板选择","template/template.html");
		}
		projectConfigViewManager.saveAndOpen(callback);
	})

	$('#divProjectInfo').bootstrapValidator({
		fields:{
			input_text_project_name:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_.]+$/,
						message: '该字段只能是字母、整数、点和下划线'
					}
				}
			},
			input_text_project_local_path:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /(^([a-zA-Z]:)|([.]{0,2})\/([-a-zA-Z\u4e00-\u9fa5_0-9.]+\/{0,1})+$)|(^([a-zA-Z]:)|([.]{0,2})\\([-a-zA-Z\u4e00-\u9fa5_0-9.]+\\{0,1})+$)/,
						message: '该字段只能由字母、整数、中文、中划线、下划线和点组成。如：c:/工程1/test'
					}
				}
			} ,
			input_text_project_publish_path:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /(^([a-zA-Z]:)|([.]{0,2})\/([-a-zA-Z\u4e00-\u9fa5_0-9.]+\/{0,1})+$)|(^([a-zA-Z]:)|([.]{0,2})\\([-a-zA-Z\u4e00-\u9fa5_0-9.]+\\{0,1})+$)/,
						message: '该字段只能由字母、整数、中文、中划线、下划线和点组成。如：c:/工程1/test'
					}
				}
			} ,
			input_text_project_common_js_path:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /(^\/{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.]+\/{0,1})+$)|(^\\{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.]+\\{0,1})+$)/,
						message: '该字段只能由字母、整数、中文、中划线、下划线和点组成。如：js/common'
					}
				}
			},
			input_text_project_common_css_path:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /(^\/{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.]+\/{0,1})+$)|(^\\{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.]+\\{0,1})+$)/,
						message: '该字段只能由字母、整数、中文、中划线、下划线和点组成。如：css/common'
					}
				}
			},
			input_text_preview_port:{
				validators: {
					notEmpty: {message: '该字段必填且不能为空'},
					integer:{}
				}
			}
		}
	});

	$('#divDataSourceInfo').bootstrapValidator({
		fields:{
			input_text_ds_name:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_.]+$/,
						message: '该字段只能是字母、整数和下划线'
					}
				}
			}   ,
			input_text_ds_displayName:{
				validators: {
					notEmpty: {}
				}
			}   ,
			input_text_ds_ip:{
				validators: {
					notEmpty: {},
					ip:{}
				}
			}   ,
			input_text_ds_port:{
				validators: {
					notEmpty: {},
					integer:{}
				}
			}   ,
			input_text_ds_uriPrefix:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /(^\/{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.$]+\/{0,1})+$)|(^\\{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.$]+\\{0,1})+$)/,
						message: '该字段只能由字母、整数、中文、中划线、下划线和点组成。如：PMS/PO/'
					}
				}
			}
		}
	});

	$('#divFileInfo').bootstrapValidator({
		fields:{
			input_text_fileName:{
				validators: {
					notEmpty: {
						message: '该字段必填且不能为空'
					},
					regexp: {
						regexp: /^[-a-zA-Z0-9_]+$/,
						message: '该字段只能是字母、整数、中划线和下划线'
					}
				}
			}   ,
			input_text_file_relative_path:{
				validators: {
					regexp: {
						regexp: /(^\/{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.]+\/{0,1})+$)|(^\\{0,1}([-a-zA-Z\u4e00-\u9fa5_0-9.]+\\{0,1})+$)/,
						message: '该字段只能由字母、整数、中文、中划线、下划线和点组成。如：PMS/PO/'
					}
				}
			}
		}
	});

	//数据源列表
	bootstrapTable('table_base_local_datasource', adjustTableParam('','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"50","pageList":[50,100,200],"height":450,"search":true,"showColumns":false,"showRefresh":false,"sidePagination":"client","sortable":true,"idField":"$id","columns":[{"field":"$id","visible":false,"title":"ID","width":50,"class":"td-word-wrap"},{"field":"sourceName","title":"数据源ID","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":50},{"field":"name","title":"数据源名称","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":50},{"field":"ip","title":"IP","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":50},{"field":"port","title":"端口","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":50},{"field":"uriPrefix","title":"URL前缀","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":50},{"field":"uriPrefix","title":"操作","formatter":"ProjectDataSourceListView.dataSourceDeleteRowFormat","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":50}]}));
	//设计文件列表
	bootstrapTable('table_base_local_design_file', adjustTableParam('','undefined', 'undefined', {"striped":true,"pagination":true,"pageSize":"50","pageList":[50,100,200],"height":450,"search":true,"showColumns":false,"showRefresh":false,"sidePagination":"client","sortable":true,"idField":"$id","columns":[{"field":"$id","visible":false,"title":"ID","class":"td-word-wrap"},{"field":"fileName","title":"文件名","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap"},{"field":"fileType","title":"文件类型","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap"},{"field":"componentName","title":"组件名","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap"},{"field":"fileRelativePath","title":"相对路径","formatter":"","editable":false,"visible":true,"validate":"","class":"td-word-wrap"},{"field":"modifyTime","title":"修改时间","formatter":"ProjectDesignFileListView.designFileDateTimeRowFormat","editable":false,"visible":true,"validate":"","class":"td-word-wrap","width":200},{"field":"","title":"操作","formatter":"ProjectDesignFileListView.designFileDeleteRowFormat","editable":false,"visible":true,"validate":"","class":"td-word-wrap"}]}));

	$('div').removeClass('page-common');

})