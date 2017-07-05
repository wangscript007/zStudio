/**
 * Created by 10089289 on 2017/2/14.
 */
;
(function($, global) {
	function BaseControl(properties, container, component, value) {
		this.properties = properties;
		this.container = container;
		this.component = component;
		this.value = value;
	};
	
	BaseControl.prototype = {
			getId : function() {
				return 'property-' + this.properties.attribute;
			}
	};

	/**
	 * 输入框，
	 * "componentParam": {
            "validation": {
              "trigger": "focusout",
              "expression": "^\\d{1,4}$",
              "message": "高度属性只能输入整数。"
            },
            "placeholder": "高度",
            "default": 600,
            "valueType": "int"
          }
	 */
	function InputText(properties, container, component, value) {
		BaseControl.call(this, properties, container, component, value);
		this.container.append(this._getDocument());
		this._registerEvent();
	};
	InputText.prototype = new BaseControl();
	
	InputText.prototype._getDocument = function() {
		var html = [], that = this;
		html.push('<input data-attribute=' + that.properties.attribute
				+ ' class="form-textbox form-textbox-text col-md-12"  type="text" ');
		html.push(that.properties.placeholder ? 'placeholder="' + that.properties.placeholder + '"'
				: '');
		html.push('id="' + that.getId + '"');
		if(that.value) {
			html.push('value="' + that.value + '" ');
		}
		html.push(' />');
		return html.join(" ");
	};
	InputText.prototype._registerEvent = function() {
		if(!this.properties.events) {
			return;
		}
		var that = this;
		$.each(that.properties.events, function(index, item) {
			$('#property-' + this.properties.attribute).off(item.type).on(item.type, function() {
				that.component[item[func]];
			});
		});
		
	};
	
	global.PropertyInputText = InputText;
	
	/**
	 * 单选框,参数<br />
	  "componentParam": {
        "option": [
            {
                "name": "显示名称1",
                "value": "值"
            },
            {
                "name": "显示名称2",
                "value": "值"
            }
        ],
        "default": "值",
        "valueType": "int"
    }
	 */
	function Radio(properties, container, component, value) {
		BaseControl.call(this, properties, container, component, value);
		this.container.append(this._getDocument());
		this._registerEvent();
	};
	Radio.prototype = new BaseControl();
	Radio.prototype._getDocument = function() {
		var html = [], that = this;
		$.each(that.properties.option, function(index, item) {
			var checked = '';
			if(that['default'] && item.value === that['default']) {
				checked = 'checked';
			}
			html.push('<input name="'+that.getId() + '" type="radio" id="'+that.getId() + index +'" value="'+item.value+'" '+checked+'>');
			html.push('<label for="'+that.getId() + index +'">'+item.name+'</label>');
		});
		return html.join(" ");
	};
	Radio.prototype._registerEvent = function() {
		if(!this.properties.events) {
			return;
		}
		var that = this;
		$.each(that.properties.events, function(index, item) {
			$('input[name="property-'+that.properties.attribute+'"]').off(item.type).on(item.type, function() {
				this.component[item['func']];
			});
		});
	};
	global.PropertyRadio = Radio;
	
	
	/**
	 * 复选框,参数<br />
	  "componentParam": {
        "option": [
            {
                "name": "显示名称1",
                "value": "值",
                "isCheck":true/false
            },
            {
                "name": "显示名称2",
                "value": "值",
                "isCheck":true/false
            }
        ],
        "valueType": "int"
    }
	 */
	function Checkbox(properties, container, component, value) {
		BaseControl.call(this, properties, container, component, value);
		this.container.append(this._getDocument());
		this._registerEvent();
	};
	Checkbox.prototype = {
		_getDocument : function() {
			var html = [], that = this;
			
			$.each(that.properties.option, function(index, item) {
				var id = attribute + index, checked = '';
				if(item.isCheck) {
					checked = 'checked';
				}
				html.push('<input name="property-"+'+that.attribute+' type="checkbox" id="'+id+'" value="'+item.value+'" '+checked+'><label for="'+id+'">'+item.name+'</label>');
			});
			return html.join(" ");
		},
		
		_registerEvent : function() {
			var that = this;
			$.each(that.properties.events, function(index, item) {
				$('input[name="property-'+that.properties.attribute+'"]').off(item.type).on(item.type, function() {
					this.component[item['func']];
				});
			});
		}
	};
	global.PropertyCheckbox = Checkbox;
	
	
	/**
	 * 单选框,参数<br />
	  "componentParam": {
        "option": [
            {
                "name": "显示名称1",
                "value": "值"
            },
            {
                "name": "显示名称2",
                "value": "值"
            }
        ],
        "default": "值",
        "valueType": "int"
    }
	 */
	function Select(properties, container, component, value) {
		BaseControl.call(this, properties, container, component, value);
		this.container.append(this._getDocument());
		this._registerEvent();
	};
	Select.prototype = {
		_getDocument : function() {
			var html = ['<select class="form-textbox form-textbox-text col-md-12" id="property-'+that.properties.attribute+'">'], that = this;
			
			$.each(that.properties.option, function(index, item) {
				var selected = '';
				if(that['default'] && item.value === that['default']) {
					selected = 'selected';
				}
				html.push('<option value="'+item.value+'" '+selected+'>'+item.name+'</option>');
			});
			html.push('</select>');
			return html.join(" ");
		},
		
		_registerEvent : function() {
			var that = this;
			$.each(that.properties.events, function(index, item) {
				$('#property-'+that.properties.attribute).off(item.type).on(item.type, function() {
					this.component[item['func']];
				});
			});
		}
	};
	global.PropertySelect = Select;
	

}(jQuery, window));