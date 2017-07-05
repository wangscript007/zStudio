package com.zte.ums.bcp.orm.framework.sql.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.QueryCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.WhereCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Group;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Order;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicKeyword;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicTableOrFieldKeyword;
import com.zte.ums.bcp.orm.framework.sql.util.DBHelper;
import com.zte.ums.bcp.orm.framework.sql.util.DBTableFieldHelper;
import com.zte.ums.bcp.orm.framework.sql.util.DBTableNameHelper;
import com.zte.ums.bcp.orm.tablemessage.dao.MetaDataMapper;
import com.zte.ums.bcp.orm.tablemessage.service.AbstractTableMessageSqlService;
import com.zte.ums.bcp.orm.tablemessage.service.MultiTableUtilService;

import org.apache.log4j.Logger;

public abstract class AbstractQuerySqlSplicingService implements QuerySqlSplicingService {
    static final Logger dmsg = Logger.getLogger(AbstractQuerySqlSplicingService.class.getName());
    @Resource
    private WhereContionSqlSplicingService whereContionSqlSplicingService;
    @Resource
    private MetaDataMapper metaDataMapper;
    @Resource
    protected DBTableFieldHelper dbFieldHelper;
    @Resource
    protected DBTableNameHelper dbTableNameHelper;
    @Resource(name = "tableMessageSqlService")
    private AbstractTableMessageSqlService tableMessageSqlService;
    @Resource(name = "multiTableUtilService")
    private MultiTableUtilService multiTableUtilService;
    @Resource(name = "dbHelper")
    private DBHelper dbHelper;

    public String splicingCountQuerySql(RequestQueryRecord requestQueryRecord) throws OrmException {
        if (isVaildRecord(requestQueryRecord) == false) {
            return "";
        }
        StringBuilder countQuerySql = new StringBuilder();
        countQuerySql.append(PublicKeyword.KEY_SELECT);
        countQuerySql.append(" ");
        countQuerySql.append(PublicKeyword.KEY_COUNT);
        countQuerySql.append("(*)");
        countQuerySql.append(" ");
        countQuerySql.append(PublicKeyword.KEY_AS);
        countQuerySql.append(" ");
        countQuerySql.append(PublicTableOrFieldKeyword.FIELD_COUNT);
        countQuerySql.append(" ");
        countQuerySql.append(PublicKeyword.KEY_FROM);
        countQuerySql.append(" ");
        countQuerySql.append("(");
        countQuerySql.append(getQuerySql(requestQueryRecord.getQueryCondition(), requestQueryRecord.getTableName(), requestQueryRecord.getDatabaseName(), false));
        countQuerySql.append(")");
        countQuerySql.append(" ");
        countQuerySql.append(PublicTableOrFieldKeyword.TABLE_COUNT_TABLE);
        countQuerySql.append("_");
        countQuerySql.append(new Date().getTime());
    
        return countQuerySql.toString();
    }

    protected boolean isVaildRecord(RequestQueryRecord requestQueryRecord) {
        if (requestQueryRecord == null) {
            return false;
        }
        QueryCondition queryCondition = requestQueryRecord.getQueryCondition();
        if (queryCondition == null) {
            return false;
        }
        String tableName = requestQueryRecord.getTableName();
        if (StringUtils.isBlank(tableName)) {
            return false;
        }
        List<Field> fields = queryCondition.getFields();
        if (null == fields || fields.isEmpty()) {
            return false;
        }
        return true;
    }

    protected StringBuilder splicingWhereConditionSqlSegment(WhereCondition whereCondition) {
        StringBuilder whereConditionSqlSegment = new StringBuilder();
        whereConditionSqlSegment.append(whereContionSqlSplicingService.splicingWhereContionSql(whereCondition));
        return whereConditionSqlSegment;
    }

    protected Map<String, String> getMultTableResource(String tableName, String dataBaseName) throws OrmException {
        try {
            return metaDataMapper.findResourceId(tableName, dataBaseName);
        } catch (Exception e) {
            dmsg.error(e.getMessage(), e);
            throw new OrmException(e.getLocalizedMessage(), e);
        }
    }

    protected StringBuilder getQuerySql(QueryCondition queryCondition, String tableName, String databaseName, boolean isOrdered) throws OrmException {
        StringBuilder querySql = new StringBuilder();
    
        querySql.append(PublicKeyword.KEY_SELECT);
        if (queryCondition.isDistinct()) {
            querySql.append(" ").append(PublicKeyword.KEY_DISTINCT);
        }
        querySql.append(" ").append(splicingFieldsSqlSegment(queryCondition.getFields()));
        querySql.append(" ").append(splicingTableSqlSegment(tableName, databaseName));
        querySql.append(" ").append(splicingWhereConditionSqlSegment(queryCondition.getWhereCondition()));
        querySql.append(" ").append(splicingGroupsSqlSegment(queryCondition.getGroups()));
        querySql.append(" ").append(splicingHavingSqlSegment(queryCondition.getHavingCondition()));
        if (isOrdered) {
            StringBuilder ordersSqlSegment = splicingOrdersSqlSegment(queryCondition.getOrders(), queryCondition.getFields());
            if (ordersSqlSegment.length() > 0) {
                querySql.append(" ").append(ordersSqlSegment);
            }
        }
        return querySql;
    }

    protected StringBuilder splicingTableSqlSegment(String tableName, String databaseName) throws OrmException {
        StringBuilder tableSqlSegment = new StringBuilder();
        tableSqlSegment.append(PublicKeyword.KEY_FROM);
        tableSqlSegment.append(" ");
        boolean isValidMultiTable = multiTableUtilService.isValidMultTable(databaseName);
        boolean isMulti = false;
        if (isValidMultiTable == true) {
            Map<String, String> multiTable = getMultTableResource(tableName,databaseName);
            if (null != multiTable) {
                isMulti = true;
                tableName = multiTable.get("COMBINATIVE_TABLE");
            }
        }
        if (StringUtils.isNotBlank(databaseName)) {
            String fullTableName = dbTableNameHelper.getTableName(databaseName, tableName, isMulti);
            tableSqlSegment.append(fullTableName);
        } else {
            tableSqlSegment.append(tableName);
        }
        return tableSqlSegment;
    }

    protected StringBuilder splicingFieldsSqlSegment(List<Field> fields) {
        StringBuilder fieldsSqlSegment = new StringBuilder();
        if (null != fields) {
            for (int i = 0; i < fields.size(); i++) {
                Field field = fields.get(i);
                if (null != field) {
                    fieldsSqlSegment.append(dbFieldHelper.getTableFieldSql(field));
                    fieldsSqlSegment.append(" ");
                    fieldsSqlSegment.append(PublicKeyword.KEY_AS);
                    fieldsSqlSegment.append(" ");
                    fieldsSqlSegment.append(dbFieldHelper.getTableFieldASFieldName(field));
                    if (i != (fields.size() - 1)) {
                        fieldsSqlSegment.append(",");
                    }
                }
            }
        }
        return fieldsSqlSegment;
    }

    private StringBuilder splicingOrdersSqlSegment(List<Order> orders, List<Field> fields) {
        StringBuilder ordersSqlSegment = new StringBuilder();
        ordersSqlSegment.append(PublicKeyword.KEY_ORDER_BY);
        ordersSqlSegment.append(" ");
        if (null != orders && !orders.isEmpty()) {
            for (int i = 0; i < orders.size(); i++) {
                Order order = orders.get(i);
                if (null != order && null != order.getField()) {
                    ordersSqlSegment.append(dbFieldHelper.getTableFieldSql(order.getField()));
                    ordersSqlSegment.append(" ");
                    if (order.getOrder() == Order.ORDER_ASC) {
                        ordersSqlSegment.append(PublicKeyword.KEY_ASC);
                    } else if (order.getOrder() == Order.ORDER_DESC) {
                        ordersSqlSegment.append(PublicKeyword.KEY_DESC);
                    }
                    if (i != (orders.size() - 1)) {
                        ordersSqlSegment.append(",");
                    }
                }
            }
        } else {
            if (null != fields && !fields.isEmpty()) {
                ordersSqlSegment.append(dbFieldHelper.getTableFieldSql(fields.get(0)));
                ordersSqlSegment.append(" ");
                ordersSqlSegment.append(PublicKeyword.KEY_ASC);
            }
        }
        return ordersSqlSegment;
    }

    private String splicingGroupsSqlSegment(List<Group> groupList) {
        if (CollectionUtils.isEmpty(groupList)) {
            return "";
        }
        String sql = "group by ";
        for (Group group : groupList) {
            sql = sql + dbHelper.getFieldName(group.getName()) + ",";
        }
        return sql.substring(0, (sql.length() - 1));
    }

    private String splicingHavingSqlSegment(WhereCondition havingCondition) {
        return whereContionSqlSplicingService.splicingHavingContionSql(havingCondition);
    }
}
