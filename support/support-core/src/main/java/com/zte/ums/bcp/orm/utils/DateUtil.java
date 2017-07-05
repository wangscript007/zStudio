package com.zte.ums.bcp.orm.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
	
	public static final String YYYY_MM_DD_HH_mm_SS = "yyyy-MM-dd HH:mm:ss";
	
	public static String dateToString(Date date, String pattern) {
		return new SimpleDateFormat(pattern).format(date); 
	}

}
