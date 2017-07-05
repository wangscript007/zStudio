package com.zte.mao.common.http;

import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

public class ExtensibleHttpServletRequest extends HttpServletRequestWrapper {

	public static final String PARAM_NAME_DATABASE = "database";

	private String databaseAttribute = "";

	public ExtensibleHttpServletRequest(HttpServletRequest request) {
		super(request);
		Object attribute = super.getAttribute(PARAM_NAME_DATABASE);
		if (attribute != null) {
			databaseAttribute = attribute.toString();
		}
	}

	@Override
	public String getParameter(String name) {
		String value = super.getParameter(name);
		if (value == null && PARAM_NAME_DATABASE.equals(name)) {
			value = databaseAttribute;
		}
		return value;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public Map getParameterMap() {
		Map<String, String[]> map = super.getParameterMap();
		if (!map.containsKey(PARAM_NAME_DATABASE)) {
			map = new HashMap<String, String[]>(map);
			map.put(PARAM_NAME_DATABASE, new String[] {databaseAttribute});
		}
		return map;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public Enumeration getParameterNames() {
		if (super.getParameter(PARAM_NAME_DATABASE) == null) {
			return Collections.enumeration(getParameterMap().keySet());
		} else {
			return super.getParameterNames();
		}
	}

	@Override
	public String[] getParameterValues(String name) {
		String[] values = super.getParameterValues(name);
		if (values == null && PARAM_NAME_DATABASE.equals(name)) {
			values = new String[] { databaseAttribute };
		}
		return values;
	}

}
