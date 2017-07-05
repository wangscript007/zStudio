package com.zte.iui.layoutit.bean.vm.event;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.zte.iui.layoutit.common.CommonUtility;

public abstract class AbstractEvent implements IEvent {

	protected String type;
	protected String id;
	protected List<Event> events = new ArrayList<Event>();

	@SuppressWarnings({ "rawtypes" })
	public AbstractEvent(Map map) {
		type = map.get("type").toString();
		id = map.get("id").toString();

		List es = (List) map.get("events");
		for (Object item : es) {
			int index = item.toString().indexOf(",");
			events.add(new Event(CommonUtility.getParamValue(item.toString()
					.substring(0, index), "name"), item.toString()
					.substring(index + 1).substring("value=".length())));
		}
	}

	/**
	 * 事件对象，包含事件名和事件内容，内容中不包含函数名
	 * 
	 * @author dw
	 * 
	 */
	class Event {
		private String name;
		private String value;

		public Event(String name, String value) {
			this.name = name;
			this.value = value;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getValue() {
			return value;
		}

		public void setValue(String value) {
			this.value = value;
		}
	}
}
