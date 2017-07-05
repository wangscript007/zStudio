package com.zte.ums.bcp.orm.framework.response.entry;


@SuppressWarnings("serial")
public class QueryTableNamesResponseInfo extends ResponseInfo {
	private String tablenames;

	public QueryTableNamesResponseInfo() {
		// TODO Auto-generated constructor stub
	}

	public QueryTableNamesResponseInfo(int status, String message, String tablenames) {
		super(status, message);
		this.tablenames = tablenames;
	}

	public String getTablenames() {
		return tablenames;
	}

	public void setTablenames(String tablenames) {
		this.tablenames = tablenames;
	}
}
