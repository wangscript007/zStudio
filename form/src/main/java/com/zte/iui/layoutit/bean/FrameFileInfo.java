package com.zte.iui.layoutit.bean;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class FrameFileInfo {
	private int total = 0;
	private List<FileInfo> rows = new ArrayList<FileInfo>();

	public int getTotal() {
		return total;
	}

	public void setTotal(int total) {
		this.total = total;
	}

	public List<FileInfo> getRows() {
		return rows;
	}

	public void addRows(FileInfo info) {
		rows.add(info);
	}

}
