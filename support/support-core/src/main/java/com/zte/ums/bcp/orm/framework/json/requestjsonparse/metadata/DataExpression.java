package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

import java.io.Serializable;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.UpdateCondition;

@SuppressWarnings("serial")
public class DataExpression implements Serializable {
	private String field;
	private String value;
	/**
	 * 
	 * @return 字段名
	 */
	public String getField() {
		return field;
	}
	public void setField(String field) {
		this.field = field;
	}
	/**
	 * 
	 * @return 字段值
	 */
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	
	/**
	 * @return {field:字段,value:值}
	 */
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("{field:"+field+",value:"+value+"}");
		return sb.toString();
	}
	
	@Override
	public boolean equals(Object obj) {
		if(this == obj)
			return true;
		if(obj==null)
			return false;
		if(this.getClass()!=obj.getClass())
			return false;
		DataExpression other = (DataExpression) obj;
		if(!other.field.equals(other.field))
			return false;
		if(!other.value.equals(other.value))
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + field.hashCode();
		result = result * prime + value.hashCode();
		return result;
	}
}
