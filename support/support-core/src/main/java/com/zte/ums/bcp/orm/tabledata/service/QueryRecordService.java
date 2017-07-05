package com.zte.ums.bcp.orm.tabledata.service;

import java.util.Map;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;

public interface QueryRecordService {
	Map<String, Object> queryRecord(RequestQueryRecord requestQueryRecord) throws OrmException;

	Map<String, Object> execute(String sql, String db) throws Exception;
}
