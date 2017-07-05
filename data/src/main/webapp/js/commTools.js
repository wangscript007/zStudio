/*
	工具类
*/
function Map(){
	this.container = new Object();
}

Map.prototype.put = function(key, value){
	this.container[key] = value;
}

Map.prototype.get = function(key){
	return this.container[key];
}


Map.prototype.keySet = function() {
	var keyset = new Array();
	var count = 0;
	for (var key in this.container) {
	    // 跳过object的extend函数
	    if (key == 'extend') {
	        continue;
	    }

	    keyset[count] = key;
	    count++;
	}
	return keyset;
}


Map.prototype.size = function() {
	var count = 0;
	for (var key in this.container) {
	// 跳过object的extend函数
	if (key == 'extend'){
	continue;
	}
	count++;
	}
	return count;
}


Map.prototype.remove = function(key) {
	delete this.container[key];
}


Map.prototype.toString = function(){
	var str = "";
	for (var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
	str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
	}
	return str;
}
/*
	获取当前时间
*/
function getCurrentTime()
{
	var date=new Date();
	return date.getTime();
}

function hasAttr(obj,attrName){
	if(typeof(obj.attr(attrName))==="undefined"){
		return false;
	}
	return true;
}

//Html编码获取Html转义实体
function htmlEncode(value){
  return $('<div></div>').text(value).html();
}
//Html解码获取Html实体
function htmlDecode(value){
  return $('<div></div>').html(value).text();
}

//对html进行转义  
function html2Escape(html) {
	var entityMap = {
	 "&": "&amp;",
	 "<": "&lt;",
	 ">": "&gt;",
	 '"': '&quot;',
	 "'": '&#39;',
	 "/": '&#x2F;',
	 " ": '&nbsp'
	 };	
	 return String(html).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	 });
}

//转意符换成普通字符
function escape2Html(str) {
    var entityMap={
        '&amp;' : '&',
        '&lt;' : '<',
        '&gt;' : '>',
        '&quot;' : '"',
        "&#39;" : "'",
        "&#x2F;" : '/',
        '&nbsp;' : ' '
    };
    return str.replace(/&(amp|lt|gt|quot|#39|#x2F|nbsp);/ig,function(s){
	    return entityMap[s];
    });
}

/**
 * 根据参数名获取url参数
 * @param name 参数名
 * @param search url所有参数
 * 如果是调用showModalDialog("dialog1", "新增表单","chenbo-form.html?operator=add")打开页面，需要获取该url中参数，search使用pageParams（该对象为框架定义的全局变量）
 * 如果是在本页面获取参数，使用window.location.search。
 * @returns 参数值，如果为空则返回null。
 */
function getUrlParam(name, search) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = search.match(reg);
    if(search.indexOf("?") > -1) {
        r = search.substring(1).match(reg);
    }
    if (r != null) {
        return unescape(r[2]);
    }
    return null; //返回参数值
}

function getQueryString(url,name) {
    if(!url || !name){
        return null;
    }
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
	if(url.indexOf("?")>-1){
		var r = url.substr(url.indexOf("?")+1).match(reg);
		if (r!=null) return (r[2]);
	}
	 return null;
}
/**
* 获取叠加后的URL路径
* */
function getURLConcatPath(prefix,suffix){
	var path ="";
	if(prefix != undefined && prefix !=""){
		var reg=new RegExp("[//]$","gi");
		prefix = prefix.replace(reg,"");
		path = prefix +"/";
	}
	if(suffix != undefined && suffix !=""){
		if(path != ""){
			var reg=new RegExp("^[//]","gi");
			suffix = suffix.replace(reg,"");
		}
		path += suffix;
	}
	return path;
}

/*
 ajax 请求参数定义
 */
function AjaxParameter(){
	this.url = undefined;	//服务url
	this.data = undefined;//发送到服务端的数据;
	this.async = false;//同步标志
	this.callBack = undefined;//回调函数
}
/**
 * 根据参数发送ajax请求，只需要定义相应参数即可
 * @param ajaxParameter AjaxParameter对象实例，包括url data async和 callBack调用。
 * eg:var param = new AjaxParameter(); param.url = ....设置需要参数
 * ajaxgetService(param)
 */
function ajaxgetService(ajaxParameter){
	$.ajax({
			async: ajaxParameter.async,
			cache: false,
			type: 'GET',
			dataType:"json",
			data:ajaxParameter.data,
			//contentType :'application/json; charset=UTF-8',
			url: ajaxParameter.url,
			success: function (data) {
				if(ajaxParameter.callBack){
					ajaxParameter.callBack(data);
				}
			},
			error:function (XMLHttpRequest, textStatus, errorThrown){
				console.log("请求服务["+ajaxParameter.url+"]错误：textStatus:"+textStatus+"|errorThrown:"+errorThrown);
			}
		}
	);
}

/**
 * 根据参数发送ajax请求，只需要定义相应参数即可
 * @param ajaxParameter AjaxParameter对象实例，包括url data async和 callBack调用。
 * eg:var param = new AjaxParameter(); param.url = ....设置需要参数
 * ajaxgetService(param)
 */
function ajaxpostService(ajaxParameter){
    $.ajax({
            async: ajaxParameter.async,
            cache: false,
            type: 'POST',
            dataType:"json",
            contentType: "application/json; charset=UTF-8",
            data:ajaxParameter.data,
            url: ajaxParameter.url,
            success: function (data) {
                if(ajaxParameter.callBack){
                    ajaxParameter.callBack(data);
                }
            },
            error:function (XMLHttpRequest, textStatus, errorThrown){
                console.log("请求服务["+ajaxParameter.url+"]错误：textStatus:"+textStatus+"|errorThrown:"+errorThrown);
            }
        }
    );
}

/**
 * 动态执行函数
 * @param string
 * @returns 函数返回内容
 */
function evalFunc(string) {
    return (new Function('return (' + string + ')')());
}

/**
 * 动态执行函数
 * @param fn 函数名字符串/函数名
 * @param args 参数数组
 * @return 动态执行函数后的返回结果
 */
function applyFunc(fn, args) {
    try {
        if(typeof (fn) == "string") {
            return eval(fn).apply(this, args);
        }
        else {
            return fn.apply(this, args);
        }
    }
    catch( e ) {

    }
}

/**
 * 根据变量名字符串获取变量内容
 * @param variableName 支持变量名字符串、或者变量本身
 * @return 如果变量为空则返回 undefined
 */
function getDynamicVariable(variableName) {
    if(variableName == undefined) {
        return undefined;
    }
    var variable;
    if(typeof(variableName) == "string") {
        try {
            variable = eval(variableName);
        }
        catch (e) { }
    }
    else {
        variable = variableName;
    }
    return variable;
}

/**
 * 深度克隆
 * @param 被克隆对象
 * @return 新对象
 */
function deepClone(obj) {
    var result, oClass = isClass(obj);
    //确定result的类型
    if (oClass === "Object") {
        result = {};
    } else if (oClass === "Array") {
        result = [];
    } else {
        return obj;
    }
    for (key in obj) {
        var copy = obj[key];
        if (isClass(copy) == "Object") {
            result[key] = arguments.callee(copy);//递归调用
        } else if (isClass(copy) == "Array") {
            result[key] = arguments.callee(copy);
        } else {
            result[key] = obj[key];
        }
    }
    return result;
}

/**
 * 返回传递给他的任意对象的类
 * @param o
 * @returns {string}
 */
function isClass(o) {
    if (o === null) return "Null";
    if (o === undefined) return "Undefined";
    return Object.prototype.toString.call(o).slice(8, -1);
}

/**
 * 根据单表url返回多表操作url
 * @param url
 */
function getMultiRowsOperatorUrl(url) {
    return url.substring(0, url.indexOf("table/")) + "multi/" + url.substring(url.indexOf("table/"));
}

/**
 * 本地存储
 * @constructor
 */
function LocalStorage() {
    this.isStorage = typeof window.localStorage == 'object';
    this.put = function(key, value) {
        localStorage.setItem(key, value);
    }

    this.get = function(key) {
        return localStorage.getItem(key);
    }

	this.remove = function(key){
		return localStorage.removeItem(key);
	}
}
/**
 * 定义本地存储变量
 * @type {LocalStorage}
 */
var storage = new LocalStorage();


/**
 * 寄生组合式继承模型
 * @param subType   子类
 * @param superType	 父类
 */
function inheritPrototype(subType,superType){
	var prototype = Object(superType.prototype);
	prototype.constructor = subType;
	subType.prototype = prototype;
}

/**
 * 初始化由模板生成的表格
 * @param tableId 表ID
 */
function initTemplateTable(tableId){
    var $table = $("#"+tableId),
        $parent = $table.parents('div[type="table_base_local"]'),
        $newTable = $('<table id="'+tableId+'"></table>'),
        rowData = $.isEmptyObject($parent.attr("rowdata"))?'[]':$parent.attr("rowdata"),
        columns = JSON.parse(decodeURIComponent(rowData)),
        data = [],
        row = {
            "$id":0
        };

        $parent.empty().append($newTable);

        columns.push({
            field: '$id',
            visible: false,
            title: 'ID',
            width: 50,
            'class': 'td-word-wrap'
        });



        columns.forEach(function(item){
            if(item.initData){
                row[item.field] = item.initData.defaultValue;
            }
            if(item.editable){
                row[item.field+EDITABLE_SUFFIX] = true;
            }
         })

         data.push(row);

        var parameter = {
            striped: true,
            pagination: true,
            pageSize: 10,
            height:300,
            pageList: [10,20,50,100,200],
            search: false,           
            showColumns: false,
            showRefresh: false,
            sidePagination: 'client',
            columns:columns,
            data:data,
            pk:["$id"]
        };
        $parent.attr("parameter",encodeURIComponent(JSON.stringify(parameter)));
        $newTable.bootstrapTable(parameter);
}


/**
 * ajax 请求参数定义
 * @constructor
 */
function AjaxParameter() {
    this.url=undefined;	//服务url
    this.data;//发送到服务端的数据;
    this.async=false;//同步标志
    this.callBack=undefined;//回调函数
    this.type = "GET";
    this.contentType = "application/json; charset=UTF-8";
}
AjaxParameter.CONTENTTYPE={
    JSON:'application/json; charset=UTF-8',
    X_WWW_FORM_URLENCODED:'application/x-www-form-urlencoded; charset=UTF-8'
};

function DataSourceTool(){
}

DataSourceTool.prototype = {
    sendRequest : function(ajaxParameter) {
       var ajaxRequest = $.ajax({
               async: ajaxParameter.async,
               cache: false,
               type: ajaxParameter.type,
               dataType: "json",
               timeout: 1000,
               data: ajaxParameter.data,
               contentType: ajaxParameter.contentType,
               url: ajaxParameter.url,
               success: function (data) {
                   if (ajaxParameter.callBack != undefined) {
                       ajaxParameter.callBack(data);
                   }
               },
               error: function (XMLHttpRequest, textStatus, errorThrown) {
                   console.log("请求服务[" + ajaxParameter.url + "]错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
               },
               complete: function (XMLHttpRequest, status) {
                   if (status == 'timeout') {//超时,status还有success,error等值的情况
                       ajaxRequest.abort();
                       console.log("请求服务[" + ajaxParameter.url + "]超时！");
                   }
               }
           }
        );
    },
    getData : function(ajaxParameter) {
        ajaxParameter.type = "GET";
        ajaxParameter.contentType = null;
        this.sendRequest(ajaxParameter);
    },
    saveData : function(ajaxParameter) {
        ajaxParameter.type = "POST";
        this.sendRequest(ajaxParameter);
    },
    deleteData : function(ajaxParameter) {
        ajaxParameter.type = "DELETE";
        this.sendRequest(ajaxParameter);
    },
    updateData : function(ajaxParameter) {
        ajaxParameter.type = "PUT";
        this.sendRequest(ajaxParameter);
    }
}

//Ajax数据访问
var dsTool=new DataSourceTool();


/**
 * 数据列
 * @param columnName
 * @param columnType
 * @param columnLength
 * @constructor
 */
function DataColumn(columnName,columnType,columnLength,parentUri){
    //列名
    this.columnName=columnName;
    //列类型
    this.columnType=columnType;
    //列长度
    this.columnLength=columnLength;
    //该字段是否使用
    this.flag = false;
    //获取父级uri
    this.parentUri = parentUri;
}
DataColumn.prototype ={
    getColumnName:function(){
        return this.columnName;
    },
    getColumnType:function(){
        return this.columnType;
    },
    getColumnLength:function(){
        return this.columnLength;
    },
    getFlag:function(){
        return this.flag;
    },
    setFlag:function(flag){
        this.flag = flag;
    },
    getParentUri:function(){
        return this.parentUri;
    }
}

/**
 * 获取应用名称
 * @returns {string}
 */
function getContextPath() {
    var contextPath = document.location.pathname;
    var index =contextPath.substr(1).indexOf("/");
    contextPath = contextPath.substr(0,index+1);
    delete index;
    return contextPath;
}

;(function($, win){
    win.DesignerTools = function () {

    }
    win._bfd = new DesignerTools();
})(jQuery, window);

