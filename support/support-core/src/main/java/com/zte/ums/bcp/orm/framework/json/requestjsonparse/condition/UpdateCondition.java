package com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition;

import java.io.Serializable;
import java.util.List;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;

@SuppressWarnings("serial")
public class UpdateCondition implements Serializable {
    
    private List<DataExpression> dataExpressions;
    private WhereCondition whereCondition;
    /**
     * 
     * @return 更新条件
     */
    public WhereCondition getWhereCondition() {
        return whereCondition;
    }
    public void setWhereCondition(WhereCondition whereCondition) {
        this.whereCondition = whereCondition;
    }
    /**
     * 
     * @return 更新内容
     */
    public List<DataExpression> getDataExpressions() {
        return dataExpressions;
    }
    public void setDataExpressions(List<DataExpression> dataExpressions) {
        this.dataExpressions = dataExpressions;
    }
    
    /**
     * @return {dataExpressions:[{field:字段,value:值},..],whereCondition:{logic:逻辑and、or,comparableAssignedFields:[{comparison:操作符,field:字段,value:值}],whereConditions:[{logic:,comparableAssignedFields:[],...},...]}}
     */
    public String toString(){
    	StringBuffer sb = new StringBuffer();
		sb.append("{dataExpressions:");
		sb.append("[");
		if(dataExpressions!=null){
			for(int j = 0;j < dataExpressions.size();j++){
				if(j < dataExpressions.size()-1){
					sb.append(dataExpressions.get(j).toString()+",");
				}else{
					sb.append(dataExpressions.get(j).toString());
				}
			}
		}
		sb.append("]");
		sb.append(",whereCondition:");
		if(whereCondition!=null){
			sb.append(whereCondition.toString());
		}
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
		UpdateCondition other = (UpdateCondition) obj;
		for(int i=0;i < dataExpressions.size();i++){
			if(!other.dataExpressions.get(i).equals(dataExpressions.get(i)))
				return false;
		}
		if(!other.whereCondition.equals(other.whereCondition))
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + whereCondition.hashCode();
		for(int i=0;i < dataExpressions.size();i++){
			result = result * prime + dataExpressions.get(i).hashCode();
		}
		return result;
	}
}
