package com.zte.mao.common.shema;

public class SchemaTablesBean {

	private String global;
	public String getGlobal() {
		return global;
	}
	
	public String[] getGlobals() {
		return global.split(",");
	}
	
	public void setGlobal(String global) {
		this.global = global;
	}
}
