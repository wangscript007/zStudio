package com.zte.iui.layoutit.common;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import com.google.gson.Gson;

/**
 * http参数解析
 * 
 * @author dw
 * 
 */
public class AnalyzeParameter {
	private String content = null;
	private Map<String, List<String>> parameterMap = new ConcurrentHashMap<String, List<String>>();

	/**
	 * json格式的字符串
	 * 
	 * @param content
	 * @throws Exception
	 */
	public AnalyzeParameter(String content) throws Exception {
		this.content = content;
		analyze();
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void analyze() throws Exception {
		if (content.equals("")) {
			return;
		}
		Gson gson = new Gson();
		Map map = gson.fromJson(content, Map.class);
		Set<String> keySet = map.keySet();
		for (String key : keySet) {
			List<String> list = parameterMap.get(key);

			if (list == null) {
				list = new CopyOnWriteArrayList<String>();
				parameterMap.put(key, list);
			}
			Object o = map.get(key);
			if (o instanceof String) {
				list.add(o.toString());
			} else if (o instanceof List) {
				list.addAll((List) o);
			}
		}
	}

	/**
	 * 获取参数内容，返回字符串，适合传入值为字符串的情况
	 * 
	 * @param name
	 * @return
	 */
	public String getValue(String name) {
		List<String> list = parameterMap.get(name);
		if (list == null || list.size() == 0) {
			return "";
		}
		return list.get(0);
	}

	/**
	 * 获取参数内容数组，返回字符串数组，适合传入值为数组的情况
	 * 
	 * @param name
	 * @return
	 */
	public String[] getValues(String name) {
		List<String> list = parameterMap.get(name);
		if (list == null || list.size() == 0) {
			return new String[0];
		}
		return list.toArray(new String[0]);
	}
}
