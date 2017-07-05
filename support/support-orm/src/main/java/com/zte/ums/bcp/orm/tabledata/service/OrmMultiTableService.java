package com.zte.ums.bcp.orm.tabledata.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.zte.ums.bcp.orm.constant.IJsonConstant;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.QueryRecordJsonKeyConstant;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.service.WhereConditionJsonParseService;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.framework.request.service.RequestAddRecordService;
import com.zte.ums.bcp.orm.framework.sql.service.WhereContionSqlSplicingService;
import com.zte.ums.bcp.orm.tabledata.dao.GeneralMapper;
import com.zte.ums.bcp.orm.utils.JsonConverter;
import org.apache.log4j.Logger;

@Service(value = "multiTableService")
public class OrmMultiTableService implements MultiTableService {
	private static final Logger dMsg = Logger.getLogger(OrmMultiTableService.class.getName());

    @Resource(name = "multiTableModelService")
    private MultiTableModelService multiTableModelService;

    @Resource
    private GeneralMapper generalMapper;

    @Resource(name = "addRecordService")
    private AddRecordService addRecordService;

	@Resource
	private RequestAddRecordService requestAddRecordService;

	@Resource
	private WhereConditionJsonParseService whereConditionJsonParseService;

	@Resource
	private WhereContionSqlSplicingService whereContionSqlSplicingService;

	public Map<String, Object> queryInstance(String definitionName, String param)
			throws JsonProcessingException, IOException, OrmException {
		Map<String, Object> hashMap = new HashMap<String, Object>();
		hashMap.put(IJsonConstant.TOTAL, 0);
		hashMap.put(IJsonConstant.ROWS,
				new ArrayList<LinkedHashMap<String, String>>());
		ObjectNode objNode = multiTableModelService
				.getDefinitionModel(definitionName);
		if (objNode != null) {
			String model = objNode.toString();
			String tableName = objNode.get("tableName").asText();
			WhereCondition whereCondition = whereConditionJsonParseService
					.parseWhereConditionJson(new ObjectMapper().readTree(param)
							.get(QueryRecordJsonKeyConstant.KEY_CONDITION));
			String condition = whereContionSqlSplicingService
					.splicingWhereContionSql(whereCondition);
			String sql = "select " + getMasterSqlFields(model) + " from "
					+ tableName + " " + condition;
			List<LinkedHashMap<String, String>> masterRowList = null;
			try {
				masterRowList = generalMapper.selectBySql(sql);
			} catch (Exception e) {
				throw new OrmException(e);
			}
			int total = masterRowList.size();
			if (total > 0) {
				LinkedHashMap<String, String> firstRowMap = masterRowList
						.get(0);
				LinkedHashMap<String, String> row = filterRowFields(
						firstRowMap, objNode);
				masterRowList.clear();
				masterRowList.add(row);
				if (total > 1) {
					total = 1;
				}
				hashMap.put(IJsonConstant.TOTAL, total);
				hashMap.put(IJsonConstant.ROWS, masterRowList);
				ArrayNode slaveModelArray = (ArrayNode) objNode
						.get("slaveTables");
				Map<String, Object> slaveInstanceData = new HashMap<String, Object>();
				for (int m = 0; m < slaveModelArray.size(); m++) {
					JsonNode slaveModel = slaveModelArray.get(m);
					addToSlaveTableJson(slaveInstanceData, slaveModel,
							firstRowMap);
				}
				hashMap.put("slaveTables", slaveInstanceData);
			}
		} else {
			throw new OrmException("没有定义模型:" + definitionName);
		}
		return hashMap;
	}

	private LinkedHashMap<String, String> filterRowFields(
			LinkedHashMap<String, String> rowMap, ObjectNode modelNode) {
		ArrayNode fieldArray = (ArrayNode) modelNode.get("fields");
		Set<String> fieldSet = new HashSet<String>();
		for (int i = 0; i < fieldArray.size(); i++) {
			JsonNode fieldNode = fieldArray.get(i);
			JsonNode fieldColumn = fieldNode.get("column_name");
			String column = fieldColumn.asText();
			fieldSet.add(column);
		}
		LinkedHashMap<String, String> resultMap = new LinkedHashMap<String, String>();
		for (String column : fieldSet) {
			resultMap.put(column, rowMap.get(column));
		}
		return resultMap;
	}

	@Transactional(rollbackFor=Exception.class)
	public Map<String, Object> insertInstance(String definitionName,
			String jsonData) throws JsonProcessingException, IOException,
			OrmException {
		Map<String, Object> masterKeyMap = new HashMap<String, Object>();
		ObjectNode objNode = multiTableModelService
				.getDefinitionModel(definitionName);
		if (objNode != null) {
			boolean readOnly = objNode.get("readOnly").asBoolean();
			String tableName = objNode.get("tableName").asText();
			Map<String, String> primaryRowMap = new HashMap<String, String>();
			ArrayNode masterFieldArray = (ArrayNode) objNode.get("fields");
			for (int m = 0; m < masterFieldArray.size(); m++) {
				JsonNode fieldNode = masterFieldArray.get(m);
				JsonNode fieldColumn = fieldNode.get("column_name");
				primaryRowMap.put(fieldColumn.asText(), null);
			}
			ArrayNode slaveTableArray = (ArrayNode) objNode.get("slaveTables");
			for (int m = 0; m < slaveTableArray.size(); m++) {
				JsonNode slaveTableJson = slaveTableArray.get(m);
				ArrayNode masterKeyArray = (ArrayNode) slaveTableJson
						.get("master-columns");
				for (int n = 0; n < masterKeyArray.size(); n++) {
					primaryRowMap.put(masterKeyArray.get(n).asText(), null);
				}
			}
			JsonNode insertInstance = new ObjectMapper().readTree(jsonData);
			ObjectNode conditionJson = new ObjectMapper().createObjectNode();
			ArrayNode recordArray = (ArrayNode) insertInstance.get("rows");
			JsonNode masterRocord = (JsonNode) recordArray.get(0);
			if (!readOnly) {
				masterKeyMap = insertMasterRecords(tableName, recordArray);
				@SuppressWarnings("unchecked")
				Map<String, Object> keyValue = (Map<String, Object>) masterKeyMap
						.get("primaryKey");
				if (keyValue != null) {
					if (keyValue.size() == 1) {
						ObjectNode cJson = new ObjectMapper()
								.createObjectNode();
						for (Iterator<String> iter = keyValue.keySet()
								.iterator(); iter.hasNext();) {
							String column = iter.next();
							@SuppressWarnings("unchecked")
							List<String> valueList = (List<String>) keyValue
									.get(column);
							if (valueList.size() != 1) {
								throw new OrmException("主表记录不唯一");
							}
							String value = valueList.get(0);
							cJson.put("cname", column);
							cJson.put("compare", "=");
							cJson.put("value", value);
						}
						conditionJson = cJson;
					} else {
						ArrayNode conditionArray = new ObjectMapper()
								.createArrayNode();
						for (Iterator<String> iter = keyValue.keySet()
								.iterator(); iter.hasNext();) {
							ObjectNode cJson = new ObjectMapper()
									.createObjectNode();
							String column = iter.next();
							cJson.put("cname", column);
							cJson.put("compare", "=");
							cJson.put("value", keyValue.get(column).toString());
							conditionArray.add(cJson);
						}
						conditionJson.set("and", conditionArray);
					}
				} else {
					throw new OrmException(masterKeyMap.toString());
				}
			} else {
				if (masterFieldArray.size() == 1) {
					ObjectNode cJson = new ObjectMapper().createObjectNode();
					JsonNode fieldNode = masterFieldArray.get(0);
					JsonNode fieldColumn = fieldNode.get("column_name");
					String column = fieldColumn.asText();
					cJson.put("cname", column);
					cJson.put("compare", "=");
					cJson.put("value", masterRocord.get(column).asText());
					conditionJson = cJson;
				} else {
					ArrayNode conditionArray = new ObjectMapper()
							.createArrayNode();
					for (int x = 0; x < masterFieldArray.size(); x++) {
						ObjectNode cJson = new ObjectMapper()
								.createObjectNode();
						JsonNode fieldNode = masterFieldArray.get(x);
						JsonNode fieldColumn = fieldNode.get("column_name");
						String column = fieldColumn.asText();
						cJson.put("cname", column);
						cJson.put("compare", "=");
						cJson.put("value", masterRocord.get(column).asText());
						conditionArray.add(cJson);
					}
					conditionJson.set("and", conditionArray);
				}
			}
			ObjectNode con = new ObjectMapper().createObjectNode();
			con.set("condition", conditionJson);
			Set<String> primaryColumnSet = primaryRowMap.keySet();
			StringBuffer sBuff = new StringBuffer();
			for (Iterator<String> iter = primaryColumnSet.iterator(); iter
					.hasNext();) {
				sBuff.append(iter.next() + ", ");
			}
			sBuff.setLength(sBuff.length() - 2);

			WhereCondition whereCondition = whereConditionJsonParseService
					.parseWhereConditionJson(con
							.get(QueryRecordJsonKeyConstant.KEY_CONDITION));
			String condition = whereContionSqlSplicingService
					.splicingWhereContionSql(whereCondition);
			String sql = "select " + sBuff.toString() + " from " + tableName
					+ " " + condition;
			List<LinkedHashMap<String, String>> masterRowList = null;
			try {
				masterRowList = generalMapper.selectBySql(sql);
			} catch (Exception e) {
				throw new OrmException(e);
			}
			if (masterRowList.size() == 0) {
				throw new OrmException("未找到主表记录");
			} else if (masterRowList.size() > 1) {
				throw new OrmException("主表记录不唯一");
			} else {
				insertSlaveRecords(slaveTableArray, insertInstance,
						masterRowList);
			}
		} else {
			throw new OrmException("没有定义模型:" + definitionName);
		}
		return masterKeyMap;
	}

	private Map<String, Object> insertMasterRecords(String tableName,
			ArrayNode recordArray) throws OrmException {
		Map<String, Object> masterKeyMap = null;
		ObjectNode insertJson = new ObjectMapper().createObjectNode();
		insertJson.set("columns", recordArray);
		RequestAddRecord requestAddRecord = requestAddRecordService
				.getRequestAddRecord(null, tableName, insertJson.toString());
		masterKeyMap = addRecordService.addRecord(requestAddRecord);
		if (masterKeyMap.containsKey("status")) {
			int status = (Integer) masterKeyMap.get("status");
			if (status == 0) {
				String message = (String) masterKeyMap.get("message");
				if (message == null || message.isEmpty()) {
					message = "插入数据表失败:" + tableName;
				} else {
					dMsg.error(message);
				}
				throw new OrmException(message);
			}
		}
		return masterKeyMap;
	}

	private void insertSlaveRecords(ArrayNode slaveTableArray,
			JsonNode insertInstance,
			List<LinkedHashMap<String, String>> masterRowList)
			throws IOException, JsonParseException, JsonMappingException,
			JsonProcessingException, OrmException {
		JsonNode slaveInstanceData = insertInstance.get("slaveTables");
		for (int m = 0; m < slaveTableArray.size(); m++) {
			JsonNode slaveTableJson = (JsonNode) slaveTableArray.get(m);
			boolean slaveTableReadOnly = slaveTableJson.get("readOnly")
					.asBoolean();
			if (!slaveTableReadOnly) {
				ArrayNode masterKeyArray = (ArrayNode) slaveTableJson
						.get("master-columns");
				ArrayNode slaveKeyArray = (ArrayNode) slaveTableJson
						.get("slave-columns");
				String slaveTableName = slaveTableJson.get("tableName")
						.asText();
				JsonNode instData = (JsonNode) slaveInstanceData
						.get(slaveTableName);
				ArrayNode instRowArray = (ArrayNode) instData.get("rows");
				ArrayNode insertRowArray = new ObjectMapper().createArrayNode();
				for (int n = 0; n < instRowArray.size(); n++) {
					JsonNode instRow = (JsonNode) instRowArray.get(n);
					ObjectNode newInstRow = new ObjectMapper()
							.createObjectNode();
					@SuppressWarnings("unchecked")
					Map<String, Map<String, Object>> maps = new ObjectMapper()
							.readValue(instRow.toString(), Map.class);
					Set<String> key = maps.keySet();
					Iterator<String> iter = key.iterator();
					while (iter.hasNext()) {
						String field = iter.next();
						newInstRow.set(field,instRow.get(field));
//								new ObjectMapper().readTree(JsonConverter
//										.toJson(maps.get(field))));
					}
					LinkedHashMap<String, String> firstRowMap = masterRowList
							.get(0);
					for (int x = 0; x < slaveKeyArray.size(); x++) {
						String slaveKey = slaveKeyArray.get(x).asText();
						String masterKey = masterKeyArray.get(x).asText();

						JsonNode firstRowNode = new ObjectMapper()
								.readTree(JsonConverter.toJson(firstRowMap));
						JsonNode masterValue = firstRowNode.get(masterKey);
						newInstRow.put(slaveKey, masterValue.asText());
					}
					insertRowArray.add(newInstRow);
				}
				ObjectNode insertJson = new ObjectMapper().createObjectNode();
				insertJson.set("columns", insertRowArray);
				RequestAddRecord requestAddRecord = requestAddRecordService
						.getRequestAddRecord(null, slaveTableName, insertJson
								.toString());
				Map<String, Object> slaveKeyMap = addRecordService
						.addRecord(requestAddRecord);
				if (slaveKeyMap.containsKey("status")) {
					int status = (Integer) slaveKeyMap.get("status");
					if (status == 0) {
						String message = (String) slaveKeyMap.get("message");
						if (message == null || message.isEmpty()) {
							message = "插入数据表失败:" + slaveTableName;
						} else {
							dMsg.error(message);
						}
						throw new OrmException(message);
					}
				}
				dMsg.info(slaveTableName + "\t" + slaveKeyMap.toString());
			}
		}
	}

	@Transactional(rollbackFor=Exception.class)
	public void deleteInstance(String definitionName, String param)
			throws JsonProcessingException, IOException, OrmException {
		Map<String, Object> instanceJson = new HashMap<String, Object>();
		ObjectNode objNode = multiTableModelService
				.getDefinitionModel(definitionName);
		if (objNode != null) {
			String tableName = objNode.get("tableName").asText();
			WhereCondition whereCondition = whereConditionJsonParseService
					.parseWhereConditionJson(new ObjectMapper().readTree(param)
							.get(QueryRecordJsonKeyConstant.KEY_CONDITION));
			String condition = whereContionSqlSplicingService
					.splicingWhereContionSql(whereCondition);
			String sql = "select " + getMasterSqlFields(objNode.toString())
					+ " from " + tableName + " " + condition;
			dMsg.warn(sql);
			List<LinkedHashMap<String, String>> masterRowList = null;
			try {
				masterRowList = generalMapper.selectBySql(sql);
			} catch (Exception e) {
				throw new OrmException(e);
			}
			Map<String, Object> hashMap = new HashMap<String, Object>();
			hashMap.put(IJsonConstant.TOTAL, masterRowList.size());
			hashMap.put(IJsonConstant.ROWS, masterRowList);
			instanceJson = hashMap;
			int total = masterRowList.size();
			if (total > 0) {
				LinkedHashMap<String, String> firstRowMap = masterRowList
						.get(0);
				JsonNode firstRowNode = new ObjectMapper()
						.readTree(JsonConverter.toJson(firstRowMap));
				ArrayNode slaveModelArray = (ArrayNode) objNode
						.get("slaveTables");
				JsonNode slaveInstanceData = new ObjectMapper()
						.createObjectNode();
				for (int m = 0; m < slaveModelArray.size(); m++) {
					JsonNode slaveModel = slaveModelArray.get(m);
					boolean slaveTableReadOnly = slaveModel.get("readOnly")
							.asBoolean();
					if (!slaveTableReadOnly) {
						deleteFromSlaveTable(slaveModel, firstRowNode);
					}
				}
				instanceJson.put("slaveTables", slaveInstanceData);
			}
			boolean readOnly = objNode.get("readOnly").asBoolean();
			if (!readOnly) {
				sql = "delete from " + tableName + " " + condition;
				try {
					generalMapper.delete(sql);
				} catch (Exception e) {
					throw new OrmException(e);
				}
				dMsg.warn(sql);
			}
		} else {
			throw new OrmException("没有定义模型:" + definitionName);
		}
		dMsg.info(instanceJson.toString());
	}

	@Transactional(rollbackFor=Exception.class)
	public Map<String, Object> updateInstance(String definitionName,
			String param, String jsonData) throws JsonProcessingException,
			IOException, OrmException {
		deleteInstance(definitionName, param);
		return insertInstance(definitionName, jsonData);
	}

	private void addToSlaveTableJson(Map<String, Object> slaveInstanceData,
			JsonNode slaveModel, Map<String, String> firstRow)
			throws JsonProcessingException, IOException, OrmException {
		String tableName = slaveModel.get("tableName").asText();
		JsonNode conditionJson = new ObjectMapper().createObjectNode();
		ArrayNode masterKeyArray = (ArrayNode) slaveModel.get("master-columns");
		ArrayNode slaveKeyArray = (ArrayNode) slaveModel.get("slave-columns");
		if (slaveKeyArray.size() <= 1) {
			Map<String, Object> cJson = new HashMap<String, Object>();
			String masterKey = (String) masterKeyArray.get(0).asText();
			String slaveKey = (String) slaveKeyArray.get(0).asText();
			if (firstRow.containsKey(masterKey)) {
				cJson.put("cname", slaveKey);
				cJson.put("compare", "=");
				cJson.put("value", firstRow.get(masterKey));
			} else {
				cJson.put("cname", slaveKey);
				cJson.put("compare", " IS NULL ");
			}
			conditionJson = new ObjectMapper().readTree(JsonConverter
					.toJson(cJson));
		} else {
			ArrayNode conditionArray = new ObjectMapper().createArrayNode();
			for (int i = 0; i < slaveKeyArray.size(); i++) {
				Map<String, Object> cJson = new HashMap<String, Object>();
				String masterKey = (String) masterKeyArray.get(i).asText();
				String slaveKey = (String) slaveKeyArray.get(i).asText();
				cJson.put("cname", slaveKey);
				cJson.put("compare", "=");
				cJson.put("value", firstRow.get(masterKey));
				conditionArray.add(new ObjectMapper().readTree(JsonConverter
						.toJson(cJson)));
			}
			Map<String, Object> conMap = new HashMap<String, Object>();
			conMap.put("and", conditionArray);
			conditionJson = new ObjectMapper().readTree(JsonConverter
					.toJson(conMap));
		}
		Map<String, Object> con = new HashMap<String, Object>();
		con.put("condition", conditionJson);
		WhereCondition whereCondition = whereConditionJsonParseService
				.parseWhereConditionJson(new ObjectMapper().readTree(
						JsonConverter.toJson(con)).get(
						QueryRecordJsonKeyConstant.KEY_CONDITION));
		String condition = whereContionSqlSplicingService
				.splicingWhereContionSql(whereCondition);
		String sql = "select " + getSlaveSqlFields(slaveModel.toString())
				+ " from " + tableName + " " + condition;
		List<LinkedHashMap<String, String>> masterRowList = null;
		try {
			masterRowList = generalMapper.selectBySql(sql);
		} catch (Exception e) {
			throw new OrmException(e);
		}
		Map<String, Object> hashMap = new HashMap<String, Object>();
		hashMap.put(IJsonConstant.TOTAL, masterRowList.size());
		hashMap.put(IJsonConstant.ROWS, masterRowList);
		slaveInstanceData.put(tableName, hashMap);
	}

	private void deleteFromSlaveTable(JsonNode slaveModel, JsonNode firstRow)
			throws JsonProcessingException, IOException, OrmException {
		String tableName = slaveModel.get("tableName").asText();
		ObjectNode conditionJson = new ObjectMapper().createObjectNode();
		ArrayNode masterKeyArray = (ArrayNode) slaveModel.get("master-columns");
		ArrayNode slaveKeyArray = (ArrayNode) slaveModel.get("slave-columns");
		if (slaveKeyArray.size() <= 1) {
			ObjectNode cJson = new ObjectMapper().createObjectNode();
			String masterKey = masterKeyArray.get(0).asText();
			String slaveKey = slaveKeyArray.get(0).asText();
			if (firstRow.has(masterKey)) {
				cJson.put("cname", slaveKey);
				cJson.put("compare", "=");
				cJson.put("value", firstRow.get(masterKey).asText());
			} else {
				cJson.put("cname", slaveKey);
				cJson.put("compare", " IS NULL ");
			}
			conditionJson = cJson;
		} else {
			ArrayNode conditionArray = new ObjectMapper().createArrayNode();
			for (int i = 0; i < slaveKeyArray.size(); i++) {
				ObjectNode cJson = new ObjectMapper().createObjectNode();
				String masterKey = masterKeyArray.get(i).asText();
				String slaveKey = slaveKeyArray.get(i).asText();
				cJson.put("cname", slaveKey);
				cJson.put("compare", "=");
				cJson.put("value", firstRow.get(masterKey).asText());
				conditionArray.add(cJson);
			}
			conditionJson.set("and", conditionArray);
		}
		ObjectNode con = new ObjectMapper().createObjectNode();
		con.set("condition", conditionJson);
		WhereCondition whereCondition = whereConditionJsonParseService
				.parseWhereConditionJson(new ObjectMapper().readTree(
						con.toString()).get(
						QueryRecordJsonKeyConstant.KEY_CONDITION));
		String condition = whereContionSqlSplicingService
				.splicingWhereContionSql(whereCondition);

		String sql = "delete from " + tableName + " " + condition;
		try {
			generalMapper.delete(sql);
		} catch (Exception e) {
			throw new OrmException(e);
		}
		dMsg.warn(sql);
	}

	private String getMasterSqlFields(String modelObjectString) {
		String fields = "";
		StringBuffer sBuff = new StringBuffer();
		Set<String> fieldSet = new HashSet<String>();
		JsonNode modelObject;
		try {
			modelObject = new ObjectMapper().readTree(modelObjectString);
			ArrayNode fieldArray = (ArrayNode) modelObject.get("fields");
			for (int i = 0; i < fieldArray.size(); i++) {
				JsonNode fieldNode = fieldArray.get(i);
				JsonNode fieldColumn = fieldNode.get("column_name");
				String column = fieldColumn.asText();
				fieldSet.add(column);
			}
			ArrayNode slaveTableArray = (ArrayNode) modelObject
					.get("slaveTables");
			for (int i = 0; i < slaveTableArray.size(); i++) {
				JsonNode tableObject = slaveTableArray.get(i);
				ArrayNode masterColumnArray = (ArrayNode) tableObject
						.get("master-columns");
				for (int j = 0; j < masterColumnArray.size(); j++) {
					fieldSet.add(masterColumnArray.get(j).asText());
				}
			}
			if (fieldSet.size() > 0) {
				for (Iterator<String> iter = fieldSet.iterator(); iter
						.hasNext();) {
					sBuff.append(iter.next() + ", ");
				}
				sBuff.setLength(sBuff.length() - 2);
				fields = sBuff.toString();
			}
		} catch (JsonProcessingException e) {
			dMsg.error(e.getMessage(), e);
		} catch (IOException e) {
			dMsg.error(e.getMessage(), e);
		}
		return fields;
	}

	private String getSlaveSqlFields(String slaveTableObjectString) {
		String fields = "";
		StringBuffer sBuff = new StringBuffer();
		Set<String> fieldSet = new HashSet<String>();
		try {
			JsonNode slaveTableObject = new ObjectMapper()
					.readTree(slaveTableObjectString);
			ArrayNode fieldArray = (ArrayNode) slaveTableObject.get("fields");
			for (int j = 0; j < fieldArray.size(); j++) {
				JsonNode fieldNode = fieldArray.get(j);
				JsonNode fieldColumn = fieldNode.get("column_name");
				String column = fieldColumn.asText();
				fieldSet.add(column);
			}
			if (fieldSet.size() > 0) {
				for (Iterator<String> iter = fieldSet.iterator(); iter
						.hasNext();) {
					sBuff.append(iter.next() + ", ");
				}
				sBuff.setLength(sBuff.length() - 2);
				fields = sBuff.toString();
			}
		} catch (JsonProcessingException e) {
			dMsg.error(e.getMessage(), e);
		} catch (IOException e) {
			dMsg.error(e.getMessage(), e);
		}
		return fields;
	}

	public List<Map<String, Object>> queryInstanceArray(String definitionName,
			String param, String limit) throws OrmException,
			JsonProcessingException, IOException {
		List<Map<String, Object>> instanceArray = new ArrayList<Map<String, Object>>();
		ObjectNode objNode = multiTableModelService
				.getDefinitionModel(definitionName);
		if (objNode != null) {
			String model = objNode.toString();
			String tableName = objNode.get("tableName").asText();
			WhereCondition whereCondition = whereConditionJsonParseService
					.parseWhereConditionJson(new ObjectMapper().readTree(param)
							.get(QueryRecordJsonKeyConstant.KEY_CONDITION));
			String condition = whereContionSqlSplicingService
					.splicingWhereContionSql(whereCondition);
			String sql = "select " + getMasterSqlFields(model) + " from "
					+ tableName + " " + condition;
			List<LinkedHashMap<String, String>> masterRowList = null;
			try {
				masterRowList = generalMapper.selectBySql(sql);
			} catch (Exception e) {
				throw new OrmException(e);
			}
			int total = masterRowList.size();
			if (total > 0) {
				int maxSize = Integer.parseInt(limit);
				if (maxSize > masterRowList.size()) {
					maxSize = masterRowList.size();
				}
				for (int i = 0; i < maxSize; i++) {
					LinkedHashMap<String, String> rowMap = masterRowList.get(i);
					Map<String, Object> hashMap = new HashMap<String, Object>();
					List<LinkedHashMap<String, String>> rowList = new ArrayList<LinkedHashMap<String, String>>();
					LinkedHashMap<String, String> row = filterRowFields(rowMap,
							objNode);
					rowList.add(row);
					hashMap.put(IJsonConstant.TOTAL, 1);
					hashMap.put(IJsonConstant.ROWS, rowList);
					ArrayNode slaveModelArray = (ArrayNode) objNode
							.get("slaveTables");
					Map<String, Object> slaveInstanceData = new HashMap<String, Object>();
					for (int m = 0; m < slaveModelArray.size(); m++) {
						JsonNode slaveModel = slaveModelArray.get(m);
						addToSlaveTableJson(slaveInstanceData, slaveModel,
								rowMap);
					}
					hashMap.put("slaveTables", slaveInstanceData);
					instanceArray.add(hashMap);
				}
			}
		} else {
			throw new OrmException("没有定义模型:" + definitionName);
		}
		return instanceArray;
	}
}
