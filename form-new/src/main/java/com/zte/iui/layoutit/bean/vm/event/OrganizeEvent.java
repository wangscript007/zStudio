package com.zte.iui.layoutit.bean.vm.event;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;

/**
 * 事件代码生成，包含一个vm中所有
 * 
 * @author dw
 */
public class OrganizeEvent {

	private List<IEvent> eventComponents = new ArrayList<IEvent>();

	@SuppressWarnings("rawtypes")
	public OrganizeEvent(String event) throws Exception {
		String[] events = event.split("@");
		for (String item : events) {
			String jsonItem = URLDecoder.decode(item, "UTF-8");
			Gson gson = new Gson();

			Map map = gson.fromJson(jsonItem, Map.class);
			if (map == null || map.get("type") == null
					|| map.get("type").toString().trim().equals("")) {
				return;
			}
			if (map.get("type").equals("table_base")) {
				eventComponents.add(new TableEvent(map));
			} else if (map.get("type").equals("input_datetime")) {
				eventComponents.add(new DateTimeEvent(map));
			} else if (map.get("type").equals("tree")) {
				eventComponents.add(new TreeEvent(map));
			} else if (isBaseComponent(map.get("type"))) {
				eventComponents.add(new BaseComponentEvent(map));
			}
		}
	}

	public String getEventJs() {
		if (eventComponents.size() == 0) {
			return "";
		}
		StringBuffer buffer = new StringBuffer();
		for (IEvent event : eventComponents) {
			buffer.append(event.generatorEventJSCode());
		}
		return buffer.toString();
	}

	private boolean isBaseComponent(Object type) {
		String baseComponents = "input_text,textarea,select_static,select_dynamic,input_radio,input_fileinput,button,chinese_region,separator,toolbar-button";
		if (baseComponents.indexOf(type.toString()) > -1) {
			return true;
		}
		return false;
	}
}
