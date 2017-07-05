package com.zte.iui.layoutit.bean.vm.event;

import java.util.Map;

public class TreeEvent extends AbstractEvent {

	@SuppressWarnings("rawtypes")
	public TreeEvent(Map map) {
		super(map);
	}

	@Override
	public String generatorEventJSCode() {
		StringBuffer buffer = new StringBuffer();
		buffer.append("\n    //初始化树型组件：\n");
		buffer.append("    var " + id + " = new zTree(\"" + id + "\");\n");
		for (Event event : events) {

			String name = event.getName();
			if (name.equals("onClick")) {
				buffer.append("    "
						+ id
						+ ".callback.onClick = function(event,treeId,treeNode) {\n"
						+ "        " + event.getValue() + "\n" + "    };\n");
			} else if (name.equals("onDblClick")) {
				buffer.append("    "
						+ id
						+ ".callback.onDblClick = function(event,treeId,treeNode) {\n"
						+ "        " + event.getValue() + "\n" + "    };\n");
			} else if (name.equals("onMouseDown")) {
				buffer.append("    "
						+ id
						+ ".callback.onMouseDown = function(event,treeId,treeNode) {\n"
						+ "        " + event.getValue() + "\n" + "    };\n");
			} else if (name.equals("onRemove")) {
				buffer.append("    "
						+ id
						+ ".callback.onRemove = function(event,treeId,treeNode) {\n"
						+ "        " + event.getValue() + "\n" + "    };\n");
			} else if (name.equals("beforeClick")) {
				buffer.append("    "
						+ id
						+ ".callback.beforeClick = function(event,treeId,clickFlag) {\n"
						+ "        " + event.getValue() + "\n" + "    };\n");
			} else if (name.equals("beforeNodesBind")) {
				buffer.append("    "
						+ id
						+ ".callback.beforeNodesBind = function(node) {\n"
						+ "        " + event.getValue() + "\n" + "    };\n");
			}
		}

		buffer.append("    " + id + ".refreshTreeEvent(\"" + id + "\"," + id
				+ ".callback);\n\n");
		return buffer.toString();
	}
}
