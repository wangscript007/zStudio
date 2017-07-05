package com.zte.ums.bcp.orm.framework.request.entry;

import java.io.Serializable;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.QueryCondition;

@SuppressWarnings("serial")
public class RequestQueryRecord implements Serializable {

	private QueryCondition queryCondition;
	private int limit;
	private int offset;
	private String tableName;
	private String databaseName;

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
	 * @return 查询条件
	 */
	public QueryCondition getQueryCondition() {
		return queryCondition;
	}
	public void setQueryCondition(QueryCondition queryCondition) {
		this.queryCondition = queryCondition;
	}
	/**
	 * 
	 * @return 每页条数
	 */
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	/**
	 * 
	 * @return 当前页
	 */
	public int getOffset() {
		return offset;
	}
	public void setOffset(int offset) {
		this.offset = offset;
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
	 * @return {tableName:表名,databaseName:数据库名,limit:每页值,offset:页数,queryCondition:{isDistinct:,fields:[{name:名称,tablename:表名,databasename:数据库名}],orders:[{order:,field:{name:名称,tablename:表名,databasename:数据库名}},...],whereCondition:{logic:逻辑and、or,comparableAssignedFields:[{comparison:操作符,field:字段,value:[{值},..]},...],whereConditions:[{logic:,comparableAssignedFields:[],...},...]}}
	 */
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("{tableName:" + tableName);
		sb.append(",databaseName:" + databaseName);
		sb.append(",limit:" + limit);
		sb.append(",offset:" + offset);
		sb.append(",queryCondition:");
		if(queryCondition!=null){
			sb.append(queryCondition.toString());
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
		RequestQueryRecord other = (RequestQueryRecord) obj;
		if(!other.tableName.equals(tableName))
			return false;
		if(!other.databaseName.equals(databaseName))
			return false;
		if(other.limit!=limit)
			return false;
		if(other.offset!=offset)
			return false;
		if(!other.queryCondition.equals(queryCondition))
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + tableName.hashCode();
		result = result * prime + databaseName.hashCode();
		result = result * prime + limit;
		result = result * prime + offset;
		result = result * prime + queryCondition.hashCode();
		return result;
	}
}
