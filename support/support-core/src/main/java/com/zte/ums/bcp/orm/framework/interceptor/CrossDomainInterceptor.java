package com.zte.ums.bcp.orm.framework.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class CrossDomainInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		response.setHeader("Access-Control-Allow-Origin", "*");  
		response.setHeader("Access-Control-Allow-Headers", "User-Agent,Origin,Cache-Control,Content-type,Date,Server,withCredentials,AccessToken");  
		response.setHeader("Access-Control-Allow-Credentials", "true");  
		response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");  
		response.setHeader("Access-Control-Max-Age", "1209600");  
		response.setHeader("Access-Control-Expose-Headers","accesstoken");  
		response.setHeader("Access-Control-Request-Headers","accesstoken");  
		response.setHeader("Expires","-1");
		response.setHeader("Cache-Control","no-cache");  
		response.setHeader("pragma","no-cache");  
		
		return true;
	}

}
