package com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;

@SuppressWarnings("serial")
public class ComparableAssignedField extends AssignedField {

    private String comparison;
    
    /**
     * 
     * @return 操作符 > < =
     */
    public String getComparison() {
        return comparison;
    }
    public void setComparison(String comparison) {
        this.comparison = comparison;
    }
    
    /**
     * @return {comparison:操作符,field:字段,value:值}
     */
    public String toString(){
    	StringBuffer sb = new StringBuffer();
    	sb.append("{comparison:");
		sb.append(comparison);
		sb.append(",");
		sb.append(super.toString());
		sb.append("}");
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
		ComparableAssignedField other = (ComparableAssignedField) obj;
		if(!other.comparison.equals(other.comparison))
			return false;
		return true;
	}
    
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + super.hashCode();
		result = result * prime + comparison.hashCode();
		return result;
	}
}
