/**
 * Created by 10112872 on 2017/3/14.
 */
(function($, win) {
    var DatasourceManagerMode_MAOComponent = function () {

    };

    DatasourceManagerMode_MAOComponent.prototype.loadDataSourceInfo = function () {
        // 初始化orm数据源
        var datas = $.bfd.datasource.ormSingleTable.buildDataSource(window.workbench.projectManager.getCurrentProject(), true);
        $.bfd.datasource().init(datas);
    };

    var DatasourceManagerMode_Standalone = function () {

    };

    DatasourceManagerMode_Standalone.prototype.loadDataSourceInfo = function () {
        // 初始化orm数据源
        var datas = $.bfd.datasource.ormSingleTable.buildDataSource(window.workbench.projectManager.getCurrentProject());
        $.bfd.datasource().init(datas);
    };

    var DatasourceManager = function () {

    }

    DatasourceManager.prototype = {
        constructor : DatasourceManager,

        setMode: function (mode) {
            this.mode = mode;
        },

        loadDataSourceInfo : function () {
            this.mode.loadDataSourceInfo();
        }
    }

    win.workbench = win.workbench || {};
    win.workbench.datasourceManager = win.workbench.datasourceManager || new DatasourceManager();

    win.workbench.DatasourceManagerMode = {};
    win.workbench.DatasourceManagerMode["standalone"] = new DatasourceManagerMode_Standalone();
    win.workbench.DatasourceManagerMode["maocomponent"] = new DatasourceManagerMode_MAOComponent();
}(jQuery, window));