package com.zte.ums.bcp.orm.framework.request.service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.service.UpdateRecordJsonParseService;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;

@Service
public class RequestUpdateRecordService {
    
    @Resource
    private UpdateRecordJsonParseService updateRecordJsonParseService;
    
    public RequestUpdateRecord getRequestUpdateRecord(HttpServletRequest request, String tableName, String updateRecordJson) throws OrmException {
        
        RequestUpdateRecord requestUpdateRecord = new RequestUpdateRecord();
        requestUpdateRecord.setTableName(tableName);
        requestUpdateRecord.setUpdateConditions(updateRecordJsonParseService.parseUpdateRecordJson(updateRecordJson));
        
        requestUpdateRecord.setDatabaseName(updateRecordJsonParseService.parseDataBaseJson(request, updateRecordJson));
        
        
        return requestUpdateRecord;
    }
}
