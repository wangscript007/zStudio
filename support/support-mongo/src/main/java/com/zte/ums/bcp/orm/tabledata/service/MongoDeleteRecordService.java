package com.zte.ums.bcp.orm.tabledata.service;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.dataservice.mongoextension.dao.MongoCRUDHelper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestDeleteRecord;
import com.zte.ums.bcp.orm.utils.ResultUtils;
import org.apache.log4j.Logger;

@Service(value="deleteRecordService")
public class MongoDeleteRecordService implements DeleteRecordService {
    private static final Logger dMsg = Logger.getLogger(MongoDeleteRecordService.class.getName());
    @Resource
    private MongoCRUDHelper mongoCRUDHelper;

    public Map<String, Object> deleteRecord(RequestDeleteRecord requestDeleteRecord) throws OrmException {
        try {
            mongoCRUDHelper.deleteRecord(requestDeleteRecord);
        } catch (Exception e) {
            throw new OrmException(e.getLocalizedMessage(), e.getCause());
        }
        return ResultUtils.returnSuccess();
    }

    public Map<String, Object> execute(String sql, String db) throws Exception {
        throw new UnsupportedOperationException("DeleteRecordService.execute() is not supported on MongoDB.");
    }
}
