package com.zte.iui.layoutit.bean.vm.event;

import java.util.Map;

public class BaseComponentEvent extends AbstractEvent {
	@SuppressWarnings("rawtypes")
	public BaseComponentEvent(Map map) {
		super(map);
	}

	public String getBaseComponentJSCode(Event event) {
		String result="";
		if(type.equalsIgnoreCase("input_radio")){
			result = "    $(\"[type=radio][id ^="+id+"]\").on('" + event.getName()
					+ "', function() {\n" + "        " + event.getValue() + "\n"
					+ "    });\n";
		}else if(type.equalsIgnoreCase("chinese_region")){
			result = "    $(\"#" + id + "\").parent().chineseRegion().on('" + event.getName()
					+ "', function(event,datas) {\n" + "        " + event.getValue() + "\n"
					+ "    });\n";
		}else{
			result = "    $(\"#" + id + "\").on('" + event.getName()
					+ "', function() {\n" + "        " + event.getValue() + "\n"
					+ "    });\n";
		}
		return result;
	}

	@Override
	public String generatorEventJSCode() {
		StringBuffer buffer = new StringBuffer();

		// buffer.append( "$(document).ready(function(){\n" );
		for (Event event : events) {
			buffer.append(getBaseComponentJSCode(event));
		}
		// buffer.append( "});\n\n" );
		return buffer.toString();
	}
}
