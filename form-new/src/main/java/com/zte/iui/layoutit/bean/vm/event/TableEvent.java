package com.zte.iui.layoutit.bean.vm.event;

import java.util.Map;

public class TableEvent extends AbstractEvent {

	@SuppressWarnings("rawtypes")
	public TableEvent(Map map) {
		super(map);
	}

	@Override
	public String generatorEventJSCode() {
		StringBuffer buffer = new StringBuffer();
		for (Event event : events) {
			String name = event.getName();
			if (name.equals("click-row.bs.table")) {
				buffer.append("    $('#"
						+ id
						+ "').bootstrapTable().on('click-row.bs.table', function(event, row, $element) {\n"
						+ "        " + event.getValue() + "\n" + "    });\n");
			} else if (name.equals("dbl-click-row.bs.table")) {
				buffer.append("    $('#"
						+ id
						+ "').bootstrapTable().on('dbl-click-row.bs.table', function(event, row, $element) {\n"
						+ "        " + event.getValue() + "\n" + "    });\n");
			} else if (name.equals("check.bs.table")) {
				buffer.append("    $('#"
						+ id
						+ "').bootstrapTable().on('check.bs.table', function(event, row) {\n"
						+ "        " + event.getValue() + "\n" + "    });\n");
			} else if (name.equals("uncheck.bs.table")) {
				buffer.append("    $('#"
						+ id
						+ "').bootstrapTable().on('uncheck.bs.table', function(event, row) {\n"
						+ "        " + event.getValue() + "\n" + "    });\n");
			} else if (name.equals("check-all.bs.table")) {
				buffer.append("    $('#"
						+ id
						+ "').bootstrapTable().on('check-all.bs.table', function(event) {\n"
						+ "        " + event.getValue() + "\n" + "    });\n");
			} else if (name.equals("uncheck-all.bs.table")) {
				buffer.append("    $('#"
						+ id
						+ "').bootstrapTable().on('uncheck-all.bs.table', function(event) {\n"
						+ "        " + event.getValue() + "\n" + "    });\n");
			} else if (name.equals("load-success.bs.table")){
				buffer.append("    $('#"
						+ id
						+ "').bootstrapTable().on('load-success.bs.table', function(event) {\n"
						+ "        " + event.getValue() + "\n" + "    });\n");
			}
			buffer.append("\n\n");
		}
		return buffer.toString();
	}
}
