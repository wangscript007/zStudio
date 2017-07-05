//在此统一定义全局变量
window.designFormGrolbalObject = {
	//定义一个流程的变量
	process: {},
	datamodel: {},
	commonconst: {
		processid:'processId',
		datamodelid:'dmid',
	},

	//demo滚动条样式，通过该变量调整
	demoMCustomScrollbarTheme: '3d-dark',
	//是否格式化框架代码
	isFramecodeFormat: true

};


//恢复数据
function restoreData(){
	if(currentFile === undefined || currentFile === '') {
		return;
	}
	$.ajax({
			async: false,
			cache: false,
			type: 'GET',
			contentType :'application/json; charset=UTF-8',
			url: "jersey-services/layoutit/frame/html/get/" + currentFile+"/",
			success: function (data, textStatus) {
				if (data != undefined && data.data) {
					$("#container_data>div").html("");
					$("#container_data").html(data.data);
					$.each($(".footer-bg").find("div[type='i18nfile']"),function(index,item){
						var filePath = $(item).attr("i18npath");
						i18npath = filePath.substring(0,filePath.lastIndexOf("/")+1);
						i18nFileName = filePath.substring(filePath.lastIndexOf("/")+1,filePath.indexOf("."));
						initI18NProperties(i18nFileName,i18npath,i18nLanguage);
					});

				}
				//初始化开关控件开始、
				var divArr = $('.demo div[type="m_switch"]');
				for(i = 0;i<divArr.length;i++){
					var id = $(divArr[i]).attr("compid");
					var size = $(divArr[i]).attr("data-switchsize");
					var color = $(divArr[i]).attr("data-switchcolor");
					var defaultVal = $(divArr[i]).attr("data-defaultvalue");
					var inputString = "<input id=\""+id+"_0\" type=\"checkbox\" checked/>"; 
					$(divArr[i]).children().empty();
					$(divArr[i]).children().append(inputString);
					var checkId = id + "_0";
					$("[id="+checkId+"]").bootstrapSwitch("size",size);
					if(defaultVal === "On"){
						$("[id="+checkId+"]").bootstrapSwitch("state",true);
					}else{
						$("[id="+checkId+"]").bootstrapSwitch("state",false);

					}
					colorSwitchDecide(color,$(divArr[i]));
				}
				//初始化开关控件结束
				//初始化界面框架
				initFrame();

				//初始化滚动条
				$('.demo_parent').mCustomScrollbar({theme: window.designFormGrolbalObject.demoMCustomScrollbarTheme});

				if($('.footer-bg').html().trim().length > 0) {
					$('.footer-bg').css('background-image', 'none');
				}

			}
		}
	);
}
/**
 * 判断设计页面是否变化 
 * @return  false:页面内容未修改；true:页面内容修改
 */
function isFormDataChanged(){
	var result = false;
	if(!currentFile) {
		return result;
	}

	$.ajax({
		async: false,
		cache: false,
		type: 'GET',
		contentType :'application/json; charset=UTF-8',
		url: "jersey-services/layoutit/frame/html/get/" + currentFile+"/",
		success: function (data, textStatus) {
			if(data && data.data && data.data.length > 1){		
				var oldHtml = data.data.substring(0,data.data.length-1);
				if(oldHtml !== formatFrameHtml()){
					result = true;
				}
			}
		}
	});

	return result;
}

/**
 *获取块的信息，为生成数据权限
 */
function getPieces(){
	var panels = $('.demo').find('div[type="bfd_panel"]'),
		pieces= [];
	$.each(panels, function(index, item) {
		var title = $(item).find("label:first").text().trim(),
			array = [];
		$.each($(item).find("div[type='input_text'],div[type='textarea'],div[type='select_static'],div[type='select_dynamic'],div[type='input_radio'],div[type='checkbox'],div[type='input_datetime'],div[type='input_fileinput'],div[type=chinese_region]>div>[compname],div[type=image],div[type=m_switch],div[type='label']"), function(index, value) {
			var field = $(value),
				column = getFieldid(field);
			if (!column) {
				return;
			}
			array.push('"'+column+'"');
		});

		pieces.push('{"title":'+'"'+title+'","columns":'+'['+array.join(",")+']}');
	});
	return pieces.join(",")
}

function HtmlInfo() {
	this.meta = '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n'   +
			'    <meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1">\n' +
	'    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
	var refer = new ReferenceManage();
	this.csses = refer.getCSS();
	this.jses = refer.getJS();

	if(location.pathname === '/designer/index-m.html') {
		this.csses.push('css/mobile/page-mobile.css');
	}
	
    this.selfjses = new Array();
    this.selfcsses = new Array();
	this.selfi18nes = new Array();
	this.page = getPageVM();
	this.pieces = getPieces();
	this.dmid = getUrlParam('dmid',window.location.search);
	
	var jsObjects = getJsObject();
	var jscode = "",jsdoccode = "$(document).ready(function(){\n";
	var self = this;
	$.each(jsObjects, function(index, item) {
		jscode = jscode + escape2Html(item.jscode);
		jsdoccode = jsdoccode + escape2Html(item.jsdoccode);
		if(item.jspath != '') {
            $.each(item.jspath.split("\n"), function(index1, item1) {
                if(item1.trim().length > 0) {
                    self.selfjses.push(item1.trim());
                }
            });

		}
	});
	jsdoccode +=  "\n})";

	var i18nObjects = getI18nObject();
	if(i18nObjects != undefined) {
		$.each(i18nObjects, function (index, item) {
			if (item.i18nfilepath != '') {
				$.each(item.i18nfilepath.split("\n"), function (subIndex, subItem) {
					if (subItem.trim().length > 0) {
						self.selfi18nes.push(subItem.trim());
					}
				});
			}
		});
	}

    var cssObjects = getCssObject();
    $.each(cssObjects, function(index, item) {
        if(item.csspath != '') {
            $.each(item.csspath.split("\n"), function(index1, item1) {
                if(item1.trim().length > 0) {
                    self.selfcsses.push(item1.trim());
                }
            });
        }
    });

    this.modaldiaog = getModalDialog();
	this.getHtmlObject = function(formatSrc, frameContent) {
		if(formatSrc.indexOf("imgMap")!=-1){
			this.jses.push("http://api.map.baidu.com/api?v=2.0&ak=q0FM7fZWFvpIM2PxjEdrztV8");
		}

		return {"frameContent" : frameContent,
			"meta": this.meta, 
			"titile": "title", 
			"css" : this.csses,
			"js": this.jses, 
			"body": formatSrc, 
			"pageVM": this.page,
			"modaldialog":this.modaldiaog,
			"jscode": jscode,
			"jsdoccode":jsdoccode,
            "selfjs":this.selfjses,
			"pieces":this.pieces,
			"dmid":this.dmid,
            "selfcss": this.selfcsses,
			"selfi18n": this.selfi18nes};
	}

}

/**
 * 获取js对象
 * @returns {Array}
 */
function getJsObject() {
	var jses = new Array();//{jspath:'', jscode:''};
	$.each($(".footer-bg").find("div[type='jsscript']"), function(index, item) {
		var jscode = '';
		if($(item).attr("jsscript") != undefined) {
			jscode = decodeURIComponent($(item).attr("jsscript")) + "\n";
		}
		var jspath = '';
		if($(item).attr("jspath") != undefined) {
			jspath = escape2Html(decodeURIComponent($(item).attr("jspath")));
		}
		var jsdoccode = '';
		if($(item).attr("jsdoccode") != undefined) {
			jsdoccode = escape2Html(decodeURIComponent($(item).attr("jsdoccode")) + "\n");
		}
		jses.push({jspath: jspath, jscode: jscode,jsdoccode:jsdoccode});
	});
	return jses;
}

/**
 * 获取css对象
 * @returns {Array}
 */
function getCssObject() {
    var csses = new Array();//{jspath:''};
    $.each($(".footer-bg").find("div[type='cssscript']"), function(index, item) {
        var csspath = $(item).attr("csspath");
        if(csspath != undefined && csspath.trim().length > 0) {
            csses.push({csspath:escape2Html(decodeURIComponent(csspath))});
        }
    });
    return csses;
}
/**
 * 获取i18n文件路径
 * @returns {Array}
 */
function getI18nObject(){
	var i18nFilePath = new Array();
	$.each($(".footer-bg").find("div[type='i18nfile']"),function(index,item){
		var filepath = $(item).attr("i18npath");
		if(filepath != undefined && filepath.trim().length > 0){
			i18nFilePath.push({i18nfilepath:escape2Html(decodeURIComponent(filepath))});
		}
	});
	return i18nFilePath;
}
function isValid() {
	var vms = $(".demo").find("div[ms-controller]");
	var isvalid = true;
	var message = "";
	$.each(vms, function(index, item) {
		//验证工作
		//非表格布局器，无按钮直接不通过。
		var vmid = $(item).attr("ms-controller");
		if($(item).find("table").size() == 0 && $(item).find("button").size() == 0) {
            if($(item).find("div[type='tree']")) {
                isvalid = true;
                return true;
            }
			message = '无表格组件的布局器中必须有按钮才能正常工作。';
			isvalid = false;
			return true;
		}
		if($(item).find("div[type='input_text'],div[type='textarea'],div[type='select_static'],div[type='select_dynamic'],div[type='input_radio'],div[type='input_datetime'],div[type='input_fileinput']").size() > $(item).find("div[field]").size()) {
			message = '有字段未绑定数据列。';
			isvalid = false;
			return true;
		}
	});
	if(message != "") {
		bootbox.alert(message);
	}
	return isvalid;
}
//获取日期组件
function getDateTimePicker($item){
	var datetimes = $item.find("div[type='input_datetime']");
	var datetime = ["datetime="];
	if(datetimes.length>0){
		$item.find("div[type='input_datetime']").each(function(){
			var $this = $(this);
			if(typeof $this.attr("datetimeformat") !== "undefined"){
				datetime.push('format='+$this.attr("datetimeformat")+",");
			}else{
				datetime.push("format=YYYY-MM-DD%20HH%3Amm%3Ass,");
			}
			datetime.push("id="+$this.attr("compid")+"@");
		});
	}
	return datetime.join("");
	
}

//获取对话框组件
function getModalDialog(){
	var result = [];
	$(".footer-bg").find("div[type='modal_dialog']").each(function(){
			var $this = $(this);
			var modaldialog = [];
			
			modaldialog.push("id="+$this.attr("compid"));
			modaldialog.push("footer_btn_id="+$this.find(".modal-footer>.modalbtn").attr("id"))
			modaldialog.push('footer_btn_event='+JSON.parse(decodeURIComponent($this.attr("footer"))).btnevent);
			
			result.push(encodeURIComponent(modaldialog.join("@")));
	});
	

	return result;
	
}

function getPageVM() {
	var vms = $(".demo").find("div[ms-controller]");
	var result = new Array();
	$.each(vms, function(index, item) {
		var vmid = $(item).attr("ms-controller");
		// form类型的vm
		var vmType = "form";
		if($(item).find("div[type='table_base'],div[type='table_base_local']").size() > 0) {
			vmType = "table";
		}

		if($(item).find("div[type='table_base_local']").parents("[type=layout][bfd_set_type=array]").size() > 0) {
			vmType = "form";
		}

		if($(item).find("div[type='imgBar'],div[type='imgPie'],div[type='imgLine'],div[type='imgConnect'],div[type='imgMap']").size() > 0) {
            vmType = "chart";
        }

		if($(item).find("div[type=product_list]").size()>0) {
			vmType = "display";
		}
		
		//获取字段
		var fields = "fields=form_field="; //这里存在传入多个参数的情况
		var valid = "componentvalid=";
        var fieldCounter = 0;
		$.each($(item).find("div[type='input_text'],div[type='textarea'],div[type='select_static'],div[type='select_dynamic'],div[type='input_radio'],div[type='checkbox'],div[type='input_datetime'],div[type='input_fileinput'],div[type=chinese_region]>div>[compname],div[type=image],div[type=m_switch],div[type='label'],div[type=advanced_select],div[type=vertical_list]"), function(index, value) {
			var field = $(value);
			var hasValid = false;
			var tmpValid = "";
			var id = getFieldid(field);
			if (!id) {
				return;
			}
			var type = field.attr("fieldtype");
			if (type == undefined) {
				type = "string";
			}

			fields = fields + "id=" + id + ",type=" + type + ",";
			if (typeof field.attr("defaultvalue") !== "undefined") {
				//处理多值绑定问题，属性默认值从服务端解码。
				fields += "defaultvalue=" + escape2Html(field.attr("defaultvalue"));
			} else {
				fields += "defaultvalue=";
			}
			fields += ",componenttype=" + getComponentType(field);

			var $parentUri = $(field).parents("[uri]:first"),
				parenttype = "";
			if ($parentUri) {
				parenttype = $parentUri.attr("bfd_set_type");
			}
			if (parenttype) {
				fields += ",parenttype=" + parenttype + "@";
			} else {
				fields += ",parenttype=@";
			}

			if (field.attr("vnotempty") != undefined) {
				hasValid = true;
				tmpValid = tmpValid + "vnotempty=" + field.attr("vnotempty");
			}
			if (field.attr("vstringlength") != undefined) {
				if (hasValid) {
					tmpValid = tmpValid + ",";
				}
				hasValid = true;
				tmpValid = tmpValid + "vstringlength=" + field.attr("vstringlength");
			}
			if (field.attr("vtype") != undefined) {
				if (hasValid) {
					tmpValid = tmpValid + ",";
				}
				hasValid = true;
				tmpValid = tmpValid + "vtype=" + field.attr("vtype") + ",vcontent=" + encodeURIComponent(escape2Html(decodeURIComponent(field.attr("vcontent"))));
			}
			if (hasValid) {
				valid += "name=" + field.attr("compname") + "," + tmpValid + "@";
			}
			fieldCounter++;

		});

		//处理form中包含表格的情况，当本地表格绑定的是数组对象时，则将其放在表单模型中生成vm对象。
		var tableParams = "tableParams=";
		if(vmType === "form") {
			$(item).find("div[type='table_base_local']").each(function (index, table) {
				fieldCounter++;
				var tableColumns = $(table).attr("field");
				if (tableColumns) {
					fields += decodeURIComponent(tableColumns);
					tableParams += "querycolumns=" + $(table).attr("querycolumns") + ",";
					tableParams += "tableid=" + $(table).attr("compid") + ",";
					tableParams += "parameter=" + $(table).attr("parameter") + ",";
					tableParams += "formuri=" + $(table).attr("formuri") + "@";
				}
			})
		}

		//树组件
		$(item).find("div[type=tree]").each(function(index,tree){
			fieldCounter++;
		})

		//获取事件
		var event = "componentevent=";
		$.each($(item).find("div[componentevent]"), function(index, value) {
			event = event + $(value).attr("componentevent")+"@";
		});

		if(fieldCounter == 0 && vmType == "form" && event== "componentevent=") {
			return true;
		}
		
		//获取需要初始化的组件的属性值
		var customAttrbutes="customAttrbutes="+getCustomAttributes($(item));
		
		//获取组件是否可编辑信息
		//var editor = getEditable($(item));
		
		//获取日期组件
		var datetimes = getDateTimePicker($(item));

		//获取组件可显示属性
		var visibility = getComponentVisibility($(item));
		
		//参数完毕使用分号，参数内部嵌套使用逗号分割，fields内部多个之间使用#号分隔，每个参数内部使用@符号
		if(vmType == "form") {
			var vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + $(item).attr("dsname") + ";uri=" + $(item).attr("uri") + ";method=POST;";
			result.push(vmInfo + fields + ";" + event + ";" + valid + ";" + customAttrbutes + ";" + datetimes + ";" + visibility + tableParams);
		}
		
		//table类型的vm
		else if(vmType == "table") {
			var vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + $(item).attr("dsname") + ";uri=" + $(item).attr("uri") + ";method=GET;";
			var datasourceInfo = new ComponentDataFieldsManage($(item).find("div[type='table_base'],div[type='table_base_local']"));
			if (datasourceInfo.isSetDataSourceInfo()) {
				vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname=" + datasourceInfo.getDataSourceName() + ";uri=" + datasourceInfo.getUri() + ";method=GET;";
			}

			var tableParams = "tableParams=";
			$(item).find("div[type='table_base'],div[type='table_base_local']").each(function (index, table) {
				tableParams += "querycolumns=" + $(table).attr("querycolumns") + ",";
				tableParams += "tableid=" + $(table).attr("compid") + ",";
				tableParams += "parameter=" + $(table).attr("parameter") + ",";
				tableParams += "formuri=" + $(table).attr("formuri") + "@";
			})

			result.push(vmInfo + fields + ";" + event + ";" + valid + ";" + customAttrbutes + ";" + datetimes + ";" + visibility + tableParams);
		}

        //chart类型的vm
        else if(vmType == "chart"){
            var chartItem = $(item).find("div[type='imgBar'],div[type='imgPie'],div[type='imgLine'],div[type='imgConnect'],div[type='imgMap']");
            for(var i=0;i<chartItem.length;i++){
                var opt = $(chartItem[i]).attr("chartoption");
                var imgId = $(chartItem[i]).attr("compid");
                var vmInfo = "vmtype=" + vmType + ";vmid=" + imgId + ";;;;;customAttrbutes="+ opt +";option="+ opt;
                result.push(vmInfo);
            }
        }
		//数据列表展示组件
		else if(vmType == "display") {
			var vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname="+$(item).attr("dsname")+ ";uri=" + $(item).attr("uri") + ";method=GET;";
			var datasourceInfo = new ComponentDataFieldsManage($(item).find("div[type='product_list']"));
			if(datasourceInfo.isSetDataSourceInfo()){
				vmInfo = "vmtype=" + vmType + ";vmid=" + vmid + ";dsname="+datasourceInfo.getDataSourceName()+ ";uri=" + datasourceInfo.getUri() + ";method=GET;";
			}
			var compid = "compid=" + $(item).find("div[type='product_list']").attr("compid") + ";";
			result.push(vmInfo + fields + ";" + event + ";" + valid + ";" + customAttrbutes + ";" +datetimes + ";"+ visibility +compid);
		}
		
	});
	return result;
}

/**
 * 获取id字段供服务端使用
 * @param object
 * @return
 */
function getFieldid(object) {
	var id = object.attr("field");
	if (!id && object.attr("type") !== "label") {
		id = object.attr("compname");
	}
	//做解码操作
	if(id != undefined){
		id = decodeURIComponent(escape2Html(id));
	}
	return id;
}

//function getEditable(vmObject) {
//	var edits = "editor=";
//	$.each(vmObject.find("div[editable]"), function(index, item){
//
//		edits = edits + "editable="+$(item).attr("editable")+",field=" + getFieldid($(item)) + "@";
//	});
//	return edits + ";";
//}
/**
 * 获取隐藏属性为“true”的所有组件
 * @param vmObject
 */
function getComponentVisibility(vmObject){
	var visibility = "";
	if(vmObject.attr("componentvisibility") != undefined){
		visibility += vmObject.attr("id")+"="+ vmObject.attr("componentvisibility");
	}
	$.each(vmObject.find("[componentvisibility]"),function(index,item){
		if(visibility != ""){
			visibility += "@";
		}
		visibility +=$(this).attr("id")+"="+$(this).attr("componentvisibility");
	})
	return "componentvisibility="+visibility+";";
}

/*
	获取VM下自定义属性
*/
function getCustomAttributes(vmObject){
	var objects=[];
	$.each($(vmObject).find("div[init]"),function(index,item){
		var attrs=$(item).get(0).attributes;
		var compid=$(item).attr("compid");		
		for(var i=0;i<attrs.length;i++)	{
			var jsonObjectAttrs={};
			jsonObjectAttrs.name=attrs[i].name;
			jsonObjectAttrs.value=decodeURIComponent(attrs[i].value);			
			jsonObjectAttrs.compid=compid;			
			objects.push(jsonObjectAttrs);	
		}		
	});
	var result = {};
	result.attributes = objects;
	return encodeURIComponent(JSON.stringify(result));	
}
/**
 * 获取组件类型
 * */
function getComponentType(component){
	if(component == undefined){
		return "";
	}
	var type = $(component).attr("type");
	if(type != undefined && type == "select_dynamic"){
		var selectType = $(component).attr("selecttype");
		if(selectType != undefined && selectType == "multiple"){
			type = "multipleselect";
		}
	}

	return type;
}

function _adjustOrder(selectElement) {
	var boxarr = [],
		lyrow = [];

	$.each(selectElement, function () {
		if ($(this).hasClass('box')) {
			boxarr.push(this);
		}
		else {
			lyrow.push(this);
		}
	});

	var hasExecuteLyrow = [];
	$.each(boxarr, function () {
		var that = this;
		if ($(that).find('div[type="tab"]').length > 0) {
			//布局器代码需要从前往后执行，发现组件本身包含布局组件时，先顺序执行布局组件代码。
			$.each(lyrow, function () {
				var compid = $(this).find('.view>div[type="layout"],.view>div[type="bfd_panel"]').attr('compid');
				if ($(that).has('div[compid="' + compid + '"]').length > 0) {
					cleanHtml(this);
					hasExecuteLyrow.push(this);
				}
			});			
		}
	});

	$.each(hasExecuteLyrow, function () {
		selectElement.splice(jQuery.inArray(this, selectElement), 1);
	});

	$.each(selectElement, function () {
		cleanHtml(this);
	});
}

/**
 * 调整生成代码的css，去掉不需要的css
 */
function adjustCss() {
    var t = $("#download-layout").children();
    t.find(".preview, .configuration, .drag, .remove,.lyrow>.add,.form-component-operator").remove();
    t.find(".lyrow").addClass("removeClean");
    t.find(".box-element").addClass("removeClean");
	_adjustOrder(t.find(".lyrow .lyrow .lyrow .lyrow .lyrow .removeClean"));
	_adjustOrder(t.find(".lyrow .lyrow .lyrow .lyrow .removeClean"));
	_adjustOrder(t.find(".lyrow .lyrow .lyrow .removeClean"));
	_adjustOrder(t.find(".lyrow .lyrow .removeClean"));
	_adjustOrder(t.find(".lyrow .removeClean"));	
	_adjustOrder(t.find(".removeClean"));
    t.find(".removeClean").remove();    
    $("#download-layout .column").removeClass("ui-sortable");
    //$("#download-layout .column").css("padding-bottom","");

    $("#download-layout .row-fluid").removeClass("clearfix").children().removeClass("column");
    if ($("#download-layout .container").length > 0) {
        changeStructure("row-fluid", "row")
    }
    return t;
}

function getFormatCode() {
	var $demoParent = $(".demo_parent")
	if($demoParent.hasClass('mCustomScrollbar')) {
		$demoParent.mCustomScrollbar('destroy').removeClass('mCS_destroyed')
	}
	var tableComponent = new TableComponent();
	tableComponent.sourceCodeOperatorBefore($(".demo"));
	var fileUpload=new FileUploadComponent();
	fileUpload.sourceCodeOperatorBefore($(".demo"));
    var treeComponent = new TreeComponent();
    treeComponent.sourceCodeOperatorBefore($(".demo"));
	var multiSelect = new MultipleSelectComponent();
	multiSelect.sourceCodeOperatorBefore($(".demo"));
    var chartsComponent = new ChartsComponent();
    chartsComponent.sourceCodeOperatorBefore($(".demo"));
	$(".demo").btnGroup('clean');

	//移动端代码清理
	if(typeof(bfdMobile) !== 'undefined') {
		bfdMobile.cleanFrame();
	}

	//pc端代码清理
	if(typeof(bfdPc) !== 'undefined') {
		bfdPc.cleanFrame();
	}

	$("#download-layout").children().empty();
	$("#download-layout").children().html($(".demo").html());

    var t = adjustCss();
    
	t.addClass("container-top");
	t.find('div[ms-controller]').each(function(){
		var $this = $(this);
		$this.addClass("form-horizontal");
		//布局器的样式判断和保存
		if($this.attr("layoutstyle") != undefined && $this.attr("layoutstyle") != ""){
			var customStyle = $this.attr("layoutstyle");
			$this.addClass(customStyle);
		}

		$this.find('div[type="layout"]').each(function(){
			var $layout = $(this);
			$layout.attr("id",$layout.attr("compid"));
			$layout.addClass("form-group");
			//判断无title时上移10px分隔栏
			$layout.find('div[type="separator"]').each(function(){
				var $separator = $(this);
				var separVal = $separator.find(".title").html().trim();
				if(separVal == "" || separVal == undefined){
					$layout.css("height","10px");
					$separator.children().css("height","10px");
				}
			});
			//增加布局器样式
			if($layout.attr("layoutstyle") != undefined && $layout.attr("layoutstyle") != ""){
				var customStyle = $layout.attr("layoutstyle");
				$layout.addClass(customStyle);
			}
		});
		  $this.find('div.form-group>.row').each(function(){
			var $this = $(this);
			
			var group =[];
			
			$this.find("input").each(function(){
				$(this).attr("data-bv-group",".group").parent().addClass("group");
			});
			
			
			for(var i in group){
				$(this).append(group[i]);
			}
			
			
		});
		
		$this.find(".row").each(function(){
			//$(this).addClass("layout-row-width");
			$(this).removeClass("clearfix column ui-droppable");
		});  
		
		
	});

    var code = $.htmlClean($("#download-layout").html(), {
        format: true,
			allowedAttributes: [
			["compid"], ["compname"], ["id"], ["class"], ["placeholder"],
			["data-toggle"], ["data-target"], ["data-parent"], ["role"],
			["data-dismiss"], ["data-ly-params"],
			["aria-labelledby"], ["data-bv-group"],
			["aria-hidden"], ["data-slide-to"],
			["data-slide"], ["ms-controller"],
			["ms-duplex"], ["ms-attr-value"],
			["ms-click"], ["ms-duplex-number"],
			["ms-duplex-string"], ["ms-repeat-e1"],
			["fileuploadurl"], ["type"],
			["allowedfileextensions"], ["data-show-preview"], ["i18nkey"], ["i18nkeyforph"],
			["style"], ["href"], ["onclick"], ["width"], ["height"], ["src"], ["dstype"], ["definitionname"],
			["relationmodel"], ["waypointsetting"], ["data-submit-type"],
			["data-min-level"], ["data-max-level"], ["readonly"], ["srcfield"],
			['submit-event'], ['data-products'], ["data-params"], ["data-switchsize"],
			["data-switchcolor"], ["switch-event"], ["data-defaultvalue"], ["field"], ["bfd-button-dialog"], ["bfd-button-query"],
			["bfd-operation-params"], ["bfd-button-operations"],["bfd-query-operation"],["bfd-uri-path"], ["data-mobile"], ["ms-text"], ["compsrc"],
			["componentevent"], ["data-function"],["bfd-button-link"],["bfd-panel-height"],["bfd-panel-scrollbar-style"],
			["editable"], ["bfd-dialog-title"],["bfd-dialog-url"],["bfd-dataset-config"],["vtype"]],
        removeTags:[]
    }); 
	tableComponent.sourceCodeOperatorAfter($(".demo"));	
	fileUpload.sourceCodeOperatorAfter($(".demo"));
    treeComponent.sourceCodeOperatorAfter($(".demo"));
	multiSelect.sourceCodeOperatorAfter($(".demo"));
    chartsComponent.sourceCodeOperatorAfter($(".demo"));
	$(".demo").btnGroup('restore');

	if(typeof(bfdMobile) !== 'undefined') {
		bfdMobile.restoreFrame();
	}

	//pc端代码恢复
	if(typeof(bfdPc) !== 'undefined') {
		bfdPc.restoreFrame();
	}

	$demoParent.mCustomScrollbar({theme: window.designFormGrolbalObject.demoMCustomScrollbarTheme});

	var imgageComponent = new ImageComponent();
	code = imgageComponent.sourceCodeOperator($(code))
	var tabComponent = new TabComponent();
	code = tabComponent.sourceCodeOperator($(code));
	var collapseComponent = new CollapseComponent();
	code = collapseComponent.sourceCodeOperator($(code));
	return code;
}

/**
 * 获取隐藏区域代码（只有对话框代码）
 * @returns {对话框生成代码}
 */
function getHideFormatCode() {
	if($(".footer-bg").html() == "") {
		return "";
	}
	$("#download-layout").children().html($(".footer-bg").html());
    adjustCss();

    var code = $.htmlClean($("#download-layout").html(), {
        format: true,
        allowedAttributes: [
		["id"], ["class"], 
		["data-toggle"], ["data-target"], 
		["data-parent"], ["role"], 
		["data-dismiss"],["data-ly-params"], 
		["aria-labelledby"], ["aria-hidden"],
        ["data-slide-to"], ["data-slide"],["bfd_dialog_url"],["bfd_dialog_title"]]
    });
	return $(code).html();
}

/**
 * 格式化框架文件html
 * */
function formatFrameHtml(){
	var $demoParent = $(".demo_parent"),
		frameHtml = $("#container_data").html();
	if(typeof(bfdPc) !== 'undefined') {
		$demoParent.bfdPanel("clean");
	}
	$demoParent.mCustomScrollbar('destroy').removeClass('mCS_destroyed');
	// 根据配置参数判断是否需要格式化
	if(designFormGrolbalObject.isFramecodeFormat) {
		frameHtml = HTMLFormat($("#container_data").html());
	}
	$demoParent.mCustomScrollbar({theme: window.designFormGrolbalObject.demoMCustomScrollbarTheme});
	if(typeof(bfdPc) !== 'undefined') {
		$(".demo").bfdPanel("restore");
	}

	return frameHtml;
}

//保存框架源码并生成页面可用的html和js代码
function save(showMessage) {
//	if(!isValid()) {
//		return;
//	}
	if (currentFile) {
		var result = DesignerLock._requireLock(currentFile);
		if (result.status != 1) {
			$("#button-share-modal").attr('disabled', 'true');
			$("#button-preview").attr('disabled', 'true');
				
			alert(result.message);
			return;
		}
	}

	var frameHtml =formatFrameHtml();
	var htmlInfo = new HtmlInfo();
	var data = JSON.stringify(htmlInfo.getHtmlObject(getFormatCode() + "\n" + getHideFormatCode() , frameHtml)); 
	
	$.ajax({
		type: "POST",
		url: "jersey-services/layoutit/frame/html/save/" + currentFile+"/",
		data: data,
		traditional: true,
		contentType :'application/json; charset=UTF-8',
		async: false,
		success: function (data, textStatus) {
			if(showMessage == undefined || showMessage){
				if(data.data==="success"){
					bootbox.alert('保存成功。');
				}else{
					bootbox.alert('保存失败。');
				}
			}
		},
		/*complete: function (XMLHttpRequest, textStatus) {
		  alert("complete");
		},*/
		error: function (XMLHttpRequest, textStatus, errorThrown) {
		  bootbox.alert('保存过程中发生了错误。');
		}
		
	});
	push2Parents = [];
}

function getI18nKey(){

	if (i18nFileName === undefined
		|| i18nFileName.trim().length == 0
		|| i18npath === undefined
		|| i18npath.trim().length == 0) {
		return [];
	}

	var realpath = i18npath + i18nFileName + ".properties";
	var i18nkey = new Array();
	$.ajax({
		async:false,
		type:"GET",
		url:"jersey-services/layoutit/frame/file/i18n/get",
		data:"path=" + realpath,
		contentType :'application/json; charset=UTF-8',
		success:function(data){
			i18nkey = data;
		},
		error: function (XMLHttpRequest,  textStatus, errorThrown) {
			console.log(textStatus+"|"+errorThrown);
		}
	});
	return i18nkey;
}
$(document).ready(function() {
	$("#helpOnline").attr("href","http://"+window.location.hostname+"/client/help.html");
	$("#serviceOnline").attr("href","http://"+window.location.hostname+"/client/service.html");
});