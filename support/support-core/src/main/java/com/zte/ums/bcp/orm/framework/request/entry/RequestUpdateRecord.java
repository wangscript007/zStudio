package com.zte.ums.bcp.orm.framework.request.entry;

import java.io.Serializable;
import java.util.List;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.UpdateCondition;

@SuppressWarnings("serial")
public class RequestUpdateRecord implements Serializable {
	private String tableName;
	private String databaseName;
	private List<UpdateCondition> updateConditions;
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
	 * 
	 * @return 更新内容及条件
	 */
	public List<UpdateCondition> getUpdateConditions() {
		return updateConditions;
	}
	public void setUpdateConditions(List<UpdateCondition> updateConditions) {
		this.updateConditions = updateConditions;
	}
	
	/**
	 * @return {tableName:表名,databaseName:数据库名,updateConditions:[{dataExpressions:[{field:字段,value:值},..],whereCondition:{logic:逻辑and、or,comparableAssignedFields:[{comparison:操作符,field:字段,value:[{值},..]}],whereConditions:[{logic:,comparableAssignedFields:[],...},...]}},...]}
	 */
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("{tableName:" + tableName);
		sb.append(",databaseName:" + databaseName);
		sb.append(",updateConditions:");
		sb.append("[");
		if(updateConditions!=null){
			for(int j = 0;j < updateConditions.size();j++){
				sb.append(updateConditions.get(j).toString());
				if(j < updateConditions.size()-1){
					sb.append(",");
				}
			}
		}
		sb.append("]}");
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
		RequestUpdateRecord other = (RequestUpdateRecord) obj;
		if(!other.tableName.equals(tableName))
			return false;
		if(!other.databaseName.equals(databaseName))
			return false;
		for(int i=0;i < updateConditions.size();i++){
			if(!other.updateConditions.get(i).equals(updateConditions.get(i)))
				return false;
		}
		return true;
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + tableName.hashCode();
		result = result * prime + databaseName.hashCode();
		for(int i=0;i < updateConditions.size();i++){
			result = result * prime + updateConditions.get(i).hashCode();
		}
		return result;
	}
}
