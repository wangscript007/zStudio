package com.zte.iui.layoutit.common;

public class StringUtils {

	public static String toInt(String str, String defaultValue) {
		if (str == null) {
			return defaultValue;
		}
		try {
			return String.valueOf(Integer.parseInt(str));
		} catch (NumberFormatException nfe) {
			return defaultValue;
		}
	}

	public static String toDouble(String str, String defaultValue) {
		if (str == null) {
			return defaultValue;
		}
		try {
			return String.valueOf(Double.parseDouble(str));
		} catch (NumberFormatException nfe) {
			return defaultValue;
		}
	}
}
