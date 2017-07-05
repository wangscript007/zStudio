package com.zte.ums.bcp.orm.framework.sql.util;

import org.apache.commons.lang3.StringUtils;

public class SpecialHandlingUtil {
	public static String handlingValueWithSingleQuotes(String str) {
		if (StringUtils.isNotBlank(str)
				&& str.contains("'")) {
			str = str.replaceAll("'", "''");
		}
		return str;
	}
}
