package com.zte.mao.common.controller.response;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.zte.mao.common.response.CommonResponse;
import org.apache.log4j.Logger;

@Service
public class SigninStatusResponse extends AbstractOssResponse {
	private static Logger logger = Logger.getLogger(SigninStatusResponse.class.getName());

	@SuppressWarnings("rawtypes")
	@Override
	public Object onResponse(Map data) throws Exception {
		Object obj = null;
		String message = "success";
		byte status = CommonResponse.STATUS_SUCCESS;
		try {
			obj = tokenManager.signinStatus(data.get("token").toString());
		} catch (Exception e) {
			logger.error(e.getMessage());
			message = e.getMessage();
			status = CommonResponse.STATUS_FAIL;
		}
		return getResponse(message, status, obj);
	}

	@Override
	public CommonResponse getResponse(String message, byte status, Object obj) {
		return new EntityResponse(status, message, obj);
	}

}
