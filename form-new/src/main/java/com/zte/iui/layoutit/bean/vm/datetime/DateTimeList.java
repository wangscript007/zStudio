package com.zte.iui.layoutit.bean.vm.datetime;

import java.util.ArrayList;
import java.util.List;

public class DateTimeList {

	private List<DateTime> datetimes = new ArrayList<DateTime>();

	public DateTimeList(List<DateTime> datetimes) {
		this.datetimes = datetimes;
	}

	public DateTimeList(String list) {
		for (String item : list.split("@")) {
			datetimes.add(new DateTime(item));
		}
	}

	public List<DateTime> getDatetimes() {
		return datetimes;
	}

	public void setDatetimes(List<DateTime> datetimes) {
		this.datetimes = datetimes;
	}

	public String getDateTimeJs() {
		if (this.datetimes.size() > 0) {
			StringBuffer buffer = new StringBuffer(1024);
			for (DateTime datetime : datetimes) {
				buffer.append("$('#").append(datetime.getId()).append("')")
						.append(".data('DateTimePicker').format('")
						.append(datetime.getFormat()).append("');\n");
			}
			return buffer.toString();
		} else {
			return "";
		}
	}

}
