//控制图片生成
var initedChartMap = [];
//用户自定义组件对象Map集合(id,obj)
var userDefineMap = new Map();

var tr_td_style = '';
var tr_td_label_style = ''
//生成属性面板HTML
function getPropertyPanelHtml(container,config){
	
	var html = getTableHeadHtml(config);
	
       	html += getPropertiesHtml(container,config);
		
		html += '</tbody></table></div>';
		
	return html;
}

//遍历属性生成相应的HTML
function getPropertiesHtml(container,config){

	var parent = container.parent();
	//parent.find(".form-panel-header .form-panel-title").text("属性配置");
	
	var html = '';
	for(var k in config){
		html += getPropertyPanelTr(parent,config[k]);
	}
	
	return html;
}



function getTableHeadHtml(config){

	var html = '<div><table class="table" type="'+tagType+'"><tbody>';
	
	//if(tagType!=="label"){
		//判断当前组件是否定义了id属性
		var isCustomId = false;
		$.each(config,function(key,val){
			if(val.attribute ==="compid"){
				isCustomId = true;
			}
		})
		//如果isCustomId==false，添加公共id,name属性
		if(!isCustomId){
			html += getIdNameHtml();
		}
	//}
	return html;
}

function getIdNameHtml(){
	var id_name = tagType+getCurrentTime();
	var id = typeof(tagComponent.attr("compid"))==="undefined"?
		id_name:tagComponent.attr("compid");
	var name = typeof(tagComponent.attr("compid"))==="undefined"?
		id_name:tagComponent.attr("compname");
	var html = [];
		html.push('<tr><td class="col-md-4 property-panel-td" >Id');
		html.push('<td class="align-left"><input class="form-textbox form-textbox-text col-md-12" '+((tagType==="layout" || tagType==="bfd_panel")?'disabled="disabled"':'')+' customevent="updateIdByBlur" type="text" id="compid" value="'+id+'"/></td></tr>');
		html.push('<tr><td class="col-md-4 property-panel-td">Name');
		html.push('<td class="align-left"><input class="form-textbox form-textbox-text col-md-12" data-toggle="popover" data-placement="top" data-content="设置组件显示名称" customevent="updateNameByBlur" type="text" id="compname" value="'+decodeURIComponent(name)+'"/></td></tr>');
		
	return html.join("");
}

//调用用户自定义扩展组件
function userDefine(panel,config,clzss){

	var exec = "new "+clzss+"(tagComponent,panel)" ;
	var obj = null;
	try{
		//使用eval方法,转义字符串生成对象
		obj = eval(exec);
		//保存对象实例
		if(obj.id){
			userDefineMap.put(obj.id,obj);
		}

		
	}catch(error){
		bootbox.alert(error.message);
	}
	return (config.group==="advance" || config.group === "events")?obj.loadPanel():obj.getHtml();
}




//动态获得属性行组成html
function getPropertyPanelTr(container,config){
	//根据配置文件，给当前组件属性赋初始值
	if(typeof config.defaultvalue !== "undefined" && typeof tagComponent.attr(config.attribute)==="undefined"){
		tagComponent.attr(config.attribute,config.defaultvalue);
	}
	
	var kv = config.type.split(":");
	var tr = '';
	if(kv[0]==="userDefine"){
		if(config.group==="advance"){
			container.parents(".tabs-container").find(".tabs-header .advance").removeClass("hide");
			userDefine(container.parents(".tabs-container").find(".tabs-panels .advance .form-panel-body"),config,kv[1]);
		}else if(config.group==="events"){
			container.parents(".tabs-container").find(".tabs-header .events").removeClass("hide");
			userDefine(container.parents(".tabs-container").find(".tabs-panels .events .form-panel-body"),config,kv[1]);
		}else{
			tr +='<tr><td class="col-md-4 property-panel-td">'+getPropertyName(config)+'</td><td class="align-left">'+userDefine(null,config,kv[1])+'</td></tr>';
			container.next().addClass("hide");
		}
		
	}else if(kv[0]==="preDefine"){
			
		tr +='<tr><td class="col-md-4 property-panel-td" '+tr_td_style+'>';
		tr += getPropertyName(config);
		tr += '</td><td class="align-left">';
		tr += getComponentByType(config).getHtml();
		tr +="</td></tr>";
		container.next().addClass("hide");		
	}
	
	
	return tr;
}


//根据配置文件中属性type选择不同的组件
function getComponentByType(obj){
	obj.isencode = "true";
    var component = new Label(obj);
	var kv = obj.type.split(":");
	switch(kv[1]){
		case "text":
			component = new InputText(obj);
			break;
		case "select":
			component = new Select(obj);
			break;
		case "label":
			component = new Label(obj);
			break;
		case "textarea":
			component = new TextArea(obj);
			break;
		case "selecttextarea":
			component = new SelectTextArea(obj);
			break;		
		case "selectinput":
			component = new SelectInput(obj);
			break;
	}
	return component;
			
}


//初始化组件ID
function initId(){
	if(typeof(tagComponent.attr("compid"))==="undefined"){
		var key = tagType;

		if(tagType === "modal_dialog"){
			key = "dialog";
		}


		var id = getCurrentTime();

		var value = key+id;
		tagComponent.attr("compid",value).attr("compname",value);
		////判断是否为数据项节点，如果是则要关联id。
		//if(tagComponent.parents('div[node="node"]')[0]){
		//	tagComponent.parents('div.column:first').prev().find("div.view").children().attr("relatedatrrbutes",value);
		//}
		//该组件有多个控件，如input[type=radio]、input[type=checkbox]

		if(tagType==="modal_dialog"){
			tagComponent.find("div[role='dialog']").attr("id",value).attr("name",value);
		}else if (tagType === "chinese_region"){
			tagComponent.find("input[name=areacode],input[name=areaname]").each(function(index,item){
				$(this).attr("ms-duplex-string",value+index).attr('compname', value+index);
				$(this).attr("id",value+index);
			})
		}
		else if(tagType === "advanced_select") {
			tagComponent.find("#advanced_select_dialog").each(function () {
				$(this).attr("id", value + "_dialog");
			})

			tagComponent.find("#advanced_select_confirm").each(function () {
				$(this).attr("id", value + "_confirm");
			})

			tagComponent.find("input[type=text]").each(function () {
				$(this).attr("ms-duplex-string", value + "_form_compute")
					.attr("ms-attr-disabled", value + "_form_disabled")
					.attr("id", value);
			})
		}
		else if(tagType === 'm_complex_component') {

		}
		else{
			var childrenId = 0;
			tagComponent.find("input,textarea,select,button,table,ul,label").each(function(index, item){
				var $this = $(this);
				if($this.is("input[type='radio'],input[type='checkbox']")){
					$this.attr("id",value+"_"+childrenId).attr("name",value);
					/*防止数据项树已经绑定字段被冲洗掉*/
					if($this.parents('div[node="node"]') != []){

					}else{
						// 在生成组件name时，设置ms-duplex-string="name" ms-attr-value="{{name}}"属性
						//$this.attr("ms-duplex-string",value+"_"+childrenId);
						if($this.attr("type") == "checkbox"){
							$this.attr("ms-duplex-string",value+"_form_compute");
						}else{
							$this.attr("ms-duplex-string",value);
						}
					}
					childrenId++;
				}else{
					//处理布局组件中嵌套有标签和输入框时，生成的id不正确情况
					if($this.parent().attr('type')) {
						value = $this.parent().attr('type') + getCurrentTime() + '' + index;
						$this.attr("id",value).attr("name",value);
						$this.parent().attr('compid', value).attr('compname', value);
					}
					else {
						$this.attr("id", value).attr("name", value);
					}
					/*防止数据项树已经绑定字段被冲洗掉*/
					if($this.parents('div[node="node"]') != []){

					}else{
						// 在生成组件name时，设置ms-duplex-string="name" ms-attr-value="{{name}}"属性
						if(!$this.is("label") && !$this.is("button")){
							$this.attr("ms-duplex-string",value);
						}
					}
				}
			});
		}



		//当同一页面存在多个标签组件，如果标签内容ID相同，标签切换时，tab active状态有故障.
		if(tagType === "chinese_region"){
			$(tagComponent).find(".tab-pane").each(function(index,item){
				var newId = $(item).attr("id")+id;
				$(item).attr("id",newId);
			})

			$(tagComponent).find("[data-toggle=tab]").each(function(index,item){
				var newHref = $(item).attr("href") + id;
				var newNext = $(item).attr("data-next") + id;
				$(item).attr("href",newHref).attr("data-next",newNext);
			})
		}
	}
	return tagComponent.attr("compid");
}
//根据配置类型生成组件对象
function findCurrentComp(){
	tagComponent = $(currenteditor).find("div[type]:first");
}
/*
function isExistsId(currentComponent) {
	currenteditor = currentComponent;
	tagType = $(currenteditor).find("div:first").attr("type");
	if(typeof(tagType)=="undefined"){
		bootbox.alert("未配置组件类型。");
		return;
	}
	findCurrentComp();
	if(typeof(tagComponent.attr("compid")) != "undefined") {
		return true;
	}
	else return false;	
}*/

function initTabs(){
	//默认显示第一个Tab,即属性配置;隐藏其他Tabs
	$(".tabs-container .tabs-header .tabs").find("li").each(function(index,value){
		if(typeof tagComponent.attr("tab-target")==="undefined"){
			if(index==0){
				$(this).addClass("tabs-selected").siblings().removeClass("tabs-selected").addClass("hide");
				$($(this).attr("panel-target")).removeClass("hide").siblings().addClass("hide");
			}
		}else{
			$(tagComponent.attr("tab-target")).addClass("tabs-selected").siblings().removeClass("tabs-selected");
			
			$($(tagComponent.attr("tab-target")).attr("panel-target")).removeClass("hide").siblings().addClass("hide");
		}
	});	
}

function updateDemoClickClass(obj){
	$(".form-component_active").removeClass("form-component_active");
	$(obj).addClass("form-component_active");

	$(".showRemove").removeClass("showRemove");
	$(obj).parent().children("[href=\"#close\"]").addClass("showRemove");
	$(obj).parent().children("[href=\"#add\"]").addClass("showRemove");

	$(obj).parent().children(".view").addClass("draggableHandle");
	//if(!$(obj).parent().hasClass("lyrow")){
	//	$(obj).parent().children(".view").addClass("draggableHandle");
	//}
}

function clickDemoView(obj){
	 updateDemoClickClass(obj);
	 return clickView(obj);
}

function updateFootClickClass(obj) {
	$(".form-component_active").removeClass("form-component_active");
	$(obj).parent().find("div[class='preview']").addClass("form-component_active");
	
	$(".showRemove").removeClass("showRemove");
	$(obj).parent().children("[href=\"#close\"]").addClass("showRemove");	 
}

function clickFootView(obj) {
	updateFootClickClass(obj);
	return clickView(obj);
}

function clickView(obj){

	currenteditor = obj;
	tagType = $(currenteditor).find("div:first").attr("type");
	if(typeof(tagType)=="undefined"){
		bootbox.alert("未配置组件类型。");
		return;
	}

	findCurrentComp();
	
	//初始化属性面板Tabs
	initTabs();
	
	var id = initId();
	
	var propertiesPanel = $(".form-layout-east .properties .form-panel-body");

	propertiesPanel.empty();

	
	var config;
	if(typeof(property[tagType])==="undefined"){
		bootbox.alert("请检查属性配置是否正确");
		return;
	}else{
		config = property[tagType];
	}
	propertiesPanel.append(getPropertyPanelHtml(propertiesPanel,config));
	
	if(tagType==="input_datetime"){
		if(typeof tagComponent.attr("datetimeformat")!=="undefined"&&typeof tagComponent.find(".form_time").data("DateTimePicker") !=="undefined"){
			tagComponent.find(".form_time").data("DateTimePicker").format(decodeURIComponent(tagComponent.attr("datetimeformat")))
		}
		
	}

	if(tagType === "layout") {
		if ($(currenteditor).parent().parent().hasClass("demo")
			&& $(currenteditor).find("[ms-controller]").length === 0) {
			var attrController = $(currenteditor).children().attr("ms-controller");
			if (attrController == undefined) {
				var vmid = "vm" + getCurrentTime();
				$(currenteditor).children().attr("ms-controller", vmid).attr("id", vmid).attr("compid", vmid).attr("compname", vmid);
				$("#compid,#compname").val(vmid);
			}
			$("#compname").popover("show");
		} else {
			tagComponent.attr("id", tagComponent.attr("compid"));
		}
	}

    if(tagType ==="imgBar" || tagType ==="imgLine" || tagType==="imgConnect"){
        //初始化图echarts
        if(initedChartMap.indexOf(tagComponent.attr("compid"))<0){
            var myChart = echarts.init($(currenteditor).find(".showImg")[0]);
            var option = {tooltip:{trigger:'axis'},legend:{data:['蒸发量','降水量']},toolbox:{show:true,feature:{mark:{show:true},dataView:{show:true,readOnly:false},magicType:{show:true,type:['line','bar']},restore:{show:true},saveAsImage:{show:true}}},calculable:true,xAxis:[{type:'category',data:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']}],yAxis:[{type:'value',splitArea:{show:true}}],series:[{name:'蒸发量',type:'bar',data:[2.0,4.9,7.0,23.2,25.6,76.7,135.6,162.2,32.6,20.0,6.4,3.3]},{name:'降水量',type:'bar',data:[2.6,5.9,9.0,26.4,28.7,70.7,175.6,182.2,48.7,18.8,6.0,2.3]}]};
            if(tagType ==="imgLine"){
                option.series[0].type = "line";
                option.series[1].type = "line";
            }
            myChart.setOption(option);
            initedChartMap.push(tagComponent.attr("compid"));
        }
    }

	if(tagType === "chinese_region"){
		$("#"+id).trigger("click.bs.dropdown");
	}
	
	return id;
		
}




//回显userDefine
function echoUserDefine(e){
	var obj = $(e.target);
	var flag = true;
	var echo = undefined;
	$.each(userDefineMap.keySet(), function(index, value) {
        //兼容 id+ getCurrentTime()_1
		//if(obj.attr("id")!= null && value.indexOf(obj.attr("id").substr(0,obj.attr("id").length-2))!=-1){
        if(value) value = value.split(",");

		if($.isArray(value) && $.inArray(obj.attr("id"),value)!=-1){
			echo = userDefineMap.get(value);
		}

	});
	if(typeof(echo)==="undefined"){
		flag = false;
	}else{
		if(echo.setProperty != undefined){
			echo.setProperty(e,obj.attr("id"));
		}
	}
	return flag;
		
}

//验证配置文件中的validation属性
function propertyValidate(e){
	var obj = $(e.target);
	if(typeof(obj.attr("validation"))!=="undefined"){
		var json = JSON.parse(obj.attr("validation"));
		if(e.type===json.trigger){			
			var reg = new RegExp(json.expression,"g");
			var result=$.trim(obj.val()).replace(reg,"");
			if(result==""){
				return true;
			}else{
				bootbox.alert(json.message);
			}
		}
		return false;
	}else{
		return true;
	}
	
}


function commonPropertyEvent(obj){
/* 	if(obj.attr("isencode")==="true"){
		tagComponent.attr(obj.attr("id"),encodeURIComponent(htmlEncode(obj.val())));
	}else{
		tagComponent.attr(obj.attr("id"),htmlEncode(obj.val()));
	} */
	
	tagComponent.attr(obj.attr("id"),encodeURIComponent(html2Escape(obj.val())));
	
	
}

function execPropertyEvent(e){
	var obj = $(e.target);
	if(propertyValidate(e)){
			if(!echoUserDefine(e)){
				if(evalCustomEvent(e)){
					commonPropertyEvent(obj);
				}
			}
	};
}

var property = null;
var typeArray = [];

$(document).ready(function () {
	$.getJSON('js/frame/property/propertyConfig.json', function (json) {
			property = json;
			for (var key in property) {
				typeArray.push(key);
			}
		}
	)

	$(".tabs-container ul.tabs>li").click(function () {
		$(this).addClass("tabs-selected");
		$(this).siblings().removeClass("tabs-selected");
		var panel = $(this).attr("panel-target");
		$(panel).removeClass("hide");
		$(panel).siblings().addClass("hide");
		tagComponent.attr("tab-target", "#" + $(this).attr("id"));

	})

	//保存属性
	var inputVal = "";
	$('.properties .form-panel-body')
		.on('focus', 'input,textarea', function (e) {
			//获取焦点时，缓存其值，在失去焦点时进行对比，如果相同则不做处理，提高效率和减少故障。
			inputVal = $(e.target).val();
		})
		.on("blur", "input,textarea", function (e) {
			e.preventDefault();
			if(inputVal !== $(e.target).val()) {
				execPropertyEvent(e);
			}
			e.stopPropagation();


		}).on("change", "select,input[type='checkbox'],input[type='radio']", function (e) {
			e.preventDefault();
			execPropertyEvent(e);
			e.stopPropagation();
		}).on("click", "select,button,span,ul", function (e) {
			e.preventDefault();
			if ($(this).attr("id") === "field") {
				var vmDataFieldsManage = new VMDataFieldsManage(tagComponent);
				if (!vmDataFieldsManage.isSetVMURI()) {
					bootbox.alert("请选择数据源！");
				}
			}
			else if ($(this).attr("type") === "button") {
				execPropertyEvent(e);
			}
			e.stopPropagation();
		}).on("input","input,textarea",function(e){
			execPropertyEvent(e);
		});/*.on("blur", "textarea", function (e) {
			e.preventDefault();
			execPropertyEvent(e);
			e.stopPropagation();
		});*/

})