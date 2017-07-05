/**
 组件自定义属性管理接口，
 界面组件凡是配置有init="true"属性的组件，可以获取到组件对应的属性。
 */
function LayoutitAttributeAPI()
{
	/**
	 描述：获取属性集合
	 参数：属性名称
	 返回值：json数组
	 */
	this.getAttributes=function(attributeName){
		var result=[];
		if(sysCustomAttributesArray.length > 0 ){
			for(var i=0;i<sysCustomAttributesArray.length;i++){
				var attributes=sysCustomAttributesArray[i].attributes;
				if(attributes == undefined){
					attributes = decodeURIComponent(sysCustomAttributesArray[i]).split("@");
				}
				for(var j=0;j<attributes.length;j++){
					var item = attributes[j];
					if(typeof(item) == "string"){
						item = $.parseJSON(item);
					}
					if(item.name == attributeName){
						item.value = decodeURIComponent(item.value);
						result.push(item);
					}
				}
			}
		}

		return result;
	}
	/**
	 通过属性值获取属性集合
	 */
	this.getAttributesByValue=function(attributeName,attributeValue){
		var result=[];
		if(sysCustomAttributesArray.length > 0){
			for(var i=0;i<sysCustomAttributesArray.length;i++){
				var attributes=sysCustomAttributesArray[i].attributes;
				if(attributes == undefined){
					attributes = decodeURIComponent(sysCustomAttributesArray[i]).split("@");
				}
				for(var j=0;j<attributes.length;j++){
					var item =attributes[j];
					if(typeof(item) == "string"){
						item = $.parseJSON(item);
					}
					if(item.name == attributeName && item.value == attributeValue){
						item.value = decodeURIComponent(item.value);
						result.push(item);
					}
				}
			}
		}

		return result;
	}

	/**
	 描述：根据组件ID获取属性集合
	 参数：组件ID
	 返回值：json数组
	 */
	this.getAttributesByID=function(compid)	{
		var result=[];
		if(sysCustomAttributesArray.length > 0){
			for(var i=0;i<sysCustomAttributesArray.length;i++){
				var attributes = sysCustomAttributesArray[i].attributes;
				if(attributes == undefined){
					attributes = decodeURIComponent(sysCustomAttributesArray[i]).split("@");
				}
				for(var j=0;j<attributes.length;j++){
					var item =attributes[j];
					if(typeof(item) == "string"){
						item = $.parseJSON(item);
					}
					if(item.compid == compid){
						item.value = decodeURIComponent(item.value);
						result.push(item);
					}
				}
			}
		}

		return result;
	}
	/**
	 通过组件ID和属性名称获取属性
	 */
	this.getAttributesByIDAndAttributeName = function(compid,attributeName)	{
		var result;
		if(sysCustomAttributesArray.length > 0){
			for(var i=0;i<sysCustomAttributesArray.length;i++){
				var attributes=sysCustomAttributesArray[i].attributes;
				if(attributes == undefined){
					attributes = decodeURIComponent(sysCustomAttributesArray[i]).split("@");
				}
				for(var j=0;j<attributes.length;j++){
					var item=attributes[j];
					if(typeof(item) == "string"){
						item = $.parseJSON(item);
					}
					if(item.compid == compid&&item.name == attributeName){
						item.value = decodeURIComponent(item.value);
						result = item;
					}
				}
			}
		}

		return result;
	}
	/**
	 *根据组件Id 和 属性前缀返回属性集合
	 *@param compid:组件ID
	 *@param attributeName:属性名称
	 *@return 属性数组
	 */
	this.getAttributesByIDAndAttributeNamePrefix = function(compid,attributeName)	{
		var result=[];
		if(sysCustomAttributesArray.length > 0){
			for(var i=0;i<sysCustomAttributesArray.length;i++){
				var attributes=sysCustomAttributesArray[i].attributes;
				if(attributes == undefined){
					attributes = decodeURIComponent(sysCustomAttributesArray[i]).split("@");
				}
				for(var j=0;j<attributes.length;j++){
					var item=attributes[j];
					if(typeof(item) == "string"){
						item = $.parseJSON(item);
					}
					if(item.compid == compid &&
						item.name.indexOf(attributeName) == 0){
						item.value = decodeURIComponent(item.value);
						result.push(item);
					}
				}
			}
		}

		return result;
	}

	/**
	 通过组件类型和属性名称获取组件属性信息
	 */
	this.getAttributesByTypeAndAttrName=function(type,typeValue,attributeName){
		var result=[];
		var components = this.getAttributesByValue(type,typeValue);
		if(components.length>0)	{
			for(var i=0;i<components.length;i++){
				var item = this.getAttributesByIDAndAttributeName(components[i].compid,attributeName);
				if(item != undefined){
					result.push(item);
				}
			}
		}

		return result;
	}

}
//属性管理接口
var attributeAPI=new LayoutitAttributeAPI();
/*
	加载Radio对象初始化数据
*/
function initRadioButton()
{
	var attrbutes=attributeAPI.getAttributesByTypeAndAttrName("type","input_radio","datasetting");
    if(attrbutes.length == 0) {
        return;
    }
    for(var i=0;i<attrbutes.length;i++){
        var item=attrbutes[i];
        var dataScriptObject=($.parseJSON(escape2Html(decodeURIComponent(item.value)))).script;

        var data;//加载用户定义的脚本对象
        if(dataScriptObject == undefined || dataScriptObject.trim().length == 0) {
            return;
        }
        data = eval(dataScriptObject);
        if(data == undefined || data.length == 0){
            if(typeof(loadCustomDataScriptObject) != "undefined") {
                loadCustomDataScriptObject();
                data=eval(dataScriptObject);
            }
            else {
                console.error("initRadioButton fail. dataScriptObject convert to data not success. loadCustomDataScriptObject function is undefined.")
                return;
            }
        }

        if(data == undefined) {
            console.error("initRadioButton fail. data is undefined.");
            return;
        }

        //绑定数据
        if(data != undefined && data.length > 0 ){
            var parent=$("[name=\""+item.compid+"\"]").parent();
            $(parent).empty();

            var dataField="";
            var field=attributeAPI.getAttributesByIDAndAttributeName(item.compid,"field");
            if(field != undefined){
                dataField=" ms-duplex-string=\""+field.value+"\"";
            }

            for(var j=0;j<data.length;j++){
                var id = item.compid+"_"+j;
                for(var obj in data[j]){
                    $(parent).append("<input name=\""+item.compid+"\" type=\"radio\" "
                        +dataField+" value=\""+data[j][obj]+"\" id=\""+id+"\"/><span>"+obj+"</span>");
                }
            }
        }
    }

}

/**
 * 通过脚本对象，加载下拉框数据
 */
function initSelectByDataScriptObject()
{
	var attrbutes=attributeAPI.getAttributesByTypeAndAttrName("type","select_dynamic","datasetting");
	if(attrbutes.length>0){
		for(var i=0;i<attrbutes.length;i++){
			var item = attrbutes[i];						
			var dataScriptObject = ($.parseJSON(escape2Html(decodeURIComponent(item.value)))).script;			
			var data;//加载用户定义的脚本对象
			if(dataScriptObject == undefined || dataScriptObject.trim().length == 0) {
                return;
            }
            data = eval(dataScriptObject);
            if(data == undefined || data.length == 0){
                if(typeof(loadCustomDataScriptObject) != "undefined") {
                    loadCustomDataScriptObject();
                    data=eval(dataScriptObject);
                }
                else {
                    console.error("initSelectByDataScriptObject fail. dataScriptObject convert to data not success. loadCustomDataScriptObject function is undefined.")
                    return;
                }
            }

            if(data == undefined) {
                console.error("initSelectByDataScriptObject fail. data is undefined.");
                return;
            }

            var selectObject=$("#"+item.compid);
			if(data.length > 0){
				selectObject.empty();
				for(var j=0;j<data.length;j++){	
					for(var obj in data[j])	{													
						selectObject.append("<option value=\""+data[j][obj]+"\">"+obj+"</option>");
					}
				}
			}else if(data.rows != undefined){
				selectObject.empty();
				var result=data.rows;
				$.each(result,function(key,value){
					var index =0;	
					var optionName = "";
					var optionValue = "";	
					for(var item in value){
						if(index == 0){
							optionName = value[item];										
						}else if(index == 1){
							optionValue = value[item];
						}
						index++;									
					}
					selectObject.append("<option value=\""+optionValue+"\">"+optionName+"</>");	
				});
			}
		}
	}
}

/**
 * 根据dsname和url拼接新的url地址，处理dsname配置了“/”而url前面也有“/”的情况。
 * @param dsname
 * @param url
 * @returns {*}
 */
function generatorURL(dsname, url, selectObject) {
    var isormds =attributeAPI.getAttributesByIDAndAttributeName($(selectObject).attr("id"),"isormds");

    if(isormds == undefined || isormds.value != "true") {
        return url;
    }
    if(dsname == undefined || dsname == "undefined") {
        return url;
    }
    var prefix = evalFunc(dsname);
    if(prefix.charAt(prefix.length-1) == "/" && url.charAt(0) == "/") {
        return prefix + url.substring(1);
    }
    else {
        return prefix + url;
    }
}


/*
	动态下拉框通过URL加载数据
*/
function initSelectByDynamicURL(dsname){
	var attrbutes = attributeAPI.getAttributesByTypeAndAttrName("type","select_dynamic","optionvurl");
	if(attrbutes.length <= 0){
		return;
	}
	$.each(attrbutes,function(index,item){
		var compid=item.compid;
		var optionURL = escape2Html(decodeURIComponent(item.value));
		if(optionURL == "") {
			return;
		}
        var selectObject = $("#" + compid);
		optionURL = generatorURL(dsname, optionURL, selectObject);
		$.ajax({
			async: false,
			cache: false,
			type: 'GET',
			dataType:"json",
			//contentType :'application/json; charset=UTF-8',
			url: optionURL,
			success: function (data) {
				//data中直接是数组情况
				selectDynamicCallback(data, compid);
			}
		});//ajax
	});
}
function initSelectByDataset(){
	var attrbutes = attributeAPI.getAttributesByTypeAndAttrName("type","select_dynamic","datasetconfig");
	if(attrbutes.length <= 0){
		return;
	}
	$.each(attrbutes,function(index,item){
		var datasetconfig = decodeURIComponent(item.value);
		if(datasetconfig == "undefined") {
			return;
		}
		datasetconfig = $.parseJSON(escape2Html(datasetconfig));
		var columns = [];
		columns.push(datasetconfig.key);
		columns.push(datasetconfig.value);
		var url = getDatasetQueryURL(datasetconfig.datasource,
			datasetconfig.dataset,
			columns,
			undefined,
			false
		);
		$.ajax({
			async: false,
			cache: false,
			type: 'GET',
			dataType:"json",
			url: url,
			success: function (data) {
				selectDynamicCallback(data, item.compid);
			}
		});//ajax
	});
}
/**
 * 动态下拉框数据返回后的处理代码。
 * @param data
 * @param compid
 */
function selectDynamicCallback(data, compid) {
    if(data == undefined) {
        console.error("initSelectByDynamicURL error, return data is undefined. compid is" + compid);
        return;
    }
    var selectObject = $("#" + compid);
	selectObject.empty();
    //返回对象直接是数组情况，这种情况只处理key,value形式。
    var options = [];
    if(typeof data == "object" && data.length != undefined) {
        options = data;
    }
    else if(data.data != undefined) {
        if(typeof data.data == "object") {
            options = data.data;
        }
        else if(typeof data.data == "string"){
            options = $.parseJSON(data.data);
        }
    }
    else if(data.rows != undefined){
        var result = data.rows;
        $.each(result,function(key,value){
            var index =0;
            var optionName = "";
            var optionValue = "";
            for(var item in value){
                if(index == 0){
                    optionName = value[item];
                }else if(index == 1){
                    optionValue = value[item];
                }
                index++;
            }
			options.push({key:optionName, value:optionValue});
        });
    }

    $.each(options, function(index, value) {
        selectObject.append('<option value="' + value.value + '">' + value.key + "</>");
    });
}

function initTimeComponent() {
	try {
		$(".form_time").datetimepicker({
			format: 'YYYY-MM-DD HH:mm:ss',
			locale: 'zh-cn',
			//defaultDate:new Date(),
			keepInvalid: true,
			showTodayButton: true
			/* 		language:  'zh-CN',
			 format:'yyyy-mm-dd hh:ii:00',
			 weekStart: 1,
			 todayBtn:  1,
			 autoclose: 1,
			 todayHighlight: 1,
			 forceParse: 1,
			 pickerPosition:"bottom-left",
			 minView:0,
			 minuteStep:5,
			 showMeridian:true,
			 initialDate:new Date() */
		})
			.on('dp.change dp.show', function (e) {
				var $bv_form = $(e.target).parents("div.bv-form");
				if ($bv_form.length > 0) {
					var field = $(e.target).attr("name");
					$bv_form.data('bootstrapValidator').revalidateField(field);
				}

			});
	}catch(err) {

	}
}

/*
	上传组件
*/
function initFileComponent(dsname) {

	var operator = "?",uri =  pageParams ? pageParams : location.search,operatorValue = null; ;
	var params = uri.substr(uri.indexOf(operator) + 1).split("&");
	$.each(params, function (index, item) {
		var arr = item.split("=");
		if (arr[0] == "operator") {
			operatorValue = arr[1];
			return true;
		}
	});

	if(operatorValue == "view"){
		$("[type=input_fileinput]").addClass("hidden");
	}

	$("[type=file]").each(function(){
		var suffixes = escape2Html(decodeURIComponent($(this).attr("fileuploadurl"))),
			mobile = $(this).parent().data('mobile');

		var url = suffixes;
		var ext = escape2Html(decodeURIComponent($(this).attr("allowedFileExtensions")));
		var id=$(this).attr("id");
		$("#"+id+"_serverPath").hide();
		var arrExt=[];
		if(ext!="") {
			arrExt=ext.split(",");	
		}

        url = generatorURL(dsname, url, $(this));

		var that = this;

		$(this).fileinput({
			showCaption: false,
			uploadUrl:url,
			allowedFileExtensions : arrExt,
			overwriteInitial: false,
			uploadAsync:false,
			maxFileSize: 10000,
			maxFilesNum: 1,
			//browseLabel:"",
			removeLabel:"",
			uploadLabel:"",
			//allowedFileTypes: ['image', 'video', 'flash'],
			slugCallback: function(filename) {				
				return filename.replace('(', '_').replace(']', '_');
			},
			ajaxSettings:{
				success:function(data){
					if(data.data){
						$("#"+id+"_serverPath").val(data.data);
					 	var images = $(that).parents('div[type="input_fileinput"]').siblings('div[type="image"]');
						if(images.length>0){
							$(images[0]).removeClass('displaynone');
							$(images[0]).find("a").attr("href",data.data);
							$(images[0]).find("img").attr("src",data.data);
						}
					}
				}
			}
		});
		if(mobile) {
			$('.btn-file').attr('style', 'width:100%;');
		}
	});
}

/*
	更新单选框样式
*/
function initRadioButtonCSS(){
	$("[type=radio]").each(function(){
		var parent=$(this).parent();		
		parent.addClass("control-label");	
		parent.addClass("layout-radio-group");		
	});
}
/*
	添加单选框事件
*/
function initRadioButtonEvent(name,id){
	var attr=attributeAPI.getAttributesByIDAndAttributeName(name,"componentevent");
	if(attr != undefined){
		var eventObj = $.parseJSON(escape2Html(decodeURIComponent(attr.value)));
		var events = eventObj.events;
		for(var i in events){
			var item = events[i];
			var event = item.substring(item.indexOf("=")+1,item.indexOf(","));
			var func = item.substring(item.lastIndexOf("=")+1);
			$("#"+id).on(event,function(){
				eval(func);			
			}); 
		}		
	}
}

/*
//测试单选框脚本对象
var radioValue=[];
//测试下拉框脚本对象
var selectValue=[];
function loadCustomDataScriptObject()
{	 
	radioValue.push({"value1":"1"});
	radioValue.push({"value12":"2"});
	radioValue.push({"value13":"3"});
	radioValue.push({"value14":"4"});
	
	selectValue.push({"1":"1"});
	selectValue.push({"2":"2"});
	selectValue.push({"3":"3"});
	selectValue.push({"4":"4"});	 
}
*/	

/**
	初始化页面中未加载的树
*/
function initZtree(dsname){
	$(".ztree").each(function(){
		var treeID=$(this).attr("id");
		if(	sysTreeMap.get(treeID) == undefined ){
			var treeObj=new zTree();
			treeObj.initTreeFromAPI(treeID, dsname);
		}
	});
}
function initMultipleSelect(vmObject){
	$("#"+vmObject.$id).find("select[multiple]").each(function(){
		var field = attributeAPI.getAttributesByIDAndAttributeName($(this).attr("id"),"field");
		if(field == undefined){
			field = $(this).attr("name");
		}else{
			field = field.value;
		}
		$(this).val(vmObject[field+"_form_compute"]);
		$(this).select2();
	}).change(function(){
		var field = attributeAPI.getAttributesByIDAndAttributeName($(this).attr("id"),"field");
		if(field == undefined){
			field = $(this).attr("name");
		}else{
			field = field.value;
		}
		vmObject[field+"_form_compute"] = $(this).val();
	})
}

function initCheckBox(vmObject){
	$("#"+vmObject.$id).find("div[type=checkbox]").each(function(){
		var $this = $(this);
		var id = $this.find("input[type=checkbox]").prop("id").split("_")[0];
		var name = $this.find("input[type=checkbox]").prop("name");
		var field = attributeAPI.getAttributesByIDAndAttributeName(id,"field");
		if(field == undefined){
			field =name;
		}else{
			field = field.value;
		}


		$this.find("input[name="+name+"]").change(function(){
			var field = attributeAPI.getAttributesByIDAndAttributeName($(this).attr("id").split("_")[0],"field");
			var name = $(this).prop("name");
			if(field == undefined){
				field = $(this).attr("name");
			}else{
				field = field.value;
			}
			var changeValue = [];
			$("input[name="+name+"]").each(function(){
				if($(this).is(":checked")){
					changeValue.push($(this).val());
				}
			})
			vmObject[field] = changeValue.join(",");
			vmObject[field+"_form_compute"] = changeValue;
		})
	})

}

function initCollapse(){
	$('.collapse').on('hide.bs.collapse', function () {
		$(this).parent().find("a[data-toggle=collapse]>span.glyphicon-minus").removeClass("glyphicon-minus").addClass("glyphicon-plus");
	}).on('show.bs.collapse',function(){
		$(this).parent().find("a[data-toggle=collapse]>span.glyphicon-plus").removeClass("glyphicon-plus").addClass("glyphicon-minus");
	});

	$("div[type=collapse]").on("click",'.panel-heading',function(){
		var href = $(this).find('a[data-toggle="collapse"]').attr("href");
		$(href).collapse('toggle');
	})
}
/**
 * 初始化路标导航组件
 */
function initWaypoint(){
	$("[type=layoutitWaypoint]").each(function(){
		var waypoint = new LayoutitWaypoint();
		var setting = $(this).attr("waypointsetting");
		var jsonObject = null;
		if (setting) {
			jsonObject = $.parseJSON(decodeURIComponent(setting));
		}
		waypoint.init($(this), jsonObject);
	})
}
/**
 * 初始化区域组件
 */
function initChineseRegion(vmObject){
	var components = $("#"+vmObject.$id).find("[type=chinese_region]");
	if(components.length > 0){
		var src = $("script[src *=bootstrap-chinese-region-areas]:first").attr("src");
		$.getJSON(src,function(data){
			for (var i = 0; i < data.length; i++) {
				var area = {id:data[i].id,name:data[i].cname,level:data[i].level,parentId:data[i].upid};
				data[i] = area;
			}

			$.each(components,function(index,item){
				$(item).find('.bs-chinese-region').chineseRegion('source',data);
				if(typeof (viewoperator) != "undefined" && viewoperator === "view"){
					$(item).find("input:eq(2)").attr("disabled",true);
				}else{
					$(item).find("input:eq(2)").attr("readonly",true);
				}
			})
		});
	}
}
/**
*初始化图形组件
*/
function initImage(vmObject){

	var uri = pageParams ? pageParams : location.search; //获取url中"?"符后的字串
	//uri="file:///D:/svn/ZXUEP_BCP_REPOS/trunk/src/layoutit3_web/src/web/test2.html?operator=add&id=xjl";
	var operator = "?",
		isAdd = false;
	var params = uri.substr(uri.indexOf(operator) + 1).split("&");
	$.each(params, function (index, item) {
		var arr = item.split("=");
		if (arr[0] == "operator") {
			isAdd = arr[1]=="add"?true:false;
			return false;
		}
	})
	$("#"+vmObject.$id).find("img[srcfield]").each(function(){
		if(!isAdd && vmObject[$(this).attr("srcfield")]){
			$(this).attr("src",vmObject[$(this).attr("srcfield")]);
			$(this).parent().attr("href",vmObject[$(this).attr("srcfield")]);
		}
	});
	if($.fancybox && typeof $.fancybox == "function"){
		$("a.fancybox").fancybox({
			beforeShow : function(){
				var callback = null;
				try{
					callback = eval("img$"+id)
				}catch(err){
					//console.log(err);
				}
				//
				if(callback && typeof callback == "function"){
					var rtn = callback();
					if(typeof rtn == "object"){
						if(obj.showSize){
							this.width = obj.showSize.width;
							this.height = obj.showSize.height;
						}
					}
				}

			},

			beforeLoad : function() {
				var that = this,
					$img = this.element.children(),
					id = $img.attr("id"),
					callback = null;

				try{
					callback = eval("img$"+id)
				}catch(err){
					//console.log(err);
				}
				//
				if(callback && typeof callback == "function"){
					var titles = callback();
					if($.isArray(titles)){
						titles.forEach(function(title,index){
							that.title += title.label+":"+title.value+"<br/>";
						})
					}else if(typeof titles == "object"){
						if($.isArray(titles.title)){
							titles.title.forEach(function(title,index){
								that.title += title.label+":"+title.value+"<br/>";
							})
						}
					}
				}else{
					this.title = '图片 ' + (this.index + 1) + ' / ' + this.group.length + (this.title ? ' - ' + this.title : '');
				}


			},
			helpers: {
				title : {
					type : 'float'
				}
			}
		});
	}else{
		//console.log("请检查页面是否引入jquery.fancybox")
	}

}

/**
 * 初始化布局器组件
 */
function initLayout() {
	//var height = $("body").height();
	$('[type=layout_extend]>.row').each(function (index, item) {
		$(item).layout({
			west__minSize: 50,
			east__minSize: 200
		});
	});
}

/**
 * 绑定按钮自定义事件
 */
function initButtonOperationEvent() {
	/**
	 * 按钮自定义函数事件绑定
	 */
	$("button[bfd-button-operations]").each(function (index, item) {
		var params = $(item).attr("bfd-button-operations");
		var operations = [];

		if (!params) {
			return;
		}

		operations = $.parseJSON(decodeURIComponent(params));
		$(item).off('click').on('click', function () {
			var total = operations.length, lastOperationResult = "";
			$.each(operations, function (subIndex, subItem) {
				if (total === subIndex + 1) {
					window[subItem.model + "SuccessCallBack"] = function (data) {
						operatorCallBack(data, "表单提交成功。", "表单提交失败。");
					}
				} else {
					window[subItem.model + "SuccessCallBack"] = function () {
					};
				}

				lastOperationResult = $.bfd.pageCache.execOperationSubmitFuc(eval(subItem.model), subItem.set, subItem.method,
					subItem.service, lastOperationResult);
			})
		})

		$(item).removeAttr("bfd-button-operations");
		$(item).parent().removeAttr("bfd-button-operations");
	})

	/**
	 * 按钮对话框
	 */
	$.each($("button[bfd-button-dialog]"), function (index, item) {
		var dialogId = $(item).attr("bfd-button-dialog");
		if (!dialogId) {
			return;
		}

		var $dialog = $("#" + dialogId);
		var url = $dialog.attr("bfd_dialog_url"),
			title = $dialog.attr("bfd_dialog_title");

		$(item).off('click').on('click', function () {
			showModalDialog(dialogId, title, url);
		})

		$(item).removeAttr("bfd-button-dialog");
		$(item).parent().removeAttr("bfd-button-dialog");
	})

	/**
	 * 按钮查询
	 */
	$.each($("button[bfd-button-query]"), function (index, item) {
		var property = $(item).attr("bfd-button-query");
		if (!property) {
			return;
		}

		property = JSON.parse(decodeURIComponent(property));
		$(item).off('click').on('click', function () {
			queryRemoteTable(property.tableId, $.bfd.pageCache.queryCondition.getQueryConditions(eval(property.modelId)));
		})

		$(item).removeAttr("bfd-button-query");
		$(item).parent().removeAttr("bfd-button-query");
	})

	$.each($("button[bfd-button-link]"), function (index, item) {
		var property = $(item).attr("bfd-button-link");
		$(item).off("click").on('click', function () {
			window.location.href = property;
		})
		$(item).removeAttr("bfd-button-link");
		$(item).parent().removeAttr("bfd-button-link");
	});

	/**
	 * 图标按钮事件注册
	 * */
	$("[type=bfd_icon][componentevent]").each(function (index, item) {
		var events = JSON.parse(decodeURIComponent($(item).attr("componentevent"))).events;
		if (!events || !events.length > 0) {
			return;
		}

		var functionBody;
		for (var i = 0; i < events.length; i++) {
			var eventInfo = events[i];
			if (!eventInfo) {
				continue;
			}

			functionBody = eventInfo.substring(eventInfo.indexOf(",value=") + 7);
		}

		$(item).children().off("click").on("click", function () {
			eval("(function($){" + functionBody + "})(jQuery)");
		})

		$(item).removeAttr("componentevent")
	})
}

/**
 * 面板组件处理
 * */
function initPanel() {
	var panels = $(".bfd-panel");
	if (panels.length === 0) {
		return;
	}

	$.each(panels, function (index, item) {
		var modelParents = $(item).parents(".modal-body");
		if (modelParents.length > 0) {
			$(modelParents).addClass("bfd-body-background");
		} else {
			$("body").addClass("bfd-body-background");
		}
	})
}

/**
 * 初始化组件，在页面ready时调用
 */
function initComponent(dsname,vmObject) {
	initSelectByDataScriptObject();
	initSelectByDataset();
	initRadioButton();
	initTimeComponent();
	initRadioButtonCSS();
	initCollapse();
	initChineseRegion(vmObject);
	initLayout();

	initSelectByDynamicURL(dsname);
	initFileComponent(dsname);
	initZtree(dsname);
	initPanel();

	initWaypoint();
	//判断对象是否存在
	if (typeof(vmObject) == "undefined" || vmObject == undefined || vmObject.$id == undefined) {
		return;
	}
	initCheckBox(vmObject);
	initMultipleSelect(vmObject);
	initImage(vmObject);
}

//加载后运行，不需要代码调用
$(function () {
	initButtonOperationEvent();
	initPanel();
});

/**
 * 初始化列表展示模块
 * @param compid 组件ID
 * @param dsname 数据源名称
 * @param uri 数据表名称
 */
function initDisplayViewModel(compid,dsname,uri){

}





