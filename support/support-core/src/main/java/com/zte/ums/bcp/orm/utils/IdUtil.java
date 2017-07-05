package com.zte.ums.bcp.orm.utils;

import java.util.UUID;

public class IdUtil {
	
	public static String getUUid() {
		return UUID.randomUUID().toString().replaceAll("-", "");
	}

}
