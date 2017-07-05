package com.zte.iui.layoutit.bean.vm.valid;

public class Valid {
	private String componentName = null;
	private String empty = "false";
	private String lenRange = "";
	private String validType = "";
	private String validContent = "";

	public String getValidType() {
		return validType;
	}

	public void setValidType(String validType) {
		this.validType = validType;
	}

	public String getValidContent() {
		return validContent;
	}

	public void setValidContent(String validContent) {
		this.validContent = validContent;
	}

	public String getEmpty() {
		return empty;
	}

	public void setEmpty(String notEmpty) {
		this.empty = notEmpty;
	}

	public String getLenRange() {
		return lenRange;
	}

	public void setLenRange(String lenRange) {
		this.lenRange = lenRange;
	}

	public String getComponentName() {
		return componentName;
	}

	public void setComponentName(String componentName) {
		this.componentName = componentName;
	}

}
