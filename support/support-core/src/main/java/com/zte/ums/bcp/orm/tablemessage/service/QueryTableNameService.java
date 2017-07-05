package com.zte.ums.bcp.orm.tablemessage.service;

import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;

public interface QueryTableNameService {
    ResponseInfo getTableName(String database);
}
