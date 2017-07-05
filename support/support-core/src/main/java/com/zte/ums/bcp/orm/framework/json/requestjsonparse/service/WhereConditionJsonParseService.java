package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.WhereConditionJsonKeyConstant;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.ComparableAssignedField;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.utils.ConstantUtils;

@Service
public class WhereConditionJsonParseService {

	@Resource
	private DatabasePropertyService databasePropertyService;
	private boolean isMultiTable;

	public WhereCondition parseWhereConditionJson(JsonNode whereConditionJson,
			String tableName, boolean isMultiTable) throws OrmException {
		this.isMultiTable = isMultiTable;
		return parseConditionJson(whereConditionJson, tableName);
	}
	
	public WhereCondition parseWhereConditionJson(JsonNode whereConditionJson) throws OrmException {
		return parseConditionJson(whereConditionJson);
    }

    private ComparableAssignedField parseKeyValueJson(JsonNode keyValueJsonNode, String tableName) throws OrmException {
        ComparableAssignedField keyValue = new ComparableAssignedField();

        if (keyValueJsonNode.has(WhereConditionJsonKeyConstant.KEY_CNAME) == false) {
            throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_CNAME);
        }
        if (keyValueJsonNode.has(WhereConditionJsonKeyConstant.KEY_VALUE) == false) {
            throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_VALUE);
        }
        if (keyValueJsonNode.has(WhereConditionJsonKeyConstant.KEY_COMPARE) == false) {
            throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_COMPARE);
        }

        Iterator<Entry<String, JsonNode>> keyValueFields = keyValueJsonNode.fields();
        while (keyValueFields.hasNext()) {
            Entry<String, JsonNode> keyValueFieldEntry = keyValueFields.next();
            if (WhereConditionJsonKeyConstant.KEY_CNAME.equals(keyValueFieldEntry.getKey())
                    && null != keyValueFieldEntry.getValue()) {
                keyValue.setField(getField(keyValueFieldEntry.getValue().asText()));
            } else if (WhereConditionJsonKeyConstant.KEY_VALUE.equals(keyValueFieldEntry.getKey())) {
                keyValue.setValue(parseValue(keyValueFieldEntry));
            } else if (WhereConditionJsonKeyConstant.KEY_COMPARE.equals(keyValueFieldEntry.getKey())) {
                keyValue.setComparison(keyValueFieldEntry.getValue().asText());
            }
        }
        return keyValue;
    }

	private List<String> parseValue(Entry<String, JsonNode> keyValueFieldEntry) {
	    List<String> litList = new ArrayList<String>();
        if (keyValueFieldEntry.getValue().isArray()) {
            for (Iterator<JsonNode>  valueJsonNode = keyValueFieldEntry.getValue().iterator(); valueJsonNode.hasNext();) {
                litList.add(valueJsonNode.next().asText());
            }
        } else {
            litList.add(keyValueFieldEntry.getValue().asText());
        }
        return litList;
	}
	
    private ComparableAssignedField parseKeyValueJson(JsonNode keyValueJsonNode) throws OrmException {
        ComparableAssignedField keyValue = new ComparableAssignedField();
        if (keyValueJsonNode.has(WhereConditionJsonKeyConstant.KEY_CNAME) == false) {
            throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_CNAME);
        }
        if (keyValueJsonNode.has(WhereConditionJsonKeyConstant.KEY_VALUE) == false) {
            throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_VALUE);
        }
        if (keyValueJsonNode.has(WhereConditionJsonKeyConstant.KEY_COMPARE) == false) {
            throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_COMPARE);
        }
        Iterator<Entry<String, JsonNode>> keyValueFields = keyValueJsonNode.fields();
        while (keyValueFields.hasNext()) {
            Entry<String, JsonNode> keyValueFieldEntry = keyValueFields.next();
            if (WhereConditionJsonKeyConstant.KEY_CNAME.equals(keyValueFieldEntry.getKey())
                    && null != keyValueFieldEntry.getValue()) {
                keyValue.setField(getField(keyValueFieldEntry.getValue().asText()));
            } else if (WhereConditionJsonKeyConstant.KEY_VALUE.equals(keyValueFieldEntry.getKey())) {
                keyValue.setValue(parseValue(keyValueFieldEntry));
            } else if (WhereConditionJsonKeyConstant.KEY_COMPARE.equals(keyValueFieldEntry.getKey())) {
                keyValue.setComparison(keyValueFieldEntry.getValue().asText());
            }
        }

        return keyValue;
    }

	private WhereCondition parseConditionJson(JsonNode whereConditionJsonNode,
			WhereCondition whereCondition, String tableName) throws OrmException {

		List<ComparableAssignedField> keyValues = new ArrayList<ComparableAssignedField>();
		List<WhereCondition> whereConditions = new ArrayList<WhereCondition>();
		Iterator<Entry<String, JsonNode>> whereConditionFieldsIterator = whereConditionJsonNode
				.fields();

		while (whereConditionFieldsIterator.hasNext()) {
			Entry<String, JsonNode> whereConditionFieldEntry = whereConditionFieldsIterator
					.next();
			if (null != whereConditionFieldEntry.getKey()
					&& !whereConditionFieldEntry.getKey().isEmpty()) {
				if (WhereConditionJsonKeyConstant.CONDITION_AND
						.equalsIgnoreCase(whereConditionFieldEntry.getKey()
								.trim())) {
					whereCondition.setLogic(WhereCondition.LOGIC_AND);
				} else if (WhereConditionJsonKeyConstant.CONDITION_OR
						.equalsIgnoreCase(whereConditionFieldEntry.getKey()
								.trim())) {
					whereCondition.setLogic(WhereCondition.LOGIC_OR);
				}

				Iterator<JsonNode> whereConditionValueJsonNodes = whereConditionJsonNode
						.get(whereConditionFieldEntry.getKey()).iterator();
				while (whereConditionValueJsonNodes.hasNext()) {
					JsonNode whereConditionValueJsonNode = (JsonNode) whereConditionValueJsonNodes
							.next();
					if (whereConditionValueJsonNode
							.has(WhereConditionJsonKeyConstant.KEY_CNAME)) {
						keyValues
								.add(parseKeyValueJson(whereConditionValueJsonNode, tableName));
					}
					else if (whereConditionValueJsonNode
	                        .has(WhereConditionJsonKeyConstant.CONDITION_AND )|| whereConditionValueJsonNode
	                        .has(WhereConditionJsonKeyConstant.CONDITION_OR)) {
					    WhereCondition whereConditionChild = new WhereCondition();
					    whereConditions.add(parseConditionJson(
					            whereConditionValueJsonNode,
					            whereConditionChild, tableName));
                    }
					else {
					    throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_CNAME);
					}
				}
			}
		}

		whereCondition.setWhereConditions(whereConditions);
		whereCondition.setComparableAssignedFields(keyValues);

		return whereCondition;
	}

	private WhereCondition parseConditionJson(JsonNode whereConditionJsonNode,
			WhereCondition whereCondition) throws OrmException {

		List<ComparableAssignedField> keyValues = new ArrayList<ComparableAssignedField>();
		List<WhereCondition> whereConditions = new ArrayList<WhereCondition>();
		Iterator<Entry<String, JsonNode>> whereConditionFieldsIterator = whereConditionJsonNode
				.fields();

		while (whereConditionFieldsIterator.hasNext()) {
			Entry<String, JsonNode> whereConditionFieldEntry = whereConditionFieldsIterator
					.next();
			if (null != whereConditionFieldEntry.getKey()
					&& !whereConditionFieldEntry.getKey().isEmpty()) {
				if (WhereConditionJsonKeyConstant.CONDITION_AND
						.equalsIgnoreCase(whereConditionFieldEntry.getKey()
								.trim())) {
					whereCondition.setLogic(WhereCondition.LOGIC_AND);
				} else if (WhereConditionJsonKeyConstant.CONDITION_OR
						.equalsIgnoreCase(whereConditionFieldEntry.getKey()
								.trim())) {
					whereCondition.setLogic(WhereCondition.LOGIC_OR);
				}

				Iterator<JsonNode> whereConditionValueJsonNodes = whereConditionJsonNode
						.get(whereConditionFieldEntry.getKey()).iterator();
				while (whereConditionValueJsonNodes.hasNext()) {
					JsonNode whereConditionValueJsonNode = (JsonNode) whereConditionValueJsonNodes
							.next();
					if (whereConditionValueJsonNode
							.has(WhereConditionJsonKeyConstant.KEY_CNAME)) {
						keyValues
								.add(parseKeyValueJson(whereConditionValueJsonNode));
					} else {
						WhereCondition whereConditionChild = new WhereCondition();
						whereConditions.add(parseConditionJson(
								whereConditionValueJsonNode,
								whereConditionChild));
					}
				}
			}
		}

		whereCondition.setWhereConditions(whereConditions);
		whereCondition.setComparableAssignedFields(keyValues);

		return whereCondition;
	}

	private WhereCondition parseConditionJson(JsonNode conditionJsonNode, String tableName) throws OrmException {
		WhereCondition whereCondition = new WhereCondition();
		if (null != conditionJsonNode) {
			Iterator<Entry<String, JsonNode>> conditionFieldsiIterator = conditionJsonNode
					.fields();

			while (conditionFieldsiIterator.hasNext()) {
				Entry<String, JsonNode> entry = conditionFieldsiIterator.next();

				if (conditionJsonNode
						.has(WhereConditionJsonKeyConstant.KEY_CNAME)) {
					List<ComparableAssignedField> keyValues = new ArrayList<ComparableAssignedField>();
					keyValues.add(parseKeyValueJson(conditionJsonNode));
					whereCondition.setComparableAssignedFields(keyValues);
				} else if (conditionJsonNode
                        .has(WhereConditionJsonKeyConstant.CONDITION_AND )|| conditionJsonNode
                        .has(WhereConditionJsonKeyConstant.CONDITION_OR)) {
				    if (null != entry.getKey() && !entry.getKey().isEmpty()) {
				        whereCondition = parseConditionJson(conditionJsonNode,
				                whereCondition,tableName);
				    }
                }
				else {
				    throw new OrmException("condition条件缺少" + WhereConditionJsonKeyConstant.KEY_CNAME);
				}
			}
		}

		return whereCondition;
	}

	private WhereCondition parseConditionJson(JsonNode conditionJsonNode) throws OrmException {
		WhereCondition whereCondition = new WhereCondition();
		if (null != conditionJsonNode) {
			Iterator<Entry<String, JsonNode>> conditionFieldsiIterator = conditionJsonNode
					.fields();

			while (conditionFieldsiIterator.hasNext()) {
				Entry<String, JsonNode> entry = conditionFieldsiIterator.next();

				if (conditionJsonNode
						.has(WhereConditionJsonKeyConstant.KEY_CNAME)) {
					List<ComparableAssignedField> keyValues = new ArrayList<ComparableAssignedField>();
					keyValues.add(parseKeyValueJson(conditionJsonNode));
					whereCondition.setComparableAssignedFields(keyValues);
				} else {
					if (null != entry.getKey() && !entry.getKey().isEmpty()) {
						whereCondition = parseConditionJson(conditionJsonNode,
								whereCondition);
					}
				}
			}
		}

		return whereCondition;
	}
	
	private Field getField(String fieldStr) {
		Field field = new Field();
		if (isMultiTable) {
			String [] fieldArr = fieldStr.split(ConstantUtils.FIELDCONNECTOR_SPLIT);
			if (fieldArr.length == 1) {
				field.setName(fieldArr[0]);
			} else if (fieldArr.length == 2) {
				field.setTableName(fieldArr[0]);
				field.setName(fieldArr[1]);
			} else if (fieldArr.length == 3) {
				field.setDatabaseName(fieldArr[0]);
				field.setTableName(fieldArr[1]);
				field.setName(fieldArr[2]);
			}
		} else {
			field.setName(fieldStr);
		}
		
		return field;
	}
}
