var OPTION_DATATYPE = {};

OPTION_DATATYPE.INT = "int";
OPTION_DATATYPE.FLOAT = "float";
OPTION_DATATYPE.STRING = "string";

OPTION_DATATYPE.parse = function(val, dataType) {
	if (dataType == OPTION_DATATYPE.FLOAT) {
		val = parseFloat(val);
		if (isNaN(val)) {
			return null;
		}
	} else if (dataType == OPTION_DATATYPE.INT) {
		val = parseInt(val);
		if (isNaN(val)) {
			return null;
		}
	} else if (dataType == OPTION_DATATYPE.STRING) {
		val = val.toString();
	}

	return val;
}

///////////////////////////

function getRadioInputsHtml(option) {
	var html = [];
	html.push('<tr><td class="propertyName_td col-md-4">');
	html.push(option.name);
	html.push('：</td>');

	html.push('<td>');
	for (var i = 0; i < option.options.length; i++) {
		html.push('<input name="');
		html.push(option.id);
		html.push('" id="');
		html.push(option.options[i]["domId"]);
		html.push('" type="');
		html.push(option.type);
		html.push('" value="');
		html.push(option.options[i]["value"]);
		html.push('"');

		if (option.options[i]["checked"] != null) {
			html.push(' checked="checked"');
		}

		html.push('>');
		html.push('<span>');
		html.push(option.options[i]["text"]);
		html.push('&nbsp;&nbsp;&nbsp;&nbsp;</span>');
	}

	html.push('</td>');
	return html.join("");
}

///////////////

/**
 * 图表属性对radio的处理
 * @param propertyItem
 * @param value
 * @constructor
 */
function ChartPropertyRadioOption(propertyItem, value) {
	this.propertyItem = propertyItem;
	this.configRelation = this.propertyItem.attributeRelation;
	this.configRelationTemplate = this.propertyItem.attributeRelationTemplate;

	this.id = "option_" + this.propertyItem.attributeName + "_" + propertyItem.idSuffix + "_" + getCurrentTime();
	this.value = value;

	this._initOptions();
}

ChartPropertyRadioOption.prototype._initOptions = function() {
	var options = [];
	var that = this;
	$.each(this.propertyItem.options, function(index, item) {
		var option = {
			text: item.title,
			value: item.value,
			domId: that.id + "_" + index
		};

		if (that.getValue() == item.value) {
			option['checked'] = 'checked';
		}

		options.push(option);
	});

	this.options = options;
};

ChartPropertyRadioOption.prototype.onIndexChange = function(newMultipleDataIndex) {
	this.configRelation = this.configRelationTemplate.replace(/\{idx\}/, "" + newMultipleDataIndex);
};

ChartPropertyRadioOption.prototype.getDomIds = function() {
	var domIds = [];
	for (var i = 0; i < this.options.length; i++) {
		domIds.push(this.options[i].domId);
	}
	return domIds;
};

ChartPropertyRadioOption.prototype.getHtml = function() {
	var option = {
		type: 'radio',
		name: this.propertyItem.displayName,
		id: this.id,
		options: this.options
	};

	return $(getRadioInputsHtml(option));
};

ChartPropertyRadioOption.prototype.setProperty = function(event) {
	//获取当前选择项，将当前选择项设置到保存对象中
	var val = $(event.target).val();
	if (val == 'true') {
		val = true;
	} else if (val == 'false') {
		val = false;
	}

	this.value = val;
};

ChartPropertyRadioOption.prototype.getValue = function() {
	return this.value;
};

// TODO 待实现、待测试
/*
ChartPropertyRadioOption.prototype.setValue = function(value) {
};
*/

ChartPropertyRadioOption.prototype.getPath = function() {
	return this.configRelation;
};

////////////////////////// input

/**
 * 图表属性对input的处理
 * @param propertyItem
 * @param value
 * @constructor
 */
function ChartPropertyInputOption(propertyItem, value) {
	this.propertyItem = propertyItem;
	this.configRelation = this.propertyItem.attributeRelation;
	this.configRelationTemplate = this.propertyItem.attributeRelationTemplate;
	this.dataType = this.propertyItem.dataType || OPTION_DATATYPE.STRING;

	this.id = "option_" + this.propertyItem.attributeName + "_" + propertyItem.idSuffix + "_" + getCurrentTime();
	this.value = value;
}

ChartPropertyInputOption.prototype.onIndexChange = function(newMultipleDataIndex) {
	this.configRelation = this.configRelationTemplate.replace(/\{idx\}/, "" + newMultipleDataIndex);
};

ChartPropertyInputOption.prototype.getDomIds = function() {
	return [this.id];
};

ChartPropertyInputOption.prototype.getHtml = function() {
	var html = '<tr><td class="propertyName_td col-md-4">' + this.propertyItem.displayName + '：</td>' +
		'<td><input type="text" id="' + this.id + '" class="form-textbox form-textbox-text col-md-12" value="' + this.getValue() + '" />' +
		'</td></tr>';
	html = $(html);

	this.$input = html.find('#' + this.id);

	return html;
};

/**
 * 设置文本框输入属性，保存到属性组上
 * @param event
 */
ChartPropertyInputOption.prototype.setProperty = function(event) {
	var val = $(event.target).val();
	val = OPTION_DATATYPE.parse(val, this.dataType);
	if (val == null) {
		return;
	}

	this.value = val;
};

ChartPropertyInputOption.prototype.getValue = function() {
	return this.value;
};

ChartPropertyInputOption.prototype.setValue = function(value) {
	this.value = value;
	this.$input.val(value);
};

ChartPropertyInputOption.prototype.getPath = function() {
	return this.configRelation;
};

////////////////////////// multi-input

/**
 * 图表属性对input的处理
 * @param propertyItem
 * @param value
 * @constructor
 */
function ChartPropertyMultiInputOption(propertyItem, value) {
	this.propertyItem = propertyItem;
	this.configRelation = this.propertyItem.attributeRelation;
	this.configRelationTemplate = this.propertyItem.attributeRelationTemplate;
	this.dataType = this.propertyItem.dataType || OPTION_DATATYPE.STRING;

	this.id = "option_" + this.propertyItem.attributeName + "_" + propertyItem.idSuffix + "_" + getCurrentTime();
	this.value = value;

	this._initOptions();
}

ChartPropertyMultiInputOption.prototype._initOptions = function() {
	var options = [];
	var that = this;
	$.each(this.propertyItem.options, function(index, item) {
		var option = {
			placeholder: item.title,
			value: that.getValue()[index],
			domId: that.id + "_" + index
		};

		options.push(option);
	});

	this.options = options;
};

ChartPropertyMultiInputOption.prototype.onIndexChange = function(newMultipleDataIndex) {
	this.configRelation = this.configRelationTemplate.replace(/\{idx\}/, "" + newMultipleDataIndex);
};

ChartPropertyMultiInputOption.prototype.getDomIds = function() {
	var domIds = [];
	for (var i = 0; i < this.options.length; i++) {
		domIds.push(this.options[i].domId);
	}
	return domIds;
};

ChartPropertyMultiInputOption.prototype.getHtml = function() {
	var html = '<tr><td class="propertyName_td col-md-4">' + this.propertyItem.displayName + '：</td><td>';

	$.each(this.options, function(index, item) {
		html += '<input type="text" id="' + item.domId + '" class="form-textbox form-textbox-text col-md-12" value="' + item.value + '" placeholder="' + item.placeholder + '" />' +
			'';
	});

	html += '</td></tr>';

	return $(html);
};

/**
 * 设置文本框输入属性，保存到属性组上
 * @param event
 */
ChartPropertyMultiInputOption.prototype.setProperty = function(event) {
	var targetObj = $(event.target);

	var inputId = targetObj.attr("id");
	var optionIndex = inputId.substring(inputId.lastIndexOf('_') + 1);

	var val = targetObj.val();
	val = OPTION_DATATYPE.parse(val, this.dataType);
	if (val == null) {
		return;
	}

	optionIndex = parseInt(optionIndex);
	this.value[optionIndex] = val;
};

ChartPropertyMultiInputOption.prototype.getValue = function() {
	return this.value;
};

// TODO 待实现、待测试
/*
 ChartPropertyMultiInputOption.prototype.setValue = function(value) {
 };
 */

ChartPropertyMultiInputOption.prototype.getPath = function() {
	return this.configRelation;
};

///////////////////////  checkbox

/**
 * 图表属性对checkbox的处理
 * @param propertyItem
 * @param value
 * @constructor
 */
function ChartPropertyCheckboxOption(propertyItem, value) {
	this.propertyItem = propertyItem;
	this.configRelation = this.propertyItem.attributeRelation;
	this.configRelationTemplate = this.propertyItem.attributeRelationTemplate;

	this.id = "option_" + this.propertyItem.attributeName + "_" + propertyItem.idSuffix + "_" + getCurrentTime();
	this.value = value;

	this._initOptions();
}

ChartPropertyCheckboxOption.prototype._initOptions = function() {
	var options = [];
	var that = this;
	$.each(this.propertyItem.options, function(index, item) {
		var isShow = that.getValue().indexOf(item.value) > -1;
		var option = {
			text: item.title,
			value: item.value,
			domId : that.id + "_" + index
		};
		if (isShow) {
			option['checked'] = 'checked';
		}

		options.push(option);
	});

	this.options = options;
};

ChartPropertyCheckboxOption.prototype.onIndexChange = function(newMultipleDataIndex) {
	this.configRelation = this.configRelationTemplate.replace(/\{idx\}/, "" + newMultipleDataIndex);
};

ChartPropertyCheckboxOption.prototype.getDomIds = function() {
	var domIds = [];
	for (var i = 0; i < this.options.length; i++) {
		domIds.push(this.options[i].domId);
	}
	return domIds;
};

ChartPropertyCheckboxOption.prototype.getHtml = function() {
	var option = {
		type: 'checkbox',
		name: this.propertyItem.displayName,
		id: this.id,
		options: this.options
	};

	return $(getRadioInputsHtml(option));
};

ChartPropertyCheckboxOption.prototype.setProperty = function(event) {
	//this.value和chartPropertiesMap中指向的数组是同一个对象，可以直接修改数组的元素
	var targetObj = $(event.target);
	var val = targetObj.val();
	if ($(targetObj).attr("checked") == undefined) {
		$(targetObj).attr("checked", "checked");

		this.value.push(val);
	} else {
		$(targetObj).removeAttr("checked");

		_.pull(this.value, val);
	}
};

ChartPropertyCheckboxOption.prototype.getValue = function() {
	return this.value;
};

// TODO 待实现、待测试
/*
 ChartPropertyCheckboxOption.prototype.setValue = function(value) {
 };
 */

ChartPropertyCheckboxOption.prototype.getPath = function() {
	return this.configRelation;
};

////////////colorPicker

/**
 *
 * @param propertyItem
 * @param value
 * @constructor
 */
function ChartPropertyColorPickerOption(propertyItem, value) {
	this.propertyItem = propertyItem;
	this.configRelation = this.propertyItem.attributeRelation;
	this.configRelationTemplate = this.propertyItem.attributeRelationTemplate;

	this.id = "option_" + this.propertyItem.attributeName + "_" + propertyItem.idSuffix + "_" + getCurrentTime();
	this.value = value;
}

ChartPropertyColorPickerOption.prototype.onIndexChange = function(newMultipleDataIndex) {
	this.configRelation = this.configRelationTemplate.replace(/\{idx\}/, "" + newMultipleDataIndex);
};

ChartPropertyColorPickerOption.prototype.getDomIds = function() {
	return [this.id];
};

ChartPropertyColorPickerOption.prototype.getHtml = function() {
	var propertyContainer = $('<tr><td class="propertyName_td col-md-4">' + this.propertyItem.displayName + '：</td>');

	var td = $('<td>');
	var colorContainer = $('<input type="text" id="' + this.id + '" name="' + this.id + '" class="form-control" value="' + this.getValue() + '" />');
	td.append(colorContainer);
	propertyContainer.append(td);
	this.registerColorPicker(colorContainer);
	return propertyContainer;
};

/**
 * 设置文本框输入属性，保存到属性组上
 * @param event
 */
ChartPropertyColorPickerOption.prototype.setProperty = function(event) {
	if (this.configRelation) {
		var val = $(event.target).val();
		this.value = val;
	}
};

ChartPropertyColorPickerOption.prototype.getValue = function() {
	return this.value;
};

// TODO 待实现、待测试
/*
 ChartPropertyColorPickerOption.prototype.setValue = function(value) {
 };
 */

ChartPropertyColorPickerOption.prototype.getPath = function() {
	return this.configRelation;
};

ChartPropertyColorPickerOption.prototype.registerColorPicker = function (colorContainer) {
	var that = this;
	colorContainer.spectrum({
		color: this.value,
		allowEmpty:true,
		showInput: true,
		showInitial: true,
		showPalette: true,
		showSelectionPalette: true,
		showAlpha: true,
		maxPaletteSize: 7,
		preferredFormat: true,
		clickoutFiresChange: true,
		replacerClassName: "color-picker-background",
		chooseText: "确 定",
		cancelText: "取 消",

		change: function (color) {

		},
		move: function (color) {
			if (color != null) {
				that.value = color.toHexString();
				window.datavisual.pluginManager.redrawActiveComponentWrapper();
			}
		},
		show: function (color) {
		},
		beforeShow: function (color) {
		},
		hide: function (color) {
		},
		cancel: function (color) {
			if (color != undefined && color != null) {
				//var val = color.toHexString();
				that.value = color;
				window.datavisual.pluginManager.redrawActiveComponentWrapper();
			}
		},

		palette: [
			["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)","rgb(183, 183, 183)",
				"rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)", "rgb(243, 243, 243)", "rgb(255, 255, 255)"],
			["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
				"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
			["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
				"rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
				"rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
				"rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
				"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
				"rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
				"rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
				"rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
				"rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
				"rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
		]
	});
};

///////////////////


/**
 *
 * @param propertyItem
 * @param value
 * @constructor
 */
function ChartPropertySliderOption(propertyItem, value) {
	this.propertyItem = propertyItem;
	this.configRelation = this.propertyItem.attributeRelation;
	this.configRelationTemplate = this.propertyItem.attributeRelationTemplate;

	this.id = "option_" + this.propertyItem.attributeName + "_" + propertyItem.idSuffix + "_" + getCurrentTime();
	this.value = value;
}

ChartPropertySliderOption.prototype.onIndexChange = function(newMultipleDataIndex) {
	this.configRelation = this.configRelationTemplate.replace(/\{idx\}/, "" + newMultipleDataIndex);
};

ChartPropertySliderOption.prototype.getDomIds = function() {
	return [this.id];
};

ChartPropertySliderOption.prototype.getHtml = function() {
	var propertyContainer = $('<tr><td class="propertyName_td col-md-4">' + this.propertyItem.displayName + '：</td>');

	var td = $('<td>');
	var sliderContainer = $('<div>');
	td.append(sliderContainer);
	propertyContainer.append(td);
	this.registerSlider(sliderContainer);
	return propertyContainer;
};

/**
 * 设置文本框输入属性，保存到属性组上
 * @param event
 */
ChartPropertySliderOption.prototype.setProperty = function(event) {
	if (this.configRelation) {
		var val = $(event.target).val();
		this.value = val;
	}
};

ChartPropertySliderOption.prototype.getValue = function() {
	return this.value;
};

// TODO 待实现、待测试
/*
 ChartPropertySliderOption.prototype.setValue = function(value) {
 };
 */

ChartPropertySliderOption.prototype.getPath = function() {
	return this.configRelation;
};

ChartPropertySliderOption.prototype.registerSlider = function (sliderContainer) {
	var that = this;
	sliderContainer.slider({
		value: this.getValue(),
		min: this.propertyItem.min,
		max: this.propertyItem.max,
		change: function( event, ui ) {
			that.value = ui.value;
			window.datavisual.pluginManager.redrawActiveComponentWrapper();
		}
	});
};

///////////////////

var ChartPropertiesModel = function (initChartProperties, component) {
	this.component = component;
	this.initChartProperties = initChartProperties || {};
	this.chartMap = new Map();
};

ChartPropertiesModel.prototype.clearChartMap = function() {
	this.chartMap = new Map();
};

ChartPropertiesModel.prototype.getValueFromInitProperties = function(path, defaultValue) {
	if (defaultValue === undefined || defaultValue === null) {
		return _.get(this.initChartProperties, path);
	} else {
		return _.get(this.initChartProperties, path, defaultValue);
	}
};

ChartPropertiesModel.prototype._updateInitChartProperties = function() {
	var chartProps = {};
	var that = this;
	$.each(this.chartMap.keySet(), function (index, key) {
		var option = that.chartMap.get(key);
		_.set(chartProps, option.getPath(), option.getValue());
	});

	this.initChartProperties = chartProps;
};

ChartPropertiesModel.prototype.getChartProperties = function() {
	this._updateInitChartProperties();
	return $.extend({}, this.initChartProperties);
};

ChartPropertiesModel.prototype.putDom2OptionObj = function(domId, optionObject) {
	this.chartMap.put(domId, optionObject);
};

ChartPropertiesModel.prototype.remove = function(domId) {
	this.chartMap.remove(domId);
};

ChartPropertiesModel.prototype.getOptionObjByDomId = function(domId) {
	var result = null;
	var that = this;
	$.each(this.chartMap.keySet(), function (index, value) {
		if (value == domId) {
			result = that.chartMap.get(value);
		}
	});

	return result;
};

ChartPropertiesModel.prototype.handlePropertyEvent = function(e) {
	var obj = $(e.target);
	var echo = this.getOptionObjByDomId(obj.attr("id"));

	if (typeof(echo) != 'undefined' && echo.setProperty != undefined) {
		echo.setProperty(e);
		this._updateInitChartProperties();

		if (this.component && this.component.onPropertyChanged != undefined) {
			var path = echo.getPath();
			var value = echo.getValue();
			this.component.onPropertyChanged(path, value, echo);
		}
	}
};

ChartPropertiesModel.prototype.createOption = function (optionConfig) {
	// clone默认值，避免引用类型如array等引起的bug
	var defaultValue = _.clone(optionConfig.defaultOption);
	var value = this.getValueFromInitProperties(optionConfig.attributeRelation, defaultValue);

	var option;
	if (optionConfig.type == "radio") {
		option = new ChartPropertyRadioOption(optionConfig, value);
	} else if (optionConfig.type == "input") {
		option = new ChartPropertyInputOption(optionConfig, value);
	} else if (optionConfig.type == "checkbox") {
		option = new ChartPropertyCheckboxOption(optionConfig, value);
	} else if (optionConfig.type == "color"){
		option = new ChartPropertyColorPickerOption(optionConfig, value);
	} else if (optionConfig.type == "slider") {
		option = new ChartPropertySliderOption(optionConfig, value);
	} else if (optionConfig.type == 'multi-input') {
		option = new ChartPropertyMultiInputOption(optionConfig, value);
	}

	if (option == null) {
		return null;
	}

	var domIds = option.getDomIds();
	for (var i = 0; i < domIds.length; i++) {
		this.putDom2OptionObj(domIds[i], option);
	}

	return option;
};

///////
var CommonChartPropertyHtmlBuilder = function (chartPropertiesModel) {
	this.chartPropertiesModel = chartPropertiesModel;
};

/*
CommonChartPropertyHtmlBuilder.prototype._getPropertyPanelHtml_old = function (pluginCustomProperties, baseProperties, unsupportedBaseProperties) {
	var propertiesContainer = $('<div>');

	this._getBasePropertiesHtml(propertiesContainer, baseProperties, unsupportedBaseProperties);

	this._getPluginCustomPropertiesHtml(propertiesContainer, pluginCustomProperties);

	return propertiesContainer;
};
*/

CommonChartPropertyHtmlBuilder.prototype._getPropertyPanelHtml = function (pluginProperties) {
	this.chartPropertiesModel.clearChartMap();

	var propertiesContainer = $('<div>');

	this._getPluginCustomPropertiesHtml(propertiesContainer, pluginProperties);

	return propertiesContainer;
};

/*
CommonChartPropertyHtmlBuilder.prototype._getBasePropertiesHtml = function (propertiesContainer, baseProperties, unsupportedBaseProperties) {
	unsupportedBaseProperties = unsupportedBaseProperties || [];

	var that = this;
	$.each(baseProperties, function (index, item) {
		if (unsupportedBaseProperties.indexOf(item.attributeName) < 0) {
			propertiesContainer.append(that._getPropertyHtml_level1(item));
		}
	});
};
*/

CommonChartPropertyHtmlBuilder.prototype._getPluginCustomPropertiesHtml = function (propertiesContainer, pluginCustomProperties) {
	pluginCustomProperties = pluginCustomProperties || [];

	var that = this;
	$.each(pluginCustomProperties, function (index, item) {
		propertiesContainer.append(that._getPropertyHtml_level1(item));
	});
};

//动态获得一级分类属性的html
CommonChartPropertyHtmlBuilder.prototype._getPropertyHtml_level1 = function (property) {
	if (property.multiple) {
		var multipleBuilder = new MultiplePropertyHtmlBuilder_Level1(property, this.chartPropertiesModel);
		return multipleBuilder.getPropertyHtml_level1();
	} else {
		var singleBuilder = new SinglePropertyHtmlBuilder_Level1(property, this.chartPropertiesModel);
		return singleBuilder.getPropertyHtml_level1();
	}
};

//动态获得一级分类属性的html
function SinglePropertyHtmlBuilder_Level1(propertyDef, chartPropertiesModel) {
	this.propertyDef = propertyDef;
	this.chartPropertiesModel = chartPropertiesModel;
}

SinglePropertyHtmlBuilder_Level1.prototype.getPropertyHtml_level1 = function () {
	var html = '<div class="form-panel">' +
		'<div class="title">' +
		'<em class="glyphicon glyphicon-cog icon1"></em>' +
		'<span> ' + this.propertyDef.displayName + '</span>' +
		'</div>' +
		'<div class="body" style="padding:2px;">' +
		'<table class="table table-bordered">' +
		'</table>' +
		'</div></div>';

	html = $(html);
	var table = html.find("table.table");

	var that = this;
	$.each(this.propertyDef.propertyItems, function (index, item) {
		table.append(that._getPropertyHtml_level2(item));
	});

	return html;
};

SinglePropertyHtmlBuilder_Level1.prototype._getPropertyHtml_level2 = function (item) {
	var optionConfig = _.assign({}, item);
	optionConfig.attributeRelationTemplate = item.attributeRelation;
	optionConfig.idSuffix = "";

	var option = this.chartPropertiesModel.createOption(optionConfig);
	return option.getHtml();
};

///////////////////////////////////
function MultiplePropertyHtmlBuilder_Level1(propertyDef, chartPropertiesModel) {
	this.propertyDef = propertyDef;
	this.chartPropertiesModel = chartPropertiesModel;

	this.multipleMemberHolder = {
		optionIdCounter: 0,
		members: [],

		idMaker : function () {
			this.optionIdCounter++;
			return this.optionIdCounter;
		},

		addMember: function (member) {
			this.members.push(member);
		},

		removeMember: function (toRemoveMemberIndex) {
			for (var i = toRemoveMemberIndex + 1; i < this.members.length; i++) {
				this.members[i].updateIndex(i - 1);
			}
			this.members.splice(toRemoveMemberIndex, 1);
		},

		onlyOneMemberRemains: function () {
			return this.members.length == 1;
		},

		nextMemberIndex: function () {
			return this.members.length;
		}
	};
}

MultiplePropertyHtmlBuilder_Level1.prototype.getPropertyHtml_level1 = function () {
	var html = '<div class="form-panel">' +
		'<div class="title">' +
		'<em class="glyphicon glyphicon-cog icon1"></em>' +
		'<span> ' + this.propertyDef.displayName + '</span>' +
		'<span style="float:right;">' +
		'<a class="btn btn-link btn-xs"><i class="glyphicon glyphicon-plus"></i></a>' +
		'</span>' +
		'</div>' +
		'<div class="body" style="padding:2px;">' +
		'</div>' +
		'</div>';

	var that = this;

	html = $(html);
	var divBody = html.find("div.body");

	var addBtn = html.find("a.btn");
	addBtn.on("click", function () {
		var level1Member = that.getPropertyHtml_level1_member();
		divBody.append(level1Member);
		window.datavisual.pluginManager.redrawActiveComponentWrapper();

		return false;
	});

	//获取初始属性中该multiple属性的数组长度，根据长度初始化对应个数的界面元素组
	var initCount = 1;
	var array = this.chartPropertiesModel.getValueFromInitProperties(this.propertyDef.attributeRelation);
	if (array != null && array != undefined) {
		initCount = array.length;
	}

	for (var i = 0; i < initCount; i++) {
		var level1Member = that.getPropertyHtml_level1_member();
		divBody.append(level1Member);
	}

	return html;
};

//动态获得一级分类属性的html
MultiplePropertyHtmlBuilder_Level1.prototype.getPropertyHtml_level1_member = function () {
	var newMemberIndex = this.multipleMemberHolder.nextMemberIndex();
	var newMember = new MultiplePropertyHtmlBuilder_Level1_Member(newMemberIndex, this.propertyDef, this.multipleMemberHolder, this.chartPropertiesModel);
	this.multipleMemberHolder.addMember(newMember);
	return newMember.getHtml();
};


/////////////////////

function MultiplePropertyHtmlBuilder_Level1_Member(index, propertyDef, multipleMemberHolder, chartPropertiesModel) {
	this.index = index;
	this.propertyDef = propertyDef;
	this.multipleMemberHolder = multipleMemberHolder;
	this.chartPropertiesModel = chartPropertiesModel;

	this.options = [];
}

MultiplePropertyHtmlBuilder_Level1_Member.prototype.getHtml = function () {
	var html = '<div>' +
		'<span> ' + this.propertyDef.displayName + (this.index + 1) + '</span>' +
		'<span style="float:right;">' +
		'<a class="btn btn-link btn-xs"><i class="glyphicon glyphicon-minus"></i></a>' +
		'</span>' +
		'<table class="table table-bordered">' +
		'</table>' +
		'</div>';
	html = $(html);

	var that = this;

	var removeBtn = html.find("a.btn");
	removeBtn.on("click", function () {
		if (that.multipleMemberHolder.onlyOneMemberRemains()) {
			return false;
		}

		that.removeSelf();
		return false;
	});

	var newTable = html.find("table.table");
	$.each(this.propertyDef.propertyItems, function (index, item) {
		var option = that._getPropertyHtml_level2(item);
		if (option != null) {
			newTable.append(option.getHtml());
			that.options.push(option);
		}
	});

	this.html = html;
	return html;
};

MultiplePropertyHtmlBuilder_Level1_Member.prototype.removeSelf = function() {
	this.multipleMemberHolder.removeMember(this.index);

	for (var i = 0; i < this.options.length; i++) {
		var domIds = this.options[i].getDomIds();
		for (var j = 0; j < domIds.length; j++) {
			this.chartPropertiesModel.remove(domIds[j]);
		}
	}

	this.html.remove();
	window.datavisual.pluginManager.redrawActiveComponentWrapper();
};

MultiplePropertyHtmlBuilder_Level1_Member.prototype.updateIndex = function (newIndex) {
	this.index = newIndex;

	this.html.find("span:first-child").text(this.propertyDef.displayName + (newIndex + 1));
	this.options.forEach(function (option) {
		option.onIndexChange(newIndex);
	});
};


MultiplePropertyHtmlBuilder_Level1_Member.prototype._getPropertyHtml_level2 = function (item) {
	var path = item.attributeRelation;
	path = path.replace(/\{idx\}/, "" + this.index);

	var optionConfig = _.assign({}, item);
	optionConfig.attributeRelationTemplate = item.attributeRelation;
	optionConfig.attributeRelation = path;
	optionConfig.idSuffix = this.multipleMemberHolder.idMaker();

	var option = this.chartPropertiesModel.createOption(optionConfig);
	return option;
};