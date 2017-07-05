package com.zte.dataservice.mongoextension.queryBuilder;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.zte.dataservice.mongoextension.common.MongoDataFormater;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.ComparableAssignedField;
@Service
public class WhereConditionQueryBuilder {
	@Resource
	private MongoDataFormater mongoDataFormater;
	
	public static final String mongoOr="$or";
	public static final String mongoAnd="$and";
	public static final String mongoLt="$lt";
	public static final String mongoLte="$lte";
	public static final String mongoGt="$gt";
	public static final String mongoGte="$gte";
	public static final String mongoIn="$in";
	public static final String mongoRegex="$regex";
	
	
	public static final Map<Integer,String> logic2MongoSymbol;
	public static final Map<String,String> comparison2MongoSymbol;
	static{
		logic2MongoSymbol = new HashMap<Integer, String>();
		comparison2MongoSymbol = new HashMap<String, String>();
		logic2MongoSymbol.put(WhereCondition.LOGIC_AND, mongoAnd);
		logic2MongoSymbol.put(WhereCondition.LOGIC_OR, mongoOr);
		comparison2MongoSymbol.put(">", mongoGt);
		comparison2MongoSymbol.put(">=", mongoGte);
		comparison2MongoSymbol.put("<", mongoLt);
		comparison2MongoSymbol.put("<=", mongoLte);
		comparison2MongoSymbol.put("in", mongoIn);
	}
	
	
	public  BasicDBObject buildCondition(List<LinkedHashMap<String, Object>> metaFieldsInfo,WhereCondition whereCondition) throws OrmException{
		BasicDBObject query = new BasicDBObject();
		if(whereCondition==null)
			return query;
		BasicDBList list = new BasicDBList();
		List<ComparableAssignedField> comparableAssignedFields = whereCondition.getComparableAssignedFields();
		if(comparableAssignedFields!=null){
			for(int i=0;i < comparableAssignedFields.size();i++){
				String fieldValue =comparableAssignedFields.get(i).getValue().get(0);				
				Object formatedFieldValue = mongoDataFormater.formatConditionValue(comparableAssignedFields.get(i),metaFieldsInfo);
				String fieldName = comparableAssignedFields.get(i).getField().getName();
				
				String comparison=comparableAssignedFields.get(i).getComparison();
				if(comparison.equals("=") || comparison.equals("is")){
					if(!comparableAssignedFields.get(i).getValue().get(0).equals("not null")){
						list.add(new BasicDBObject(fieldName,comparableAssignedFields.get(i).getField().getName().equals("_id")?new ObjectId(fieldValue):formatedFieldValue));
					}
				}else if(comparison.equals("like")){
					list.add(new BasicDBObject(fieldName,
							java.util.regex.Pattern.compile(fieldValue)));
				}else{
					if(comparison.equals("in")){
						BasicDBList valueList = new BasicDBList();
						for(String value : comparableAssignedFields.get(i).getValue()){
							valueList.add(fieldName.equals("_id")?new ObjectId(value):value);
						}
						BasicDBObject inObject = new BasicDBObject(comparison2MongoSymbol.get(comparison),valueList);
						list.add(new BasicDBObject(fieldName,inObject));
					}else{
						BasicDBObject obj = new BasicDBObject(comparison2MongoSymbol.get(comparison),fieldName.equals("_id")?new ObjectId(fieldValue):formatedFieldValue);
						list.add(new BasicDBObject(fieldName,obj));
					}
				}
			}
		}
		List<WhereCondition> whereConditions = whereCondition.getWhereConditions();
		if(whereConditions!=null){
			for(int i=0;i < whereConditions.size();i++){
				list.add(buildCondition(metaFieldsInfo,whereConditions.get(i)));
			}
		}
		if(list.size()!=0){
			query.put(logic2MongoSymbol.get(whereCondition.getLogic()==0?1:whereCondition.getLogic()), list);
		}
		return query;
	}
}
