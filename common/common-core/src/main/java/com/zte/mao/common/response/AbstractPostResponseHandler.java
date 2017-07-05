package com.zte.mao.common.response;

import java.util.Map;

import org.apache.log4j.Logger;

public abstract class AbstractPostResponseHandler {
	private static Logger logger = Logger.getLogger(AbstractPostResponseHandler.class.getName());
	
	@SuppressWarnings("rawtypes")
	public abstract Object onResponse(Map data) throws Exception;
	
	public abstract CommonResponse getResponse(String message, byte status, Object obj);
	
	@SuppressWarnings("rawtypes")
	public CommonResponse controllerPostResponse(Map data) {
		Object obj = null;
		String message = "success";
		byte status = CommonResponse.STATUS_SUCCESS;
		try {
			obj = onResponse(data);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			message = e.getMessage();
			status = CommonResponse.STATUS_FAIL;
		}
		return getResponse(message, status, obj);
	}
}
