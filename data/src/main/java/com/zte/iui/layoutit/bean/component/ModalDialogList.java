package com.zte.iui.layoutit.bean.component;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;

public class ModalDialogList {

	private String[] params;

	public ModalDialogList(String[] params) {
		this.params = params;
	}

	public String getJsCode() throws UnsupportedEncodingException {
		StringBuffer buffer = new StringBuffer(1024);

		for (int i = 0; i < params.length; i++) {
			String param = URLDecoder.decode(params[i], "utf-8");
			ModalDialog modalDialog = new ModalDialog();
			modalDialog.setId(getParamValue("id", param));
			modalDialog.setFooterBtnId(getParamValue("footer_btn_id", param));
			modalDialog.setFooterBtnEvent(getParamValue("footer_btn_event",
					param));
			buffer.append(modalDialog.getJsCode());
		}
		if (buffer.toString().trim().length() > 0) {
			buffer.insert(0, "$(document).ready(function(){\n").insert(
					buffer.length(), "});\n");
		}
		return buffer.toString();
	}

	private String getParamValue(String field, String params) {
		int fieldIndex = params.indexOf(field + "=");
		if (fieldIndex == -1) {
			return "";
		}
		String filedValue = params.substring(fieldIndex);
		int separatorIndex = filedValue.indexOf("@");
		if (separatorIndex == -1) {
			return filedValue.substring((field + "=").length());
		}
		return filedValue.substring((field + "=").length(), separatorIndex);
	}

}
