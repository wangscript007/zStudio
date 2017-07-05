/**
	* 根据表格id和表格初始化参数，构造表格
	* @param id 表格id
	* @parameter 初始化参数
*/
function bootstrapTable(id, parameter, heightRatio) {
	//兼容旧版本没有idTable参数
	if(typeof parameter.idTable === "undefined"){
		parameter.idTable = id;
	}
	parameter = createStyleSheet(parameter);
	$("#" + id).bootstrapTable(parameter)
		.on("post-body.bs.table",function(){
			$('[data-toggle="popover"]').popover();
		});
	//$(".fixed-table-body").addClass("layout-table-scrollable");
    $("table").addClass("layout-table");
    $("table>thead>tr").addClass("heading");

    if(heightRatio != undefined) {
        $(".fixed-table-body").css({height:heightRatio});
    }

	hideTableRadioOrCheckbox(id,parameter);



}



function createStyleSheet(parameter){

	var columns = parameter["columns"];
	if(!$.isArray(columns)){
		return parameter;
	}

	var style = new Array(),newColumns = new Array() ;
	style.push("<style>");

	$.each(columns, function(index,item){
		if(item["width"]){
			var cls = 'fix-'+index+"-"+getCurrentTime();
			item["class"]=cls;
			style.push("."+cls+"{width:"+item["width"]+"px !important;max-width:"+item["width"]+"px !important;min-width:"+item["width"]+"px !important;word-wrap: break-word;}");
			item["width"]=undefined;
		}
		newColumns.push(item);
	});

	parameter["columns"] = newColumns;
	style.push("</style>");

	$('head').append(style.join("\n"));

	return parameter;
}
/**
 * 是否隐藏单选框和多选框
 * @param id 表格id
 * @parameter 初始化参数
 */
function hideTableRadioOrCheckbox(id,parameter){
	if(typeof parameter["clickToSelect"] === "undefined"){
		return;
	}
	if(parameter["clickToSelect"]){
		$("#" + id).bootstrapTable().on('load-success.bs.table',function(){
			$(this).find(".bs-checkbox").addClass("hide");
		})
	}
}

/**
	* 获取表格选中数据，需要传入表格id参数，返回为数组
	* @param id 表格id
*/
function getTableSelectData(id) {
	var rows = $("#" + id).bootstrapTable().bootstrapTable('getSelections');
	if(rows == undefined) {
		rows = [];
	}
	return rows;
}

function getTableUpdateData(id) {
    var rows = $("#"+id).bootstrapTable("getData");
    if(rows == undefined) {
        rows = [];
    }
    var updaterows = [];
    $.each(rows, function(index, item) {
        if(item.isupdate != undefined && item.isupdate == true) {
            updaterows.push(item);
        }
    });
    return updaterows;
}

/**
 * 获取表格所有数据，需要传入表格id参数，返回为数组
 * @param id 表格id
 */
function getTalbeAllData(id) {
    var rows = [];
	try{
		rows = $("#"+id).bootstrapTable("getRealData") //去除一些额外的标记数据，如:-editable,-update
	}catch(err){
		rows = $("#"+id).bootstrapTable("getData");
	}
    if(rows == undefined) {
        rows = [];
    }
    return rows;
}

/**
 * 刷新表格数据，如果不传入options则只做刷新
 * @param id 表格id
 * @param options 表格支持的属性
 */
function refreshTable(id,options) {
	if(options){
		$("#"+id).bootstrapTable("refresh",options);
	}
	else {
		$("#"+id).bootstrapTable("refresh");
	}
}

/**
	* 根据表格id和属性名称获取表格属性
	* @param id 表格id
	* @param option 表格选项，
    *    例如： columns包含所有字段，拿到数据后需要过滤掉不需要字段。
    *          url为具体url
*/
function getTableOptions(id, option) {
	if(option==="columns"){
		return $("#" + id).bootstrapTable().data()["bootstrap.table"].options[option][0];
	}
	return $("#" + id).bootstrapTable().data()["bootstrap.table"].options[option];

}



/**
	控制表格工具栏按钮是否可用，当表格没有工具栏时调用该方法不会出错。
	@param id 表格id
*/
function controlTableToolbar(id) {
	if(id == undefined) {
		return;
	}
	var rows = getTableSelectData(id);
	if(rows != undefined && rows.length > 0)  {
		if(rows.length == 1) {
			$("#" + id + "ModifyBtn").removeAttr("disabled");
		}
		$("#" + id + "DeleteBtn").removeAttr("disabled");
	}
	else {
		$("#" + id + "ModifyBtn").attr("disabled","true");
		$("#" + id + "DeleteBtn").attr("disabled","true");
	}
}

/**
 * 查询按钮事件响应
 * @param vmid
 * @param tableid
 * @param dsname
 */
function queryOperator(vmid, tableid, dsname) {
    var vmProperties=getVMProperties(vmid);
    var conditions = new Array();
    $.each(vmProperties, function(index, item) {
        if(vmid[item] == undefined || vmid[item] == '') {
            return true;
        }
        var condition=new QueryCondition();
        condition.setCName(item);
        condition.setValue(vmid[item]);
        condition.setCompare("=");
        conditions.push(condition);
    });
    queryRemoteTable(tableid, conditions);
}

/**
 * 表格查询操作
 * @param id 表格id
 * @param conditions 过滤条件
 * 单个条件设置方法：
 * var condition = new QueryCondition();
 *   condition.setCName("columnname");
 *   condition.setValue("columnvalue");
 *   condition.setCompare("=");
 注意需要把:需要把条件放到数组中
 */
function queryRemoteTable(id, conditions, isDistinct) {
	var columns = getTableOptions(id, "columns");
	//默认的查询条件
	var oldCondidtion = getTableOptions(id, "initGenerateConditions") || {};
	//合并新条件
	var mergeCondition = generateCondition(conditions, "and");
	var url = getTableOptions(id, "url");
	var param = url.substring(url.indexOf("?param") + 7);
	url = url.substring(0, url.lastIndexOf("?"));
	var cols = [];
	$.each(columns, function (index, item) {
		if (item.field == "state_form_disabled") {
			return true;
		}
		cols.push({cname: item.field});
	});


	var obj = {};
	//放弃在 BootstrapTable.prototype.initServer中对默认条件的组合,放在此处，增加appendtoCondition(oldCondidtion,generateCondition(conditions, "and"))
	if ($.isEmptyObject(mergeCondition)) {
		obj = {columns: cols, condition: oldCondidtion};
	} else {
		obj = {columns: cols, condition: appendtoCondition(oldCondidtion, mergeCondition)};
	}

	var orders;
	if (param) {
		orders = JSON.parse(decodeURIComponent(param)).orders;
	}

	if (orders) {
		obj.orders = orders;
	}


	if (isDistinct) {
		obj.isDistinct = true;
	}
	url = url + "?param=" + encodeURIComponent(JSON.stringify(obj));
	refreshTable(id, {url: url});
}



/**
 * 删除远程表格数据
 * @param id 表格id
 * @param dsname 数据源名称
 * @param condition 删除条件，该条件为组织好的查询条件，单层条件可以使用generateCondition方法组织，嵌套条件
 * @param tablename 需要删除数据的数据表表名，只有在表格绑定的数据是多表时才需要传入这个参数，条件中的字段名必须保持与该表字段一致
 * @param successCallback 删除成功后的回调函数，回调方法有data参数，data包含两个属性{status: 1, message: "success"} ，其中status为1表示成功，其余情况为失败，message在status不为1时返回服务端的错误信息。
 * @param messageObj 消息对象，该对象形式为{isPopup:true/false, message:"提示内容"},在isPopup为true时提示内容才有效。
 */
function deleteRemoteTableData(id, condition, tablename, successCallback, messageObj) {

    var callback = function() {
        var rows = getTableSelectData(id);
        var url = getTableOptions(id, "url");
        url = url.substring(0, url.lastIndexOf("?"));
        var isSplitColumn = (tablename != undefined && tablename.length != 0);
        if(isSplitColumn) {
            url = url.substring(0, url.lastIndexOf("/")) + "/" + tablename;
        }

        url = url + "?param=" + encodeURIComponent(JSON.stringify({condition: condition}));
        $.ajax({
            type: "DELETE",
            url: url,
            //contentType :'application/x-www-form-urlencoded; charset=UTF-8',
            contentType :'application/json; charset=UTF-8',
            dataType: 'json',
            async: false,
            success: function (data, textStatus) {
                if(typeof successCallback == "function") {
                    successCallback(data);
                }
                else {
                    operatorCallBack(data, '删除数据成功。', "删除数据失败。");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                errorCallback(textStatus, errorThrown, url);
            }
        });
        refreshTable(id);
    }
    var message = "确认删除数据吗? ";
    if(messageObj !== undefined) {
        if(messageObj.isPopup === true) {
            if(messageObj.message !== undefined) {
                message = messageObj.message;
            }
            bootbox.confirm(message, function(result){
                if(!result) {
                    return;
                }
                callback();
            });
        }
        else {
            callback();
        }
    }
    else {
        bootbox.confirm(message, function(result){
            if(!result) {
                return;
            }
            callback();
        });
    }
}


/**
 * 删除选中行数据接口
 * @param tableId 表格ID
 * @param primaryKey 主键名称
 * @param tableName 数据表名称
 * @param successCallback 删除成功回调（可选参数）
 */
function deleteRTableBySelectedData(tableId,primaryKey,tableName,successCallback) {
	var rows = getTableSelectData(tableId);
	if (!rows || rows.length == 0) {
		bootbox.alert("请选择要删除的行数据！");
		return;
	}

	var condition = new QueryCondition();
	condition.setCName(primaryKey);
	condition.setValue(rows[0][primaryKey]);
	condition.setCompare("=");

	deleteRemoteTableData(tableId, condition, tableName, successCallback)
}

/**
 * 打开修改对话框
 * @param tableId
 * @param dialogId
 * @param primaryKey
 * @param url
 */
function openModifyDialog(tableId,dialogId,primaryKey,url) {
	var rows = getTableSelectData(tableId);
	if (!rows || rows.length == 0) {
		bootbox.alert("请选择要删除的行数据！");
		return;
	}

	if (rows.length > 1) {
		bootbox.alert("请选择一条数据进行修改操作！");
		return;
	}

	var targetUrl = url;
	if (targetUrl.indexOf("?") == -1) {
		targetUrl += "?operator=edit&" + primaryKey + "=" + rows[0][primaryKey];
	} else {
		targetUrl += "&operator=edit&" + primaryKey + "=" + rows[0][primaryKey];
	}
	targetUrl +="&bfd_page_params_time="+getCurrentTime();
	showModalDialog(dialogId, "", targetUrl);
}



/**
 * 添加表格记录，允许多行
 * @param tableid
 * @param rows
 * @example addRowtoLocalTable("table1",[{id:1,name:{value:"abc",editable:true}},{id:2,name:{value:"abc",editable:false}}])
 * @example addRowtoLocalTable("table1",[{id:1, name:'n'},{id:2, name:'2'}])
 */

function addRowtoLocalTable(tableid,rows){
	if(rows.length>0){
		var length = $("#"+tableid).bootstrapTable("getData").length;
		var newRows = [];

		$.each(rows,function(index,item){
			item.$id = length;
			length++;
			var newItem = {};
			newItem.$id = item.$id;
			$.each(item,function(name,value){
				if(value && typeof value === "object"){
					if(typeof value.editable === "undefined"){
						newItem[name] = value;
					}else{
						newItem[name] = value.value;
						newItem[name+'_editable'] = value.editable;
					}

				}else{
					newItem[name] = value;
				}
			})
			newRows.push(newItem);
		})
		$("#"+tableid).bootstrapTable('append',newRows);

		var getNewRows = $("#"+tableid).bootstrapTable('getData');

		//$.each(rows,function(index,item){
		//	$.each(item,function(name,value){
		//		if(typeof value === "object"){
		//			$('a[data-pk="'+item.$id+'"][data-name="'+name+'"]').each(function(e){
		//					setCellEditableToLocalTable($(this),value.editable);
		//			})
		//		}
        //
		//	})
		//})

		$.each(getNewRows,function(index,item){
			var attrs = [];
			$.each(item,function(name,value){
				attrs.push(name);
			})
			$.each(item,function(name,value){
				if($.inArray(name+'_editable',attrs)!=-1){
					$('a[data-pk="'+item.$id+'"][data-name="'+name+'"]').each(function(e){
						setCellEditableToLocalTable($(this),item[name+'_editable']);
					})
				}
			})
		})

	}else{
		console.log(" Method addRowtoLocalTable rows's length is not zero!");
	}
}


/**
 * 设置单元格可编辑性
 * @param jquery jQuery对象
 * @param flag true|false
 */
function setCellEditableToLocalTable(jquery,flag){
	if(flag){
		jquery.editable("enable");
	}else{
		jquery.editable("disable");
	}
}
/**
 * 设置列可编辑性
 * @param tableid
 * @param field
 * @param flag true|false
 * @example setColumnEditableToLocalTable('id',[{field:"age",flag:true},{field:"sex",flag:false}])
 */
function setColumnEditableToLocalTable(tableid,options){
	var $table = $("#"+tableid);

	if($.isEmptyObject($table)){
		return;
	}

	if(!$.isArray(options)){
		return;
	}

	$.each(options,function(index,item){
		$table.find('[data-name="'+item.field+'"]').each(function(){
			setCellEditableToLocalTable($(this),item.flag);
		})
	});
}


function rowStyle(row,index){
	var classes = ['active', 'success', 'info', 'warning', 'danger'];

	if (index % 2 === 0) {
		return {
			stylees: "  background-color: #F9F9F9;"
		};
	}
	return {};
}
function cellStyle(value,row,index){

	return {
		csses:"display:none"
	};
}
/**
 * 本地表格操作列格式化
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function operateFormatter(value, row, index) {
	return [
		'<a class="remove" href="javascript:void(0)" title="Remove">',
		'<i class="glyphicon glyphicon-remove"></i>',
		'</a>'
	].join('');
}

function popoverFormatter(value, row, index){
	//表格列最多显示19个字符的文本
	if(value && value.length>20){
		return ['<a href="#" class="col-a-popover" data-trigger="hover" data-toggle="popover" data-content="',value,'">',value.substring(0,10)+'...','</a>'].join("");
	}

	return value;

}

function stateFormatter(value, row, index) {
	return [
		'<div>11',
		value,
		'</div>'
	].join("");
}

/**
 * 本地表格操作列格式化
 * @param value
 * @param row
 * @param index
 * @returns {string}
 */
function editableFormatter(value, row, index) {
	var disabled =  arguments[1].$id==0?"disabled":"";
	return '<input type="text" data-field="'+this.field+'" class="form-textbox form-textbox-text" '+disabled+' value="'+value+'" />';
}

/**
 * 删除按钮事件
 * @type {{click .remove: Function}}
 */
window.operateEvents = {
	'click .remove': function (e, value, row, index) {
		var $table = $(this).parents("table");
		bootbox.confirm("确认删除数据吗？", function(result){
			if(!result) {
				return;
			}
			$table.bootstrapTable('remove', {
				field: '$id',
				values: [row.$id]
			});
			var getNewRows = $table.bootstrapTable('getData');
			$.each(getNewRows,function(index,item){
				var attrs = [];
				$.each(item,function(name,value){
					attrs.push(name);
				})
				$.each(item,function(name,value){
					if($.inArray(name+'_editable',attrs)!=-1){
						$('a[data-pk="'+item.$id+'"][data-name="'+name+'"]').each(function(e){
							setCellEditableToLocalTable($(this),item[name+'_editable']);
						})
					}
				})
			})
		})
	},
	'change .form-textbox-text': function (e, value, row, index) {
		var fieldName = $(this).data("field");
		var fieldValue = $(this).val();
		$(this).parents("table").bootstrapTable("updateCell",
			{
				index: index,
				field: fieldName,
				value: fieldValue
			}
		)


	}
};

function deleteServerTableRows(tableid){

	bootbox.confirm("确认删除数据吗？", function(result){
		if(!result) {
			return;
		}
		var columns = getTableOptions(tableid,"columns");
		var rows = $("#"+tableid).bootstrapTable("getSelections");
		var conditions = [],conditionsjson = {};

		$.each(rows, function(index, row) {
			var columnjson = {};
			var columnconditions = [];
			$.each(columns,function(index,column){
				if(column["primarykey"]){
					var condition=new QueryCondition();
					condition.setCName(column["field"]);
					condition.setValue(row[column["field"]]);
					condition.setCompare("=");
					columnconditions.push(condition);
				}
			});
			columnjson = {
				and:columnconditions
			}
			conditions.push(columnjson);
		});

		if(conditions.length>1){
			conditionsjson = {
				 condition :	{
						or : conditions
					}
			}
		}else if(conditions.length == 1){
			conditionsjson = {
				condition : conditions[0]
			}
		}

		var queryUrl = getTableOptions(tableid, "url");
		var tableName = queryUrl.substring(queryUrl.lastIndexOf("/")+1,queryUrl.lastIndexOf("?"));
		var deleteUrl = getOperatorURL(bcp, tableName)
			+ "?param=" + encodeURIComponent(JSON.stringify(conditionsjson));
		$.ajax({
			type: "DELETE",
			url: deleteUrl,
			contentType :'application/json; charset=UTF-8',
			async: false,
			success: function (data, textStatus) {
				bootbox.alert('删除数据成功。');
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				console.log("textStatus " + textStatus + " errorThrown " + errorThrown + " url " +deleteUrl);
				bootbox.alert('删除数据失败。');
			}
		});
		refreshTable(tableid);
	});
}

/**
 * 在oldCondition的基础上增加新的appendCondition
 * @param oldCondition 原有条件
 * @param appendCondition 需要追加的新条件，追加的新条件使用and
 * @return 新条件
 */
function appendtoCondition(oldCondition, appendCondition) {
    var newCondition;//deepClone(oldCondition);
    if (oldCondition == undefined || Object.getOwnPropertyNames(oldCondition).length == 0) {
        newCondition = appendCondition;
    }
    else {
        var conditions = [];
        conditions.push(oldCondition);
        conditions.push(appendCondition);
        newCondition = generateCondition(conditions, "and");
    }
    return newCondition;
}
/**
 * 调整表格url，根据default_common页面设置的orm路径调整。
 * @param dsname ds名
 * @param tbname 表名
 * @param param 表格参数
 * @returns {*}
 */
function adjustTableParam(talbeid, dsname, tbname, param) {
	if (!dsname || dsname === "undefined" ||
		!tbname || tbname === "undefined") {
		return param;
	}

	var dataSourceType = "orm";
	if ($.bfd && $.bfd.pageCache) {
		dataSourceType = $.bfd.pageCache.getDataSourceType(dsname, tbname);
		//param = param || {};
		var paramUrl = param.url;
		if (!paramUrl) {
			paramUrl = getOperatorURL(dsname, tbname);
		}

		if (dataSourceType && dataSourceType === "json") {
			param.url = paramUrl;
			return param;
		}

		/**
		 * 查询条件为空时，orm 接口默认将列参数加上。
		 */
		if (paramUrl.indexOf("?") === -1) {
			var cols = [];
			var columns = param.columns;//getTableOptions(talbeid, "columns");
			$.each(columns, function (index, item) {
				if (item.field == "state_form_disabled") {
					return true;
				}
				
				if (item.field == "$id") {
					return true;
				}
				
				cols.push({cname: item.field});
			});

			if (cols.length > 0) {
				param.url += paramUrl + "?param=" + encodeURIComponent(JSON.stringify({columns: cols, condition: []}));
			}
		}
	}

	if (!param || param.url == undefined) {
		return param;
	}
	var url = param.url;
	url = url.substring(url.indexOf("?"));
	var params = getURLParameters(tbname);
	if (params.length > 0 && typeof(isFilterTableData) != "undefined" && isFilterTableData == true) {
		var paramObj = JSON.parse(decodeURIComponent(url.substring("?param=".length)));
		paramObj.condition = appendtoCondition(paramObj.condition, generateCondition(params, "and"));
		url = getOperatorURL(dsname, tbname) + "?param=" + encodeURIComponent(JSON.stringify(paramObj));
	} else {
		url = getOperatorURL(dsname, tbname) + url;
	}

	param.url = url;
	param.dsname = dsname;
	param.tbname = tbname;
	var newParam;
	if (typeof(eval("window." + talbeid + "TableParamConfig")) == "function") {
		newParam = eval(talbeid + "TableParamConfig(param)");
	}
	if (newParam != undefined) {
		param = newParam;
	}

	if (dataSourceType && dataSourceType === "orm") {
		param = addDynamicCondition(param);
	}

	return param;
}


/**
 * 支持动态默认条件,此方法用于支持，在配置表格中设置默认条件
 * @param param
 * @example fn:getURLParam("abc",search)
 * @returns {*}
 */
function addDynamicCondition(param){
	//console.log(param.url)
	var url = param.url;
	if(!url){
		return param;
	}

	var http = url.substring(0,url.indexOf("?"));
	var args = JSON.parse(getUrlParam("param",url.substring(url.indexOf("?"))));
	if(!args){
		return param;
	}

	var conditions = [];
	if(!$.isEmptyObject(args["condition"])){
		if(args["condition"].hasOwnProperty("and")){
			conditions = args["condition"]["and"];
		}else if(args["condition"].hasOwnProperty("or")){

		}else{
			conditions.push(args["condition"]);
		}
		for(var i in conditions){
			if(!conditions[i]){
				continue;
			}
			var value = conditions[i]["value"];
			if(!value){
				continue;
			}
			//判断是否获取动态参数 fn:getURl
			if(typeof value === "string" && value.indexOf("fn:")==0){
				var fn =  value.substring("fn:".length);
				try{
					value = eval(fn);
				}catch(error){
					console.log("addDynamicCondition 方法中 "+fn+" 未定义!")
					return param;
				}
				conditions[i]["value"] = value;
			}

		}
		if(args["condition"].hasOwnProperty("and")){
			args["condition"]["and"] = conditions
		}else if(args["condition"].hasOwnProperty("or")){

		}else{
			args["condition"] = conditions[0];
		}
	}

	param.url = http+"?param="+encodeURIComponent(JSON.stringify(args));
	//console.log(param.url);
	return param;
}

/**
 * 根据表格id返回表格对应的vmid
 * @param tableid
 * @returns vmid
 */
function getVmidByTableid(tableid) {
    return $("#" + tableid).parents().find("div[ms-controller]").attr("ms-controller");
}

/**
 * 更新单元格
 * @param tableid
 * @param index
 * @param field
 * @param value
 */
function updateLocalTableCell(tableid,index,field,value){
	$("#"+tableid).bootstrapTable("updateCell",
		{index: index,field: field,value: value}
	);
	refreshLocalTableEditable(tableid);

}

/**
 * 更新字段是否可编辑
 * @param tableid
 * @param field
 * @param disabled
 */
function disabledLocalTableFiled(tableid,field,disabled){
	$('a[data-name="'+field+'"]').each(function(e){
		setCellEditableToLocalTable($(this),false);
	})
	var options = $("#"+tableid).bootstrapTable("getOptions");
	var columns = getTableOptions(tableid,"columns");
	$.each(columns,function(index,item){
		if(item["field"]==="sex"){
			item["editable"] = false;
		}
	})
	$("#"+tableid).bootstrapTable("refresh",options);
}
/**
 * 刷新表的可编辑性
 * @param tableid
 */
function refreshLocalTableEditable(tableid){
	var getNewRows = $("#"+tableid).bootstrapTable('getData');

	$.each(getNewRows,function(index,item){
		var attrs = [];
		$.each(item,function(name,value){
			attrs.push(name);
		})
		$.each(item,function(name,value){
			if($.inArray(name+'_editable',attrs)!=-1){
				$('a[data-pk="'+item.$id+'"][data-name="'+name+'"]').each(function(e){
					setCellEditableToLocalTable($(this),item[name+'_editable']);
				})
			}
		})
	})
}

/**
 * 根据表格id获取已编辑过的行数据。
 * @param id 表格id
 * @returns {Array}
 */
function getRemoteTableUpdateRows(id) {
    var rows = getTalbeAllData(id);
    var urows = [];
    $.each(rows, function(index, item) {
        if(item.isupdate != undefined && item.isupdate) {
            urows.push(item);
        }
    });
    return urows;
}

/**
 * 表格列格式化函数，显示效果为输入框
 * @param value
 * @param row
 * @param index
 */
function formatTableText(value, row, index) {
    this.isupdate = false;
    var val = value;
    if(value == undefined) {
        val = "";
    }
	if(this.isupdate){
		return '<input type="text" value="' + val + '" class="form-control" onblur="editorTableUpdate(' + index + ', this, \'' + encodeURIComponent(JSON.stringify(row)) + '\', \'' + this.field + '\', \'' + this.tableId + '\')" />';
	}

	return val;
}

/**
 * 表格列格式化函数，显示效果为下拉框，下拉框的选项内容由用户定义变量来保存，变量名为表格id+"_"+field名（是字段名，不是显示名）
 * eg：表格id为table_base1437984095297，对字段processType定义下拉框选择数据
 * 用户定义变量var table_base1437984095297_processType=[{key:"显示名1",value:"value1"},{key:"显示名2",value:"value2"}]，其中key为显示名，value为其值。
 * 注意：下拉框所有选项都是由变量决定的，建议增加一个“请选择”的选项，避免下拉框默认显示数据不正确
 * @param value
 * @param row
 * @param index
 */
function formatTableSelect(value, row, index) {
    this.isupdate = true;
    var select = ['<select class="form-control" onchange="editorTableUpdate(' + index + ', this, \'' + encodeURIComponent(JSON.stringify(row)) + '\', \'' + this.field + '\', \'' + this.tableId + '\')">'];
    var options = getDynamicVariable(this.tableId + "_" + this.field);

    if(options != undefined && options.length > 0) {
        $.each(options, function(index, item){
            if(value == item.value) {
                select.push('<option selected value="'+item.value+'">'+item.key+'</option>');
            }
            else {
                select.push('<option value="'+item.value+'">'+item.key+'</option>');
            }
        });
    }
    select.push('</select>');
    return select.join(" ");
}

/**
 * 表格列格式化函数，显示效果为checkbox，由于checkbox选中和非选中的值需要由用户定义变量来保存，变量名为表格id+"_"+field名（是字段名，不是显示名）
 * eg：表格id为table_base1437984095297，对字段assignee定义下拉框
 * 用户定义变量var table_base1437984095297_assignee={checkboxValue:"1", uncheckboxValue:"0"}，其中checkboxValue为选中时的值，uncheckboxValue为未选中时的值。
 * 注意：选中和非选中的值都是由变量决定的，如果不定义变量会导致数据不正确。
 * @param value
 * @param row
 * @param index
 */
function formatTableCheckbox(value, row, index) {
	this.isupdate = true;
	var val = getDynamicVariable(this.tableId + "_" + this.field);
	if(val != undefined && val.checkboxValue != undefined) {
		var html = '<input type="checkbox" onclick="editorTableUpdate(' + index + ', this, \'' + encodeURIComponent(JSON.stringify(row)) + '\', \'' + this.field + '\', \'' + this.tableId + '\')" value='+val.checkboxValue;
		if(val.checkboxValue === value) {
			html += " checked";
		}
		html += " />";
		return html;
	}
	return value;
}

/**
 * 表格编辑数据后处理函数，支持方法回调，回调方法名规则为表格id+"_EditCallback(tableid, row, field)"，内部使用
 * @param index
 * @param input
 * @param row
 * @param itemField
 * @param tableid
 */
function editorTableUpdate(index, input, row, itemField, tableid) {
    row = JSON.parse(decodeURIComponent(row));
    var value = $(input).val();
    if($(input).attr("type") != undefined && $(input).attr("type") == "checkbox") {
        var val = getDynamicVariable(tableid + "_" + itemField);
        if(val != undefined) {
            if(input.checked == true && val.checkboxValue != undefined) {
                row[itemField] = val.checkboxValue;
            }
            else if(input.checked == false && val.uncheckboxValue != undefined) {
                row[itemField] = val.uncheckboxValue;
            }
            else {
                row[itemField] = "";
            }
        }
    }
    else {
        if(row[itemField] === $(input).val()) {
            return;
        }
        row[itemField] = $(input).val();
    }
    row.isupdate = true;
    $('#'+tableid).bootstrapTable('updateRow', {index:index, row:row});
    applyFunc(tableid + "_EditCallback", [row, itemField]);
}

/**
 * 更新远程表格多行数据，行数据直接在表格中修改。
 * @param id 表格id
 * @param tablename 需要更新的表名，只有在更新的表与表格绑定的表不一致是才需要传入该参数 eg：表格绑定的是多表数据，这个时候是无法直接更新表数据的。
 */
function updateRemoteTableRows(id, tablename) {
    var url = getTableOptions(id, "url");
    url = url.substring(0, url.indexOf("?"));

    var rows = getTableUpdateData(id);

    var updaterows = [], commonColumns = [], keyColumns = [];
    var columns = getTableOptions(id, "columns");

    var isSplitColumn = (tablename != undefined && tablename.length != 0);

    $.each(columns, function(index, item) {
        if(item.primarykey == true) {
            keyColumns.push(item);
        }
        else {
            if(item.isupdate != undefined && item.isupdate == true) {
                commonColumns.push(item);
            }
        }
    });
    var datas = [];
    $.each(rows, function(index, item) {
        var columns = {}, conditions = [];
        $.each(commonColumns, function(index1, item1){
            if(item[item1.field] == undefined || item[item1.field] == "null") {
                return true;
            }
            var cname = item1.field;
            if(isSplitColumn && cname.indexOf("$$") > -1) {
                cname = cname.split("$$")[1];
            }
            columns[cname] = item[item1.field];
        });

        $.each(keyColumns, function(index1, item1){
            if(item[item1.field] == undefined) {
                return true;
            }
            var condition = new QueryCondition();

            var cname = item1.field;
            if(isSplitColumn && cname.indexOf("$$") > -1) {
                cname = cname.split("$$")[1];
            }
            conditions.push(condition.setCName(cname).setCompare("=").setValue(item[item1.field]));
        });
        if(conditions.length == 0) {
            console.error("updateRemoteTableRows conditions length is 0, please check data. ");
            return true;
        }
        datas.push({columns: columns, condition: generateCondition(conditions, "and")});
    });
    if(isSplitColumn) {
        url = url.substring(0, url.lastIndexOf("/")) + "/" + tablename;
    }
    $.ajax({
        type: "PUT",
        url:  getMultiRowsOperatorUrl(url),
        data: JSON.stringify({records:datas}),
        contentType :'application/json; charset=UTF-8',
        async: false,
        success: function (data, textStatus) {
            operatorCallBack(data, "数据更新成功。", "数据更新失败。");
            setTimeout(function() {refreshTable(id)}, 500);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorCallback(textStatus, errorThrown, url);
        }
    });
}
/**
 * 添加表单数据到本地表格
 * @param tableId 本地表格ID
 * @param validation 用户自字义验证函数，该函数返回为bool值，为true时才添加数据到本地表格
 */
function addFormDataToLocalTable(tableId,validation){
	var vmid,model;
		vmid = $(event.target).parents().find("[avalonctrl]").attr("id");
	 	model = eval(vmid);

	if(! model){
		return ;
	}

	if($("#" + vmid).data('bootstrapValidator')) {
		$("#" + vmid).data('bootstrapValidator').resetForm();
		$("#" + vmid).bootstrapValidator('validate');

		if (!$("#" + vmid).data('bootstrapValidator').isValid()) {
			return;
		}
	}

	var formData = getModelData(model);
	if(validation && !validation(formData)){
		return ;
	}

	if(isDataExistInLocalTable(tableId,formData)){
		bootbox.confirm("存在相同的数据，要继续添加吗？", function(result) {
			if(result){
				$("#"+tableId).bootstrapTable("appendData",[formData]);
			}
		});
	}else{
		$("#"+tableId).bootstrapTable("appendData",[formData]);
	}
}

/**
 * 批量插入本地表格数据到数据库
 * @param model avalon 模型
 * @param dsname 数据源名称
 * @param uri 数据库表名
 * @param tableid 本地表格id
 */
function batchInsertLocalTableData(model,dsname,uri,tableid) {
	var successCallback, localTableData, insertData;
	localTableData = getTalbeAllData(tableid);
	insertData = [];

	//提交前验证,验证函数返回bool值,为false表示验证失败，不提交数据，否则继续执行后续操作。
	if (typeof(eval("window." + model.$id + "SubmitValidate")) !== "undefined" &&
		!applyFunc(model.$id + "SubmitValidate",localTableData)) {
		return;
	}

	//提交后回调函数,如果用户定义了回调函数，则执行用户函数，否则执行默认函数。
	if (typeof(eval("window." + model.$id + "SuccessCallBack")) !== "undefined") {
		successCallback = eval("window." + model.$id + "SuccessCallBack");
	}else{
		successCallback = function (data) {
			if (data && data.status === 1) {
				bootbox.alert("添加成功！");
			} else {
				bootbox.alert("添加失败！");
			}
		};
	}

	//格式化待提交数据
	$.each(localTableData, function (index, item) {
		var data = {};
		for (var index in item) {
			if (index === "$id") {
				continue;
			}

			data[index] = item[index];
		}

		insertData.push(data);
	})

	batchInsert(dsname, uri, insertData, successCallback);
}

/**
 * 判断表格式中是否有相同的数据
 * @param tableid
 * @param data
 */
function isDataExistInLocalTable(tableid,data) {
	var localTableDatas = getTalbeAllData(tableid);
	if (!localTableDatas || localTableDatas.length === 0) {
		return false;
	}

	var isDataExist = true;
	$.each(localTableDatas, function (index, item) {
		isDataExist = true;

		for (var field in data) {
			if (item[field] !== data[field]) {
				isDataExist = false;
				break;
			}
		}

		if (isDataExist) {
			return false;
		}
	})

	return isDataExist;
}

/**
 * 表格查询返回响应适配函数
 * @param res
 * @returns {*}
 */
function tableResponseHandler(res) {
	var ret = $.bfd.pageCache.execOperationSuccessFuc(this.dsname, this.tbname, "GET", res);
	if (!ret) {
		ret = res;
	}
	//自定义函数
	if(this.globalFormat && !window.isDesignerMode) {
		ret = applyFunc(this.globalFormat, [ret]);
	}
	return ret;
}
