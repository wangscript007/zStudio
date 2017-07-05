package com.zte.iui.layoutit.bean.vm.valid;

import java.util.ArrayList;
import java.util.List;

public class OrganizeValid {

	private List<IValid> validComponents = new ArrayList<IValid>();

	private String vmid = null;

	public OrganizeValid(String valids, String vmid) throws Exception {
		this.vmid = vmid;
		for (String item : valids.split("@")) {
			validComponents.add(new ComponentValid(item));
		}
	}

	public String getValidJs() {
		if (validComponents.size() == 0) {
			return "";
		}
		StringBuffer buffer = new StringBuffer(1024);
		// 遍历验证组件获取各组件验证js

		buffer.append("    $('#").append(vmid)
				.append("').bootstrapValidator({\n");

		buffer.append("        fields:{\n");

		for (IValid valid : validComponents) {
			buffer.append(valid.generatorEventJSCode()).append(",\n");
		}

		if (buffer.toString().trim().endsWith(",")) {
			buffer.deleteCharAt(buffer.lastIndexOf(","));
		}

		buffer.append("        }\n");
		buffer.append("    });\n");
		return buffer.toString();
	}

}
