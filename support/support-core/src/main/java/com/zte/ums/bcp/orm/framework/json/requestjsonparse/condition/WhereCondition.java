package com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition;

import java.io.Serializable;
import java.util.List;

import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.ComparableAssignedField;

@SuppressWarnings("serial")
public class WhereCondition implements Serializable {
	public static final int LOGIC_AND = 1;
	public static final int LOGIC_OR = 2;
	private int logic;
	private List<ComparableAssignedField> comparableAssignedFields;
	private List<WhereCondition> whereConditions;
	
	/**
	 * 
	 * @return and or 逻辑
	 */
	public int getLogic() {
		return logic;
	}

	public void setLogic(int logic) {
		this.logic = logic;
	}

	/**
	 * 
	 * @return 比较方式
	 */
	public List<ComparableAssignedField> getComparableAssignedFields() {
		return comparableAssignedFields;
	}

	public void setComparableAssignedFields(
			List<ComparableAssignedField> comparableAssignedFields) {
		this.comparableAssignedFields = comparableAssignedFields;
	}

	/**
	 * 
	 * @return 嵌套条件
	 */
	public List<WhereCondition> getWhereConditions() {
		return whereConditions;
	}

	public void setWhereConditions(List<WhereCondition> whereConditions) {
		this.whereConditions = whereConditions;
	}
	
	/**
	 *@return {logic:逻辑and、or,comparableAssignedFields:[{comparison:操作符,field:字段,value:[{值},..]},...],whereConditions:[{logic:,comparableAssignedFields:[],...},...]}
	 */
	public String toString(){
		StringBuffer sb = new StringBuffer();
		sb.append("{comparableAssignedFields:[");
		if(comparableAssignedFields!=null){
			for(int i = 0;i < comparableAssignedFields.size();i++){
				sb.append(comparableAssignedFields.get(i).toString());
				if(i<comparableAssignedFields.size()-1){
					sb.append(",");
				}
			}
		}
		sb.append("]");
		sb.append(",whereConditions:[");
		if(whereConditions!=null){
			for(int i = 0;i < whereConditions.size();i++){
				sb.append(whereConditions.get(i).toString());
				if(i < whereConditions.size()-1){
					sb.append(",");
				}
			}
		}
		sb.append("]");
		sb.append(",logic:");
		sb.append(logic);
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
		WhereCondition other = (WhereCondition) obj;
		if(other.logic!=other.logic)
			return false;
		for(int i=0;i < comparableAssignedFields.size();i++){
			if(!other.comparableAssignedFields.get(i).equals(comparableAssignedFields.get(i)))
				return false;
		}
		for(int i=0;i < whereConditions.size();i++){
			if(!other.whereConditions.get(i).equals(whereConditions.get(i)))
				return false;
		}
		return true;
	}
	
	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		int result=1,prime=31;
		result = result * prime + logic;
		for(int i=0;i < comparableAssignedFields.size();i++){
			result = result * prime + comparableAssignedFields.get(i).hashCode();
		}
		for(int i=0;i < whereConditions.size();i++){
			result = result * prime + whereConditions.get(i).hashCode();
		}
		return result;
	}
	
//	public String getLogicSqlSeg(){
//		if(type = LOGIC_AND) return "AND";
//		if(type = LOGIC_AND) return "OR";
//	}
	
//	
//	private String getSql1() {
//		
//		StringBuilder stringBuilder = new StringBuilder();
//		
//		for (int i = 0; i < keyValues.size(); i++) {
//			
//			KeyValue keyValue = keyValues.get(i);
//			if (i > 0) {
//				if (null != logic && !logic.isEmpty()) {
//					stringBuilder.append(logic);
//				}
//				stringBuilder.append(" ");
//			}
//			
//			stringBuilder.append(keyValue.getKey());
//			stringBuilder.append(keyValue.getCompartion());
//			stringBuilder.append(keyValue.getValue());
//			
//			if (i < (keyValues.size() - 1)) {
//				stringBuilder.append(" ");
//			}
//		}
//		
//		return stringBuilder.toString();
//	}
//	
//	public String getSql() {
//		StringBuilder stringBuilder = new StringBuilder();
//		stringBuilder.append(this.getSql1());
//		if (null != whereConditions && !whereConditions.isEmpty()) {
//			if (null != logic && !logic.isEmpty()) {
//				for (int i = 0; i < whereConditions.size(); i++) {
//					stringBuilder.append(" ");
//					stringBuilder.append(logic);
//					stringBuilder.append(" ");
//					stringBuilder.append("(");
//					stringBuilder.append(whereConditions.get(i).getSql());
//					stringBuilder.append(")");
//				}
//				
//			}
//		}
//		return stringBuilder.toString();
//	}
}

