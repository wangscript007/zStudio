/**
 * Created by 10177027 on 2015/9/18.
 */

/**
 * 服务器信息
 * @param ip
 * @param port
 * @param sourceName
 * @param uriPrefix
 * @param displayName
 * @constructor
 */
function ServerInfo(ip,port,sourceName,uriPrefix,displayName){
    this.ip = ip;//IP
    this.port = port;	//端口
    this.sourceName = sourceName;
    this.uriPrefix = uriPrefix;
    this.displayName = displayName;
}

ServerInfo.prototype={
    getIP:function(){
        return this.ip;
    },
    /**
     * 获取端口
     * @returns {*}
     */
    getPort:function(){
        return this.port;
    },
    /**
     * 获取资源URL
     * @returns {string}
     */
    getURL:function(){
        var url="http://"+this.ip+":"+this.port+"/";
        if(this.uriPrefix != undefined && this.uriPrefix != ""){
            var prefix = this.uriPrefix;
            if(prefix.indexOf("/") == 0 && prefix.length > 0){
                prefix = prefix.substr(1);
            }

            if(prefix.lastIndexOf("/") == prefix.length-1 && prefix.length > 0){
                prefix = prefix.substr(0,prefix.length -1);
            }

            if(prefix.length > 0){
                url += prefix+"/";
            }
        }
        return url;
    },
    /**
     * 获取数据源显示名称
     * @returns {*}
     */
    getDisplayName:function(){
        return this.displayName;
    },
    getSourceName:function(){
        return this.sourceName;
    }

}

/**
 * 多表数据源管理
 * @param serverInfo
 * @constructor
 */
function DataSource2MultiTable(serverInfo){
    this.serverInfo = serverInfo;
    this.multiTableNames = [] ;
    this.multiTableModel = new Map();
}
DataSource2MultiTable.prototype = {
    /**
     * 获取多表名称
     */
    _loadMultiTableNames:function(){
        var tableNames = [];
        var url = "/multitable/repository/object-definitions/names";
        if(this.serverInfo){
            url = getURLConcatPath(this.serverInfo.getURL(),url);
        }
        var param=new AjaxParameter();
        param.async = false;
        param.url=url;
        param.callBack=function(data){
            if(data && data.definitionNames){
                tableNames = data.definitionNames.split(" ");
            }
        }
        dsTool.getData(param);
        this.multiTableNames = tableNames;
    },
    /**
     * 获取多表模型定义
     * @param definitionName
     */
    _loadMultiTableModel:function(definitionName){
        var model = this.multiTableModel;
        var url = "/multitable/repository/object-definitions/model/"+definitionName;
        if(this.serverInfo){
            url = getURLConcatPath(this.serverInfo.getURL(),url);
        }

        var param=new AjaxParameter();
        param.async = false;
        param.url=  url;
        param.callBack=function(data){
            if(data){
                model.put(definitionName,data);
            }
        }
        dsTool.getData(param);
    },
    /**
     * 获取多表名称
     * @returns {Array}
     */
    getMultiTableNames:function(){
        if(this.multiTableNames.length == 0){
            this._loadMultiTableNames();
        }
        return this.multiTableNames;
    },
    /**
     * 获取多表模型JSON对象
     * @param definitionName
     */
    getMultiTableModel:function(definitionName){
        var model = this.multiTableModel.get(definitionName);
        if(!model){
            this._loadMultiTableModel(definitionName);
            model = this.multiTableModel.get(definitionName);
        }
        return model;
    },
    /**
     * 获取模型所在服务器信息
     * @returns {*}
     */
    getMultiTableModelServerInfo:function(){
        return this.serverInfo;
    },
    addMultiTableModel:function(data,callback){
        var url = "/multitable/repository/object-definitions/model/";
        if(this.serverInfo){
            url = getURLConcatPath(this.serverInfo.getURL(),url);
        }

        var param=new AjaxParameter();
        param.async = true;
        param.url=  url;
        param.data = data
        param.contentType = AjaxParameter.CONTENTTYPE.JSON;
        param.callBack=function(backData){
            if(backData&&callback){
                callback(backData);
            }
        }
        dsTool.saveData(param);
    },
    deleteMultiTableModel:function(definitionName,callback){
        var url = "/multitable/repository/object-definitions/model/"+definitionName;
        if(this.serverInfo){
            url = getURLConcatPath(this.serverInfo.getURL(),url);
        }

        var param=new AjaxParameter();
        param.async = true;
        param.url=  url;
        param.contentType = AjaxParameter.CONTENTTYPE.JSON;
        param.callBack=function(backData){
            if(backData&&callback){
                callback(backData);
            }
        }
        dsTool.deleteData(param);
    },
    updateMultiTableModel:function(data,callback){
        var url = "/multitable/repository/object-definitions/model/";
        if(this.serverInfo){
            url = getURLConcatPath(this.serverInfo.getURL(),url);
        }

        var param=new AjaxParameter();
        param.async = true;
        param.url=  url;
        param.data = data;
        param.contentType = AjaxParameter.CONTENTTYPE.JSON;
        param.callBack=function(backData){
            if(backData&&callback){
                callback(backData);
            }
        }
        dsTool.updateData(param);
    }
}


/**
 * 多表数据源信息获取接口
 * @constructor
 */
function ServerMultiTableDataSourceInfo(){
}
ServerMultiTableDataSourceInfo.serverInfo = new Map();
ServerMultiTableDataSourceInfo.dataSource = new Map();
ServerMultiTableDataSourceInfo.getCurrentProject = function() {
    var projectName;
    if(typeof(currentProject) != "undefined"){
        projectName = currentProject;
    }
    if(projectName == undefined){
        var paramsIndex = window.location.href.indexOf("pname");
        if(paramsIndex >-1){
            projectName = getQueryString(window.location.href,"pname");
        }
    }
    if (projectName == undefined) {
        projectName = window.parent.currentProject;
    }
    if(projectName == undefined){
        projectName = "default";
    }
    return projectName;
}
/**
 * 加载服务信息
 */
ServerMultiTableDataSourceInfo.loadServerInfo = function(){
    var param=new AjaxParameter();
    param.url="jersey-services/layoutit/frame/project/datasource/get/"+
        ServerMultiTableDataSourceInfo.getCurrentProject()+"/orm/";
    param.callBack=function(data){
        if(data) {
            $.each(data, function (index, subItem) {
                var serverInfo = new ServerInfo(subItem.ip, subItem.port, subItem.sourceName
                    , subItem.uriPrefix, subItem.displayName);
                ServerMultiTableDataSourceInfo.serverInfo.put(subItem.sourceName, serverInfo);
                ServerMultiTableDataSourceInfo.dataSource.put(subItem.sourceName, undefined);
            });
        }
    }
    dsTool.getData(param);
}
/**
 * 获取表单设计器数据源服务信息
 * @returns {Array}
 */
ServerMultiTableDataSourceInfo.getServerInfo = function(){
    if(ServerMultiTableDataSourceInfo.serverInfo.size() == 0){
        ServerMultiTableDataSourceInfo.loadServerInfo();
    }

    var result = [];
    if(ServerMultiTableDataSourceInfo.serverInfo.size()>0){
        $.each(ServerMultiTableDataSourceInfo.serverInfo.keySet(),function(index,item){
            result.push(ServerMultiTableDataSourceInfo.serverInfo.get(item));
        });
    }

    return result;
}
ServerMultiTableDataSourceInfo.getServerInfoByName = function(dataSourceName){
    var serverInfo = ServerMultiTableDataSourceInfo.getServerInfo();
    var result ;
    $.each(serverInfo,function(index,item){
        if(item.getSourceName() === dataSourceName){
            result = item;
            return false;
        }
    })

    return result;
}
/**
 * 获取多表数据源实例
 * @param serverName
 */
ServerMultiTableDataSourceInfo.getMultiTableDataSource = function(serverName){
    var datasource = ServerMultiTableDataSourceInfo.dataSource.get(serverName);
    if(!datasource){
        var serverInfo = ServerMultiTableDataSourceInfo.serverInfo.get(serverName);
        if(!serverInfo){
            ServerMultiTableDataSourceInfo.loadServerInfo();
            serverInfo = ServerMultiTableDataSourceInfo.serverInfo.get(serverName);
        }
        datasource = new DataSource2MultiTable(serverInfo);
    }
    return datasource;
}
/**
 * 获取多表数据对象名称
 * @param serverName
 * @returns {*}
 */
ServerMultiTableDataSourceInfo.getMultiTableNames = function(serverName){
    var datasource = ServerMultiTableDataSourceInfo.getMultiTableDataSource(serverName);
    if(datasource){
        return datasource.getMultiTableNames();
    }
    return [];
}
/**
 * 获取多表数据源模型
 * @param serverName
 * @param definitionName
 * @returns {*}
 */
ServerMultiTableDataSourceInfo.getMultiTableModel = function(serverName,definitionName){
    var datasource = ServerMultiTableDataSourceInfo.getMultiTableDataSource(serverName);
    if(datasource){
        return datasource.getMultiTableModel(definitionName);
    }
    return undefined;
}

/**
 * 获取数据集所有的表名称
 * @param serverName 服务名称
 * @param definitionName 数据集名称
 * @returns {undefined}
 */
ServerMultiTableDataSourceInfo.getMultiTableDataSetNames = function(serverName,definitionName) {
    var dataSets = [];
    var datasource = ServerMultiTableDataSourceInfo.getMultiTableDataSource(serverName);
    if (!datasource) {
        return dataSets;
    }
    /**
     * 获取多表模型
     */
    var model = datasource.getMultiTableModel(definitionName);
    if (!model) {
        return dataSets;
    }
    /**
     * 获取多表主表表名
     */
    if(model.tableName){
        dataSets.push(model.tableName);
    }
    /**
     * 获取从表表名
     */
    if(model.slaveTables){
        $.each(model.slaveTables, function (index, item) {
            if(item.tableName){
                dataSets.push(item.tableName);
            }
        })
    }
    return dataSets;
}

/**
 * 格式化数据列
 * @param data
 * @returns {Array}
 */
ServerMultiTableDataSourceInfo.formatDataTableFields = function(data) {
    var result = [];
    if (!data || data.length <= 0) {
        return result;
    }

    for (var i = 0; i < data.length; i++) {
        var columnName = data[i].column_name;
        var dataType = data[i].data_type;
        var characterlength = data[i].character_maximum_length;
        if (!dataType) {
            dataType = "string";
        }
        result.push(new DataColumn(columnName, dataType, characterlength));
    }
    return result;
}
/**
 * 获取数据集所有的表名称
 * @param serverName 服务名称
 * @param definitionName 数据集模型名称
 * @param datasetName 数据集表名
 * @returns {undefined}
 */
ServerMultiTableDataSourceInfo.getMultiTableDataSetFields = function(serverName,definitionName,datasetName) {
    var dataFields = [];
    var datasource = ServerMultiTableDataSourceInfo.getMultiTableDataSource(serverName);
    if (!datasource) {
        return dataFields;
    }
    /**
     * 获取多表模型
     */
    var model = datasource.getMultiTableModel(definitionName);
    if (!model) {
        return dataFields;
    }
    /**
     * 获取多表主表表名
     */
    if(model.tableName && model.tableName == datasetName){
        dataFields = model.fields;
    }
    /**
     * 获取从表表名
     */
    if(model.slaveTables){
        $.each(model.slaveTables, function (index, item) {
            if(item.tableName && item.tableName == datasetName) {
                dataFields = item.fields;
                return false;
            }
        })
    }

    return ServerMultiTableDataSourceInfo.formatDataTableFields(dataFields);
}
/**
 * 初始化单表元数据
 */
ServerMultiTableDataSourceInfo.initSingleTableDataSource= function () {
    var data = $.bfd.datasource.ormSingleTable.buildDataSource(ServerMultiTableDataSourceInfo.getCurrentProject());
    $.bfd.datasource().init(data);
}
/**
 * 获取数据库表字段
 * @param dataSourceId
 * @param tableName
 */
ServerMultiTableDataSourceInfo.getSingleTableFields = function(dataSourceId,tableName) {
    var fields = $.bfd.datasource().getDataSetFields(dataSourceId, dataSourceId, tableName);
    if (!fields || fields.length <= 0) {
        ServerMultiTableDataSourceInfo.initSingleTableDataSource();
        fields = $.bfd.datasource().getDataSetFields(dataSourceId, dataSourceId, tableName);
    }

    return fields;
}
/**
 * 获取数据库表
 * @param dataSourceId
 * @param tableName
 */
ServerMultiTableDataSourceInfo.getSingleTableNames = function(dataSourceId) {
    var tables = $.bfd.datasource().getDataSets(dataSourceId, dataSourceId);
    if (!tables || tables.length <= 0) {
        ServerMultiTableDataSourceInfo.initSingleTableDataSource();
        tables = $.bfd.datasource().getDataSets(dataSourceId, dataSourceId);
    }

    return tables;
}
