package com.zte.ums.bcp.orm.framework.interceptor;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class CharsetTransformInterceptor extends HandlerInterceptorAdapter {
	
	
	private String container_encoding;
	private String encoding;
	private List<String> methods;

	public CharsetTransformInterceptor() {
		super();
		this.container_encoding = "ISO-8859-1";
		this.encoding = "UTF-8";
		methods = new ArrayList<String>();
		methods.add("GET");
	}
	
	public CharsetTransformInterceptor(String container_encoding,
			String encoding) {
		super();
		this.container_encoding = container_encoding;
		this.encoding = encoding;
	}
	
	public CharsetTransformInterceptor(String container_encoding,
			String encoding, List<String> methods) {
		super();
		this.container_encoding = container_encoding;
		this.encoding = encoding;
		this.methods = methods;
	}

	@Override
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		for (String method: methods) {
			charsetTransform(request, method);
		}
		return true;
	}

	private void charsetTransform(HttpServletRequest request, String method) {
		if (request.getMethod().equalsIgnoreCase(method)) {

			for (Enumeration<String> parameterNames = request
					.getParameterNames(); parameterNames.hasMoreElements();) {

				String thisName = parameterNames.nextElement();
				String thisValue = request.getParameter(thisName);
				if (null != thisValue && !"".equals(thisValue)) {
					try {
						thisValue = new String(
								thisValue.getBytes(container_encoding),
								encoding);
					} catch (UnsupportedEncodingException e) {
						
					}
				}
				request.setAttribute(thisName, thisValue);
			}
		}
	}
}