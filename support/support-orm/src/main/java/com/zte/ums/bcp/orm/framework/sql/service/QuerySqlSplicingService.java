package com.zte.ums.bcp.orm.framework.sql.service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;

public interface QuerySqlSplicingService {
    String splicingQuerySql(RequestQueryRecord requestQueryRecord) throws OrmException;

    String splicingCountQuerySql(RequestQueryRecord requestQueryRecord) throws OrmException;
}
