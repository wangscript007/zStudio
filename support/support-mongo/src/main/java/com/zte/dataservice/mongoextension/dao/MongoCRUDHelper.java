package com.zte.dataservice.mongoextension.dao;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

import javax.annotation.Resource;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.zte.dataservice.mongoextension.common.MongoDataFormater;
import com.zte.dataservice.mongoextension.queryBuilder.WhereConditionQueryBuilder;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.AddRecordCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.QueryCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.UpdateCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;

@Service
public class MongoCRUDHelper extends MongoHelperBase {

	@Resource
	private MongoDataFormater mongoDataFormater;

	@Resource
	private MongoMetaDataHelper mongoMetaDataHelper;

	@Resource
	private WhereConditionQueryBuilder whereConditionQueryBuilder;

	/**
	 * 添加记录
	 * 
	 * @param requestAddRecord
	 * @return
	 * @throws OrmException
	 */
	public List<String> addRecored(RequestAddRecord requestAddRecord)
			throws OrmException {
		List<String> ids = new ArrayList<String>();
		DB db = this.getDB(requestAddRecord.getDatabaseName());
		DBCollection table = db.getCollection(requestAddRecord.getTableName());
		List<AddRecordCondition> conditions = requestAddRecord
				.getAddRecordConditions();
		List<BasicDBObject> docs = new ArrayList<BasicDBObject>();
		for (int i = 0; i < conditions.size(); i++) {
			docs.add(mongoDataFormater.formatFieldValue(conditions.get(i)
					.getDataExpressions(), mongoMetaDataHelper.queryTableField(
					requestAddRecord.getTableName(),
					requestAddRecord.getDatabaseName())));
		}

		table.insert(docs);
		for (int i = 0; i < docs.size(); i++) {
			ObjectId id = (ObjectId) (((BasicDBObject) docs.get(i)).get("_id"));
			if (id != null) {
				ids.add(id.toString());
			}
		}
		return ids;
	}

	/**
	 * 删除记录
	 * 
	 * @param requestDeleteRecord
	 * @throws OrmException
	 */
	public void deleteRecord(RequestDeleteRecord requestDeleteRecord)
			throws OrmException {
		DB db = this.getDB(requestDeleteRecord.getDatabaseName());
		DBCollection table = db.getCollection(requestDeleteRecord
				.getTableName());
		WhereCondition whereCondition = requestDeleteRecord.getWhereCondition();
		BasicDBObject query = whereConditionQueryBuilder.buildCondition(
				mongoMetaDataHelper.queryTableField(
						requestDeleteRecord.getTableName(),
						requestDeleteRecord.getDatabaseName()), whereCondition);
		table.remove(query);
	}

	/**
	 * 查询
	 * 
	 * @param requestQueryRecord
	 * @return
	 * @throws OrmException
	 */
	public List<LinkedHashMap<String, String>> queryRecord(
			RequestQueryRecord requestQueryRecord) throws OrmException {
		DB db = this.getDB(requestQueryRecord.getDatabaseName());
		DBCollection table = db
				.getCollection(requestQueryRecord.getTableName());
		QueryCondition queryCondition = requestQueryRecord.getQueryCondition();
		BasicDBObject query = new BasicDBObject();
		if (queryCondition != null) {
			query = whereConditionQueryBuilder.buildCondition(
					mongoMetaDataHelper.queryTableField(
							requestQueryRecord.getTableName(),
							requestQueryRecord.getDatabaseName()),
					queryCondition.getWhereCondition());
		}
		BasicDBObject keys = new BasicDBObject();
		if (queryCondition.getFields() != null) {
			for (int i = 0; i < queryCondition.getFields().size(); i++) {
				keys.append(queryCondition.getFields().get(i).getName(), 1);
			}
		}
		// keys.append("_id", 0);//关闭mongodb_id
		BasicDBObject orderBy = new BasicDBObject();
		if (queryCondition.getOrders() != null) {
			for (int i = 0; i < queryCondition.getOrders().size(); i++) {
				orderBy.append(queryCondition.getOrders().get(i).getField()
						.getName(), queryCondition.getOrders().get(i)
						.getOrder() == 1 ? new Integer(-1) : new Integer(1));
			}
		}
		DBCursor cursor = table.find(query, keys).sort(orderBy)
				.skip(requestQueryRecord.getOffset())
				.limit(requestQueryRecord.getLimit());
		List<LinkedHashMap<String, String>> results = new ArrayList<LinkedHashMap<String, String>>();
		while (cursor.hasNext()) {
			DBObject obj = cursor.next();
			LinkedHashMap<String, String> lmap = new LinkedHashMap<String, String>();
			for (String key : obj.keySet()) {
				String value = obj.get(key).toString();
				if (obj.get(key).getClass().equals(Date.class)) {
					SimpleDateFormat simpleDateFormat = new SimpleDateFormat(
							"yyyy-MM-dd HH:mm:ss");
					value = simpleDateFormat.format(obj.get(key));
				}

				lmap.put(key, value);
			}
			results.add(lmap);
		}
		return results;
	}

	/**
	 * 获取记录数
	 * 
	 * @param requestQueryRecord
	 * @return
	 * @throws OrmException
	 */
	public Integer getCount(RequestQueryRecord requestQueryRecord)
			throws OrmException {
		DB db = this.getDB(requestQueryRecord.getDatabaseName());
		DBCollection table = db
				.getCollection(requestQueryRecord.getTableName());
		QueryCondition queryCondition = requestQueryRecord.getQueryCondition();
		BasicDBObject query = new BasicDBObject();
		if (queryCondition != null) {
			query = whereConditionQueryBuilder.buildCondition(
					mongoMetaDataHelper.queryTableField(
							requestQueryRecord.getTableName(),
							requestQueryRecord.getDatabaseName()),
					queryCondition.getWhereCondition());
		}
		BasicDBObject keys = new BasicDBObject();
		for (int i = 0; i < queryCondition.getFields().size(); i++) {
			keys.append(queryCondition.getFields().get(i).getName(), 1);
		}
		// keys.append("_id", 0);//关闭mongodb_id
		return table.find(query, keys).count();
	}

	/**
	 * 更新记录
	 * 
	 * @param requestUpdateRecord
	 * @throws OrmException
	 */
	public void updateRecord(RequestUpdateRecord requestUpdateRecord)
			throws OrmException {
		DB db = this.getDB(requestUpdateRecord.getDatabaseName());
		DBCollection table = db.getCollection(requestUpdateRecord
				.getTableName());
		List<UpdateCondition> updateConditions = requestUpdateRecord
				.getUpdateConditions();
		if (updateConditions != null) {
			for (int i = 0; i < updateConditions.size(); i++) {
				BasicDBObject query = whereConditionQueryBuilder
						.buildCondition(mongoMetaDataHelper.queryTableField(
								requestUpdateRecord.getTableName(),
								requestUpdateRecord.getDatabaseName()),
								updateConditions.get(i).getWhereCondition());

				BasicDBObject obj = mongoDataFormater.formatFieldValue(
						updateConditions.get(i).getDataExpressions(),
						mongoMetaDataHelper.queryTableField(
								requestUpdateRecord.getTableName(),
								requestUpdateRecord.getDatabaseName()));

				BasicDBObject newObject = new BasicDBObject("$set", obj);
				table.updateMulti(query, newObject);
			}
		}
	}
}
