package com.zte.ums.bcp.orm.framework.response.entry;

import java.util.LinkedHashMap;
import java.util.List;

@SuppressWarnings("serial")
public class QueryTableFieldResponseInfo extends ResponseInfo {
	private List<LinkedHashMap<String, Object>> fieldInfos;

	public QueryTableFieldResponseInfo() {
		// TODO Auto-generated constructor stub
	}

	public QueryTableFieldResponseInfo(int status, String message, List<LinkedHashMap<String, Object>> fieldInfos) {
		super(status, message);
		this.fieldInfos = fieldInfos;
	}

	public List<LinkedHashMap<String, Object>> getFieldInfos() {
		return fieldInfos;
	}

	public void setFieldInfos(List<LinkedHashMap<String, Object>> fieldInfos) {
		this.fieldInfos = fieldInfos;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result
				+ ((fieldInfos == null) ? 0 : fieldInfos.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		QueryTableFieldResponseInfo other = (QueryTableFieldResponseInfo) obj;
		if (fieldInfos == null) {
			if (other.fieldInfos != null)
				return false;
		} else if (!fieldInfos.equals(other.fieldInfos))
			return false;
		return true;
	}
	
	
}
