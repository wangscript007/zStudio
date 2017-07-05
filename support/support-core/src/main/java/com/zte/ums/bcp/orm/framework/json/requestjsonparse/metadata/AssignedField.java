package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

import java.io.Serializable;
import java.util.List;

@SuppressWarnings("serial")
public class AssignedField implements Serializable {
	private Field field;
	private List<String> value;
	/**
	 * 
	 * @return 字段值
	 */
	public List<String> getValue() {
        return value;
    }
    public void setValue(List<String> value) {
        this.value = value;
    }
    /**
     * 
     * @return 字段名
     */
    public Field getField() {
		return field;
	}
	public void setField(Field field) {
		this.field = field;
	}
	
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("field:");
		sb.append(field);
		sb.append(",value:[");
		for(int i=0;i < value.size();i++){
			sb.append("{");
			sb.append(value.get(i).toString());
			sb.append("}");
			if(i < value.size()-1)
				sb.append(",");
		}
		sb.append("]");
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
		if(!super.equals(obj))
			return false;
		AssignedField other = (AssignedField) obj;
		if(!other.field.equals(other.field))
			return false;
		for(int i=0;i < value.size();i++){
			if(!other.value.equals(value))
				return false;
		}
		return true;
	}
    
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + field.hashCode();
		for(int i=0;i < value.size();i++){
			result = result * prime + value.get(i).hashCode();
		}
		return result;
	}
}
