package com.zte.ums.bcp.orm.framework.sql.service;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.condition.QueryCondition;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Field;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.metadata.Order;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.sql.keyword.MsSqlKeyword;
import com.zte.ums.bcp.orm.framework.sql.keyword.MsSqlTableOrFieldKeyword;
import com.zte.ums.bcp.orm.framework.sql.keyword.PublicKeyword;
import com.zte.ums.bcp.orm.tablemessage.service.QueryTableFieldService;
import org.apache.log4j.Logger;

@Service(value = "querySqlSplicingService")
public class MsSqlQuerySqlSplicingService extends AbstractQuerySqlSplicingService {
    private static final Logger dmsg = Logger.getLogger(MsSqlQuerySqlSplicingService.class.getName());
    @Resource
    private QueryTableFieldService queryTableFieldService;
    
    public String splicingQuerySql(RequestQueryRecord requestQueryRecord) throws OrmException {
        if (isVaildRecord(requestQueryRecord) == false) {
            return "";
        }
        if (requestQueryRecord.getLimit() > 0) {
            return getQueryPageSql(requestQueryRecord);
        }
        return getQuerySql(requestQueryRecord.getQueryCondition(), requestQueryRecord.getTableName(), requestQueryRecord.getDatabaseName(), true).toString();
    }
    
    private String getQueryPageSql(RequestQueryRecord requestQueryRecord) throws OrmException {
        StringBuilder queryPageSql = new StringBuilder();
        StringBuilder tableNameInner = new StringBuilder();
        tableNameInner.append(MsSqlTableOrFieldKeyword.TABLE_TABLE);
        tableNameInner.append("_");
        tableNameInner.append(new Date().getTime());
        QueryCondition queryCondition = requestQueryRecord.getQueryCondition();
        queryPageSql.append(PublicKeyword.KEY_SELECT);
        queryPageSql.append(" ");
        queryPageSql.append(getTableFieldsASFieldNamesSql(queryCondition.getFields()));
        queryPageSql.append(" ");
        queryPageSql.append(PublicKeyword.KEY_FROM);
        queryPageSql.append(" ");
        queryPageSql.append("(");
        queryPageSql.append(PublicKeyword.KEY_SELECT);
        queryPageSql.append(" ");
        queryPageSql.append(MsSqlKeyword.KEY_ROW_NUMBER);
        queryPageSql.append("()");
        queryPageSql.append(" ");
        queryPageSql.append(MsSqlKeyword.KEY_OVER);
        queryPageSql.append(" ");
        queryPageSql.append("(");
        queryPageSql.append(splicingAsFieldsOrdersSqlSegment(queryCondition.getOrders(), queryCondition.getFields()));
        queryPageSql.append(")");
        queryPageSql.append(" ");
        queryPageSql.append(PublicKeyword.KEY_AS);
        queryPageSql.append(" ");
        queryPageSql.append(MsSqlTableOrFieldKeyword.FIELD_ROWNUM);
        queryPageSql.append(",");
        queryPageSql.append(tableNameInner);
        queryPageSql.append(".*");
        queryPageSql.append(" ");
        queryPageSql.append(PublicKeyword.KEY_FROM);
        queryPageSql.append(" ");
        queryPageSql.append("(");
        queryPageSql.append(PublicKeyword.KEY_SELECT);
        queryPageSql.append(" ");
        if (queryCondition.isDistinct()) {
            queryPageSql.append(PublicKeyword.KEY_DISTINCT);
            queryPageSql.append(" ");
        }
        queryPageSql.append(splicingFieldsSqlSegment(queryCondition.getFields()));
        queryPageSql.append(" ");
        queryPageSql.append(splicingTableSqlSegment(requestQueryRecord.getTableName(), requestQueryRecord.getDatabaseName()));
        queryPageSql.append(" ");
        queryPageSql.append(splicingWhereConditionSqlSegment(queryCondition.getWhereCondition()));
        queryPageSql.append(")");
        queryPageSql.append(" ");
        queryPageSql.append(tableNameInner);
        queryPageSql.append(")");
        queryPageSql.append(" ");
        queryPageSql.append(tableNameInner);
        queryPageSql.append("_data");
        queryPageSql.append(" ");
        queryPageSql.append(PublicKeyword.KEY_WHERE);
        queryPageSql.append(" ");
        queryPageSql.append(MsSqlTableOrFieldKeyword.FIELD_ROWNUM);
        queryPageSql.append(" ");
        queryPageSql.append(PublicKeyword.KEY_BETWEEN);
        queryPageSql.append(" ");
        queryPageSql.append(requestQueryRecord.getOffset() + 1);
        queryPageSql.append(" ");
        queryPageSql.append(PublicKeyword.KEY_AND);
        queryPageSql.append(" ");
        queryPageSql.append(requestQueryRecord.getOffset() + requestQueryRecord.getLimit());
        
        return queryPageSql.toString();
    }

    private StringBuilder splicingAsFieldsOrdersSqlSegment(List<Order> orders, List<Field> fields) {
        StringBuilder ordersSqlSegment = new StringBuilder();
        ordersSqlSegment.append(PublicKeyword.KEY_ORDER_BY);
        ordersSqlSegment.append(" ");
        if (null != orders && !orders.isEmpty()) {
            for (int i = 0; i < orders.size(); i++) {
                Order order = orders.get(i);
                if (null != order && null != order.getField()) {
                    ordersSqlSegment.append(dbFieldHelper.getTableFieldASFieldName(order.getField()));
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
                ordersSqlSegment.append(dbFieldHelper.getTableFieldASFieldName(fields.get(0)));
                ordersSqlSegment.append(" ");
                ordersSqlSegment.append(PublicKeyword.KEY_ASC);
            }
        }
        return ordersSqlSegment;
    }

    private StringBuilder getTableFieldsASFieldNamesSql(List<Field> fields) {
        StringBuilder tableFieldASFieldNameSql = new StringBuilder();
        if (null != fields) {
            for (int i = 0; i < fields.size(); i++) {
                Field field = fields.get(i);
                if (null != field) {
                    tableFieldASFieldNameSql.append(dbFieldHelper.getTableFieldASFieldName(field));
                    if (i != (fields.size() - 1)) {
                        tableFieldASFieldNameSql.append(",");
                    }
                }
            }
        }
        return tableFieldASFieldNameSql;
    }
}