package com.zte.ums.bcp.orm.tabledata.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import com.zte.ums.bcp.orm.constant.IJsonConstant;
import com.zte.ums.bcp.orm.exception.OrmException;
import com.zte.ums.bcp.orm.framework.request.entry.RequestQueryRecord;
import com.zte.ums.bcp.orm.framework.response.entry.ResponseStatus;
import com.zte.ums.bcp.orm.framework.sql.service.QuerySqlSplicingService;
import com.zte.ums.bcp.orm.framework.systemproperty.service.DatabasePropertyService;
import com.zte.ums.bcp.orm.tabledata.dao.GeneralMapper;
import com.zte.ums.bcp.orm.tablemessage.dao.MetaDataMapper;
import com.zte.ums.bcp.orm.tablemessage.service.AbstractTableMessageSqlService;
import com.zte.ums.bcp.orm.tablemessage.service.MultiTableUtilService;
import com.zte.ums.bcp.orm.tablemessage.service.QueryTableFieldService;
import com.zte.ums.bcp.orm.utils.ConstantUtils;
import com.zte.ums.bcp.orm.utils.SpringContextUtils;
import org.apache.log4j.Logger;

@Service(value="queryRecordService")
public class OrmQueryRecordService implements QueryRecordService {
    private static final Logger dmsg = Logger.getLogger(OrmQueryRecordService.class.getName());
    @Resource
    private GeneralMapper generalMapper;

    @Resource
    private MetaDataMapper metaDataMapper;

    @Resource
    private QueryTableFieldService queryTableFieldService;

    @Resource
    private DatabasePropertyService databasePropertyService;

    @Resource(name = "querySqlSplicingService")
    private QuerySqlSplicingService querySqlSplicingService;

    @Resource
    private SpringContextUtils springContextUtils;

    @Resource(name = "multiTableUtilService")
    private MultiTableUtilService multiTableUtilService;

    @Resource(name = "tableMessageSqlService")
    private AbstractTableMessageSqlService tableMessageSqlService;

    public Map<String, Object> queryRecord(RequestQueryRecord requestQueryRecord) throws OrmException {
        Map<String, Object> hashmap = new HashMap<String, Object>();
        hashmap.put(IJsonConstant.TOTAL, getCount(requestQueryRecord));
        hashmap.put(IJsonConstant.ROWS, getQueryRecord(requestQueryRecord));
        hashmap.put(ConstantUtils.STATUS, ResponseStatus.STATUS_SUCCESS);
        return hashmap;
    }

    private List<LinkedHashMap<String, String>> getQueryRecord(RequestQueryRecord requestQueryRecord) throws OrmException {
        String sql = querySqlSplicingService.splicingQuerySql(requestQueryRecord);
        List<LinkedHashMap<String, String>> result = new ArrayList<LinkedHashMap<String, String>>();
        if (StringUtils.isNotBlank(sql)) {
            try {
                String dbName = requestQueryRecord.getDatabaseName();
                boolean isMultiTable = multiTableUtilService.isValidMultTable(dbName);
                if (isMultiTable == true) {
                    if (StringUtils.isNotBlank(dbName) &&
                        isMultTableResource(requestQueryRecord.getTableName(), dbName)) {
                        generalMapper.insert("use " + dbName + ";");
                    }
                }
                result = generalMapper.selectBySql(sql);
            } catch (Exception e) {
                dmsg.error(e.getMessage(), e);
                throw new OrmException(e.getLocalizedMessage(), e.getCause());
            }
        }
        return result;
    }

    private int getCount(RequestQueryRecord requestQueryRecord) throws OrmException {
        String sql = querySqlSplicingService.splicingCountQuerySql(requestQueryRecord);
        if (StringUtils.isNotBlank(sql)) {
			try {
				String dbName = requestQueryRecord.getDatabaseName();
				boolean isMultiTable = multiTableUtilService
						.isValidMultTable(dbName);
				if (isMultiTable == true &&
					StringUtils.isNotBlank(dbName) &&
					isMultTableResource(requestQueryRecord.getTableName(), dbName)) {
					generalMapper.insert("use " + dbName + ";");
				}
				return generalMapper.selectCount(sql);
			} catch (Exception e) {
                dmsg.error(e.getMessage(), e);
                throw new OrmException(e.getLocalizedMessage(), e.getCause());
            }
        }
        return 0;
    }
    
    private boolean isMultTableResource(String tableName,String dbName) throws OrmException {
    	boolean isMulti = false;
        try {
			Map<String, String> multiTable = metaDataMapper.findResourceId(tableName, dbName);
            if (null != multiTable) {
                isMulti = true;
            }
        } catch (Exception e) {
            dmsg.error(e.getMessage(), e);
            throw new OrmException(e.getLocalizedMessage(), e.getCause());
        }
        return isMulti;
    }

	public Map<String, Object> execute(String sql, String db) throws Exception {
		if (StringUtils.isNotBlank(db)) {
			generalMapper.insert("use " + db + ";");
    	}
		List<LinkedHashMap<String, String>> result = generalMapper.selectBySql(sql);
		Map<String, Object> hashmap = new HashMap<String, Object>();
        hashmap.put(IJsonConstant.TOTAL, result.size());
        hashmap.put(IJsonConstant.ROWS, result);
        hashmap.put(ConstantUtils.STATUS, ResponseStatus.STATUS_SUCCESS);
		
		return hashmap;
	}
}
