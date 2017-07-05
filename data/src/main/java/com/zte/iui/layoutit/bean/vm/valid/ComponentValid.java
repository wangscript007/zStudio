package com.zte.iui.layoutit.bean.vm.valid;

import java.net.URLDecoder;

import com.zte.iui.layoutit.common.CommonUtility;

public class ComponentValid implements IValid {
	private Valid valid = new Valid();

	public ComponentValid(String valid) throws Exception {
		for (String item : valid.split(",")) {
			if (item.indexOf("name") > -1) {
				this.valid.setComponentName(CommonUtility.getParamValue(item,
						"name"));
			}
			if (item.indexOf("vnotempty") > -1) {
				this.valid.setEmpty(CommonUtility.getParamValue(item,
						"vnotempty"));
			}
			if (item.indexOf("vstringlength") > -1) {
				this.valid.setLenRange(URLDecoder.decode(
						CommonUtility.getParamValue(item, "vstringlength"),
						"UTF-8"));
			}
			if (item.indexOf("vtype") > -1) {
				this.valid.setValidType(item.substring("vtype=".length()));
			}
			if (item.indexOf("vcontent") > -1) {
				this.valid.setValidContent(URLDecoder.decode(
						item.substring("vcontent=".length()), "UTF-8"));
			}
		}
	}

	@Override
	public String generatorEventJSCode() {
		StringBuffer buffer = new StringBuffer();
		buffer.append("            " + valid.getComponentName()).append(":{\n")
				.append("                validators: {\n");

		//界面上的显示为“是否为空”，在false时需要加入验证信息
		if (valid.getEmpty().equals("false")) {
			buffer.append("                    " + "notEmpty: {},\n");
		}

		if (valid.getLenRange().contains(",")) {
			String len[] = valid.getLenRange().split(",");
			buffer.append("                    " + "stringLength: {min: ")
					.append(len[0]).append(",max: ").append(len[1])
					.append("},\n");
		}

		if (!"".equals(valid.getValidContent().trim())) {
			buffer.append("                    " + valid.getValidContent())
					.append("\n");
		}

		if (buffer.toString().trim().endsWith(",")) {
			buffer.deleteCharAt(buffer.lastIndexOf(","));
		}

		buffer.append("                }\n").append("            }   ");
		return buffer.toString();
	}
}
