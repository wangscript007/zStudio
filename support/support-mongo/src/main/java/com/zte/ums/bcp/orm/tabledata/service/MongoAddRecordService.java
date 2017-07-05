package com.zte.ums.bcp.orm.tabledata.service;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.dataservice.mongoextension.dao.MongoCRUDHelper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestAddRecord;
import com.zte.ums.bcp.orm.utils.ResultUtils;
import org.apache.log4j.Logger;

@Service(value="addRecordService")
public class MongoAddRecordService implements AddRecordService {
    @Resource
    private MongoCRUDHelper mongoCRUDHelper;

    private static final Logger dMsg = Logger.getLogger(MongoAddRecordService.class.getName());

    public Map<String, Object> addRecord(RequestAddRecord requestAddRecord) throws OrmException {
        Map<String, Object> priKeyValMap = new LinkedHashMap<String, Object>();
        priKeyValMap.put("_id", mongoCRUDHelper.addRecored(requestAddRecord));
        return ResultUtils.insertSuccess(priKeyValMap);
    }

    @Override
    public Map<String, Object> execute(String sql, String db) throws Exception {
        throw new UnsupportedOperationException("AddRecordService.execute() is not supported on MongoDB.");
    }
}
