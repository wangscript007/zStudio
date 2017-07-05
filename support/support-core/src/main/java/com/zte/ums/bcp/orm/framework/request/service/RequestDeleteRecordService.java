package com.zte.ums.bcp.orm.framework.request.service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.json.requestjsonparse.service.DeleteRecordJsonParseService;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;

@Service
public class RequestDeleteRecordService {
    
    @Resource
    private DeleteRecordJsonParseService deleteRecordJsonParseService;
    
    public RequestDeleteRecord getRequestDeleteRecord(HttpServletRequest request, String tableName, String deleteConditionJson) throws OrmException {
        
        RequestDeleteRecord requestDeleteRecord = new RequestDeleteRecord();
        requestDeleteRecord.setTableName(tableName);
        //requestDeleteRecord.setSimpleWhereCondition(deleteRecordJsonParseService.parseDeleteRecordJson(deleteConditionJson));
        requestDeleteRecord.setWhereCondition(deleteRecordJsonParseService.parseDeleteRecordJson(deleteConditionJson));
        
        requestDeleteRecord.setDatabaseName(deleteRecordJsonParseService.parseDataBaseJson(request, deleteConditionJson));
        return requestDeleteRecord;
    }
}
