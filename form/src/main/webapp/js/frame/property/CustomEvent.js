 /*!
 *	自定事件类，类中方法对应配置文件中的"customevent"属性，如"customevent": "updateSelectStatic"
 */
 
function CustomEvent(){
	return new CustomEvent.prototype.init();
} 

jQuery.CustomEvent = CustomEvent;

CustomEvent.prototype = {

	constructor: CustomEvent,
	
	init : function(){
		return this;
	},
	
	operationMsAttr : function(obj,component){
		component.removeAttr("ms-duplex-string");
		component.removeAttr("ms-duplex-number");
		component.removeAttr("ms-duplex");
		component.removeAttr("ms-text");

		var fieldType = obj.find("option:selected").attr("type");
		var field = obj.val();
		if(field != ""){
			var componentType=this.getComponentType(component);
			if(componentType != undefined){
				if(componentType == "multipleselect" || componentType == "checkbox"){
					field += "_form_compute";
				}
			}
			//判断label是否绑定字段
			if(componentType != undefined && componentType == "label"){
				component.attr("ms-text",field);
			}else{
				if(fieldType==="string"||fieldType==="datetime"){
					component.attr("ms-duplex-string",field);
				}else if(fieldType==="int"||fieldType==="double"){
					component.attr("ms-duplex-number",field);
				}else{
					component.attr("ms-duplex",field);
				}
			}
		}
	},
	getComponentType:function(component){
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
		else if(type === undefined) {
			 type = $(component).parent().attr("type");
		 }
	 	return type;
 	},
	
	addFieldType : function(obj,component){
		component.attr("fieldtype",obj.find("option:selected").attr("type"));
	},
	
	updateIdByBlur : function(e,component){
	
		if(e.type==="focusout"){
			var obj = $(e.target),
				value = obj.val(),
				childrenId = 0,
				isExistsId = function(){
					var flag = false;
					var comps = $("div.demo").find('div[compid="'+obj.val()+'"]');
					if(comps.length){
						if(obj.val()!==component.attr("compid")){
							flag = true;
						}
					}
					return flag;
				};
			
			
				
			if(isExistsId()){
				bootbox.alert("该id已经存在");
				obj.val(component.attr("compid"));
				return false;
			}else if(tagType!=='layout'){
				component.find("input,button,select,textarea,table,label").each(function(){
					var $this = $(this);
					if($this.is("input[type='radio']")){
						$this.attr("id",obj.val()+"_"+childrenId);
						childrenId++;
					}else{
						$this.attr("id",obj.val());
					}
				});
				
			}

			if(tagType==="table_base" || tagType==="table_base_local"){
				component.attr("compid",value);
				var paramJson = this.updateTable.getParameter(component);
				if(!$.isEmptyObject(paramJson)){

					if(paramJson.toolbar){
						paramJson.toolbar = "#"+value+"toolbar";
						paramJson.idTable = value;

						paramJson.columns.forEach(function(item,j){
							item.tableId = value;
						})

					}

					this.updateTable.init(component,paramJson);
				}

			}

			//重新构造事件中的id值
			var event = component.attr('componentevent');
			if(event) {
				event = JSON.parse(decodeURIComponent(event));
				event.id = value;
				component.attr('componentevent', encodeURIComponent(JSON.stringify(event)));
			}
			return true;
			
		}else{
			return false;
		}

	},
	
	updateNameByBlur : function(e,component){
		//失去焦点事件
		if(e.type==="focusout"){
			var obj = $(e.target),
				isExistsName = function(){
					var flag = false;
					var comps = $("div.demo").find('div[compname="'+obj.val()+'"]');
					if(comps.length){
						if(obj.val()!==component.attr("compname")){
							flag = true;
						}
					}
					return flag;
				};
			if(isExistsName()){
				bootbox.alert("该name已经存在");
				obj.val(component.attr("compname"));
				return false;
			}else if(tagType!=='layout'){
				var componentType=this.getComponentType(component);
				component.find("input,button,select,textarea,table,label").each(function(index, item){
					var $this = $(this),
						suffix = '';

					if(index != 0) {
						suffix = suffix + index;
					}
					$this.attr("name",obj.val() + suffix);
					if($this.attr('compname') !== undefined) {
						$this.attr("compname", obj.val() + suffix);
					}
					if((component.attr("field") == undefined || component.attr("field") =="")
						&& tagType != "label"){
						if(obj.val()==""){
							$this.removeAttr("ms-duplex-string");
						}else{
							var field = obj.val();
							if(componentType != undefined){
								if(componentType == "multipleselect" || componentType == "checkbox"){
									field += "_form_compute";
								}
							}
							$this.attr("ms-duplex-string",field + suffix);
						}
					}
				});
				
			}
			return true;
			
		}else{
			return false;
		}
		
	},
	
	updateLabelName : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("label:first").html(obj.val());
			return true;
		}
		else if(e.type === "focusout"){
			layoutResize($(component).parents(".column:first"));
		}
		
		return false;
	},
	
	updateLabelAlign : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			component.find("label:first").attr("align",obj.find("option:selected").val());
			return true;
		}
		return false;
		
	},
	
	updateInputTextValue : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("input[type='text']:first").val(obj.val());
			return true;
		}
		return false;
	},		
	
	updateInputTextPlaceholder : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("input[type='text']:first").attr("placeholder",obj.val());
			return true;
		}
		return false;
	},	
	
	updateInputTextBindField : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("input[type='text']:first,input[type='password']:first"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},	
	
	updateTextAreaValue : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("textarea:first").val(obj.val());
			return true;
		}
		return false;
	},		
	
	updateTextAreaHeight : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
		    component.find("textarea:first").attr("rows",obj.val());
			return true;
		}
		return false;
	},

	updateTextLabelField : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("label:first"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},
	updateTextAreatBindField : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("textarea:first"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},
	chineseRegionBindFieldID : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("input:eq(0)"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},
	chineseRegionBindFieldName : function(e,component) {
		if (e.type === "change") {
			var obj = $(e.target);
			this.operationMsAttr(obj, component.find("input:eq(1)"));
			this.addFieldType(obj, component);
			return true;
		}
		return false;
	},

	updateIconTitle : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			$(component).find("a").attr("title",$(obj).val());
			return true;
		}
		return false;
	},

	updateSelectStaticDefaultValue : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var options = component.find("select:first").find("option[value='"+obj.val()+"']")
			if(options.length){
				component.find("select:first").val(obj.val());
			}
			return true;
		}
		return false;
		
	},
	updateSelectDefaultValue : function(e,component){
		if(e.type==="input"){
			var obj = $(e.target);
			var inputValues = obj.val().split(",");
			var validatedValues = [];
			var options = component.find('option');
			if(options.length){
				options.attr('selected',false);
				options.each(function(){
					if($(this).val()===inputValues[0]){
						$(this).attr('selected',true);
					}
				});
			}
			$.each(inputValues,function(index,item){
				var options = component.find("select:first").find("option[value='"+item+"']")
				if(options.length){
					validatedValues.push(item);
				}
			})
			if(validatedValues.length > 0){
				var componentType = component.attr("selecttype");
				if(componentType == undefined || componentType == "single"){
					component.find("select:first").val(validatedValues[0]);
				}else{
					component.find("select:first").val(validatedValues).trigger("change");
				}
			}
			return true;
		}
		return false;
	},
	/*
		更新静态下拉框
	*/
	updateSelectStaticOptions : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("select:first").empty();
			var options = obj.val().trim().split("\n");
			var selectedOption = $.trim(obj.parents("table").find("#defaultvalue").val());
			var html = [];
			for(var i in options)
			{
				var kv = options[i].split(":");
				var value = $.trim(kv[1]);
				var text = $.trim(kv[0]);
				var selected = selectedOption==value?'selected':'';
				html.push('<option value="'+value+'" '+selected+' >'+text+'</option>');
			}
			component.find("select:first").append(html.join(" "));	
			return true;
		}
		return false;
	}
	,
	/*
	 更新下拉框
	 */
	updateSelectOptions : function(e,component){
		 if(e.type==="focusout"){
			 var obj = $(e.target);
			 component.find("select:first").empty();
			 var options = obj.val().trim().split("\n");
			 var selectedOption = $.trim(obj.parents("table").find("#defaultvalue").val()).split(",");
			 var html = [];
			 for(var i in options)
			 {
				 var kv = options[i].split(":");
				 var value = $.trim(kv[1]);
				 var text = $.trim(kv[0]);
				 var selected = '';
				 $.each(selectedOption,function(index,item){
					 if(item == value){
						 selected = "selected";
						 return false;
					 }
				 })
				 html.push('<option value="'+value+'" '+selected+' >'+text+'</option>');
			 }
			 component.find("select:first").append(html.join(" ")).trigger("change");
			 return true;
		 }
		 return false;
 	},
	
	updateSelectStaticBindField : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("select:first"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},

	
	
	/*
		更新动态下拉框
	*/
	
	updateSelectDynamic : function(e,component){
		if(e.type==="focusout"){
			return true;
		}
		return false;
	},
	
	updateSelectDynamicBindField : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("select:first"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},
	
	/*
		更新单选框
	*/
	
	updateInputRadioDefaultValue : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var options = component.find('input[type="radio"]');
			if(options.length){
				options.attr('checked',false);
				options.each(function(){
					if($(this).val()===obj.val()){
						$(this).attr('checked',true);
					}
				});
			}
			return true;
		}
		return false;
	},
	/*
		更新多选框
	*/

	updateInputCheckboxDefaultValue : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var options = component.find('input[type="checkbox"]');
			if(options.length){
				var values = obj.val().match(/[^,]+/g);
				options.each(function(){
					if(values){
						if($.inArray($(ComponentEditableProperty).val(),values)>-1){
							$(this).attr('checked',true);
						}else{
							$(this).attr('checked',false);
						}
					}
				});
			}
			return true;
		}
		return false;
	},
	
	updateRadio : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);			
			var options = obj.val().trim().split("\n");
			if(options!=''){
				component.empty();//当输入选项有值时才清空按钮值
				
				var html = [];
				var name = obj.parents("table").find("#compname").val();
				var id = obj.parents("table").find("#compid").val();
				var field = obj.parents("table").find("#field").find("option:selected");
				var ms = function(){
					if(field.attr("type")==="string"||field.attr("type")==="datetime"){
						return "ms-duplex-string";
					}else if(field.attr("type")==="int"||field.attr("type")==="double"){
						return "ms-duplex-number";
					}else{
						return "ms-duplex";
					}
				}
				
				if(name.trim()==""){
					bootbox.alert("名称不能为空");
					//return false;
				}
				var defaultvalues =$("#defaultvalue").val().match(/[^,]+/g);
				
				for(var i in options)
				{
					var kv = options[i].split(":");
					html.push('<input name="'+name+'"');
					if(tagType==="checkbox"){
						html.push('id="'+id+'_'+i+'" type="checkbox"');
					}else{
						html.push('id="'+id+'_'+i+'" type="radio"');
					}

					//html.push('ms-attr-value="{{'+field.val()+'}}" ');
					html.push(ms()+'="'+field.val()+'"');
					if($.inArray(kv[1],defaultvalues)>-1){
						html.push('checked="checked"');
					}
					html.push('value="'+kv[1]+'" /><span class="pr10">'+kv[0]+'</span>');
				}
				component.append(html.join(" "));
			}
				

			return true;
		}
		return false;
	},
	
	updateRadioName : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.children("input[type='radio']").each(function(){
				$(this).attr("name",obj.val());
			});
			return true;
		}
		return false;

	},	
	
	updateRadioMsAttr : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			var $this = this;
			component.find("input[type='radio'],input[type='checkbox']").each(function(){
				$this.operationMsAttr(obj,$(this));
			});	
			return true;
		}
		return false;
	},
	
	updateButtonName : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);	
			var child =component.find("button>span"); 			
			component.find("button").text(obj.val()).prepend(child);			
			return true;
		}
		return false;
	},	
	
	/*updateDateTimeComponent : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find(".form_time").attr('value', obj.val()).val(obj.val());
			return true;
		}
		return false;

	},*/
	
	updateInputDateTimeBindField : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("input[type='text']:first"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},
	chineseRegionBindField : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			this.operationMsAttr(obj,component.find("input[type='text']:first"));
			this.addFieldType(obj,component);
			return true;
		}
		return false;
	},
	
	/**
		更新组件验证类型
	*/
	updateValidatorType : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			if(obj.find("option:selected").val()==="custome"){
				obj.next().removeClass("hide")			
			}else{
				obj.next().addClass("hide");
			}
			
			return true;
		}
		return false;
		
	},	
	
	updateModalDialogId : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("div[role='dialog']").attr("id",obj.val());
			var preview = component.parents("div.box-hide").find("div.preview");
			//默认preview内容为“对话框“+compid
			preview.text("对话框"+obj.val());
			
			return true;
		}
		return false;
		
	},

	updateModalDialogTitle : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("div[role='dialog']").attr("bfd_dialog_title",obj.val());
			var preview = component.parents("div.box-hide").find("div.preview");
			preview.text(obj.val());

			return true;
		}
		return false;

	},

	updateModalDialogURL : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("div[role='dialog']").attr("bfd_dialog_url",obj.val());

			return true;
		}
		return false;

	},
	
	
	updateModalDialogBody : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find(".modal-body").html(obj.val());
			return true;
		}
		return false;
		
	},	
	updateModalDialogWidth : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var dialog = component.find(".modal-dialog");
			var params = dialog.data("ly-params")?dialog.data("ly-params"):{};
			params.compwidth = obj.val()+"px";
			if(typeof params.compheight==="undefined"){
				params.compheight = "480px";
			}
			dialog.data("ly-params",params);
			dialog.attr("data-ly-params",JSON.stringify(params));
			return true;
		}
		return false;
		
	},	
	updateModalDialogHeight : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var dialog = component.find(".modal-dialog");
			var params = dialog.data("ly-params")?dialog.data("ly-params"):{};
			params.compheight = obj.val()+"px";
			if(typeof params.compwidth==="undefined"){
				params.compwidth = "960px";
			}
			dialog.data("ly-params",params);
			dialog.attr("data-ly-params",JSON.stringify(params));
			return true;
		}
		return false;
		
	},
	
	updateModalDialogButton : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find(".modal-footer>button:first").html(obj.val());
			return true;
		}
		return false;
	},
	
	updateModalDialogAddButton : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find(".modal-footer>button:last").html(obj.val());	
			return true;	
		}
		return false;
	},	
	isModalDialogRightBtn : function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			var rightBtn = $('<button type="button" class="btn btn-primary">确认</button>');
		    if(obj.val()==="true"){
				rightBtn.appendTo(component.find(".modal-footer"));
				obj.next().removeClass("hide");
			}else{
				component.find(".modal-footer>button").each(function(i,value){
					if(i>0){
						value.remove();
						obj.next().addClass("hide").val("");
					}
				})
			}
				
			return true;	
		}
		return false;
	},		
	updateTreeNodeName : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("ul").attr("treenodename",obj.val());
			return true;	
		}
		return false;
	},	
	updateTreeNodeID : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("ul").attr("treenodeid",obj.val());
			return true;	
		}
		return false;
	},	
	updateTreeNodeTitle : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("ul").attr("treenodetitle",obj.val());
			return true;	
		}
		return false;
	},	
	updateTreeParentNodeID : function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("ul").attr("treeparentnodeid",obj.val());
			return true;	
		}
		return false;
	},
	updateTreeChkStyle: function(e,component){
		if(e.type==="change"){
			var obj = $(e.target);
			component.find("ul").attr("chkStyle",obj.val());
			return true;	
		}
		return false;
	},
	updateTreeStyle: function(e,component){
		if(e.type==="change") {
			var obj = $(e.target);
			component.find("ul").attr("treeStyle", obj.val());
			$(e.target).parents(".table").find("input").each(function (index, item) {
				var attrId = item.id,
					attrValue = "";

				if (attrId === "treenodeid") {
					attrValue = "id";
				} else if (attrId === "treenodename") {
					attrValue = "name";
				} else if (attrId === "treeparentnodeid") {
					attrValue = "pId";
				} else if (attrId === "treenodetitle") {
					attrValue = "name";
				}

				if (attrValue && attrValue != "") {
					if (obj.val() === "areatree") {
						$(item).val(attrValue).trigger("input");
					} else {
						$(item).val("").trigger("input");
					}
				}
			})

			return true;
		}
		return false;
	},
	updateChineseRegionEmptyStatus: function(e,component) {
		if (e.type === "change") {
			var obj = $(e.target),areaCode =component.find("input:eq(0)");
			areaCode.attr("vnotempty", obj.val()).attr("compname", areaCode.attr("name"));
			return true;
		}
		return false;
	},
	updateSeparatorTitle:function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find(".title").html(obj.val());
			return true;	
		}
		return false;
	},
    updateIframeSrc:function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			component.find("iframe").attr("src", obj.val());
			return true;
		}
		return false;
	},
    updateIframeHeight:function(e,component){
        if(e.type==="focusout"){
            var obj = $(e.target);
            component.find("iframe").attr("height", obj.val());
            return true;
        }
        return false;
    },
    updateIframeWidth:function(e,component){
        if(e.type==="focusout"){
            var obj = $(e.target);
            component.find("iframe").attr("width", obj.val());
            return true;
        }
        return false;
    }
	,
	updateTabTextarea:function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var json = undefined,
				nav_tabs = component.find("ul.nav-tabs").empty(),
				nav_content = component.find("div.tab-content").empty();
			//component.find("textarea:first").attr("rows",obj.val());
			try{
				json = JSON.parse(obj.val());
				if(!$.isArray(json)){
					bootbox.alert("请输入JSON格式数组!");
					return false;
				}
				$.each(json,function(index,item){
					nav_tabs.append('<li role="presentation"'+(index == 0 ? 'class="active"':'')+'><a href="#'+item.targetid+'" aria-controls="'+item.targetid+'" role="tab" data-toggle="tab">'+item.title+'</a></li>')
					//nav_content.append('<div role="tabpanel" class="tab-pane '+(index == 0 ? 'active':'')+'" id="'+item.targetid+'">'+item.targetid+'</div>');
				})
			}catch(error){
				bootbox.alert(error.message);
			}
			if(!json){
				return false;
			}

			return true;
		}
		return false;
	},
	updateCollapseTextarea:function(e,component){
		if(e.type==="focusout"){
			var obj = $(e.target);
			var json = undefined,
				container = component.find("div.panel-group"),
				getPanelHTML = function(index,title,targetid){
					var html = [];
					html.push('<div class="panel panel-default">');
					html.push('<div class="panel-heading" role="tab">');
					html.push('<h4 class="panel-title">');
					html.push('<a role="button" data-toggle="collapse" data-parent="#accordion" href="#'+targetid+'" aria-expanded="true" aria-controls="'+targetid+'">');
					if(index==0){
						html.push('<span class="glyphicon glyphicon-minus" aria-hidden="true">'+title+'</span>');
					}else{
						html.push('<span class="glyphicon glyphicon-plus" aria-hidden="true">'+title+'</span>');
					}

					html.push('</a>');

					html.push('</h4>');
					html.push('</div>');
					html.push('</div>');
					html.push('</div>');
					return html.join(" ");
				};
			try{
				json = JSON.parse(obj.val());
				if(!$.isArray(json)){
					bootbox.alert("请输入JSON格式数组!");
					return false;
				}
				container.empty();
				$.each(json,function(index,item){
					var panel = getPanelHTML(index,item.title,item.targetid);
					container.append(panel);
				})
			}catch(error){
				bootbox.alert(error.message);
			}
			if(!json){
				return false;
			}

			return true;
		}
		return false;
	},
    updateButtonGroupTextarea:function(e,component){
        if(e.type==="focusout"){
            var obj = $(e.target);
            var json = undefined,
                button_group = component.empty();
            //component.find("textarea:first").attr("rows",obj.val());
            try{
                json = JSON.parse(obj.val());
                if(!$.isArray(json)){
                    bootbox.alert("请输入JSON格式数组。");
                    return false;
                }
                $.each(json,function(index,item){
                    var btnStr = '<button type="button" class="btn btn-primary"';
                    if(item.clickfunctionname != undefined && item.clickfunctionname.length > 0) {
                        btnStr = btnStr + ' onclick="' + item.clickfunctionname + '()"';
                    }


                    btnStr = btnStr + '>' + item.title + '</button>';
                    button_group.append(btnStr);
                    //nav_content.append('<div role="tabpanel" class="tab-pane '+(index == 0 ? 'active':'')+'" id="'+item.targetid+'">'+item.targetid+'</div>');
                })
            }catch(error){
                bootbox.alert(error.message);
            }
            if(!json){
                return false;
            }

            return true;
        }
        return false;
    },
    updateImgText : function(e,component){
        //失去焦点事件===zl
        if(e.type==="focusout"){
            var obj = $(e.target),
                isExistsName = function(){
                    var flag = false;
                    var comps = $("div.demo").find('div[compname="'+obj.val()+'"]');
                    if(comps.length){
                        if(obj.val()!==component.attr("compname")){
                            flag = true;
                        }
                    }
                    return flag;
                };
            if(isExistsName()){
                bootbox.alert("该name已经存在");
                obj.val(component.attr("compname"));
                return false;
            }else if(tagType!=='layout'){
                var componentType=this.getComponentType(component);
                var item = $('#'+$('#compid').val());
                item.innerHTML("");
                var txt = $("<p></p>").text("替换了： " + (new Date()).toLocaleTimeString());
                item.append(txt);
                component.find("div").each(function(){
                    var $this = $(this);

                });

            }
            return true;

        }else{
            return false;
        }

    },
	//上传图片组件
	updateImg : function(e,component){
        //失去焦点事件===zl
        if(e.type==="focusout"){
			var $this = $(e.target),
				$img = $(component).children();
			if($this.attr("id")=="imgsrc"){
				$img.attr("src",$this.val()?$this.val():"img/nopicture.jpg")
			} else if($this.attr("id")=="imgheight"){
				if(!$this.val()) {
					$img.removeAttr("height");
				}
				else if($this.val().indexOf('%') > -1) {
					$img.attr("height",$this.val());
				}
				else {
					$img.attr("height", $this.val() + "px");
				}
			} else if($this.attr("id")=="imgwidth"){
				if(!$this.val()) {
					$img.removeAttr("width");
				}
				else if($this.val().indexOf('%') > -1) {
					$img.attr("width",$this.val());
				}
				else {
					$img.attr("width", $this.val() + "px");
				}
			}else if($this.attr("id")=="imgalt"){
				$img.attr("alt",$this.val());
			}
            return true;

        }else{
            return false;
        }

    },

	updateTable : {
		PARAM : {
			ID : "compid",
			HEIGHT : "tableheight",
			PARAMETER:"parameter",
			HIDE:"hidebox",
			MODAL : "tablemodel",
			HALIGN : "tableheaderalign",
			CALIGN : "tablecolumnalign",
			URI : "formuri",
			PAGESIZE : "pagesize",
			TOOLBAR : "tabletoolbar",
			CTOOLBAR : "options",
			ADDBTN : "isAddBtn",
			PAGINATIONHTML:"paginationHTML",
			GLOBAL_FORMAT_FUNCTION: "data-global-format-function",
			DATAFIELD:"dataField",
			TOTALROWSFIELD:"totalRowsField"
		},
		setPaginationHTML: function(e,component){
			if(e.type==="focusout") {
				var $component = component,
					$this = $(e.target),
					html =encodeURIComponent(html2Escape($this.val())),
					paramJson = this.getParameter($component);

				this.setParameter($component, this.PARAM.PAGINATIONHTML, html);
				if(!this.isEmptyObject(paramJson)){
					paramJson.paginationHTML =html;

					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
				}
			}
		},
		setHeight: function(e,component){
			if(e.type==="focusout") {
				var $component = component,
					$this = $(e.target),
					height = $this.val(),
					paramJson = this.getParameter($component);


				this.setParameter($component, this.PARAM.HEIGHT, height);
				if (!this.isEmptyObject(paramJson)) {
					paramJson.height = height || 500;
					this.setParameter($component, this.PARAM.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component, paramJson);
				}
			}
		},
		setGlobalFormatFunction: function(e,component){
			if(e.type==="focusout") {
				var $component = component,
					$this = $(e.target),
					func = $this.val(),
					paramJson = this.getParameter($component);

				this.setParameter($component, this.PARAM.GLOBAL_FORMAT_FUNCTION, func);
				if (!this.isEmptyObject(paramJson)) {
					paramJson.globalFormat = func || "";
					this.setParameter($component, this.PARAM.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component, paramJson);
				}
			}
		},
		setPageSize : function(e,$component){
			if(e.type==="change"){
				var $this = $(e.target),
					pageSize = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setParameter($component,this.PARAM.PAGESIZE,pageSize);
				if(!this.isEmptyObject(paramJson)){
					paramJson.pageSize = pageSize || 10;
					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
				}

			}
		},
		setAddBtn : function(e,$component){
			if(e.type==="change"){
				var
					$this = $(e.target),
					isAddBtn = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setParameter($component,this.PARAM.ADDBTN,isAddBtn);
				if(!this.isEmptyObject(paramJson)){

						paramJson.columns.forEach(function(column,index){
							if(column.field === "operator"){
								column.isAddBtn = isAddBtn&&isAddBtn=="true"?true:false;
							}
						});

					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
				}


			}
		},
		setModal : function(e,$component){
			if(e.type==="change"){
				var
					$this = $(e.target),
					model = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setParameter($component,this.PARAM.MODAL,model);
				if(!this.isEmptyObject(paramJson)){
					if(paramJson.columns){
						var columns = paramJson.columns,
							_index = 0,
							isRadioOrCheckbox = false;

							columns.forEach(function(column,index){
								if(column.field === "state_form_disabled"){
									isRadioOrCheckbox = true;
									_index = index;
								}
							});


						if(model === "radiotable"){
							var radio = {field: 'state_form_disabled', radio: true};
							if(isRadioOrCheckbox){
								columns.splice(_index,1,radio);
							}else{
								columns.splice(_index,0,radio);
							}
						}else if(model === "checkboxtable"){
							var checkbox = {field: 'state_form_disabled', checkbox: true};
							if(isRadioOrCheckbox){
								columns.splice(_index,1,checkbox);
							}else{
								columns.splice(_index,0,checkbox);
							}
						}else{
							if(isRadioOrCheckbox){
								columns.splice(_index,1);
							}
						}
					}
					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
			}
		}
		},
		setHideBox : function(e,$component){
			if(e.type==="change"){
				var
					$this = $(e.target),
					hideBox = $this.find("option:selected").val(),
					model = $component.attr(this.PARAM.MODAL),
					paramJson = this.getParameter($component);

				this.setParameter($component,this.PARAM.HIDE,hideBox);

				if(!this.isEmptyObject(paramJson)){

					paramJson.clickToSelect = model != "none" && hideBox === "true" ? true : false;
					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
				}
			}
		},
		setHAlign : function(e,$component){
			if(e.type==="change"){
				var
					$this = $(e.target),
					hAlign = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setParameter($component,this.PARAM.HALIGN,hAlign);

				if(!this.isEmptyObject(paramJson)){



						paramJson.columns.forEach(function(column,index){
								column.halign = hAlign;
							});



					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
				}
			}
		},
		setCAlign : function(e,$component){
			if(e.type==="change"){
				var
					$this = $(e.target),
					cAlign = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setParameter($component,this.PARAM.CALIGN,cAlign);

				if(!this.isEmptyObject(paramJson)){

					paramJson.columns.forEach(function(column,index){
						column.align = cAlign;
					});


					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
				}
			}
		},
		setFormUri : function(e,$component){
			if(e.type==="focusout"){
				var
					$this = $(e.target),
					formUri = $this.val(),
					paramJson = this.getParameter($component);

				this.setParameter($component,this.PARAM.URI,formUri);

				if(!this.isEmptyObject(paramJson)){

					this.setParameter($component,this.PARAM.PARAMETER,encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component,paramJson);
				}
			}
		},
		setDataField: function(e,component){
			if(e.type==="change") {
				var $component = component,
					$this = $(e.target),
					dataField = $this.val(),
					paramJson = this.getParameter($component);

				this.setParameter($component, this.PARAM.DATAFIELD, dataField);
				if (!this.isEmptyObject(paramJson)) {
					paramJson.dataField = dataField;
					if (!paramJson.dataField) {
						paramJson.dataField = "rows";
					}
					this.setParameter($component, this.PARAM.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component, paramJson);
				}
			}
		},
		setTotalRowsField: function(e,component){
			if(e.type==="change") {
				var $component = component,
					$this = $(e.target),
					totalRowsField = $this.val(),
					paramJson = this.getParameter($component);

				this.setParameter($component, this.PARAM.TOTALROWSFIELD, totalRowsField);
				if (!this.isEmptyObject(paramJson)) {
					paramJson.totalRowsField = totalRowsField;
					if (!paramJson.totalRowsField) {
						paramJson.totalRowsField = "total";
					}
					this.setParameter($component, this.PARAM.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
					this.init($component, paramJson);
				}
			}
		},

		isEmptyObject : function(obj){
			return $.isEmptyObject(obj);
		},
		getToolBar: function ($component) {
			var
				tableid = $component.attr(this.PARAM.ID),
				formuri = $component.attr(this.PARAM.URI),
				tabletoolbar = $component.attr(this.PARAM.TOOLBAR),
				customToolBar = $component.attr(this.PARAM.CTOOLBAR);

			if (customToolBar) {
				customToolBar = JSON.parse(decodeURIComponent(customToolBar));
			} else {
				customToolBar = new Object();
			}

			if (tabletoolbar) {
				tabletoolbar = JSON.parse(decodeURIComponent(tabletoolbar));
			}
			var toolbars = new Array();

			//if (tabletoolbar.add == "checked") {
			//	toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'新建\', \'' + formuri + '\')" id="' + tableid + 'AddBtn"> 新建</button>');
			//}
			//if (tabletoolbar.modify == "checked") {
			//	toolbars.push('<button type="button"  class="btn btn-primary" onclick="showModalDialog(\'' + tableid + 'modal' + '\',\'修改\', \'' + formuri + '\')" id="' + tableid + 'ModifyBtn"> 修改</button>');
			//}
			//if (tabletoolbar.del == "checked") {
			//	toolbars.push('<button type="button" class="btn btn-primary" onclick="deleteServerTableRows(\'' + tableid + '\')" id="' + tableid + 'DeleteBtn"> 删除</button>');
			//}
			//if (tabletoolbar.refresh == "checked") {
			//	toolbars.push('<button type="button" class="btn btn-primary" onclick="refreshTable(\'' + tableid + '\')" id="' + tableid + 'RefreshBtn"> 刷新</button>');
			//}


			if (!$.isEmptyObject(customToolBar)) {
				$.each(customToolBar, function (indec, item) {
					toolbars.push('<button type="button" class="btn btn-primary" onclick="' + item["clickfunction"].replace(/\"/g, "'") + '" id="btn' + getCurrentTime() + '"> ');
					toolbars.push(' <span class="' + item["icon"] + '" aria-hidden="true"></span>' + item["title"] + '</button>');
				})
			}
			if (toolbars.length > 0) {

				toolbars.push('<div class="modal fade" tabindex="-1" role="dialog" id="' + tableid + 'modal" aria-labelledby="myLargeModalLabel">');
				toolbars.push('<div class="modal-dialog modal-lg">');
				toolbars.push('<div class="modal-content">');
				toolbars.push('<div class="modal-header">');
				toolbars.push('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>');
				toolbars.push('<h4 class="modal-title" id="gridSystemModalLabel"></h4>');
				toolbars.push('</div>');
				toolbars.push('<div class="modal-body">');
				toolbars.push('</div>');
				toolbars.push('<div class="modal-footer">');
				toolbars.push('</div>');
				toolbars.push('</div>');
				toolbars.push('</div>');
				toolbars.push('</div>');


			}

			if (!$.isEmptyObject(customToolBar) || toolbars.length > 0) {
				toolbars.unshift('<div id="' + tableid + 'toolbar" class="btn-group">');
				toolbars.push('</div>');
			}


			return toolbars;
		},
		getParameter : function($component){
			var parameter = $component.attr("parameter") || '{}';
			return JSON.parse(decodeURIComponent(parameter));
		},
		setParameter : function($component,param,value) {
			if (value) {
				$component.attr(param, value);
			} else {
				$component.removeAttr(param);
			}
		},
		init : function($component,paramJson){
			this.clear($component);
			if(tagType !== "table_base_local"){
				this.initToolBar($component);
			}
			this.initTable($component,paramJson);
		},
		clear : function($component){
			$component.empty();
		},
		initToolBar : function($component){
			var toolbar = this.getToolBar($component);
			if(!this.isEmptyObject(toolbar)){
				$component.append(toolbar.join(""));
			}
			$component.attr("toobarhtml", encodeURI(toolbar.join(" ")));
		},
		initTable : function($component,param){

			var id = $component.attr("compid"),
				$table = $('<table id="'+id+'"></table>');
			$component.append($table);

			if(param["clickToSelect"]){
				$table.bootstrapTable(param).on('load-success.bs.table',function(){
					$(this).find(".bs-checkbox").addClass("hide");
				})
			}else{
				$table.bootstrapTable(param);
			}
		}
	},
	updateProductList: {
		params: {
			PARAMETER: "data-params",
			/**
			 * 产品图片url
			 */
			PRODUCT_IMG_URL: "product_img_url",
			/**
			 * 产品详情url
			 */
			FORMAT_DETAIL_URL_METHOD: "format_detail_url_method",

			/**
			 * 用户自定义产品列表方法
			 */
			CUSTOM_PRODUCT_LIST_METHOD:"custom_product_list_method",
			/**
			 * 产品名称
			 */
			PRODUCT_TITLE: "product_title",
			/**
			 * 产品价格
			 */
			PRODUCT_PRICE: "product_price",
			/**
			 * 产品提示信息
			 */
			PRODUCT_ALT: "product_alt",

			PRODUCT_SUPPLIER:"product_supplier",
			/**
			 * 产品ID主键
			 */
			PRODUCT_ID: "product_id",
			/**
			 * 分页大小
			 */
			PAGESIZE: "pageSize"
		},
		setProductId: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					id = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PRODUCT_ID, id);

				paramJson.columns = paramJson.columns || {};
				paramJson.columns.PRODUCT_ID = id;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));

				this.setExtendColumns($component,id);
			}
		},
		setProductTitle: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					title = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PRODUCT_TITLE, title);

				paramJson.columns = paramJson.columns || {};
				paramJson.columns.PRODUCT_TITLE = title;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));

				this.setExtendColumns($component,title);
			}
		},
		setProductPrice: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					price = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PRODUCT_PRICE, price);

				paramJson.columns = paramJson.columns || {};
				paramJson.columns.PRODUCT_PRICE = price;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));

				this.setExtendColumns($component,price);
			}
		},
		/**
		 * 设置产品提示信息
		 * @param $component
		 */
		setProductAlt: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					alt = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PRODUCT_ALT, alt);

				paramJson.columns = paramJson.columns || {};
				paramJson.columns.PRODUCT_ALT = alt;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));

				this.setExtendColumns($component,alt);
			}
		},
		setProductImgUrl: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					imgUrl = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PRODUCT_IMG_URL, imgUrl);

				paramJson.columns = paramJson.columns || {};
				paramJson.columns.PRODUCT_IMG_URL = imgUrl;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));

				this.setExtendColumns($component,imgUrl);
			}
		},
		setProductSupplier: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					supplier = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PRODUCT_SUPPLIER, supplier);

				paramJson.columns = paramJson.columns || {};
				paramJson.columns.PRODUCT_SUPPLIER = supplier;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));

				this.setExtendColumns($component,supplier);
			}
		},
		setProductDetailUrlMethod: function (e,$component) {
			if (e.type === "focusout") {
				var $this = $(e.target),
					detailUrl = $this.val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.FORMAT_DETAIL_URL_METHOD, detailUrl);

				paramJson.dataView = paramJson.dataView || {};
				paramJson.dataView.formatDetailUrlMethod = detailUrl;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
			}
		},
		setCustomProductListMethod: function (e,$component) {
			if (e.type === "focusout") {
				var $this = $(e.target),
					method = $this.val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.CUSTOM_PRODUCT_LIST_METHOD, method);

				paramJson.dataView = paramJson.dataView || {};
				paramJson.dataView.customProductListMethod = method;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
			}
		},
		/**
		 * 设置分页
		 * @param $component
		 */
		setPageSize: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					pageSize = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PAGESIZE, pageSize);

				paramJson.pagination = paramJson.pagination || {};
				paramJson.pagination.pageSize = pageSize || 10;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
			}
		},
		/**
		 * 设置组件属性
		 * @param $component
		 * @param param
		 * @param value
		 */
		setAttribute: function ($component, param, value) {
			$component.attr(param, value);
		},
		getParameter: function ($component) {
			var parameter = $component.attr(this.params.PARAMETER) || '{}';
			return JSON.parse(decodeURIComponent(parameter));
		},
		setExtendColumns: function ($component,columnName) {
			var dataColumns = JSON.parse(decodeURIComponent($component.attr("data-columns") || '{}'));
			if ($.isEmptyObject(dataColumns)) {
				dataColumns.columns = [];
			}

			if ($.inArray(columnName, dataColumns.columns) === -1) {
				dataColumns.columns.push(columnName);
			}

			$component.attr("data-columns", encodeURIComponent(JSON.stringify(dataColumns)));
			$component.trigger("click");
		}
	},

	/**
	 * 设置循环组件参数
	 */
	updateRepeatList: {
		params: {
			PARAMETER: "data-params",
			/**
			 * 分页大小
			 */
			PAGESIZE: "pageSize",
			/**
			 * 每行大小
			 */
			ROWSIZE: "rowSize",
			/**
			 * 是否分页
			 */
			ISPAGING: "isPaging",

			/**
			 * 行格式化函数
			 */
			FORMATROW:"formatRow"
		},

		/**
		 * 设置分页
		 * @param $component
		 */
		setPageSize: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					pageSize = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.PAGESIZE, pageSize);

				paramJson.pagination = paramJson.pagination || {};
				paramJson.pagination.pageSize = pageSize || 10;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
			}
		},


		/**
		 * 设置每行显示数量
		 * @param $component
		 */
		setRowSize: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					rowSize = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.ROWSIZE, rowSize);

				paramJson.pagination = paramJson.pagination || {};
				paramJson.pagination.rowSize = rowSize || 1;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
			}
		},

		/**
		 * 是否分页
		 * @param e
		 * @param $component
		 */
		setIsPaging: function (e,$component) {
			if (e.type === "change") {
				var $this = $(e.target),
					isPaging = $this.find("option:selected").val(),
					paramJson = this.getParameter($component);

				this.setAttribute($component, this.params.ISPAGING, isPaging);

				paramJson.pagination = paramJson.pagination || {};
				paramJson.pagination.isPaging = isPaging === "false" ? false : true;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
			}
		},

		/**
		 * 行格式化函数
		 * @param e
		 * @param $component
		 */
		setFormatRow: function (e,$component) {
			if (e.type === "focusout") {
				var $this = $(e.target),
					formatRow = $this.val(),
					paramJson = this.getParameter($component);

				if (formatRow) {
					this.setAttribute($component, this.params.FORMATROW, formatRow);
				} else {
					this.removeAttribute($component, this.params.FORMATROW, formatRow);
				}

				paramJson.formatRow = formatRow;
				this.setAttribute($component, this.params.PARAMETER, encodeURIComponent(JSON.stringify(paramJson)));
			}
		},
		/**
		 * 设置组件属性
		 * @param $component
		 * @param param
		 * @param value
		 */
		setAttribute: function ($component, param, value) {
			$component.attr(param, value);
		},
		/**
		 * 移除属性
		 * @param $component
		 * @param param
		 * @param value
		 */
		removeAttribute: function ($component, param, value) {
			$component.removeAttr(param, value);
		},
		getParameter: function ($component) {
			var parameter = $component.attr(this.params.PARAMETER) || '{}';
			return JSON.parse(decodeURIComponent(parameter));
		}
	}
}
	


CustomEvent.prototype.init.prototype = CustomEvent.prototype;
 

/*
	扩展CustomEvent类，自定义添加方法
	更新Button组件
*/
CustomEvent.prototype.updateTablePageSize = function(obj,component){
	
	alert(obj);
	alert(component);
	return false;
}

CustomEvent.prototype.updateTableHeight = function(obj,component){
	
	alert(obj);
	return false;
}

CustomEvent.prototype.updateButtonComponent = function(e,component){
	if(e.type==="change"){
		var obj = $(e.target);
		switch(obj.val()){
			case "submit":
				component.find("button:first").attr("ms-click","submit");
				break;
			case "batchSubmit":
				component.find("button:first").attr("ms-click","batchSubmit");
				break;
			/*case "query":
				component.find("button:first").attr("ms-click","query");
				break;
		    */
			case "reset":
				component.find("button:first").attr("ms-click","reset");
				break;	
			default:
				component.find("button:first").removeAttr("ms-click");
		}
		
		if($("#defaultvalue").val() == ""){
			$("#defaultvalue").val(obj.find("option:selected").text());
			var child =component.find("button:first>span");
			component.find("button:first").html(obj.find("option:selected").text()).prepend(child);
			component.attr("defaultvalue",obj.find("option:selected").text());
		}
		return true;
	}
	return false;
	
}
CustomEvent.prototype.updateInputTextValidator = function(e,component){

	
	if(e.type==="change"){
		var obj = $(e.target);
		var setAttribute = function(value){
			component.attr("vcontent",encodeURIComponent(value));
			obj.next().addClass("hide");
		}
		
		var defaultValue = function(){
			var html = [];
				html.push("notEmpty: {\n");
				html.push("    	message: '该字段必填和不能为空'\n");
				html.push("},\n");
				html.push("regexp: {\n");
				html.push("		regexp: /^[a-zA-Z0-9_\.]+$/,\n");
				html.push("		message: '该字段只能是字母、整数和下划线'\n");
				html.push("},");
			return html.join("");
		}
		
		switch(obj.find("option:selected").val()){
			case "id":
				setAttribute("id:{country:'CN'}");
				break;
			case "email":
				setAttribute("emailAddress:{}");
				break;
			case "phone":
				setAttribute("phone:{country:'CN'}");
				break;
			case "ipv4":
				setAttribute("ip:{}");
				break;			
			case "integer":
				setAttribute("integer:{}");
				break;			
			case "numeric":
				setAttribute("numeric:{}");
				break;
			case "custom":
				obj.next().removeClass("hide").html(defaultValue());
				component.attr("vcontent",encodeURIComponent(defaultValue()));
				break;
			default:
				component.removeAttr("vtype").removeAttr("vcontent");
				obj.next().addClass("hide");
				return false;
		}
		
		return true;
	}
	return false;
	
}
CustomEvent.prototype.updateInputDateTimeValidator = function(e,component){

	
	if(e.type==="change"){
		var obj = $(e.target);
		var setAttribute = function(value){
			component.attr("vcontent",encodeURIComponent(value));
			obj.next().addClass("hide");
			setDateTimeFormat(value);
		}
		
		var setDateTimeFormat = function(value){
			if(value.match("YYYY-MM-DD h:m:s")){
				component.attr("datetimeformat",encodeURIComponent("YYYY-MM-DD HH:mm:ss"));
			}else if(value.match("YYYY-MM-DD")){
				component.attr("datetimeformat",encodeURIComponent("YYYY-MM-DD"));
			}else{
				component.attr("datetimeformat",encodeURIComponent("YYYY-MM-DD HH:mm:ss"));
			}
		}
		
		var defaultValue = function(){
			var html = [];
				html.push("date: {\n");
				html.push("		format: 'YYYY-MM-DD h:m:s'\n");
				html.push("}");
			return html.join("");
		}
		
		switch(obj.find("option:selected").val()){
						
			case "date":
				setAttribute("date:{format: 'YYYY-MM-DD'}");
				break;			
			case "datetime":
				setAttribute("date:{format: 'YYYY-MM-DD h:m:s'}");
				break;
			case "custom":
				obj.next().removeClass("hide").html(defaultValue());
				component.attr("vcontent",encodeURIComponent(defaultValue()));
				setDateTimeFormat(defaultValue());
				break;
			default:
				component.removeAttr("vtype").removeAttr("vcontent");
				obj.next().addClass("hide");
				setDateTimeFormat("");
				return false;
		}
		component.find(".form_time").data("DateTimePicker").format(obj.val());
		
		return true;
	}
	return false;
	
}

CustomEvent.prototype.updateInputDatetimeFormat = function(e,component){

	
	if(e.type==="focusout"){
		var obj = $(e.target);
		component.find(".form_time").data("DateTimePicker").format(obj.val());
		
		return true;
	}
	return false;
	
}
CustomEvent.prototype.updateSelectTextArea = function(e,component){

	
	if(e.type==="focusout"){
		var obj = $(e.target);
		var value = obj.val();
		if(value.match("YYYY-MM-DD h:m:s")){
			component.attr("datetimeformat",encodeURIComponent("YYYY-MM-DD HH:mm:ss"));
		}else if(value.match("YYYY-MM-DD")){
			component.attr("datetimeformat",encodeURIComponent("YYYY-MM-DD"));
		}else{
			component.attr("datetimeformat",encodeURIComponent("YYYY-MM-DD HH:mm:ss"));
		}
		
		return true;
	}
	return false;
	
}
CustomEvent.prototype.updateTextBoxType = function(e,component){
	if(e.type==="change"){
		var obj = $(e.target);
		component.attr("textboxtype",obj.val());
		component.find(":input").attr("type",obj.val());
		return true;
	}
	return false;	
}

 CustomEvent.prototype.updateBtnGroupSpace = function(e,component){
     if(e.type==="change"){
         var obj = $(e.target);
         component.attr("isspace", obj.val());
         if(obj.val() == "true") {
             component.removeClass("btn-group");
             $.each(component.find("button"), function(index, item) {
                 var outerHTML = $(item).prop("outerHTML");
                 if(!outerHTML.endsWith(" ")) {
                    $(item).prop("outerHTML", outerHTML + " ");
                 }
             });
         }
         else {
             if(component.attr("class") == undefined || component.attr("class").indexOf("btn-group") == -1) {
                 component.addClass("btn-group");
             }
         }
         return true;
     }
     return false;
 }

 CustomEvent.prototype.updateHeaderTitle = function(e,component){
	 if(e.type==="focusout"){
		 var obj = $(e.target);
		 component.attr("data-title",obj.val());
		 component.find(".header-title").text(obj.val());
		 return true;
	 }
	 return false;
 }
	
/*
	执行自定义事件
*/
function evalCustomEvent(e){
	var obj = $(e.target);
	if(typeof(obj.attr("customevent"))!="undefined"){
		var event = jQuery.CustomEvent();
		var fun = "event."+obj.attr("customevent")+"(e,tagComponent)";
		var flag = false;
		try{
				flag = eval(fun);
			}catch(error){
				bootbox.alert(error.message);
			}	
		return flag;
	}
	
	return true;
}

 CustomEvent.prototype.ckSwitchSize = function(e,component){
	 changeSwitchSize(e,component);
 }
 CustomEvent.prototype.ckSwitchColor = function(e,component){
	 changeSwitchColor(e,component);
 }
 CustomEvent.prototype.switchDefaultValue = function(e,component) {
	 changeSwitchDefaultVal(e, component);
 }
 CustomEvent.prototype.labelFontWeightSet = function(e,component){
	 labelFontWeight(e,component);
 }
 CustomEvent.prototype.labelFontSizeSet = function(e,component){
	 labelFontSize(e,component);
 }
 CustomEvent.prototype.layoutStyleSet = function(e,component){
	 setLayoutStyle(e,component);
 }
 CustomEvent.prototype.picklineHeightSet = function(e,component){
	 if(e.type==="change"){
		 var compid = $(component).attr("compid");
		 var value = $(e.target).val();
		 $("#"+compid).css("border-width","0 0 "+ value +" 0");
	 }
	 $(component).attr("picklineheight",value);
 }
 CustomEvent.prototype.updateTabCloseOption = function(e,component){
	 if(e.type==="change"){
		 $(component).attr('data-close', $(e.target).val());
		 //该函数定义到js/component/tabs.js中
		 updateTabCloseOption(component);
	 }
 }
 CustomEvent.prototype.updateTabDirection = function(e,component){
	 if(e.type==="change"){
		 $(component).attr('data-tabdirection', $(e.target).val());
		 //该函数定义到js/component/tabs.js中
		 updateTabDirection(component);
	 }
 }
 CustomEvent.prototype.updateBtnColor = function (e, component) {
	 if(e.type==="change"){
		 var $comp = $(component);
		 $comp.attr('data-color', $(e.target).val());
		 $comp.btnGroup('sizeColor', component);
	 }
 }
 CustomEvent.prototype.updateBtnSize = function (e, component) {
	 if(e.type==="change"){
		 var $comp = $(component);
		 $comp.attr('data-size', $(e.target).val());
		 $comp.btnGroup('sizeColor', component);		 
		 layoutResize($comp.parents(".column:first"));
	 }
 }
  CustomEvent.prototype.getVerticalListClor = function (e, component) {
	 verticalListProperty.getColor(e, component);
 }

 CustomEvent.prototype.getStaticValue = function (e, component) {
	 verticalListProperty.staticValue(e, component);
 }
 CustomEvent.prototype.updateVerticalListHeight = function (e, component) {
	 verticalListProperty.verticalListHeight(e, component);
 }

 CustomEvent.prototype.verticalListLayoutProportion = function (e, component) {
	 verticalListProperty.layoutProportion(e, component);
 }

 CustomEvent.prototype.updateDashboardCard = function (e, component) {
	 if(e.type==="input") {
		 var id = $(e.target).attr('id'),
			 val = $("#" + id).val();
		 if (id === 'dc-background-color') {
			 $(component).find('.dashboard-card').css('background-color', val);
		 }
		 else if (id === 'dc-status') {
			 $(component).find('.dashboard-card .details .number').empty().append(val)
		 }
		 else if (id === 'dc-desc') {
			 $(component).find('.dashboard-card .details .desc').empty().append(val)
		 }
		 return true;
	 }
	 return false;
 }
