package com.zte.iui.layoutit.bean;

/**
 * 界面绑定字段
 * 
 * @author dw
 * 
 */
public class Field {
	private String id; // 字段id
	private String type; // avalon定义时需要使用
	private String defaultValue;
	private String componentType;//组件类型
	private String parentType;

	public Field(String id, String type, String defaultValue,String componentType,String parentType) {
		this.id = id;
		this.type = type;
		this.defaultValue = defaultValue;
		this.componentType = componentType;
		this.parentType = parentType;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}

	/**
	 * @return the componentType
	 */
	public String getComponentType() {
		return componentType;
	}

	/**
	 * @param componentType the componentType to set
	 */
	public void setComponentType(String componentType) {
		this.componentType = componentType;
	}

	public String getParentType() {
		return parentType;
	}

	public void setParentType(String parentType) {
		this.parentType = parentType;
	}
	
}
