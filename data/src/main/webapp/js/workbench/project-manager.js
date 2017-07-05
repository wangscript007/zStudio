/**
 * Created by 10112872 on 2016/10/20.
 */

(function($, win) {
    var LOCAL_STORAGE_KEY_PROJECT_INFO = "projectInfo_datavisual";

	var KEEP_INTERVAL_MS = 5 * 60 * 1000;
	
	function getHtmlFileName(designFileName) {
		if (designFileName && designFileName.indexOf("&pname=") > -1) {
			designFileName = designFileName.substr(0, designFileName.indexOf("&pname="));
		}
		return designFileName;
	}
	
    var ProjectManagerMode_MAOComponent = function () {
		var hostname = window.location.hostname;
		window.workbench_Url = 'http://' + hostname + ':8080/workbench/';
		
		if (hostname.indexOf('.com') > -1) {
			window.workbench_Url = 'http://wb.51ksy.com/workbench/';
		}
		
		$(window).bind('beforeunload', function() {
			window.workbench.projectManager.exitProject();
		});
    };

	ProjectManagerMode_MAOComponent.prototype._requireLock = function(fileName) {
		fileName = getHtmlFileName(fileName);
		
		/////////////
		var result = null;
		$.ajax({
			type: "GET",
			url: window.workbench_Url + 'lock/require?formUrl=' + fileName,
			contentType :'application/json; charset=UTF-8',
			async: false,
			dataType: 'json',
			success: function (data, textStatus) {
				result = data;
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				result = {status : 0, message: '您的会话可能已失效，当前文件无法保存，请重新登录'}
			}
		});
		
		return result;
	}
	
	ProjectManagerMode_MAOComponent.prototype._releaseLock = function() {
		this._handleInvalidLock();
		
		var filename = this.lockingFileName;
		if (!filename) {
			return;
		}
		
		this.lockingFileName = "";
		fileName = getHtmlFileName(fileName);
		
		/////////////
		$.ajax({
			type: "GET",
			url: window.workbench_Url + 'lock/release?formUrl=' + fileName,
			contentType :'application/json; charset=UTF-8',
			async: false,
			dataType: 'json',
			success: function (data, textStatus) {
				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			}
		});
	};
	
	ProjectManagerMode_MAOComponent.prototype._startKeepingLock = function(filename) {
		this.lockingFileName = filename;
		
		// 获取成功，添加心跳更新锁的时间戳
		this.hasLock = true;
		var that = this;
		this.keepTimerId = setInterval(function() {
			that._keepLock();
		}, KEEP_INTERVAL_MS);
	};
	
	ProjectManagerMode_MAOComponent.prototype._keepLock = function() {
		if (!this.hasLock) {
			return;
		}
		
		fileName = getHtmlFileName(this.lockingFileName);
		
		/////////////
		var that = this;
		$.ajax({
			type: "GET",
			url: window.workbench_Url + 'lock/keep?formUrl=' + fileName,
			contentType :'application/json; charset=UTF-8',
			async: true,
			dataType: 'json',
			success: function (data, textStatus) {
				if (data.status != 1) {
					that._handleInvalidLock();
					alert(data.message);
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				// 可能发生在workbench重启后，会话失效，workbench会发出重定向到登录页面的命令，
				// 重定向得到的html导致json解析错误，进入此方法
				
				that._handleInvalidLock();
				
				alert('您的会话已失效，请重新登录');
			}
		});
	};
	
	ProjectManagerMode_MAOComponent.prototype._handleInvalidLock = function() {
		this.hasLock = false;
		
		// TODO 锁过期/会话失效，禁用保存、预览等会修改设计文件的功能
		window.workbench.ui.UIManager.disableBtnSave();
		window.workbench.ui.UIManager.disableBtnPreview();
		
		// 停止心跳
		clearInterval(this.keepTimerId);
	};
	
    ProjectManagerMode_MAOComponent.prototype.loadProject = function() {
        win.workbench.projectManager.closeCurrentProject();

        var designFilePath = getUrlParam("file", window.location.search);
        if (designFilePath == null || designFilePath == "") {
            return;
        }

        var currentFile = designFilePath;
        var currentProject = "default";
        if (currentFile.indexOf("pname=") > -1) {
            currentProject = currentFile.substr(currentFile.indexOf("pname=") + 6);
            if (currentProject.indexOf("&") > -1) {
                currentProject = currentProject.substring(0, currentProject.indexOf("&"));
            }
        }

        win.workbench.projectManager._loadProjectFile(currentProject, currentFile);
    };

    ProjectManagerMode_MAOComponent.prototype.loadProjectFile = function(projectName, filename, forceReloadProject) {

    };

    ProjectManagerMode_MAOComponent.prototype.loadFile = function(filename) {
        //加载设计文件内容
        if (filename == undefined || filename == null || filename == '') {
            // TODO 考虑界面的控制
            alert('请指定需要编辑的文件');
            return;
        }
		
		// 获取文件编辑锁
		var result = this._requireLock(filename);
		if (result.status != 1) {
			
			alert(result.message);
			return;
		} else {
			// 获取成功，添加心跳更新锁的时间戳
			this._startKeepingLock(filename);
		}

        // 检查文件是否存在
        var existFile = window.workbench.REST_API.isProjectDesignFileExists(filename);
        if (!existFile) {
            // 不存在则创建文件
            window.workbench.REST_API.createFile(filename);
        }

        window.workbench.projectManager._loadFile(filename);
    };
	
	ProjectManagerMode_MAOComponent.prototype.onCloseFile = function(filename) {
		this._releaseLock();
	};
	
	ProjectManagerMode_MAOComponent.prototype.onBeforeSaveFile = function(filename) {
		var result = this._requireLock(filename);
		if (result.status != 1) {
			alert(result.message);
			return false;
		} else {
			return true;
		}
	};

    //////////////

    var ProjectManagerMode_Standalone = function () {

    };

    ProjectManagerMode_Standalone.prototype.loadProject = function() {
        win.workbench.projectManager.closeCurrentProject();

        var lastProjectInfo = win.workbench.projectManager._loadProjectInfoFromLocalStorage();
        if (lastProjectInfo === false) {
            win.workbench.projectManager._setCurrentProject("default");

            selectProjectFile();
            return;
        }

        this._loadProjectFile(lastProjectInfo.currentProject, lastProjectInfo.currentFile);
    };

    ProjectManagerMode_Standalone.prototype.loadProjectFile = function(projectName, filename, forceReloadProject) {
        if (window.workbench.projectManager.getCurrentProject() != projectName || forceReloadProject) {
            window.workbench.projectManager.closeCurrentProject();
            this._loadProjectFile(projectName, filename);
        } else {
            // 还是当前的工程，然后直接加载文件
            window.workbench.projectManager._loadFile(filename);
        }
    };

    ProjectManagerMode_Standalone.prototype._loadProjectFile = function(projectName, filename) {
        window.workbench.projectManager._loadProjectFile(projectName, filename, function() {
            bootbox.alert("工程【" + window.workbench.projectManager.getCurrentProject() + "】不存在，请先配置工程信息！");
            $(".form-layout-east .file").html("工程" + window.workbench.projectManager.getCurrentProject() + "不存在！");

            //工程加载不成功，清除缓存信息。
            window.workbench.projectManager._removeProjectInfoFromLocalStorage();
        });
    };

    ProjectManagerMode_Standalone.prototype.loadFile = function(filename) {
        //加载设计文件内容
        if (filename != undefined && filename != null && filename != '') {
            window.workbench.projectManager._loadFile(filename);
        } else {
            // 若没有缓存上一次的设计文件信息，则打开选择文件对话框
            selectProjectFile();
        }
    };
	
	ProjectManagerMode_Standalone.prototype.onCloseFile = function(filename) {
	};
	
	ProjectManagerMode_Standalone.prototype.onBeforeSaveFile = function(filename) {
	};
    ////////////////////////////

    var ProjectManager = function() {
        /**
         currentProjectInfo.currentProject
         currentProjectInfo.currentProjectLocalPath
         currentProjectInfo.currentFile     //设计文件的全名
         currentProjectInfo.currentFileName //运行文件的名称，包含在设计文件名中，一般是xxx.html
         */
        this.currentProjectInfo = {};

        /**
         通过 jersey-services/layoutit/frame/projects/get/{projectName} 接口获取的project的服务端信息
         {
            "projectName": "default",
            "localPath":"../webapps/designer/layoutit/",
            "publishPath":"../webapps/designer/layoutit/",
            "commonjsPath":"js/common",
            "commoncssPath":"css/common",
            "previewPort":"8080",
            "previewPrefix":"/designer/layoutit/",
            "sourceList":[{"sourceName":"bcp","displayName":"BCP-OR","ip":"10.74.49.13","port":"8080","uriPrefix":"/dataservice/orm/","type":"orm","filePath":null},{"sourceName":"uds","displayName":"uds","ip":"10.74.49.13","port":"8080","uriPrefix":"/dataservice1/orm/","type":"orm","filePath":null}],
            "isI18n":"false",
            "projectDataSourceJSCode":"var bcp = \"http://10.74.49.13:8080/dataservice/orm/\";\nvar uds = \"http://10.74.49.13:8080/dataservice1/orm/\";\nvar isI18n = \"false\";\n"
        }
         */
        this.serverSideProjectInfo = null;
    };

    ProjectManager.prototype.setMode = function(mode) {
        this.mode = mode;
    };

    ProjectManager.prototype.isEditingFile = function() {
        return this.currentProjectInfo.currentFile != null
            && this.currentProjectInfo.currentFile != undefined
            && this.currentProjectInfo.currentFile != "";
    };

	ProjectManager.prototype.saveFile = function(showMessage) {
        if(!this.mode.onBeforeSaveFile(this.getCurrentFile())) {
			return;
        }

        var data = workbench.worksetManager.getSaveData();
		
		console.log(data);

        $.ajax({
            type: "POST",
            url: "jersey-services/layoutit/frame/html/save/" + this.currentProjectInfo.currentFile + "/",
            data: JSON.stringify(data),
            traditional: true,
            contentType :'application/json; charset=UTF-8',
            async: false,
            success: function (data, textStatus) {
                if (showMessage == undefined || showMessage) {
                    if (data.data === "success") {
                        bootbox.alert('保存成功。');
                    } else {
                        bootbox.alert('保存失败。');
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                bootbox.alert('保存过程中发生了错误。');
            }
        });
    };

    ProjectManager.prototype.loadProjectFile = function(projectName, file, forceReloadProject) {
        /*
        if (this.currentProjectInfo.currentProject != projectName || forceReloadProject) {
            this.closeCurrentProject();
            this._loadProjectFile(projectName, file, function () {
                bootbox.alert("工程【" + window.workbench.projectManager.getCurrentProject() + "】不存在，请先配置工程信息！");
                $(".form-layout-east .file").html("工程" + window.workbench.projectManager.getCurrentProject() + "不存在！");

                //工程加载不成功，清除缓存信息。
                window.workbench.projectManager._removeProjectInfoFromLocalStorage();
            });
        } else {
            // 还是当前的工程，然后直接加载文件
            this._loadFile(file);
        }
        */
        this.mode.loadProjectFile(projectName, file, forceReloadProject);
    };

    ProjectManager.prototype.closeCurrentProject = function() {
        //禁用以下设计文件相关的功能按钮
        $("#btn-preview, #btn-save").attr("disabled", "disabled");
        //清空布局器容器
        //$(".demo").html("");
        this._closeFile();
    };

    ProjectManager.prototype.loadProject = function() {
        this.mode.loadProject()
    };
	
	ProjectManager.prototype.exitProject = function() {
		this.mode.onCloseFile(this.getCurrentFile());
	};

    ProjectManager.prototype.getCurrentProject = function() {
        return this.currentProjectInfo.currentProject;
    };

    ProjectManager.prototype.getCurrentProjectLocalPath = function() {
        return this.currentProjectInfo.currentProjectLocalPath;
    };

    ProjectManager.prototype.getCurrentFile = function() {
        return this.currentProjectInfo.currentFile;
    };

    ProjectManager.prototype.getCurrentFileName = function() {
        return this.currentProjectInfo.currentFileName;
    };

    ProjectManager.prototype._loadProjectFile = function(projectName, filename, failCallback) {
        //加载工程信息
        var param = new AjaxParameter();
        param.url = "jersey-services/layoutit/frame/projects/get/" + projectName;
        param.async = true;
        param.callBack = function(data) {
            if(data != undefined && data != null) {
                window.workbench.projectManager._onProjectLoaded(data, filename);
            } else {
                if (failCallback) {
                    failCallback();
                }
            }
        };
        dsTool.getData(param);
    };

    /**
     *
     * @param filename 设计文件的文件全名
     */
    ProjectManager.prototype._loadFile = function(filename) {
        if(filename === undefined || filename === '') {
            return;
        }

        // 关闭当前编辑的文件，如果有的话
        this._closeFile();

        $.ajax({
                async: false,
                cache: false,
                type: 'GET',
                contentType :'application/json; charset=UTF-8',
                url: "jersey-services/layoutit/frame/html/get/" + filename + "/",
                success: function (data, textStatus) {
                    if (data != undefined && data.data != undefined && data.status == 1) {
                        // 恢复文件相关功能按钮为可用状态
                        $("#btn-preview,#btn-save").removeAttr("disabled");


                        workbench.projectManager._setCurrentFile(filename);
                        workbench.worksetManager.onRestoreDesignView(data.data);

                        //设置工程设计文件的预览路径
                        workbench.projectManager._setProjectPreviewPath();

                        $("body").css("min-height", $(window).height() - 110);
                        // $(".demo_parent").css("min-height", $(window).height() - 160);
                        //$("#design-view").css("height", $(window).height() - 180);
                    } else {
                        // 服务端没有对应的文件时，提示错误
                        bootbox.alert("文件不存在！");
                        workbench.projectManager._setCurrentFile("");
                    }
                }
            }
        );
    };

    ProjectManager.prototype._closeFile = function() {
		//this.mode.onCloseFile(this.getCurrentFile());
        workbench.worksetManager.onCloseDesignView();
    };

    ProjectManager.prototype._onProjectLoaded = function(project, filename) {
        this.serverSideProjectInfo = project;
        this._setCurrentProject(project.projectName);
        this._setCurrentProjectLocalPath(project.localPath);  //设置工程保存路径

        //初始化工程框架
        workbench.worksetManager.onInitFrame();	//initFrame();

        this.mode.loadFile(filename);
    };

    ProjectManager.prototype._setCurrentProject = function(currentProject) {
        this.currentProjectInfo.currentProject = currentProject;
        this._setCurrentProjectInfoToLocalStorage();
    };

    ProjectManager.prototype._setCurrentProjectLocalPath = function(currentProjectLocalPath) {
        if (currentProjectLocalPath == undefined || currentProjectLocalPath == undefined) {
            return;
        }
        this.currentProjectInfo.currentProjectLocalPath = currentProjectLocalPath;
        this._setCurrentProjectInfoToLocalStorage();
    };

    ProjectManager.prototype._setCurrentFile = function(currentFile) {
        if (currentFile == undefined || currentFile == undefined || currentFile == "") {
            this.currentProjectInfo.currentFile = "";
            this.currentProjectInfo.currentFileName = "";
            $(".form-layout-east .file").html("未打开文件");
        } else {
            this.currentProjectInfo.currentFile = currentFile;

            //解析出html文件的路径
            var currentFileName = currentFile;
            if (currentFileName.indexOf("$") >- 1) {
                currentFileName = currentFileName.substring(currentFileName.lastIndexOf("$") + 1);
            }
            if (currentFileName.indexOf("&") > -1) {
                currentFileName = currentFileName.substring(0, currentFileName.indexOf("&"));
            }
            this.currentProjectInfo.currentFileName = currentFileName;
            $(".form-layout-east .file").html(currentFileName);
        }

        this._setCurrentProjectInfoToLocalStorage();
    };

    ProjectManager.prototype._setCurrentProjectInfoToLocalStorage = function() {
        if (!storage.isStorage) {
            return ;
        }

        storage.put(LOCAL_STORAGE_KEY_PROJECT_INFO, JSON.stringify(this.currentProjectInfo));
    };

    /**
     * 从缓存中加载工程信息
     */
    ProjectManager.prototype._loadProjectInfoFromLocalStorage = function() {
        if(!storage.isStorage) {
            return false;
        }

        var projectInfoStr = storage.get(LOCAL_STORAGE_KEY_PROJECT_INFO);
        if (projectInfoStr != null) {
            return $.parseJSON(projectInfoStr);
        }

        return false;
    };

    /**
     * 从缓存中清除工程信息
     */
    ProjectManager.prototype._removeProjectInfoFromLocalStorage = function() {
        if (!storage.isStorage) {
            return false;
        }

        storage.remove(LOCAL_STORAGE_KEY_PROJECT_INFO);
    }

    ProjectManager.prototype._setProjectPreviewPath = function() {
        if (this.serverSideProjectInfo == undefined) {
            return;
        }

        //文件预览路径
        if (this.serverSideProjectInfo.previewPrefix == undefined) {
            this.serverSideProjectInfo.previewPrefix = "8080";
        }
        if (this.serverSideProjectInfo.previewPrefix == undefined) {
            this.serverSideProjectInfo.previewPrefix = "";
        }
        var host = window.location.host.replace(window.location.port, "");
        if (!window.location.port) {
            host += ":";
        }

        var previewPath = getURLConcatPath("http://" + host + this.serverSideProjectInfo.previewPort, this.serverSideProjectInfo.previewPrefix);
        var filePath = this.currentProjectInfo.currentFile.substring(0, this.currentProjectInfo.currentFile.lastIndexOf("$")).replace("@", ":").split("$").join("/");
        filePath = getURLConcatPath(filePath, "");
        var projectLocalPath = getURLConcatPath(this.serverSideProjectInfo.localPath, "");
        var relativePath = filePath.replace(projectLocalPath, "");
        previewPath = getURLConcatPath(previewPath, relativePath);
        previewPath = getURLConcatPath(previewPath, this.currentProjectInfo.currentFileName) + "?operator=add";
        $("#btn-preview").attr("href", previewPath);
    };

    win.workbench = win.workbench || {};
    win.workbench.projectManager = win.workbench.projectManager || new ProjectManager();

    win.workbench.ProjectManagerMode = {};
    win.workbench.ProjectManagerMode["standalone"] = new ProjectManagerMode_Standalone();
    win.workbench.ProjectManagerMode["maocomponent"] = new ProjectManagerMode_MAOComponent();
}(jQuery, window));