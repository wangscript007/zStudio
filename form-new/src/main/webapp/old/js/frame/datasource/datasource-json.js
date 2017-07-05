/**
 * Created by 10177027 on 2016/6/14.
 */
;(function($) {

    var DataSourceForJson = function () {
        this.currentProject = "default";
    }
    DataSourceForJson.prototype._loadServerInfo = function () {
        var param = new AjaxParameter(), that = this, result;
        param.url = "jersey-services/layoutit/frame/project/datasource/get/"
            + this.currentProject + "/json/";
        param.async = false;
        param.callBack = function (data) {
            if (data) {
                result = data;
            }
        }
        dsTool.getData(param);

        return result;
    }

    /**
     * 构建数据源
     * @param currentProject 工程名必选
     * @param dsName 数据源可选（数据源不为空时，则加载指定数据源）
     * @returns {Array}
     */
    DataSourceForJson.prototype.buildDataSource = function (currentProject, dsName) {
        this.currentProject = currentProject;

        var serverInfo = this._loadServerInfo();
        var param = new AjaxParameter(), that = this, result = [];
        $.each(serverInfo, function (index, item) {
            if (dsName && dsName !== item.sourceName) {
                return true;
            }

            param.url = item.filePath;
            param.async = false;
            param.callBack = function (data) {
                if (data) {
                    $.each(data, function (index, source) {
                        source.dsType = "json";
                        result.push(source);
                    })
                }
            }

            dsTool.getData(param);
        })

        return result;
    }

    $.bfd = $.bfd || {};
    $.bfd.datasource = $.bfd.datasource || {};
    $.bfd.datasource.datasourceForJson = new DataSourceForJson();

}(jQuery))