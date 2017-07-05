/**
 * Created by 10112872 on 2016/10/20.
 */
(function($, win) {

    var OrmCommon = function() {
    };
    
    /**
     * 参数输出格式样例：
     * param={"columns":[{"cname":"gdp"}],"condition":{}}&offset=0&limit=5000
     */
    OrmCommon.prototype.transformCond2Param_old = function(condArr) {
    	//TODO  丰富查询条件转换，现UI不支持滤参数输入
    	var cntLimit = 10000;
    	var paramStr = "&offset=0&limit=" + cntLimit;
    	var param = {"condition" : {}};

        var removeGroupAndAggrMethod = false;

    	var columns = [];
    	var orders = [];
    	var groups = [];
    	condArr.forEach(function(item, index) {
    		if(item && item.fieldName) {
        		var temp = {};
        		var fieldName = item.fieldName;
        		var operation = item["operation"];
        		temp.cname = fieldName;
        		if (operation) {
        			var aggrMethod = operation["aggr"] ;
                    if (aggrMethod) {
                        if (aggrMethod == "none") {
                            // 有任意一个度量的聚合方式为“不聚合”，则都要删除掉查询中的group 字段和 聚合方法。
                            // 因为mysql不同版本对应group子句中没有出现的字段名是否可以出现在select中的要求是不一样的，
                            // 为了兼容各个版本的sql，只能按严格模式来组装sql语句
                            removeGroupAndAggrMethod = true;
                        } else {
                            temp["function"] = {"name": aggrMethod } ;
                        }
                    } else {
                        groups.push(fieldName);
                    }

        			//ORM : {"field":"<字段1列名>", order:asc}
                    var sortMethod = operation["sort"];
                    if (sortMethod && sortMethod != "none") {
                        orders.push({"field":fieldName, "order" : sortMethod});
                    }
        		}
        		columns.push(temp);    			
    		}
    	});
    	param.columns = columns;
    	param.orders = orders;
    	param.groups = groups;

        if (removeGroupAndAggrMethod) {
            param.groups = [];

            param.columns.forEach(function(item, index){
                delete item.function;
            });
        }

    	return encodeURIComponent(JSON.stringify(param)) + paramStr;
    };
	/////////////////////////
	
	 OrmCommon.prototype.transformCond2Param = function(condArr){
        //TODO  丰富查询条件转换，现UI不支持滤参数输入
        var cntLimit = 10000;
        var paramStr = "&offset=0&limit=" + cntLimit;
        var param = {};

        var removeGroupAndAggrMethod = false;

        var andWhere = [];
        var andHaving = [];
        var columns = [];
        var orders = [];
        var groups = [];

        condArr.forEach(function(item, index) {
            columns = columns.concat(item.columns);
			orders = orders.concat(item.orders);
			groups = groups.concat(item.groups);
			andHaving = andHaving.concat(item.havings);
			andWhere = andWhere.concat(item.wheres);
			
			removeGroupAndAggrMethod = removeGroupAndAggrMethod || item.removeGroupAndAggrMethod;
        });

        //暂时考虑过滤条件为and关系
        param["condition"] = {"and":andWhere};
        param["having"] = {"and":andHaving};
        param.columns = columns;
        param.orders = orders;
        param.groups = _.uniq(groups);

        if (removeGroupAndAggrMethod) {
            param.groups = [];

            param.columns.forEach(function(item, index){
                delete item.function;
            });
        }

        return encodeURIComponent(JSON.stringify(param)) + paramStr;
    };
	
	
	OrmCommon.prototype._getEmptyFieldsInfo = function() {
		return {
            "columns": [],
            "wheres": [],
            "groups": [],
            "havings": [],
            "orders": [],
            removeGroupAndAggrMethod : false
        };
	};
	
	OrmCommon.prototype.handlColumn_Metric = function(item) {
		var fieldsInfo = this._getEmptyFieldsInfo();
		
        var column = {
			cname: item.fieldName
		};
        
		var aggrMethod = item.operation.aggr;
        if (aggrMethod == "none" ) {
            // 有任意一个度量的聚合方式为“不聚合”，则都要删除掉查询中的group 字段和 聚合方法。
            // 因为mysql不同版本对应group子句中没有出现的字段名是否可以出现在select中的要求是不一样的，
            // 为了兼容各个版本的sql，只能按严格模式来组装sql语句
            fieldsInfo.removeGroupAndAggrMethod = true;
        } else {
            column["function"] = {"name": aggrMethod };
        }
		
		fieldsInfo.columns.push(column);
		
		//////////
		//ORM : {"field":"<字段1列名>", order:asc}
        var sortMethod = item.operation["sort"];
        if (sortMethod && sortMethod != "none") {
            fieldsInfo.orders.push({"field":item.fieldName, "order" : sortMethod});
        }

        return fieldsInfo;
    };
	
	OrmCommon.prototype.handlColumn_Dimension = function(item) {
		var fieldsInfo = this._getEmptyFieldsInfo();
		
		fieldsInfo.columns.push({
			cname: item.fieldName
		});
		
		//////////
		//ORM : {"field":"<字段1列名>", order:asc}
        var sortMethod = item.operation["sort"];
        if (sortMethod && sortMethod != "none") {
            fieldsInfo.orders.push({"field":item.fieldName, "order" : sortMethod});
        }
		
		fieldsInfo.groups.push(item.fieldName);

        return fieldsInfo;
    };
	
	OrmCommon.prototype.handleWhere = function(item) {
		var fieldsInfo = this._getEmptyFieldsInfo();
		
        //where过滤条件不放入param.columns中
        var operation = item["operation"];
        if (!operation["compare"] || !operation["value"]) {
			return fieldsInfo;
        }
		if(operation["compare"].split(" ")[0] == "between") {
			//比较符为between and 时，转换为两个条件 < > 进行查询
			fieldsInfo.wheres.push({
				cname: item.fieldName,
				compare: " > ",
				value: operation["compare"].split(" ")[1]
			});
            
            fieldsInfo.wheres.push({
				cname: item.fieldName,
				compare: " < ",
				value: operation["value"]
			});
        } else {
            fieldsInfo.wheres.push({
				cname: item.fieldName,
				compare: operation["compare"],
				value: operation["value"]
			});
        }

        return fieldsInfo;
    };
	
	OrmCommon.prototype.handleHaving_Metric = function(item) {
		var fieldsInfo = this._getEmptyFieldsInfo();
		
		var operation = item["operation"];
        if (!operation["compare"] || !operation["value"]) {
			return fieldsInfo;
        }
		
		///////////////
        var alias = item.fieldName + _.uniqueId();
		
		fieldsInfo.columns.push({
			cname: item.fieldName,
			function: {
				name: item.operation["aggr"],
				alias: alias
			}
		});
			
		//having 聚合函数条件查询时需使用别名
        if(operation["compare"].split(" ")[0] == "between") {
			//比较符为between and 时，转换为两个条件 < > 进行查询
			fieldsInfo.havings.push({
				cname: alias,
				compare: " > ",
				value: operation["compare"].split(" ")[1]
			});
            
            fieldsInfo.havings.push({
				cname: alias,
				compare: " < ",
				value: operation["value"]
			});
        } else {
            fieldsInfo.havings.push({
				cname: alias,
				compare: operation["compare"],
				value: operation["value"]
			});
        }
		
		return fieldsInfo;
    };
	
	OrmCommon.prototype.handleHaving_Dimension = function(item) {
		var fieldsInfo = this._getEmptyFieldsInfo();
		
		var operation = item["operation"];
        if (!operation["compare"] || !operation["value"]) {
			return fieldsInfo;
        }
		
		///////////////
        //var alias = item.fieldName + _.uniqueId();
		
		fieldsInfo.groups.push(item.fieldName);
			
		//having 聚合函数条件查询时需使用别名
        if(operation["compare"].split(" ")[0] == "between") {
			//比较符为between and 时，转换为两个条件 < > 进行查询
			fieldsInfo.havings.push({
				cname: item.fieldName,
				compare: " > ",
				value: operation["compare"].split(" ")[1]
			});
            
            fieldsInfo.havings.push({
				cname: item.fieldName,
				compare: " < ",
				value: operation["value"]
			});
        } else {
            fieldsInfo.havings.push({
				cname: item.fieldName,
				compare: operation["compare"],
				value: operation["value"]
			});
        }
		
		return fieldsInfo;
    };
	
	
	
	
	
	
	
	
	
	
	
	/////////////////////////////

    OrmCommon.prototype.getQueryUrl = function(dsInfo, condArr) {
    	return eval(dsInfo.datasource.id) +
            "table/" +
            dsInfo.dataset.name +
            "?param=" +
            this.transformCond2Param(condArr);
    };

    /**
     * api
     */
    OrmCommon.prototype.getChartData = function(dsInfo, condArr, successCallback) {
    	var url = this.getQueryUrl(dsInfo,condArr);
        var chartData =	this.getData(url, successCallback);
    	return chartData;
    };
    
    /**
     * api
     */
    OrmCommon.prototype.getData = function(url, successCallback) {
        var chartData ;
    	var asyncFlag = successCallback != null && typeof successCallback == "function";
        $.ajax({
            async: asyncFlag,
            cache: false,
            type: 'GET',
            contentType :'application/json; charset=UTF-8',
            url: url,
            success: function (data, textStatus) {
                var response;
                try {
                    response = JSON.parse(data);
                } catch (err) {
                    console.log(data);
                    return;
                }

                if (response && response.status == 1) {
					chartData = response.rows;
                    if (successCallback) {
                        successCallback(response.rows);
                    }
                } else {
                    console.log(JSON.stringify(response));
                }
            }
        });

        return chartData || [];
    };

    win.runtime = win.runtime || {};
    win.runtime.workset = win.runtime.workset || {};
    win.runtime.workset.OrmCommon = win.runtime.workset.OrmCommon || new OrmCommon();
}(jQuery, window));