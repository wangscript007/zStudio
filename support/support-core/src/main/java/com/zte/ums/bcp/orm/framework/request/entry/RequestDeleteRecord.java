package com.zte.ums.bcp.orm.framework.request.entry;

import java.io.Serializable;
import java.util.List;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;

@SuppressWarnings("serial")
public class RequestDeleteRecord implements Serializable {
    private String tableName;
    private String databaseName;
    private WhereCondition whereCondition;
    /**
     * 
     * @return 删除条件
     */
    public WhereCondition getWhereCondition() {
        return whereCondition;
    }
    public void setWhereCondition(WhereCondition whereCondition) {
        this.whereCondition = whereCondition;
    }
    /**
     * 
     * @return 表名
     */
    public String getTableName() {
        return tableName;
    }
    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
    /**
     * 
     * @return 数据库名
     */
    public String getDatabaseName() {
        return databaseName;
    }
    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }
    
	/**
	 * @return {tableName:表名,databaseName:数据库名,whereCondition:{logic:逻辑and、or,comparableAssignedFields:[{comparison:操作符,field:字段,value:[{值},..]},...],whereConditions:[{logic:,comparableAssignedFields:[],...},...]}}
	 */
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("{tableName:" + tableName);
		sb.append(",databaseName:" + databaseName);
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
		RequestDeleteRecord other = (RequestDeleteRecord) obj;
		if(!other.tableName.equals(tableName))
			return false;
		if(!other.databaseName.equals(databaseName))
			return false;
		if(!other.whereCondition.equals(whereCondition))
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + tableName.hashCode();
		result = result * prime + databaseName.hashCode();
		result = result * prime + whereCondition.hashCode();
		return result;
	}
	

}
