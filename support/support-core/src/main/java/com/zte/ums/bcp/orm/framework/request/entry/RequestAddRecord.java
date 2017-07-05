package com.zte.ums.bcp.orm.framework.request.entry;

import java.io.Serializable;
import java.util.List;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.AddRecordCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.DataExpression;

@SuppressWarnings("serial")
public class RequestAddRecord implements Serializable {
	private String tableName;
	private String databaseName;
	private List<AddRecordCondition> addRecordConditions;
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
	 * @return 增加数据内容
	 */
	public List<AddRecordCondition> getAddRecordConditions() {
		return addRecordConditions;
	}
	public void setAddRecordConditions(List<AddRecordCondition> addRecordConditions) {
		this.addRecordConditions = addRecordConditions;
	}
	
	/**
	 * @return {tableName:表名,databaseName:数据库名,addRecordConditions:[{dataExpressions:[{field:字段,value:值},{field:字段,value:值},...]},{dataExpressions:[...]},...]}
	 */
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("{tableName:" + tableName);
		sb.append(",databaseName:" + databaseName);
		sb.append(",addRecordConditions:[");
		if(addRecordConditions!=null){
			for(int i = 0;i < addRecordConditions.size();i++){
				sb.append(addRecordConditions.get(i).toString());
				if(i < addRecordConditions.size()-1){
					sb.append(",");
				}else{
					sb.append("]");
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
		RequestAddRecord other = (RequestAddRecord) obj;
		if(!other.tableName.equals(tableName))
			return false;
		if(!other.databaseName.equals(databaseName))
			return false;
		for(int i=0;i < addRecordConditions.size();i++){
			if(!other.addRecordConditions.get(i).equals(addRecordConditions.get(i)))
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
		for(int i=0;i < addRecordConditions.size();i++){
			result = result * prime + addRecordConditions.get(i).hashCode();
		}
		return result;
	}
}
