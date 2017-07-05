/**
 * Created by 10177027 on 2016/5/23.
 * orm 单表数据源元数据封装
 */

; (function ($) {

    var OrmSingleTable = function () {
        this.currentProject = "default";
    }

    OrmSingleTable.prototype = {
        _loadServerInfo: function () {
            var param = new AjaxParameter(), that = this, result = [];
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
        /**
         * 构建数据源
         * @param currentProject 工程名必选
         * @param dsName 数据源可选（数据源不为空时，则加载指定数据源）
         * @param useDataModel 使用数据模型加载元数据
         * @returns {Array}
         */
        buildDataSource: function (currentProject, dsName, useDataModel) {
            var dataSources = [], result = [], that = this;
            this.currentProject = currentProject;

            dataSources = this._loadServerInfo();
            $.each(dataSources, function (index, subItem) {
                if (dsName && dsName !== subItem.sourceName) {
                    return true;
                }

                var dataSource = that._getDataSource(subItem),
                    url = that._getDataSourceUrl(subItem),
                    serverInfo = that._getServerInfo(subItem),
                    sets = that._getDataSets(url,subItem,useDataModel);

                dataSource[META_DATA_KEY.SERVICES] = [serverInfo];
                serverInfo[META_DATA_KEY.SETS] = sets;

                result.push(dataSource);
            });

            return result;
        },
        _getDataSource: function (dataSourceItem) {
            var dataSource = {};
            if (!dataSourceItem) {
                return dataSource;
            }

            dataSource[DATA_SOURCE_COLUMN.ID] = dataSourceItem.sourceName;
            dataSource[DATA_SOURCE_COLUMN.NAME] = dataSourceItem.displayName;
            dataSource[DATA_SOURCE_COLUMN.IP] = dataSourceItem.ip;
            dataSource[DATA_SOURCE_COLUMN.PORT] = dataSourceItem.port;
            dataSource[DATA_SOURCE_COLUMN.APP_PATH] = dataSourceItem.uriPrefix;
            dataSource[DATA_SOURCE_COLUMN.DSTYPE] = "orm";

            return dataSource;
        },
        _getDataSourceUrl: function (dataSourceItem) {
            var url = "";
            if (!dataSourceItem) {
                return url;
            }

            if (dataSourceItem.ip && dataSourceItem.port) {
                url = getURLConcatPath("http://" + dataSourceItem.ip + ":" + dataSourceItem.port + "/", dataSourceItem.uriPrefix);
            } else if (dataSourceItem.uriPrefix) {
                url = dataSourceItem.uriPrefix;
                if (dataSourceItem.uriPrefix.indexOf("/") != 0) {
                    url = "/" + dataSourceItem.uriPrefix;
                }
            }

            return url;
        },
        _getServerInfo: function (dataSourceItem) {
            var serverInfo = {};
            if (!dataSourceItem) {
                return serverInfo;
            }

            serverInfo[DATA_SERVICES_COLUMN.ID] = dataSourceItem.sourceName;
            serverInfo[DATA_SERVICES_COLUMN.NAME] = dataSourceItem.displayName;
            return serverInfo;
        },
        _getDataSets: function (dataSourceUrl, dataSourceItem, useDataModel) {
            var datasets = [], sets = [], that = this;
            if (useDataModel) {
                datasets = that._loadDataModelTableNames(dataSourceUrl);
            } else {
                datasets = that._loadTableNames(dataSourceUrl);
            }

            if (!datasets || datasets.length <= 0) {
                return sets;
            }

            $.each(datasets, function (index, datasetItem) {
                var dataset = {};
                dataset[DATA_SETS_COLUMN.ID] = datasetItem;
                dataset[DATA_SETS_COLUMN.NAME] = datasetItem;
                dataset["url"] = dataSourceUrl;
                dataset[DATA_SETS_COLUMN.CALLBACK] = that._loadTableFields;
                if ($.bfd.ViewModel && $.bfd.ViewModel.operation) {
                    dataset[META_DATA_KEY.OPERATIONS] = $.bfd.ViewModel.operation.getDefaultOperations(getURLConcatPath(dataSourceItem.uriPrefix, "table/" + datasetItem));
                }

                sets.push(dataset);
            })

            return sets;
        }
    }

    var DATA_SOURCE_COLUMN = $.bfd.datasource.DATA_SOURCE_COLUMN,
        DATA_SERVICES_COLUMN = $.bfd.datasource.DATA_SERVICES_COLUMN,
        DATA_SETS_COLUMN = $.bfd.datasource.DATA_SETS_COLUMN,
        DATA_FIELDS_COLUMN = $.bfd.datasource.DATA_FIELDS_COLUMN,
        META_DATA_KEY = $.bfd.datasource.META_DATA_KEY;

    $.bfd = $.bfd || {};
    $.bfd.datasource = $.bfd.datasource || {};
    $.bfd.datasource.ormSingleTable = new OrmSingleTable();

} (jQuery))