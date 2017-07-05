/**
 * Created by 10177027 on 2016/5/23.
 * orm 单表数据源元数据封装
 */

;(function($) {

    var OrmSingleTable = function(){
        this.currentProject = "default";
    }

    OrmSingleTable.prototype = {
        _loadServerInfo: function () {
            var param = new AjaxParameter(), result=[];
            param.url = "jersey-services/layoutit/frame/project/datasource/get/"
                + this.currentProject + "/orm/";
            param.async = false;
            param.callBack = function (data) {
                if (data) {
                    result = data;
                }
            }
            dsTool.getData(param);

            return result;
        },

        _loadTableNames: function (serverUrl) {
            var tableNames = [];
            var param = new AjaxParameter();
            param.async = false;
            param.url = getURLConcatPath(serverUrl, "metadata/tablenames");
            param.callBack = function (data) {
                if (data && data.tablenames) {
                    tableNames = data.tablenames.split(" ");
                    if (tableNames.length > 0) {
                        tableNames.sort();
                    }
                }
            }
            dsTool.getData(param);
            return tableNames;
        },

        /**
         * 加载数据模型表
         */
        _loadDataModelTableNames: function (serverUrl) {
            var tableNames = [],
                conditions = {},
                reqUrl = "table/data_model_info_table";

            conditions.columns = [{ "cname": "ID" }];
            conditions.orders = [];
            conditions.condition = {};
            reqUrl += "?param=" + encodeURIComponent(JSON.stringify(conditions));

            var param = new AjaxParameter();
            param.async = false;
            param.url = getURLConcatPath(serverUrl, reqUrl);
            param.callBack = function (data) {
                if (data && data.rows) {
                    $.each(data.rows, function (index, item) {
                        if (item && item.ID) {
                            tableNames.push(item.ID);
                        }
                    })

                    if (tableNames.length > 0) {
                        tableNames.sort();
                    }
                }
            }
            dsTool.getData(param);
            return tableNames;
        },

        _loadTableFields: function (dataset) {
            var dataColumns = [];
            var param = new AjaxParameter();
            param.url = getURLConcatPath(dataset.url, "metadata/table/" + dataset[DATA_SETS_COLUMN.NAME]);
            param.async = false;
            param.callBack = function (data) {
                if (data != undefined && data.status == 1) {
                    $.each(data.fieldInfos, function (index, item) {
                        var column = {};
                        column[DATA_FIELDS_COLUMN.ID] = item.column_name;
                        column[DATA_FIELDS_COLUMN.NAME] = item.column_name;
                        column[DATA_FIELDS_COLUMN.TYPE] = item.data_type;
                        if (!item.data_type) {
                            column[DATA_FIELDS_COLUMN.TYPE] = "string";
                        }
                        column[DATA_FIELDS_COLUMN.LENGTH] = item.character_maximum_length;
                        dataColumns.push(column);
                    })
                }
                else if (data != undefined && data.status == 0) {
                    console.error('查询表字段失败，错误信息：' + data.message);
                }
                else {
                    console.error('查询表字段失败，返回结果为空');
                }
            }
            dsTool.getData(param);
            return dataColumns;
        },

        buildDataSource: function (currentProject, useDataModel) {
            var dataSources = [], result = [], that = this;
            dataSources = this._loadServerInfo();
            this.currentProject = currentProject;

            $.each(dataSources, function (index, subItem) {
                var dataSource = {};
                dataSource[DATA_SOURCE_COLUMN.ID] = subItem.sourceName;
                dataSource[DATA_SOURCE_COLUMN.NAME] = subItem.displayName;
                dataSource[DATA_SOURCE_COLUMN.IP] = subItem.ip;
                dataSource[DATA_SOURCE_COLUMN.PORT] = subItem.port;
                dataSource[DATA_SOURCE_COLUMN.APP_PATH] = subItem.uriPrefix;
                dataSource[DATA_SOURCE_COLUMN.DSTYPE] = "orm";

                var prefix = "";
                if (subItem.ip && subItem.port) {
                    prefix = "http://" + subItem.ip + ":" + subItem.port + "/";
                }

                var url = getURLConcatPath(prefix, subItem.uriPrefix);

                var serverInfo = {};
                serverInfo[DATA_SERVICES_COLUMN.ID] = subItem.sourceName;
                serverInfo[DATA_SERVICES_COLUMN.NAME] = subItem.displayName;
                dataSource[META_DATA_KEY.SERVICES] = [serverInfo];

                var datasets = null;
                if (useDataModel) {
                    datasets = that._loadDataModelTableNames(url);
                } else {
                    datasets = that._loadTableNames(url);
                }

                var sets = [];
                if (datasets && datasets.length > 0) {
                    $.each(datasets, function (index, datasetItem) {
                        var dataset = {};
                        dataset[DATA_SETS_COLUMN.ID] = datasetItem;
                        dataset[DATA_SETS_COLUMN.NAME] = datasetItem;
                        dataset["url"] = url;
                        dataset[DATA_SETS_COLUMN.CALLBACK] = that._loadTableFields;
                        if ($.bfd.ViewModel && $.bfd.ViewModel.operation) {
                            dataset[META_DATA_KEY.OPERATIONS] = $.bfd.ViewModel.operation.getDefaultOperations(getURLConcatPath(subItem.uriPrefix, "table/" + datasetItem));
                        }

                        sets.push(dataset);
                    })

                    serverInfo[META_DATA_KEY.SETS] = sets;
                }

                result.push(dataSource);
            });

            return result;
        }
    }

    var DATA_SOURCE_COLUMN = $.bfd.datasource.DATA_SOURCE_COLUMN,
        DATA_SERVICES_COLUMN =$.bfd.datasource.DATA_SERVICES_COLUMN,
        DATA_SETS_COLUMN = $.bfd.datasource.DATA_SETS_COLUMN,
        DATA_FIELDS_COLUMN = $.bfd.datasource.DATA_FIELDS_COLUMN,
        META_DATA_KEY = $.bfd.datasource.META_DATA_KEY;

    $.bfd = $.bfd || {};
    $.bfd.datasource = $.bfd.datasource || {};
    $.bfd.datasource.ormSingleTable = new OrmSingleTable();

}(jQuery))