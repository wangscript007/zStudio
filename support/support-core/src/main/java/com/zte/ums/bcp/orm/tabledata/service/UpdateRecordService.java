package com.zte.ums.bcp.orm.tabledata.service;

import java.util.Map;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;

public interface UpdateRecordService {
    Map<String, Object> updateRecord(RequestUpdateRecord requestUpdateRecord) throws OrmException;

	Map<String, Object> execute(String sql, String db) throws Exception;
}
