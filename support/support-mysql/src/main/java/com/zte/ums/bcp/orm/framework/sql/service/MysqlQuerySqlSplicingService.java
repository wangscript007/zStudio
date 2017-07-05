package com.zte.ums.bcp.orm.framework.sql.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.sql.keyword.MySqlKeyword;
import com.zte.ums.bcp.orm.tablemessage.service.QueryTableFieldService;

@Service(value = "querySqlSplicingService")
public class MysqlQuerySqlSplicingService extends AbstractQuerySqlSplicingService {
    @Resource
    private QueryTableFieldService queryTableFieldService;

    public String splicingQuerySql(RequestQueryRecord requestQueryRecord) throws OrmException {
        if (isVaildRecord(requestQueryRecord) == false) {
            return "";
        }
        StringBuilder queryFullSql = new StringBuilder();
        StringBuilder querySql = getQuerySql(requestQueryRecord.getQueryCondition(), requestQueryRecord.getTableName(), requestQueryRecord.getDatabaseName(), true);
        queryFullSql.append(querySql);
        if (requestQueryRecord.getLimit() > 0) {
            queryFullSql.append(" ");
            StringBuilder splicingLimitSqlSegment = splicingLimitSqlSegment(requestQueryRecord.getLimit(), requestQueryRecord.getOffset());
            queryFullSql.append(splicingLimitSqlSegment);
        }

        return queryFullSql.toString();
    }

    private StringBuilder splicingLimitSqlSegment(int limit, int offset) {
        StringBuilder limitSqlSegment = new StringBuilder();

        if (limit > 0) {
            limitSqlSegment.append(MySqlKeyword.KEY_LIMIT);
            limitSqlSegment.append(" ");
            limitSqlSegment.append(offset);
            limitSqlSegment.append(",");
            limitSqlSegment.append(limit);
        }

        return limitSqlSegment;
    }
}
