package com.zte.ums.bcp.orm.tablemessage.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.zte.dataservice.mongoextension.dao.MongoMetaDataHelper;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.response.entry.QueryTableFieldResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseInfo;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import org.apache.log4j.Logger;

@Service(value="queryTableFieldService")
public class MongoQueryTableFieldService implements QueryTableFieldService {
    private static final Logger dMsg = Logger.getLogger(MongoQueryTableFieldService.class.getName());
    @Resource
    private MongoMetaDataHelper mongoMetaDataHelper;

    public ResponseInfo getTableField(String tableName, String databaseName) {
        List<LinkedHashMap<String, Object>> list = new ArrayList<LinkedHashMap<String, Object>>();
        try {
            list = mongoMetaDataHelper.queryTableField(tableName, databaseName);
            return new QueryTableFieldResponseInfo(ResponseStatus.STATUS_SUCCESS, QueryTableFieldResponseInfo.DEFAULT_SUCCESS_MESSAGE, list);
        } catch (OrmException e) {
            // TODO Auto-generated catch block
            return new ResponseInfo(ResponseStatus.STATUS_FAIL, e.getLocalizedMessage());
        }
    }

    @Override
    public boolean isMutilTable(String tableName, String database) throws OrmException {
        // TODO Auto-generated method stub
        return false;
    }
}
