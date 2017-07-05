var pageParams;
function setPageParams(params) {
    pageParams = params
}

if(typeof(bootbox) === 'object') {
    bootbox.setDefaults({locale: "zh_CN"});
}

function setOperator() {
    var uri = pageParams ? pageParams : location.search; //获取url中"?"符后的字串
    uri = decodeURIComponent(uri);  //做次解码工作，避免url编码后无法获取参数
    var operator = "operator=";
    var index = uri.indexOf(operator);
    if (index == -1) {
        return false;
    }
    var tmp = uri.substring(index + operator.length);
    var index2 = tmp.indexOf("&");
    if (index2 > -1) {
        tmp = tmp.substring(0, index2);
    }
    if (tmp == "view" || tmp == "add" || tmp == "edit" || tmp == "query") {
        viewoperator = tmp;
    }
    else {
        console.log('页面参数operator传入错误，只运行传入"add, edit, view, query"中的一种。');
    }
}


// 根据页面传递参数获取数据操作的url路径
function getOperatorURL(dsname, tablename) {
    var method = "GET";
    if (typeof(viewoperator) == "undefined") {
        method = "GET";
    } else if (viewoperator === "add") {
        method = "POST";
    } else if (viewoperator === "edit") {
        method = "PUT";
    } else if (viewoperator === "delete") {
        method = "DELETE";
    }

    var dataSourceType = $.bfd.pageCache.getDataSourceType(dsname, tablename);
    if(dataSourceType === "orm" && typeof(eval("window." + dsname)) !== "undefined"){
        return getURLConcatPath(eval(dsname), "table/" + tablename);
    }

    var operation = $.bfd.pageCache.getOperationItem(dsname, tablename, method);
    if ($.bfd.pageCache.hasOperationItem(dsname, tablename, method)) {
        var url = $.bfd.pageCache.getOperationUrl(dsname, tablename, method),
            customUrl = $.bfd.pageCache.execOperationUrlFuc(dsname, tablename, method);
        if (customUrl !== "") {
            url = customUrl;
        }

        if (url === "") {
            url = getURLConcatPath(eval(dsname), "table/" + tablename);
        }

        return url;
    }
}

/**
 * 设置页面控件是否可用
 * @param vmid
 * @param operator
 */
function updateVMForComponentStatus(vmid, operator) {
    if (operator == undefined || operator == "undefined") {
        return;
    }

    var array = getEditorItem();
    if (operator == "edit") {
        operator = "modify";
    }
    $.each(array, function (index, item) {
        var ope = item.editable[operator];
        if (ope != undefined) {
            var status = true;
            if (ope == "checked") {
                status = false;
            }
            updateSubVMForComponentStatus(vmid, item.field, status);
        }
    });
}
/**
 * 更新子对象状态
 * @param field
 * @param viewModel
 * @param status
 */
function updateSubVMForComponentStatus(viewModel,uriPath,status){
    if (uriPath.indexOf(".") > -1) {
        var paths = uriPath.split("."),
            size = paths.length,
            tempData = new Map();

        tempData.put(0, viewModel.$model[paths[0]]);

        if (size > 1) {
            for (var i = 1; i < paths.length; i++) {
                var parentData = tempData.get(i - 1);
                tempData.put(i, parentData[paths[i]]);
                if(i+1 === size){
                    parentData[paths[i]] = status;
                }
            }
        }
    } else {
        viewModel.$model[uriPath] = status;
    }
}

/**
 * 添加用户自定义属性(界面组件凡是配置有init="true"属性的组件，可以可以添加组件对应的属性。)
 * @param attributes:编码后的属性串
 * @return 无
 */
var sysCustomAttributesArray = new Array();
function setCustomAttributes(attributes) {
    sysCustomAttributesArray.push(attributes);
}

/**
 * 添加vm到全局对象中，用于重置操作
 * @param vm:avalon viewModel实例
 */
var sysVmMap = new Map();

/**
 * 添加vm到全局对象中，用于重置操作
 * @param vm:avalon viewModel实例
 */
function setVMToMap(vm) {
    var model = JSON.stringify(vm.$model);
    sysVmMap.put(vm.$id, model);
}

/**
 * 获取VM信息
 * @param vmId：模型ID
 */
function getVMFromMap(vmId) {
    return JSON.parse(sysVmMap.get(vmId));
}
/**
 *重新初始化模型
 *@param vm:avalon vm 对象实例
 */
function initVMProperties(vm) {
    var oldModelInfo = getVMFromMap(vm.$id);
    for (var i in oldModelInfo) {
        vm[i] = oldModelInfo[i];
    }
}


/**
 * 获取模型字段
 * @param viewModel：vm对象
 * @return 字段名称数组
 */
function getVMProperties(viewModel) {
    var result = new Array();
    for (var item in viewModel.$model) {
        if (typeof(viewModel[item]) == "function" ||
            item.lastIndexOf("_form_disabled") > -1 ||
            item.lastIndexOf("_form_compute") > -1) {
            continue;
        }
        result.push(item);
    }

    return result;
}
/**
 * 获取模型数据
 * @param viewModel
 * @returns {{}}
 */
function getModelData(viewModel) {
    var newmodel = {};
    for (var pro in viewModel.$model) {
        if (typeof(viewModel.$model[pro]) === "function" || pro.indexOf("form_disabled") > -1 || pro.lastIndexOf("_form_compute") > -1) {
            continue;
        }
        if (viewModel.$model[pro] !== '' || typeof viewModel.$model[pro]==="number") {
            newmodel[pro] = viewModel.$model[pro];
        }
    }
    return newmodel;
}

var chartMap = new Map();

function setChartToMap(chartId, chart) {
    chartMap.put(chartId, chart);
}

function getChartFromMap(chartId) {
    return chartMap.get(chartId);
}


/**
 ORM支持的查询条件
 */
function QueryCondition() {
    this.cname;
    this.value;
    this.compare;
}
QueryCondition.prototype.getCName = function () {
    return this.cname;
}
QueryCondition.prototype.setCName = function (cname) {
    this.cname = cname;
    return this;
}
QueryCondition.prototype.getValue = function () {
    return this.value;
}
QueryCondition.prototype.setValue = function (value) {
    this.value = value;
    return this;
}
QueryCondition.prototype.getCompare = function () {
    return this.compare;
}
QueryCondition.prototype.setCompare = function (compare) {
    this.compare = compare;
    return this;
}

/*
 获取地址栏查询参数
 */
function getURLParameters(tableName) {
    var conditions = [];
    var uri = pageParams ? pageParams : location.search; //获取url中"?"符后的字串
    //uri="file:///D:/svn/ZXUEP_BCP_REPOS/trunk/src/layoutit3_web/src/web/test2.html?operator=add&id=xjl";
    var operator = "?";
    var params = uri.substr(uri.indexOf(operator) + 1).split("&");
    $.each(params, function (index, item) {
        var arr = item.split("=");
        if (arr[0] == "operator") {
            return true;
        }

        /**
         * url 中自定义参数不加入查询条件中。
         * */
        if (arr[0] && arr[0].indexOf("bfd_page_control_") > -1) {
            return true;
        }

        /**
         * 页面中存在多个(vm)数据表时，查询条件处理。
         * */
        if (arr[0] && arr[0].indexOf("bfd_page_params_") > -1) {
            conditions = conditions.concat(getBFDURLConditions(arr[1], tableName));
            return true;
        }

        var condition = new QueryCondition();
        condition.setCName(arr[0]).setCompare("=").setValue(decodeURIComponent(arr[1]));
        conditions.push(condition);
    });

    return conditions;
}

/**
 * 获取多表url查询条件
 * */
function getBFDURLConditions(params,tableName) {
    var queryConditions = [];

    if (!params) {
        return queryConditions;
    }

    var parsedParam = $.parseJSON(decodeURIComponent(params));
    var queryParams = parsedParam[tableName];
    if (!queryParams) {
        return queryConditions;
    }

    $.each(queryParams, function (index, item) {
        var condition = new QueryCondition();
        condition.setCName(item.cname).setCompare(item.compare).setValue(item.value);
        queryConditions.push(condition);
    })

    return queryConditions;
}

/**
 * 根据查询条件数组组装条件
 * @param conditions 条件数组
 * eg:
 var conditions = [];
 var condition = new QueryCondition();
 condition.setCName("columnname").setCompare("=").setValue("columnvalue");
 conditions.push(condition); // 多个条件push多个
 * @param operator 只能输入and/or字符串
 * @returns 条件对象
 */
function generateCondition(conditions, operator) {
    if (conditions.length == 0) {
        return {};
    }
    //如果条件只有一个参数，直接返回条件对象
    if (conditions.length == 1) {
        return conditions[0];
    }
    //条件有多个参数，返回组合对象
    if (operator == "and") {
        return {and: conditions};
    }
    else {
        return {or: conditions};
    }
}

/*
 判断模型中是否有属性
 */
function isPropertiesInViewModel(vmProperties, property) {
    var ret = false;
    for (var item in vmProperties) {
        if (item == property) {
            ret = true;
            break;
        }
    }
    return ret;
}


/**
 * 批量插入操作
 * eg：
 * var datas = [];
 * datas.push({processDefId:'processDefId_value',processDefName:'processDefName_value'});
 * datas.push({processDefId:'processDefId_value2',processDefName:'processDefName_value2'});
 * batchInsert("bcp", "prule", datas, function(data) {console.log(data)}); //bcp为dsname，prule为表名
 * @param dsname 数据源名称
 * @param tablename 表名
 * @param datas 数据数组，数组里的一个对象表示一调记录，只传入需要插入列的名称和值，形式为[{columnname1:value1,columnname2:value2,…},…]
 * @param successCallback 插入成功后的回调函数，回调方法有data参数，data包含两个属性{status: 1, message: "success"} ，其中status为1表示成功，其余情况为失败，message在status不为1时返回服务端的错误信息。
 */
function batchInsert(dsname, tablename, datas, successCallback) {
    var url = getOperatorURL(dsname, tablename);
    url = getMultiRowsOperatorUrl(url);

    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({columns: datas}),
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        async: true,
        success: function (data, textStatus) {
            if (typeof successCallback == "function") {
                successCallback(data);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            errorCallback(textStatus, errorThrown, url);
        }
    });
}

/**
 * 操作后orm返回结果处理
 * @param data 返回数据
 * @param successMessage 成功提示信息
 * @param failMessage 失败提示信息
 */
function operatorCallBack(data, successMessage, failMessage) {
    if (data != undefined && data.status != undefined) {
        if (data.status == 1) {
            bootbox.alert(successMessage);
        }
        else {
            console.error(data.message);
            bootbox.alert(failMessage);
        }
    }
    else {
        bootbox.alert(failMessage);
    }
}
/**
 * ajax调用请求失败后的统一处理
 * @param textStatus 状态
 * @param errorThrown 异常信息
 * @param url url
 */
function errorCallback(textStatus, errorThrown, url) {
    console.error("textStatus " + textStatus + " errorThrown " + errorThrown + " url " + url);
    bootbox.alert('ajax请求调用失败。');
}


//在view时隐藏所有按钮
function visiableComponent() {
    if (viewoperator == "view") {// { || viewoperator == "edit") {
        //$("button").attr("style","display:none");
        $.each($("button"), function (index, item) {
            if ($(item).attr("ms-click") != undefined) {
                $(item).attr("style", "display:none");
            }
        });
    }
}

/**
 * 根据表名，显示名、值等信息加载下拉框数据。<br />
 * eg: var zrdepartOptions=[];
 * getSelectOption("bcp","zrdepart","departname","id", zrdepartOptions, condition, isDistinct);
 * @param dsname 数据源名称
 * @param table 需要查询表名
 * @param name 显示名称列
 * @param value 显示值列
 * @param options 需要加载的数组对象，该对象必须外部定义。
 * @param condition 过滤条件，如果没有条件可以不传入该对象或者传为"undefined"
 * @param isDistinct 是否过滤掉重复数据，true表示需要过滤，false表示不需要过滤，不传值默认为false
 */
function getSelectOption(dsname, table, name, value, options, condition, isDistinct,customVal) {
    var customValue = customVal;
    var queryColumns = new Array();
    queryColumns.push({cname: name});
    queryColumns.push({cname: value});
    var param;

    if (condition == undefined || condition == "undefined") {
        param = {columns: queryColumns};
    }
    else {
        param = {columns: queryColumns, condition: condition};
    }

    //增加过滤掉重复数据接口
    if (isDistinct != undefined && isDistinct) {
        param.isDistinct = true;
    }


    var url = getOperatorURL(dsname, table) + "?param=" + encodeURIComponent(JSON.stringify(param));

    $.ajax({
        type: "GET",
        url: url,
        dataType: 'json',
        async: false,
        success: function (data, status) {
            var total = data.total;
            var rows = data.rows;
            var ops = {};
            for (var i = 0; i < total; i++) {
                ops[rows[i][name]] = rows[i][value];
            }
            //判断是否有用户自定义的值，有则将它添加到最前面
            var op = {};
            if(customValue != undefined){
                if(customValue instanceof Array){
                    for(var k=0 ; k<customValue.length;k++){
                        op[customValue[k].name] = customValue[k].value;
                    }
                }else{
                    op[customValue.name] = customValue.value;
                }
            }
            options.push(op);
            options.push(ops);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("textStatus " + textStatus + " errorThrown " + errorThrown + " url " + url);
            bootbox.alert('获取数据失败数据失败。');
        }
    });
}
/**
 * 查询数据集数据
 * @param dsname 数据源名称
 * @param table  数据集名称
 * @param columns 列名数组
 * @param condition 查询条件
 * @param isDistinct
 * @param callback 回调函数
 */
function getDatasetQueryURL(dsname, table, columns, condition, isDistinct) {
    if (!dsname || !table || !columns || columns.length <= 0) {
        return;
    }
    var queryColumns = new Array();
    $.each(columns, function (index, item) {
        queryColumns.push({cname: item});
    })

    var param;
    if (condition == undefined || condition == "undefined") {
        param = {columns: queryColumns};
    }
    else {
        param = {columns: queryColumns, condition: condition};
    }

    //增加过滤掉重复数据接口
    if (isDistinct != undefined && isDistinct) {
        param.isDistinct = true;
    }

    return getOperatorURL(dsname, table) + "?param=" + encodeURIComponent(JSON.stringify(param));
}

/**
 * 下拉框联动管理
 * @constructor
 */
function SelectAssociate() {
}
SelectAssociate.prototype = {
    /**
     * 将获取到的源下拉框数据统一转为数组
     * @param value
     * @returns {Array}
     * @private
     */
    _getRealValue: function (value) {
        var valueArr = [];
        if (!$.isArray(value)) {
            valueArr.push(value);
        } else {
            valueArr = value;
        }
        return valueArr;
    },
    /**
     * 获取源下拉框的选项
     * @param sourceIds 源下拉框ID数组
     * @returns {Map}
     * @private
     */
    _getSelectCondition: function (sourceIds) {
        var that = this;
        var selectMap = new Map();
        $.each(sourceIds, function (index, item) {
            var $item = $("#" + item);
            var selectValue = that._getRealValue($item.val());
            if (selectValue && selectValue.length > 0) {
                selectMap.put(item, selectValue);
            } else {
                return false;
            }
        });
        return selectMap;
    },
    /**
     * 对外公用的获取，并且加载联动下拉框的选项
     * @param sourceIds 源下拉框ID数组
     * @param targetId 联动下拉框ID
     * @param resultData 传入的联动下拉框的选项
     */
    selectValuesForApp: function (sourceIds, targetId, resultData) {
        var $targetId = $("#" + targetId);
        if (!$.isArray(sourceIds) || !$.isArray(resultData)) {
            console.log("传入参数有误！");
            return;
        }

        if (sourceIds.length > 0) {
            var ids = "";
            $.each(sourceIds, function (index, item) {
                if (ids.length > 0) {
                    ids = ids + ",";
                }
                ids = ids + '#' + item;
            });
            var that = this;
            $(ids).off('change').on('change', function () {
                if (resultData.length > 0) {
                    var options = [];
                    $.each(resultData, function (subIndex, subItem) {
                        options.push("<option value =" + subItem.value + ">" + subItem.name + "</option>");
                    });
                }
                $targetId.empty();
                $.each(options, function (index, value) {
                    $targetId.append('<option value="' + value.value + '">' + value.name + "</>");
                });
            });
        }
    },
    /**
     * 使用ORM方式获取，并且加载联动下拉框的选项
     * @param sourceId 源下拉框ID数组
     * @param targetId 联动下拉框ID
     * @param getURLCallBack 使用者定义的回调函数返回ORM的URL
     */
    selectValuesForOrm: function (sourceIds, targetId, getURLCallBack) {
        var $targetId = $("#" + targetId);
        if (!$.isArray(sourceIds) ) {
            console.log("传入参数有误！");
            return;
        }
        if ( sourceIds.length > 0) {
            var ids = "";
            $.each(sourceIds, function (index, item) {
                if (ids.length > 0) {
                    ids = ids + ",";
                }
                ids = ids + '#' + item;
            });
            var that = this;
            $(ids).off('change').on('change', function () {
                var conditionMap = that._getSelectCondition(sourceIds);
                var url = getURLCallBack(conditionMap);
                var resultData;
                $.ajax({
                    type: 'GET',
                    dataType: 'JSON',
                    async: false,
                    url: url,
                    success: function (data) {
                        resultData = data.rows;
                    }
                });
                var options = [];
                    $.each(resultData, function (key, value) {
                        var index = 0;
                        var optionName = "";
                        var optionValue = "";
                        for (var item in value) {
                            if (index == 0) {
                                optionName = value[item];
                            } else if (index == 1) {
                                optionValue = value[item];
                            }
                            index++;
                        }
                        options.push({name: optionName, value: optionValue});
                    });
                $targetId.empty();
                $.each(options, function (index, value) {
                    $targetId.append('<option value="' + value.value + '">' + value.name + "</>");
                });
            });
        }
    }
}

/**
 * 导入关联js文件
 * @type {string}

$.ajaxSettings.async = false;
var contextPath = getContextPath();
if(typeof  $.bfd === "undefined" || typeof  $.bfd.pageCache === "undefined") {
    $.getScript(contextPath + "/js/page/cache/page-cache-manage.js");
}

if(typeof PageModelManage === "undefined"){
    $.getScript(contextPath+"/js/page/operation/page-operation-base.js");
}

if(typeof $.bfd.singleTablePageModel === "undefined"){
    $.getScript(contextPath+"/js/page/operation/page-operation-orm.js");
}

if(typeof $.bfd.customJsonPageModel === "undefined"){
    $.getScript(contextPath+"/js/page/operation/page-operation-json.js");
}

if(typeof $.bfd.multiTablePageModel === "undefined"){
    $.getScript(contextPath+"/js/page/operation/page-operation-multitable.js");
}

$.ajaxSettings.async = true;
 */
