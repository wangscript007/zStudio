

function Label(obj){
	this.obj = obj;
	this.getHtml = function(){
		return '<label '+tr_td_label_style+'>'+initPropertyVal(this.obj)+'</label>'; 
	}
}

function InputText(obj){
	this.obj = obj;
	this.getHtml = function(){
		var html = [];
			html.push('<input class="form-textbox form-textbox-text col-md-12" ');
			html.push(isPlaceholder(obj));
			html.push(isEncode(obj));
			html.push(isValidation(obj));
			html.push(isCustomEvent(obj));
			html.push('id="'+obj.attribute+'"');
			html.push(' type="text" value="'+initPropertyVal(obj)+'" />');
		return html.join(" ");
	}
}

function Select(obj){
	this.obj = obj;
	this.getHtml = function(){
		var html = [];
			html.push('<select class="form-textbox form-combo col-md-12" ');
			html.push('id="'+obj.attribute+'" ');
			html.push(isValidation(obj));
			html.push(isCustomEvent(obj));
			html.push(isEncode(obj));
			html.push(' value="'+initPropertyVal(obj)+'">');
			html.push(getOptions(obj));
			html.push('</select>');
		return html.join(""); 
	}
}

function SelectTextArea(obj){
	this.obj = obj;
	this.getHtml = function(){
		
		var hide = tagComponent.attr("vtype")==="custom"?"":"hide";		
		var vcontent = typeof(tagComponent.attr("vtype"))==="undefined"?"":obj.isencode==="true"?decodeURIComponent(tagComponent.attr("vcontent")):tagComponent.attr("vcontent");
		var html =[];
		html.push(new Select(obj).getHtml());
		html.push('<textarea class="col-md-12 '+hide+'" rows="10" '+isEncode(obj)+' id="vcontent" customevent="updateSelectTextArea"');
		html.push('placeholder=".">'+vcontent+'</textarea>'); 
		return html.join(" "); 
	}
}
function SelectInput(obj){
	this.obj = obj;
	this.getHtml = function(){
		
		var hide = tagComponent.attr("isAddRightBtn")==="true"?"":"hide";
		var defaultValue = function(){
			var html = [];
			return html.join("");
		}
		
		var value = tagComponent.attr("isAddRightBtn")==="true"?tagComponent.attr("rightBtn"):defaultValue();
		var html =[];
		html.push(new Select(obj).getHtml());
		html.push('<input class="form-textbox form-combo col-md-12 '+hide+'" id="rightBtn" customevent="updateModalDialogAddButton"');
		html.push('placeholder="." value="'+value+'"/>'); 
		return html.join(" "); 
	}
	
}
function TextArea(obj){
	this.obj = obj;
	this.getHtml = function(){
		var html = [];
			html.push('<textarea class="form-textbox col-md-12" rows = "6"');
			html.push(isValidation(obj));
			html.push(isEncode(obj));
			html.push(isCustomEvent(obj));
			html.push('id="'+obj.attribute+'"');
			html.push(isPlaceholder(obj));
			html.push('value="'+initPropertyVal(obj)+'">' + initPropertyVal(obj) + '</textarea>');

		return html.join(" "); 
	}
}

function isPlaceholder(obj){
	if(obj.type == "preDefine:textarea"){
		return typeof(obj.placeholder)==='undefined'?' ':' title="'+obj.placeholder+'" ';
	}
	return typeof(obj.placeholder)==='undefined'?' ':' placeholder="'+obj.placeholder+'" ';
}

function isEncode(obj){
	return obj.isencode==='true'?'isencode="true"':'isencode="false"';
}

function isValidation(obj){
	
	return typeof(obj.validation)==="undefined"?" ":" validation='"+JSON.stringify(obj.validation)+"' ";
	
}

//判断该事件是否是自定义事件
function isCustomEvent(obj){
	return typeof(obj.customevent)==='undefined'?' ':' customevent="'+obj.customevent+'" ';
}

function getPropertyName(obj){
	return obj.showname;
}
//初始化组件属性值
function initPropertyVal(obj){

		var initValue = tagComponent.attr(obj.attribute);
		initValue = (initValue ==undefined ? (typeof(obj.defaultvalue)==="undefined"?"":obj.defaultvalue):initValue);
	
	 	/* if(obj.isencode==="true"){
		  initValue = decodeURIComponent(initValue);
		} */
	//对值进行html转义
	return decodeURIComponent(initValue);
}

function isSelected(attr,value){
	return value===tagComponent.attr(attr)?'selected':'';
}

function getOptions(obj){
	var arr = obj.values.split(":");
	var html = '';
	switch(arr[0]){
		case "static":
				var options = arr[1].split(";");
				for(var i in options){
					var kv = options[i].split(",");
					html += '<option value="'+kv[1]+'" '+(kv[1]===tagComponent.attr(obj.attribute)?'selected':'')+'>'+kv[0]+'</option>';
				}
			break;
		case "dynamic":
			html +=bindField(tagComponent,obj.attribute);
			break;
	}
	return html;
}

function bindField(component,attribute) {
	var html = [];
	html.push('<option value="">&lt;--请选择--&gt;</option>');
	var field = component.attr(attribute);
	var vmDataFieldsManage = new VMDataFieldsManage(component);
	if (vmDataFieldsManage.isSetVMURI()) {
		var dataColumns = vmDataFieldsManage.getVMAllFlagFields(attribute);
		for (var i in dataColumns) {
			var selected = '', columnValue = '';

			columnValue = dataColumns[i].columnName;
			if (dataColumns[i].parentUri) {
				columnValue = dataColumns[i].parentUri + "." + columnValue;
			}

			if (typeof(field) != "undefined") {
				//加到属性中做了encodeURIComponent处理，回显时需要decodeURIComponent
				field = decodeURIComponent(field);
				selected = columnValue === field ? "selected" : "";
			}
			html.push('<option type="' + dataColumns[i].columnType + '" value="' + columnValue + '" ' + selected + '>');
			html.push(dataColumns[i].columnName + (dataColumns[i].flag ? " (已绑定)" : "") + '</option>');
		}
	}
	return html.join(" ");
}

function bindField2(component, selectField) {
	var html = [];
	html.push('<option value="">&lt;--请选择--&gt;</option>');

	var dataFieldsManage = new ComponentDataFieldsManage(component,
		$(component).attr("dataField"));
	if (dataFieldsManage.isSetDataSourceInfo()) {
		var dataColumns = dataFieldsManage.getDataColumns();
		for (var i in dataColumns) {
			var selected = '';
			if (typeof(selectField) != "undefined") {
				selected = dataColumns[i].columnName === selectField ? "selected" : "";
			}
			html.push('<option type="' + dataColumns[i].columnType + '" value="' + dataColumns[i].columnName + '" ' + selected + '>');
			html.push(dataColumns[i].columnName + '</option>');
		}
	}
	return html.join(" ");
}
		