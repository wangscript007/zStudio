package com.zte.iui.layoutit.bean.component;

public class ModalDialog implements Component {

	private String id;

	private String footerBtnId;

	private String footerBtnEvent;

	public ModalDialog() {
		// TODO Auto-generated constructor stub
	}

	public ModalDialog(String footerBtnId, String footerBtnEvent) {
		this.footerBtnId = footerBtnId;
		this.footerBtnEvent = footerBtnEvent;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getFooterBtnId() {
		return footerBtnId;
	}

	public void setFooterBtnId(String footerBtnId) {
		this.footerBtnId = footerBtnId;
	}

	public String getFooterBtnEvent() {
		return footerBtnEvent;
	}

	public void setFooterBtnEvent(String footerBtnEvent) {
		this.footerBtnEvent = footerBtnEvent;
	}

	@Override
	public String getJsCode() {
		if (getFooterBtnId().equalsIgnoreCase("undefined")) {
			return "";
		}
		StringBuffer buffer = new StringBuffer(1000);
		buffer.append("  $('#").append(this.footerBtnId)
				.append("').click(function(){\n").append(this.footerBtnEvent)
				.append("\n  });\n");
		return buffer.toString();
	}

}
