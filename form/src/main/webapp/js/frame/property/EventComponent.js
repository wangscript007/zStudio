function EventProperty(componentObject, eventPanelObject) {
	this.componentObject = componentObject; 
	this.eventPanelObject = eventPanelObject;
	this.uri;
	
	//加载表格对象到面板
	this.loadPanel = function() {
		var table = '<table class="table table-bordered" data-toggle="table" id="table-event-table">' + 
		'	<thead>' +
		'	<tr>' +
		'		<th data-field="title" data-width=80>事件</th>' +
		'		<th data-field="event">函数体</th>' +
		'	</tr>' +
		'	</thead>' +
		'</table>'
		// 清空数据
		this.eventPanelObject.html();
		this.eventPanelObject.html(table);
		var table = $('#table-event-table').bootstrapTable({
			classes:'table',
			data: this.getRows()
		});
		var self = this;
		
		$.each($("table[id='table-event-table']").find("select[id*='selecttitle']"), function(index, item) {
			var id =$(item).attr("id");
			var index = id.substring("selecttitle".length);
			$(item).change(function() {
				$("#tableevent"+index).val("");
				var value = $("#tableevent"+index).val();
				var param = $("#" + id).find("option:selected").attr("param")
				if(value == undefined || value == "" || value.indexOf("输入函数内容") > -1) {
					var val = '输入函数内容，参数为: ' + param;
					$("#tableevent" + index).val(val);
					$("#tableevent" + index).attr("defaultvalue", val);
				}
				$("#tableevent" + index).attr("event", $("#" + id).val());
				self.updateTableData();
				
				//在选择事件调整为不选择事件后需要删除选择事件的内容
				if($("#" + id).val() == "") {
					
					self.setEvent();
				}
				
			});
		});
		
		
		$("table[id='table-event-table']").find("textarea[id*='tableevent']").blur(function() {
			self.setEvent();
		});
	}
	
	this.getEvents = function() {
		var events = new Array();
		return events;
	}
	
	this.getRows = function () {
		var rows = [];
		if(this.componentObject.attr('eventrowdata') != undefined) {
			return JSON.parse(decodeURIComponent(this.componentObject.attr('eventrowdata')));
		}
		//var events = this.getEvents();
		for (var i = 0; i < 5; i++) {
			rows.push({
				title: '<select class="form-textbox form-combo col-md-12" id="selecttitle'+i+'">' + this.getEvents().join(" ") + '</select>',
				event: '<textarea class="form-textbox form-textbox-text col-md-12" id="tableevent' + i + '" style="height: 80px;"></textarea>'
			});
		}
		return rows;
	}
	
	this.updateTableData = function() {
		var data = $('#table-event-table').bootstrapTable('getData');
		$.each(data, function(index, item) {
			//更新字段内容
			var eventid = $(item["event"]).attr("id");
			$("#" + eventid).text($("#"+eventid).val());
			item["event"] = $("#" + eventid).prop("outerHTML");
			
			var titleid = $(item["title"]).attr("id");
			var titleval = $("#" + titleid).val();
			//if($("#" + titleid).find("option[selected]").val() != titleval) {
				//$("#" + titleid).find("option").removeAttr("selected");
				$("#" + titleid).find("option[value='"+titleval+"']").attr("selected", true);
			//}
			item["title"] = $("#" + titleid).prop("outerHTML");
		});
	}
	
	// 设置事件到组件上
	this.setEvent = function() {
		var data = $('#table-event-table').bootstrapTable('getData');
		var events = new Array();
		this.updateTableData();
		$.each(data, function(index, item) {
			// 添加设置值的内容，不检测内容的正确性
			if($(item["event"]).text() == "" || $(item["event"]).attr("defaultvalue") == undefined) {
				return true;
			}
			if($(item["event"]).text() != $(item["event"]).attr("defaultvalue")) {
				events.push("name=" + $(item["event"]).attr("event") + ",value=" + $(item["event"]).text());
			}
		});
		this.componentObject.attr("componentevent", encodeURIComponent(
			JSON.stringify({type: componentObject.attr("type"),
				id: componentObject.attr("compid"),
				events: events})));
		this.componentObject.attr("eventrowdata", encodeURIComponent(JSON.stringify(data)));
	}
}

function TableEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);
	
	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="click-row.bs.table" param="event, row, $element">单击表格行</option>');
		events.push('<option value="dbl-click-row.bs.table" param="event, row, $element">双击表格行</option>');
		events.push('<option value="check.bs.table" param="event, row">勾选表格行</option>');
		events.push('<option value="uncheck.bs.table" param="event, row">去选表格行</option>');
		events.push('<option value="check-all.bs.table" param="event">全选表格行</option>');
		events.push('<option value="uncheck-all.bs.table" param="event">去全选表格行</option>');
		events.push('<option value="load-success.bs.table" param="event">表格加载成功</option>');
		return events;
	}
}

function BaseComponentEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);
	
	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="click" param="无">click</option>');
		events.push('<option value="change" param="无">change</option>');
		events.push('<option value="blur" param="无">blur</option>');
		events.push('<option value="dblclick" param="无">dblclick</option>');
		events.push('<option value="keydown" param="无">keydown</option>');
		events.push('<option value="keypress" param="无">keypress</option>');
		events.push('<option value="keyup" param="无">keyup</option>');
		events.push('<option value="mousedown" param="无">mousedown</option>');
		events.push('<option value="mouseup" param="无">mouseup</option>');
		events.push('<option value="ready" param="无">ready</option>');
		events.push('<option value="unbind" param="无">unbind</option>');
		events.push('<option value="unload" param="无">unload</option>');
		
		return events;
	}
}

/*
	日期框事件
*/
function DatetimeEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);
	
	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="dp.change" param="e">改变日期</option>');
		events.push('<option value="dp.show" param="e">显示视图</option>');
		
		
		return events;
	}
}

function ZTreeEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);
	
	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="onClick" param="event, treeId,treeNode">单击事件</option>');		
		events.push('<option value="onDblClick" param="event,treeId,treeNode">双击事件</option>');		
		events.push('<option value="onMouseDown" param="event,treeId,treeNode">鼠标按下</option>');		
		events.push('<option value="onRemove" param="event,treeId,treeNode">删除节点</option>');		
		events.push('<option value="beforeClick" param="event,treeId,clickFlag">单击前事件</option>');
		events.push('<option value="beforeNodesBind" param="node">节点绑定前事件</option>');
		return events;
	}
}

function ChineseRegionEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="changed.bs.chinese-region" param="event, datas">change</option>');
		return events;
	}
}

function SeparatorProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="click" param="">click</option>');
		return events;
	}
}

/*
 日期框事件
 */
function ShoppingCartEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="submit" param="data">结算事件</option>');
		return events;
	}

	// 设置事件到组件上
	this.setEvent = function() {
		var data = $('#table-event-table').bootstrapTable('getData');
		var events = new Array();
		this.updateTableData();
		$.each(data, function(index, item) {
			// 添加设置值的内容，不检测内容的正确性
			if($(item["event"]).text() == "" || $(item["event"]).attr("defaultvalue") == undefined) {
				return true;
			}
			if($(item["event"]).text() != $(item["event"]).attr("defaultvalue")) {
				events.push("name=" + $(item["event"]).attr("event") + ",value=" + $(item["event"]).text());
			}
		});
		this.componentObject.attr("submit-event", encodeURIComponent(
			JSON.stringify({type: componentObject.attr("type"),
				id: componentObject.attr("compid"),
				events: events})));
		this.componentObject.attr("eventrowdata", encodeURIComponent(JSON.stringify(data)));
	}
}
//开关组件绑定事件
function MSwitchProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="change" param="event,state">change</option>');
		return events;
	}

	// 设置事件到组件上
	this.setEvent = function() {
		var data = $('#table-event-table').bootstrapTable('getData');
		var events = new Array();
		this.updateTableData();
		$.each(data, function(index, item) {
			// 添加设置值的内容，不检测内容的正确性
			if($(item["event"]).text() == "" || $(item["event"]).attr("defaultvalue") == undefined) {
				return true;
			}
			if($(item["event"]).text() != $(item["event"]).attr("defaultvalue")) {
				events.push("name=" + $(item["event"]).attr("event") + ",value=" + $(item["event"]).text());
			}
		});
		this.componentObject.attr("switch-event", encodeURIComponent(
			JSON.stringify({type: componentObject.attr("type"),
				id: componentObject.attr("compid"),
				events: events})));
		this.componentObject.attr("eventrowdata", encodeURIComponent(JSON.stringify(data)));
	}
}
//Lable组件事件定义
function LableEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function () {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="event" param="event">event</option>');
		return events;
	}
}

function TabsEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function () {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="event" param="event">event</option>');
		return events;
	}
}

function BFDIconEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function () {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="event" param="event">event</option>');
		return events;
	}
}

function verticalListEventProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);

	this.getEvents = function () {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="click" param="event">click</option>');
		return events;
	}
}

function advancedSelectProperty(componentObject, eventPanelObject) {
	EventProperty.call(this, componentObject, eventPanelObject);
	this.getEvents = function() {
		var events = new Array();
		events.push('<option value="" param="">请选择</option>');
		events.push('<option value="shown" param="data">shown</option>');
		events.push('<option value="submit" param="">submit</option>');
		return events;
	}
}