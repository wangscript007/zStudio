package com.zte.mao.common.controller.response;

import javax.annotation.Resource;

import com.zte.mao.common.response.AbstractPostResponseHandler;
import com.zte.mao.common.service.LoginService;
import com.zte.mao.common.service.TokenService;

public abstract class AbstractOssResponse extends AbstractPostResponseHandler {
	@Resource
	protected LoginService loginManager;
	@Resource
	protected TokenService tokenManager;
	
	protected String getObjectContent(Object obj) {
		if(obj == null) {
			return "";
		}
		return obj.toString();
	}
	
	
		
}
