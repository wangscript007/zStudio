package com.zte.iui.layoutit.bean.vm.datetime;

import java.net.URLDecoder;

import com.zte.iui.layoutit.common.CommonUtility;

public class DateTime {

	private String id;
	private String format;

	@SuppressWarnings("deprecation")
	public DateTime(String datetime) {
		for (String item : datetime.split(",")) {
			if (item.indexOf("id") > -1) {
				this.id = CommonUtility.getParamValue(item, "id");
			}
			if (item.indexOf("format") > -1) {
				this.format = URLDecoder.decode(CommonUtility.getParamValue(
						item, "format"));
			}

		}
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFormat() {
		return format;
	}

	public void setFormat(String format) {
		this.format = format;
	}

}
