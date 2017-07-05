package com.zte.iui.layoutit.bean.vm.event;

import java.util.Map;

public class DateTimeEvent extends AbstractEvent {

	@SuppressWarnings("rawtypes")
	public DateTimeEvent(Map map) {
		super(map);
	}

	@Override
	public String generatorEventJSCode() {
		StringBuffer buffer = new StringBuffer();
		for (Event event : events) {
			String name = event.getName();
			if (name.equals("dp.change")) {
				buffer.append("    $('#" + id
						+ "').on('dp.change', function(e) {\n" + "        "
						+ event.getValue() + "\n" + "    });\n");
			} else if (name.equals("dp.show")) {
				buffer.append("    $('#" + id
						+ "').on('dp.show', function(e) {\n" + "        "
						+ event.getValue() + "\n" + "    });\n");
			}
			buffer.append("\n\n");
		}
		return buffer.toString();
	}
}
