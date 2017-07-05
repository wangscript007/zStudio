package com.zte.ums.bcp.orm.tabledata.service;

import java.util.Map;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;

public interface AddRecordService {
    Map<String, Object> addRecord(RequestAddRecord requestAddRecord) throws OrmException;

    Map<String, Object> execute(String sql, String db) throws Exception;
}
