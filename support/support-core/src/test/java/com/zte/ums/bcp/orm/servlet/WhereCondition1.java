package com.zte.ums.bcp.orm.servlet;

import java.util.List;

public class WhereCondition1 {
	private String logic;
	private List<KeyValue> keyValues;
	private List<WhereCondition1> whereCondition1s;
	
	public String getLogic() {
		return logic;
	}

	public void setLogic(String logic) {
		this.logic = logic;
	}

	public List<KeyValue> getKeyValues() {
		return keyValues;
	}
	
	public void setKeyValues(List<KeyValue> keyValues) {
		this.keyValues = keyValues;
	}

	public List<WhereCondition1> getWhereCondition1s() {
		return whereCondition1s;
	}

	public void setWhereCondition1s(List<WhereCondition1> whereCondition1s) {
		this.whereCondition1s = whereCondition1s;
	}
	
	
	private String getSql1() {
		
		StringBuilder stringBuilder = new StringBuilder();
		
		for (int i = 0; i < keyValues.size(); i++) {
			
			KeyValue keyValue = keyValues.get(i);
			if (i > 0) {
				if (null != logic && !logic.isEmpty()) {
					stringBuilder.append(logic);
				}
				stringBuilder.append(" ");
			}
			
			stringBuilder.append(keyValue.getKey());
			stringBuilder.append(keyValue.getCompartion());
			stringBuilder.append(keyValue.getValue());
			
			if (i < (keyValues.size() - 1)) {
				stringBuilder.append(" ");
			}
		}
		
		return stringBuilder.toString();
	}
	
	public String getSql() {
		StringBuilder stringBuilder = new StringBuilder();
		stringBuilder.append(this.getSql1());
		if (null != whereCondition1s && !whereCondition1s.isEmpty()) {
			if (null != logic && !logic.isEmpty()) {
				for (int i = 0; i < whereCondition1s.size(); i++) {
					stringBuilder.append(" ");
					stringBuilder.append(logic);
					stringBuilder.append(" ");
					stringBuilder.append("(");
					stringBuilder.append(whereCondition1s.get(i).getSql());
					stringBuilder.append(")");
				}
				
			}
		}
		return stringBuilder.toString();
	}
}
