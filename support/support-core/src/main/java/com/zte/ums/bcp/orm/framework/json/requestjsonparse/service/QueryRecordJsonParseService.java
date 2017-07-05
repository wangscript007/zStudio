package com.zte.ums.bcp.orm.framework.json.requestjsonparse.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.QueryCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.constant.QueryRecordJsonKeyConstant;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Function;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.FunctionField;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Group;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.IFunctionParameter;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Order;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tablemessage.service.QueryTableFieldService;
import com.zte.ums.bcp.orm.utils.ConstantUtils;

import org.apache.log4j.Logger;

@Service
public class QueryRecordJsonParseService extends AbstractJsonParseService{

    private static final Logger dMsg = Logger.getLogger(QueryRecordJsonParseService.class.getName());

    @Resource
    private WhereConditionJsonParseService whereConditionJsonParseService;
    @Resource
    private DatabasePropertyService databasePropertyService;
    private boolean isMultiTable;
    @Resource
    private QueryTableFieldService queryTableFieldService;
    public QueryCondition parseQueryRecordJson(String queryRecordJson, String tableName, String database) throws OrmException {

        try {
            isMultiTable = queryTableFieldService.isMutilTable(tableName, database);
            return analyzeQueryRecordJson(new ObjectMapper().readTree(queryRecordJson), tableName);
        } catch (JsonProcessingException e) {
            dMsg.error(e.getMessage());
            throw new OrmException(e);
        } catch (IOException e) {
            dMsg.error(e.getMessage());
            throw new OrmException(e);
        }
    }

    private QueryCondition analyzeQueryRecordJson(JsonNode queryRecordJson, String tableName) throws OrmException {
        QueryCondition queryEntry = new QueryCondition();

        queryEntry.setFields(parseColumnsNode(queryRecordJson));

        if (queryRecordJson.has(QueryRecordJsonKeyConstant.KEY_CONDITION)) {
            queryEntry.setWhereCondition(whereConditionJsonParseService.parseWhereConditionJson(queryRecordJson.get(QueryRecordJsonKeyConstant.KEY_CONDITION), tableName, isMultiTable));
        }

        if (queryRecordJson.has(QueryRecordJsonKeyConstant.KEY_HAVING)){
            queryEntry.setHavingCondition(whereConditionJsonParseService.parseWhereConditionJson(queryRecordJson.get(QueryRecordJsonKeyConstant.KEY_HAVING),tableName,isMultiTable));
        }

        queryEntry.setOrders(parseOrdersNode(queryRecordJson));
        queryEntry.setGroups(parseGroupsNode(queryRecordJson));
        queryEntry.setDistinct(parseDistinctNode(queryRecordJson));

        return queryEntry;
    }

    private boolean parseDistinctNode(JsonNode node) {
        return parseBooleanAttribute(node, QueryRecordJsonKeyConstant.KEY_ISDISTINCT, false);
    }

    private List<Field> parseColumnsNode(JsonNode node) {
        if (node.has(QueryRecordJsonKeyConstant.KEY_COLUMNS) == false) {
            return new ArrayList<Field>();
        }
        JsonNode columnsNode = node.get(QueryRecordJsonKeyConstant.KEY_COLUMNS);
        List<Field> fiedlList = new ArrayList<Field>();
        Iterator<JsonNode> iterator = columnsNode.iterator();
        while (iterator.hasNext()) {
            JsonNode columnJson = iterator.next();
            String cname = parseStringAttribute(columnJson, QueryRecordJsonKeyConstant.KEY_CNAME);
            if (cname == null) {
                continue;
            }
            Field field = getField(cname);
            Function function = parseFunction(columnJson, field);
            if (function != null) {
                field = new FunctionField(function, field);
            }
            if (fiedlList.contains(field) == false) {
                fiedlList.add(field);
            }
        }
        return fiedlList;
    }

    private Function parseFunction(JsonNode node, Field field) {
        if (node.has(QueryRecordJsonKeyConstant.KEY_COLUMNS_FUNCTION) == false) {
            return null;
        }
        JsonNode functionNode = node.get(QueryRecordJsonKeyConstant.KEY_COLUMNS_FUNCTION);
        String functionName = parseStringAttribute(functionNode, QueryRecordJsonKeyConstant.KEY_COLUMNS_FUNCTION_NAME);
        if (StringUtils.isBlank(functionName)) {
            return null;
        }
        String alias = field.getName();
        String functionAlias = parseStringAttribute(functionNode, QueryRecordJsonKeyConstant.KEY_COLUMNS_FUNCTION_ALIAS);
        if(StringUtils.isNotBlank(functionAlias)){
            alias = functionAlias;
        }
        List<IFunctionParameter> parameterList = new ArrayList<IFunctionParameter>();
        int i = 1;
        while (true) {
            String parameter = parseStringAttribute(functionNode, QueryRecordJsonKeyConstant.KEY_COLUMNS_FUNCTION_PARAMETER + i);
            if (StringUtils.isBlank(parameter)) {
                break;
            }
            parameterList.add(getField(parameter));
            i++;
        }
        if (parameterList.isEmpty()) {
            parameterList.add(field);
        }

        return new Function(functionName, alias, parameterList.toArray(new IFunctionParameter[parameterList.size()]));
    }

    private String parseStringAttribute(JsonNode node, String attribute) {
        if (node.has(attribute) == false) {
            return null;
        }
        JsonNode attributeNode = node.get(attribute);
        if (attributeNode.isNull() || attributeNode.asText().isEmpty()) {
            return null;
        }
        return attributeNode.asText();
    }

    private boolean parseBooleanAttribute(JsonNode node, String attribute, boolean defaultBoolean) {
        if (!node.has(attribute)) {
            return defaultBoolean;
        }
        JsonNode distinctNode = node.get(attribute);
        if (distinctNode.isNull() || distinctNode.asText().isEmpty()) {
            return defaultBoolean;
        }
        return distinctNode.asBoolean();
    }

    private List<String> parseAttributeArray(JsonNode node, String attribute, boolean unique) {
        if (node.has(attribute) == false) {
            return new ArrayList<String>();
        }
        JsonNode attributeNode = node.get(attribute);
        List<String> attributeList = new ArrayList<String>();
        Iterator<JsonNode> iterator = attributeNode.iterator();
        while (iterator.hasNext()) {
            JsonNode jsonNode = iterator.next();
            String text = jsonNode.asText();
            if (jsonNode.isNull() || text.isEmpty()) {
                continue;
            }
            if (unique && attributeList.contains(text)) {
                continue;
            }
            attributeList.add(text);
        }
        return attributeList;
    }

    private List<Order> parseOrdersNode(JsonNode node) {
        if (node.has(QueryRecordJsonKeyConstant.KEY_ORDERS) == false) {
            return new ArrayList<Order>();
        }
        JsonNode ordersJson = node.get(QueryRecordJsonKeyConstant.KEY_ORDERS);
        List<Order> queryOrders = new ArrayList<Order>();
        Iterator<JsonNode> queryOrderJsonNodes = ordersJson.iterator();
        while (queryOrderJsonNodes.hasNext()) {
            queryOrders.add(parseOrderNode(queryOrderJsonNodes.next()));
        }
        return queryOrders;
    }

    private List<Group> parseGroupsNode(JsonNode node) {
        List<String> groupAttributeList = parseAttributeArray(node, QueryRecordJsonKeyConstant.KEY_GROUPS, true);
        List<Group> groupList = new ArrayList<Group>();
        for (String groupAttribute : groupAttributeList) {
            groupList.add(new Group(getField(groupAttribute)));
        }
        return groupList;
    }

    private Order parseOrderNode(JsonNode orderNode) {
        Order queryOrder = new Order();
        Iterator<Entry<String, JsonNode>> queryOrderfieldsIterator = orderNode.fields();
        while (queryOrderfieldsIterator.hasNext()) {
            Entry<String, JsonNode> jqueryOrderfieldEntry = queryOrderfieldsIterator.next();
            if ((null != jqueryOrderfieldEntry.getKey() && !jqueryOrderfieldEntry.getKey().isEmpty())
                    && (!jqueryOrderfieldEntry.getValue().isNull() && !jqueryOrderfieldEntry.getValue().asText().isEmpty())) {
                if (QueryRecordJsonKeyConstant.KEY_FIELD.equals(jqueryOrderfieldEntry.getKey())) {
                    queryOrder.setField(getField(jqueryOrderfieldEntry.getValue().asText()));
                }

                if (QueryRecordJsonKeyConstant.ORDER_ASC.equalsIgnoreCase(jqueryOrderfieldEntry.getValue().asText())) {
                    queryOrder.setOrder(Order.ORDER_ASC);
                } else if (QueryRecordJsonKeyConstant.ORDER_DESC.equalsIgnoreCase(jqueryOrderfieldEntry.getValue().asText())) {
                    queryOrder.setOrder(Order.ORDER_DESC);
                }
            }
        }
        return queryOrder;
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
