package com.zte.ums.bcp.orm.framework.json.requestjsonparse.entry;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class WhereConditionTest {

//	@Test
//	public void testWhereConditionSQL() throws JsonProcessingException {
//		
//		KeyValue keyValue = new KeyValue();
//		keyValue.setCompartion("=");
//		keyValue.setKey("a");
//		keyValue.setValue("222");
//		
//		KeyValue keyValue1 = new KeyValue();
//		keyValue1.setCompartion(">");
//		keyValue1.setKey("b");
//		keyValue1.setValue("222sss");
//		
//		KeyValue keyValue2 = new KeyValue();
//		keyValue2.setCompartion("=");
//		keyValue2.setKey("d");
//		keyValue2.setValue("222ssddds");
//		
//		KeyValue keyValue3 = new KeyValue();
//		keyValue3.setCompartion("=");
//		keyValue3.setKey("c");
//		keyValue3.setValue("ddds");
//		
//		List<KeyValue> keyValues = new ArrayList<KeyValue>();
//		keyValues.add(keyValue);
//		
//		
//		List<KeyValue> keyValues1 = new ArrayList<KeyValue>();
//		keyValues1.add(keyValue1);
//		keyValues1.add(keyValue3);
//		keyValues1.add(keyValue2);
//		
//		WhereCondition whereCondition = new WhereCondition();
//		whereCondition.setLogic("and");
//		whereCondition.setKeyValues(keyValues);
//		
//		List<WhereCondition> whereConditions = new ArrayList<WhereCondition>();
//		whereConditions.add(whereCondition);
//		
//		WhereCondition whereCondition1 = new WhereCondition();
//		whereCondition1.setLogic("or");
//		whereCondition1.setKeyValues(keyValues1);
//		whereCondition1.setWhereConditions(whereConditions);
//		
//		List<WhereCondition> whereConditions1 = new ArrayList<WhereCondition>();
//		whereConditions1.add(whereCondition);
//		whereConditions1.add(whereCondition1);
//		
//		WhereCondition whereCondition2 = new WhereCondition();
//		whereCondition2.setLogic("and");
//		whereCondition2.setKeyValues(keyValues);
//		whereCondition2.setWhereConditions(whereConditions1);
//		System.out.println(new ObjectMapper().writeValueAsString(whereCondition));
//		System.out.println("++++++++++++++++++++++++++++++++++++++");
//		System.out.println(new ObjectMapper().writeValueAsString(whereCondition1));
//		System.out.println("++++++++++++++++++++++++++++++++++++++");
//		System.out.println(new ObjectMapper().writeValueAsString(whereCondition2));
//	}
//	
//	
//	private String getKeyValueSql(WhereCondition whereCondition) {
//			
//			StringBuilder stringBuilder = new StringBuilder();
//			List<KeyValue> keyValues = whereCondition.getKeyValues();
//			if (null != keyValues && !keyValues.isEmpty()) {
//				for (int i = 0; i < keyValues.size(); i++) {
//					
//					KeyValue keyValue = keyValues.get(i);
//					if (i > 0) {
//						if (null != whereCondition.getLogic() && !whereCondition.getLogic().isEmpty()) {
//							stringBuilder.append(whereCondition.getLogic());
//						}
//						stringBuilder.append(" ");
//					}
//					
//					stringBuilder.append(keyValue.getKey());
//					stringBuilder.append(keyValue.getCompartion());
//					stringBuilder.append(keyValue.getValue());
//					
//					if (i < (keyValues.size() - 1)) {
//						stringBuilder.append(" ");
//					}
//				}
//			}
//			
//			return stringBuilder.toString();
//		}
//	
//	private String getWhereConditionSql(WhereCondition whereCondition) {
//		StringBuilder stringBuilder = new StringBuilder();
//		if (null != whereCondition.getKeyValues() && !whereCondition.getKeyValues().isEmpty()) {
//			stringBuilder.append(getKeyValueSql(whereCondition));
//		}
//		if (null != whereCondition.getWhereConditions() && !whereCondition.getWhereConditions().isEmpty()) {
//			if (null != whereCondition.getLogic() && !whereCondition.getLogic().isEmpty()) {
//				for (int i = 0; i < whereCondition.getWhereConditions().size(); i++) {
//					stringBuilder.append(" ");
//					stringBuilder.append(whereCondition.getLogic());
//					stringBuilder.append(" ");
//					stringBuilder.append("(");
//					stringBuilder.append(getWhereConditionSql(whereCondition.getWhereConditions().get(i)));
//					stringBuilder.append(")");
//				}
//				
//			}
//		}
//		return stringBuilder.toString();
//	}
}
