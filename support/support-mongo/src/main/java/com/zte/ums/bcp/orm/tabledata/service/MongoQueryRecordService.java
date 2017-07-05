package com.zte.ums.bcp.orm.tabledata.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.dataservice.mongoextension.dao.MongoCRUDHelper;
import com.zte.ums.bcp.orm.constant.IJsonConstant;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.utils.ConstantUtils;
import org.apache.log4j.Logger;

@Service(value="queryRecordService")
public class MongoQueryRecordService implements QueryRecordService {
    private static final Logger dmsg = Logger.getLogger(MongoQueryRecordService.class.getName());
    @Resource
    private MongoCRUDHelper mongoCRUDHelper;

    public Map<String, Object> queryRecord(RequestQueryRecord requestQueryRecord) throws OrmException {
        Map<String, Object> hashmap = new HashMap<String, Object>();
        hashmap.put(IJsonConstant.TOTAL, getCount(requestQueryRecord));
        hashmap.put(IJsonConstant.ROWS, getQueryRecord(requestQueryRecord));
        hashmap.put(ConstantUtils.STATUS, ResponseStatus.STATUS_SUCCESS);
        return hashmap;
    }

    private List<LinkedHashMap<String, String>> getQueryRecord(RequestQueryRecord requestQueryRecord) throws OrmException {
        return mongoCRUDHelper.queryRecord(requestQueryRecord);
    }

    private int getCount(RequestQueryRecord requestQueryRecord) throws OrmException {
        return mongoCRUDHelper.getCount(requestQueryRecord);
    }

    public Map<String, Object> execute(String sql, String db) throws Exception {
        throw new UnsupportedOperationException("QueryRecordService.execute() is not supported on MongoDB.");
    }
}
