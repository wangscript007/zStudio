/**
 * Created by Administrator on 2015/8/11.
 */
if (typeof jQuery === "undefined") { throw new Error("ZteAce requires jQuery") }

if (!storage.isStorage){throw new Error("该浏览器不支持LocalStorage!")}
!function ($) {
    'use strict';

    var ZteAce = function (el, options) {
        this.options = options;
        this.$el = $(el);
        this.$el_ = this.$el.clone();
        this.timeoutId_ = 0;
        this.timeoutFooter_ = 0;

        this.init();
    };

    ZteAce.DEFAULTS = {
        mode: "ace/mode/javascript",
        theme: "ace/theme/iplastic",
        fontSize:"20px",
        showPrintMargin:false,
        autoScrollEditorIntoView: true
    };

    ZteAce.EVENTS = {
        'all.zte.ace': 'onAll'
    };

    ZteAce.prototype.init = function () {
        this.initTab();
    };

    ZteAce.prototype.initTab = function () {

    };

    ZteAce.prototype.getOptions = function () {
        return this.options;
    };

    var allowedMethods = [
        'getOptions',
        'getSelections', 'getAllSelections', 'getData',
        'load', 'append', 'prepend', 'remove', 'removeAll',
        'insertRow', 'updateRow', 'updateCell', 'removeByUniqueId',
        'showRow', 'hideRow', 'getRowsHidden',
        'mergeCells',
        'checkAll', 'uncheckAll',
        'check', 'uncheck',
        'checkBy', 'uncheckBy',
        'refresh',
        'resetView',
        'resetWidth',
        'destroy',
        'showLoading', 'hideLoading',
        'showColumn', 'hideColumn',
        'filterBy',
        'scrollTo',
        'getScrollPosition',
        'selectPage', 'prevPage', 'nextPage',
        'togglePagination',
        'toggleView'
    ];


    $.fn.zteAce = function (option) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
            var $this = $(this),
                data = $this.data('zte.ace'),
                options = $.extend({}, ZteAce.DEFAULTS, $this.data(),
                    typeof option === 'object' && option);

            if (typeof option === 'string') {
                if ($.inArray(option, allowedMethods) < 0) {
                    throw new Error("Unknown method: " + option);
                }

                if (!data) {
                    return;
                }

                value = data[option].apply(data, args);

                if (option === 'destroy') {
                    $this.removeData('zte.ace');
                }
            }

            if (!data) {
                $this.data('zte.ace', (data = new ZteAce(this, options)));
            }
        });

        return typeof value === 'undefined' ? this : value;
    };

    $.fn.zteAce.Constructor = ZteAce;
    $.fn.zteAce.defaults = ZteAce.DEFAULTS;
    $.fn.zteAce.methods = allowedMethods;

    // BOOTSTRAP TABLE INIT
    // =======================

    $(function () {
        $('[data-toggle="ace"]').zteAce();
    });

}(jQuery)

var jsEditor = new Object(),
    currentTab = null,
    options = {
        mode: "ace/mode/javascript",
        theme: "ace/theme/iplastic",
        fontSize:"20px",
        showPrintMargin:false,
        autoScrollEditorIntoView: true
    },
    postfix = "js",
    editors = "jsEditors";

function initAce(){
    $(".form-layout-east").hide();
   var mode = getUrlParam("mode",location.search);
    if(mode=="css"){
        $("title").text("CSS脚本编辑器-布局设计器")
        $("#header>.btn-group:last").addClass("hide");
        options["mode"] = "ace/mode/css";
        postfix = "css";
        editors = "cssEditors";

    }else if(mode === "js"){
        $("body").addClass("body-helper");
        $(".form-layout-east").show();
        $(".form-layout-east .body").mCustomScrollbar();
    }
}

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

/**
 * 初始化导航标签，如果本地存储上次浏览器打开的数据，自动加载
 */
function initMenu(){
    var editorStorage = storage.get(editors);
    if(editorStorage&& !$.isEmptyObject(JSON.parse(editorStorage))){
        jsEditor = JSON.parse(editorStorage);
        $.each(jsEditor,function(key,value){
            createNav(value["file"],value["contentId"],value["editorId"],value["active"]);
            //registerAceChange(value["editorId"]);
        })
    }else{
        var file = {
                projectName:undefined,
                relativePath:undefined,
                saved:false,
                filePath:undefined,
                fileName:"新建."+postfix,
                content:""
            };
        createNav(file,"new","editor",true);
        jsEditor["editor"] = {
            file:file,
            active:true,
            contentId:"new",
            editorId:"editor",
            ace: options
        };
        putEditorsLocalStorage();
    }
    initActiveTabAce();
}

/**
 * 初始化活动的TabAce编辑器
 */
function initActiveTabAce(){
    for(var i in jsEditor){
        var editorTab = jsEditor[i];
        if(editorTab["active"]){
            var editor = ace.edit(i);
            editor.setOptions(editorTab["ace"]);
            editor.setValue(editorTab["file"]["content"]);
            path_nav.empty().append(createBreadCrumb(editorTab["file"]));
            currentTab = $('#fileMenu>ul>li.active>a');
            return;
        }
    }
}
/**
 *  新建文件导航
 * @param file      file
 * @param contentId     Tab内容Id
 * @param editorId      ace编辑器Id
 * @param active        是否活动 true|false
 */
function createNav(file,contentId,editorId,active){
    nav_tabs.append(createNavTab(file,contentId,editorId,active));
    tab_contents.append(createTabContent(contentId,editorId,active));
}

/**
 *  新建文件导航Tab
 * @param file          file
 * @param contentId     Tab内容Id
 * @param editorId      ace编辑器Id
 * @param active        是否活动 true|false
 * @returns {string}
 */
function createNavTab(file,contentId,editorId,active){
    var html = [
        '<li role="presentation" ',active?'class="active">':'>',
        '<a href="#',contentId,'" aria-controls="',contentId,'" role="tab" data-editor="',editorId,'" data-toggle="tab">',
        '<span ',file["saved"]?'>':'class="glyphicon glyphicon-asterisk">',file["fileName"],'</span>',
        '<button type="button" class="close" aria-label="Close"><span aria-hidden="true">×</span></button>',
        '</a>',
        '</li>'
    ].join("");
    return html;

}

/**
 *  新建文件导航Tab内容
 * @param contentId     Tab内容Id
 * @param editorId      ace编辑器Id
 * @param active        是否活动 true|false
 * @returns {string}
 */
function createTabContent(contentId,editorId,active){

    return [
        '<div role="tabpanel" style="height:100%" class="tab-pane',active?' active':' ','" id="',contentId,'" >',
            '<div id="',editorId,'" style="height:100%" class="edit"></div>',
        '</div>'
    ].join("");

}

/**
 * 新建文件路径导航
 * @param file
 * @returns {string}
 */
function createBreadCrumb(file){

    return [
        '<ol class="breadcrumb">',
        file["projectName"]?'<li>'+file["projectName"]+'</li>':'',
        file["relativePath"]?'<li>'+file["relativePath"].slice(0,file["relativePath"].length-1)+'</li>':'',
        '<li class="active">',file["fileName"],'</li>',
        '</ol>'
    ].join("");
}
/**
 *
 * @param file
 */
function createNewFile(file){
    var contentId = "file"+getCurrentTime(),
        editorId = "editor"+getCurrentTime(),
        currentEditorId = currentTab.data("editor");

        nav_tabs.find("li.active").removeClass("active");
        tab_contents.find("div.active").removeClass("active");

        createNav(file,contentId,editorId,true);
        path_nav.empty().append(createBreadCrumb(file));

        ace.edit(currentEditorId).destroy();
        var editor = ace.edit(editorId);
        editor.setOptions(options);
        editor.setValue(file["content"]);

        registerAceChange(editorId);

        jsEditor[editorId] = {
            file:file,
            active:true,
            contentId:contentId,
            editorId:editorId,
            ace:options
        }
        for(var id in jsEditor){
            if(id != editorId){
                jsEditor[id]["active"] = false;
            }
        }
        putEditorsLocalStorage();
        
        currentTab = $('a[href="#'+contentId+'"]');

    $('#fileMenu a[data-toggle="tab"]').off('shown.bs.tab').on('shown.bs.tab',function(e){
        saveDataWhenChangeTab(e);
    });
    $('#fileMenu button.close').off('click').on("click",function(e){
        var jquery = $(e.currentTarget);
        if(jsEditor[currentTab.data("editor")]["file"]["saved"]){
            delNavTab(jquery);
        }else{
            saveModalDialog(jquery);
        }

    })

}

/**
 * 初始化指定远程uri,返回该目录下的所有文件信息
 * {
 *      commonjsPath: "js/common",
 *      localPath: "F:/tomcat7/webapps/layoutit/",
 *      name: "default",
 *      previewPort: "8080",
 *      previewPrefix: "/designer/",
 *      publishPath: "F:/tomcat7/webapps/layoutit/"
 *      sourceItem:{
*              displayName: "BCP-OR",
*              ip: "10.74.216.19",
*              name: "bcp",
*              port: "8080",
*              uriPrefix: "/dataservice/orm/"
 *     }
 * }
 */
function initRemoteFileData(){
	if(location.search.indexOf("tenantid=") != -1){
		var tenantid = location.search.substring(location.search.indexOf("tenantid=")+9);
	}
    var param=new AjaxParameter();
    param.url= getContextPath() + "/jersey-services/layoutit/frame/projects/info/";
    param.callBack=function(data){
        if(data != undefined){
            $.each(data,function(index,item){
                //默认加载第一个项目，暂不支持多个项目
                if(index==0){
                    var commonPath = "/js/common/";
                    if(postfix=="css"){
                            commonPath = typeof item["commoncssPath"] === "undefined"?"/css/common/":item["commoncssPath"];
                    }else{
                        commonPath = typeof item["commonjsPath"] === "undefined"?"/js/common/":item["commonjsPath"];
                    }
                    //var commonjsPath = typeof item["commonjsPath"] === "undefined"?"/js/common/":item["commonjsPath"];
					var basePath = item["localPath"].replace(/\\/g,"/");
                    var rootPath = basePath+transformPath(commonPath);
                    $("#rootPath").val(basePath);
                    $("#projectName").val(item["name"]);
                    if(tenantid){
						$("#relativePath").val(tenantid + "/" + transformPath(commonPath));
						$("#filesTable").bootstrapTable("refresh",{url: getContextPath() + "/jersey-services/layoutit/files/get?filePath="+basePath+tenantid + "/" + transformPath(commonPath)})
					}else{
						$("#relativePath").val(transformPath(commonPath));
						$("#filesTable").bootstrapTable("refresh",{url: getContextPath() + "/jersey-services/layoutit/files/get?filePath="+rootPath})
					}
                    $("#fileName").parent().next().text("."+postfix);
                    
                }

            })
        }
    }

    dsTool.getData(param);
}

/*
 * 初始化filePath的格式
 */
function responseHandler(res) {
	var exp = $('#rootPath').val();
		// linux目录下以'/'开头
		if(exp.indexOf('/') == 0){
			exp = exp.substr(1);
		}
	for(var i in res) {
		// 按  根路径 拆分，获取到 相对路径  + 自定义路径， 当没有自定义目录，设置为相对路径 
		var pathGroup = transformPath(res[i].filePath).split(exp);
		if(pathGroup && pathGroup.length != 0){
			for(var j = 1; j < pathGroup.length; j++) {
				res[i].filePath = '';
				res[i].filePath += pathGroup[j];
			}
			if(res[i].filePath == '') {
				res[i].filePath = '/';
			}
		}
	}
	return res;
}

var fileMenu = $("#fileMenu"),
    nav_tabs = fileMenu.find("ul.nav"),
    tab_contents = fileMenu.find("div.tab-content"),
    path_nav = $("#pathNav");



function saveFile(file,callback){
    $.ajax({
        type: "post",
        url: getContextPath() + "/jersey-services/layoutit/frame/file/save",
        data: JSON.stringify(file),
        contentType :'application/json; charset=UTF-8',
        success: function (data, textStatus) {
            if (data.data === "success") {
                if(callback){
                    callback(file);
                }
                putEditorsLocalStorage();
                setTabStatus(true);
                $("#filesTable").bootstrapTable("refresh");
				if(!allCloseFlag){
					var elem = $("#successTip"),
                    text = "文件 "+file["fileName"]+" 保存成功!";
					elem.find("span").html(text);
					elem.delay(200).fadeIn().delay(1000).fadeOut();
				}
                allCloseFlag = false;
				initRemoteFileData();
            } else {
                bootbox.alert('保存失败。');
            }


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            bootbox.alert('保存过程中发生了错误。');
        }
    })
}

/**
 * 转化路径格式,标准格式:abc/bcd/
 * @param path
 * @returns {*}
 */
function transformPath(path){
    if(path){
        path = path.replace(/\\/g,"/");
        if(path.startsWith("/")){
            path = path.substr(1);
        }

        if(!path.endsWith("/")){
            path += "/";
        }
    }

    return path;
}
var allCloseFlag;
function delNavTab(jquery){
    var
        navTab = jquery.parent(),
        navTabLi = navTab.parent(),
        editorId = navTab.data("editor"),
        contentId = navTab.attr("aria-controls");
    delete jsEditor[editorId];

    putEditorsLocalStorage();
    var next = navTabLi.next(),prev = navTabLi.prev();
    if(next.length>0){
        next.children().tab('show');
    }else if(prev.length>0){
        prev.children().tab('show');
    }
    $('a[href="#'+contentId+'"]').parent().remove();
    var navs = $("#fileMenu>ul.nav>li");
    if(navs.length==0){
        $("div.ace_editor").empty();
    }else{
		$("#"+contentId).remove();
	}
}

function saveModalDialog(jquery){
    bootbox.dialog({
        locale:"zh_CN",
        message: "是否在关闭前保存文件？",
        //title: "保存",
        onEscape: function() {},
        show: true,
        backdrop: true,
        closeButton: true,
        animate: true,
        //className: "my-modal",
        buttons: {
			yes: {
                label: "是",
                className: "btn-primary",
                callback: function() {
                    var editorId = jquery.parent().data("editor");
                    jsEditor[editorId]["file"]["content"] = ace.edit(editorId).getValue();
                    jsEditor[editorId]["file"]["saved"] = true;
                    saveFile(jsEditor[editorId]["file"],function(){});
                    delNavTab(jquery);
                }
            },
			no: {
                label: "否",
                className: "btn-default",
                callback: function() {
                    delNavTab(jquery);
                }
            },
            cancel: {
                label: "取消",
                className: "btn-default",
                callback: function() {

                }
            }
        }
    });
}


function saveDataWhenChangeTab(e){
        currentTab = $(e.target);
    var currentEditorId = currentTab.data("editor"),
        currentEditor = ace.edit(currentEditorId),
        previousTab = $(e.relatedTarget),
        previousEditor = ace.edit(previousTab.data("editor"));

        previousEditor.destroy();

    for(var i in jsEditor){
        if(jsEditor[i].editorId == currentEditorId){
            jsEditor[i]["active"] = true;
        }else{
            jsEditor[i]["active"] = false;
        }
    }

    currentEditor.setOptions(jsEditor[currentEditorId]["ace"]);
    currentEditor.setValue(jsEditor[currentEditorId]["file"]["content"]);
    path_nav.empty().append(createBreadCrumb(jsEditor[currentEditorId]["file"]));
    putEditorsLocalStorage();

    setTimeout(registerAceChange(currentEditorId),1000);
	$('#'+currentEditorId).find('div.ace_scroller').css("height","100%");
	$('#'+currentEditorId).find('div.ace_scroller').children().css("height","100%");
}

/**
 * 设置文件保存状态
 * @param saved true|false
 */
function setTabStatus(saved){
    if(saved){
        currentTab.children("span").removeClass("glyphicon glyphicon-asterisk");
    }else{
        currentTab.children("span").addClass("glyphicon glyphicon-asterisk");
    }

}

/**
 *
 */
function putEditorsLocalStorage(){
    storage.put(editors,JSON.stringify(jsEditor));
}

function registerAceChange(editorId){
    var editor = ace.edit(editorId);
    editor.getSession().on('change', function(){
        jsEditor[editorId]["file"]["content"] = editor.getValue();
        jsEditor[editorId]["file"]["saved"] = false;
        putEditorsLocalStorage();
        setTabStatus(false);

    })
}


function registerEvents(){
    $("#loadAceEditor").click(function(e){
        //一次选择多条记录
        var rows = $("#filesTable").bootstrapTable("getSelections");
        for(var j in rows){
        	if($.isEmptyObject(rows[j])){
	            return;
	        }
			var path = rows[j]["filePath"];
			if(path.indexOf("/") == 0) {
				path = path.substr(1);
			}
			if(!path.endsWith("/") && path != ''){
	            path += "/";
	        }
			path = $('#rootPath').val() + path;
	        $.ajax({
	            type: "get",
	            url: getContextPath() + "/jersey-services/layoutit/file/get?filePath=" + path + "&fileName="+rows[j]["fileName"],
	            dataType:"json",
	            success: function (data, textStatus) {
	                if (data.message === "success") {
	                    var fileInfo = data.data,
	                        filePath = transformPath(fileInfo["filePath"]),
	                        rootPath = transformPath($("#rootPath").val()),
	                        relativeIndex = filePath.indexOf(rootPath),
	                        relativePath = relativeIndex != -1? filePath.slice(relativeIndex+rootPath.length):'',
	                        file = {
	                            projectName:$("#projectName").val(),
	                            relativePath:transformPath(relativePath),
	                            saved:true,
	                            filePath:transformPath(fileInfo["filePath"]),
	                            fileName:fileInfo["fileName"],
	                            content:fileInfo["content"]
	                        },
	                        isExist = false,
	                        editId = undefined;
	
	                    for(var i in jsEditor){
	                        var f = jsEditor[i]["file"];
	                        if(file["relativePath"]+file["fileName"]==f["relativePath"]+f["fileName"]){
	                            isExist = true;
	                            editId = i;
	                            break;
	                        }
	                    }
	                    if(isExist){
	
	                        if(!jsEditor[editId]["file"]["saved"]){
	                            bootbox.confirm({
	                                buttons: {
	                                    confirm: {
	                                        label: '是',
	                                        className: 'btn-primary'
	                                    },
	                                    cancel: {
	                                        label: '否',
	                                        className: 'btn-default'
	                                    }
	                                },
	                                message: '确定要覆盖本地的 [ ' + jsEditor[editId]["file"]["fileName"] + ' ] 文件吗?',
	                                callback: function(result) {
	                                    if(result) {
	                                        ace.edit(editId).setValue(file["content"]);
	                                        jsEditor[editId]["file"] = file;
	                                        putEditorsLocalStorage();
	                                        setTabStatus(file["saved"]);
	                                        $('a[data-editor="'+editId+'"]').tab("show");
	                                    } else {
	
	                                    }
	                                },
	                                title: "提示信息"
	                            });
	                        }else{
	                            ace.edit(editId).setValue(file["content"]);
	                            jsEditor[editId]["file"] = file;
	                            putEditorsLocalStorage();
	                            setTabStatus(file["saved"]);
	                            $('a[data-editor="'+editId+'"]').tab("show");
	                        }
	
	
	                    }else{
	                        createNewFile(file);
	                    }
	
	                } else {
	                    bootbox.alert('文件不存在。');
	                }
	            },
	            error: function (XMLHttpRequest, textStatus, errorThrown) {
	                bootbox.alert('查询过程中发生了错误。');
	            }
	        });
        }
    });

   $('#createForm').bootstrapValidator({
        fields:{
            fileName:{
                validators: {
                    notEmpty: {},
                    regexp: {
                        regexp: /^[A-Za-z0-9_-]+$/,
                        message: '文件名只能是字母、数字和下划线'
                    }
                }
            }
        }
    });

    $("#saveCloudFile").click(function(){
        if(!currentTab){
            return;
        }
        var editorId = currentTab.data("editor");
        if(jsEditor[editorId]["file"]["filePath"]){
            jsEditor[editorId]["file"]["saved"] = true;
            saveFile(jsEditor[editorId]["file"]);
        }else{
            $("#createModal").modal("show");
        }

    })

    $("#createModal").on("show.bs.modal",function(e){
        var button = $(e.relatedTarget);
        if(button.length>0){
            $("#saveFile").attr("data-type","new");
            $("#saveFile").data("type","new");
        }else{
            $("#saveFile").attr("data-type","save");
            $("#saveFile").data("type","save");
        }


    })
    $("#createModal").on("hide.bs.modal",function(e){

        $('#createForm').data('bootstrapValidator').resetForm();

    })
    $("#saveFile").click(function() {
        $("#createForm").data('bootstrapValidator').validate()
        var isValid = $("#createForm").data('bootstrapValidator').isValid();
        if(!isValid){
            return;
        }

        var file = {},
            rootPath = $("#rootPath").val(),
            relativePath = $("#relativePath").val(),
            customPath = $("#customPath").val(),
            fileName = $("#fileName").val(),
            content = "";
        rootPath = rootPath;
        relativePath = relativePath;
        customPath = transformPath(customPath);

        file["filePath"] = rootPath + relativePath+customPath;
        file["relativePath"] = relativePath + customPath;
        file["projectName"] = $("#projectName").val();
        file["fileName"] = fileName+"."+postfix;
        file["content"] = content;
        file["saved"] = true;


        var type = $(this).data("type");
        if(type==="new"){
			var flag = false;
			var rows = $("#filesTable").bootstrapTable("getData");
			for(var i = 0;i<rows.length;i++){
				var path = rows[i]["filePath"]+"/"+rows[i]["fileName"]
				var sourcePath = path.replace(/\\/g,'\/');
				var comparePath= file["filePath"]+file["fileName"];
				if(sourcePath == comparePath){
					flag = true;
				}
			}
			if(!flag){
				allCloseFlag = true;
				saveFile(file,createNewFile);
			}else{
				bootbox.setDefaults("locale","zh_CN");
				bootbox.alert("已存在该" + postfix + "文件！");
				return;
			}	
            
        }else{
                file["content"] = ace.edit("editor").getValue();
                jsEditor["editor"]["file"] = file;

                saveFile(file,function(file){
                    $(currentTab.find("span")[0]).text(file["fileName"]);
                    path_nav.empty().append(createBreadCrumb(file));
                });
        }
        //putEditorsLocalStorage();
        $("#createModal").modal("hide");

    })



    $('#fileMenu a[data-toggle="tab"]').off('shown.bs.tab').on('shown.bs.tab',function(e){
        saveDataWhenChangeTab(e);
    });

    $('#fileMenu button.close').off('click').on("click",function(e){
        var jquery = $(e.currentTarget);
        if(jsEditor[currentTab.data("editor")]["file"]["saved"]){
            delNavTab(jquery);
        }else{
            saveModalDialog(jquery);
        }
    })


    registerAceChange(currentTab?currentTab.data("editor"):"editor");
}


$(document).ready(function() {


    initAce();

    initMenu();

    initRemoteFileData();

    registerEvents();
    
    //打开模态框，并初始化模态框（清楚选中状态）
    $('#openListModal').click(function() {
    	$('#openModal').modal('show');
    	$('#filesTable').bootstrapTable('resetSearch');
    	$('#filesTable').bootstrapTable('uncheckAll');
    });

    //currentEditor.getSession().on('change', function(){
    //    console.log("change");
    //})
    //currentEditor.getSession().on('changeMode', function(){
    //    console.log("changeMode");
    //})
    //currentEditor.getSession().on('tokenizerUpdate', function(){
    //    console.log("tokenizerUpdate");
    //})
    //currentEditor.getSession().on('changeTabSize', function(){
    //    console.log("changeTabSize");
    //})
    //currentEditor.getSession().on('changeWrapLimit', function(){
    //    console.log("changeWrapLimit");
    //})
    //currentEditor.getSession().on('changeWrapMode', function(){
    //    console.log("changeWrapMode");
    //})
    //currentEditor.getSession().on('onChangeFold', function(){
    //    console.log("onChangeFold");
    //})
    //currentEditor.getSession().on('changeFrontMarker', function(){
    //    console.log("changeFrontMarker");
    //})
    //currentEditor.getSession().on('changeBackMarker', function(){
    //    console.log("changeBackMarker");
    //})
    //currentEditor.getSession().on('changeBreakpoint', function(){
    //    console.log("changeBreakpoint");
    //})
    //currentEditor.getSession().on('changeAnnotation', function(){
    //    console.log("changeAnnotation");
    //})
    //currentEditor.getSession().on('changeOverwrite', function(){
    //    console.log("changeOverwrite");
    //})
    //currentEditor.getSession().on('changeScrollTop', function(){
    //    console.log("changeScrollTop");
    //})
    //currentEditor.getSession().on('changeScrollLeft', function(){
    //    console.log("changeScrollLeft");
    //});
});


;(function($) {
    var FunctionListManage = function () {
        this.data = {};
        this.$functionListContainer = $("#functionListContainer");

        this.init();
    }

    FunctionListManage.prototype = {
        /**
         * 初始化
         */
        init: function () {
            this.loadData();
            this.registerEvent();
        },


        /**
         * 加载函数元数据
         */
        loadData: function () {
            var $that = this;
            $.ajax({
                    async: false,
                    cache: false,
                    type: "GET",
                    dataType: "json",
                    url: "../js/frame/editor/functions.json",
                    success: function (data) {
                        $that.data = data;
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.log("请求服务错误：textStatus:" + textStatus + "|errorThrown:" + errorThrown);
                    }
                }
            );
        },


        /**
         * 事件注册
         */
        registerEvent:function() {
            this.$functionListContainer.on("click", ".form-panel .title", function (e) {
                e.stopPropagation();
                $(this).next().slideToggle("fast");
            }).on("click", ".form-panel .add", function (e) {
                e.stopPropagation();
                var currentEditorId = currentTab.data("editor"),
                    currentEditor = ace.edit(currentEditorId);
                if (currentEditor) {
                    currentEditor.insert(decodeURIComponent($(this).attr("body")));
                }
            })
        },


        /**
         * 获取分组数据
         */
        getGroupOptions: function () {
            var result = ['<option value=""><-所有-></option>'];

            if (!this.data) {
                return result;
            }

            $.each(this.data, function (index, item) {
                result.push('<option value="' + item.name + '">' + item.name + '</option>');
            })

            return result;
        },


        /**
         * 根据分组ID和关键字，查找对应分组下的数据
         * @param groupId
         * @param key
         */
        _findGroupData: function (groupId) {
            var result = [];

            $.each(this.data, function (index, item) {
                if (groupId) {
                    if (item.name === groupId) {
                        result.push(item);
                    }
                } else {
                    result.push(item);
                }
            })

            return result;
        },


        /**
         * 根据分组ID或关键字查询函数
         * @param groupId
         * @param key
         */
        getFunctions: function (groupId, key) {
            var $that = this,
                result = [],
                groupData = this._findGroupData(groupId);

            if (!groupData || $.isEmptyObject(groupData)) {
                return result;
            }

            $.each(groupData, function (index, item) {
                result.push($that._getAllFunctions(item, key));
            })

            return result;
        },

        /**
         *
         * @param groupItem
         * @param key
         * @returns {Array}
         * @private
         */
        _getAllFunctions: function (groupItem, key) {
            var $that = this,
                result = [],
                functionList = groupItem.functions;

            if (!functionList || $.isEmptyObject(functionList)) {
                return "";
            }

            $.each(functionList, function (index, item) {
                if (key) {
                    var strFunction = JSON.stringify(item);
                    if (strFunction.indexOf(key) === -1) {
                        return true;
                    }
                }

                result.push($that._getFunctionHtml(item));
            })

            return result.join(" ");
        },


        /**
         * 构造函数html
         * @param functionItem
         * @private
         */
        _getFunctionHtml: function (functionItem) {
            if (!functionItem || $.isEmptyObject(functionItem)
                || !functionItem.name || !functionItem.body) {
                return "";
            }


            var html = [];
            /**
             * 函数名称
             */
            var functionName = functionItem.name;
            if (functionName.length > 20) {
                functionName = functionName.substring(0, 20) + "...";
            }

            html.push('<div class="form-panel"><div class="title">' +
                '<em class="glyphicon glyphicon-info-sign"></em>' +
                '<span class="name" title="' + functionItem.name + '">' + functionName + '</span></div>');

            /**
             * 函数介绍
             */
            html.push('<div class="body" style="display: none;"> <ul class="list-group">');
            html.push('<li class="list-group-item">' +
                '<textarea title="单击将函数插入到编辑区域" body="' + functionItem.body +
                '" class="add form-control" rows=5 style="color:#5bc0de;">' + decodeURIComponent(functionItem.body)  + '</textarea>');

            if (functionItem.introduction) {
                html.push('<li class="list-group-item">' +
                    '<span class="badge">概述</span>' +
                    ' <span class="content">' + decodeURIComponent(functionItem.introduction)
                    + '</span> </li>');
            }

            /**
             * 函数参数
             */
            if (functionItem.params) {
                $.each(functionItem.params, function (index, item) {
                    html.push('<li class="list-group-item">' +
                        '<span class="badge">' + index + '</span>' +
                        ' <span class="content">');

                    if (item.description) {
                        html.push(decodeURIComponent(item.description));
                    }

                    html.push('</span> </li>');
                })
            }

            /**
             * 函数返回值
             */
            if (functionItem.return && functionItem.return.description) {
                html.push('<li class="list-group-item">' +
                    '<span class="badge">返回值</span>' +
                    ' <span class="content">' + decodeURIComponent(functionItem.return.description)
                    + '</span> </li>');
            }


            html.push('</ul></div></div>');

            return html.join(" ");
        }
    }

    $(document).ready(function () {
        var functionListManage = new FunctionListManage(),
            $functionListContainer = $("#functionListContainer"),
            $cmbFunctionList = $("#cmbFunctionList"),
            $txtFunctionKey = $("#txtFunctionKey"),
            $btnQueryByKey = $("#btnQueryByKey");

        /**
         * 默认加载所有函数
         */
        $functionListContainer.empty()
            .append(functionListManage.getFunctions());

        /**
         * 分组变化事件注册
         */
        $cmbFunctionList.empty()
            .append(functionListManage.getGroupOptions())
            .change(function (e) {
                $functionListContainer.empty()
                    .append(functionListManage.getFunctions($(this).val(),
                        $txtFunctionKey.val()));
            });

        /**
         * 关键字输入变化
         */
        $btnQueryByKey.click(function () {
            $functionListContainer.empty()
                .append(functionListManage.getFunctions($cmbFunctionList.val(),
                    $txtFunctionKey.val()));
        })
    })
}(jQuery))
