package com.zte.ums.bcp.orm.framework.request.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.service.QueryRecordJsonParseService;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;

@Service
public class RequestQueryRecordService {
    
    @Resource
    private QueryRecordJsonParseService queryRecordJsonParseService;

    public RequestQueryRecord getRequestQueryRecord(String tableName, String limit, String offset, String queryRecordJson, String database) throws OrmException {
        
        RequestQueryRecord requestQueryRecord = new RequestQueryRecord();
        requestQueryRecord.setTableName(tableName);
        if (null != offset && !offset.isEmpty()) {
            requestQueryRecord.setOffset(Integer.valueOf(offset));
        }
        
        if (null != limit && !limit.isEmpty()) {
            requestQueryRecord.setLimit(Integer.valueOf(limit));
        }
        
        if (null != database && !database.isEmpty()) {
            requestQueryRecord.setDatabaseName(database);
        } else {
            requestQueryRecord.setDatabaseName("");
        }
        
        requestQueryRecord.setQueryCondition(queryRecordJsonParseService.parseQueryRecordJson(queryRecordJson, tableName, database));
        
        return requestQueryRecord;
    }
}
