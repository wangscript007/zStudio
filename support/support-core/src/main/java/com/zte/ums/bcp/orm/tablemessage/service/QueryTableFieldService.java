package com.zte.ums.bcp.orm.tablemessage.service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;

public interface QueryTableFieldService {
    ResponseInfo getTableField(String tableName, String databaseName);
    boolean isMutilTable(String tableName, String database) throws OrmException;
}
