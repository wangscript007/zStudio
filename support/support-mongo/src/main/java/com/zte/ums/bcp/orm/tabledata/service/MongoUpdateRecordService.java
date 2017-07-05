package com.zte.ums.bcp.orm.tabledata.service;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.dataservice.mongoextension.dao.MongoCRUDHelper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestUpdateRecord;
import com.zte.ums.bcp.orm.utils.ResultUtils;
import org.apache.log4j.Logger;

@Service(value="updateRecordService")
public class MongoUpdateRecordService implements UpdateRecordService {
    private static final Logger dmsg = Logger.getLogger(MongoUpdateRecordService.class.getName());
    @Resource
    private MongoCRUDHelper mongoCRUDHelper;

    public Map<String, Object> updateRecord(RequestUpdateRecord requestUpdateRecord) throws OrmException {
        mongoCRUDHelper.updateRecord(requestUpdateRecord);
        return ResultUtils.returnSuccess();
    }

    public Map<String, Object> execute(String sql, String db) throws Exception {
        throw new UnsupportedOperationException("UpdateRecordService.execute() is not supported on MongoDB.");
    }
}
