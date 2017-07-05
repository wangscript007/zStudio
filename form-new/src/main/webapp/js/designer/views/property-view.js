(function($, global) {
	
	function PropertyView() {
	}
	
	PropertyView.prototype = {
		init : function(compName, component) {
			var componentsMap = global.componentLoader.componentsMap,
			comp = componentsMap.get(compName),
			config = comp.config,
			properties = config.properties,
			that = this;
			
            
			if (properties && $.isArray(properties)) {
                properties.sort(function (a, b) {
                    a.order - b.order;
                });
                $('#property-view').find('ul').empty();
                $('#property-view').find('.tabs-panels').empty();
                $.each(properties, function (index, item) {
                    var order = item.order,
                        header = $('<li id="tab"' + order + ' panel-target="#panel' + order + '">' +
                            '	<a href="javascript:void(0)" class="tabs-inner">' +
                            '	<span class="tabs-title">' + item.name + '</span>' +
                            '	</a>' +
                            '	</li>'),
                        content = $('<div class="panel height100" id="panel' + order + '">' +
                            '<div class="form-panel properties height100">' +
                            '<div class="form-panel-body form-panel-body-noborder" style="padding:2px;height:95%;">' +
                            '</div>' +
                            '</div>' +
                            '</div>');
                    $('#property-view').find('ul').append(header);
                    $('#property-view').find('.tabs-panels').append(content);

                    that._loadPropertiesPanel(order, compName, item.content, component);

                });
            }
		},
	
		 _loadPropertiesPanel : function(order, compName, propertyContents, component) {
		    var propPanel = $("#panel" + order).find('.form-panel-body').empty(),
		        name = compName;
		    propPanel.append('<div><table class="table"><tbody></tbody></table></div>');
		    var idName = name + _tools.getCurrentTime(),
		        html = [];
		    html.push('<tr><td class="col-md-4 property-panel-td" >Id</td>');
		    html.push('<td class="align-left"><input class="form-textbox form-textbox-text col-md-12" type="text" value="' + idName + '"/></td></tr>');
		    html.push('<tr><td class="col-md-4 property-panel-td">Name</td>');
		    html.push('<td class="align-left"><input class="form-textbox form-textbox-text col-md-12"  value="' + idName + '"/></td></tr>');
		    var tbody = propPanel.find('table tbody');
		    tbody.append(html.join(' '));
	
	
		    if (propertyContents && $.isArray(propertyContents)) {
		        $.each(propertyContents, function (index, item) {
		        	if(item['predefineProperty']) {
		        		return true;
		        	}
		        	
		            var row = $('<tr><td class="col-md-4 property-panel-td" >' + item.displayName + '</td></tr>'),
		            td = $('<td class="align-left"></td>');
		            row.append(td);
		            tbody.append(row);
		            eval('new global.Property' + item.componentClass + '(item.componentParam, td, component)');		            
		        });
		    }
		}
	};
	
	global.propertyView = new PropertyView();
	
}(jQuery, window));