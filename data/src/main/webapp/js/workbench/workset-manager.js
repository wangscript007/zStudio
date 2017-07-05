/**
 * Created by 10112872 on 2016/10/20.
 */

(function($, win) {
    var WorksetManager = function() {
        this.worksetConfigURL = "workbench/worksets.json";
    };

    //  public method

    WorksetManager.prototype.loadWorksets = function() {
        var that = this;
        $.ajax({
            url: this.worksetConfigURL,
            type : 'get',
            dataType : 'json',
            cache : false,
            async : false,
            contentType : 'application/json; charset=UTF-8',
            success : function(json) {
                that._init(json);
            }
        });
    };

    // private method

    WorksetManager.prototype._init = function(json) {
        this.config = json;
        this.worksetConfigs = [];
        this.worksetId2WorksetConfig = {};

        // 解析每个插件的配置文件workset.json
        _.forEach(this.config.worksets, this._getWorksetConfig, this);

        //this._loadWorksetJS();
    };

    /**
     *
     * @param basePluginConfig
     * @private
     */
    WorksetManager.prototype._getWorksetConfig = function(baseWorksetConfig) {
        var url = this.config.baseUri + "/" + baseWorksetConfig.path + "/workset.json";
        var worksetConfig = null;
        $.ajax({
            url: url,
            type : 'get',
            dataType : 'json',
            cache : false,
            async : false,
            contentType : 'application/json; charset=UTF-8',
            success : function(data) {
                worksetConfig = data;
            }
        });

        // TODO 处理加载错误

        worksetConfig["base"] = baseWorksetConfig;
        this.worksetConfigs.push(worksetConfig);
        this.worksetId2WorksetConfig[worksetConfig.id] = worksetConfig;
    };

    /**
     * 加载各个插件的js文件
     */
    WorksetManager.prototype.setCurrentActiveWorkset = function(worksetId) {
        var that = this;
        var jsFiles = [];
        $.each(this.worksetConfigs, function(i, worksetConfig) {
            var jsUrlPrefix = that.config.baseUri + "/" + worksetConfig.base.path + "/";
            for (var i = 0; i < worksetConfig.js.length; i++) {
                var jsUrl = worksetConfig.js[i];
                var index = jsUrl.indexOf(".js");
                if (index > -1) {
                    jsUrl = jsUrl.substring(0, index);
                }
                jsFiles.push(jsUrlPrefix + jsUrl);
            }

        });

        //加载workset的js文件，并且在加载完成后，调用workset的初始化方法。
        requirejs(jsFiles, function() {
            var workset = that.getWorksetInstanceById(worksetId);
            that.workset = workset;
            that.worksetId = worksetId;

            workset.init(function() {
                window.workbench.worksetManager.onWorksetInitialized();
            });
        });
    };

    WorksetManager.prototype.onWorksetInitialized = function() {
        //初始化UI
        var worksetConfig = this.getWorksetConfigById(this.worksetId);
        window.workbench.ui.UIManager.init(worksetConfig.disabledFunctions);

		var dsManagerMode = win.workbench.DatasourceManagerMode[this.config.mode];
        if (dsManagerMode == null || dsManagerMode == undefined) {
            return;
        }
        window.workbench.datasourceManager.setMode(dsManagerMode);
		
        // 设置工程管理模式
        var projManagerMode = window.workbench.ProjectManagerMode[this.config.mode];
        if (projManagerMode == null || projManagerMode == undefined) {
            return;
        }
        window.workbench.projectManager.setMode(projManagerMode);
        window.workbench.projectManager.loadProject();
    };

    WorksetManager.prototype.currentWorkset = function() {
        if (this.workset) {
            return this.workset;
        }

        // 防御性编程：返回一个空行为的插件对象??
        return win.workbench.workset.IWorkset;
    };

    WorksetManager.prototype.getWorksetConfigById = function(worksetId) {
        return this.worksetId2WorksetConfig[worksetId];
    };

    WorksetManager.prototype.getWorksetInstanceById = function(worksetId) {
        var worksetConfig = this.worksetId2WorksetConfig[worksetId];
        if (worksetConfig) {
            return win.workbench.workset[worksetConfig.instanceName]();
        }

        // 防御性编程：返回一个空行为的插件对象??
        return win.workbench.workset.IWorkset;
    };

    // public api

    WorksetManager.prototype.onInitFrame = function() {
        this.currentWorkset().onInitFrame();
    };

    // 读取设计文件的内容，并恢复其在设计界面的显示
    WorksetManager.prototype.onRestoreDesignView = function(designFileContent) {
        this.currentWorkset().onRestoreDesignView(designFileContent);
    };

    WorksetManager.prototype.onCloseDesignView = function() {
        this.currentWorkset().onCloseDesignView();
    };

    WorksetManager.prototype.onDesignViewResized = function() {
        this.currentWorkset().onDesignViewResized();
    };

    WorksetManager.prototype.getSaveData = function() {
        return this.currentWorkset().getSaveData();
    };

    win.workbench = win.workbench || {};
    win.workbench.worksetManager = win.workbench.worksetManager || new WorksetManager();
}(jQuery, window));